import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
import founderBanner from "../assets/founder_banner.jpg";
import { getFounderPlans } from "../api/api";
import RazorpayFounderModal from "../Components/RazorpayFounderModal";
import ChoosePlan from "../Components/ChoosePlan";
import BCMonogram from "../Components/BCMonogram";

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
                isComingSoon: !!dbPlan.isComingSoon,
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
          isComingSoon: !!dbPlan.isComingSoon,
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
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");

    if (plan) {
      const planLower = plan.toLowerCase();
      const matched = ["founder-core", "founder-athlete", "founder-arena", "founder-junior"].find(
        (k) => k === planLower || k.replace("founder-", "") === planLower
      );
      if (matched) {
        setActiveTab(matched);
        setTimeout(() => {
          const pricingSection = document.getElementById("pricing");
          if (pricingSection) {
            pricingSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 800);
      }
    }
  }, []);

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

  const adultPrograms = programsList.filter(
    (p) =>
      !p.id?.toLowerCase().includes("junior") &&
      !p.key?.toLowerCase().includes("junior"),
  );
  const juniorProgram = programsList.find(
    (p) =>
      p.id?.toLowerCase().includes("junior") ||
      p.key?.toLowerCase().includes("junior"),
  );

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
      className={`relative rounded-xl p-6 md:p-8 min-h-[380px] md:min-h-[420px] lg:min-h-[440px] flex flex-col cursor-pointer transition-all duration-300 border group overflow-hidden ${
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

      {prog.isComingSoon ? (
        /* FULL BLUR COMING SOON OVERLAY */
        <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/80 flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300">
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10.5px] font-mono font-black uppercase tracking-widest shadow-sm mb-3">
            <span>{prog.title} · {prog.subtitle}</span>
          </div>

          <h3
            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none drop-shadow-md"
            style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
          >
            COMING SOON
          </h3>

          <p
            className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed max-w-[240px] mb-6 font-medium"
            style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
          >
            This pathway is currently preparing for launch. Online registrations will open shortly.
          </p>

          <div
            className="px-5 py-2.5 rounded-xl border border-amber-500/60 bg-amber-500/15 text-amber-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)]"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            <span>STAY TUNED</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : prog.popular ? (
        <div className="absolute top-0 right-0 bg-[#ccf141] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
          MOST POPULAR
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col flex-grow text-left justify-between">
        <div>
          <div className="w-16 h-14 flex items-center justify-center mb-5">
            {prog.icon}
          </div>

          <h3
            className="font-black mb-1 tracking-wide uppercase"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "900",
              fontSize: "35px",
            }}
          >
            {prog.title}
          </h3>
          <p
            className="text-[#ccf141] tracking-widest uppercase mb-3"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "400",
              fontSize: "19px",
            }}
          >
            {prog.subtitle}
          </p>
          <p
            className="text-gray-200 mb-4 leading-relaxed max-w-[90%]"
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontWeight: "400",
              fontSize: "17px",
            }}
          >
            {prog.desc}
          </p>
        </div>

        <div className="mt-auto pt-4 w-full">
          <p
            className="text-[14px] text-gray-300 uppercase tracking-widest font-bold flex items-center"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "600",
            }}
          >
            FROM
          </p>

          <div>
            <span
              className="text-lg text-[#ccf141] text-[30px] md:text-[48px] mx-1.5"
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: "700",
              }}
            >
              ₹{prog.price}
            </span>
            / MONTH
          </div>

          <button
            onClick={(e) => handleScrollToPlans(e, prog.id)}
            className={`group/btn mt-10 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center rounded-lg border ${
              prog.isComingSoon
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : activeTab === prog.id
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
              {prog.isComingSoon ? "VIEW DETAILS · COMING SOON" : "VIEW PLANS"}{" "}
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

      {/* HERO BANNER SECTION */}
      <section className="relative mt-[80px] md:mt-0 w-full h-[45vh] md:h-[70vh] flex items-center justify-center overflow-hidden mb-6">
        {/* IMAGE BACKGROUND */}
        <img
          src={founderBanner}
          alt="Founder Arena Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-90 contrast-110"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-[2]"></div>

        {/* HUGE BACKGROUND TEXT (Outline) */}
        <div className="absolute inset-x-0 top-10 md:top-28 flex justify-center pointer-events-none z-[5] overflow-hidden">
          <span
            className="text-transparent font-black uppercase text-[50px] md:text-[150px] whitespace-nowrap select-none tracking-widest leading-none"
            style={{
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.22)",
              fontFamily: '"BrutalTypeBold", Arial, sans-serif',
            }}
          >
            FOUNDERS
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative md:mt-[90px] z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between md:gap-16 pt-20 md:pt-0">
          {/* LEFT SIDE: HEADING */}
          <div
            data-aos="fade-right"
            className="flex-1 w-full flex flex-col justify-center text-center md:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 mb-3 self-center md:self-start">
              <span className="px-3.5 py-1 rounded-full bg-[#ccf141]/20 border border-[#ccf141]/60 text-[#ccf141] text-[11px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,241,65,0.2)]">
                <Crown size={13} className="text-[#ccf141]" />
                EXCLUSIVE FOUNDING OFFERS
              </span>
            </div>

            <h1
              className="
                text-white
                font-black
                uppercase
                leading-[0.95]
                tracking-tight
                drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]
              "
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              <span className="block text-[40px] sm:text-[55px] md:text-[80px] whitespace-normal md:whitespace-nowrap">
                FOUNDER
              </span>
              <span className="block text-[40px] sm:text-[55px] md:text-[80px] text-[#ccf141] whitespace-normal md:whitespace-nowrap">
                MEMBERS
              </span>
              <span className="block text-[40px] sm:text-[55px] md:text-[80px] whitespace-normal md:whitespace-nowrap">
                OFFERS
              </span>
            </h1>
          </div>

          {/* RIGHT SIDE: SUBTITLE & BUTTONS */}
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="flex-1 w-full flex flex-col justify-center items-start md:max-w-lg z-10"
          >
            <p
              className="
                text-[#c9c9c9]
                text-base md:text-[17px]
                mt-[-3px] md:mt-16
                leading-relaxed
                hidden md:block
                mb-5
              "
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
                fontWeight: 700,
              }}
            >
              Exclusive founding member privileges, permanent locked rates, and priority arena access. Be part of the first generation of athletes at Box &amp; Cross.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="
                flex
                flex-row
                items-center
                justify-center
                md:justify-start
                gap-3 sm:gap-4
                w-full
                max-w-[700px]
              "
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: 700,
              }}
            >
              <button
                onClick={() => {
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-[#ccf141] text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center items-center
                  shadow-[0_0_20px_rgba(229,255,0,0.25)]
                "
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  View Founder Plans
                </span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("membership-plans");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-white
                  text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center items-center
                "
              >
                <span className="absolute inset-0 bg-[#ccf141] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Explore Pathways
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Text Marquee */}
      <div className="w-full bg-black py-4 md:py-5 border-y border-zinc-900/80 overflow-hidden select-none pointer-events-none mb-6">
        <div className="marquee-experience-wrapper">
          <div className="marquee-experience-track">
            {Array(8)
              .fill([
                { text: "FOUNDING MEMBERS.", outline: false },
                { text: "PERMANENT RATE LOCK.", outline: true },
                { text: "FOUNDERS WALL.", outline: false },
                { text: "FIGHT CLUB ARENA.", outline: true },
              ])
              .flat()
              .map((item, idx) => (
                <span
                  key={idx}
                  className="text-[35px] sm:text-[50px] md:text-[65px] font-black uppercase tracking-tight mx-4 sm:mx-6 md:mx-8 inline-block"
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    color: item.outline ? "transparent" : "#ffffff",
                    WebkitTextStroke: item.outline
                      ? "1px rgba(255, 255, 255, 0.75)"
                      : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              ))}
          </div>
        </div>
        <style>{`
          .marquee-experience-wrapper {
            width: 100%;
            overflow: hidden;
            display: flex;
          }
          .marquee-experience-track {
            display: flex;
            white-space: nowrap;
            width: max-content;
            animation: scrollLeftExperienceMarquee 95s linear infinite;
          }
          @keyframes scrollLeftExperienceMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      {/* MEMBERSHIP PLANS WORKFLOW SECTION */}
      <section
        id="membership-plans"
        className="w-full bg-[#0a0a0a] pt-6 sm:pt-10 pb-12 px-2 md:px-6 flex flex-col items-center justify-center font-sans text-white relative z-20"
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
               Founder 100-Members offer 
              </span>
            </div>

            <div>
              <span
                className="px-4 py-2 rounded-md border border-[#ccf141]/30 bg-[#ccf141] text-[#1e1111] uppercase"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                STEP 1
              </span>
            </div>

            <div>
              <h2
                className="mt-2 md:mt-4 mb-0 text-[32px] md:text-[48px] leading-[40px] md:leading-[55px]"
                style={{
                  fontFamily: '"BrutalTypeBold", sans-serif',
                  fontWeight: "700",
                }}
              >
                CHOOSE YOUR <span className="text-[#ccf141]">PROGRAM</span>
              </h2>
            </div>
          </motion.div>

          {/* STEP 1: 3 ADULT PATHWAYS GRID (CORE, ATHLETE, ARENA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 mt-8 md:mt-15">
            {adultPrograms.map((prog, index) => renderProgramCard(prog, index))}
          </div>

          {/* HORIZONTAL FULL-WIDTH JUNIOR PROGRAM BANNER (UNDER 13) */}
          {juniorProgram && (
            <div className="mt-12 md:mt-16 w-full">
              {/* Section Header & Divider */}
              <div className="flex items-center gap-3 sm:gap-4 w-full mb-6 px-1">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-zinc-700 flex-1" />
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-[#121214] text-zinc-300 text-xs font-bold uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-pulse" />
                  <span>JUNIOR PROGRAM · UNDER 13</span>
                </div>
                <div className="h-[1px] bg-gradient-to-l from-transparent via-zinc-800 to-zinc-700 flex-1" />
              </div>

              {/* Full Width Horizontal Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveTab(juniorProgram.id)}
                className={`relative w-full rounded-2xl md:rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${
                  activeTab === juniorProgram.id
                    ? "border-[#ccf141] shadow-[0_0_30px_rgba(204,241,65,0.25)]"
                    : "border-zinc-800 hover:border-zinc-700"
                } bg-[#0b0b0d]`}
              >
                {/* Background Glow Overlay */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none -z-0" />

                {/* JUNIOR COMING SOON FULL BLUR OVERLAY */}
                {juniorProgram.isComingSoon && (
                  <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none">
                    <div className="relative w-20 h-16 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-black/90 border border-[#ccf141]/50 flex items-center justify-center px-2 py-1 shadow-[0_0_30px_rgba(204,241,65,0.3)] mb-4">
                      <BCMonogram className="w-16 h-10" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ccf141] shadow-[0_0_8px_#ccf141] animate-ping" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
                      <span>JUNIOR ATHLETE · UNDER 13</span>
                    </div>
                    <h3
                      className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2 leading-none"
                      style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                    >
                      COMING SOON
                    </h3>
                    <p
                      className="text-zinc-300 text-xs sm:text-sm max-w-md mb-6 font-medium"
                      style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                    >
                      Our youth boxing fundamentals and athletic development program is opening soon.
                    </p>
                    <div
                      className="px-6 py-2.5 rounded-xl border border-amber-500/60 bg-amber-500/15 text-amber-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      <span>STAY TUNED</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between">
                  {/* Left & Center: Rich Program Content */}
                  <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Icon + Subtitle Badge */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#ccf141] shadow-inner shrink-0">
                          {juniorProgram.icon}
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] text-[11px] font-mono font-bold tracking-widest uppercase">
                            YOUTH &amp; ATHLETIC DEVELOPMENT
                          </div>
                          {juniorProgram.isComingSoon && (
                            <span className="inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              COMING SOON
                            </span>
                          )}
                          <p className="text-zinc-400 text-xs mt-1 font-mono">
                            Ages 7 to 13 · All Experience Levels
                          </p>
                        </div>
                      </div>

                      {/* Main Title & Tagline */}
                      <div className="mt-2">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <h3
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {juniorProgram.title}
                          </h3>
                          <span
                            className="text-lg sm:text-2xl font-bold text-[#ccf141] tracking-widest uppercase"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {juniorProgram.subtitle}
                          </span>
                        </div>

                        <p
                          className="text-zinc-300 text-sm sm:text-base md:text-lg mt-3 leading-relaxed max-w-2xl font-normal"
                          style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                        >
                          {juniorProgram.desc}. Built specifically to develop boxing fundamentals, agile footwork, screen-free focus, and lifelong discipline.
                        </p>
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA Row */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-zinc-400 text-xs uppercase font-bold tracking-widest">
                          MEMBERSHIP STARTS FROM
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ccf141] leading-none"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            ₹{juniorProgram.price}
                          </span>
                          <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                            / MONTH
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleScrollToPlans(e, juniorProgram.id)}
                        className={`group/btn px-6 sm:px-8 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                          juniorProgram.isComingSoon
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-black"
                            : activeTab === juniorProgram.id
                              ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.4)] hover:bg-[#bfe635]"
                              : "bg-white text-black hover:bg-[#ccf141] hover:text-black"
                        }`}
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <span>
                          {juniorProgram.isComingSoon
                            ? "VIEW DETAILS · COMING SOON"
                            : "VIEW JUNIOR PLANS"}
                        </span>
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Right Side: The Boxer Photo (Hero Visual with Cinematic Fade) */}
                  <div className="w-full lg:w-[420px] xl:w-[480px] min-h-[300px] sm:min-h-[360px] lg:min-h-[460px] relative overflow-hidden bg-black shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${juniorProgram.image})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b0b0d] via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

                    <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md border border-zinc-800 text-[#ccf141] text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-ping" />
                      BOX &amp; CROSS YOUTH
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* STEP 2: CHOOSE PLAN (EXACT CHOOSEPLAN COMPONENT) */}
        <ChoosePlan
          ref={pricingRef}
          activeData={activePlanData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handlePlanSelect={handlePlanSelect}
          programs={programsList}
        />
      </section>

      {/* RAZORPAY FOUNDER PAYMENT MODAL */}
      {typeof document !== "undefined" &&
        createPortal(
          <RazorpayFounderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            planDetails={selectedPlan}
          />,
          document.body,
        )}
    </div>
  );
};

export default FounderMembersOffers;
