const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/eventBannerController");

// Public route
router.get("/", getActiveBanners);

// Admin-only routes
router.get("/admin", protect, authorize("admin"), getAllBanners);
router.post("/", protect, authorize("admin"), upload.single("media"), createBanner);
router.put("/:id", protect, authorize("admin"), upload.single("media"), updateBanner);
router.delete("/:id", protect, authorize("admin"), deleteBanner);

module.exports = router;
