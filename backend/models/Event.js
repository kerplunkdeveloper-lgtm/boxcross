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
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    termsAndConditions: {
      type: [String],
      default: [],
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
    category: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    calories: {
      type: String,
      default: "",
    },
    benefits: {
      type: [String],
      default: [],
    },
    agenda: [
      {
        title: {
          type: String,
          required: [true, "Agenda title is required"],
        },
        duration: {
          type: String,
          required: [true, "Agenda duration is required"],
        },
        color: {
          type: String,
          default: "green",
        },
      },
    ],
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
    paymentMethods: {
      type: [String],
      enum: ["razorpay", "barcode"],
      default: ["razorpay"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
