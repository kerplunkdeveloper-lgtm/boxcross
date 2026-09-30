const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const eventBannerRoutes = require("./routes/eventBannerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const leadRoutes = require("./routes/leadRoutes");
const homec1routes = require("./routes/homec1routes");
const homec2routes = require("./routes/homec2routes");
const homec3routes = require("./routes/homec3routes");
const founderRoutes = require("./routes/founderRoutes");
const foundingOfferRoutes = require("./routes/foundingOfferRoutes");
const athleteRoutes = require("./routes/athleteRoutes");
const goalsReadinessRoutes = require("./routes/goalsReadinessRoutes");
const aiAnalysisRoutes = require("./routes/aiAnalysisRoutes");
const entryBaselineRoutes = require("./routes/entryBaselineRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const fightClubRoutes = require("./routes/fightClubRoutes");
const performanceBoxingRoutes = require("./routes/performanceBoxingRoutes");
const strengthLabRoutes = require("./routes/strengthLabRoutes");
const hyroxLabRoutes = require("./routes/hyroxLabRoutes");
const hybridPerformanceRoutes = require("./routes/hybridPerformanceRoutes");
const athletePerformanceProfileRoutes = require("./routes/athletePerformanceProfileRoutes");
const juniorAthleteProfileRoutes = require("./routes/juniorAthleteProfileRoutes");

// Load env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const allowedOrigins = [
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : []),
  "http://localhost:5173",
  "http://127.0.0.1:5500",
  "https://boxandcross.com",
  "https://boxandcross.com/contact-us",
  "https://membership.boxandcross.com",
  "https://membership.boxandcross.com/events",

];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman, mobile apps
      if (!origin) return callback(null, true);

      // Check if it's localhost/127.0.0.1 on any port (for development ease)
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalhost) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/event-banners", eventBannerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/homec1", homec1routes);
app.use("/api/homec2", homec2routes);
app.use("/api/homec3", homec3routes); 
app.use("/api/founders", founderRoutes);
app.use("/api/founding-offer", foundingOfferRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/user-management", athleteRoutes);
app.use("/api/goals-readiness", goalsReadinessRoutes);
app.use("/api/ai-analysis", aiAnalysisRoutes);
app.use("/api/entry-baseline", entryBaselineRoutes);
app.use("/api/entrybaseline", entryBaselineRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fightclub", fightClubRoutes);
app.use("/api/performanceboxing", performanceBoxingRoutes);
app.use("/api/strengthlab", strengthLabRoutes);
app.use("/api/hyroxlab", hyroxLabRoutes);
app.use("/api/hybridperformance", hybridPerformanceRoutes);
app.use("/api/athleteprofile", athletePerformanceProfileRoutes);
app.use("/api/juniorprofile", juniorAthleteProfileRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🏋️ Box & Cross API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Copy barcode and admin portal assets to frontend
const fs = require("fs");
const path = require("path");

const copyFileSafe = (src, dest) => {
  try {
    if (fs.existsSync(src)) {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`✅ Asset copied: ${path.basename(dest)}`);
    }
  } catch (err) {
    console.error(`❌ Failed to copy ${path.basename(dest)}:`, err.message);
  }
};

const srcBarcode = "C:/Users/Admin/.gemini/antigravity-ide/brain/bb465527-de2b-4ae6-a542-45b6fbe0f108/media__1786000584749.png";
copyFileSafe(srcBarcode, path.join(__dirname, "../frontend/public/barcode.png"));

const srcAdminRef = "C:/Users/Admin/.gemini/antigravity-ide/brain/0ec507a5-b680-4b7b-bbec-50f7fdb089cd/.user_uploaded/media_1790746559259.png";
if (fs.existsSync(srcAdminRef)) {
  // Simple check or clean up dims
  try {
    fs.unlinkSync(path.join(__dirname, "dims.txt"));
  } catch (e) {}
}
copyFileSafe(srcAdminRef, path.join(__dirname, "../frontend/public/admin_portal_ref.png"));

const srcAdminMobileRef = "C:/Users/Admin/.gemini/antigravity-ide/brain/0ec507a5-b680-4b7b-bbec-50f7fdb089cd/.user_uploaded/media_1790747547849.jpg";
copyFileSafe(srcAdminMobileRef, path.join(__dirname, "../frontend/public/admin_mobile_ref.jpg"));
copyFileSafe(srcAdminMobileRef, path.join(__dirname, "../frontend/src/assets/admin_mobile_ref.jpg"));


