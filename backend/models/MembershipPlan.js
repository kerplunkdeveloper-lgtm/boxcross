const mongoose = require("mongoose");

const planOptionSchema = new mongoose.Schema({
  months: { type: String, required: true },
  subtitle: { type: String, default: "" },
  price: { type: String, required: true },
  perMonth: { type: String, required: true },
  originalPrice: { type: String, default: "" },
  totalPrice: { type: String, default: "" },
  highlights: [{ type: String }],
  tag: { type: String, default: "" },
  buttonText: { type: String, default: "CHOOSE PLAN" },
  isPopular: { type: Boolean, default: false }
});

const membershipPlanSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    sessionInfo: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    starterPrice: {
      type: String,
      required: true
    },
    dailyRate: {
      type: String,
      default: ""
    },
    dailyRateLabel: {
      type: String,
      default: "A DAY AS A FOUNDING MEMBER"
    },
    dailyComparison: {
      type: String,
      default: ""
    },
    features: [{ type: String }],
    benefits: [
      {
        boldText: { type: String, default: "" },
        normalText: { type: String, default: "" }
      }
    ],
    plans: [planOptionSchema],
    isComingSoon: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema);

