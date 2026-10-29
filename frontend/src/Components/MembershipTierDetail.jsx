import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Zap,
  Shield,
  Dumbbell,
  Trophy,
  Flame,
  Clock,
  Calendar,
  Sparkles,
  Phone,
  HelpCircle,
  Users,
  Target,
  Layers,
  Award,
  Activity,
} from "lucide-react";
import ChoosePlan from "./ChoosePlan";
import RazorpayMembershipModal from "./RazorpayMembershipModal";
import { getMembershipPlans } from "../api/api";
import juniorBoxer from "../assets/junior_boxer.jpg";
import familyFatherSonImg from "../assets/family_father_son.jpg";

const defaultJuniorData = {
  title: "JUNIOR CORE",
  subtitle: "UNDER 13 BOXING & FITNESS",
  sessionInfo: "Five Coached sessions a week for Kids (Ages 6-13)",
  dailyRate: "₹64",
  dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
  dailyComparison: "One masala dosa.",
  features: [
    "Boxing Training for Juniors (Under 13)",
    "Certified Youth Coach Guidance",
    "Boxing Fundamentals & Footwork",
    "Discipline, Focus & Confidence",
    "Agility, Reflexes & Coordination",
    "100% Supervised Safe Arena Floor",
    "Quarterly Progress Assessments",
  ],
  benefits: [
    {
      boldText: "Confidence that shows up at school.",
      normalText: "A child who can hold a stance stops shrinking in a crowd.",
    },
    {
      boldText: "They learn to handle themselves — and when not to.",
      normalText: "Discipline is taught before the punch is.",
    },
    {
      boldText: "Focus that carries into homework.",
      normalText: "Three rounds of concentration, three evenings a week.",
    },
    {
      boldText: "Off the screen, on their feet.",
      normalText: "Tired in the right way by 7pm.",
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "3,000",
      perMonth: "3,000",
      originalPrice: "",
      totalPrice: "3,000",
      mobileFeatures: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      highlights: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "FOUNDING RATE",
      price: "7,500",
      perMonth: "2,500",
      originalPrice: "8,600",
      totalPrice: "7,500",
      mobileFeatures: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      highlights: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      tag: "SAVE ₹1,100",
      buttonText: "SAVE ₹1,100",
    },
    {
      months: "6 MONTHS",
      subtitle: "BEST PROGRESS",
      price: "13,500",
      perMonth: "2,250",
      originalPrice: "16,200",
      totalPrice: "13,500",
      mobileFeatures: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      highlights: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      tag: "SAVE ₹2,700",
      buttonText: "SAVE ₹2,700",
      isPopular: true,
    },
    {
      months: "12 MONTHS",
      subtitle: "BEST VALUE",
      price: "23,500",
      perMonth: "1,958",
      originalPrice: "28,800",
      totalPrice: "23,500",
      mobileFeatures: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      highlights: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      tag: "SAVE ₹5,300",
      buttonText: "SAVE ₹5,300",
    },
    {
      months: "24 MONTHS",
      subtitle: "BEST VALUE",
      price: "39,600",
      perMonth: "1,650",
      originalPrice: "72,000",
      totalPrice: "39,600",
      mobileFeatures: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      highlights: [
        "Junior Boxing Coaching",
        "Youth Fundamentals & Bag Work",
        "Supervised Safe Training",
      ],
      tag: "SAVE ₹32,400",
      buttonText: "SAVE ₹32,400",
    },
  ],
  starterPrice: "1,958",
};

