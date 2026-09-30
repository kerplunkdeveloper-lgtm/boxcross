const mongoose = require('mongoose');

const hybridPerformanceSchema = new mongoose.Schema(
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

    // D1 BOXING TECHNIQUE (1-5)
    stanceAndGuard: { type: Number, min: 1, max: 5 },
    stanceAndGuardNote: { type: String },
    jabCrossMechanics: { type: Number, min: 1, max: 5 },
    jabCrossMechanicsNote: { type: String },
    footworkDrill: { type: Number, min: 1, max: 5 },
    footworkDrillNote: { type: String },
    defensiveMovement: { type: Number, min: 1, max: 5 },
    defensiveMovementNote: { type: String },

    // D2 STRENGTH (Measured - RECORD)
    squat5RM: { type: String }, // kg
    deadlift5RM: { type: String }, // kg
    pullUps: { type: String }, // max reps
    pushUps: { type: String }, // max clean reps

    // D3 COMPROMISED OUTPUT
    bagRoundFresh: { type: Number }, // punch count
    bagRoundFatigued: { type: Number }, // punch count
    outputRetained: { type: Number }, // Fatigued as % of fresh

    // HEADLINE BENCHMARK
    headlineOutputRetained: { type: Number }, // same as outputRetained
    disciplineGrade: { type: Number }, // Average of coach grades (D1)
    nextBenchmarkDate: { type: Date },

    // COACH NOTES
    coachNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HybridPerformance', hybridPerformanceSchema);
