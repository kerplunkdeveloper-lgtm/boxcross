const mongoose = require('mongoose');

const juniorAthleteProfileSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Athlete',
      required: true,
    },
    athleteName: { type: String, required: true },
    age: { type: Number },
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
    coordination: { type: String },
    balance: { type: String },
    acceleration: { type: String },
    broadJump: { type: String },
    bodyweightStrength: { type: String },
    recoveryHeartRate: { type: String },

    // Text Areas
    greatAt: { type: String },
    workingOn: { type: String },
    watching: { type: String },

    // YOUR TRAINING
    trainingProgramme: { type: String },
    sessionsPerWeek: { type: String },
    trainingCoach: { type: String },
    group: { type: String },
    coachabilityScore: { type: String },
    boxingGrade: { type: String },
    focusNextBlock: { type: String },
    protecting: { type: String },

    // NEXT BENCHMARK
    bookedForDate: { type: Date },

    // PROGRESS TRACKING
    progress: {
      coordination: { baseline: String, retest: String, change: String },
      balance: { baseline: String, retest: String, change: String },
      acceleration: { baseline: String, retest: String, change: String },
      broadJump: { baseline: String, retest: String, change: String },
      pushUps: { baseline: String, retest: String, change: String },
      heartRate: { baseline: String, retest: String, change: String },
      coachability: { baseline: String, retest: String, change: String },
    },

    // PARENT / GUARDIAN REVIEW
    growthNote: { type: String },
    whatYouWillSeeAtHome: { type: String },
    reviewedWithParent: { type: Boolean, default: false },
    signature: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JuniorAthleteProfile', juniorAthleteProfileSchema);
