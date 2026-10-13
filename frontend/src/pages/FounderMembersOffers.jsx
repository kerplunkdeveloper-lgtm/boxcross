import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Dumbbell,
  Crown,
  Check,
} from "lucide-react";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";
import juniorBoxer from "../assets/junior_boxer.jpg";
import { getFounderPlans } from "../api/api";
import RazorpayFounderModal from "../Components/RazorpayFounderModal";

const defaultPrograms = [
  {
    id: "founder-core",
    key: "founder-core",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 13v-4" />
        <path d="M12 2v3" />
        <path d="M9 2h6" />
        <path d="M18 5.5l-1.5 1.5" />
        <path d="M6 5.5l1.5 1.5" />
      </svg>
    ),
    title: "CORE",
    subtitle: "ONE PATHWAY",
    desc: "Three coached sessions a week — Fight, HYROX or Strength",
    price: "2,292",
    image: box1,
  },
  {
    id: "founder-athlete",
    key: "founder-athlete",
    icon: <Dumbbell size={45} strokeWidth={1.5} className="text-[#ccf141]" />,
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    desc: "Four coached sessions a week across two disciplines",
    price: "3,275",
    popular: true,
    image: box2,
  },
  {
    id: "founder-arena",
    key: "founder-arena",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="6" r="2" />
        <path d="M21 16v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79c0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25" />
      </svg>
    ),
    title: "ARENA",
    subtitle: "EVERYTHING",
    desc: "Five coached sessions a week, every pathway, every class",
    price: "4,583",
    image: box3,
  },
  {
    id: "founder-junior",
    key: "founder-junior",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ccf141"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ccf141]"
      >
        <circle cx="12" cy="7" r="3.5" />
        <path d="M6 21v-1.5a5.5 5.5 0 0 1 12 0V21" />
        <path d="M4 11l-2.5 2.5 2.5 2.5" />
        <path d="M20 11l2.5 2.5-2.5 2.5" />
      </svg>
    ),
    title: "JUNIOR",
    subtitle: "UNDER 13",
    desc: "Three coached sessions a week",
    price: "1,958",
    image: juniorBoxer,
  },
];

