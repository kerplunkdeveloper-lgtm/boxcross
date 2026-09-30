const StrengthLab = require('../models/StrengthLab');

// @desc    Get all Strength Lab records
// @route   GET /api/strengthlab
// @access  Public/Private
const getStrengthLabs = async (req, res) => {
  try {
    const records = await StrengthLab.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single Strength Lab record
// @route   GET /api/strengthlab/:id
// @access  Public/Private
const getStrengthLab = async (req, res) => {
  try {
    const record = await StrengthLab.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new Strength Lab record
// @route   POST /api/strengthlab
// @access  Public/Private
const createStrengthLab = async (req, res) => {
  try {
    const record = await StrengthLab.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update Strength Lab record
// @route   PUT /api/strengthlab/:id
// @access  Public/Private
const updateStrengthLab = async (req, res) => {
  try {
    const record = await StrengthLab.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Strength Lab record
// @route   DELETE /api/strengthlab/:id
// @access  Public/Private
const deleteStrengthLab = async (req, res) => {
  try {
    const record = await StrengthLab.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStrengthLabs,
  getStrengthLab,
  createStrengthLab,
  updateStrengthLab,
  deleteStrengthLab,
};
