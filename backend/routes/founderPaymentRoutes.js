const express = require("express");
const router = express.Router();
const {
  createFounderPayment,
  verifyFounderPaymentSignature,
  getFounderPayments,
  updateFounderPayment,
  deleteFounderPayment
} = require("../controllers/founderPaymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public payment initiation & verification
router.post("/", createFounderPayment);
router.post("/verify", verifyFounderPaymentSignature);

// Admin-only management endpoints
router.get("/", protect, authorize("admin"), getFounderPayments);
router.put("/:id", protect, authorize("admin"), updateFounderPayment);
router.delete("/:id", protect, authorize("admin"), deleteFounderPayment);

module.exports = router;
