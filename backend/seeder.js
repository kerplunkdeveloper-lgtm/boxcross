const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const MembershipPlan = require("./models/MembershipPlan");

// Load env variables
dotenv.config();

const seedDB = async () => {
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
        password: "admin@123", // Will be hashed automatically by user pre-save hook
        role: "admin",
      }
    ];

    // Insert users
    await User.create(users);
    console.log("👥 Initial seed users inserted successfully!");

    // Clear existing membership plans
    await MembershipPlan.deleteMany();
    console.log("🧹 Existing membership plans cleared.");

    // Define seed membership plans
    const membershipPlans = [
      {
        key: "start_fight",
        title: "START (FIGHT CLUB)",
        features: ["Boxing Basics", "Cardio Conditioning", "Footwork", "Community Access"],
        plans: [
          { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "5,999", perMonth: "2,000", highlights: ["Basic boxing classes", "Cardio conditioning", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
          { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "10,999", perMonth: "1,833", highlights: ["Basic boxing classes", "Cardio conditioning", "Open gym access", "BXC community access", "Progress tracking"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
          { months: "12 MONTHS", subtitle: "BEST VALUE", price: "19,999", perMonth: "1,666", highlights: ["Basic boxing classes", "Cardio conditioning", "Open gym access", "BXC community access", "Progress tracking", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
        ],
        starterPrice: "2,200"
      },
      {
        key: "start_strength",
        title: "START (STRENGTH LAB)",
        features: ["Strength Training", "Core Focus", "Lifting Technique", "Community Access"],
        plans: [
          { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "6,999", perMonth: "2,333", highlights: ["Strength group classes", "Core conditioning", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
          { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "12,999", perMonth: "2,166", highlights: ["Strength group classes", "Core conditioning", "Open gym access", "BXC community access", "Progress tracking"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
          { months: "12 MONTHS", subtitle: "BEST VALUE", price: "22,999", perMonth: "1,916", highlights: ["Strength group classes", "Core conditioning", "Open gym access", "BXC community access", "Progress tracking", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
        ],
        starterPrice: "2,500"
      },
      {
        key: "transform",
        title: "TRANSFORM (HYBRID PERFORMANCE)",
        features: ["Boxing", "Strength Training", "Conditioning", "Recovery", "Nutrition Guidance"],
        plans: [
          { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "11,999", perMonth: "4,000", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
          { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "19,999", perMonth: "3,333", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking", "1 Body composition test", "Nutrition guidance"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
          { months: "12 MONTHS", subtitle: "BEST VALUE", price: "34,999", perMonth: "2,917", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking", "2 Body composition tests", "Nutrition guidance", "Priority batch booking", "Flexible membership support"], buttonText: "CHOOSE PLAN" }
        ],
        starterPrice: "3,500"
      },
      {
        key: "perform_hyrox",
        title: "PERFORM (HYROX LAB)",
        features: ["HYROX Training", "Endurance", "Peak Performance", "Recovery", "Nutrition"],
        plans: [
          { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "12,999", perMonth: "4,333", highlights: ["HYROX specific classes", "Endurance training", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
          { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "23,999", perMonth: "4,000", highlights: ["HYROX specific classes", "Endurance training", "Open gym access", "BXC community access", "Progress tracking", "2 Body composition tests"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
          { months: "12 MONTHS", subtitle: "BEST VALUE", price: "42,999", perMonth: "3,583", highlights: ["HYROX specific classes", "Endurance training", "Open gym access", "BXC community access", "Progress tracking", "Monthly body composition", "Nutrition planning", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
        ],
        starterPrice: "4,500"
      },
      {
        key: "perform_boxing",
        title: "PERFORM (PERFORMANCE BOXING)",
        features: ["Advanced Boxing", "Sparring Prep", "High-Intensity", "Recovery", "Nutrition"],
        plans: [
          { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "14,999", perMonth: "5,000", highlights: ["All advanced classes", "Sparring prep training", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
          { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "26,999", perMonth: "4,500", highlights: ["All advanced classes", "Sparring prep training", "Open gym access", "BXC community access", "Progress tracking", "2 Body composition tests"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
          { months: "12 MONTHS", subtitle: "BEST VALUE", price: "48,999", perMonth: "4,083", highlights: ["All advanced classes", "Sparring prep training", "Open gym access", "BXC community access", "Progress tracking", "Monthly body composition", "Nutrition planning", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
        ],
        starterPrice: "5,000"
      }
    ];

    // Insert membership plans
    await MembershipPlan.create(membershipPlans);
    console.log("💳 Initial membership plans seeded successfully!");

    console.log("\n-------------------------------------------");
    console.log("🔑 LOGIN CREDENTIALS:");
    console.log("-------------------------------------------");
    console.log("1. ADMIN ACCOUNT:");
    console.log("   Email:    admin@boxcross.com");
    console.log("   Password: admin@123");
    console.log("   Role:     admin");
    console.log("-------------------------------------------\n");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
