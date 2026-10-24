const multer = require("multer");

// Use memory storage to stream files directly to Google Drive
const storage = multer.memoryStorage();

// File filter: accept PDFs, MS Word docs, text documents, and images (JPG, PNG, WEBP, SVG)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/rtf",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, TXT, and Images (JPG, PNG, WEBP) are allowed."
      ),
      false
    );
  }
};

const multerInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file limit for Google Drive uploads
  },
});

/**
 * Flexible middleware that accepts single or multiple files under 'resume', 'image', 'file', or any field
 */
const uploadHiringFiles = (req, res, next) => {
  multerInstance.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload validation error.",
      });
    }

    // Populate req.file for single-file handlers
    if (req.files && req.files.length > 0) {
      req.file =
        req.files.find((f) => f.fieldname === "resume") ||
        req.files.find((f) => f.fieldname === "image") ||
        req.files.find((f) => f.fieldname === "file") ||
        req.files[0];
    }

    next();
  });
};

uploadHiringFiles.single = (fieldname) => multerInstance.single(fieldname);
uploadHiringFiles.array = (fieldname, maxCount) => multerInstance.array(fieldname, maxCount);
uploadHiringFiles.fields = (fields) => multerInstance.fields(fields);
uploadHiringFiles.any = () => multerInstance.any();

module.exports = uploadHiringFiles;

