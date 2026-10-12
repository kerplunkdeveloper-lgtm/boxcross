import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Check,
  Calendar,
  ArrowRight,
  Activity,
  Zap,
  ShieldHalf,
  Flame,
  Medal,
  Dumbbell,
  Trophy,
  Shield,
  User,
  Star,
} from "lucide-react";
import RazorpayMembershipModal from "./RazorpayMembershipModal";
import { motion } from "framer-motion";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";
import juniorBoxer from "../assets/junior_boxer.jpg";

import ChoosePlan from "./ChoosePlan";
import { getMembershipPlans } from "../api/api";

const programs = [
  {
    id: "core",
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
    desc: "Three coached sessions a week — Fight, HYROX or Strength.",
    price: "2,292",
    image: box1,
  },
  {
    id: "athlete",
    icon: <Dumbbell size={45} strokeWidth={1.5} className="text-[#ccf141]" />,
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    desc: "Four coached sessions a week across two disciplines.",
    price: "3,275",
    popular: true,
    image: box2,
  },
  {
    id: "arena",
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
    desc: "Five coached sessions a week, every pathway, every class.",
    price: "4,583",
    image: box3,
  },
  {
    id: "junior",
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

const pricingData = {
  core: {
    title: "CORE",
    subtitle: "ONE PATHWAY",
    sessionInfo: "Three coached sessions a week — Fight, HYROX or Strength",
    dailyRate: "₹75",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "A dosa and a filter coffee.",
    features: [
      "Three coached sessions a week",
      "One pathway (Fight, HYROX or Strength)",
      "Open gym access",
      "Community Access",
    ],
    benefits: [
      {
        boldText: "You can defend yourself.",
        normalText: "Quietly knowing that changes how you walk down a street at night.",
      },
      {
        boldText: "The bad day goes into the bag.",
        normalText: "Not into your family, not into your sleep.",
      },
      {
        boldText: "Sharper at work.",
        normalText: "Boxing is a thinking sport — you read, decide and move in the same second.",
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
        highlights: [
          "Three coached sessions a week",
          "One pathway focus",
          "Open gym & community access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "FOUNDING RATE",
        price: "9,900",
        perMonth: "3,300",
        originalPrice: "10,000",
        totalPrice: "9,900",
        highlights: [
          "Three coached sessions a week",
          "Held founding rate for full term",
          "Coach assessment",
        ],
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "18,000",
        perMonth: "3,000",
        originalPrice: "18,900",
        totalPrice: "18,000",
        highlights: [
          "Three coached sessions a week",
          "Founding rate locked",
          "Coach 1-on-1 check-ins",
        ],
        tag: "SAVE ₹900",
        buttonText: "SAVE ₹900",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "27,500",
        perMonth: "2,292",
        originalPrice: "33,600",
        totalPrice: "27,500",
        highlights: [
          "Three coached sessions a week",
          "Maximum founding discount",
          "Founding Wall recognition",
        ],
        tag: "SAVE ₹6,100",
        buttonText: "SAVE ₹6,100",
      },
    ],
    starterPrice: "3,500",
  },
  athlete: {
    title: "ATHLETE",
    subtitle: "TWO PATHWAYS",
    sessionInfo: "Four coached sessions a week across two disciplines",
    dailyRate: "₹108",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One burger.",
    features: [
      "Four coached sessions a week",
      "Two disciplines / pathways",
      "All arena facilities",
      "Progress tracking",
    ],
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
        normalText: "Measured on your card, not guessed in the mirror.",
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
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Full arena access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "FOUNDING RATE",
        price: "14,100",
        perMonth: "4,700",
        originalPrice: "14,200",
        totalPrice: "14,100",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Coach assessment",
        ],
        tag: "SAVE ₹100",
        buttonText: "SAVE ₹100",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "25,700",
        perMonth: "4,283",
        originalPrice: "27,000",
        totalPrice: "25,700",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Guest passes included",
        ],
        tag: "SAVE ₹1,300",
        buttonText: "SAVE ₹1,300",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "39,300",
        perMonth: "3,275",
        originalPrice: "48,000",
        totalPrice: "39,300",
        highlights: [
          "Four coached sessions a week",
          "Two disciplines access",
          "Priority booking & perks",
        ],
        tag: "SAVE ₹8,700",
        buttonText: "SAVE ₹8,700",
      },
    ],
    starterPrice: "5,000",
  },
  arena: {
    title: "ARENA",
    subtitle: "EVERYTHING",
    sessionInfo: "Five coached sessions a week, every pathway, every class",
    dailyRate: "₹151",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One cinema ticket.",
    features: [
      "Five coached sessions a week",
      "Every pathway, every class",
      "Priority ring & arena floor",
      "VIP founding member perks",
    ],
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
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Unrestricted arena access",
        ],
        tag: "STANDARD",
        buttonText: "STANDARD",
      },
      {
        months: "3 MONTHS",
        subtitle: "FOUNDING RATE",
        price: "19,700",
        perMonth: "6,567",
        originalPrice: "20,000",
        totalPrice: "19,700",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Coach assessment",
        ],
        tag: "SAVE ₹300",
        buttonText: "SAVE ₹300",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "35,900",
        perMonth: "5,983",
        originalPrice: "37,800",
        totalPrice: "35,900",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "Guest passes included",
        ],
        tag: "SAVE ₹1,900",
        buttonText: "SAVE ₹1,900",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "55,000",
        perMonth: "4,583",
        originalPrice: "67,200",
        totalPrice: "55,000",
        highlights: [
          "Five coached sessions a week",
          "All pathways & disciplines",
          "VIP Founding Wall & passes",
        ],
        tag: "SAVE ₹12,200",
        buttonText: "SAVE ₹12,200",
      },
    ],
    starterPrice: "7,000",
  },
  junior: {
    title: "JUNIOR",
    subtitle: "UNDER 13",
    sessionInfo: "Three coached sessions a week",
    dailyRate: "₹64",
    dailyRateLabel: "A DAY AS A FOUNDING MEMBER",
    dailyComparison: "One masala dosa.",
    features: [
      "Three coached sessions a week",
      "Youth boxing & athletic discipline",
      "Confidence building",
      "Screen-free fitness",
    ],
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
        highlights: [
          "Three coached sessions a week",
          "Youth boxing fundamentals",
          "Arena training space",
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
        highlights: [
          "Three coached sessions a week",
          "Youth boxing fundamentals",
          "Skill milestone card",
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
        highlights: [
          "Three coached sessions a week",
          "Technique & fitness growth",
          "Coach assessment",
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
        highlights: [
          "Three coached sessions a week",
          "Maximum founding discount",
          "Founding Wall youth recognition",
        ],
        tag: "SAVE ₹5,300",
        buttonText: "SAVE ₹5,300",
      },
    ],
    starterPrice: "3,000",
  },
};

