const mongoose = require('mongoose');

const fightClubSchema = new mongoose.Schema(
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
    // D1 Boxing Technique (1-5)
    stanceAndGuard: { type: Number, min: 1, max: 5 },
    stanceAndGuardNote: { type: String },
    jabCrossMechanics: { type: Number, min: 1, max: 5 },
    jabCrossMechanicsNote: { type: String },
    footworkDrill: { type: Number, min: 1, max: 5 },
    footworkDrillNote: { type: String },
    defensiveMovement: { type: Number, min: 1, max: 5 },
    defensiveMovementNote: { type: String },
    
    // D2 Boxing Output
    threeMinBagRound: { type: Number },
    paceConsistency: { type: String },
    skipping: { type: String },
    roundsCompleted: { type: Number },
    handWrapAndGuard: { type: Boolean },
    
    // Headline Benchmark
    disciplineGrade: { type: Number }, // Average of coach grades 1-5
    nextBenchmarkDate: { type: Date },
    
    // Coach Notes
    coachNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FightClub', fightClubSchema);
