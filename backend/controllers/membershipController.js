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
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹26,400",
        price: "57,600",
        perMonth: "2,400",
        originalPrice: "84,000",
        totalPrice: "57,600",
        highlights: [
          "3 coached sessions a week",
          "2-Year rate freeze guarantee",
          "Founding Elite Wall badge & gear pack"
        ],
        tag: "SAVE ₹26,400",
        buttonText: "SAVE ₹26,400",
        isPopular: false
      }
    ],
    isComingSoon: false
  },
  {
    key: "athlete",
    isComingSoon: true,
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
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹36,000",
        price: "84,000",
        perMonth: "3,500",
        originalPrice: "120,000",
        totalPrice: "84,000",
        highlights: [
          "4 coached sessions a week",
          "Two disciplines access",
          "2-Year rate freeze guarantee"
        ],
        tag: "SAVE ₹36,000",
        buttonText: "SAVE ₹36,000",
        isPopular: false
      }
    ]
  },
  {
    key: "arena",
    isComingSoon: true,
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
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹52,800",
        price: "115,200",
        perMonth: "4,800",
        originalPrice: "168,000",
        totalPrice: "115,200",
        highlights: [
          "5 coached sessions a week",
          "All pathways & disciplines",
          "2-Year rate freeze guarantee"
        ],
        tag: "SAVE ₹52,800",
        buttonText: "SAVE ₹52,800",
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
      },
      {
        months: "24 MONTHS",
        subtitle: "BEST VALUE",
        price: "39,600",
        perMonth: "1,650",
        originalPrice: "72,000",
        totalPrice: "39,600",
        highlights: [
          "3 coached sessions a week",
          "Long-term youth athletic mastery",
          "2-Year rate freeze guarantee"
        ],
        tag: "SAVE ₹32,400",
        buttonText: "SAVE ₹32,400",
        isPopular: false
      }
    ],
    isComingSoon: false
  },
  {
    key: "duo",
    title: "BXC DUO",
    subtitle: "2 PERSON PASS",
    sessionInfo: "Five coached sessions a week for 2 members across your chosen pathways",
    desc: "Five coached sessions a week for 2 members across your chosen pathways.",
    starterPrice: "6,800",
    dailyRate: "₹224",
    dailyRateLabel: "A DAY FOR 2 ON 12-MONTH PLAN",
    dailyComparison: "Two coffees & breakfast for two.",
    features: [
      "Two memberships under one account",
      "Five coached sessions a week for both members",
      "Partner workout programming & benchmarks",
      "Full open gym & recovery lounge access"
    ],
    benefits: [
      {
        boldText: "You never skip when someone waits.",
        normalText: "Partner accountability cuts skipped sessions by over 70%."
      },
      {
        boldText: "Shared grind builds stronger bonds.",
        normalText: "Sweat together in the ring, conquer HYROX benchmarks together."
      },
      {
        boldText: "Coached side-by-side.",
        normalText: "Train as a team with dedicated coaches pushing you both."
      },
      {
        boldText: "Better value, together.",
        normalText: "Complete premium arena access priced for two athletes."
      }
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "8,500",
        perMonth: "8,500",
        originalPrice: "",
        totalPrice: "8,500",
        highlights: [
          "Five coached sessions a week",
          "Access for 2 partners",
          "Full arena facilities"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹1,500",
        price: "24,000",
        perMonth: "8,000",
        originalPrice: "25,500",
        totalPrice: "24,000",
        highlights: [
          "Five coached sessions a week",
          "Held rate for full term",
          "Joint coach assessment"
        ],
        tag: "SAVE ₹1,500",
        buttonText: "SAVE ₹1,500",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹6,000",
        price: "45,000",
        perMonth: "7,500",
        originalPrice: "51,000",
        totalPrice: "45,000",
        highlights: [
          "Five coached sessions a week",
          "Locked rate for both members",
          "Partner progress card"
        ],
        tag: "SAVE ₹6,000",
        buttonText: "SAVE ₹6,000",
        isPopular: true
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹20,400",
        price: "81,600",
        perMonth: "6,800",
        originalPrice: "102,000",
        totalPrice: "81,600",
        highlights: [
          "Five coached sessions a week",
          "Maximum partner discount",
          "Founding Wall duo recognition"
        ],
        tag: "SAVE ₹20,400",
        buttonText: "SAVE ₹20,400",
        isPopular: false
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹64,800",
        price: "139,200",
        perMonth: "5,800",
        originalPrice: "204,000",
        totalPrice: "139,200",
        highlights: [
          "Five coached sessions a week",
          "2-Year rate freeze for both partners",
          "Founding Wall duo recognition"
        ],
        tag: "SAVE ₹64,800",
        buttonText: "SAVE ₹64,800",
        isPopular: false
      }
    ],
    isComingSoon: false
  },
  {
    key: "family",
    title: "BXC FAMILY FIT",
    subtitle: "ALL AGES FAMILY",
    sessionInfo: "Full arena access for parents + Junior coaching for kids (up to 4 members)",
    desc: "Full arena access for parents + Junior coaching for kids (up to 4 members).",
    starterPrice: "11,900",
    dailyRate: "₹390",
    dailyRateLabel: "A DAY FOR THE WHOLE FAMILY",
    dailyComparison: "One weekend family dinner.",
    features: [
      "Access for up to 4 family members (Adults + Juniors)",
      "Adult pathways (Boxing, HYROX, Strength) + Junior Youth classes",
      "Synchronized weekend session slots & open gym",
      "Family fitness assessment & quarterly milestones"
    ],
    benefits: [
      {
        boldText: "Active role models inspire children.",
        normalText: "Kids do what they see. When parents train, healthy habits become second nature."
      },
      {
        boldText: "Screen-free family time with purpose.",
        normalText: "Replace screen time with punches, agility ladders, and shared sweat."
      },
      {
        boldText: "Concurrent schedules that save your weekend.",
        normalText: "Drop off junior for boxing while you hit the HYROX floor simultaneously."
      },
      {
        boldText: "One simple plan for everyone.",
        normalText: "Unrestricted arena access for the whole family without four separate bills."
      }
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "15,000",
        perMonth: "15,000",
        originalPrice: "",
        totalPrice: "15,000",
        highlights: [
          "Coached sessions for up to 4 members",
          "Adult pathways + Junior boxing",
          "Arena weekend open access"
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹3,000",
        price: "42,000",
        perMonth: "14,000",
        originalPrice: "45,000",
        totalPrice: "42,000",
        highlights: [
          "Coached sessions for all members",
          "Held rate for full term",
          "Family fitness card"
        ],
        tag: "SAVE ₹3,000",
        buttonText: "SAVE ₹3,000",
        isPopular: false
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹12,000",
        price: "78,000",
        perMonth: "13,000",
        originalPrice: "90,000",
        totalPrice: "78,000",
        highlights: [
          "Coached sessions for all members",
          "Technique & athletic milestone tracking",
          "Guest passes for friends"
        ],
        tag: "SAVE ₹12,000",
        buttonText: "SAVE ₹12,000",
        isPopular: true
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹37,200",
        price: "142,800",
        perMonth: "11,900",
        originalPrice: "180,000",
        totalPrice: "142,800",
        highlights: [
          "Full year complete family arena access",
          "Maximum savings for 4 athletes",
          "Founding Family wall recognition"
        ],
        tag: "SAVE ₹37,200",
        buttonText: "SAVE ₹37,200",
        isPopular: false
      },
      {
        months: "24 MONTHS",
        subtitle: "SAVE ₹122,400",
        price: "237,600",
        perMonth: "9,900",
        originalPrice: "360,000",
        totalPrice: "237,600",
        highlights: [
          "Coached sessions for up to 4 members",
          "2-Year rate freeze for entire family",
          "Founding Family permanent recognition"
        ],
        tag: "SAVE ₹122,400",
        buttonText: "SAVE ₹122,400",
        isPopular: false
      }
    ],
    isComingSoon: false
  }
];

