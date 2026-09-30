const HyroxLab = require('../models/HyroxLab');

// @desc    Get all Hyrox Lab records
// @route   GET /api/hyroxlab
// @access  Public/Private
const getHyroxLabs = async (req, res) => {
  try {
    const records = await HyroxLab.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single Hyrox Lab record
// @route   GET /api/hyroxlab/:id
// @access  Public/Private
const getHyroxLab = async (req, res) => {
  try {
    const record = await HyroxLab.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new Hyrox Lab record
// @route   POST /api/hyroxlab
// @access  Public/Private
const createHyroxLab = async (req, res) => {
  try {
    const record = await HyroxLab.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update Hyrox Lab record
// @route   PUT /api/hyroxlab/:id
// @access  Public/Private
const updateHyroxLab = async (req, res) => {
  try {
    const record = await HyroxLab.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Hyrox Lab record
// @route   DELETE /api/hyroxlab/:id
// @access  Public/Private
const deleteHyroxLab = async (req, res) => {
  try {
    const record = await HyroxLab.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getHyroxLabs,
  getHyroxLab,
  createHyroxLab,
  updateHyroxLab,
  deleteHyroxLab,
};
