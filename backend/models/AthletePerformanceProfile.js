const mongoose = require('mongoose');

const athletePerformanceProfileSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Athlete',
      required: true,
    },
    athleteName: { type: String, required: true },
    memberId: { type: String },
    date: { type: Date, required: true, default: Date.now },
    coach: { type: String, required: true },
    programme: { type: String },
    
    // Category
    category: {
      type: String,
      enum: ['Foundation', 'Development', 'Performance'],
      default: 'Foundation'
    },

    // Metrics
    gripStrength: { type: String },
    estimatedVO2Max: { type: String },
    recoveryHeartRate: { type: String },
    pushUps: { type: String },
    broadJump: { type: String },
    disciplineGrade: { type: String },

    // Text Areas
    yourStrength: { type: String },
    yourPriority: { type: String },
    whatWereProtecting: { type: String },

    // PERFORMANCE PRESCRIPTION
    prescriptionProgramme: { type: String },
    sessionsPerWeek: { type: String },
    zone: { type: String },
    prescriptionCoach: { type: String },
    trainingPriority: { type: String },
    restrictions: { type: String },

    // GOAL
    goalAtBaseline: { type: String },
    stillTheGoal: { type: String, enum: ['Yes', 'No', ''] },
    newGoal: { type: String },
    nextBlockTarget: { type: String },

    // NEXT BENCHMARK
    benchmarkCycle: { type: String, enum: ['90 days', '8 weeks', ''] },
    bookedForDate: { type: Date },

    // PROGRESS TRACKING
    progress: {
      gripStrength: { baseline: String, retest: String, change: String },
      vo2Max: { baseline: String, retest: String, change: String },
      heartRate: { baseline: String, retest: String, change: String },
      pushUps: { baseline: String, retest: String, change: String },
      broadJump: { baseline: String, retest: String, change: String },
      discipline: { baseline: String, retest: String, change: String },
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AthletePerformanceProfile', athletePerformanceProfileSchema);
