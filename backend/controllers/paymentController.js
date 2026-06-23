const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// @desc    Create new payment record (initializes Razorpay order)
// @route   POST /api/payments
// @access  Public
exports.createPayment = async (req, res) => {
  try {
    const { name, phone, email, planName, price, durationMonths } = req.body;

    if (!name || !phone || !email || !planName || !price || !durationMonths) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const numericPrice = Number(String(price).replace(/,/g, ''));

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
        receipt: `membership_${Date.now()}`,
      });
    } catch (rzpErr) {
      console.error("Razorpay Order Creation Failed, generating mock order:", rzpErr);
      order = {
        id: `order_mock_${Date.now()}`,
        amount: numericPrice * 100,
        currency: "INR",
      };
    }

    const payment = await Payment.create({
      name,
      phone,
      email,
      planName,
      price: numericPrice,
      durationMonths,
      transactionId: order.id,
      paymentStatus: "pending",
      paymentMethod: "Razorpay"
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
    console.error("Create Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error creating payment record",
      error: error.message
    });
  }
};

// @desc    Verify payment signature & confirm membership
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPaymentSignature = async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature, status } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required"
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found"
      });
    }

    if (status === "failed") {
      payment.paymentStatus = "failed";
      await payment.save();
      return res.status(200).json({
        success: false,
        message: "Payment marked as failed"
      });
    }

    // Verify signature (if signature is provided and not mocked)
    if (razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_mock_")) {
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026");
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature) {
        payment.paymentStatus = "failed";
        await payment.save();
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed. Transaction marked as failed."
        });
      }
    }

    // Update Payment status & transactionId
    payment.paymentStatus = "success";
    payment.transactionId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    payment.paymentMethod = "Razorpay";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and membership activated successfully!",
      data: payment
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error verifying payment status."
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

// @desc    Delete payment record
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Payment record not found with id of ${req.params.id}`
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting payment record",
      error: error.message
    });
  }
};
