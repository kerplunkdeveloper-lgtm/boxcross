const AthletePerformanceProfile = require('../models/AthletePerformanceProfile');

// @desc    Get all profiles
// @route   GET /api/athleteprofile
// @access  Public/Private
const getProfiles = async (req, res) => {
  try {
    const records = await AthletePerformanceProfile.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single profile
// @route   GET /api/athleteprofile/:id
// @access  Public/Private
const getProfile = async (req, res) => {
  try {
    const record = await AthletePerformanceProfile.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new profile
// @route   POST /api/athleteprofile
// @access  Public/Private
const createProfile = async (req, res) => {
  try {
    const record = await AthletePerformanceProfile.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/athleteprofile/:id
// @access  Public/Private
const updateProfile = async (req, res) => {
  try {
    const record = await AthletePerformanceProfile.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete profile
// @route   DELETE /api/athleteprofile/:id
// @access  Public/Private
const deleteProfile = async (req, res) => {
  try {
    const record = await AthletePerformanceProfile.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};
