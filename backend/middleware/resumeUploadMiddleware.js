const multer = require("multer");

// Use memory storage to stream files directly to Cloudinary
const storage = multer.memoryStorage();

// File filter: accept PDFs, MS Word docs, and image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, and images (JPG/PNG) are allowed for resumes."
      ),
      false
    );
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file limit
  },
});

module.exports = uploadResume;
