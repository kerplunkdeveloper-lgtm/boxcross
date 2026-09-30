const PerformanceBoxing = require('../models/PerformanceBoxing');

// @desc    Get all Performance Boxing records
// @route   GET /api/performanceboxing
// @access  Public/Private
const getPerformanceBoxings = async (req, res) => {
  try {
    const records = await PerformanceBoxing.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single Performance Boxing record
// @route   GET /api/performanceboxing/:id
// @access  Public/Private
const getPerformanceBoxing = async (req, res) => {
  try {
    const record = await PerformanceBoxing.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new Performance Boxing record
// @route   POST /api/performanceboxing
// @access  Public/Private
const createPerformanceBoxing = async (req, res) => {
  try {
    const record = await PerformanceBoxing.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update Performance Boxing record
// @route   PUT /api/performanceboxing/:id
// @access  Public/Private
const updatePerformanceBoxing = async (req, res) => {
  try {
    const record = await PerformanceBoxing.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Performance Boxing record
// @route   DELETE /api/performanceboxing/:id
// @access  Public/Private
const deletePerformanceBoxing = async (req, res) => {
  try {
    const record = await PerformanceBoxing.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getPerformanceBoxings,
  getPerformanceBoxing,
  createPerformanceBoxing,
  updatePerformanceBoxing,
  deletePerformanceBoxing,
};
