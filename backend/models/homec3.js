const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true
    },

    aboutus: {
      type: String,
      required: true,
    },


    message: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Homec3", contactSchema);