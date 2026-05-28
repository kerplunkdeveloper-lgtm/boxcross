const EventBanner = require("../models/EventBanner");
const cloudinary = require("../config/cloudinary");

// Helper function to upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("video/") ? "video" : "image";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "boxcross_banners",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId, mediaType) => {
  try {
    const resourceType = mediaType === "video" ? "video" : "image";
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
  }
};

// @desc    Get all event banners (Public)
// @route   GET /api/event-banners
// @access  Public
const getActiveBanners = async (req, res) => {
  try {
    const banners = await EventBanner.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Get Active Banners Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch banners.",
    });
  }
};

// @desc    Get all event banners (Admin)
// @route   GET /api/event-banners/admin
// @access  Private/Admin
const getAllBanners = async (req, res) => {
  try {
    const banners = await EventBanner.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Get All Banners Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch banners.",
    });
  }
};

// @desc    Create a new event banner
// @route   POST /api/event-banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image or video file",
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    const banner = await EventBanner.create({
      title,
      description: description || "",
      mediaUrl: result.secure_url,
      mediaType,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Event banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Create Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create banner.",
    });
  }
};

// @desc    Update event banner
// @route   PUT /api/event-banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    let banner = await EventBanner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Event banner not found",
      });
    }

    // Prepare update data
    const updateData = {
      title: title !== undefined ? title : banner.title,
      description: description !== undefined ? description : banner.description,
    };

    // If new file is uploaded, replace existing media in Cloudinary
    if (req.file) {
      // 1. Delete old media from Cloudinary
      await deleteFromCloudinary(banner.publicId, banner.mediaType);

      // 2. Upload new media
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";

      updateData.mediaUrl = result.secure_url;
      updateData.mediaType = mediaType;
      updateData.publicId = result.public_id;
    }

    banner = await EventBanner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Event banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("Update Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update banner.",
    });
  }
};

// @desc    Delete event banner
// @route   DELETE /api/event-banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await EventBanner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Event banner not found",
      });
    }

    // Delete media from Cloudinary
    await deleteFromCloudinary(banner.publicId, banner.mediaType);

    // Delete document from database
    await EventBanner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Banner Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete banner.",
    });
  }
};

module.exports = {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
