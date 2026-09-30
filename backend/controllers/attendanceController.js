const Attendance = require("../models/Attendance");
const Athlete = require("../models/Athlete");

// Helper to format Date to YYYY-MM-DD in local time
const formatDateYMD = (d = new Date()) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to format Date to HH:MM AM/PM
const formatTime12h = (d = new Date()) => {
  const date = new Date(d);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const strHours = String(hours).padStart(2, "0");
  return `${strHours}:${minutes} ${ampm}`;
};

// @desc    Get attendance for a specific date (and batch) with active athlete sheet
// @route   GET /api/attendance
// @access  Admin or Coach
exports.getAttendance = async (req, res) => {
  try {
    const queryDate = req.query.date ? req.query.date.trim() : formatDateYMD();
    const batchFilter = req.query.batch && req.query.batch !== "All" ? req.query.batch : null;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";

    // 1. Fetch all active athletes
    const athleteQuery = { status: "Active" };
    const athletes = await Athlete.find(athleteQuery)
      .select("athleteName memberId coach age gender phone email dateOfJoining biometricEnrolled")
      .sort({ athleteName: 1 })
      .lean();

    // 2. Fetch existing attendance records for the chosen date
    const attendanceFilter = { date: queryDate };
    if (batchFilter) {
      attendanceFilter.batch = batchFilter;
    }

    const attendanceRecords = await Attendance.find(attendanceFilter)
      .sort({ updatedAt: -1 })
      .lean();

    // Create a map by athlete ID for fast lookup
    const recordsByAthleteId = {};
    attendanceRecords.forEach((rec) => {
      recordsByAthleteId[rec.athlete.toString()] = rec;
    });

    // 3. Merge athletes with attendance records
    let sheet = athletes.map((ath) => {
      const existing = recordsByAthleteId[ath._id.toString()];
      if (existing) {
        return {
          ...existing,
          athleteDetails: ath,
          isMarked: true,
        };
      }
      return {
        _id: null,
        athlete: ath._id,
        athleteName: ath.athleteName,
        memberId: ath.memberId,
        coach: ath.coach || "Unassigned",
        date: queryDate,
        status: "Unmarked",
        checkInTime: "",
        checkOutTime: "",
        method: "Manual",
        batch: batchFilter || "General",
        notes: "",
        athleteDetails: ath,
        isMarked: false,
      };
    });

    // 4. Apply search filter if present
    if (search) {
      sheet = sheet.filter((row) => {
        const nameMatch = row.athleteName?.toLowerCase().includes(search);
        const idMatch = row.memberId?.toLowerCase().includes(search);
        const coachMatch = row.coach?.toLowerCase().includes(search);
        return nameMatch || idMatch || coachMatch;
      });
    }

    // 5. Compute stats for this date
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let biometricCount = 0;
    let manualCount = 0;

    attendanceRecords.forEach((rec) => {
      if (rec.status === "Present") presentCount++;
      else if (rec.status === "Absent") absentCount++;
      else if (rec.status === "Late") lateCount++;
      else if (rec.status === "Excused") excusedCount++;

      if (rec.method === "Biometric" || rec.method === "RFID" || rec.method === "FaceID") {
        biometricCount++;
      } else {
        manualCount++;
      }
    });

    const totalAthletes = athletes.length;
    const markedCount = presentCount + absentCount + lateCount + excusedCount;
    const unmarkedCount = Math.max(0, totalAthletes - markedCount);
    const attendanceRate = totalAthletes > 0 ? Math.round(((presentCount + lateCount) / totalAthletes) * 100) : 0;

    res.status(200).json({
      success: true,
      date: queryDate,
      batch: batchFilter || "All",
      stats: {
        totalAthletes,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        unmarkedCount,
        biometricCount,
        manualCount,
        attendanceRate,
      },
      sheet,
      records: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance manually (Single or Bulk)
// @route   POST /api/attendance/manual
// @access  Admin or Coach
exports.markManualAttendance = async (req, res) => {
  try {
    const { items, single } = req.body;

    // Handle single record update
    if (single || req.body.athleteId) {
      const athleteId = req.body.athleteId || single?.athleteId;
      const athlete = await Athlete.findById(athleteId).lean();
      if (!athlete) {
        return res.status(404).json({ success: false, message: "Athlete not found" });
      }

      const date = req.body.date ? req.body.date.trim() : formatDateYMD();
      const status = req.body.status || "Present";
      const checkInTime = req.body.checkInTime || (status === "Present" || status === "Late" ? formatTime12h() : "");
      const checkOutTime = req.body.checkOutTime || "";
      const batch = req.body.batch || "General";
      const notes = req.body.notes || "";
      const method = req.body.method || "Manual";

      const updated = await Attendance.findOneAndUpdate(
        { athlete: athleteId, date },
        {
          $set: {
            athlete: athleteId,
            athleteName: athlete.athleteName,
            memberId: athlete.memberId,
            coach: athlete.coach,
            date,
            status,
            checkInTime,
            checkOutTime,
            batch,
            notes,
            method,
            markedBy: req.body.markedBy || "Admin (Manual)",
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json({
        success: true,
        message: `Attendance for ${athlete.athleteName} updated to ${status}`,
        record: updated,
      });
    }

    // Handle bulk records update
    if (Array.isArray(items) && items.length > 0) {
      const ops = items.map((item) => {
        const date = item.date || formatDateYMD();
        return {
          updateOne: {
            filter: { athlete: item.athleteId, date },
            update: {
              $set: {
                athlete: item.athleteId,
                athleteName: item.athleteName,
                memberId: item.memberId,
                coach: item.coach || "",
                date,
                status: item.status || "Present",
                checkInTime: item.checkInTime || "",
                checkOutTime: item.checkOutTime || "",
                batch: item.batch || "General",
                notes: item.notes || "",
                method: item.method || "Manual",
                markedBy: item.markedBy || "Admin (Bulk Manual)",
              },
            },
            upsert: true,
          },
        };
      });

      await Attendance.bulkWrite(ops);

      return res.status(200).json({
        success: true,
        message: `Bulk updated attendance for ${items.length} athletes successfully!`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payload. Provide 'single' or 'items' array.",
    });
  } catch (error) {
    console.error("Error marking manual attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate / Punch Biometric Attendance
// @route   POST /api/attendance/biometric-punch
// @access  Public / Device Key / Admin
exports.punchBiometric = async (req, res) => {
  try {
    const {
      memberId,
      athleteId,
      rfidCard,
      punchType, // 'auto', 'check_in', 'check_out'
      terminalId = "BXC-TERMINAL-01",
      deviceName = "BioSync-X1 Terminal",
      location = "Main Gym Entrance Gate",
    } = req.body;

    if (!memberId && !athleteId && !rfidCard) {
      return res.status(400).json({
        success: false,
        message: "Biometric sensor requires Member ID, Athlete ID, or RFID card scan.",
      });
    }

    // Find the athlete
    let athlete = null;
    if (athleteId) {
      athlete = await Athlete.findById(athleteId);
    } else if (memberId) {
      athlete = await Athlete.findOne({
        memberId: { $regex: new RegExp(`^${memberId.trim()}$`, "i") },
      });
    } else if (rfidCard) {
      athlete = await Athlete.findOne({ rfidCard: rfidCard.trim() });
    }

    if (!athlete) {
      return res.status(404).json({
        success: false,
        action: "REJECTED",
        message: `Biometric scan failed: Member ID "${memberId || rfidCard}" not found in system.`,
      });
    }

    if (athlete.status === "Inactive") {
      return res.status(403).json({
        success: false,
        action: "DENIED",
        message: `Access Denied: Athlete ${athlete.athleteName} (${athlete.memberId}) is marked Inactive. Please contact front desk.`,
        athlete: {
          athleteName: athlete.athleteName,
          memberId: athlete.memberId,
          status: athlete.status,
        },
      });
    }

    const todayDate = formatDateYMD();
    const nowTimeStr = formatTime12h();
    const now = new Date();

    // Check existing attendance for today
    let record = await Attendance.findOne({
      athlete: athlete._id,
      date: todayDate,
    });

    let action = "CHECK_IN";
    const verifiedScore = Number((98.0 + Math.random() * 1.9).toFixed(1)); // simulated biometric confidence e.g. 99.4%

    if (!record) {
      // First punch of the day: Check-In
      action = "CHECK_IN";
      record = new Attendance({
        athlete: athlete._id,
        athleteName: athlete.athleteName,
        memberId: athlete.memberId,
        coach: athlete.coach,
        date: todayDate,
        dateTime: now,
        status: "Present",
        checkInTime: nowTimeStr,
        checkInDate: now,
        method: "Biometric",
        batch: "General",
        deviceInfo: {
          terminalId,
          deviceName,
          location,
          verifiedScore,
        },
        markedBy: "Biometric Terminal",
      });
      await record.save();
    } else {
      // Record already exists for today
      if (punchType === "check_out" || (record.checkInTime && !record.checkOutTime)) {
        // Perform Check-Out
        action = "CHECK_OUT";
        record.checkOutTime = nowTimeStr;
        record.checkOutDate = now;
        record.deviceInfo.verifiedScore = verifiedScore;
        record.updatedAt = now;
        await record.save();
      } else if (punchType === "check_in") {
        // Explicit Check-In repeat
        action = "CHECK_IN";
        if (!record.checkInTime) {
          record.checkInTime = nowTimeStr;
          record.checkInDate = now;
        }
        record.status = "Present";
        record.deviceInfo.verifiedScore = verifiedScore;
        await record.save();
      } else {
        // Auto mode when both check-in and check-out exist: update checkout to latest timestamp
        action = "CHECK_OUT";
        record.checkOutTime = nowTimeStr;
        record.checkOutDate = now;
        await record.save();
      }
    }

    const actionText = action === "CHECK_IN" ? "Check-In Verified" : "Check-Out Recorded";
    const welcomeText =
      action === "CHECK_IN"
        ? `Welcome to Box & Cross, ${athlete.athleteName}! Have a great workout.`
        : `Great workout today, ${athlete.athleteName}! See you tomorrow.`;

    res.status(200).json({
      success: true,
      action,
      actionText,
      message: `${actionText}: ${athlete.athleteName} (${athlete.memberId}) at ${nowTimeStr}`,
      welcomeText,
      record,
      athlete: {
        _id: athlete._id,
        athleteName: athlete.athleteName,
        memberId: athlete.memberId,
        coach: athlete.coach,
        gender: athlete.gender,
        age: athlete.age,
        dateOfJoining: athlete.dateOfJoining,
      },
      biometricMeta: {
        verifiedScore,
        terminalId,
        deviceName,
        location,
        timestamp: nowTimeStr,
        method: "Fingerprint Biometric Sensor",
      },
    });
  } catch (error) {
    console.error("Error in biometric punch:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get athlete's attendance history & statistics
// @route   GET /api/attendance/athlete/:athleteId
// @access  Athlete or Admin
exports.getAthleteAttendanceHistory = async (req, res) => {
  try {
    const { athleteId } = req.params;

    const athlete = await Athlete.findById(athleteId).select("athleteName memberId coach dateOfJoining").lean();
    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found" });
    }

    // Get all records for this athlete
    const records = await Attendance.find({ athlete: athleteId })
      .sort({ date: -1 })
      .lean();

    const totalWorkouts = records.filter(
      (r) => r.status === "Present" || r.status === "Late"
    ).length;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    // Check recent days
    const attendedDateSet = new Set(
      records
        .filter((r) => r.status === "Present" || r.status === "Late")
        .map((r) => r.date)
    );

    let checkDate = new Date(today);
    // If not attended today, check starting from yesterday
    const todayStr = formatDateYMD(checkDate);
    if (!attendedDateSet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const ymd = formatDateYMD(checkDate);
      if (attendedDateSet.has(ymd)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Monthly attendance count
    const currentMonthPrefix = formatDateYMD().slice(0, 7); // YYYY-MM
    const monthlyAttended = records.filter(
      (r) =>
        r.date.startsWith(currentMonthPrefix) &&
        (r.status === "Present" || r.status === "Late")
    ).length;

    const daysInMonthSoFar = Math.max(1, new Date().getDate());
    const monthlyRate = Math.min(100, Math.round((monthlyAttended / daysInMonthSoFar) * 100));

    res.status(200).json({
      success: true,
      athlete,
      stats: {
        totalWorkouts,
        monthlyAttended,
        monthlyRate,
        currentStreak,
      },
      records: records.slice(0, 50),
    });
  } catch (error) {
    console.error("Error fetching athlete attendance history:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an attendance record by ID
// @route   PUT /api/attendance/:id
// @access  Admin
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      checkInTime,
      checkOutTime,
      method,
      batch,
      notes,
      date,
    } = req.body;

    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    if (status !== undefined) record.status = status;
    if (checkInTime !== undefined) record.checkInTime = checkInTime;
    if (checkOutTime !== undefined) record.checkOutTime = checkOutTime;
    if (method !== undefined) record.method = method;
    if (batch !== undefined) record.batch = batch;
    if (notes !== undefined) record.notes = notes;
    if (date !== undefined) record.date = date;
    record.markedBy = req.body.markedBy || "Admin (Updated)";
    record.updatedAt = new Date();

    await record.save();

    res.status(200).json({
      success: true,
      message: `Attendance for ${record.athleteName} updated to ${record.status}`,
      record,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset / Delete attendance record by athleteId & date
// @route   DELETE /api/attendance/reset
// @access  Admin
exports.resetAttendance = async (req, res) => {
  try {
    const { athleteId, date } = req.query;
    if (!athleteId || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide both athleteId and date to reset attendance.",
      });
    }

    const deleted = await Attendance.findOneAndDelete({ athlete: athleteId, date });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for this athlete on this date.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Attendance for ${deleted.athleteName} reset to Unmarked`,
      recordId: deleted._id,
    });
  } catch (error) {
    console.error("Error resetting attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Admin
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }
    res.status(200).json({ success: true, message: "Attendance record removed" });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
