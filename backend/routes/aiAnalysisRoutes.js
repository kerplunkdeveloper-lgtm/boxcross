const express = require("express");
const router = express.Router();
const {
  getAIAnalysisList,
  getAIAnalysisById,
  getMemberAnalysisHistory,
  createAIAnalysis,
  deleteAIAnalysis,
} = require("../controllers/aiAnalysisController");

router.get("/member/:memberId", getMemberAnalysisHistory);
router.get("/:id", getAIAnalysisById);
router.get("/", getAIAnalysisList);
router.post("/", createAIAnalysis);
router.delete("/:id", deleteAIAnalysis);

module.exports = router;
