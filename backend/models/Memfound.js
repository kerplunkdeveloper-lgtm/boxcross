const mongoose = require("mongoose");

const memfoundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    trainedBefore: {
      type: String,
      enum: ["YES", "NO"],
      default: "NO",
    },
    whoIsThisFor: {
      type: String,
      enum: ["MYSELF", "MY CHILD", "BOTH"],
      default: "MYSELF",
    },
    plan: {
      type: String,
      enum: ["3 MONTHS", "6 MONTHS", "12 MONTHS", "NOT SURE YET"],
      default: "NOT SURE YET",
    },
    bestTimeToCall: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "EVENING", "ANYTIME", ""],
      default: "",
    },
    agreedToContact: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Converted", "Closed"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
    memberNumber: {
      type: Number,
    },
    memberId: {
      type: String,
      default: "",
    },
    assignedNumber: {
      type: String,
      default: "",
    },
    quotedRate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Memfound", memfoundSchema);
