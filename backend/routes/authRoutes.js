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

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/membership", protect, updateMembership);
router.put("/profile", protect, upload.single("image"), updateProfile);

module.exports = router;
