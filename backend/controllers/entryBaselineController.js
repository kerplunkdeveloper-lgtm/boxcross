const EntryBaseline = require("../models/EntryBaseline");
const Athlete = require("../models/Athlete");

// Helper to calculate VO2 Max based on formula:
// 12" box, metronome 96 BPM, 3 min. Sit, wait 5 sec, count 15 sec.
// M: 111.33 - (0.42 * bpm)
// F: 65.81 - (0.1847 * bpm)
const calculateVo2Max = (bpm, gender) => {
  if (!bpm || isNaN(bpm)) return null;
  const isFemale = (gender || "").toUpperCase().startsWith("F");
  if (isFemale) {
    return Math.round((65.81 - 0.1847 * bpm) * 10) / 10;
  }
  return Math.round((111.33 - 0.42 * bpm) * 10) / 10;
};

// @desc    Get all Entry Baseline assessments with filter & search
// @route   GET /api/entry-baseline
// @access  Public / Admin
exports.getEntryBaselines = async (req, res) => {
  try {
    const { search, clearedToTest, level, joinedToday, coach } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { coach: { $regex: q, $options: "i" } },
        { memberId: { $regex: q, $options: "i" } },
      ];
    }

    if (clearedToTest && clearedToTest !== "All") {
      filter.clearedToTest = clearedToTest;
    }

    if (level && level !== "All") {
      filter.level = { $regex: level, $options: "i" };
    }

    if (coach && coach !== "All") {
      filter.coach = coach;
    }

    if (joinedToday !== undefined && joinedToday !== "All") {
      filter.joinedToday = joinedToday === "true" || joinedToday === true;
    }

    // Automatically purge any previously seeded dummy sample records so data is completely clean
    await EntryBaseline.deleteMany({
      name: { $in: ["Kavitha R", "Arun Kumar", "Deepak Sharma"] },
    });

    const records = await EntryBaseline.find(filter)
      .sort({ createdAt: -1 })
      .populate("athleteId", "athleteName memberId phone email");

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching Entry Baselines:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch entry baseline assessments",
      error: error.message,
    });
  }
};

// @desc    Get single Entry Baseline assessment
// @route   GET /api/entry-baseline/:id
// @access  Public / Admin
exports.getEntryBaselineById = async (req, res) => {
  try {
    const record = await EntryBaseline.findById(req.params.id).populate(
      "athleteId",
      "athleteName memberId phone email coach"
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Entry Baseline assessment record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching Entry Baseline by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch assessment",
      error: error.message,
    });
  }
};

// @desc    Create new Entry Baseline assessment
// @route   POST /api/entry-baseline
// @access  Public / Admin
exports.createEntryBaseline = async (req, res) => {
  try {
    const body = { ...req.body };

    // Auto-calculate Stronger Hand Grip
    const leftGrip = parseFloat(body.gripLeft) || 0;
    const rightGrip = parseFloat(body.gripRight) || 0;
    if (leftGrip > 0 || rightGrip > 0) {
      body.gripStrongerHand = Math.max(leftGrip, rightGrip);
    }

    // Auto-calculate Step test calculations
    if (body.stepTest) {
      const pulse15 = parseFloat(body.stepTest.pulse15Sec);
      const hrFinish = parseFloat(body.stepTest.hrAtFinish);
      const hr60 = parseFloat(body.stepTest.hrAfter60Sec);

      if (!isNaN(hrFinish) && !isNaN(hr60)) {
        body.stepTest.recoveryHR = Math.max(0, Math.round(hrFinish - hr60));
      }

      const bpm = !isNaN(pulse15) ? pulse15 * 4 : (!isNaN(hrFinish) ? hrFinish : null);
      if (bpm && (!body.stepTest.estVo2Max || isNaN(body.stepTest.estVo2Max))) {
        body.stepTest.estVo2Max = calculateVo2Max(bpm, body.gender);
      }
    }

    // Sync cardNotes defaults
    if (!body.cardNotes) body.cardNotes = {};
    if (!body.cardNotes.youAreAlreadyGoodAt && body.oneThingGoodAt) {
      body.cardNotes.youAreAlreadyGoodAt = body.oneThingGoodAt;
    }
    if (!body.cardNotes.weStartHere && body.oneThingWorkOnFirst) {
      body.cardNotes.weStartHere = body.oneThingWorkOnFirst;
    }
    if (!body.cardNotes.whatYouToldUs && body.inTheirOwnWords) {
      body.cardNotes.whatYouToldUs = body.inTheirOwnWords;
    }

    // Auto-link to existing Athlete if matching phone or memberId
    if (!body.athleteId && (body.phone || body.name)) {
      const matchCriteria = [];
      if (body.phone && body.phone.trim()) {
        matchCriteria.push({ phone: body.phone.trim() });
      }
      if (body.memberId && body.memberId.trim()) {
        matchCriteria.push({ memberId: body.memberId.trim().toUpperCase() });
      }

      if (matchCriteria.length > 0) {
        const matchedAthlete = await Athlete.findOne({ $or: matchCriteria });
        if (matchedAthlete) {
          body.athleteId = matchedAthlete._id;
          if (!body.memberId) body.memberId = matchedAthlete.memberId;
        }
      }
    }

    const newRecord = await EntryBaseline.create(body);

    res.status(201).json({
      success: true,
      message: "Entry Baseline assessment created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating Entry Baseline:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create assessment",
    });
  }
};

