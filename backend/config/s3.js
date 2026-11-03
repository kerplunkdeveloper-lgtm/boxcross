// backend/config/s3.js
// AWS S3 Client Configuration (Supports Local .env Keys & EC2 IAM Role)
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const dotenv = require("dotenv");

// Ensure .env from backend folder is loaded
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const clientConfig = {
  region: process.env.AWS_REGION || "ap-south-1",
};

// Local environment-ல keys இருந்தா அதை use பண்ணும்.
// EC2-ல IAM Role attach பண்ணியிருந்தா, keys இல்லாட்டியும் AWS SDK automatically IAM Role credentials எடுத்துக்கும்!
if (
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  !process.env.AWS_ACCESS_KEY_ID.includes("YOUR_AWS_ACCESS_KEY_ID")
) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  };
}

const s3Client = new S3Client(clientConfig);

module.exports = s3Client;
