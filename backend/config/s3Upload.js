// backend/config/s3Upload.js
// AWS S3 Upload & Delete Helper Functions
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const s3Client = require("./s3");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dotenv = require("dotenv");

// Ensure .env is always loaded
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Detect whether a publicId belongs to S3 (new) or Cloudinary (old).
 * S3 keys look like: "folder/timestamp-uuid.ext"
 * Cloudinary public_ids look like: "boxcross_events/abc123" (no file extension dot)
 */
const isS3Key = (publicId) => {
  if (!publicId) return false;
  const parts = publicId.split("/");
  const filename = parts[parts.length - 1];
  return filename.includes(".");
};

/**
 * Helper to get clean file extension
 */
const getExtension = (mimetype, originalname) => {
  if (originalname && path.extname(originalname)) {
    return path.extname(originalname).replace(".", "").toLowerCase();
  }
  const mimeMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/webm": "webm",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  };
  return mimeMap[mimetype] || mimetype.split("/")[1] || "bin";
};

/**
 * Upload a file buffer to AWS S3
 * @param {Buffer}  fileBuffer   - File data as Buffer
 * @param {string}  mimetype     - MIME type of the file
 * @param {string}  folder       - S3 folder prefix (e.g. "boxcross_banners")
 * @param {string}  originalname - Optional original filename
 * @returns {{ url: string, key: string }}
 */
const uploadToS3 = async (fileBuffer, mimetype, folder = "uploads", originalname = "") => {
  const bucket = process.env.AWS_S3_BUCKET_NAME || "boxandcross-media-360795764780-ap-south-1-an";
  const region = process.env.AWS_REGION || "ap-south-1";

  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME is not configured in .env");
  }

  const ext = getExtension(mimetype, originalname);
  const key = `${folder}/${Date.now()}-${uuidv4()}.${ext}`;

  try {
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
      },
    });

    await uploader.done();

    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    console.log(`[S3 Upload Success] Key: ${key} -> URL: ${url}`);
    return { url, key };
  } catch (error) {
    console.error(`[S3 Upload Error] Bucket: ${bucket}, Key: ${key}`);
    console.error(`[S3 Error Details] Code: ${error.name || error.Code}, Message: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a file from AWS S3 by its key
 * @param {string} key - S3 object key stored in DB as publicId
 */
const deleteFromS3 = async (key) => {
  if (!key) return;
  const bucket = process.env.AWS_S3_BUCKET_NAME || "boxandcross-media-360795764780-ap-south-1-an";
  try {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: key })
    );
    console.log(`[S3 Deleted] ${key}`);
  } catch (err) {
    console.error("[S3 Deletion Error]:", err.message);
  }
};

module.exports = { uploadToS3, deleteFromS3, isS3Key };
