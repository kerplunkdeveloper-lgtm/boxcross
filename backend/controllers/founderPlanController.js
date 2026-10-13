const FounderPlan = require("../models/FounderPlan");

const defaultFounderPlans = [
  {
    key: "founder-core",
    title: "CORE",
    subtitle: "ONE PATHWAY",
    sessionInfo: "Three coached sessions a week — Fight, HYROX or Strength",
    desc: "Three coached sessions a week — Fight, HYROX or Strength",
    starterPrice: "2,292",
    dailyRate: "₹75",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "A dosa and a filter coffee.",
    features: [
      "Three coached sessions a week",
      "One pathway (Fight, HYROX or Strength)",
      "Founding rate locked for life of membership",
      "Box & Cross Founding Member Kit",
      "Open gym & community access"
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
          "Fight, HYROX or Strength",
          "Standard founder pass"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹100",
        price: "9,900",
        perMonth: "3,300",
        originalPrice: "10,000",
        totalPrice: "9,900",
        highlights: [
          "3 coached sessions a week",
          "Fight, HYROX or Strength",
          "Save ₹100 total"
        ],
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹900",
        price: "18,000",
        perMonth: "3,000",
        originalPrice: "18,900",
        totalPrice: "18,000",
        highlights: [
          "3 coached sessions a week",
          "Fight, HYROX or Strength",
          "Save ₹900 total"
        ],
        tag: "SAVE ₹900",
        buttonText: "SAVE ₹900",
        isPopular: false
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹6,100",
        price: "27,500",
        perMonth: "2,292",
        originalPrice: "33,600",
        totalPrice: "27,500",
        highlights: [
          "3 coached sessions a week",
          "Fight, HYROX or Strength",
          "Save ₹6,100 total"
        ],
        tag: "SAVE ₹6,100",
        buttonText: "SAVE ₹6,100",
        isPopular: true
      }
    ]
  },
  {
    key: "founder-athlete",
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    sessionInfo: "Four coached sessions a week across two disciplines",
    desc: "Four coached sessions a week across two disciplines",
    starterPrice: "3,275",
    dailyRate: "₹108",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One burger.",
    features: [
      "Four coached sessions a week across two disciplines",
      "Two pathways (Boxing + HYROX or Boxing + Strength Training)",
      "Founding rate locked for life of membership",
      "VIP Member wristband & performance tracker",
      "Priority arena floor booking"
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
          "Standard athlete pass"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹100",
        price: "14,100",
        perMonth: "4,700",
        originalPrice: "14,200",
        totalPrice: "14,100",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Save ₹100 total"
        ],
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹1,300",
        price: "25,700",
        perMonth: "4,283",
        originalPrice: "27,000",
        totalPrice: "25,700",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Save ₹1,300 total"
        ],
        tag: "SAVE ₹1,300",
        buttonText: "SAVE ₹1,300",
        isPopular: false
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹8,700",
        price: "39,300",
        perMonth: "3,275",
        originalPrice: "48,000",
        totalPrice: "39,300",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Save ₹8,700 total"
        ],
        tag: "SAVE ₹8,700",
        buttonText: "SAVE ₹8,700",
        isPopular: true
      }
    ]
  },
  {
    key: "founder-arena",
    title: "ARENA",
    subtitle: "EVERYTHING",
    sessionInfo: "Five coached sessions a week, every pathway, every class",
    desc: "Five coached sessions a week, every pathway, every class",
    starterPrice: "4,583",
    dailyRate: "₹151",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One cinema ticket.",
    features: [
      "Five coached sessions a week across all pathways",
      "Every class: Boxing, HYROX & Strength Training",
      "Founding Rate locked permanently",
      "Exclusive Founding Wall Gold Plaque",
      "Unrestricted VIP Arena & Ring access"
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
          "All pathways included",
          "Standard arena pass"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹300",
        price: "19,700",
        perMonth: "6,567",
        originalPrice: "20,000",
        totalPrice: "19,700",
        highlights: [
          "5 coached sessions a week",
          "All disciplines & arenas",
          "Save ₹300 total"
        ],
        tag: "SAVE ₹300",
        buttonText: "SAVE ₹300",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹1,900",
        price: "35,900",
        perMonth: "5,983",
        originalPrice: "37,800",
        totalPrice: "35,900",
        highlights: [
          "5 coached sessions a week",
          "All pathways & disciplines",
          "Save ₹1,900 total"
        ],
        tag: "SAVE ₹1,900",
        buttonText: "SAVE ₹1,900",
        isPopular: false
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹12,200",
        price: "55,000",
        perMonth: "4,583",
        originalPrice: "67,200",
        totalPrice: "55,000",
        highlights: [
          "5 coached sessions a week",
          "Gold Founding Wall inscription",
          "Save ₹12,200 total"
        ],
        tag: "SAVE ₹12,200",
        buttonText: "SAVE ₹12,200",
        isPopular: true
      }
    ]
  },
  {
    key: "founder-junior",
    title: "JUNIOR",
    subtitle: "UNDER 13",
    sessionInfo: "Three coached sessions a week",
    desc: "Three coached sessions a week",
    starterPrice: "1,958",
    dailyRate: "₹64",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One masala dosa.",
    features: [
      "Three coached youth sessions a week",
      "Youth boxing & athletic discipline",
      "Confidence building & motor skill development",
      "Founding Youth Wall card recognition",
      "Screen-free, active athletic culture"
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
          "Youth fundamentals",
          "Standard junior pass"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹1,100",
        price: "7,500",
        perMonth: "2,500",
        originalPrice: "8,600",
        totalPrice: "7,500",
        highlights: [
          "3 coached sessions a week",
          "Youth milestone tracking",
          "Save ₹1,100 total"
        ],
        tag: "SAVE ₹1,100",
        buttonText: "SAVE ₹1,100",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹2,700",
        price: "13,500",
        perMonth: "2,250",
        originalPrice: "16,200",
        totalPrice: "13,500",
        highlights: [
          "3 coached sessions a week",
          "Technique & agility growth",
          "Save ₹2,700 total"
        ],
        tag: "SAVE ₹2,700",
        buttonText: "SAVE ₹2,700",
        isPopular: false
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹5,300",
        price: "23,500",
        perMonth: "1,958",
        originalPrice: "28,800",
        totalPrice: "23,500",
        highlights: [
          "3 coached sessions a week",
          "Permanent Founding Youth rate",
          "Save ₹5,300 total"
        ],
        tag: "SAVE ₹5,300",
        buttonText: "SAVE ₹5,300",
        isPopular: true
      }
    ]
  }
];

