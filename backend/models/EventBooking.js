const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
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
      default: "not payment",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: "razorpay",
    },
    paymentScreenshot: {
      type: String,
    },
    paymentScreenshotPublicId: {
      type: String,
    },
    lastContact: {
      type: String,
      default: "",
    },
    nextFollowUp: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    timeline: [
      {
        time: { type: String },
        activity: { type: String },
        type: { type: String, default: "system" },
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);
