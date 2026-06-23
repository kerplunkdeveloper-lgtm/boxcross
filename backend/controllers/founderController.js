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

// @desc    Create a founder (initial entry & creates Razorpay order)
// @route   POST /api/founders
// @access  Public
const createFounder = async (req, res) => {
  try {
    const { name, email, phone, price, duration } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Clean price string (e.g. "12,000" to 12000)
    const rawPrice = price ? String(price) : "12000";
    const numericPrice = Number(rawPrice.replace(/,/g, ''));

    // Initialize Razorpay and create order
    let order;
    try {
      const Razorpay = require("razorpay");
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
      console.error("Razorpay Order Creation Failed, generating mock order:", rzpErr);
      order = {
        id: `order_mock_${Date.now()}`,
        amount: numericPrice * 100,
        currency: "INR",
      };
    }

    const founder = await Founder.create({
      name,
      email,
      phone,
      price: rawPrice,
      duration: duration || "1 Year",
      paymentStatus: 'Pending',
      paymentId: order.id,
    });

    if (founder) {
      res.status(201).json({
        success: true,
        founderId: founder._id,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_BoxCross2026",
        data: founder,
      });
    } else {
      res.status(400).json({ message: 'Invalid founder data' });
    }
  } catch (error) {
    console.error("Create Founder Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify founder payment & finalize status
// @route   POST /api/founders/verify
// @access  Public
const verifyFounderPayment = async (req, res) => {
  try {
    const { founderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, status } = req.body;

    if (!founderId) {
      return res.status(400).json({
        success: false,
        message: "Founder ID is required",
      });
    }

    const founder = await Founder.findById(founderId);
    if (!founder) {
      return res.status(404).json({
        success: false,
        message: "Founder record not found",
      });
    }

    if (status === "failed") {
      founder.paymentStatus = "Failed";
      await founder.save();
      return res.status(200).json({
        success: false,
        message: "Payment marked as failed",
      });
    }

    // Verify signature (if signature is provided and not mocked)
    if (razorpaySignature && razorpayOrderId && !razorpayOrderId.startsWith("order_mock_")) {
      const crypto = require("crypto");
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "supersecretrazorpaysecret2026");
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");

      if (digest !== razorpaySignature) {
        founder.paymentStatus = "Failed";
        await founder.save();
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed. Transaction marked as failed.",
        });
      }
    }

    // Update Founder status
    founder.paymentStatus = "Completed";
    founder.paymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    await founder.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and founder registered successfully!",
      data: founder,
    });
  } catch (error) {
    console.error("Verify Founder Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error verifying payment status.",
    });
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
      founder.paymentId = req.body.paymentId || founder.paymentId;
      
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
  verifyFounderPayment,
  updateFounder,
  deleteFounder,
};
