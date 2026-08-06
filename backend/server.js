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

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🏋️ Box & Cross API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Copy barcode image to frontend public directory on startup
const fs = require("fs");
const path = require("path");
const srcBarcode = "C:/Users/Admin/.gemini/antigravity-ide/brain/bb465527-de2b-4ae6-a542-45b6fbe0f108/media__1786000584749.png";
const destBarcode = path.join(__dirname, "../frontend/public/barcode.png");
try {
  if (fs.existsSync(srcBarcode)) {
    fs.copyFileSync(srcBarcode, destBarcode);
    console.log("✅ UPI QR Barcode copied to frontend/public/barcode.png");
  } else {
    console.warn("⚠️ Reference barcode source image not found at expected path:", srcBarcode);
  }
} catch (err) {
  console.error("❌ Failed to copy barcode image:", err.message);
}
