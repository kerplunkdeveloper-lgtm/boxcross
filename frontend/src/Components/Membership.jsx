import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Check,
  Calendar,
  ArrowRight,
  Activity,
  Zap,
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
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#e5ff00]"
      >
        <path d="M16 20h-4c-2.8 0-5-2.2-5-5v-1a5 5 0 0 1 5-5h2a2 2 0 0 1 2 2v2c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V9a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v3c0 2.8 2.2 5 5 5h3"></path>
        <path d="M9 13V9"></path>
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
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#e5ff00]"
      >
        <path d="m6.5 6.5 11 11"></path>
        <path d="m21 21-1-1"></path>
        <path d="m3 3 1 1"></path>
        <path d="m18 22 4-4"></path>
        <path d="m2 6 4-4"></path>
        <path d="m3 10 7-7"></path>
        <path d="m14 21 7-7"></path>
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
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#e5ff00]"
      >
        <path d="M14 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="m14 14-2.5-3.5L9 12 7.5 9" />
        <path d="M14 14v4l-4 4" />
        <path d="m14 14 3.5-2L22 15" />
        <path d="M17 5l-2.5 3.5-3.5-.5" />
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
                    <div className="w-14 h-14 rounded-full border border-[#e5ff00]/50 flex items-center justify-center mb-5 bg-black/40 backdrop-blur-sm">
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
