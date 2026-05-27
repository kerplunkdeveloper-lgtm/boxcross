const express = require("express");
const router = express.Router();
const {
  getMembershipPlans,
  getMembershipPlanByKey,
  updateMembershipPlan
} = require("../controllers/membershipController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getMembershipPlans);
router.get("/:key", getMembershipPlanByKey);

// Admin-only update endpoint
router.put("/:id", protect, authorize("admin"), updateMembershipPlan);

module.exports = router;
