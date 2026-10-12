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
        key: "core",
        title: "CORE",
        subtitle: "ONE PATHWAY",
        sessionInfo: "Three coached sessions a week — Fight, HYROX or Strength",
        desc: "Three coached sessions a week. Choose Fight, HYROX or Strength.",
        starterPrice: "2,292",
        dailyRate: "₹75",
        dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
        dailyComparison: "A dosa and a filter coffee.",
        features: [
          "Three coached sessions a week",
          "One pathway (Fight, HYROX or Strength)",
          "Open gym access",
          "Community Access"
        ],
        benefits: [
          {
            boldText: "You can defend yourself.",
            normalText: "Quietly knowing that changes how you walk down a street at night."
          },
          {
            boldText: "The bad day goes into the bag.",
            normalText: "Not into your family, not into your sleep."
          },
          {
            boldText: "Sharper at work.",
            normalText: "Boxing is a thinking sport — you read, decide and move in the same second."
          },
          {
            boldText: "A coach who knows your name and your weakness.",
            normalText: "Nobody improves alone on a gym floor."
          }
        ],
        plans: [
          {
            months: "1 MONTH",
            subtitle: "STANDARD",
            price: "3,500",
            perMonth: "3,500",
            originalPrice: "",
            totalPrice: "3,500",
            highlights: [
              "3 coached sessions a week",
              "One pathway focus",
              "Arena access"
            ],
            tag: "STANDARD",
            buttonText: "STANDARD",
            isPopular: false
          },
          {
            months: "3 MONTHS",
            subtitle: "FOUNDING RATE",
            price: "9,900",
            perMonth: "3,300",
            originalPrice: "10,000",
            totalPrice: "9,900",
            highlights: [
              "3 coached sessions a week",
              "Held founding rate",
              "Coach assessment"
            ],
            tag: "SAVE ₹100",
            buttonText: "SAVE ₹100",
            isPopular: false
          },
          {
            months: "6 MONTHS",
            subtitle: "BEST PROGRESS",
            price: "18,000",
            perMonth: "3,000",
            originalPrice: "18,900",
            totalPrice: "18,000",
            highlights: [
              "3 coached sessions a week",
              "Founding rate locked",
              "Guest passes included"
            ],
            tag: "SAVE ₹900",
            buttonText: "SAVE ₹900",
            isPopular: true
          },
          {
            months: "12 MONTHS",
            subtitle: "BEST VALUE",
            price: "27,500",
            perMonth: "2,292",
            originalPrice: "33,600",
            totalPrice: "27,500",
            highlights: [
              "3 coached sessions a week",
              "Maximum savings",
              "Priority booking & perks"
            ],
            tag: "SAVE ₹6,100",
            buttonText: "SAVE ₹6,100",
            isPopular: false
          }
        ]
      },
      {
        key: "athlete",
        title: "ATHLETE",
        subtitle: "TWO PATHWAYS",
        sessionInfo: "Four coached sessions a week across two disciplines",
        desc: "Four coached sessions a week across two disciplines.",
        starterPrice: "3,275",
        dailyRate: "₹108",
        dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
        dailyComparison: "One burger.",
        features: [
          "Four coached sessions a week",
          "Two disciplines / pathways",
          "All arena facilities",
          "Progress tracking"
        ],
        benefits: [
          {
            boldText: "Strong and not out of breath.",
            normalText: "Most people get one. Two pathways gets you both."
          },
          {
            boldText: "You stop plateauing.",
            normalText: "Four sessions, two disciplines, nothing goes stale."
          },
          {
            boldText: "Visible change by week twelve.",
            normalText: "Measured on your card, not guessed in the mirror."
          },
          {
            boldText: "The body you had at twenty-five,",
            normalText: "built the way an athlete builds it."
          }
        ],
        plans: [
          {
            months: "1 MONTH",
            subtitle: "STANDARD",
            price: "5,000",
            perMonth: "5,000",
            originalPrice: "",
            totalPrice: "5,000",
            highlights: [
              "4 coached sessions a week",
              "Two disciplines access",
              "Full arena access"
            ],
            tag: "STANDARD",
            buttonText: "STANDARD",
            isPopular: false
          },
          {
            months: "3 MONTHS",
            subtitle: "FOUNDING RATE",
            price: "14,100",
            perMonth: "4,700",
            originalPrice: "14,200",
            totalPrice: "14,100",
            highlights: [
              "4 coached sessions a week",
              "Two disciplines access",
              "Coach assessment"
            ],
            tag: "SAVE ₹100",
            buttonText: "SAVE ₹100",
            isPopular: false
          },
          {
            months: "6 MONTHS",
            subtitle: "BEST PROGRESS",
            price: "25,700",
            perMonth: "4,283",
            originalPrice: "27,000",
            totalPrice: "25,700",
            highlights: [
              "4 coached sessions a week",
              "Two disciplines access",
              "Guest passes included"
            ],
            tag: "SAVE ₹1,300",
            buttonText: "SAVE ₹1,300",
            isPopular: true
          },
          {
            months: "12 MONTHS",
            subtitle: "BEST VALUE",
            price: "39,300",
            perMonth: "3,275",
            originalPrice: "48,000",
            totalPrice: "39,300",
            highlights: [
              "4 coached sessions a week",
              "Two disciplines access",
              "Priority booking & perks"
            ],
            tag: "SAVE ₹8,700",
            buttonText: "SAVE ₹8,700",
            isPopular: false
          }
        ]
      },
      {
        key: "arena",
        title: "ARENA",
        subtitle: "EVERYTHING",
        sessionInfo: "Five coached sessions a week, every pathway, every class",
        desc: "Five coached sessions a week, every pathway, every class.",
        starterPrice: "4,583",
        dailyRate: "₹151",
        dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
        dailyComparison: "One cinema ticket.",
        features: [
          "Five coached sessions a week",
          "Every pathway, every class",
          "Priority ring & arena floor",
          "VIP founding member perks"
        ],
        benefits: [
          {
            boldText: "Train the way fighters train.",
            normalText: "Five days, every discipline, nothing held back."
          },
          {
            boldText: "This becomes your second place.",
            normalText: "After home, before everywhere else."
          },
          {
            boldText: "Priority on everything.",
            normalText: "Classes, the ring, the open floor."
          },
          {
            boldText: "You stop thinking about fitness.",
            normalText: "It is simply what you do now."
          }
        ],
        plans: [
          {
            months: "1 MONTH",
            subtitle: "STANDARD",
            price: "7,000",
            perMonth: "7,000",
            originalPrice: "",
            totalPrice: "7,000",
            highlights: [
              "5 coached sessions a week",
              "All pathways & disciplines",
              "Unrestricted arena access"
            ],
            tag: "STANDARD",
            buttonText: "STANDARD",
            isPopular: false
          },
          {
            months: "3 MONTHS",
            subtitle: "FOUNDING RATE",
            price: "19,700",
            perMonth: "6,567",
            originalPrice: "20,000",
            totalPrice: "19,700",
            highlights: [
              "5 coached sessions a week",
              "All pathways & disciplines",
              "Coach assessment"
            ],
            tag: "SAVE ₹300",
            buttonText: "SAVE ₹300",
            isPopular: false
          },
          {
            months: "6 MONTHS",
            subtitle: "BEST PROGRESS",
            price: "35,900",
            perMonth: "5,983",
            originalPrice: "37,800",
            totalPrice: "35,900",
            highlights: [
              "5 coached sessions a week",
              "All pathways & disciplines",
              "Guest passes included"
            ],
            tag: "SAVE ₹1,900",
            buttonText: "SAVE ₹1,900",
            isPopular: true
          },
          {
            months: "12 MONTHS",
            subtitle: "BEST VALUE",
            price: "55,000",
            perMonth: "4,583",
            originalPrice: "67,200",
            totalPrice: "55,000",
            highlights: [
              "5 coached sessions a week",
              "All pathways & disciplines",
              "VIP Founding Wall & passes"
            ],
            tag: "SAVE ₹12,200",
            buttonText: "SAVE ₹12,200",
            isPopular: false
          }
        ]
      },
      {
        key: "junior",
        title: "JUNIOR",
        subtitle: "UNDER 13",
        sessionInfo: "Three coached sessions a week",
        desc: "Three coached sessions a week. Youth boxing, discipline and athletic development.",
        starterPrice: "1,958",
        dailyRate: "₹64",
        dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
        dailyComparison: "One masala dosa.",
        features: [
          "Three coached sessions a week",
          "Youth boxing & athletic discipline",
          "Confidence building",
          "Screen-free fitness"
        ],
        benefits: [
          {
            boldText: "Confidence that shows up at school.",
            normalText: "A child who can hold a stance stops shrinking in a crowd."
          },
          {
            boldText: "They learn to handle themselves — and when not to.",
            normalText: "Discipline is taught before the punch is."
          },
          {
            boldText: "Focus that carries into homework.",
            normalText: "Three rounds of concentration, three evenings a week."
          },
          {
            boldText: "Off the screen, on their feet.",
            normalText: "Tired in the right way by 7pm."
          }
        ],
        plans: [
          {
            months: "1 MONTH",
            subtitle: "STANDARD",
            price: "3,000",
            perMonth: "3,000",
            originalPrice: "",
            totalPrice: "3,000",
            highlights: [
              "3 coached sessions a week",
              "Youth boxing fundamentals",
              "Arena training space"
            ],
            tag: "STANDARD",
            buttonText: "STANDARD",
            isPopular: false
          },
          {
            months: "3 MONTHS",
            subtitle: "FOUNDING RATE",
            price: "7,500",
            perMonth: "2,500",
            originalPrice: "8,600",
            totalPrice: "7,500",
            highlights: [
              "3 coached sessions a week",
              "Youth boxing fundamentals",
              "Skill milestone card"
            ],
            tag: "SAVE ₹1,100",
            buttonText: "SAVE ₹1,100",
            isPopular: false
          },
          {
            months: "6 MONTHS",
            subtitle: "BEST PROGRESS",
            price: "13,500",
            perMonth: "2,250",
            originalPrice: "16,200",
            totalPrice: "13,500",
            highlights: [
              "3 coached sessions a week",
              "Technique & fitness growth",
              "Coach assessment"
            ],
            tag: "SAVE ₹2,700",
            buttonText: "SAVE ₹2,700",
            isPopular: true
          },
          {
            months: "12 MONTHS",
            subtitle: "BEST VALUE",
            price: "23,500",
            perMonth: "1,958",
            originalPrice: "28,800",
            totalPrice: "23,500",
            highlights: [
              "3 coached sessions a week",
              "Maximum founding discount",
              "Founding Wall youth recognition"
            ],
            tag: "SAVE ₹5,300",
            buttonText: "SAVE ₹5,300",
            isPopular: false
          }
        ]
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
