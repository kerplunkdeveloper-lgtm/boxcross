const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: [true, "Athlete reference is required"],
      index: true,
    },
    athleteName: {
      type: String,
      required: [true, "Athlete name is required"],
      trim: true,
    },
    memberId: {
      type: String,
      required: [true, "Member ID is required"],
      trim: true,
      uppercase: true,
      index: true,
    },
    coach: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Attendance date (YYYY-MM-DD) is required"],
      index: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      default: "Present",
      index: true,
    },
    checkInTime: {
      type: String,
      default: "",
    },
    checkInDate: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: "",
    },
    checkOutDate: {
      type: Date,
      default: null,
    },
    method: {
      type: String,
      enum: ["Biometric", "Manual", "RFID", "FaceID", "QR"],
      default: "Manual",
      index: true,
    },
    batch: {
      type: String,
      enum: ["Morning", "Evening", "General", "Hyrox", "All"],
      default: "General",
    },
    sessionName: {
      type: String,
      default: "General Training",
    },
    deviceInfo: {
      terminalId: {
        type: String,
        default: "BXC-TERMINAL-01",
      },
      deviceName: {
        type: String,
        default: "BioSync-X1 Biometric Reader",
      },
      location: {
        type: String,
        default: "Main Entrance Turnstile",
      },
      verifiedScore: {
        type: Number,
        default: 99.2,
      },
    },
    markedBy: {
      type: String,
      default: "Admin",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch athlete attendance on a given day
attendanceSchema.index({ athlete: 1, date: 1 });
attendanceSchema.index({ date: 1, batch: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
