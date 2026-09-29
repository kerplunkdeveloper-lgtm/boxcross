const express = require("express");
const router = express.Router();
const {
  getEntryBaselines,
  getEntryBaselineById,
  createEntryBaseline,
  updateEntryBaseline,
  deleteEntryBaseline,
  getEntryBaselineStats,
} = require("../controllers/entryBaselineController");

// Statistics Route
router.get("/stats", getEntryBaselineStats);

// Base CRUD Routes
router.get("/", getEntryBaselines);
router.get("/:id", getEntryBaselineById);
router.post("/", createEntryBaseline);
router.put("/:id", updateEntryBaseline);
router.delete("/:id", deleteEntryBaseline);

module.exports = router;
