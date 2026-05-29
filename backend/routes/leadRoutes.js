const express = require("express");
const { createLead, getLeads } = require("../controllers/leadController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(createLead).get(protect, authorize("admin"), getLeads);

module.exports = router;
