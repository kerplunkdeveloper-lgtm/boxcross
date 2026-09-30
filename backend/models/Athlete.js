const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const athleteSchema = new mongoose.Schema(
  {
    athleteName: {
      type: String,
      required: [true, "Athlete / User Name is required"],
      trim: true,
    },
    memberId: {
      type: String,
      required: [true, "Member ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters long"],
      default: "boxcross123",
    },
    initialPassword: {
      type: String,
      default: "boxcross123",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be realistic"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Others"],
    },
    dateOfJoining: {
      type: Date,
      required: [true, "Date of Joining is required"],
      default: Date.now,
    },
    coach: {
      type: String,
      required: [true, "Coach is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    notes: {
      type: String,
      default: "",
    },
    biometricEnrolled: {
      type: Boolean,
      default: true,
    },
    biometricId: {
      type: String,
      default: "",
    },
    rfidCard: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
athleteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
athleteSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Athlete", athleteSchema);