// @desc    Update Entry Baseline assessment
// @route   PUT /api/entry-baseline/:id
// @access  Public / Admin
exports.updateEntryBaseline = async (req, res) => {
  try {
    const body = { ...req.body };

    // Auto-calculate Stronger Hand Grip
    const leftGrip = parseFloat(body.gripLeft) || 0;
    const rightGrip = parseFloat(body.gripRight) || 0;
    if (leftGrip > 0 || rightGrip > 0) {
      body.gripStrongerHand = Math.max(leftGrip, rightGrip);
    }

    // Auto-calculate Step test calculations
    if (body.stepTest) {
      const pulse15 = parseFloat(body.stepTest.pulse15Sec);
      const hrFinish = parseFloat(body.stepTest.hrAtFinish);
      const hr60 = parseFloat(body.stepTest.hrAfter60Sec);

      if (!isNaN(hrFinish) && !isNaN(hr60)) {
        body.stepTest.recoveryHR = Math.max(0, Math.round(hrFinish - hr60));
      }

      const bpm = !isNaN(pulse15) ? pulse15 * 4 : (!isNaN(hrFinish) ? hrFinish : null);
      if (bpm && (!body.stepTest.estVo2Max || isNaN(body.stepTest.estVo2Max))) {
        body.stepTest.estVo2Max = calculateVo2Max(bpm, body.gender);
      }
    }

    const updated = await EntryBaseline.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("athleteId", "athleteName memberId phone email");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Entry Baseline record not found to update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Entry Baseline assessment updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating Entry Baseline:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update assessment",
    });
  }
};

// @desc    Delete Entry Baseline assessment
// @route   DELETE /api/entry-baseline/:id
// @access  Public / Admin
exports.deleteEntryBaseline = async (req, res) => {
  try {
    const record = await EntryBaseline.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Entry Baseline record not found to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Entry Baseline assessment deleted permanently",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting Entry Baseline:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete assessment",
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics for Entry Baselines
// @route   GET /api/entry-baseline/stats
// @access  Public / Admin
exports.getEntryBaselineStats = async (req, res) => {
  try {
    await EntryBaseline.deleteMany({
      name: { $in: ["Kavitha R", "Arun Kumar", "Deepak Sharma"] },
    });

    const total = await EntryBaseline.countDocuments();
    const cleared = await EntryBaseline.countDocuments({ clearedToTest: "YES" });
    const referred = await EntryBaseline.countDocuments({ clearedToTest: "NO - REFER" });
    const joinedToday = await EntryBaseline.countDocuments({ joinedToday: true });

    // Aggregate average metrics
    const statsAgg = await EntryBaseline.aggregate([
      {
        $group: {
          _id: null,
          avgVo2Max: { $avg: "$stepTest.estVo2Max" },
          avgRecoveryHR: { $avg: "$stepTest.recoveryHR" },
          avgGrip: { $avg: "$gripStrongerHand" },
        },
      },
    ]);

    const metrics = statsAgg[0] || {};

    res.status(200).json({
      success: true,
      data: {
        total,
        cleared,
        referred,
        joinedToday,
        avgVo2Max: metrics.avgVo2Max ? Math.round(metrics.avgVo2Max * 10) / 10 : 0,
        avgRecoveryHR: metrics.avgRecoveryHR ? Math.round(metrics.avgRecoveryHR) : 0,
        avgGrip: metrics.avgGrip ? Math.round(metrics.avgGrip * 10) / 10 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to compute statistics",
      error: error.message,
    });
  }
};