const Membership = () => {
  const [activeTab, setActiveTab] = useState("core");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");

    if (plan && ["core", "athlete", "arena", "junior"].includes(plan.toLowerCase())) {
      setActiveTab(plan.toLowerCase());

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
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const pricingRef = useRef(null);

  const [dynamicPrograms, setDynamicPrograms] = useState(programs);
  const [dynamicPricingData, setDynamicPricingData] = useState(pricingData);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getMembershipPlans();
        if (response.data && response.data.success) {
          const plans = response.data.data;

          // Rebuild pricingData dynamically
          const newPricingData = { ...pricingData };
          plans.forEach((plan) => {
            if (["core", "athlete", "arena", "junior"].includes(plan.key)) {
              newPricingData[plan.key] = {
                ...newPricingData[plan.key],
                _id: plan._id,
                key: plan.key,
                title: plan.title || newPricingData[plan.key]?.title,
                subtitle: plan.subtitle || newPricingData[plan.key]?.subtitle,
                sessionInfo: plan.sessionInfo || newPricingData[plan.key]?.sessionInfo,
                dailyRate: plan.dailyRate || newPricingData[plan.key]?.dailyRate,
                dailyRateLabel: plan.dailyRateLabel || newPricingData[plan.key]?.dailyRateLabel,
                dailyComparison: plan.dailyComparison || newPricingData[plan.key]?.dailyComparison,
                features: plan.features?.length ? plan.features : newPricingData[plan.key]?.features,
                benefits: plan.benefits?.length ? plan.benefits : newPricingData[plan.key]?.benefits,
                plans: plan.plans?.length ? plan.plans : newPricingData[plan.key]?.plans,
                starterPrice: plan.starterPrice || newPricingData[plan.key]?.starterPrice,
              };
            }
          });
          setDynamicPricingData(newPricingData);

          // Update programs prices from DB plans
          const updatedPrograms = programs.map((prog) => {
            const dbPlan = plans.find((p) => p.key === prog.id);
            if (dbPlan) {
              return {
                ...prog,
                title: dbPlan.title || prog.title,
                subtitle: dbPlan.subtitle || prog.subtitle,
                desc: dbPlan.sessionInfo || prog.desc,
                price: dbPlan.starterPrice || prog.price,
              };
            }
            return prog;
          });
          setDynamicPrograms(updatedPrograms);
        }
      } catch (err) {
        console.error("Error loading membership plans from API:", err);
      }
    };
    fetchPlans();
  }, []);

  const activeData = dynamicPricingData[activeTab] || pricingData[activeTab];

  const handlePlanSelect = (planName, price, durationStr) => {
    const monthsVal = durationStr ? parseInt(durationStr) : 1;
    setSelectedPlan({ name: planName, price: price, monthsVal: monthsVal });
    setIsModalOpen(true);
  };

  const handleScrollToPlans = (e, id) => {
    e.stopPropagation();
    setActiveTab(id);
    // Smooth scroll to the pricing section
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section
        id="membership-plans"
        className="w-full bg-[#0a0a0a] py-8 md:py-12 px-2 md:px-6 flex flex-col items-center justify-center font-sans text-white"
      >
        {/* STEP 1: CHOOSE PROGRAM */}
        <div className="w-full max-w-8xl px-0 md:px-10 mx-auto mb-12">
          {/*................................................................. Membership Plans heading start.............................. */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 flex flex-col items-center justify-start  gap-4"
          >
            <div>
              <span
                className="px-4 py-2 rounded-md  border border-[#ccf141]/30 bg-[#ccf141] text-[#1e1111] uppercase"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 mt-8 md:mt-15">
            {dynamicPrograms.map((prog, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/10"></div>
                </div>

                {prog.popular && (
                  <div className="absolute top-0 right-0 bg-[#ccf141] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
                    MOST POPULAR
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-grow text-left justify-between">
                  <div>
                    <div className="w-16 h-14 flex items-center   justify-center mb-5 ">
                      {prog.icon}
                    </div>

                    <h3
                      className=" font-black mb-1 tracking-wide uppercase"
                      style={{
                        fontFamily: '"BrutalTypeBold", sans-serif',
                        fontWeight: "900",
                        fontSize: "35px",
                      }}
                    >
                      {prog.title}
                    </h3>
                    <p
                      className="text-[#ccf141]  tracking-widest uppercase mb-3"
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
                      className="text-[14px] text-gray-300 uppercase tracking-widest font-bold  flex items-center"
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
            ))}
          </div>
        </div>

        {/* STEP 2: CHOOSE PLAN */}
        <ChoosePlan
          ref={pricingRef}
          activeData={activeData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handlePlanSelect={handlePlanSelect}
          programs={dynamicPrograms}
        />
      </section>
      {createPortal(
        <RazorpayMembershipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planDetails={selectedPlan}
        />,
        document.body,
      )}
    </>
  );
};

export default Membership;
