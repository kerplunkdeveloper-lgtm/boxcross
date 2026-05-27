const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, since users can also book as guest or Google user
    },
    eventName: {
      type: String,
      required: [true, "Event name is required"],
    },
    eventDate: {
      type: String,
      required: [true, "Event date is required"],
    },
    eventTime: {
      type: String,
      required: [true, "Event time is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
    },
    personCount: {
      type: Number,
      required: [true, "Number of persons is required"],
      min: [1, "At least one ticket is required"],
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);
