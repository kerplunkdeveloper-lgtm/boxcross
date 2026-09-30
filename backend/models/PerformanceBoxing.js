const mongoose = require('mongoose');

const performanceBoxingSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Athlete',
      required: true,
    },
    athleteName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    coach: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },

    // D1 COMPETITION STATUS
    walkAroundWeight: { type: Number },
    competitionWeight: { type: Number },
    weightClass: { type: String },
    stance: { type: String, enum: ['Orthodox', 'Southpaw', ''] },
    boutsToDate: { type: Number },
    recordW: { type: Number },
    recordL: { type: Number },
    lastBoutDate: { type: Date },
    nextTargetCompetition: { type: String },

    // D2 TECHNICAL GRADES (1-5)
    stanceAndGuardFresh: { type: Number, min: 1, max: 5 },
    stanceAndGuardFreshNote: { type: String },
    stanceAndGuardRound3: { type: Number, min: 1, max: 5 },
    stanceAndGuardRound3Note: { type: String },
    jabCrossMechanics: { type: Number, min: 1, max: 5 },
    jabCrossMechanicsNote: { type: String },
    footworkDrill: { type: Number, min: 1, max: 5 },
    footworkDrillNote: { type: String },
    defensiveMovement: { type: Number, min: 1, max: 5 },
    defensiveMovementNote: { type: String },
    ringCraft: { type: Number, min: 1, max: 5 },
    ringCraftNote: { type: String },

    // D3 OUTPUT & DECAY
    r1PunchCount: { type: Number },
    r1HR: { type: Number },
    r2PunchCount: { type: Number },
    r2HR: { type: Number },
    r3PunchCount: { type: Number },
    r3HR: { type: Number },
    outputDecay: { type: Number }, // R3 as % of R1

    // D4 SKILL UNDER PRESSURE
    padAccuracy: { type: String },
    reactionDrill: { type: String },
    defensiveSuccess: { type: String },
    skipping: { type: Boolean },
    sparringClearance: { type: Boolean },
    sparringClearanceDate: { type: Date },

    // HEADLINE BENCHMARK
    headlineOutputDecay: { type: Number },
    disciplineGrade: { type: Number }, // Average of coach grades
    nextBenchmarkDate: { type: Date },

    // COACH NOTES
    coachNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PerformanceBoxing', performanceBoxingSchema);
