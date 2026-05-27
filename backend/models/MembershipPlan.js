const mongoose = require("mongoose");

const planOptionSchema = new mongoose.Schema({
  months: { type: String, required: true },
  subtitle: { type: String, required: true },
  price: { type: String, required: true },
  perMonth: { type: String, required: true },
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
    features: [{ type: String }],
    plans: [planOptionSchema],
    starterPrice: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MembershipPlan", membershipPlanSchema);
