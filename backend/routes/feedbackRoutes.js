const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getFeedback,
  getFeedbackStats,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

// Public — anonymous submission from /feedback
router.post("/", submitFeedback);

// Management only
router.get("/", protect, authorize("admin"), getFeedback);
router.get("/stats", protect, authorize("admin"), getFeedbackStats);
router.patch("/:id", protect, authorize("admin"), updateFeedback);
router.delete("/:id", protect, authorize("admin"), deleteFeedback);

module.exports = router;
