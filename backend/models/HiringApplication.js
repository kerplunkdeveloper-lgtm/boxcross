const mongoose = require("mongoose");

const hiringApplicationSchema = new mongoose.Schema(
  {
    // Unique human-readable Tracking ID (e.g. BXC-APP-1729760000-842)
    applicationId: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      default: () => {
        const timestamp = Date.now().toString().slice(-6);
        const randomHex = Math.floor(1000 + Math.random() * 9000);
        return `BXC-APP-${timestamp}-${randomHex}`;
      },
    },

    // ----------------------------------------------------
    // Section 1 — Personal Details
    // ----------------------------------------------------
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Mobile Number / WhatsApp is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },
    is18Plus: {
      type: Boolean,
      required: [true, "Age confirmation (18+) is required"],
      default: false,
    },
    currentLocation: {
      type: String,
      required: [true, "Current Location is required"],
      trim: true,
    },

    // ----------------------------------------------------
    // Section 2 — Position Applying For
    // ----------------------------------------------------
    // Supports one or multiple selected roles
    positions: {
      type: [String],
      required: [true, "At least one position must be selected"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one position must be selected",
      },
    },
    otherPosition: {
      type: String,
      trim: true,
      default: "",
    },

    // ----------------------------------------------------
    // Section 3 — Experience & Qualifications
    // ----------------------------------------------------
    highestEducation: {
      type: String,
      trim: true,
      default: "",
    },
    totalExperience: {
      type: String,
      trim: true,
      default: "",
    },
    previousCompany: {
      type: String,
      trim: true,
      default: "",
    },
    certifications: {
      type: String,
      trim: true,
      default: "",
    },
    skillsDescription: {
      type: String,
      trim: true,
      default: "",
    },
    languagesKnown: {
      type: [String],
      default: [],
    },
    // Coaching specific question: Experience coaching beginners, amateur athletes or competitive athletes
    coachingExperience: {
      type: [String],
      default: [],
    },
    // Optional role-specific screening Q&A (e.g. for Boxing, Strength, Front Desk)
    roleSpecificAnswers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ----------------------------------------------------
    // Section 4 — Availability & Expectations
    // ----------------------------------------------------
    currentEmploymentStatus: {
      type: String,
      trim: true,
      default: "",
    },
    whenCanYouJoin: {
      type: String,
      trim: true,
      default: "",
    },
    preferredShift: {
      type: String,
      trim: true,
      default: "Flexible",
    },
    expectedSalary: {
      type: String,
      trim: true,
      default: "",
    },
    willingToWorkInPuducherry: {
      type: Boolean,
      default: true,
    },

    // ----------------------------------------------------
    // Section 5 — Resume & Portfolio
    // ----------------------------------------------------
    resume: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      originalName: { type: String, default: "" },
      fileType: { type: String, default: "" },
      fileSize: { type: Number, default: 0 },
    },
    portfolioLink: {
      type: String,
      trim: true,
      default: "",
    },
    certificatesUrl: {
      type: String,
      trim: true,
      default: "",
    },
    additionalInfo: {
      type: String,
      trim: true,
      default: "",
    },

    // ----------------------------------------------------
    // Section 6 — Final Confirmation
    // ----------------------------------------------------
    declarationAgreed: {
      type: Boolean,
      required: [true, "You must agree to the declaration before submitting"],
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "You must accept the declaration to proceed",
      },
    },
    declarationText: {
      type: String,
      default:
        "I confirm that the information provided is accurate and agree to be contacted by the BXC hiring team regarding my application.",
    },

    // ----------------------------------------------------
    // Administrative Status & Tracking
    // ----------------------------------------------------
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Hired",
      ],
      default: "Submitted",
      index: true,
    },
    adminNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: "Admin" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    interviewDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: auto-generate unique applicationId if not provided
hiringApplicationSchema.pre("validate", function (next) {
  if (!this.applicationId) {
    const timestamp = Date.now().toString().slice(-6);
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    this.applicationId = `BXC-APP-${timestamp}-${randomHex}`;
  }
  next();
});

// Virtual helper for simple resume link access
hiringApplicationSchema.virtual("resumeUrl").get(function () {
  return this.resume?.url || "";
});

module.exports = mongoose.model("HiringApplication", hiringApplicationSchema);
