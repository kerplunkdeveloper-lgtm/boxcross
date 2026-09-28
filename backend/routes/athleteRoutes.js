const express = require("express");
const router = express.Router();
const {
  getAthletes,
  getAthleteById,
  getNextMemberId,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getAthleteStats,
  loginAthlete,
  getAthleteMe,
  impersonateAthlete,
} = require("../controllers/athleteController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/login", loginAthlete);
router.post("/impersonate/:id", protect, authorize("admin"), impersonateAthlete);
router.get("/me", getAthleteMe);
router.get("/next-id", getNextMemberId);
router.get("/stats", getAthleteStats);
router.get("/", getAthletes);
router.get("/:id", getAthleteById);
router.post("/", createAthlete);
router.put("/:id", updateAthlete);
router.delete("/:id", deleteAthlete);

module.exports = router;
