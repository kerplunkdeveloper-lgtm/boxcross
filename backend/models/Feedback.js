const mongoose = require("mongoose");

// Anonymous member feedback. Deliberately stores NO name, phone, email,
// membership ID, IP address or device identifier.

const CONNECTIONS = ["Existing member", "Trial visitor", "Former member", "Guest / Event participant"];
const PROGRAMMES = ["Boxing", "Strength Training", "Hybrid / Conditioning", "Personal Training", "Other / Not applicable"];
const IMPROVEMENT_AREAS = [
  "Coaching and trainer support",
  "Equipment availability and maintenance",
  "Cleanliness and washrooms",
  "Air conditioning, ventilation and music",
  "Class timings and overcrowding",
  "Front desk and communication",
  "Membership plans and value",
  "Nothing specific",
];
const SAFETY_ANSWERS = ["Yes", "No", "Prefer not to say"];
const STATUSES = ["Open", "In Progress", "Resolved"];

const rating = { type: Number, min: 1, max: 5, default: null };
const freeText = { type: String, trim: true, default: "", maxlength: 5000 };

const feedbackSchema = new mongoose.Schema(
  {
    connection: { type: String, enum: [...CONNECTIONS, ""], default: "" },
    programme: { type: String, enum: [...PROGRAMMES, ""], default: "" },
    ratings: {
      overall: rating,
      coaching: rating,
      equipment: rating,
      cleanliness: rating,
      timings: rating,
    },
    improvementArea: { type: String, enum: [...IMPROVEMENT_AREAS, ""], default: "" },
    lovedMost: freeText,
    changeOne: freeText,
    newIdeas: freeText,
    anythingElse: freeText,
    safetyConcern: { type: String, enum: [...SAFETY_ANSWERS, ""], default: "" },
    safetyDetails: freeText,

    // Management-only fields
    status: { type: String, enum: STATUSES, default: "Open" },
    adminNotes: { type: String, trim: true, default: "", maxlength: 5000 },
  },
  { timestamps: true }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ status: 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
module.exports.FEEDBACK_OPTIONS = { CONNECTIONS, PROGRAMMES, IMPROVEMENT_AREAS, SAFETY_ANSWERS, STATUSES };
