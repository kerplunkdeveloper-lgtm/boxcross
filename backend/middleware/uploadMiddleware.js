const multer = require("multer");

// Set up memory storage so we can stream files directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to accept both images and videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Only images and videos are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit to accommodate video uploads
  },
});

module.exports = upload;
