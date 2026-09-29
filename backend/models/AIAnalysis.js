const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: [true, "Member ID is required"],
      trim: true,
      uppercase: true,
    },
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      default: null,
    },
    memberName: {
      type: String,
      required: [true, "Member Name is required"],
      trim: true,
    },
    memberPhoto: {
      type: String,
      default: "",
    },
    trainerId: {
      type: String,
      default: "TR-01",
    },
    trainerName: {
      type: String,
      default: "Vivek (Head Coach)",
      trim: true,
    },
    analysisType: {
      type: String,
      required: [true, "Analysis Type is required"],
      default: "Posture Analysis",
    },
    overallScore: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    postureScore: {
      type: Number,
      default: 86,
      min: 0,
      max: 100,
    },
    formScore: {
      type: Number,
      default: 82,
      min: 0,
      max: 100,
    },
    symmetryScore: {
      type: Number,
      default: 88,
      min: 0,
      max: 100,
    },
    alignmentMetrics: {
      headPosition: { type: Number, default: 92 },
      shoulderAlignment: { type: Number, default: 86 },
      spineAlignment: { type: Number, default: 74 },
      hipAlignment: { type: Number, default: 89 },
      kneeAlignment: { type: Number, default: 91 },
      ankleAlignment: { type: Number, default: 88 },
      bodySymmetry: { type: Number, default: 82 },
    },
    symmetryMetrics: {
      shoulderSymmetry: { type: Number, default: 92 },
      hipSymmetry: { type: Number, default: 88 },
      kneeSymmetry: { type: Number, default: 94 },
      ankleSymmetry: { type: Number, default: 90 },
    },
    mobilityMetrics: {
      shoulderMobility: { type: String, default: "Good" },
      hipMobility: { type: String, default: "Moderate" },
      kneeMobility: { type: String, default: "Good" },
      ankleMobility: { type: String, default: "Needs Attention" },
      trunkMobility: { type: String, default: "Good" },
    },
    jointAngles: {
      shoulder: { type: Number, default: 174 },
      elbow: { type: Number, default: 91 },
      hip: { type: Number, default: 82 },
      knee: { type: Number, default: 94 },
      ankle: { type: Number, default: 78 },
      spine: { type: Number, default: 176 },
    },
    detectedPostureType: {
      type: String,
      default: "Good Posture",
    },
    detectedIssues: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    exerciseStats: {
      reps: { type: Number, default: 0 },
      correctReps: { type: Number, default: 0 },
      incorrectReps: { type: Number, default: 0 },
      accuracy: { type: Number, default: 100 },
      depth: { type: Number, default: 90 },
      tempo: { type: Number, default: 2.4 },
      stability: { type: Number, default: 88 },
    },
    duration: {
      type: Number,
      default: 60, // in seconds
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Needs Review"],
      default: "Completed",
    },
    trainerNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query on memberId and createdAt
aiAnalysisSchema.index({ memberId: 1, createdAt: -1 });

module.exports = mongoose.model("AIAnalysis", aiAnalysisSchema);
