const Booking = require("../models/Booking");

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { name, phone, goal, day, month, time } = req.body;

    // Validation
    if (!name || !phone || !goal || !day || !month || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      goal,
      day,
      month,
      time,
    });

    if (req.io) {
      req.io.emit("data_updated", { type: "bookings", action: "create", data: booking });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.io) {
      req.io.emit("data_updated", { type: "bookings", action: "update", data: booking });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.io) {
      req.io.emit("data_updated", { type: "bookings", action: "delete", id: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get current logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { name: req.user.name },
        { phone: req.user.phone }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Fetch My Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getMyBookings,
};
