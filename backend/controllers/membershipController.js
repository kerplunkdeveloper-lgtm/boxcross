const MembershipPlan = require("../models/MembershipPlan");

const defaultMembershipPlans = [
  {
    key: "core",
    title: "CORE",
    subtitle: "ONE PATHWAY",
    sessionInfo: "Five Coached sessions a week — Boxing, HYROX or Strength Training",
    desc: "Five Coached sessions a week — Boxing, HYROX or Strength Training.",
    starterPrice: "2,800",
    dailyRate: "₹92",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "Two coffees and a vada.",
    features: [
      "Five Coached sessions a week",
      "One pathway (Boxing, HYROX or Strength Training)",
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
        subtitle: "SAVE ₹500",
        price: "10,000",
        perMonth: "3,333",
        originalPrice: "10,500",
        totalPrice: "10,000",
        highlights: [
          "3 coached sessions a week",
          "Held rate for full term",
          "Coach assessment"
        ],
        tag: "SAVE ₹500",
        buttonText: "SAVE ₹500",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹2,100",
        price: "18,900",
        perMonth: "3,150",
        originalPrice: "21,000",
        totalPrice: "18,900",
        highlights: [
          "3 coached sessions a week",
          "Locked rate for full term",
          "Guest passes included"
        ],
        tag: "SAVE ₹2,100",
        buttonText: "SAVE ₹2,100",
        isPopular: true
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹8,400",
        price: "33,600",
        perMonth: "2,800",
        originalPrice: "42,000",
        totalPrice: "33,600",
        highlights: [
          "3 coached sessions a week",
          "Maximum discount",
          "Priority booking & perks"
        ],
        tag: "SAVE ₹8,400",
        buttonText: "SAVE ₹8,400",
        isPopular: false
      }
    ]
  },
  {
    key: "athlete",
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    sessionInfo: "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training)",
    desc: "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training).",
    starterPrice: "4,000",
    dailyRate: "₹132",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "One burger.",
    features: [
      "Five coached sessions a week",
      "Two disciplines / pathways (Boxing + HYROX or Boxing + Strength Training)",
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
        subtitle: "SAVE ₹800",
        price: "14,200",
        perMonth: "4,733",
        originalPrice: "15,000",
        totalPrice: "14,200",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Coach assessment"
        ],
        tag: "SAVE ₹800",
        buttonText: "SAVE ₹800",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹3,000",
        price: "27,000",
        perMonth: "4,500",
        originalPrice: "30,000",
        totalPrice: "27,000",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Guest passes included"
        ],
        tag: "SAVE ₹3,000",
        buttonText: "SAVE ₹3,000",
        isPopular: true
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹12,000",
        price: "48,000",
        perMonth: "4,000",
        originalPrice: "60,000",
        totalPrice: "48,000",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "Priority booking & perks"
        ],
        tag: "SAVE ₹12,000",
        buttonText: "SAVE ₹12,000",
        isPopular: false
      }
    ]
  },
  {
    key: "arena",
    title: "ARENA",
    subtitle: "EVERYTHING",
    sessionInfo: "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)",
    desc: "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training).",
    starterPrice: "5,600",
    dailyRate: "₹184",
    dailyRateLabel: "A DAY ON THE 12-MONTH PLAN",
    dailyComparison: "One pizza.",
    features: [
      "Five coached sessions a week",
      "Every pathway, every class (Boxing + HYROX + Strength Training)",
      "Priority ring & arena floor",
      "VIP member perks"
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
        subtitle: "SAVE ₹1,000",
        price: "20,000",
        perMonth: "6,667",
        originalPrice: "21,000",
        totalPrice: "20,000",
        highlights: [
          "5 coached sessions a week",
          "All pathways & disciplines",
          "Coach assessment"
        ],
        tag: "SAVE ₹1,000",
        buttonText: "SAVE ₹1,000",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹4,200",
        price: "37,800",
        perMonth: "6,300",
        originalPrice: "42,000",
        totalPrice: "37,800",
        highlights: [
          "5 coached sessions a week",
          "All pathways & disciplines",
          "Guest passes included"
        ],
        tag: "SAVE ₹4,200",
        buttonText: "SAVE ₹4,200",
        isPopular: true
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹16,800",
        price: "67,200",
        perMonth: "5,600",
        originalPrice: "84,000",
        totalPrice: "67,200",
        highlights: [
          "5 coached sessions a week",
          "All pathways & disciplines",
          "VIP Wall & passes"
        ],
        tag: "SAVE ₹16,800",
        buttonText: "SAVE ₹16,800",
        isPopular: false
      }
    ]
  },
  {
    key: "junior",
    title: "JUNIOR",
    subtitle: "UNDER 13",
    sessionInfo: "Five Coached sessions a week",
    desc: "Five Coached sessions a week. Youth boxing, discipline and athletic development.",
    starterPrice: "1,958",
    dailyRate: "₹64",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One masala dosa.",
    features: [
      "Five Coached sessions a week",
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

// @desc    Get all membership plans
// @route   GET /api/memberships
// @access  Public
exports.getMembershipPlans = async (req, res) => {
  try {
    // Permanently remove old legacy plans from MongoDB
    await MembershipPlan.deleteMany({
      key: { $nin: ["core", "athlete", "arena", "junior"] }
    });

    let plans = await MembershipPlan.find({
      key: { $in: ["core", "athlete", "arena", "junior"] }
    });

    // Ensure default plans exist without overwriting admin edits
    for (const defaultPlan of defaultMembershipPlans) {
      await MembershipPlan.findOneAndUpdate(
        { key: defaultPlan.key },
        { $setOnInsert: defaultPlan },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Auto-update MongoDB records if they still have old strings (e.g. Fight instead of Boxing)
    await MembershipPlan.updateOne(
      { key: "core", sessionInfo: /Fight/i },
      {
        $set: {
          sessionInfo: "Five Coached sessions a week — Boxing, HYROX or Strength Training",
          desc: "Five Coached sessions a week — Boxing, HYROX or Strength Training."
        }
      }
    );
    await MembershipPlan.updateOne(
      { key: "athlete", sessionInfo: { $not: /Boxing/i } },
      {
        $set: {
          sessionInfo: "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training)",
          desc: "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training)."
        }
      }
    );
    await MembershipPlan.updateOne(
      { key: "arena", sessionInfo: { $not: /Boxing/i } },
      {
        $set: {
          sessionInfo: "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)",
          desc: "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)."
        }
      }
    );

    plans = await MembershipPlan.find({
      key: { $in: ["core", "athlete", "arena", "junior"] }
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching membership plans",
      error: error.message
    });
  }
};


// @desc    Get single membership plan by key
// @route   GET /api/memberships/:key
// @access  Public
exports.getMembershipPlanByKey = async (req, res) => {
  try {
    const plan = await MembershipPlan.findOne({ key: req.params.key });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with key of ${req.params.key}`
      });
    }
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Update membership plan
// @route   PUT /api/memberships/:id
// @access  Private/Admin
exports.updateMembershipPlan = async (req, res) => {
  try {
    let plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with id of ${req.params.id}`
      });
    }

    plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error updating membership plan",
      error: error.message
    });
  }
};

// @desc    Delete membership plan
// @route   DELETE /api/memberships/:id
// @access  Private/Admin
exports.deleteMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with id of ${req.params.id}`
      });
    }

    await MembershipPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Membership plan deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error deleting membership plan",
      error: error.message
    });
  }
};

