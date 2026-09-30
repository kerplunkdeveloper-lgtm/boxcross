const mongoose = require('mongoose');

const strengthLabSchema = new mongoose.Schema(
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

    // D1 BENCHMARK LIFTS (5RM)
    backSquat5RM: { type: Number },
    benchPress5RM: { type: Number },
    deadlift5RM: { type: Number },
    overheadPress5RM: { type: Number },
    bentOverRow5RM: { type: Number },

    // D2 RELATIVE STRENGTH
    bodyweight: { type: Number }, // To calculate ratio
    squatRatio: { type: Number },
    deadliftRatio: { type: Number },
    benchRatio: { type: Number },

    // D3 WORK CAPACITY
    pullUps: { type: String },
    farmersCarry: { type: String },
    plankHold: { type: Number }, // in seconds

    // D4 LIFTING TECHNIQUE (1-5)
    bracingAndBreath: { type: Number, min: 1, max: 5 },
    bracingAndBreathNote: { type: String },
    barPath: { type: Number, min: 1, max: 5 },
    barPathNote: { type: String },
    depthAndLockout: { type: Number, min: 1, max: 5 },
    depthAndLockoutNote: { type: String },
    tempoControl: { type: Number, min: 1, max: 5 },
    tempoControlNote: { type: String },

    // HEADLINE BENCHMARK
    headlineDeadliftRatio: { type: Number },
    disciplineGrade: { type: Number }, // Average of coach grades
    nextBenchmarkDate: { type: Date },

    // COACH NOTES
    coachNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StrengthLab', strengthLabSchema);
