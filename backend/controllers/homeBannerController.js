const HomeBanner = require("../models/HomeBanner");
const cloudinary = require("../config/cloudinary");
const { uploadToS3, deleteFromS3, isS3Key } = require("../config/s3Upload");

// Upload helper for S3
const uploadMediaToS3 = async (fileBuffer, mimetype, originalname = "") => {
  return await uploadToS3(fileBuffer, mimetype, "boxcross_home_banners", originalname);
};

// Smart delete: handles S3 (new) or Cloudinary (legacy)
const deleteMediaFile = async (publicId, mediaType) => {
  if (!publicId) return;
  if (isS3Key(publicId)) {
    try {
      await deleteFromS3(publicId);
    } catch (err) {
      console.error("S3 Deletion Error:", err.message);
    }
  } else {
    const resourceType = mediaType === "video" ? "video" : "image";
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error("Cloudinary Deletion Error:", error.message);
    }
  }
};

// @desc    Get active home banners (Public)
// @route   GET /api/home-banners
// @access  Public
const getActiveHomeBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Get Active Home Banners Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch home banners.",
    });
  }
};

// @desc    Get all home banners (Admin)
// @route   GET /api/home-banners/admin
// @access  Private/Admin
const getAllHomeBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Get All Home Banners Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch all home banners.",
    });
  }
};

// @desc    Create a new home banner (Media only: Video or Image for Desktop & Mobile)
// @route   POST /api/home-banners
// @access  Private/Admin
const createHomeBanner = async (req, res) => {
  try {
    const {
      desktopMediaUrl: bodyDesktopUrl,
      desktopMediaType: bodyDesktopType,
      mobileMediaUrl: bodyMobileUrl,
      mobileMediaType: bodyMobileType,
      isActive,
      order,
    } = req.body;

    const desktopFile =
      req.files?.desktopMedia?.[0] ||
      req.files?.media?.[0] ||
      (req.file ? req.file : null);
    const mobileFile = req.files?.mobileMedia?.[0];

    let desktopMediaUrl = bodyDesktopUrl || "";
    let desktopMediaType = bodyDesktopType || "video";
    let desktopPublicId = "";

    let mobileMediaUrl = bodyMobileUrl || "";
    let mobileMediaType = bodyMobileType || "video";
    let mobilePublicId = "";

    // 1. Process Desktop Media
    if (desktopFile) {
      const result = await uploadMediaToS3(
        desktopFile.buffer,
        desktopFile.mimetype,
        desktopFile.originalname
      );
      desktopMediaUrl = result.url;
      desktopPublicId = result.key;
      desktopMediaType = desktopFile.mimetype.startsWith("video/") ? "video" : "image";
    }

    if (!desktopMediaUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload or provide desktop media (video or image).",
      });
    }

    // 2. Process Mobile Media (if uploaded, else defaults to desktop media)
    if (mobileFile) {
      const mobileResult = await uploadMediaToS3(
        mobileFile.buffer,
        mobileFile.mimetype,
        mobileFile.originalname
      );
      mobileMediaUrl = mobileResult.url;
      mobilePublicId = mobileResult.key;
      mobileMediaType = mobileFile.mimetype.startsWith("video/") ? "video" : "image";
    } else if (!mobileMediaUrl) {
      // Fallback: Use desktop media if mobile not provided
      mobileMediaUrl = desktopMediaUrl;
      mobileMediaType = desktopMediaType;
      mobilePublicId = "";
    }

    const banner = await HomeBanner.create({
      desktopMediaUrl,
      desktopMediaType,
      desktopPublicId,
      mobileMediaUrl,
      mobileMediaType,
      mobilePublicId,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      message: "Home banner uploaded successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Create Home Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Could not upload home banner.",
    });
  }
};

// @desc    Update a home banner (Replace desktop or mobile media, or change active/order)
// @route   PUT /api/home-banners/:id
// @access  Private/Admin
const updateHomeBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await HomeBanner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    const {
      desktopMediaUrl: bodyDesktopUrl,
      desktopMediaType: bodyDesktopType,
      mobileMediaUrl: bodyMobileUrl,
      mobileMediaType: bodyMobileType,
      isActive,
      order,
    } = req.body;

    const desktopFile =
      req.files?.desktopMedia?.[0] ||
      req.files?.media?.[0] ||
      (req.file ? req.file : null);
    const mobileFile = req.files?.mobileMedia?.[0];

    const updateData = {
      ...(isActive !== undefined && {
        isActive: isActive === "true" || isActive === true,
      }),
      ...(order !== undefined && { order: Number(order) }),
    };

    // Update Desktop Media if new file or URL provided
    if (desktopFile) {
      if (banner.desktopPublicId) {
        await deleteMediaFile(banner.desktopPublicId, banner.desktopMediaType);
      }
      const result = await uploadMediaToS3(
        desktopFile.buffer,
        desktopFile.mimetype,
        desktopFile.originalname
      );
      updateData.desktopMediaUrl = result.url;
      updateData.desktopPublicId = result.key;
      updateData.desktopMediaType = desktopFile.mimetype.startsWith("video/") ? "video" : "image";
    } else if (bodyDesktopUrl) {
      updateData.desktopMediaUrl = bodyDesktopUrl;
      if (bodyDesktopType) updateData.desktopMediaType = bodyDesktopType;
    }

    // Update Mobile Media if new file or URL provided
    if (mobileFile) {
      if (banner.mobilePublicId && banner.mobilePublicId !== banner.desktopPublicId) {
        await deleteMediaFile(banner.mobilePublicId, banner.mobileMediaType);
      }
      const mobileResult = await uploadMediaToS3(
        mobileFile.buffer,
        mobileFile.mimetype,
        mobileFile.originalname
      );
      updateData.mobileMediaUrl = mobileResult.url;
      updateData.mobilePublicId = mobileResult.key;
      updateData.mobileMediaType = mobileFile.mimetype.startsWith("video/") ? "video" : "image";
    } else if (bodyMobileUrl) {
      updateData.mobileMediaUrl = bodyMobileUrl;
      if (bodyMobileType) updateData.mobileMediaType = bodyMobileType;
    }

    const updatedBanner = await HomeBanner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Home banner updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Update Home Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Could not update home banner.",
    });
  }
};

// @desc    Delete a home banner
// @route   DELETE /api/home-banners/:id
// @access  Private/Admin
const deleteHomeBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await HomeBanner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    // Delete desktop media from storage
    if (banner.desktopPublicId) {
      await deleteMediaFile(banner.desktopPublicId, banner.desktopMediaType);
    }

    // Delete mobile media from storage if distinct
    if (banner.mobilePublicId && banner.mobilePublicId !== banner.desktopPublicId) {
      await deleteMediaFile(banner.mobilePublicId, banner.mobileMediaType);
    }

    await HomeBanner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Home banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Home Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete home banner.",
    });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/home-banners/:id/toggle
// @access  Private/Admin
const toggleHomeBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await HomeBanner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      data: banner,
    });
  } catch (error) {
    console.error("Toggle Home Banner Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not toggle status.",
    });
  }
};

module.exports = {
  getActiveHomeBanners,
  getAllHomeBanners,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
};
