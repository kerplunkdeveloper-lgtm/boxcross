const path = require("path");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const HiringApplication = require("../models/HiringApplication");
const cloudinary = require("../config/cloudinary");
const {
  isGoogleDriveConfigured,
  uploadFileToGoogleDrive,
  getFileStreamFromGoogleDrive,
  deleteFileFromGoogleDrive,
} = require("../config/googleDrive");

// --------------------------------------------------------------------------
// Cloudinary Helpers
// --------------------------------------------------------------------------
const uploadResumeToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalname || "").toLowerCase();
    const cleanBase = path
      .parse(originalname || "resume")
      .name.replace(/[^a-zA-Z0-9_-]/g, "_");

    // For non-image documents (.doc, .docx, .txt), Cloudinary requires the extension in public_id
    const isDoc = [".doc", ".docx", ".txt", ".rtf"].includes(ext);
    const resourceType = isDoc ? "raw" : "auto";
    const publicId = isDoc
      ? `${Date.now()}-${cleanBase}${ext}`
      : `${Date.now()}-${cleanBase}`;

    const uploadOptions = {
      folder: "bxc_career_resumes",
      resource_type: resourceType,
      public_id: publicId,
      access_mode: "public",
    };

    if (ext === ".pdf") {
      uploadOptions.format = "pdf";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteResumeFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    // Attempt deletion as raw document, then image
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("Cloudinary Cleanup Warning:", err.message);
  }
};

// Helper to coerce string / array inputs
const parseArrayField = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
  if (typeof val === "string") {
    // Handle JSON stringified arrays or comma-delimited strings
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
      } catch (e) {
        // Fall back to comma split
      }
    }
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

// Helper to coerce boolean inputs (handles "true", true, "yes", "Yes", 1)
const parseBooleanField = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const s = val.trim().toLowerCase();
    return s === "true" || s === "yes" || s === "1";
  }
  if (typeof val === "number") return val === 1;
  return false;
};

