const GoalsReadiness = require("../models/GoalsReadiness");
const Athlete = require("../models/Athlete");

// @desc    Get all Goals & Readiness records with optional search & filter
// @route   GET /api/goals-readiness
// @access  Private/Admin
exports.getGoalsReadinessList = async (req, res) => {
  try {
    const { search, clearedToTest, coach, retentionFlag, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { athleteName: { $regex: q, $options: "i" } },
        { memberId: { $regex: q, $options: "i" } },
        { coach: { $regex: q, $options: "i" } },
        { emergencyContactName: { $regex: q, $options: "i" } },
      ];
    }

    if (clearedToTest && clearedToTest !== "All") {
      filter.clearedToTest = clearedToTest;
    }

    if (coach && coach !== "All") {
      filter.coach = coach;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (retentionFlag === "true" || retentionFlag === true) {
      filter.confidence = { $lte: 5 };
    }

    const records = await GoalsReadiness.find(filter)
      .sort({ createdAt: -1 })
      .populate("athleteId", "athleteName memberId phone email");

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching Goals & Readiness records:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch Goals & Readiness records",
      error: error.message,
    });
  }
};

// @desc    Get single Goals & Readiness record by ID
// @route   GET /api/goals-readiness/:id
// @access  Private/Admin
exports.getGoalsReadinessById = async (req, res) => {
  try {
    const record = await GoalsReadiness.findById(req.params.id).populate(
      "athleteId",
      "athleteName memberId phone email coach"
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Assessment record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching record by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch assessment",
      error: error.message,
    });
  }
};

// @desc    Create new Goals & Readiness assessment record
// @route   POST /api/goals-readiness
// @access  Private/Admin
exports.createGoalsReadiness = async (req, res) => {
  try {
    const body = { ...req.body };

    // Auto-link athleteId if memberId or athleteName matches an existing athlete
    if (!body.athleteId && (body.memberId || body.athleteName)) {
      const matchQuery = [];
      if (body.memberId && body.memberId.trim()) {
        matchQuery.push({ memberId: body.memberId.trim().toUpperCase() });
      }
      if (body.athleteName && body.athleteName.trim()) {
        matchQuery.push({ athleteName: { $regex: `^${body.athleteName.trim()}$`, $options: "i" } });
      }

      if (matchQuery.length > 0) {
        const foundAthlete = await Athlete.findOne({ $or: matchQuery });
        if (foundAthlete) {
          body.athleteId = foundAthlete._id;
          if (!body.memberId) body.memberId = foundAthlete.memberId;
        }
      }
    }

    const newRecord = await GoalsReadiness.create(body);

    res.status(201).json({
      success: true,
      message: "Goals & Readiness assessment created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating Goals & Readiness record:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create Goals & Readiness assessment",
    });
  }
};

// @desc    Update Goals & Readiness assessment record
// @route   PUT /api/goals-readiness/:id
// @access  Private/Admin
exports.updateGoalsReadiness = async (req, res) => {
  try {
    const record = await GoalsReadiness.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Assessment record not found",
      });
    }

    const updatedRecord = await GoalsReadiness.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Assessment record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update assessment record",
    });
  }
};

// @desc    Delete Goals & Readiness assessment record
// @route   DELETE /api/goals-readiness/:id
// @access  Private/Admin
exports.deleteGoalsReadiness = async (req, res) => {
  try {
    const record = await GoalsReadiness.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Assessment record not found",
      });
    }

    await GoalsReadiness.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Assessment record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assessment record:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete assessment record",
      error: error.message,
    });
  }
};

// @desc    Get aggregate stats for Goals & Readiness dashboard
// @route   GET /api/goals-readiness/stats
// @access  Private/Admin
exports.getGoalsReadinessStats = async (req, res) => {
  try {
    const total = await GoalsReadiness.countDocuments();
    const cleared = await GoalsReadiness.countDocuments({ clearedToTest: "Cleared" });
    const referred = await GoalsReadiness.countDocuments({ clearedToTest: "Referred" });
    const retentionFlags = await GoalsReadiness.countDocuments({ confidence: { $lte: 5 } });

    res.status(200).json({
      success: true,
      stats: {
        total,
        cleared,
        referred,
        retentionFlags,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch stats",
      error: error.message,
    });
  }
};
