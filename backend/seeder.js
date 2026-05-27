const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load env variables
dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected for seeding...");

    // Clear existing users
    await User.deleteMany();
    console.log("🧹 Existing users cleared.");

    // Define seed users
    const users = [
      {
        name: "Vasanth",
        email: "admin@boxcross.com",
        password: "admin123", // Will be hashed automatically by user pre-save hook
        role: "admin",
      }
    ];

    // Insert users
    await User.create(users);
    console.log("👥 Initial seed users inserted successfully!");
    
    console.log("\n-------------------------------------------");
    console.log("🔑 LOGIN CREDENTIALS:");
    console.log("-------------------------------------------");
    console.log("1. ADMIN ACCOUNT:");
    console.log("   Email:    admin@boxcross.com");
    console.log("   Password: admin123");
    console.log("   Role:     admin");
    console.log("-------------------------------------------\n");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();
