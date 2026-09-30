const express = require("express");
const router = express.Router();
const {
  getAttendance,
  markManualAttendance,
  updateAttendance,
  punchBiometric,
  getAthleteAttendanceHistory,
  resetAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// Attendance routes
router.get("/", getAttendance);
router.post("/manual", markManualAttendance);
router.put("/:id", updateAttendance);
router.post("/biometric-punch", punchBiometric);
router.get("/athlete/:athleteId", getAthleteAttendanceHistory);
router.delete("/reset", resetAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
