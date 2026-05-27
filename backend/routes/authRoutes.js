const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateMembership,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/membership", protect, updateMembership);

module.exports = router;
