const fs = require("fs");
const path = require("path");
const axios = require("axios");
const jwt = require("jsonwebtoken");

let directCredentials = {};
try {
  directCredentials = require("./googleDriveCredentials");
} catch (e) {
  directCredentials = {};
}

// --------------------------------------------------------------------------
// Google Drive Storage Configuration & API Client for Hiring Files
// Supports:
// 1. Direct file config (googleDriveCredentials.js)
// 2. Google Service Account JSON file (e.g. google-service-account.json)
// 3. Environment variables / OAuth2 as fallback
// --------------------------------------------------------------------------

// In-memory token caching to minimize token requests
let cachedAccessToken = null;
let tokenExpiresAt = 0; // Epoch milliseconds

/**
 * Format private key correctly (handles escaped newlines \n and quotes)
 */
const formatPrivateKey = (key) => {
  if (!key) return "";
  let cleanKey = String(key).trim();
  if (
    (cleanKey.startsWith('"') && cleanKey.endsWith('"')) ||
    (cleanKey.startsWith("'") && cleanKey.endsWith("'"))
  ) {
    cleanKey = cleanKey.slice(1, -1);
  }
  return cleanKey.replace(/\\n/g, "\n");
};

/**
 * Resolve Google Drive Credentials (prioritizing googleDriveCredentials.js)
 */
const getCredentials = () => {
  // 1. Primary: Direct configuration file (googleDriveCredentials.js)
  const fileEmail = (directCredentials.GOOGLE_CLIENT_EMAIL || "").trim();
  const fileKey = formatPrivateKey(directCredentials.GOOGLE_PRIVATE_KEY || "");
  const fileFolderId = (
    directCredentials.GOOGLE_DRIVE_FOLDER_ID ||
    process.env.GOOGLE_DRIVE_FOLDER_ID ||
    ""
  ).trim();

  if (fileEmail && fileKey) {
    return {
      type: "service_account",
      clientEmail: fileEmail,
      privateKey: fileKey,
      folderId: fileFolderId,
      source: "googleDriveCredentials.js",
    };
  }

  // 2. Check for Service Account JSON files in standard locations
  const candidateKeyPaths = [
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.join(__dirname, "..", "hiringdetails-b6f70c19f720.json"),
    path.join(__dirname, "..", "google-service-account.json"),
    path.join(__dirname, "..", "service-account.json"),
    path.join(__dirname, "google-service-account.json"),
    path.join(__dirname, "hiringdetails-b6f70c19f720.json"),
  ].filter(Boolean);

  // Auto-detect any service account JSON file in backend directory
  try {
    const backendFiles = fs.readdirSync(path.join(__dirname, ".."));
    for (const f of backendFiles) {
      if (
        f.endsWith(".json") &&
        !["package.json", "package-lock.json", "tsconfig.json"].includes(f)
      ) {
        candidateKeyPaths.push(path.join(__dirname, "..", f));
      }
    }
  } catch (scanErr) {
    // Ignore directory scan error
  }

  for (const filePath of candidateKeyPaths) {
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(fileContent);
        if (json.client_email && json.private_key) {
          return {
            type: "service_account",
            clientEmail: json.client_email,
            privateKey: formatPrivateKey(json.private_key),
            folderId:
              (directCredentials.GOOGLE_DRIVE_FOLDER_ID || "").trim() ||
              json.folder_id ||
              json.GOOGLE_DRIVE_FOLDER_ID ||
              process.env.GOOGLE_DRIVE_FOLDER_ID ||
              "1rKiiT7_EQKNS_eTB-f3th5w9a7xysKX1",
            source: path.basename(filePath),
          };
        }
      }
    } catch (err) {
      console.warn(`[Google Drive] Error reading key file (${filePath}):`, err.message);
    }
  }

  // 2. Check for Service Account credentials in .env
  const clientEmail =
    process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = formatPrivateKey(
    process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );

  if (clientEmail && privateKey) {
    return {
      type: "service_account",
      clientEmail,
      privateKey,
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
      source: "environment_variables",
    };
  }

  // 3. Check for OAuth2 Refresh Token credentials in .env
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    return {
      type: "oauth2",
      clientId,
      clientSecret,
      refreshToken,
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
      source: "oauth2_environment_variables",
    };
  }

  return {
    type: "none",
    configured: false,
  };
};

/**
 * Check whether Google Drive credentials have been configured
 */
const isGoogleDriveConfigured = () => {
  const creds = getCredentials();
  return creds.type !== "none";
};

/**
 * Get a valid Google OAuth2 Access Token (cached with 5min safety buffer)
 */
