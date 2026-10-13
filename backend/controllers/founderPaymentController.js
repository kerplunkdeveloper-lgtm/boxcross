const FounderPayment = require("../models/FounderPayment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// @desc    Create new founder payment record (initializes Razorpay order)
// @route   POST /api/founder-payments
// @access  Public
exports.createFounderPayment = async (req, res) => {
  try {
    const { name, phone, email, planName, price, durationMonths, founderTier } = req.body;

    if (!name || !phone || !email || !planName || !price || !durationMonths) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const numericPrice = Number(String(price).replace(/,/g, ""));

    // Initialize Razorpay and create order
    let order;
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_BoxCross2026",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026",
      });

      const amountInPaise = Math.round(numericPrice * 100);
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `founder_${Date.now()}`,
      });
    } catch (rzpErr) {
      console.error("Razorpay Founder Order Creation Failed, fallback mock:", rzpErr.message);
      order = {
        id: `order_founder_mock_${Date.now()}`,
        amount: numericPrice * 100,
        currency: "INR",
      };
    }

    const payment = await FounderPayment.create({
      name,
      phone,
      email,
      planName,
      price: numericPrice,
      durationMonths,
      transactionId: order.id,
      paymentStatus: "pending",
      paymentMethod: "Razorpay",
      founderTier: founderTier || "Founding Member"
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_BoxCross2026",
      data: payment
    });
  } catch (error) {
    console.error("Create Founder Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error creating founder payment record",
      error: error.message
    });
  }
};

// @desc    Verify founder payment signature
// @route   POST /api/founder-payments/verify
// @access  Public
exports.verifyFounderPaymentSignature = async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature, status } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

    const payment = await FounderPayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Founder payment record not found"
      });
    }

    if (status === "failed") {
      payment.paymentStatus = "failed";
      await payment.save();
      return res.status(200).json({
        success: false,
        message: "Founder payment marked as failed"
      });
    }

    // Verify signature (if signature is provided and not mocked)
    if (razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_founder_mock_")) {
      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026"
      );
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature) {
        payment.paymentStatus = "failed";
        await payment.save();
        return res.status(400).json({
          success: false,
          message: "Signature verification failed. Transaction marked as failed."
        });
      }
    }

    // Update payment status & transactionId
    payment.paymentStatus = "success";
    payment.transactionId = razorpayPaymentId || `pay_founder_mock_${Date.now()}`;
    payment.paymentMethod = "Razorpay";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Founder membership payment verified and membership activated!",
      data: payment
    });
  } catch (error) {
    console.error("Verify Founder Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error verifying founder payment status."
    });
  }
};

// @desc    Get all founder payments
// @route   GET /api/founder-payments
// @access  Private/Admin
exports.getFounderPayments = async (req, res) => {
  try {
    const payments = await FounderPayment.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching founder payments",
      error: error.message
    });
  }
};

// @desc    Update founder payment status
// @route   PUT /api/founder-payments/:id
// @access  Private/Admin
exports.updateFounderPayment = async (req, res) => {
  try {
    const payment = await FounderPayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Founder payment record not found with id of ${req.params.id}`
      });
    }

    const updated = await FounderPayment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating founder payment",
      error: error.message
    });
  }
};

// @desc    Delete founder payment record
// @route   DELETE /api/founder-payments/:id
// @access  Private/Admin
exports.deleteFounderPayment = async (req, res) => {
  try {
    const payment = await FounderPayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Founder payment record not found with id of ${req.params.id}`
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Founder payment record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting founder payment record",
      error: error.message
    });
  }
};
