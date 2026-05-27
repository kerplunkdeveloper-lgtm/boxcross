const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createEventBooking,
  getMyEventBookings,
  getAllEventBookings,
} = require("../controllers/eventBookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Optional auth helper to check if a token is present
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token && token !== "none") {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // Proceed without user context
    }
  }
  next();
};

// Routes
router.post("/", optionalProtect, createEventBooking);
router.get("/my", optionalProtect, getMyEventBookings);
router.get("/", protect, authorize("admin"), getAllEventBookings);

module.exports = router;