const getAccessToken = async () => {
  const now = Date.now();
  // Return cached token if valid for at least 5 more minutes
  if (cachedAccessToken && tokenExpiresAt - now > 5 * 60 * 1000) {
    return cachedAccessToken;
  }

  const creds = getCredentials();

  if (creds.type === "service_account") {
    // Generate signed RS256 JWT assertion
    const issuedAt = Math.floor(now / 1000);
    const expiresAt = issuedAt + 3600; // 1 hour

    const jwtPayload = {
      iss: creds.clientEmail,
      scope:
        "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file",
      aud: "https://oauth2.googleapis.com/token",
      exp: expiresAt,
      iat: issuedAt,
    };

    const assertion = jwt.sign(jwtPayload, creds.privateKey, {
      algorithm: "RS256",
    });

    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      }
    );

    cachedAccessToken = response.data.access_token;
    tokenExpiresAt = now + (response.data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  }

  if (creds.type === "oauth2") {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        refresh_token: creds.refreshToken,
        grant_type: "refresh_token",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      }
    );

    cachedAccessToken = response.data.access_token;
    tokenExpiresAt = now + (response.data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  }

  throw new Error(
    "Google Drive is not configured. Please supply Google Service Account credentials or OAuth2 tokens in backend/.env"
  );
};

/**
 * Upload a file buffer to Google Drive
 * @param {Object} params
 * @param {Buffer} params.fileBuffer - Raw file buffer from Multer
 * @param {string} params.originalname - Original name of the uploaded file
 * @param {string} params.mimeType - MIME type of the file
 * @param {string} [params.folderId] - Optional destination folder ID (overrides env)
 * @returns {Promise<Object>} Upload metadata including fileId, webViewLink, webContentLink
 */
const uploadFileToGoogleDrive = async ({
  fileBuffer,
  originalname,
  mimeType = "application/octet-stream",
  folderId,
}) => {
  const token = await getAccessToken();
  const creds = getCredentials();
  const targetFolderId =
    folderId ||
    creds.folderId ||
    (directCredentials.GOOGLE_DRIVE_FOLDER_ID || "").trim() ||
    process.env.GOOGLE_DRIVE_FOLDER_ID ||
    "1rKiiT7_EQKNS_eTB-f3th5w9a7xysKX1";

  // Format clean file name
  const ext = path.extname(originalname || "").toLowerCase();
  const baseName = path
    .parse(originalname || "resume")
    .name.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `BXC_${Date.now()}_${baseName}${ext}`;

  const metadata = {
    name: fileName,
    description: "Box & Cross Hiring Applicant Document",
    ...(targetFolderId ? { parents: [targetFolderId] } : {}),
  };

  const boundary = `-------BXCGoogleDriveBoundary${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody = Buffer.concat([
    Buffer.from(
      `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\n\r\n`
    ),
    fileBuffer,
    Buffer.from(closeDelimiter),
  ]);

  // Upload file via Google Drive v3 multipart upload
  const uploadResponse = await axios.post(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink",
    multipartRequestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": multipartRequestBody.length,
      },
      timeout: 60000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  const fileData = uploadResponse.data;
  const fileId = fileData.id;

  // Make file publicly readable so preview and links work seamlessly
  try {
    await axios.post(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      { role: "reader", type: "anyone" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
  } catch (permError) {
    // If domain restricts sharing with "anyone", log warning and continue
    console.warn(
      `[Google Drive] Warning setting file permissions for ${fileId}:`,
      permError.response?.data?.error?.message || permError.message
    );
  }

  // Construct standard links
  const webViewLink =
    fileData.webViewLink ||
    `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;
  const webContentLink =
    fileData.webContentLink ||
    `https://drive.google.com/uc?id=${fileId}&export=download`;

  return {
    fileId,
    name: fileData.name || fileName,
    mimeType: fileData.mimeType || mimeType,
    size: Number(fileData.size || fileBuffer.length),
    webViewLink,
    webContentLink,
    url: webViewLink,
    folderId: targetFolderId,
    storageProvider: "google_drive",
  };
};

/**
 * Stream a file from Google Drive by File ID
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<Object>} Stream and metadata
 */
const getFileStreamFromGoogleDrive = async (fileId) => {
  if (!fileId) throw new Error("Google Drive fileId is required for streaming");
  const token = await getAccessToken();

  // 1. Fetch file metadata for content-type, size, and original filename
  let meta = {};
  try {
    const metaRes = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      }
    );
    meta = metaRes.data;
  } catch (metaErr) {
    console.warn(`[Google Drive] Could not fetch metadata for ${fileId}:`, metaErr.message);
  }

  // 2. Fetch media stream
  const streamRes = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "stream",
      timeout: 30000,
    }
  );

  return {
    stream: streamRes.data,
    contentType: meta.mimeType || streamRes.headers["content-type"],
    contentLength: meta.size || streamRes.headers["content-length"],
    fileName: meta.name,
  };
};

/**
 * Delete a file from Google Drive by File ID
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<boolean>}
 */
const deleteFileFromGoogleDrive = async (fileId) => {
  if (!fileId) return false;
  try {
    const token = await getAccessToken();
    await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });
    return true;
  } catch (err) {
    if (err.response?.status === 404) {
      return true; // Already deleted
    }
    console.error(`[Google Drive] Error deleting file (${fileId}):`, err.message);
    return false;
  }
};

module.exports = {
  isGoogleDriveConfigured,
  getCredentials,
  getAccessToken,
  uploadFileToGoogleDrive,
  getFileStreamFromGoogleDrive,
  deleteFileFromGoogleDrive,
};
