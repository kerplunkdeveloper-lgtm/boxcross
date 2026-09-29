const AIAnalysis = require("../models/AIAnalysis");
const Athlete = require("../models/Athlete");

// @desc    Get all AI Analysis records with optional filters
// @route   GET /api/ai-analysis
// @access  Private / Admin
exports.getAIAnalysisList = async (req, res) => {
  try {
    const { search, memberId, analysisType, minScore, trainer, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { memberName: { $regex: q, $options: "i" } },
        { memberId: { $regex: q, $options: "i" } },
        { trainerName: { $regex: q, $options: "i" } },
        { analysisType: { $regex: q, $options: "i" } },
      ];
    }

    if (memberId && memberId !== "All") {
      filter.memberId = memberId.toUpperCase();
    }

    if (analysisType && analysisType !== "All") {
      filter.analysisType = analysisType;
    }

    if (minScore) {
      filter.overallScore = { $gte: Number(minScore) };
    }

    if (trainer && trainer !== "All") {
      filter.trainerName = { $regex: trainer, $options: "i" };
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    // Auto-seed if empty
    const count = await AIAnalysis.countDocuments();
    if (count === 0) {
      await seedInitialData();
    }

    const records = await AIAnalysis.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching AI analysis list:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch AI Analysis records",
      error: error.message,
    });
  }
};

// @desc    Get single AI Analysis record by ID
// @route   GET /api/ai-analysis/:id
// @access  Private / Admin
exports.getAIAnalysisById = async (req, res) => {
  try {
    const record = await AIAnalysis.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Analysis record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching AI analysis record:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch record",
      error: error.message,
    });
  }
};

// @desc    Get analysis history and progress metrics for a member
// @route   GET /api/ai-analysis/member/:memberId
// @access  Private / Admin
exports.getMemberAnalysisHistory = async (req, res) => {
  try {
    const { memberId } = req.params;
    const history = await AIAnalysis.find({
      memberId: memberId.toUpperCase(),
    }).sort({ createdAt: -1 });

    let latest = history[0] || null;
    let previous = history[1] || null;

    let improvement = 0;
    if (latest && previous) {
      improvement = latest.overallScore - previous.overallScore;
    }

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
      comparison: {
        current: latest,
        previous: previous,
        improvementPoints: improvement,
      },
    });
  } catch (error) {
    console.error("Error fetching member analysis history:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch member history",
      error: error.message,
    });
  }
};

// @desc    Create and save a new AI Analysis session
// @route   POST /api/ai-analysis
// @access  Private / Admin
exports.createAIAnalysis = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    // Try linking to existing Athlete
    if (!payload.athleteId) {
      const athlete = await Athlete.findOne({ memberId: payload.memberId.toUpperCase() });
      if (athlete) {
        payload.athleteId = athlete._id;
        if (!payload.memberName) payload.memberName = athlete.athleteName;
      }
    }

    const newRecord = await AIAnalysis.create(payload);

    res.status(201).json({
      success: true,
      message: "AI Analysis record saved successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error saving AI analysis record:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to save analysis record",
      error: error.message,
    });
  }
};

// @desc    Delete AI Analysis record
// @route   DELETE /api/ai-analysis/:id
// @access  Private / Admin
exports.deleteAIAnalysis = async (req, res) => {
  try {
    const record = await AIAnalysis.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Analysis record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting AI analysis record:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete record",
      error: error.message,
    });
  }
};