// --------------------------------------------------------------------------
// @desc    Submit a career application (Public)
// @route   POST /api/hiring
// @access  Public
// --------------------------------------------------------------------------
const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      mobileNumber,
      email,
      is18Plus,
      ageConfirmation,
      currentLocation,
      positions,
      position,
      otherPosition,
      highestEducation,
      totalExperience,
      previousCompany,
      certifications,
      skillsDescription,
      languagesKnown,
      coachingExperience,
      roleSpecificAnswers,
      currentEmploymentStatus,
      whenCanYouJoin,
      preferredShift,
      expectedSalary,
      willingToWorkInPuducherry,
      portfolioLink,
      certificatesUrl,
      additionalInfo,
      declarationAgreed,
      resumeUrl,
    } = req.body;

    // Normalization & Validation
    const applicantName = (fullName || "").trim();
    const applicantPhone = (phone || mobileNumber || "").trim();
    const applicantEmail = (email || "").trim().toLowerCase();
    const applicantLocation = (currentLocation || "").trim();

    // Check mandatory Section 1 fields
    if (!applicantName) {
      return res.status(400).json({ success: false, message: "Full Name is required." });
    }
    if (!applicantPhone) {
      return res.status(400).json({ success: false, message: "Mobile Number / WhatsApp is required." });
    }
    if (!applicantEmail) {
      return res.status(400).json({ success: false, message: "Email Address is required." });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(applicantEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const verified18Plus = parseBooleanField(is18Plus !== undefined ? is18Plus : ageConfirmation);
    if (!verified18Plus) {
      return res.status(400).json({
        success: false,
        message: "Age confirmation (18+) is required to submit an application.",
      });
    }

    if (!applicantLocation) {
      return res.status(400).json({ success: false, message: "Current Location is required." });
    }

    // Positions (Section 2)
    let selectedPositions = parseArrayField(positions);
    if (selectedPositions.length === 0 && position) {
      selectedPositions = parseArrayField(position);
    }
    if (selectedPositions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one position you are applying for.",
      });
    }

    // Section 6 - Declaration Agreement
    const declarationCheck = parseBooleanField(declarationAgreed);
    if (!declarationCheck) {
      return res.status(400).json({
        success: false,
        message:
          "You must confirm the declaration: 'I confirm that the information provided is accurate and agree to be contacted by the BXC hiring team regarding my application.'",
      });
    }

    // File Upload handling (Section 5)
    let resumeData = {
      url: resumeUrl ? String(resumeUrl).trim() : "",
      publicId: "",
      originalName: "",
      fileType: "",
      fileSize: 0,
      storageProvider: isGoogleDriveConfigured() ? "google_drive" : "none",
      driveFileId: "",
      webViewLink: "",
      webContentLink: "",
    };
    const attachedFilesData = [];

    const uploadedFiles = req.files || (req.file ? [req.file] : []);

    if (uploadedFiles.length > 0) {
      // Find primary file (resume or main upload)
      const primaryFile =
        uploadedFiles.find((f) => f.fieldname === "resume") ||
        uploadedFiles.find((f) => f.fieldname === "image") ||
        uploadedFiles.find((f) => f.fieldname === "file") ||
        uploadedFiles[0];

      const auxFiles = uploadedFiles.filter((f) => f !== primaryFile);

      if (primaryFile) {
        if (isGoogleDriveConfigured()) {
          try {
            const driveResult = await uploadFileToGoogleDrive({
              fileBuffer: primaryFile.buffer,
              originalname: primaryFile.originalname,
              mimeType: primaryFile.mimetype,
            });
            resumeData = {
              url: driveResult.webViewLink || driveResult.webContentLink,
              publicId: driveResult.fileId,
              driveFileId: driveResult.fileId,
              originalName: primaryFile.originalname,
              fileType: primaryFile.mimetype,
              fileSize: driveResult.size,
              storageProvider: "google_drive",
              webViewLink: driveResult.webViewLink,
              webContentLink: driveResult.webContentLink,
            };
          } catch (uploadError) {
            console.error("Google Drive Upload Error:", uploadError.message);
            return res.status(500).json({
              success: false,
              message:
                "Failed to upload document to Google Drive: " +
                uploadError.message,
            });
          }
        } else {
          // Fallback to Cloudinary if Google Drive credentials are not yet entered in .env
          console.warn(
            "[Hiring API] Google Drive not yet configured in .env. Falling back to Cloudinary."
          );
          try {
            const uploadResult = await uploadResumeToCloudinary(
              primaryFile.buffer,
              primaryFile.originalname
            );
            resumeData = {
              url: uploadResult.secure_url || uploadResult.url,
              publicId: uploadResult.public_id,
              originalName: primaryFile.originalname,
              fileType: primaryFile.mimetype,
              fileSize: primaryFile.size,
              storageProvider: "cloudinary",
            };
          } catch (uploadError) {
            console.error("Storage upload error:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Failed to upload document. Please check storage credentials.",
            });
          }
        }
      }

      // Process auxiliary files (e.g. certificates, applicant pictures)
      for (const auxFile of auxFiles) {
        try {
          if (isGoogleDriveConfigured()) {
            const auxDrive = await uploadFileToGoogleDrive({
              fileBuffer: auxFile.buffer,
              originalname: auxFile.originalname,
              mimeType: auxFile.mimetype,
            });
            attachedFilesData.push({
              url: auxDrive.webViewLink || auxDrive.webContentLink,
              fileId: auxDrive.fileId,
              originalName: auxFile.originalname,
              fileType: auxFile.mimetype,
              fileSize: auxDrive.size,
              storageProvider: "google_drive",
              webViewLink: auxDrive.webViewLink,
              webContentLink: auxDrive.webContentLink,
            });
          }
        } catch (auxErr) {
          console.warn("Auxiliary file upload warning:", auxErr.message);
        }
      }
    }

    // Parse role-specific screening answers if sent as JSON string
    let parsedRoleSpecific = roleSpecificAnswers;
    if (typeof roleSpecificAnswers === "string") {
      try {
        parsedRoleSpecific = JSON.parse(roleSpecificAnswers);
      } catch (e) {
        parsedRoleSpecific = { text: roleSpecificAnswers };
      }
    }

    // Create record
    const application = await HiringApplication.create({
      fullName: applicantName,
      phone: applicantPhone,
      email: applicantEmail,
      is18Plus: verified18Plus,
      currentLocation: applicantLocation,
      positions: selectedPositions,
      otherPosition: otherPosition ? String(otherPosition).trim() : "",
      highestEducation: highestEducation ? String(highestEducation).trim() : "",
      totalExperience: totalExperience ? String(totalExperience).trim() : "",
      previousCompany: previousCompany ? String(previousCompany).trim() : "",
      certifications: certifications ? String(certifications).trim() : "",
      skillsDescription: skillsDescription ? String(skillsDescription).trim() : "",
      languagesKnown: parseArrayField(languagesKnown),
      coachingExperience: parseArrayField(coachingExperience),
      roleSpecificAnswers: parsedRoleSpecific || {},
      currentEmploymentStatus: currentEmploymentStatus ? String(currentEmploymentStatus).trim() : "",
      whenCanYouJoin: whenCanYouJoin ? String(whenCanYouJoin).trim() : "",
      preferredShift: preferredShift ? String(preferredShift).trim() : "Flexible",
      expectedSalary: expectedSalary ? String(expectedSalary).trim() : "",
      willingToWorkInPuducherry:
        willingToWorkInPuducherry !== undefined
          ? parseBooleanField(willingToWorkInPuducherry)
          : true,
      resume: resumeData,
      attachedFiles: attachedFilesData,
      portfolioLink: portfolioLink ? String(portfolioLink).trim() : "",
      certificatesUrl: certificatesUrl ? String(certificatesUrl).trim() : "",
      additionalInfo: additionalInfo ? String(additionalInfo).trim() : "",
      declarationAgreed: true,
      status: "Submitted",
    });

    res.status(201).json({
      success: true,
      message:
        "APPLICATION RECEIVED. Thank you for your interest in joining Box & Cross Performance Arena. Our hiring team will review your application and contact shortlisted candidates. IT'S JUST NEVER ENOUGH.",
      applicationId: application.applicationId,
      data: application,
    });
  } catch (error) {
    console.error("Submit Career Application Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error while processing your application",
    });
  }
};

