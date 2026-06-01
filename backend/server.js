const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
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

// Load env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : []),
  "http://localhost:5173",
  "http://127.0.0.1:5500",
  "https://boxandcross.com",
  "https://boxandcross.com/contact-us",
];

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Middleware to expose io in requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman, mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
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

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🏋️ Box & Cross API is running" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

