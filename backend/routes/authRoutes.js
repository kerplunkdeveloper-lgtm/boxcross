const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateMembership,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// TODO: Uncomment after running: npm install express-rate-limit
// const rateLimit = require("express-rate-limit");
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// const registerLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { success: false, message: "Too many registration attempts. Please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

router.post("/register", register);   // add registerLimiter after npm install
router.post("/login", login);          // add loginLimiter after npm install
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/membership", protect, updateMembership);
router.put("/profile", protect, upload.single("image"), updateProfile);

module.exports = router;

