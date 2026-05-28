const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getEvents,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  bookEvent,
  verifyEventPayment,
  getEventBookings,
  deleteEventBooking,
} = require("../controllers/eventController");

// Public routes
router.get("/", getEvents);
router.post("/book", bookEvent);
router.post("/verify", verifyEventPayment);

// Admin protected routes
router.get("/admin", protect, authorize("admin"), getAllEventsAdmin);
router.get("/bookings", protect, authorize("admin"), getEventBookings);
router.delete("/bookings/:id", protect, authorize("admin"), deleteEventBooking);
router.post("/", protect, authorize("admin"), upload.single("image"), createEvent);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateEvent);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

module.exports = router;
