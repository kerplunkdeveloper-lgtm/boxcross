const HybridPerformance = require('../models/HybridPerformance');

// @desc    Get all Hybrid Performance records
// @route   GET /api/hybridperformance
// @access  Public/Private
const getHybridPerformances = async (req, res) => {
  try {
    const records = await HybridPerformance.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single Hybrid Performance record
// @route   GET /api/hybridperformance/:id
// @access  Public/Private
const getHybridPerformance = async (req, res) => {
  try {
    const record = await HybridPerformance.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new Hybrid Performance record
// @route   POST /api/hybridperformance
// @access  Public/Private
const createHybridPerformance = async (req, res) => {
  try {
    const record = await HybridPerformance.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update Hybrid Performance record
// @route   PUT /api/hybridperformance/:id
// @access  Public/Private
const updateHybridPerformance = async (req, res) => {
  try {
    const record = await HybridPerformance.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Hybrid Performance record
// @route   DELETE /api/hybridperformance/:id
// @access  Public/Private
const deleteHybridPerformance = async (req, res) => {
  try {
    const record = await HybridPerformance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getHybridPerformances,
  getHybridPerformance,
  createHybridPerformance,
  updateHybridPerformance,
  deleteHybridPerformance,
};
