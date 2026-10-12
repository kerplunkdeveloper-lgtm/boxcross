const express = require("express");
const router = express.Router();
const {
  getMembershipPlans,
  getMembershipPlanByKey,
  updateMembershipPlan,
  deleteMembershipPlan
} = require("../controllers/membershipController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getMembershipPlans);
router.get("/:key", getMembershipPlanByKey);

// Admin-only update and delete endpoints
router.put("/:id", protect, authorize("admin"), updateMembershipPlan);
router.delete("/:id", protect, authorize("admin"), deleteMembershipPlan);

module.exports = router;

