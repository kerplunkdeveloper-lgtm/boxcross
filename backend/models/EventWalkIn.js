const mongoose = require("mongoose");

const eventWalkInSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Attended",
    },
    notes: {
      type: String,
      default: "Walk-in via QR check-in",
    },
    timeline: [
      {
        time: { type: String },
        activity: { type: String },
        type: { type: String, default: "system" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventWalkIn", eventWalkInSchema);

