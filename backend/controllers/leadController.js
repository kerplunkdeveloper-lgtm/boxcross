const Lead = require("../models/Lead");

// @desc    Create a new lead (After OTP Verification)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const lead = await Lead.create({
      name,
      phone,
      verified: true
    });

    if (req.io) {
      req.io.emit("data_updated", { type: "leads", action: "create", data: lead });
    }

    res.status(201).json({
      success: true,
      message: "User information saved successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all captured user info
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createLead, getLeads };
