const mongoose = require('mongoose');

const hyroxLabSchema = new mongoose.Schema(
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

    // D1 RACE STATIONS (Measured - RECORD)
    skiErg: { type: String }, // time
    row: { type: String }, // time
    sledPush: { type: String }, // time
    sledPull: { type: String }, // time
    burpeeBroadJump: { type: String }, // time
    farmersCarry: { type: String }, // time
    sandbagLunges: { type: String }, // time
    wallBalls: { type: String }, // max reps

    // D2 STATION TECHNIQUE (1-5)
    runningEfficiency: { type: Number, min: 1, max: 5 },
    runningEfficiencyNote: { type: String },
    stationTechnique: { type: Number, min: 1, max: 5 },
    stationTechniqueNote: { type: String },
    transitionControl: { type: Number, min: 1, max: 5 },
    transitionControlNote: { type: String },
    pacingDiscipline: { type: Number, min: 1, max: 5 },
    pacingDisciplineNote: { type: String },

    // D3 RUNNING
    run1kmFresh: { type: String }, // time
    run1kmCompromised: { type: String }, // time
    compromisedPenalty: { type: String }, // difference in seconds

    // D4 RACE READINESS
    targetRace: { type: String },
    raceDate: { type: Date },
    division: { type: String, enum: ['Open', 'Pro', 'Doubles', ''] },
    targetFinishTime: { type: String },
    totalStationTime: { type: String },

    // HEADLINE BENCHMARK
    headlineTotalStationTime: { type: String },
    disciplineGrade: { type: Number }, // Average of coach grades
    nextBenchmarkDate: { type: Date },

    // COACH NOTES
    coachNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HyroxLab', hyroxLabSchema);
