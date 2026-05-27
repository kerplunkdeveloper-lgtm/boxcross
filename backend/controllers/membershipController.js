const MembershipPlan = require("../models/MembershipPlan");

// @desc    Get all membership plans
// @route   GET /api/memberships
// @access  Public
exports.getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({});
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching membership plans",
      error: error.message
    });
  }
};

// @desc    Get single membership plan by key
// @route   GET /api/memberships/:key
// @access  Public
exports.getMembershipPlanByKey = async (req, res) => {
  try {
    const plan = await MembershipPlan.findOne({ key: req.params.key });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with key of ${req.params.key}`
      });
    }
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Update membership plan
// @route   PUT /api/memberships/:id
// @access  Private/Admin
exports.updateMembershipPlan = async (req, res) => {
  try {
    let plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with id of ${req.params.id}`
      });
    }

    plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating membership plan",
      error: error.message
    });
  }
};