const initialFounderPlansMap = {
  "founder-core": {
    key: "founder-core",
    title: "CORE",
    subtitle: "ONE PATHWAY",
    sessionInfo: "Three coached sessions a week — Fight, HYROX or Strength",
    desc: "Three coached sessions a week — Fight, HYROX or Strength",
    starterPrice: "2,292",
    dailyRate: "₹75",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "A dosa and a filter coffee.",
    benefits: [
      {
        boldText: "You can defend yourself.",
        normalText:
          "Quietly knowing that changes how you walk down a street at night.",
      },
      {
        boldText: "The bad day goes into the bag.",
        normalText: "Not into your family, not into your sleep.",
      },
      {
        boldText: "Sharper at work.",
        normalText:
          "Boxing is a thinking sport — you read, decide and move in the same second.",
      },
      {
        boldText: "A coach who knows your name and your weakness.",
        normalText: "Nobody improves alone on a gym floor.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "3,500",
        perMonth: "3,500",
        originalPrice: "",
        totalPrice: "3,500",
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false,
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹100",
        price: "9,900",
        perMonth: "3,300",
        originalPrice: "10,000",
        totalPrice: "9,900",
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
        isPopular: false,
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹900",
        price: "18,000",
        perMonth: "3,000",
        originalPrice: "18,900",
        totalPrice: "18,000",
        tag: "SAVE ₹900",
        buttonText: "SAVE ₹900",
        isPopular: false,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹6,100",
        price: "27,500",
        perMonth: "2,292",
        originalPrice: "33,600",
        totalPrice: "27,500",
        tag: "SAVE ₹6,100",
        buttonText: "SAVE ₹6,100",
        isPopular: true,
      },
    ],
  },
  "founder-athlete": {
    key: "founder-athlete",
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    sessionInfo: "Four coached sessions a week across two disciplines",
    desc: "Four coached sessions a week across two disciplines",
    starterPrice: "3,275",
    dailyRate: "₹108",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One burger.",
    benefits: [
      {
        boldText: "Strong and not out of breath.",
        normalText: "Most people get one. Two pathways gets you both.",
      },
      {
        boldText: "You stop plateauing.",
        normalText: "Four sessions, two disciplines, nothing goes stale.",
      },
      {
        boldText: "Visible change by week twelve.",
        normalText:
          "Measured on your card, not guessed in the mirror.",
      },
      {
        boldText: "The body you had at twenty-five,",
        normalText: "built the way an athlete builds it.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "5,000",
        perMonth: "5,000",
        originalPrice: "",
        totalPrice: "5,000",
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false,
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹100",
        price: "14,100",
        perMonth: "4,700",
        originalPrice: "14,200",
        totalPrice: "14,100",
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
        isPopular: false,
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹1,300",
        price: "25,700",
        perMonth: "4,283",
        originalPrice: "27,000",
        totalPrice: "25,700",
        tag: "SAVE ₹1,300",
        buttonText: "SAVE ₹1,300",
        isPopular: false,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹8,700",
        price: "39,300",
        perMonth: "3,275",
        originalPrice: "48,000",
        totalPrice: "39,300",
        tag: "SAVE ₹8,700",
        buttonText: "SAVE ₹8,700",
        isPopular: true,
      },
    ],
  },
  "founder-arena": {
    key: "founder-arena",
    title: "ARENA",
    subtitle: "EVERYTHING",
    sessionInfo: "Five coached sessions a week, every pathway, every class",
    desc: "Five coached sessions a week, every pathway, every class",
    starterPrice: "4,583",
    dailyRate: "₹151",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One cinema ticket.",
    benefits: [
      {
        boldText: "Train the way fighters train.",
        normalText: "Five days, every discipline, nothing held back.",
      },
      {
        boldText: "This becomes your second place.",
        normalText: "After home, before everywhere else.",
      },
      {
        boldText: "Priority on everything.",
        normalText: "Classes, the ring, the open floor.",
      },
      {
        boldText: "You stop thinking about fitness.",
        normalText: "It is simply what you do now.",
      },
    ],
    plans: [
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "7,000",
        perMonth: "7,000",
        originalPrice: "",
        totalPrice: "7,000",
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false,
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹300",
        price: "19,700",
        perMonth: "6,567",
        originalPrice: "20,000",
        totalPrice: "19,700",
        tag: "SAVE ₹300",
        buttonText: "SAVE ₹300",
        isPopular: false,
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹1,900",
        price: "35,900",
        perMonth: "5,983",
        originalPrice: "37,800",
        totalPrice: "35,900",
        tag: "SAVE ₹1,900",
        buttonText: "SAVE ₹1,900",
        isPopular: false,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹12,200",
        price: "55,000",
        perMonth: "4,583",
        originalPrice: "67,200",
        totalPrice: "55,000",
        tag: "SAVE ₹12,200",
        buttonText: "SAVE ₹12,200",
        isPopular: true,
      },
    ],
  },
  "founder-junior": {
    key: "founder-junior",
    title: "JUNIOR",
    subtitle: "UNDER 13",
    sessionInfo: "Three coached sessions a week",
    desc: "Three coached sessions a week",
    starterPrice: "1,958",
    dailyRate: "₹64",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One masala dosa.",
    benefits: [
      {
        boldText: "Confidence that shows up at school.",
        normalText:
          "A child who can hold a stance stops shrinking in a crowd.",
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
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false,
      },
      {
        months: "3 MONTHS",
        subtitle: "SAVE ₹1,100",
        price: "7,500",
        perMonth: "2,500",
        originalPrice: "8,600",
        totalPrice: "7,500",
        tag: "SAVE ₹1,100",
        buttonText: "SAVE ₹1,100",
        isPopular: false,
      },
      {
        months: "6 MONTHS",
        subtitle: "SAVE ₹2,700",
        price: "13,500",
        perMonth: "2,250",
        originalPrice: "16,200",
        totalPrice: "13,500",
        tag: "SAVE ₹2,700",
        buttonText: "SAVE ₹2,700",
        isPopular: false,
      },
      {
        months: "12 MONTHS",
        subtitle: "SAVE ₹5,300",
        price: "23,500",
        perMonth: "1,958",
        originalPrice: "28,800",
        totalPrice: "23,500",
        tag: "SAVE ₹5,300",
        buttonText: "SAVE ₹5,300",
        isPopular: true,
      },
    ],
  },
};