const defaultFamilyData = {
  title: "BXC FAMILY FIT",
  subtitle: "ALL AGES FAMILY",
  sessionInfo: "Full arena access for parents + Junior coaching for kids (up to 4 members)",
  dailyRate: "₹390",
  dailyRateLabel: "A DAY FOR THE WHOLE FAMILY",
  dailyComparison: "One weekend family dinner.",
  features: [
    "Parent + Child Membership",
    "Strength / Boxing for Parent",
    "Junior Boxing for Child",
    "Coach-Guided Sessions",
    "Progress Tracking",
    "BXC Tribe Access",
    "Family Fitness Experience",
  ],
  benefits: [
    {
      boldText: "Active role models inspire children.",
      normalText: "Kids do what they see. When parents train, healthy habits become second nature.",
    },
    {
      boldText: "Screen-free family time with purpose.",
      normalText: "Replace screen time with punches, agility ladders, and shared sweat.",
    },
    {
      boldText: "Concurrent schedules that save your weekend.",
      normalText: "Drop off junior for boxing while you hit the HYROX floor simultaneously.",
    },
    {
      boldText: "One simple plan for everyone.",
      normalText: "Unrestricted arena access for the whole family without four separate bills.",
    },
  ],
  plans: [
    {
      months: "1 MONTH",
      subtitle: "STANDARD",
      price: "15,000",
      perMonth: "15,000",
      originalPrice: "",
      totalPrice: "15,000",
      mobileFeatures: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
        "Progress Tracking",
        "BXC Tribe Access",
        "Family Fitness Experience",
      ],
      highlights: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
      ],
      tag: "STANDARD",
      buttonText: "STANDARD",
    },
    {
      months: "3 MONTHS",
      subtitle: "SAVE ₹3,000",
      price: "42,000",
      perMonth: "14,000",
      originalPrice: "45,000",
      totalPrice: "42,000",
      mobileFeatures: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
        "Progress Tracking",
        "BXC Tribe Access",
        "Family Fitness Experience",
      ],
      highlights: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
      ],
      tag: "SAVE ₹3,000",
      buttonText: "SAVE ₹3,000",
    },
    {
      months: "6 MONTHS",
      subtitle: "BEST PROGRESS",
      price: "78,000",
      perMonth: "13,000",
      originalPrice: "90,000",
      totalPrice: "78,000",
      mobileFeatures: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
        "Progress Tracking",
        "BXC Tribe Access",
        "Family Fitness Experience",
      ],
      highlights: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
      ],
      tag: "SAVE ₹12,000",
      buttonText: "SAVE ₹12,000",
      isPopular: true,
    },
    {
      months: "12 MONTHS",
      subtitle: "BEST VALUE",
      price: "142,800",
      perMonth: "11,900",
      originalPrice: "180,000",
      totalPrice: "142,800",
      mobileFeatures: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
        "Progress Tracking",
        "BXC Tribe Access",
        "Family Fitness Experience",
      ],
      highlights: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
      ],
      tag: "SAVE ₹37,200",
      buttonText: "SAVE ₹37,200",
    },
    {
      months: "24 MONTHS",
      subtitle: "BEST VALUE",
      price: "237,600",
      perMonth: "9,900",
      originalPrice: "360,000",
      totalPrice: "237,600",
      mobileFeatures: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
        "Progress Tracking",
        "BXC Tribe Access",
        "Family Fitness Experience",
      ],
      highlights: [
        "Parent + Child Membership",
        "Strength / Boxing for Parent",
        "Junior Boxing for Child",
        "Coach-Guided Sessions",
      ],
      tag: "SAVE ₹122,400",
      buttonText: "SAVE ₹122,400",
    },
  ],
  starterPrice: "3,999",
};

