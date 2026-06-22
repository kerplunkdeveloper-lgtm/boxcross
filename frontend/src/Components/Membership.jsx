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
import PhonePeModal from "./PhonePeModal";
import { motion } from "framer-motion";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";

import ChoosePlan from "./ChoosePlan";
import { getMembershipPlans } from "../api/api";

const programs = [
  {
    id: "start",
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
        className="text-[#e5ff00]"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 13v-4" />
        <path d="M12 2v3" />
        <path d="M9 2h6" />
        <path d="M18 5.5l-1.5 1.5" />
        <path d="M6 5.5l1.5 1.5" />
      </svg>
    ),
    title: "START",
    subtitle: "FIGHT CLUB / STRENGTH LAB",
    desc: "Perfect for beginners. Build fitness, strength and confidence.",
    price: "2,200",
    tabs: [
      {
        id: "start_fight",
        name: "FIGHT CLUB",
        subtitle: "FIGHT CLUB",
        desc: "Perfect for beginners. Build fitness, strength and confidence through boxing.",
        price: "2,200",
      },
      {
        id: "start_strength",
        name: "STRENGTH LAB",
        subtitle: "STRENGTH LAB",
        desc: "Focus on core strength, lifting techniques, and building raw power.",
        price: "2,500",
      },
    ],
    image: box1,
  },
  {
    id: "transform",
    icon: (
      <svg
        width="45"
        height="42"
        viewBox="0 0 48 48"
       fill="currentColor"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#e5ff00]"
      >
        <path d="M4 44H44" />
        <path d="M28 30H34.1905C36.4603 30 41 31.344 41 36.72V44" />
        <path d="M35 30L40 19L34 6" />
        <path d="M29 8L39 4" />
        <circle cx="20" cy="30" r="8" />
        <path d="M20 30H28" />
        <path d="M21 22L14 13" />
        <path d="M10 13L18 13" />
      </svg>
    ),
    title: "TRANSFORM",
    subtitle: "HYBRID PERFORMANCE",
    desc: "Boxing + Strength + Conditioning. The complete transformation for body and mind.",
    price: "3,500",
    popular: true,
    image: box2,
  },
  {
    id: "perform",
    icon: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#e5ff00]"
      >
        <circle cx="12" cy="6" r="2" />
        <path d="M21 16v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9h-1.05c-.59 0-1.15.26-1.53.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.93-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79c0-.73-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25" />
      </svg>
    ),
    title: "PERFORM",
    subtitle: "HYROX LAB / PERFORMANCE BOXING",
    desc: "For athletes and competitors. Build endurance, power and peak performance.",
    price: "4,500",
    tabs: [
      {
        id: "perform_hyrox",
        name: "HYROX LAB",
        subtitle: "HYROX LAB",
        desc: "For athletes and competitors. Build endurance, power and peak performance.",
        price: "4,500",
      },
      {
        id: "perform_boxing",
        name: "PERFORMANCE BOXING",
        subtitle: "PERFORMANCE BOXING",
        desc: "Advanced boxing techniques, sparring prep, and high-intensity conditioning.",
        price: "5,000",
      },
    ],
    image: box3,
  },
];