const FounderMembersOffers = () => {
  const [activeTab, setActiveTab] = useState("founder-core");

  // Instant 0ms cache loading from localStorage
  const getInitialFounderPlans = () => {
    try {
      const cached = localStorage.getItem("boxcross_founder_plans_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          return { ...initialFounderPlansMap, ...parsed };
        }
      }
    } catch (e) {}
    return initialFounderPlansMap;
  };

  const getInitialProgramsList = () => {
    try {
      const cached = localStorage.getItem("boxcross_founder_plans_raw");
      if (cached) {
        const plans = JSON.parse(cached);
        if (Array.isArray(plans) && plans.length > 0) {
          return defaultPrograms.map((prog) => {
            const dbPlan = plans.find((p) => p.key === prog.key);
            if (dbPlan) {
              return {
                ...prog,
                title: dbPlan.title || prog.title,
                subtitle: dbPlan.subtitle || prog.subtitle,
                desc: dbPlan.sessionInfo || dbPlan.desc || prog.desc,
                price: dbPlan.starterPrice || prog.price,
              };
            }
            return prog;
          });
        }
      }
    } catch (e) {}
    return defaultPrograms;
  };

  const [programsList, setProgramsList] = useState(getInitialProgramsList);
  const [founderPlansData, setFounderPlansData] = useState(getInitialFounderPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pricingRef = useRef(null);

  const applyPlans = (plans) => {
    if (!Array.isArray(plans) || plans.length === 0) return;

    // Map plans keyed by plan.key
    const mapped = { ...initialFounderPlansMap };
    plans.forEach((p) => {
      if (p.key) mapped[p.key] = p;
    });
    setFounderPlansData(mapped);

    // Update dynamic programs list
    const updated = defaultPrograms.map((prog) => {
      const dbPlan = plans.find((p) => p.key === prog.key);
      if (dbPlan) {
        return {
          ...prog,
          title: dbPlan.title || prog.title,
          subtitle: dbPlan.subtitle || prog.subtitle,
          desc: dbPlan.sessionInfo || dbPlan.desc || prog.desc,
          price: dbPlan.starterPrice || prog.price,
        };
      }
      return prog;
    });
    setProgramsList(updated);

    // Cache locally for instant 0ms load on next visit
    try {
      localStorage.setItem("boxcross_founder_plans_cache", JSON.stringify(mapped));
      localStorage.setItem("boxcross_founder_plans_raw", JSON.stringify(plans));
      localStorage.setItem("boxcross_founder_plans_timestamp", Date.now().toString());
    } catch (e) {}
  };

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    AOS.refresh();

    const fetchPlans = async () => {
      try {
        const { data } = await getFounderPlans();
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          applyPlans(data.data);
        }
      } catch (err) {
        console.error("Error fetching founder plans:", err);
      }
    };

    fetchPlans();

    // 1. Instant Cross-tab sync via BroadcastChannel (< 1ms real-time sync)
    let channel;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("boxcross_founder_plans_sync");
        channel.onmessage = (event) => {
          if (event.data?.type === "PLANS_UPDATED" && Array.isArray(event.data.plans)) {
            applyPlans(event.data.plans);
          }
        };
      }
    } catch (e) {}

    // 2. Storage event listener fallback
    const handleStorage = (e) => {
      if (e.key === "boxcross_founder_plans_raw" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            applyPlans(parsed);
          }
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Tab focus auto-revalidate (when switching tabs from Dashboard to Website)
    const handleFocus = () => {
      fetchPlans();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const activePlanData =
    founderPlansData[activeTab] ||
    initialFounderPlansMap[activeTab] ||
    initialFounderPlansMap["founder-core"];

  const currentTitle = activePlanData?.title || "CORE";
  const currentSubtitle = activePlanData?.subtitle || "ONE PATHWAY";
  const currentSessionInfo =
    activePlanData?.sessionInfo ||
    activePlanData?.desc ||
    "Three coached sessions a week — Fight, HYROX or Strength";

  const dailyRate = activePlanData?.dailyRate || "₹75";
  const dailyRateLabel =
    activePlanData?.dailyRateLabel || "A DAY AS A FOUNDING MEMBER";
  const dailyComparison =
    activePlanData?.dailyComparison || "A dosa and a filter coffee.";

  const benefits =
    activePlanData?.benefits && activePlanData.benefits.length > 0
      ? activePlanData.benefits
      : initialFounderPlansMap[activeTab]?.benefits || [];

  const plans = activePlanData?.plans || initialFounderPlansMap[activeTab]?.plans || [];

  const handlePlanSelect = (planName, price, durationStr) => {
    const monthsVal = durationStr ? parseInt(durationStr) : 1;
    setSelectedPlan({
      name: planName,
      price: price,
      monthsVal: monthsVal,
    });
    setIsModalOpen(true);
  };

  const handleScrollToPlans = (e, id) => {
    e.stopPropagation();
    setActiveTab(id);
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderProgramCard = (prog, index = 0) => (
    <motion.div
      key={prog.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ scale: activeTab === prog.id ? 1.02 : 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onClick={() => setActiveTab(prog.id)}
      className={`relative rounded-xl p-5 md:p-6 min-h-[380px] md:min-h-[400px] lg:min-h-[430px] flex flex-col cursor-pointer transition-all duration-300 border group overflow-hidden ${
        activeTab === prog.id
          ? "border-[#ccf141] shadow-[0_0_20px_rgba(222,251,2,0.2)] z-10"
          : "border-gray-800 hover:border-gray-600"
      }`}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-70 group-hover:opacity-90 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${prog.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/10" />
      </div>

      {prog.popular && (
        <div className="absolute top-0 right-0 bg-[#ccf141] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
          MOST POPULAR
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-grow text-left justify-between">
        <div>
          <div className="w-14 h-12 flex items-center justify-center mb-4">
            {prog.icon}
          </div>

          <h3
            className="font-black mb-1 tracking-wide uppercase"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "900",
              fontSize: "28px",
            }}
          >
            {prog.title}
          </h3>
          <p
            className="text-[#ccf141] tracking-widest uppercase mb-2"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "400",
              fontSize: "15px",
            }}
          >
            {prog.subtitle}
          </p>
          <p
            className="text-gray-200 mb-4 leading-relaxed max-w-[95%]"
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            {prog.desc}
          </p>
        </div>

        <div className="mt-auto pt-3 w-full">
          <p
            className="text-[12px] text-gray-300 uppercase tracking-widest font-bold flex items-center"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "600",
            }}
          >
            FROM
          </p>

          <div className="flex items-baseline">
            <span
              className="text-[#ccf141] text-[28px] md:text-[36px] font-black mr-1"
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
              }}
            >
              ₹{prog.price}
            </span>
            <span className="text-xs text-gray-300 uppercase font-bold">/ MONTH</span>
          </div>

          <button
            onClick={(e) => handleScrollToPlans(e, prog.id)}
            className={`group/btn mt-6 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center rounded-lg border ${
              activeTab === prog.id
                ? "bg-[#ccf141] border-[#ccf141] text-black"
                : "border-gray-500 text-white hover:border-[#ccf141] bg-transparent"
            }`}
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "700",
            }}
          >
            <span
              className="flex items-center gap-2"
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: "700",
              }}
            >
              VIEW PLANS{" "}
              <ArrowRight
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-[#050505] text-white flex flex-col overflow-hidden selection:bg-[#ccf141] selection:text-black">
      <Helmet>
        <title>Founder Members Offers | Box &amp; Cross — The Founding 100</title>
        <meta
          name="description"
          content="Exclusive founder members offers at Box &amp; Cross. Permanent rate locks, Founding Wall inscription, and elite coaching."
        />
      </Helmet>

      {/* MEMBERSHIP PLANS WORKFLOW SECTION */}
      <section
        id="membership-plans"
        className="w-full bg-[#0a0a0a] pt-28 sm:pt-32 pb-12 px-2 md:px-6 flex flex-col items-center justify-center font-sans text-white relative z-20"
      >





        {/* STEP 1: CHOOSE PROGRAM */}
        <div className="w-full max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 flex flex-col items-center justify-start gap-4"
          >
            <div>
              <span
                className="px-4 py-2 rounded-md border border-[#ccf141]/30 bg-[#ccf141] text-[#1e1111] uppercase"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
               Founder Offer
              </span>
            </div>


          </motion.div>

          {/* STEP 1: 4 PROGRAM PATHWAYS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-8 md:mt-12">
            {programsList.map((prog, index) => renderProgramCard(prog, index))}
          </div>
        </div>

        {/* STEP 2: CHOOSE PLAN (EXACT CHOOSEPLAN UI) */}
        <div
          ref={pricingRef}
          id="pricing"
          className="w-full max-w-7xl mx-auto border-t border-zinc-800/80 pt-12 pb-12 scroll-mt-10 px-2 sm:px-4"
        >
          {/* STEP 2 HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 flex flex-col items-center justify-center gap-3"
          >
            <div>
              <span
                className="px-4 py-1.5 rounded-md border border-[#ccf141]/40 bg-[#ccf141]/10 text-[#ccf141] text-xs sm:text-sm uppercase tracking-widest font-black inline-flex items-center gap-2"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Zap size={14} className="text-[#ccf141]" />
                STEP 2
              </span>
            </div>

            <h2
              className="mt-1 mb-0 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              CHOOSE YOUR <span className="text-[#ccf141]">PLAN</span>
            </h2>

            {/* PROGRAM SWITCHER TABS WITH 360° SPINNING BORDER BEAM */}
            <div className="w-full flex justify-center mt-5 mb-3 px-1 sm:px-4">
              <div className="relative inline-flex items-center p-1.5 sm:p-2 bg-[#101012]/95 backdrop-blur-xl border border-zinc-800/90 rounded-2xl sm:rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-1.5 sm:gap-2">
                {programsList.map((prog) => {
                  const isActive = activeTab === prog.id;
                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => setActiveTab(prog.id)}
                      className="relative shrink-0 cursor-pointer select-none rounded-xl sm:rounded-full p-0 transition-transform active:scale-95 group focus:outline-none"
                    >
                      {isActive ? (
                        <div className="relative p-[2px] rounded-xl sm:rounded-full overflow-hidden shadow-[0_0_30px_rgba(204,241,65,0.4)]">
                          <div className="absolute inset-[-250%] bg-[conic-gradient(from_0deg,#ccf141_0deg,transparent_70deg,transparent_180deg,#ccf141_250deg,transparent_360deg)] animate-spin-border" />
                          <div className="relative z-10 bg-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-[10px] sm:rounded-full flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ccf141] shadow-[0_0_10px_#ccf141] animate-pulse shrink-0" />
                            <span
                              className="font-black text-xs sm:text-[14px] text-white tracking-wider"
                              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                            >
                              {prog.title}
                            </span>
                            <span className="text-[9.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md sm:rounded-full tracking-wider font-extrabold bg-[#ccf141] text-black">
                              {prog.subtitle}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 flex items-center justify-center gap-2">
                          <span
                            className="font-black text-xs sm:text-[14px] tracking-wider"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {prog.title}
                          </span>
                          <span className="text-[9.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md sm:rounded-full tracking-wider font-extrabold bg-zinc-900/90 text-zinc-400 border border-zinc-700/50">
                            {prog.subtitle}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* MAIN PRICING CARD */}
          <motion.div
            key={currentTitle}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full bg-black text-white border border-zinc-700/80 rounded-none sm:rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* CARD TOP HEADER STRIP */}
            <div className="bg-black text-white px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
              <div className="flex items-baseline gap-3.5 flex-wrap">
                <span
                  className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {currentTitle}
                </span>
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#ccf141]"
                  style={{ fontFamily: '"BrutalTypeBold", monospace' }}
                >
                  {currentSubtitle}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-300 font-normal">
                {currentSessionInfo}
              </p>
            </div>

            {/* DURATION COLUMNS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 bg-black border-b border-zinc-800">
              {plans.map((plan, idx) => {
                const cleanTotal =
                  plan.totalPrice || plan.price || "";
                const cleanPerMonth = plan.perMonth || plan.price;
                const hasDiscount = Boolean(plan.originalPrice);
                const isSaveTag =
                  plan.tag && plan.tag.toUpperCase().startsWith("SAVE");

                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 md:p-8 flex flex-col items-center text-center justify-between transition-colors duration-200 hover:bg-zinc-900/60 group cursor-pointer"
                    onClick={() =>
                      handlePlanSelect(
                        `${currentTitle} - ${plan.months}`,
                        cleanTotal,
                        plan.months,
                      )
                    }
                  >
                    <div className="w-full flex flex-col items-center">
                      <span
                        className="text-zinc-400 font-bold uppercase tracking-[0.18em] text-xs sm:text-[13px] mb-2 select-none group-hover:text-zinc-200 transition-colors"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {plan.months}
                      </span>

                      <div
                        className="text-4xl sm:text-5xl md:text-[54px] font-black text-white tracking-tight leading-none my-1 flex items-baseline justify-center"
                        style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                      >
                        <span>₹{cleanPerMonth}</span>
                      </div>

                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-zinc-400 mt-1 mb-3">
                        A MONTH
                      </span>

                      <div className="text-xs sm:text-[13px] font-medium text-zinc-400 mb-6 flex items-center justify-center gap-1.5 flex-wrap">
                        {hasDiscount && (
                          <span className="line-through text-zinc-500 font-normal">
                            ₹{plan.originalPrice}
                          </span>
                        )}
                        <span className="font-bold text-white">
                          ₹{cleanTotal} total
                        </span>
                      </div>
                    </div>

                    <div className="w-full pt-2">
                      {isSaveTag ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanSelect(
                              `${currentTitle} - ${plan.months}`,
                              cleanTotal,
                              plan.months,
                            );
                          }}
                          className="w-full py-2 px-4 bg-[#ccf141] hover:bg-[#bfe635] text-black font-black uppercase tracking-wider text-xs sm:text-sm rounded-none transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(204,241,65,0.2)] hover:shadow-[0_0_20px_rgba(204,241,65,0.4)] flex items-center justify-center gap-1.5 active:scale-[0.98]"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span>{plan.tag}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanSelect(
                              `${currentTitle} - ${plan.months}`,
                              cleanTotal,
                              plan.months,
                            );
                          }}
                          className="w-full py-1.5 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs rounded-none transition-all duration-200 cursor-pointer active:scale-[0.98] bg-zinc-900/40 hover:bg-zinc-800"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span>{plan.buttonText || "STANDARD"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CARD BOTTOM SECTION: WHAT IT ACTUALLY GIVES YOU + RIGHT BLACK BOX */}
            <div className="flex flex-col md:flex-row items-stretch bg-black">
              {/* Left Side: Solid Black Background with White Text */}
              <div className="flex-1 p-6 sm:p-8 md:p-9 bg-black">
                <span
                  className="block text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5 select-none"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  WHAT IT ACTUALLY GIVES YOU
                </span>

                <div className="space-y-4">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 bg-[#ccf141] shrink-0 mt-1.5 rounded-[1px] shadow-[0_0_8px_rgba(204,241,65,0.4)]" />
                      <p className="text-xs sm:text-[14px] leading-relaxed text-zinc-300">
                        <strong className="text-white font-extrabold mr-1">
                          {b.boldText}
                        </strong>
                        <span className="text-zinc-400 font-normal">
                          {b.normalText}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Black Box with Daily Rate */}
              <div className="w-full md:w-[320px] lg:w-[360px] bg-black text-white p-6 sm:p-8 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-zinc-800 shrink-0">
                <div
                  className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#ccf141] tracking-tight leading-none select-none drop-shadow-[0_0_20px_rgba(204,241,65,0.45)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {dailyRate}
                </div>

                <span className="mt-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-300 uppercase select-none">
                  {dailyRateLabel}
                </span>

                <div
                  className="mt-4 text-base sm:text-lg lg:text-xl font-bold text-white select-none leading-snug"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {dailyComparison}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RAZORPAY FOUNDER PAYMENT MODAL */}
      <RazorpayFounderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planDetails={selectedPlan}
      />
    </div>
  );
};

export default FounderMembersOffers;
