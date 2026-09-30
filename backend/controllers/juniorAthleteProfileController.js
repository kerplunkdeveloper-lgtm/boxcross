const JuniorAthleteProfile = require('../models/JuniorAthleteProfile');

// @desc    Get all junior profiles
// @route   GET /api/juniorprofile
// @access  Public/Private
const getJuniorProfiles = async (req, res) => {
  try {
    const records = await JuniorAthleteProfile.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single junior profile
// @route   GET /api/juniorprofile/:id
// @access  Public/Private
const getJuniorProfile = async (req, res) => {
  try {
    const record = await JuniorAthleteProfile.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new junior profile
// @route   POST /api/juniorprofile
// @access  Public/Private
const createJuniorProfile = async (req, res) => {
  try {
    const record = await JuniorAthleteProfile.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update junior profile
// @route   PUT /api/juniorprofile/:id
// @access  Public/Private
const updateJuniorProfile = async (req, res) => {
  try {
    const record = await JuniorAthleteProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record, message: 'Record updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Delete junior profile
// @route   DELETE /api/juniorprofile/:id
// @access  Public/Private
const deleteJuniorProfile = async (req, res) => {
  try {
    const record = await JuniorAthleteProfile.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getJuniorProfiles,
  getJuniorProfile,
  createJuniorProfile,
  updateJuniorProfile,
  deleteJuniorProfile,
};
