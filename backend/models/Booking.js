const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    goal: {
      type: String,
      required: [true, "Fitness goal is required"],
      enum: [
        "Weight Loss",
        "Muscle Gain",
        "Strength Training",
        "Fat Burn",
        "Athletic Performance",
        "General Fitness",
      ],
    },
    day: {
      type: Number,
      required: [true, "Day is required"],
      min: 1,
      max: 31,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      enum: [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December",
      ],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
