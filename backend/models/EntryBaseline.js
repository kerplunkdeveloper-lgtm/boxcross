const mongoose = require("mongoose");

const entryBaselineSchema = new mongoose.Schema(
  {
    // General Info / Enquiry / Walk-in
    name: {
      type: String,
      required: [true, "Name is required"],
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
      enum: ["M", "F", "Male", "Female", "Other", ""],
      default: "M",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    coach: {
      type: String,
      trim: true,
      default: "",
    },

    // 01 GOAL (0-5 MIN - SEATED)
    goals: {
      type: [String],
      default: [],
    },
    inTheirOwnWords: {
      type: String,
      trim: true,
      default: "",
    },
    whyNow: {
      type: String,
      trim: true,
      default: "",
    },
    triedBefore: {
      type: String,
      trim: true,
      default: "",
    },
    wontDoCantDo: {
      type: String,
      trim: true,
      default: "",
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

    // 03 HEALTH SCREEN (5-7 MIN - BP ONLY AFTER 5 MIN SEATED)
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
    detailAnyYes: {
      type: String,
      trim: true,
      default: "",
    },
    restingHR: {
      type: Number,
      default: null,
    },
    bloodPressure: {
      type: String,
      trim: true,
      default: "",
    },
    clearedToTest: {
      type: String,
      enum: ["YES", "NO - REFER"],
      default: "YES",
    },

    // 04 MOVEMENT SCREEN (7-11 MIN)
    movementScreen: {
      overheadSquat: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
      },
      singleLegStepDown: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
      },
      shoulderMobility: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
      },
      hipHinge: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
      },
      trunkControl: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
        seconds: { type: Number, default: null },
      },
      balance: {
        result: { type: String, enum: ["PASS", "MODIFY", "REFER", ""], default: "PASS" },
        note: { type: String, default: "" },
        seconds: { type: Number, default: null },
      },
    },

    // 05 THE FOUR NUMBERS (11-16 MIN)
    gripLeft: {
      type: Number,
      default: null,
    },
    gripRight: {
      type: Number,
      default: null,
    },
    gripStrongerHand: {
      type: Number,
      default: null,
    },
    pushUps: {
      type: Number,
      default: null,
    },
    waist: {
      type: Number,
      default: null,
    },
    stepTest: {
      pulse15Sec: { type: Number, default: null },
      hrAtFinish: { type: Number, default: null },
      hrAfter60Sec: { type: Number, default: null },
      recoveryHR: { type: Number, default: null },
      estVo2Max: { type: Number, default: null },
    },

    // 06 CLOSE (16-20 MIN)
    level: {
      type: String,
      enum: ["FOUND", "DEVEL", "PERF", "Foundation", "Development", "Performance", ""],
      default: "FOUND",
    },
    programmeSuggested: {
      type: String,
      trim: true,
      default: "",
    },
    oneThingGoodAt: {
      type: String,
      trim: true,
      default: "",
    },
    oneThingWorkOnFirst: {
      type: String,
      trim: true,
      default: "",
    },
    fullAssessmentBooked: {
      type: String,
      trim: true,
      default: "",
    },
    cardHandedOver: {
      type: Boolean,
      default: true,
    },
    joinedToday: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: String,
      trim: true,
      default: "",
    },
    enteredToTracker: {
      type: Boolean,
      default: true,
    },

    // Card Specific fields (Page 2 Handout)
    cardNotes: {
      youAreAlreadyGoodAt: { type: String, default: "" },
      weStartHere: { type: String, default: "" },
      wereProtecting: { type: String, default: "" },
      whatYouToldUs: { type: String, default: "" },
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

// High-speed text & sorting indexes
entryBaselineSchema.index({ name: "text", phone: "text", coach: "text", memberId: "text" });
entryBaselineSchema.index({ createdAt: -1 });

module.exports = mongoose.model("EntryBaseline", entryBaselineSchema);