// --------------------------------------------------------------------------
// @desc    Get all applications with filters & pagination
// @route   GET /api/hiring
// @access  Private / Admin
// --------------------------------------------------------------------------
const getApplications = async (req, res) => {
  try {
    const {
      search,
      position,
      status,
      experience,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Filter by position
    if (position && position !== "all") {
      query.positions = { $regex: new RegExp(position, "i") };
    }

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by total experience
    if (experience && experience !== "all") {
      query.totalExperience = { $regex: new RegExp(experience, "i") };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // General text search across name, phone, email, and location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullName: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { currentLocation: searchRegex },
        { applicationId: searchRegex },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const isFiltered = Object.keys(query).length > 0;
    const [applications, totalFiltered] = await Promise.all([
      HiringApplication.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      HiringApplication.countDocuments(query),
    ]);
    const totalInDb = isFiltered
      ? await HiringApplication.estimatedDocumentCount().catch(() => totalFiltered)
      : totalFiltered;

    res.status(200).json({
      success: true,
      count: applications.length,
      total: totalFiltered,
      totalInDatabase: totalInDb,
      page: pageNumber,
      totalPages: Math.ceil(totalFiltered / pageSize) || 1,
      data: applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --------------------------------------------------------------------------
// @desc    Get aggregate stats for hiring dashboard
// @route   GET /api/hiring/stats
// @access  Private / Admin
// --------------------------------------------------------------------------
const getHiringStats = async (req, res) => {
  try {
    const totalApplications = await HiringApplication.countDocuments();

    // Group count by status
    const statusCounts = await HiringApplication.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Unwind positions to count applications per role
    const positionCounts = await HiringApplication.aggregate([
      { $unwind: "$positions" },
      { $group: { _id: "$positions", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Count in last 7 days & 30 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [recent7Days, recent30Days] = await Promise.all([
      HiringApplication.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      HiringApplication.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // Transform status list into clean object
    const statusSummary = {
      Submitted: 0,
      "Under Review": 0,
      Shortlisted: 0,
      "Interview Scheduled": 0,
      Rejected: 0,
      Hired: 0,
    };
    statusCounts.forEach((item) => {
      if (item._id) statusSummary[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalApplications,
        recent7Days,
        recent30Days,
        byStatus: statusSummary,
        byPosition: positionCounts.map((p) => ({ position: p._id, count: p.count })),
      },
    });
  } catch (error) {
    console.error("Get Hiring Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --------------------------------------------------------------------------
// @desc    Get single application by MongoDB _id or applicationId
// @route   GET /api/hiring/:id
// @access  Private / Admin
// --------------------------------------------------------------------------
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    let application = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      application = await HiringApplication.findById(id);
    }

    if (!application) {
      application = await HiringApplication.findOne({ applicationId: id });
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Career application not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get Application Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --------------------------------------------------------------------------
// @desc    Update application status, add admin notes, or schedule interview
// @route   PATCH /api/hiring/:id
// @access  Private / Admin
// --------------------------------------------------------------------------
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, author, interviewDate, tags } = req.body;

    let application = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      application = await HiringApplication.findById(id);
    }
    if (!application) {
      application = await HiringApplication.findOne({ applicationId: id });
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Career application not found.",
      });
    }

    if (status) {
      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Hired",
      ];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        });
      }
      application.status = status;
    }

    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate ? new Date(interviewDate) : null;
    }

    if (tags && Array.isArray(tags)) {
      application.tags = tags;
    }

    if (note && String(note).trim()) {
      application.adminNotes.push({
        note: String(note).trim(),
        author: author || req.user?.name || "Admin",
        createdAt: new Date(),
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application updated successfully.",
      data: application,
    });
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --------------------------------------------------------------------------
// @desc    Delete an application and remove its resume from Cloudinary
// @route   DELETE /api/hiring/:id
// @access  Private / Admin
// --------------------------------------------------------------------------
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    let application = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      application = await HiringApplication.findById(id);
    }
    if (!application) {
      application = await HiringApplication.findOne({ applicationId: id });
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Career application not found.",
      });
    }

    // Delete stored resume from Google Drive or Cloudinary
    if (application.resume) {
      const isDrive =
        application.resume.storageProvider === "google_drive" ||
        Boolean(application.resume.driveFileId) ||
        (application.resume.url &&
          application.resume.url.includes("drive.google.com"));

      const driveId =
        application.resume.driveFileId ||
        (isDrive ? application.resume.publicId : null);

      if (isDrive && driveId) {
        await deleteFileFromGoogleDrive(driveId);
      } else if (application.resume.publicId) {
        await deleteResumeFromCloudinary(application.resume.publicId);
      }
    }

    // Delete any auxiliary files stored in Google Drive
    if (Array.isArray(application.attachedFiles)) {
      for (const file of application.attachedFiles) {
        if (file.fileId && file.storageProvider === "google_drive") {
          await deleteFileFromGoogleDrive(file.fileId);
        }
      }
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --------------------------------------------------------------------------
// @desc    Get standard role options, screening questions & form metadata
// @route   GET /api/hiring/roles
// @access  Public
// --------------------------------------------------------------------------
const getHiringFormConfig = (req, res) => {
  res.status(200).json({
    success: true,
    title: "JOIN THE BXC TEAM",
    description:
      "We're building a team that believes in discipline, performance and community. If you're passionate about fitness, coaching or creating great member experiences, apply to be part of Box & Cross Performance Arena.",
    sections: {
      section1_personalDetails: [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "phone", label: "Mobile Number / WhatsApp", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "is18Plus", label: "Age (18+ confirmation)", type: "boolean", options: ["Yes", "No"], required: true },
        { name: "currentLocation", label: "Current Location", type: "text", required: true },
      ],
      section2_positions: {
        field: "positions",
        label: "Which position are you applying for?",
        type: "checkbox_group",
        required: true,
        options: [
          "Boxing Coach",
          "Strength & Conditioning Coach",
          "Personal Trainer",
          "Front Desk Executive",
          "Membership / Sales Executive",
          "Housekeeping / Maintenance",
          "Other",
        ],
      },
      section3_experienceAndQualifications: [
        {
          name: "highestEducation",
          label: "Highest Educational Qualification",
          type: "dropdown",
          options: [
            "High School / 10th-12th",
            "Diploma",
            "Bachelor's Degree",
            "Master's Degree",
            "Certification Course",
            "Other",
          ],
        },
        {
          name: "totalExperience",
          label: "Total Work Experience",
          type: "radio",
          options: ["0–1 Years", "1–3 Years", "3–5 Years", "5+ Years"],
        },
        { name: "previousCompany", label: "Previous Company / Fitness Centre", type: "text" },
        { name: "certifications", label: "Relevant Certifications", type: "text" },
        { name: "skillsDescription", label: "Describe Your Relevant Skills", type: "textarea" },
        {
          name: "languagesKnown",
          label: "Languages Known",
          type: "checkboxes",
          options: ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "French", "Other"],
        },
        {
          name: "coachingExperience",
          label: "Do you have experience coaching beginners, amateur athletes or competitive athletes?",
          forRoles: ["Boxing Coach", "Strength & Conditioning Coach", "Personal Trainer"],
          type: "checkboxes",
          options: ["Beginners", "Amateur Athletes", "Competitive Athletes"],
        },
      ],
      section4_availabilityAndExpectations: [
        {
          name: "currentEmploymentStatus",
          label: "Current Employment Status",
          type: "dropdown",
          options: ["Employed", "Unemployed", "Freelancer / Self-Employed", "Student", "Serving Notice Period"],
        },
        {
          name: "whenCanYouJoin",
          label: "When Can You Join?",
          type: "radio",
          options: ["Immediately", "15 Days", "30 Days", "Other"],
        },
        {
          name: "preferredShift",
          label: "Preferred Shift",
          type: "radio",
          options: ["Morning", "Evening", "Flexible"],
        },
        { name: "expectedSalary", label: "Expected Monthly Salary", type: "text" },
        {
          name: "willingToWorkInPuducherry",
          label: "Willing to Work On-Site in Puducherry?",
          type: "boolean",
          options: ["Yes", "No"],
        },
      ],
      section5_resumeAndPortfolio: [
        { name: "resume", label: "Upload Resume", type: "file", acceptedFormats: [".pdf", ".doc", ".docx", ".jpg", ".png"], note: "PDF preferred" },
        { name: "portfolioLink", label: "Instagram / LinkedIn / Portfolio Link", type: "url", required: false },
        { name: "certificatesUrl", label: "Relevant coaching certificates", type: "text", required: false },
        { name: "additionalInfo", label: "Any Additional Information", type: "textarea", required: false },
      ],
      section6_finalConfirmation: {
        declaration:
          "I confirm that the information provided is accurate and agree to be contacted by the BXC hiring team regarding my application.",
        field: "declarationAgreed",
        type: "checkbox",
        required: true,
        submitButtonText: "APPLY TO JOIN BXC",
      },
      completionMessage: {
        headline: "APPLICATION RECEIVED.",
        body: "Thank you for your interest in joining Box & Cross Performance Arena. Our hiring team will review your application and contact shortlisted candidates.",
        slogan: "IT'S JUST NEVER ENOUGH.",
      },
      roleSpecificScreeningGuide: {
        boxingCoach: [
          "What is your competitive fight record or coaching experience?",
          "Are you certified under any national/international boxing federation (e.g. BFI, AIBA/IBA)?",
          "Can you conduct pad work, heavy bag drills, and technical sparring clinics?",
        ],
        strengthAndConditioningCoach: [
          "Which certifications do you hold (CSCS, NSCA, ACE, ACSM, ISSA)?",
          "Do you have experience with periodization, Olympic lifting, and powerlifting mechanics?",
          "How do you assess movement dysfunctions and program injury prevention?",
        ],
        frontDeskExecutive: [
          "Do you have experience with gym CRM/membership software?",
          "How do you handle difficult customer disputes or billing queries?",
          "Are you comfortable working early morning or evening shifts on rotation?",
        ],
      },
    },
  });
};

// --------------------------------------------------------------------------
// @desc    Stream or download resume file with authentication proxy
// @route   GET /api/hiring/:id/resume
// @access  Public / Admin
// --------------------------------------------------------------------------
const streamResume = async (req, res) => {
  try {
    const { id } = req.params;
    const isDownload =
      req.query.download === "1" ||
      req.query.download === "true" ||
      req.path.endsWith("/download");

    let application = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      application = await HiringApplication.findById(id);
    }
    if (!application) {
      application = await HiringApplication.findOne({ applicationId: id });
    }

    if (!application) {
      return res.status(404).send("Application not found.");
    }

    const resume = application.resume;
    if (!resume || (!resume.url && !resume.publicId)) {
      return res
        .status(404)
        .send("No resume document attached to this application.");
    }

    // Determine filename
    let filename =
      resume.originalName ||
      `${application.fullName || "applicant"}_resume.pdf`;
    filename = filename.replace(/[/\\?%*:|"<>]/g, "_");
    const ext = path.extname(filename).toLowerCase();

    // Determine content type
    let contentType = resume.fileType;
    if (!contentType || contentType === "application/octet-stream") {
      if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".docx")
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (ext === ".doc") contentType = "application/msword";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".webp") contentType = "image/webp";
      else contentType = "application/pdf";
    }

    // 1. If document is stored in Google Drive, stream directly from Google Drive API
    const isGoogleDrive =
      resume.storageProvider === "google_drive" ||
      Boolean(resume.driveFileId) ||
      (resume.url && resume.url.includes("drive.google.com"));

    const driveFileId =
      resume.driveFileId || (isGoogleDrive ? resume.publicId : null);

    if (isGoogleDrive && driveFileId && isGoogleDriveConfigured()) {
      try {
        const driveMedia = await getFileStreamFromGoogleDrive(driveFileId);

        res.setHeader("Content-Type", driveMedia.contentType || contentType);
        res.setHeader(
          "Content-Disposition",
          `${isDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(
            filename
          )}"`
        );
        res.setHeader("Cache-Control", "private, max-age=3600");

        if (driveMedia.contentLength) {
          res.setHeader("Content-Length", driveMedia.contentLength);
        }

        driveMedia.stream.pipe(res);
        return;
      } catch (driveErr) {
        console.error("Google Drive Stream Error:", driveErr.message);
        if (resume.url) {
          return res.redirect(resume.url);
        }
      }
    }

    // Helper to fetch remote stream with Cloudinary Basic Auth (bypasses restricted delivery)
    const fetchRemoteStream = (targetUrl, redirectCount = 0) => {
      return new Promise((resolve, reject) => {
        if (redirectCount > 5) return reject(new Error("Too many redirects"));

        const client = targetUrl.startsWith("https") ? https : http;
        const auth = Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString("base64");

        const headers = {
          "User-Agent": "BoxCross-Backend/1.0",
        };
        if (targetUrl.includes("cloudinary.com")) {
          headers["Authorization"] = `Basic ${auth}`;
        }

        const request = client.get(targetUrl, { headers }, (response) => {
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            let nextUrl = response.headers.location;
            if (nextUrl.startsWith("/")) {
              const u = new URL(targetUrl);
              nextUrl = `${u.origin}${nextUrl}`;
            }
            return resolve(fetchRemoteStream(nextUrl, redirectCount + 1));
          }

          if (response.statusCode >= 200 && response.statusCode < 300) {
            return resolve(response);
          }

          reject(new Error(`Upstream returned HTTP ${response.statusCode}`));
        });

        request.on("error", reject);
      });
    };

    // Candidates URLs to try in order
    const urlsToTry = [];

    // 1. Signed private download URL if publicId exists
    if (resume.publicId) {
      try {
        const isDoc = [".doc", ".docx", ".txt", ".rtf"].includes(ext);
        const resourceType = isDoc
          ? "raw"
          : resume.url?.includes("/raw/")
          ? "raw"
          : "image";
        const format = ext ? ext.replace(".", "") : isDoc ? "" : "pdf";

        const signedUrl = cloudinary.utils.private_download_url(
          resume.publicId,
          format,
          {
            resource_type: resourceType,
            type: "upload",
            expires_at: Math.floor(Date.now() / 1000) + 7200,
          }
        );
        if (signedUrl) urlsToTry.push(signedUrl);
      } catch (err) {
        console.warn("Could not generate signed download URL:", err.message);
      }
    }

    // 2. Direct stored URL
    if (resume.url && !urlsToTry.includes(resume.url)) {
      urlsToTry.push(resume.url);
    }

    let remoteStream = null;
    let fetchError = null;

    for (const testUrl of urlsToTry) {
      try {
        remoteStream = await fetchRemoteStream(testUrl);
        if (remoteStream) break;
      } catch (err) {
        fetchError = err;
      }
    }

    if (!remoteStream) {
      console.error("Stream Resume Fetch Failed:", fetchError?.message);
      if (resume.url) {
        return res.redirect(resume.url);
      }
      return res
        .status(502)
        .send("Failed to retrieve resume document from storage.");
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `${isDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(
        filename
      )}"`
    );
    res.setHeader("Cache-Control", "private, max-age=3600");

    if (remoteStream.headers["content-length"]) {
      res.setHeader("Content-Length", remoteStream.headers["content-length"]);
    }

    remoteStream.pipe(res);
  } catch (error) {
    console.error("Stream Resume Controller Error:", error);
    res.status(500).send("Internal server error while retrieving resume.");
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getHiringStats,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getHiringFormConfig,
  streamResume,
};
