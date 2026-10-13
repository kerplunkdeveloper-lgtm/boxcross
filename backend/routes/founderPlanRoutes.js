const express = require("express");
const router = express.Router();
const {
  getFounderPlans,
  getFounderPlanByKey,
  createFounderPlan,
  updateFounderPlan,
  deleteFounderPlan
} = require("../controllers/founderPlanController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public and dashboard endpoints
router.get("/", getFounderPlans);
router.get("/:key", getFounderPlanByKey);

// Dashboard management endpoints
router.post("/", createFounderPlan);
router.put("/:id", updateFounderPlan);
router.delete("/:id", deleteFounderPlan);

module.exports = router;
