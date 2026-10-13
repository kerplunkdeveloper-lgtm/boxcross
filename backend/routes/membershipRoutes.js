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

// Dashboard update and delete endpoints
router.put("/:id", updateMembershipPlan);
router.delete("/:id", deleteMembershipPlan);

module.exports = router;

