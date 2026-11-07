const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getActiveHomeBanners,
  getAllHomeBanners,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
} = require("../controllers/homeBannerController");

// Multi-field upload supporting desktop and mobile files
const bannerUpload = upload.fields([
  { name: "desktopMedia", maxCount: 1 },
  { name: "mobileMedia", maxCount: 1 },
  { name: "media", maxCount: 1 }, // Fallback alias
]);

// Public route: fetch active banners for Home page
router.get("/", getActiveHomeBanners);

// Admin-only routes
router.get("/admin", protect, authorize("admin"), getAllHomeBanners);
router.post("/", protect, authorize("admin"), bannerUpload, createHomeBanner);
router.put("/:id", protect, authorize("admin"), bannerUpload, updateHomeBanner);
router.delete("/:id", protect, authorize("admin"), deleteHomeBanner);
router.patch("/:id/toggle", protect, authorize("admin"), toggleHomeBannerStatus);

module.exports = router;

