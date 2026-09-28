const mongoose = require("mongoose");

const goalsReadinessSchema = new mongoose.Schema(
  {
    // General Athlete & Session Info
    athleteName: {
      type: String,
      required: [true, "Athlete Name is required"],
      trim: true,
    },
    memberId: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      default: null,
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be realistic"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others", "M", "F", ""],
      default: "Male",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    coach: {
      type: String,
      trim: true,
      default: "Vivek",
    },
    emergencyContactName: {
      type: String,
      trim: true,
      default: "",
    },
    relationship: {
      type: String,
      trim: true,
      default: "",
    },
    emergencyContactNumber: {
      type: String,
      trim: true,
      default: "",
    },
    dominantHand: {
      type: String,
      enum: ["Right", "Left", "Ambidextrous", ""],
      default: "Right",
    },

    // 01 WHAT BROUGHT YOU HERE
    reasons: {
      type: [String],
      default: [],
    },
    inYourOwnWords: {
      type: String,
      trim: true,
      default: "",
    },
    whyNow: {
      type: String,
      trim: true,
      default: "",
    },
    deadline: {
      type: String,
      trim: true,
      default: "",
    },
    triedBefore: {
      type: String,
      trim: true,
      default: "",
    },
    nonNegotiables: {
      type: String,
      trim: true,
      default: "",
    },
    confidence: {
      type: Number,
      min: 1,
      max: 10,
      default: 8,
    },

    // 02 COACH TRANSLATION
    theNumberWeWillUse: {
      type: String,
      trim: true,
      default: "",
    },
    whereItIsToday: {
      type: String,
      trim: true,
      default: "",
    },
    nextBlockTarget: {
      type: String,
      trim: true,
      default: "",
    },
    athleteAgrees: {
      type: Boolean,
      default: true,
    },

    // 03 HEALTH SCREEN
    healthScreen: {
      chestPain: { type: Boolean, default: false },
      dizziness: { type: Boolean, default: false },
      breathlessness: { type: Boolean, default: false },
      heartCondition: { type: Boolean, default: false },
      previousInjury: { type: Boolean, default: false },
      surgeryLast3Months: { type: Boolean, default: false },
      jointOrBackPain: { type: Boolean, default: false },
      regularMedication: { type: Boolean, default: false },
      pregnant: { type: Boolean, default: false },
    },
    detailYesAnswer: {
      type: String,
      trim: true,
      default: "",
    },
    restingHeartRate: {
      type: Number,
      default: null,
    },
    bloodPressure: {
      type: String,
      trim: true,
      default: "",
    },
    bpRetest: {
      type: String,
      trim: true,
      default: "",
    },
    clearedToTest: {
      type: String,
      enum: ["Cleared", "Referred", "Pending"],
      default: "Cleared",
    },

    // Administrative & Notes
    status: {
      type: String,
      enum: ["Completed", "Follow-up Required", "Referred to Doctor", "Draft"],
      default: "Completed",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying & searches
goalsReadinessSchema.index({ athleteName: "text", memberId: "text", coach: "text" });
goalsReadinessSchema.index({ createdAt: -1 });

module.exports = mongoose.model("GoalsReadiness", goalsReadinessSchema);
