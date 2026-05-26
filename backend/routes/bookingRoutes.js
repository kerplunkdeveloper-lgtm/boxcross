const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

router.route("/").post(createBooking).get(getBookings);
router.route("/:id").get(getBookingById).put(updateBooking).delete(deleteBooking);

module.exports = router;