// Internal seeder for realistic sample baseline analyses
async function seedInitialData() {
  try {
    const sampleAthletes = await Athlete.find().limit(3);
    const m1 = sampleAthletes[0] || { athleteName: "Karthik S", memberId: "GYM0012" };
    const m2 = sampleAthletes[1] || { athleteName: "Priya Raman", memberId: "GYM0015" };

    const samples = [
      {
        memberId: m1.memberId || "GYM0012",
        athleteId: m1._id || null,
        memberName: m1.athleteName || "Karthik S",
        trainerId: "TR-01",
        trainerName: "Coach Vivek",
        analysisType: "Posture Analysis",
        overallScore: 86,
        postureScore: 86,
        formScore: 84,
        symmetryScore: 88,
        alignmentMetrics: {
          headPosition: 92,
          shoulderAlignment: 86,
          spineAlignment: 74,
          hipAlignment: 89,
          kneeAlignment: 91,
          ankleAlignment: 88,
          bodySymmetry: 82,
        },
        symmetryMetrics: {
          shoulderSymmetry: 92,
          hipSymmetry: 88,
          kneeSymmetry: 94,
          ankleSymmetry: 90,
        },
        jointAngles: {
          shoulder: 174,
          elbow: 91,
          hip: 82,
          knee: 94,
          ankle: 78,
          spine: 176,
        },
        detectedPostureType: "Good Posture",
        detectedIssues: [
          "Slight forward head tilt during standing",
          "Mild thoracic spine rounding under fatigue",
        ],
        recommendations: [
          "Maintain a neutral cervical spine during standing rest",
          "Incorporate face pulls & band pull-aparts for upper back",
          "Strengthen core stability with bird-dogs and dead bugs",
          "Practice hip flexor mobility before heavy squat sessions",
        ],
        exerciseStats: {
          reps: 0,
          correctReps: 0,
          incorrectReps: 0,
          accuracy: 100,
          depth: 0,
          tempo: 0,
          stability: 92,
        },
        duration: 84,
        status: "Completed",
        trainerNotes: "Great posture baseline. Minor forward neck tilt to address in warmups.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        memberId: m1.memberId || "GYM0012",
        athleteId: m1._id || null,
        memberName: m1.athleteName || "Karthik S",
        trainerId: "TR-01",
        trainerName: "Coach Vivek",
        analysisType: "Squat Analysis",
        overallScore: 88,
        postureScore: 85,
        formScore: 89,
        symmetryScore: 92,
        alignmentMetrics: {
          headPosition: 94,
          shoulderAlignment: 89,
          spineAlignment: 84,
          hipAlignment: 91,
          kneeAlignment: 93,
          ankleAlignment: 89,
          bodySymmetry: 90,
        },
        symmetryMetrics: {
          shoulderSymmetry: 93,
          hipSymmetry: 91,
          kneeSymmetry: 95,
          ankleSymmetry: 92,
        },
        jointAngles: {
          shoulder: 176,
          elbow: 92,
          hip: 80,
          knee: 92,
          ankle: 76,
          spine: 178,
        },
        detectedPostureType: "Good Posture",
        detectedIssues: [
          "Slight knee valgus on 3rd rep ascent",
        ],
        recommendations: [
          "Push knees outward over 2nd & 3rd toes at bottom of squat",
          "Keep chest proudly elevated through ascent",
          "Maintain even foot tripod pressure (heel, big toe, pinky toe)",
        ],
        exerciseStats: {
          reps: 18,
          correctReps: 15,
          incorrectReps: 3,
          accuracy: 83,
          depth: 96,
          tempo: 2.3,
          stability: 89,
        },
        duration: 114,
        status: "Completed",
        trainerNotes: "Solid depth and tempo. Cue knee tracking on final 3 reps.",
        createdAt: new Date(),
      },
      {
        memberId: m2.memberId || "GYM0015",
        athleteId: m2._id || null,
        memberName: m2.athleteName || "Priya Raman",
        trainerId: "TR-02",
        trainerName: "Coach Ananya",
        analysisType: "Push-Up Analysis",
        overallScore: 78,
        postureScore: 75,
        formScore: 80,
        symmetryScore: 84,
        alignmentMetrics: {
          headPosition: 82,
          shoulderAlignment: 80,
          spineAlignment: 72,
          hipAlignment: 76,
          kneeAlignment: 88,
          ankleAlignment: 85,
          bodySymmetry: 84,
        },
        symmetryMetrics: {
          shoulderSymmetry: 86,
          hipSymmetry: 84,
          kneeSymmetry: 88,
          ankleSymmetry: 86,
        },
        jointAngles: {
          shoulder: 165,
          elbow: 88,
          hip: 170,
          knee: 178,
          ankle: 80,
          spine: 168,
        },
        detectedPostureType: "Anterior Pelvic Tilt",
        detectedIssues: [
          "Lumbar hyperextension / hip sagging during pushup lockout",
          "Elbows flaring wider than 60 degrees",
        ],
        recommendations: [
          "Squeeze glutes and tuck pelvis to eliminate lower back sag",
          "Tuck elbows into a 45-degree arrow formation",
          "Perform incline pushups to master strict hollow-body posture",
        ],
        exerciseStats: {
          reps: 14,
          correctReps: 10,
          incorrectReps: 4,
          accuracy: 71,
          depth: 88,
          tempo: 2.6,
          stability: 78,
        },
        duration: 92,
        status: "Completed",
        trainerNotes: "Recommend core bracing drills before advancing volume.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ];

    await AIAnalysis.insertMany(samples);
    console.log("✅ Seeded initial AI Body Analysis records");
  } catch (err) {
    console.warn("Could not seed AI Analysis data:", err.message);
  }
}