let plansCache = null;

const invalidateCache = () => {
  plansCache = null;
};

// @desc    Get all founder plans (public)
// @route   GET /api/founder-plans
// @access  Public
exports.getFounderPlans = async (req, res) => {
  try {
    // Ultra-fast in-memory cache (< 1ms response time)
    if (plansCache && Array.isArray(plansCache) && plansCache.length > 0) {
      return res.status(200).json({
        success: true,
        count: plansCache.length,
        data: plansCache,
        cached: true
      });
    }

    let plans = await FounderPlan.find({}).sort({ createdAt: 1 }).lean();

    // If database is completely empty, insert defaults
    if (!plans || plans.length === 0) {
      await FounderPlan.insertMany(defaultFounderPlans);
      plans = await FounderPlan.find({}).sort({ createdAt: 1 }).lean();
    } else {
      // Ensure all 4 keys exist in one fast set lookup
      const existingKeys = new Set(plans.map((p) => p.key));
      const missingDefaults = defaultFounderPlans.filter(
        (dp) => !existingKeys.has(dp.key)
      );
      if (missingDefaults.length > 0) {
        await FounderPlan.insertMany(missingDefaults);
        plans = await FounderPlan.find({}).sort({ createdAt: 1 }).lean();
      }
    }

    plansCache = plans;

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error("Error fetching founder plans:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error fetching founder plans",
      error: error.message
    });
  }
};

// @desc    Get single founder plan by key
// @route   GET /api/founder-plans/:key
// @access  Public
exports.getFounderPlanByKey = async (req, res) => {
  try {
    const plan = await FounderPlan.findOne({ key: req.params.key });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Founder plan not found with key of ${req.params.key}`
      });
    }
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching founder plan",
      error: error.message
    });
  }
};

// @desc    Create new founder plan
// @route   POST /api/founder-plans
// @access  Private/Admin
exports.createFounderPlan = async (req, res) => {
  try {
    const { key, title, starterPrice } = req.body;
    if (!key || !title || !starterPrice) {
      return res.status(400).json({
        success: false,
        message: "Key, Title and Starter Price are required"
      });
    }

    const existing = await FounderPlan.findOne({ key });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A founder plan with key '${key}' already exists`
      });
    }

    const newPlan = await FounderPlan.create(req.body);
    invalidateCache();

    res.status(201).json({
      success: true,
      data: newPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error creating founder plan",
      error: error.message
    });
  }
};

// @desc    Update founder plan
// @route   PUT /api/founder-plans/:id
// @access  Public / Admin
exports.updateFounderPlan = async (req, res) => {
  try {
    const target = (req.params.id || "").trim();
    let plan = null;

    // Check if valid ObjectId
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(target)) {
      plan = await FounderPlan.findById(target);
    }

    // Fallback to finding by key (exact or case-insensitive)
    if (!plan) {
      plan = await FounderPlan.findOne({ key: target });
    }
    if (!plan) {
      plan = await FounderPlan.findOne({
        key: { $regex: new RegExp(`^${target}$`, "i") }
      });
    }

    // Fallback to finding by title (case-insensitive)
    if (!plan) {
      plan = await FounderPlan.findOne({
        title: { $regex: new RegExp(`^${target}$`, "i") }
      });
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Founder plan not found with id, key, or title of "${req.params.id}"`
      });
    }

    // Strip immutable / reserved fields to prevent Mongoose errors
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Synchronize price & totalPrice inside plans array if provided
    if (Array.isArray(updateData.plans)) {
      updateData.plans = updateData.plans.map((p) => ({
        ...p,
        price: p.price || p.totalPrice || "",
        totalPrice: p.totalPrice || p.price || ""
      }));
    }

    const updatedPlan = await FounderPlan.findByIdAndUpdate(
      plan._id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    invalidateCache();

    res.status(200).json({
      success: true,
      data: updatedPlan
    });
  } catch (error) {
    console.error("Server Error updating founder plan:", error);
    res.status(500).json({
      success: false,
      message: "Server Error updating founder plan",
      error: error.message
    });
  }
};

// @desc    Delete founder plan
// @route   DELETE /api/founder-plans/:id
// @access  Private/Admin
exports.deleteFounderPlan = async (req, res) => {
  try {
    const plan = await FounderPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Founder plan not found with id of ${req.params.id}`
      });
    }

    await FounderPlan.findByIdAndDelete(req.params.id);
    invalidateCache();

    res.status(200).json({
      success: true,
      message: "Founder plan deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting founder plan",
      error: error.message
    });
  }
};
