const Payment = require("../models/Payment");

// @desc    Create new payment record
// @route   POST /api/payments
// @access  Public
exports.createPayment = async (req, res) => {
  try {
    const { name, phone, email, planName, price, durationMonths, transactionId, paymentStatus, paymentMethod } = req.body;

    if (!name || !phone || !email || !planName || !price || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const payment = await Payment.create({
      name,
      phone,
      email,
      planName,
      price,
      durationMonths,
      transactionId,
      paymentStatus: paymentStatus || "pending",
      paymentMethod: paymentMethod || "UPI"
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    // Handle duplicate key (transactionId)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error creating payment record",
      error: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching payments",
      error: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private/Admin
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Payment record not found with id of ${req.params.id}`
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating payment status",
      error: error.message
    });
  }
};
