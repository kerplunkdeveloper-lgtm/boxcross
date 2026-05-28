const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      required: [true, "Event price is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Event image is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    bookingLink: {
      type: String,
      default: "#",
      trim: true,
    },
    schedules: [
      {
        date: {
          type: String,
          required: [true, "Schedule date is required"],
        },
        timeSlots: [
          {
            time: {
              type: String,
              required: [true, "Slot time is required"],
            },
            slots: {
              type: Number,
              default: 20,
            },
            booked: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
