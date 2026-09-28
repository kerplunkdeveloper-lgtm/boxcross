const express = require("express");
const router = express.Router();
const {
  getGoalsReadinessList,
  getGoalsReadinessById,
  createGoalsReadiness,
  updateGoalsReadiness,
  deleteGoalsReadiness,
  getGoalsReadinessStats,
} = require("../controllers/goalsReadinessController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Routes with Admin Protection (or open as fallback for internal admin usage)
router.get("/stats", getGoalsReadinessStats);
router.get("/", getGoalsReadinessList);
router.get("/:id", getGoalsReadinessById);
router.post("/", createGoalsReadiness);
router.put("/:id", updateGoalsReadiness);
router.delete("/:id", deleteGoalsReadiness);

module.exports = router;
