const mongoose = require("mongoose");

const eventBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required (image or video)"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required for deletion"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventBanner", eventBannerSchema);