// @desc    Get all membership plans
// @route   GET /api/memberships
// @access  Public
exports.getMembershipPlans = async (req, res) => {
  try {
    // Permanently remove old legacy plans from MongoDB
    await MembershipPlan.deleteMany({
      key: { $nin: ["core", "athlete", "arena", "junior", "duo", "family"] }
    });

    // Ensure default plans exist and dynamically add 24 MONTHS plan if missing in DB
    for (const defaultPlan of defaultMembershipPlans) {
      const existingDoc = await MembershipPlan.findOne({ key: defaultPlan.key });
      if (!existingDoc) {
        await MembershipPlan.create(defaultPlan);
      } else {
        const has24 = existingDoc.plans && existingDoc.plans.some(p => p.months && p.months.includes("24"));
        if (!has24) {
          const plan24 = defaultPlan.plans.find(p => p.months && p.months.includes("24"));
          if (plan24) {
            existingDoc.plans.push(plan24);
            await existingDoc.save();
          }
        }
      }
    }

    // If isComingSoon is undefined in existing DB records, initialize them
    await MembershipPlan.updateMany(
      { key: { $in: ["athlete", "arena"] }, isComingSoon: { $exists: false } },
      { $set: { isComingSoon: true } }
    );
    await MembershipPlan.updateMany(
      { key: { $in: ["core", "junior", "duo", "family"] }, isComingSoon: { $exists: false } },
      { $set: { isComingSoon: false } }
    );

    plans = await MembershipPlan.find({
      key: { $in: ["core", "athlete", "arena", "junior", "duo", "family"] }
    });

    const sortOrder = ["core", "athlete", "arena", "duo", "family", "junior"];
    plans.sort((a, b) => {
      const idxA = sortOrder.indexOf(a.key?.toLowerCase());
      const idxB = sortOrder.indexOf(b.key?.toLowerCase());
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
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
    const target = req.params.id;
    let plan = null;

    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(target)) {
      plan = await MembershipPlan.findById(target);
    }
    if (!plan) {
      plan = await MembershipPlan.findOne({ key: target });
    }
    if (!plan) {
      plan = await MembershipPlan.findOne({
        key: { $regex: new RegExp(`^${target}$`, "i") }
      });
    }
    if (!plan) {
      plan = await MembershipPlan.findOne({
        title: { $regex: new RegExp(`^${target}$`, "i") }
      });
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: `Membership plan not found with id or key of "${req.params.id}"`
      });
    }

    // Strip immutable fields
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Synchronize price and totalPrice inside plans array if provided
    if (Array.isArray(updateData.plans)) {
      updateData.plans = updateData.plans.map((p) => ({
        ...p,
        price: p.price || p.totalPrice || "",
        totalPrice: p.price || p.totalPrice || ""
      }));
    }

    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      plan._id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      data: updatedPlan
    });
  } catch (error) {
    console.error("Server Error updating membership plan:", error);
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

