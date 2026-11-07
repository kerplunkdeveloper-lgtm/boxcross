const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema(
  {
    // Desktop Media
    desktopMediaUrl: {
      type: String,
      required: [true, "Desktop media URL or file is required"],
    },
    desktopMediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "video",
    },
    desktopPublicId: {
      type: String,
      default: "",
    },
    // Mobile Media (Optional - defaults to desktop media if not provided)
    mobileMediaUrl: {
      type: String,
      default: "",
    },
    mobileMediaType: {
      type: String,
      enum: ["image", "video"],
      default: "video",
    },
    mobilePublicId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
