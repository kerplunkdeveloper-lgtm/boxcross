const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true
    },
    planName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    durationMonths: {
      type: Number,
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      default: "UPI"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
