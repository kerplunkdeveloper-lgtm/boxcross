const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment
} = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public payment initiation/completion endpoint
router.post("/", createPayment);

// Admin-only operations
router.get("/", protect, authorize("admin"), getPayments);
router.put("/:id", protect, authorize("admin"), updatePayment);
router.delete("/:id", protect, authorize("admin"), deletePayment);

module.exports = router;
