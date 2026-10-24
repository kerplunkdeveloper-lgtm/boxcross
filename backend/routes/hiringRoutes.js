const express = require("express");
const router = express.Router();
const uploadResume = require("../middleware/resumeUploadMiddleware");
const {
  submitApplication,
  getApplications,
  getHiringStats,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getHiringFormConfig,
  streamResume,
} = require("../controllers/hiringController");

// Public endpoints
// 1. Submit hiring application (accepts multipart/form-data with "resume" file, or raw JSON)
router.post("/", uploadResume.single("resume"), submitApplication);

// 2. Get form metadata, standard roles, options, and screening questions
router.get("/roles", getHiringFormConfig);
router.get("/config", getHiringFormConfig);

// Administrative / Management endpoints
// 3. Aggregate statistics (counts by status, counts by role, recent 7/30 days)
router.get("/stats", getHiringStats);

// 4. Get all applications with search, status/position/experience filters & pagination
router.get("/", getApplications);

// 5. Resume streaming / download endpoint (bypasses Cloudinary restricted delivery)
router.get("/:id/resume", streamResume);
router.get("/:id/resume/download", (req, res, next) => {
  req.query.download = "1";
  return streamResume(req, res, next);
});

// 6. Get single application by MongoDB _id or applicationId (e.g. BXC-APP-...)
router.get("/:id", getApplicationById);

// 6. Update application status, schedule interview, or add admin notes
router.patch("/:id", updateApplication);
router.patch("/:id/status", updateApplication);
router.put("/:id", updateApplication);

// 7. Delete an application and clean up Cloudinary assets
router.delete("/:id", deleteApplication);

module.exports = router;
