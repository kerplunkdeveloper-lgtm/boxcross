const express = require("express");
const {
  createMemfound,
  getMemfounds,
  getMemfoundById,
  updateMemfound,
  deleteMemfound,
  checkPhoneExists,
  getMemfoundStats,
} = require("../controllers/memfoundController");

const router = express.Router();

router.post("/", createMemfound);
router.get("/", getMemfounds);
router.get("/stats", getMemfoundStats);
router.get("/check/:phone", checkPhoneExists);
router.get("/:id", getMemfoundById);
router.put("/:id", updateMemfound);
router.delete("/:id", deleteMemfound);

module.exports = router;
