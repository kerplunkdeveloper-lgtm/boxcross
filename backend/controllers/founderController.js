const Founder = require('../models/Founder');

// @desc    Get all founders
// @route   GET /api/founders
// @access  Private/Admin
const getFounders = async (req, res) => {
  try {
    const founders = await Founder.find({}).sort({ createdAt: -1 });
    res.json(founders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a founder
// @route   POST /api/founders
// @access  Public
const createFounder = async (req, res) => {
  try {
    const { name, email, phone, paymentStatus, paymentId, price, duration } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const founder = await Founder.create({
      name,
      email,
      phone,
      price,
      duration,
      paymentStatus: paymentStatus || 'Pending',
      paymentId,
    });

    if (founder) {
      res.status(201).json(founder);
    } else {
      res.status(400).json({ message: 'Invalid founder data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update founder
// @route   PUT /api/founders/:id
// @access  Private/Admin
const updateFounder = async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);

    if (founder) {
      founder.name = req.body.name || founder.name;
      founder.email = req.body.email || founder.email;
      founder.phone = req.body.phone || founder.phone;
      founder.paymentStatus = req.body.paymentStatus || founder.paymentStatus;
      
      const updatedFounder = await founder.save();
      res.json(updatedFounder);
    } else {
      res.status(404).json({ message: 'Founder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete founder
// @route   DELETE /api/founders/:id
// @access  Private/Admin
const deleteFounder = async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);

    if (founder) {
      await founder.deleteOne();
      res.json({ message: 'Founder removed' });
    } else {
      res.status(404).json({ message: 'Founder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFounders,
  createFounder,
  updateFounder,
  deleteFounder,
};
