const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getMyBookings,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public route to book
router.post("/", createBooking);

// Protected user route to get their own bookings
router.get("/my", protect, getMyBookings);

// Admin-only routes
router.get("/", protect, authorize("admin"), getBookings);
router.get("/:id", protect, authorize("admin"), getBookingById);
router.put("/:id", protect, authorize("admin"), updateBooking);
router.delete("/:id", protect, authorize("admin"), deleteBooking);

module.exports = router;
