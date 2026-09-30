const FightClub = require('../models/FightClub');

// @desc    Get all Fight Club records
// @route   GET /api/fightclub
// @access  Public/Private
const getFightClubs = async (req, res) => {
  try {
    const records = await FightClub.find().populate('athlete', 'athleteName memberId').sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single Fight Club record
// @route   GET /api/fightclub/:id
// @access  Public/Private
const getFightClub = async (req, res) => {
  try {
    const record = await FightClub.findById(req.params.id).populate('athlete', 'athleteName memberId');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new Fight Club record
// @route   POST /api/fightclub
// @access  Public/Private
const createFightClub = async (req, res) => {
  try {
    const record = await FightClub.create(req.body);
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update Fight Club record
// @route   PUT /api/fightclub/:id
// @access  Public/Private
const updateFightClub = async (req, res) => {
  try {
    const record = await FightClub.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Fight Club record
// @route   DELETE /api/fightclub/:id
// @access  Public/Private
const deleteFightClub = async (req, res) => {
  try {
    const record = await FightClub.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getFightClubs,
  getFightClub,
  createFightClub,
  updateFightClub,
  deleteFightClub,
};
