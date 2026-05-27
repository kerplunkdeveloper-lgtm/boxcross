const EventBooking = require("../models/EventBooking");

// @desc    Create a new event booking
// @route   POST /api/event-bookings
// @access  Public (or protected if logged in)
exports.createEventBooking = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventTime,
      venue,
      userName,
      userEmail,
      personCount,
      ticketPrice,
      totalAmount,
      transactionId,
      paymentStatus,
    } = req.body;

    if (
      !eventName ||
      !eventDate ||
      !eventTime ||
      !venue ||
      !userName ||
      !userEmail ||
      !personCount ||
      !ticketPrice ||
      !totalAmount ||
      !transactionId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all booking fields.",
      });
    }

    // Set user ID if logged in
    const userId = req.user ? req.user.id : null;

    const eventBooking = await EventBooking.create({
      user: userId,
      eventName,
      eventDate,
      eventTime,
      venue,
      userName,
      userEmail,
      personCount,
      ticketPrice,
      totalAmount,
      transactionId,
      paymentStatus: paymentStatus || "success", // Default to success for dummy payment
    });

    res.status(201).json({
      success: true,
      message: "Event booking completed successfully!",
      data: eventBooking,
    });
  } catch (error) {
    console.error("Create Event Booking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error booking event",
      error: error.message,
    });
  }
};

// @desc    Get user's event bookings
// @route   GET /api/event-bookings/my
// @access  Private/Public (combines logged in user or query email)
exports.getMyEventBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query = { $or: [{ user: req.user.id }, { userEmail: req.user.email }] };
    } else if (req.query.email) {
      query = { userEmail: req.query.email };
    } else {
      return res.status(400).json({
        success: false,
        message: "User context or email query parameter is required",
      });
    }

    const bookings = await EventBooking.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get My Event Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error retrieving bookings",
      error: error.message,
    });
  }
};

// @desc    Get all event bookings (Admin only)
// @route   GET /api/event-bookings
// @access  Private/Admin
exports.getAllEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get All Event Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error retrieving bookings",
      error: error.message,
    });
  }
};
