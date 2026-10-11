const express = require("express");
const {
  createMemfound,
  getMemfounds,
  getMemfoundById,
  updateMemfound,
  deleteMemfound,
  checkPhoneExists,
} = require("../controllers/memfoundController");

const router = express.Router();

router.post("/", createMemfound);
router.get("/", getMemfounds);
router.get("/check/:phone", checkPhoneExists);
router.get("/:id", getMemfoundById);
router.put("/:id", updateMemfound);
router.delete("/:id", deleteMemfound);

module.exports = router;