const pricingData = {
  start_fight: {
    title: "START (FIGHT CLUB)",
    features: [
      "Boxing Basics",
      "Cardio Conditioning",
      "Footwork",
      "Community Access",
    ],
    plans: [
      {
        months: "3 MONTHS",
        subtitle: "START YOUR JOURNEY",
        price: "5,999",
        perMonth: "2,000",
        highlights: [
          "Basic boxing classes",
          "Cardio conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        buttonText: "GET STARTED",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "10,999",
        perMonth: "1,833",
        highlights: [
          "Basic boxing classes",
          "Cardio conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        tag: "RECOMMENDED",
        buttonText: "CHOOSE PLAN",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "19,999",
        perMonth: "1,666",
        highlights: [
          "Basic boxing classes",
          "Cardio conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "Priority batch booking",
        ],
        buttonText: "CHOOSE PLAN",
      },
    ],
    starterPrice: "2,200",
  },
  start_strength: {
    title: "START (STRENGTH LAB)",
    features: [
      "Strength Training",
      "Core Focus",
      "Lifting Technique",
      "Community Access",
    ],
    plans: [
      {
        months: "3 MONTHS",
        subtitle: "START YOUR JOURNEY",
        price: "6,999",
        perMonth: "2,333",
        highlights: [
          "Strength group classes",
          "Core conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        buttonText: "GET STARTED",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "12,999",
        perMonth: "2,166",
        highlights: [
          "Strength group classes",
          "Core conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        tag: "RECOMMENDED",
        buttonText: "CHOOSE PLAN",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "22,999",
        perMonth: "1,916",
        highlights: [
          "Strength group classes",
          "Core conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "Priority batch booking",
        ],
        buttonText: "CHOOSE PLAN",
      },
    ],
    starterPrice: "2,500",
  },
  transform: {
    title: "TRANSFORM (HYBRID PERFORMANCE)",
    features: [
      "Boxing",
      "Strength Training",
      "Conditioning",
      "Recovery",
      "Nutrition Guidance",
    ],
    plans: [
      {
        months: "3 MONTHS",
        subtitle: "START YOUR JOURNEY",
        price: "11,999",
        perMonth: "4,000",
        highlights: [
          "All group classes",
          "Strength & conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        buttonText: "GET STARTED",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "19,999",
        perMonth: "3,333",
        highlights: [
          "All group classes",
          "Strength & conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "1 Body composition test",
          "Nutrition guidance",
        ],
        tag: "RECOMMENDED",
        buttonText: "CHOOSE PLAN",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "34,999",
        perMonth: "2,917",
        highlights: [
          "All group classes",
          "Strength & conditioning",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "2 Body composition tests",
          "Nutrition guidance",
          "Priority batch booking",
          "Flexible membership support",
        ],
        buttonText: "CHOOSE PLAN",
      },
    ],
    starterPrice: "3,500",
  },
  perform_hyrox: {
    title: "PERFORM (HYROX LAB)",
    features: [
      "HYROX Training",
      "Endurance",
      "Peak Performance",
      "Recovery",
      "Nutrition",
    ],
    plans: [
      {
        months: "3 MONTHS",
        subtitle: "START YOUR JOURNEY",
        price: "12,999",
        perMonth: "4,333",
        highlights: [
          "HYROX specific classes",
          "Endurance training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        buttonText: "GET STARTED",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "23,999",
        perMonth: "4,000",
        highlights: [
          "HYROX specific classes",
          "Endurance training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "2 Body composition tests",
        ],
        tag: "RECOMMENDED",
        buttonText: "CHOOSE PLAN",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "42,999",
        perMonth: "3,583",
        highlights: [
          "HYROX specific classes",
          "Endurance training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "Monthly body composition",
          "Nutrition planning",
          "Priority batch booking",
        ],
        buttonText: "CHOOSE PLAN",
      },
    ],
    starterPrice: "4,500",
  },
  perform_boxing: {
    title: "PERFORM (PERFORMANCE BOXING)",
    features: [
      "Advanced Boxing",
      "Sparring Prep",
      "High-Intensity",
      "Recovery",
      "Nutrition",
    ],
    plans: [
      {
        months: "3 MONTHS",
        subtitle: "START YOUR JOURNEY",
        price: "14,999",
        perMonth: "5,000",
        highlights: [
          "All advanced classes",
          "Sparring prep training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
        ],
        buttonText: "GET STARTED",
      },
      {
        months: "6 MONTHS",
        subtitle: "BEST PROGRESS",
        price: "26,999",
        perMonth: "4,500",
        highlights: [
          "All advanced classes",
          "Sparring prep training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "2 Body composition tests",
        ],
        tag: "RECOMMENDED",
        buttonText: "CHOOSE PLAN",
        isPopular: true,
      },
      {
        months: "12 MONTHS",
        subtitle: "BEST VALUE",
        price: "48,999",
        perMonth: "4,083",
        highlights: [
          "All advanced classes",
          "Sparring prep training",
          "Open gym access",
          "BXC community access",
          "Progress tracking",
          "Monthly body composition",
          "Nutrition planning",
          "Priority batch booking",
        ],
        buttonText: "CHOOSE PLAN",
      },
    ],
    starterPrice: "5,000",
  },
};

const Membership = () => {
  const [activeTab, setActiveTab] = useState("transform");
  const [subTabs, setSubTabs] = useState({
    start: "start_fight",
    perform: "perform_hyrox",
  });
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
          const newPricingData = {};
          plans.forEach((plan) => {
            newPricingData[plan.key] = {
              _id: plan._id,
              key: plan.key,
              title: plan.title,
              features: plan.features,
              plans: plan.plans,
              starterPrice: plan.starterPrice,
            };
          });
          setDynamicPricingData(newPricingData);

          // Update programs prices and sub-tabs from DB plans
          const updatedPrograms = programs.map((prog) => {
            const copy = { ...prog };
            if (copy.id === "transform") {
              const dbPlan = plans.find((p) => p.key === "transform");
              if (dbPlan) {
                copy.price = dbPlan.starterPrice;
                // If there's highlights in the plans, join them or keep default
                if (dbPlan.plans?.[0]?.highlights) {
                  copy.desc = dbPlan.plans[0].highlights.slice(0, 3).join(". ");
                }
              }
            } else if (copy.id === "start") {
              const dbFight = plans.find((p) => p.key === "start_fight");
              if (dbFight) {
                copy.price = dbFight.starterPrice;
              }
              if (copy.tabs) {
                copy.tabs = copy.tabs.map((tab) => {
                  const dbTab = plans.find((p) => p.key === tab.id);
                  if (dbTab) {
                    return {
                      ...tab,
                      price: dbTab.starterPrice,
                      desc:
                        dbTab.plans?.[0]?.highlights?.slice(0, 3).join(". ") ||
                        tab.desc,
                    };
                  }
                  return tab;
                });
              }
            } else if (copy.id === "perform") {
              const dbHyrox = plans.find((p) => p.key === "perform_hyrox");
              if (dbHyrox) {
                copy.price = dbHyrox.starterPrice;
              }
              if (copy.tabs) {
                copy.tabs = copy.tabs.map((tab) => {
                  const dbTab = plans.find((p) => p.key === tab.id);
                  if (dbTab) {
                    return {
                      ...tab,
                      price: dbTab.starterPrice,
                      desc:
                        dbTab.plans?.[0]?.highlights?.slice(0, 3).join(". ") ||
                        tab.desc,
                    };
                  }
                  return tab;
                });
              }
            }
            return copy;
          });
          setDynamicPrograms(updatedPrograms);
        }
      } catch (err) {
        console.error("Error loading membership plans from API:", err);
      }
    };
    fetchPlans();
  }, []);

  const activeDataKey =
    activeTab === "transform" ? "transform" : subTabs[activeTab];
  const activeData =
    dynamicPricingData[activeDataKey] || pricingData[activeDataKey];

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
        <div className="w-full max-w-7xl  mx-auto mb-12">

{/*................................................................. Membership Plans heading start.............................. */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left md:text-center mb-8 flex flex-col items-start md:items-center justify-start md:justify-center gap-4"
          >
            <div>
               <span
              className="px-4 py-2 rounded-md  border border-[#e5ff00]/30 bg-[#e5ff00] text-[#1e1111] uppercase"
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
              CHOOSE YOUR <span className="text-[#e5ff00]">PROGRAM</span>
            </h2>
           </div>
           
          </motion.div>









          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mt-8 md:mt-15 ">
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
                    ? "border-[#e5ff00] shadow-[0_0_20px_rgba(222,251,2,0.2)] z-10"
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
                  <div className="absolute top-0 right-0 bg-[#e5ff00] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
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
                      className="text-[#e5ff00]  tracking-widest uppercase mb-3"
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
                        className="text-lg text-[#e5ff00] text-[30px] md:text-[48px] mx-1.5"
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
                          ? "bg-[#e5ff00] border-[#e5ff00] text-black"
                          : "border-gray-500 text-white hover:border-[#e5ff00] bg-transparent"
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
          subTabs={subTabs}
          setSubTabs={setSubTabs}
          handlePlanSelect={handlePlanSelect}
          programs={dynamicPrograms}
        />
      </section>
     {
  createPortal(
    <PhonePeModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      planDetails={selectedPlan}
    />,
    document.body
  )
}
   
     
    </>
  );
};

export default Membership;