const MembershipTierDetail = ({ tierData, customTabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pricingRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const isCoreTier = tierData.id === "core";
  const isJuniorActive = false;
  const isFamilyActive = false;

  // Dynamic Tier Data synchronized with API and cache
  const [dynamicTierData, setDynamicTierData] = useState(() => {
    try {
      const cached = localStorage.getItem("boxcross_membership_plans_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const key = tierData.id.toLowerCase();
        if (parsed && parsed[key]) {
          return {
            ...tierData,
            ...parsed[key],
            plans: parsed[key].plans?.length ? parsed[key].plans : tierData.plans,
            starterPrice: parsed[key].starterPrice || tierData.starterPrice,
          };
        }
      }
    } catch (e) {}
    return tierData;
  });

  // Dynamic Junior Data synchronized with API and cache
  const [dynamicJuniorData, setDynamicJuniorData] = useState(() => {
    try {
      const cached = localStorage.getItem("boxcross_membership_plans_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.junior || parsed["junior-core"])) {
          const jData = parsed.junior || parsed["junior-core"];
          return {
            ...defaultJuniorData,
            ...jData,
            plans: jData.plans?.length ? jData.plans : defaultJuniorData.plans,
            starterPrice: jData.starterPrice || defaultJuniorData.starterPrice,
          };
        }
      }
    } catch (e) {}
    return defaultJuniorData;
  });

  // Dynamic Family Data synchronized with API and cache
  const [dynamicFamilyData, setDynamicFamilyData] = useState(() => {
    try {
      const cached = localStorage.getItem("boxcross_membership_plans_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.family || parsed["family-fit"] || parsed["bxc-family-fit"])) {
          const fData = parsed.family || parsed["family-fit"] || parsed["bxc-family-fit"];
          return {
            ...defaultFamilyData,
            ...fData,
            plans: fData.plans?.length ? fData.plans : defaultFamilyData.plans,
            starterPrice: fData.starterPrice || defaultFamilyData.starterPrice,
          };
        }
      }
    } catch (e) {}
    return defaultFamilyData;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isFocus12m =
      params.get("focus") === "12m" ||
      params.get("plan") === "12m" ||
      location.hash === "#pricing" ||
      location.hash === "#twelve-month-card";

    if (!isFocus12m) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      const trigger12mFocus = () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("select-twelve-month-plan"));
        }

        const targetCard =
          document.getElementById("twelve-month-card") ||
          document.getElementById("pricing") ||
          document.getElementById("choose-plan");

        if (targetCard) {
          const rect = targetCard.getBoundingClientRect();
          const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          const targetY =
            currentScroll + rect.top + rect.height / 2 - window.innerHeight / 2;

          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth",
          });

          targetCard.classList.add(
            "ring-4",
            "ring-[#ccf141]",
            "shadow-[0_0_50px_rgba(204,241,65,0.7)]",
            "transition-all",
            "duration-500",
          );
          setTimeout(() => {
            targetCard.classList.remove(
              "ring-4",
              "ring-[#ccf141]",
              "shadow-[0_0_50px_rgba(204,241,65,0.7)]",
            );
          }, 2400);
        }
      };

      const t1 = setTimeout(trigger12mFocus, 200);
      const t2 = setTimeout(trigger12mFocus, 650);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [location.search, location.hash]);

  useEffect(() => {

    const fetchPlans = async () => {
      try {
        const response = await getMembershipPlans();
        if (response.data && response.data.success) {
          const plans = response.data.data;
          const keyLower = tierData.id.toLowerCase();
          const dbPlan = plans.find((p) => p.key?.toLowerCase() === keyLower);
          if (dbPlan) {
            setDynamicTierData((prev) => ({
              ...prev,
              title: dbPlan.title || prev.title,
              subtitle: dbPlan.subtitle || prev.subtitle,
              sessionInfo: dbPlan.sessionInfo || prev.sessionInfo,
              dailyRate: dbPlan.dailyRate || prev.dailyRate,
              dailyRateLabel: dbPlan.dailyRateLabel || prev.dailyRateLabel,
              dailyComparison: dbPlan.dailyComparison || prev.dailyComparison,
              features: dbPlan.features?.length ? dbPlan.features : prev.features,
              benefits: dbPlan.benefits?.length ? dbPlan.benefits : prev.benefits,
              plans: dbPlan.plans?.length ? dbPlan.plans : prev.plans,
              starterPrice: dbPlan.starterPrice || prev.starterPrice,
              isComingSoon: !!dbPlan.isComingSoon,
            }));
          }

          if (isCoreTier) {
            const juniorDb = plans.find(
              (p) =>
                p.key?.toLowerCase() === "junior" ||
                p.key?.toLowerCase() === "junior-core",
            );
            if (juniorDb) {
              setDynamicJuniorData((prev) => ({
                ...prev,
                title: juniorDb.title || prev.title,
                subtitle: juniorDb.subtitle || prev.subtitle,
                sessionInfo: juniorDb.sessionInfo || prev.sessionInfo,
                dailyRate: juniorDb.dailyRate || prev.dailyRate,
                dailyRateLabel: juniorDb.dailyRateLabel || prev.dailyRateLabel,
                dailyComparison: juniorDb.dailyComparison || prev.dailyComparison,
                features: juniorDb.features?.length ? juniorDb.features : prev.features,
                benefits: juniorDb.benefits?.length ? juniorDb.benefits : prev.benefits,
                plans: juniorDb.plans?.length ? juniorDb.plans : prev.plans,
                starterPrice: juniorDb.starterPrice || prev.starterPrice,
              }));
            }

            const familyDb = plans.find(
              (p) =>
                p.key?.toLowerCase() === "family" ||
                p.key?.toLowerCase() === "family-fit" ||
                p.key?.toLowerCase().includes("family"),
            );
            if (familyDb) {
              setDynamicFamilyData((prev) => ({
                ...prev,
                title: familyDb.title || prev.title,
                subtitle: familyDb.subtitle || prev.subtitle,
                sessionInfo: familyDb.sessionInfo || prev.sessionInfo,
                dailyRate: familyDb.dailyRate || prev.dailyRate,
                dailyRateLabel: familyDb.dailyRateLabel || prev.dailyRateLabel,
                dailyComparison: familyDb.dailyComparison || prev.dailyComparison,
                features: familyDb.features?.length ? familyDb.features : prev.features,
                benefits: familyDb.benefits?.length ? familyDb.benefits : prev.benefits,
                plans: familyDb.plans?.length ? familyDb.plans : prev.plans,
                starterPrice: familyDb.starterPrice || prev.starterPrice,
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error loading membership tier plans:", err);
      }
    };

    fetchPlans();

    let channel = null;
    try {
      channel = new BroadcastChannel("membership_plan_updates");
      channel.onmessage = (event) => {
        if (event.data === "PLAN_UPDATED") {
          fetchPlans();
        }
      };
    } catch (e) {}

    const handleStorage = (e) => {
      if (e.key === "boxcross_membership_plans_updated") {
        fetchPlans();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch (e) {}
      }
      window.removeEventListener("storage", handleStorage);
    };
  }, [tierData.id, isCoreTier]);

  // Handler invoked when selecting a plan in ChoosePlan slider
  const handlePlanSelect = (planName, price, durationStr) => {
    const monthsVal = durationStr ? parseInt(durationStr, 10) || 1 : 1;
    const currentName = isFamilyActive
      ? (dynamicFamilyData.title || "BXC Family Fit")
      : isJuniorActive
      ? (dynamicJuniorData.title || "Junior Core")
      : dynamicTierData.title;
    setSelectedPlan({
      name: `${currentName} - ${planName}`,
      price: price,
      monthsVal: monthsVal,
      duration: planName,
      tier: isFamilyActive ? "family" : isJuniorActive ? "junior" : tierData.id,
      tierTitle: currentName,
      programTitle: currentName,
    });
    setIsModalOpen(true);
  };

  const handleBookTour = () => {
    navigate("/#book-your-free-gym-tour");
    setTimeout(() => {
      const el = document.getElementById("book-your-free-gym-tour");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Build activeData object matching ChoosePlan expectations
  const activePlanData = isFamilyActive
    ? {
        title: dynamicFamilyData.title || "BXC FAMILY FIT",
        subtitle: dynamicFamilyData.subtitle || "ALL AGES FAMILY",
        sessionInfo: dynamicFamilyData.sessionInfo,
        dailyRate: dynamicFamilyData.dailyRate,
        dailyRateLabel: dynamicFamilyData.dailyRateLabel || "A DAY FOR THE WHOLE FAMILY",
        dailyComparison: dynamicFamilyData.dailyComparison,
        features: dynamicFamilyData.features || [],
        benefits: dynamicFamilyData.benefits || [],
        plans: dynamicFamilyData.plans || [],
        starterPrice: dynamicFamilyData.starterPrice,
      }
    : isJuniorActive
    ? {
        title: dynamicJuniorData.title || "JUNIOR CORE",
        subtitle: dynamicJuniorData.subtitle || "UNDER 13 BOXING & FITNESS",
        sessionInfo: dynamicJuniorData.sessionInfo,
        dailyRate: dynamicJuniorData.dailyRate,
        dailyRateLabel: dynamicJuniorData.dailyRateLabel || "A DAY AS A FOUNDING MEMBER",
        dailyComparison: dynamicJuniorData.dailyComparison,
        features: dynamicJuniorData.features || [],
        benefits: dynamicJuniorData.benefits || [],
        plans: dynamicJuniorData.plans || [],
        starterPrice: dynamicJuniorData.starterPrice,
      }
    : {
        title: dynamicTierData.title,
        subtitle: dynamicTierData.subtitle,
        sessionInfo: dynamicTierData.sessionInfo || dynamicTierData.desc,
        dailyRate: dynamicTierData.dailyRate,
        dailyRateLabel: dynamicTierData.dailyRateLabel || "A DAY ON THE 12-MONTH PLAN",
        dailyComparison: dynamicTierData.dailyComparison,
        features: dynamicTierData.allInclusions || dynamicTierData.features || [],
        benefits: dynamicTierData.benefits || [],
        plans: dynamicTierData.plans || [],
        starterPrice: dynamicTierData.starterPrice,
        isComingSoon: !!dynamicTierData.isComingSoon,
      };

  const singleProgramList = [
    {
      id: isFamilyActive ? "family" : isJuniorActive ? "junior" : tierData.id,
      title: isFamilyActive
        ? dynamicFamilyData.title
        : isJuniorActive
        ? dynamicJuniorData.title
        : dynamicTierData.title,
      subtitle: isFamilyActive
        ? dynamicFamilyData.subtitle
        : isJuniorActive
        ? dynamicJuniorData.subtitle
        : dynamicTierData.subtitle,
      price: isFamilyActive
        ? dynamicFamilyData.starterPrice
        : isJuniorActive
        ? dynamicJuniorData.starterPrice
        : dynamicTierData.starterPrice,
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#050505] text-white min-h-screen selection:bg-[#ccf141] selection:text-black pt-20 sm:pt-24 md:pt-28 pb-20 relative">
      <Helmet>
        <title>{tierData.metaTitle}</title>
        <meta name="description" content={tierData.metaDescription} />
        <meta property="og:title" content={tierData.metaTitle} />
        <meta property="og:description" content={tierData.metaDescription} />
      </Helmet>

      {/* TOP GLOW ACCENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[250px] sm:h-[300px] bg-[#ccf141]/10 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* ================= BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <Link to="/" className="hover:text-white transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight size={13} className="text-neutral-600 shrink-0" />
          <Link to="/" className="hover:text-white transition-colors shrink-0">
            Membership
          </Link>
          <ChevronRight size={13} className="text-neutral-600 shrink-0" />
          <span className="text-[#ccf141] font-semibold shrink-0">{dynamicTierData.title}</span>
        </nav>

        {/* CUSTOM TABS (e.g. FOR BXC DUO: CORE / ATHLETE / ARENA) */}
        {customTabs && <div className="mb-6 sm:mb-8 max-w-full overflow-hidden">{customTabs}</div>}

        {/* ================= HERO SECTION WITH NEON PATTERN & GLOW ================= */}
        <div className="relative mb-12 sm:mb-16 rounded-3xl p-2 sm:p-6 md:p-10 lg:p-12 border border-white/10 bg-[#0a0a0d]/80 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(204,241,65,0.07)]">
          {/* CYBER NEON GRID PATTERN */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(204, 241, 65, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(204, 241, 65, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
            }}
          />

          {/* DIAGONAL SPEED SLASHES / HUD ACCENT PATTERN */}
          <div
            className="absolute -top-10 right-0 w-[420px] h-[340px] pointer-events-none opacity-15"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(204,241,65,0.3) 0, rgba(204,241,65,0.3) 1px, transparent 0, transparent 20px)",
              maskImage: "radial-gradient(circle at top right, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at top right, black 20%, transparent 75%)",
            }}
          />

          {/* DYNAMIC NEON GLOW ORBS */}
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#ccf141]/14 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-[450px] h-[450px] rounded-full bg-[#ccf141]/12 blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[320px] h-[220px] rounded-full bg-[#ccf141]/6 blur-[100px] pointer-events-none" />

          {/* LASER TOP ACCENT BEAM */}
          <div className="absolute top-0 inset-x-8 sm:inset-x-16 h-[2px] bg-gradient-to-r from-transparent via-[#ccf141] to-transparent shadow-[0_0_20px_#ccf141]" />

          {/* CORNER TECH ACCENTS */}
          <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ccf141]/40 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ccf141]/40 rounded-tr pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ccf141]/40 rounded-bl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ccf141]/40 rounded-br pointer-events-none" />

          {/* ================= MOBILE HERO (SHOWN ONLY ON MOBILE / TABLET < lg) ================= */}
          <div className="block lg:hidden relative z-10">
            {/* 1. CINEMATIC HERO POSTER CARD - CLEAN & UNCLUTTERED UX */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(204,241,65,0.12)] mb-3"
            >
              {/* BACKGROUND ATHLETE IMAGE */}
              <img
                src={tierData.image}
                alt={dynamicTierData.title}
                style={{
                  filter: "grayscale(50%) contrast(90%) brightness(90%)",
                  WebkitFilter: "grayscale(50%) contrast(90%) brightness(90%)",
                }}
                className="w-full h-[360px] sm:h-[400px] object-cover object-[center_18%] filter grayscale contrast-125 brightness-90"
              />

              {/* GRADIENTS: CLEAN FADE LEAVING ATHLETE FULLY VISIBLE */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/90 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#08080a] via-[#08080a]/95 via-45% to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ccf141] to-transparent pointer-events-none shadow-[0_0_12px_#ccf141]" />

              {/* OVERLAY CONTENT */}
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between pointer-events-auto">
                {/* TOP: PURE CLEAN BADGE */}
                <div className="flex items-center justify-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-[#ccf141]/40 text-[10px] font-black tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(204,241,65,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-[#ccf141] animate-pulse shrink-0" />
                    <span className="text-[#ccf141]">{tierData.badge}</span>
                  </div>
                </div>

                {/* BOTTOM: MINIMALIST, HIGH-IMPACT TITLE & SUBTITLE */}
                <div className="flex flex-col">
                  {/* MAIN TITLE */}
                  <h1
                    className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[0.95] text-white mb-1.5"
                    style={{ fontFamily: '"BrutalTypeBold", "Impact", sans-serif' }}
                  >
                    {dynamicTierData.title}{" "}
                    <span className="text-[#ccf141]">MEMBERSHIP</span>
                  </h1>

                  {/* 1-LINE PUNCHY SUBTITLE */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ccf141] shrink-0" />
                    <p className="text-xs font-bold text-neutral-300 uppercase tracking-wide truncate">
                      {dynamicTierData.subtitle}
                    </p>
                  </div>

                  {/* CLEAN DAILY RATE CHIP (NO CLUTTER) */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-md self-start">
                    <Sparkles size={12} className="text-[#ccf141] shrink-0" />
                    <span className="text-xs font-bold text-white">
                      {dynamicTierData.dailyRate}{" "}
                      <span className="text-neutral-400 font-normal">/ day</span>
                    </span>
                    <span className="text-neutral-500 text-[10px]">•</span>
                    <span className="text-[11px] text-[#ccf141] font-semibold">12-Month Plan</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. STATS HUD STRIP & CTA BUTTON (BELOW THE IMAGE POSTER) */}
            <div className="flex flex-col gap-2.5">
              {/* UNIFIED HORIZONTAL STATS HUD STRIP */}
              <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {/* STAT 1: SCHEDULE */}
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider text-neutral-400 mb-0.5">
                    <Calendar size={11} className="text-[#ccf141] shrink-0" />
                    <span>Schedule</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                    5 Coached / Wk
                  </span>
                </div>

                {/* STAT 2: DISCIPLINES */}
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider text-neutral-400 mb-0.5">
                    <Layers size={11} className="text-[#ccf141] shrink-0" />
                    <span>Disciplines</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate">
                    {tierData.disciplineCount}
                  </span>
                </div>

                {/* STAT 3: STARTS AT */}
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider text-neutral-400 mb-0.5">
                    <Flame size={11} className="text-[#ccf141] shrink-0" />
                    <span>Starts At</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#ccf141] uppercase tracking-tight">
                    ₹{dynamicTierData.starterPrice}/mo
                  </span>
                </div>
              </div>

              {/* PREMIUM CTA BUTTON */}
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  if (pricingRef.current) {
                    pricingRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#ccf141] via-[#d9f959] to-[#ccf141] hover:brightness-110 active:scale-[0.98] text-black font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(204,241,65,0.4),0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 group cursor-pointer text-center relative overflow-hidden"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <span className="relative z-10">Choose Your Plan</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* ================= DESKTOP HERO (ONLY SHOWN ON DESKTOP lg+) ================= */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* LEFT: INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center min-w-0"
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10.5px] sm:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-5 backdrop-blur-md max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#ccf141] animate-pulse shrink-0" />
              <span className="text-[#ccf141] truncate">{tierData.badge}</span>
            </div>

            {/* TITLE */}
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] mb-4 sm:mb-6 break-words"
              style={{ fontFamily: '"BrutalTypeBold", "Impact", sans-serif' }}
            >
              {dynamicTierData.title}
              <span className="block text-[#ccf141] text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-1">
                MEMBERSHIP
              </span>
            </h1>

            {/* SUBTITLE & DESCRIPTION */}
            <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-medium mb-2 sm:mb-3">
              {dynamicTierData.subtitle}
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {tierData.desc}
            </p>

            {/* KEY STATS PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 backdrop-blur-sm">
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#ccf141] shrink-0" />
                  <span>Schedule</span>
                </div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                  5 Coached / Wk
                </div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 backdrop-blur-sm">
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Layers size={12} className="text-[#ccf141] shrink-0" />
                  <span>Disciplines</span>
                </div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                  {tierData.disciplineCount}
                </div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Flame size={12} className="text-[#ccf141] shrink-0" />
                  <span>Starting At</span>
                </div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-[#ccf141] truncate">
                  ₹{dynamicTierData.starterPrice} / mo
                </div>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  if (pricingRef.current) {
                    pricingRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-7 py-3.5 bg-[#ccf141] text-black font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_25px_rgba(204,241,65,0.3)] flex items-center gap-2 group cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <span>Choose Your Plan</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

             
            </div>
          </motion.div>

          {/* RIGHT: CINEMATIC IMAGE CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group w-full">
              <img
                src={tierData.image}
                alt={dynamicTierData.title}
                style={{
                  filter: "grayscale(80%) contrast(90%) brightness(105%)",
                  WebkitFilter: "grayscale(80%) contrast(90%) brightness(105%)",
                }}
                className="w-full h-[280px] sm:h-[400px] lg:h-[520px] object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-700 filter grayscale contrast-125 brightness-95 group-hover:brightness-105"
              />
             

              {/* OVERLAY BADGES */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex flex-col gap-1.5 sm:gap-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 self-start max-w-full">
                  <Sparkles size={13} className="text-[#ccf141] shrink-0" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-200 truncate">
                    {dynamicTierData.dailyRate} / day on 12-Month Plan
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-400 italic">
                  "{dynamicTierData.dailyComparison}"
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

        {/* ================= STEP 2: CHOOSE PLAN SLIDE ANIMATION UI ================= */}
        {/* EXACT SAME SLIDE ANIMATION UI & DYNAMIC LOGIC FROM MEMBERSHIP PAGE */}
        <section className="mb-20">
          {/* CATEGORY SWITCHER PILLS (FOR DUO TABS IF PROVIDED) */}
          {customTabs && (
            <div className="flex justify-center mb-8 px-2">
              {customTabs}
            </div>
          )}

          <ChoosePlan
            ref={pricingRef}
            activeData={activePlanData}
            activeTab={
              isFamilyActive ? "family" : isJuniorActive ? "junior" : tierData.id
            }
            setActiveTab={() => {}}
            handlePlanSelect={handlePlanSelect}
            programs={singleProgramList}
            hideTabs={true}
            stepBadge={
              isFamilyActive
                ? "BXC FAMILY FIT · ALL AGES"
                : isJuniorActive
                ? "BXC JUNIOR (UNDER 13)"
                : "STEP 2"
            }
            sectionTitle={
              isFamilyActive ? (
                <>
                  BXC FAMILY FIT <span className="text-[#ccf141]">PLAN</span>
                </>
              ) : isJuniorActive ? (
                <>
                  JUNIOR CORE <span className="text-[#ccf141]">PLAN</span>
                </>
              ) : (
                <>
                  {dynamicTierData.title} <span className="text-[#ccf141]">PLAN</span>
                </>
              )
            }
          />
        </section>

       

        {/* ================= WHAT'S INCLUDED CHECKLIST ================= */}
        <section className="mb-12 sm:mb-20 rounded-2xl sm:rounded-3xl bg-neutral-900/50 border border-white/10 p-5 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ccf141] mb-2 block">
              FULL AMENITIES &amp; ACCESS
            </span>
            <h2
              className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 sm:mb-8"
              style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
            >
              What Every {dynamicTierData.title} Member Receives
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {tierData.allInclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ccf141]/20 flex items-center justify-center text-[#ccf141] shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= OTHER TIERS SWITCHER ================= */}
        <section className="mb-12 sm:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1 block">
              EXPLORE OTHER TIERS
            </span>
            <h2
              className="text-xl sm:text-3xl font-black uppercase tracking-tight"
              style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
            >
              Looking for Something Different?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 max-w-4xl mx-auto">
            {tierData.otherTiers.map((other) => (
              <Link
                key={other.id}
                to={other.path}
                className="p-4 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-[#ccf141] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ccf141] group-hover:scale-110 transition-transform shrink-0">
                    {other.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-widest text-[#ccf141] block truncate">
                      {other.badge}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold uppercase text-white group-hover:text-[#ccf141] transition-colors truncate">
                      {other.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-neutral-400">
                      Starting ₹{other.price} / mo
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-neutral-500 group-hover:text-[#ccf141] group-hover:translate-x-1 transition-all shrink-0 ml-2"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="mb-12 sm:mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ccf141] mb-2 block">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight"
              style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {tierData.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-neutral-900/60 border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#ccf141] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-white/10 p-5 sm:p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#ccf141]/5 blur-3xl pointer-events-none" />
          <h2
            className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 sm:mb-4 relative z-10"
            style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
          >
            Ready to Experience Box &amp; Cross?
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-8 relative z-10">
            Come visit our world-class arena in Pondicherry. Meet the coaches, tour the facilities, and feel the energy firsthand.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
           
            <a
              href="tel:+918925556800"
              className="px-8 py-4 bg-white/10 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded-xl border border-white/15 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Phone size={15} />
              <span>Call Us: +91 89255 56800</span>
            </a>
          </div>
        </div>
      </div>

      {/* RAZORPAY MEMBERSHIP MODAL */}
      {selectedPlan && (
        <RazorpayMembershipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planDetails={selectedPlan}
        />
      )}
    </div>
  );
};

export default MembershipTierDetail;
