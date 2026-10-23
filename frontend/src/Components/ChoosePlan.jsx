import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, ShieldCheck, Zap, Lock, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BCMonogram from "./BCMonogram";

const getEmiPerMonth = (totalPriceStr, monthsStr = "") => {
  const numeric = Number(String(totalPriceStr).replace(/[^0-9]/g, "")) || 0;
  if (!numeric) return "0";
  let tenure = 3;
  if (monthsStr.includes("24") || monthsStr.includes("2 year")) tenure = 24;
  else if (monthsStr.includes("12") || monthsStr.includes("1 year")) tenure = 12;
  else if (monthsStr.includes("6")) tenure = 6;
  else if (monthsStr.includes("3")) tenure = 3;
  else tenure = 3;
  const emi = Math.round(numeric / tenure);
  return emi.toLocaleString("en-IN");
};

const getPlanMobileBullets = (plan, currentTitle) => {
  const monthsStr = (plan?.months || "").toLowerCase();
  const cleanTotal = plan?.price || plan?.totalPrice || "";
  const numericTotal = Number(String(cleanTotal).replace(/[^0-9]/g, "")) || 0;
  const numericOriginal = Number(String(plan?.originalPrice || "").replace(/[^0-9]/g, "")) || 0;
  const savings = numericOriginal > numericTotal ? numericOriginal - numericTotal : 0;

  if (plan?.mobileFeatures && plan.mobileFeatures.length > 0) {
    return plan.mobileFeatures;
  }

  if (currentTitle === "CORE") {
    return [
      "Training access: Choose 1 pathway",
      "Weekly allowance: Up to 5 visits",
      "Boxing coaching: 4 coached + 1 open (if selected)",
      "Strength: CRM-guided open gym",
      "Performance assessment & 90-day check: Included",
      "BXC Tribe: Included",
      "HYROX: Coming soon | Booking: Standard",
    ];
  }

  if (currentTitle === "ATHLETE") {
    return [
      "Training access: Boxing + Strength",
      "Boxing & Strength: Included",
      "Weekly allowance: Up to 5 visits",
      "Boxing coaching: Based on primary focus",
      "Strength training: CRM-guided open gym",
      "Performance assessment & 90-day check: Included",
      "BXC Tribe: Included",
      "HYROX alternative: Coming soon | Booking: Standard",
    ];
  }

  if (currentTitle === "ARENA") {
    return [
      "Training access: All pathways",
      "Boxing & Strength: Included",
      "HYROX: Included when launched*",
      "Weekly allowance: Up to 5 visits",
      "Boxing coaching: Based on primary focus",
      "Strength training: CRM-guided open gym",
      "Performance assessment & 90-day check: Included",
      "BXC Tribe: Included",
      "Booking priority: Proposed priority | 1:1 Review: Proposed benefit",
    ];
  }

  if (monthsStr.includes("24") || monthsStr.includes("2 year")) {
    return [
      savings > 0 ? `Extra ₹${savings.toLocaleString("en-IN")} OFF applied` : "Maximum 2-Year Founding Member rate freeze",
      "Free Elite Onboarding Pack (Four 1:1 Trainer Sessions)",
      "60 days of membership pause privilege",
      "VIP Founding Member badge on Arena Wall",
      "20% OFF* on BXC gear & activewear",
    ];
  }

  if (monthsStr.includes("12") || monthsStr.includes("1 year")) {
    return [
      savings > 0 ? `Extra ₹${savings.toLocaleString("en-IN")} OFF applied` : "Maximum 54.4% Founding Member discount",
      "Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)",
      "30 days of membership pause privilege",
      "VIP Founding Member badge on Arena Wall",
      "15% OFF* on BXC gear & activewear",
    ];
  }
  if (monthsStr.includes("6")) {
    return [
      savings > 0 ? `Extra ₹${savings.toLocaleString("en-IN")} OFF applied` : "Extra ₹2,100 OFF applied",
      "Free Kickstart Onboarding Pack (Two 1:1 Trainer Sessions)",
      "15 days of membership pause privilege",
      "Access all coached sessions in your pathway",
      "15% OFF* on BXC activewear",
    ];
  }
  if (monthsStr.includes("3")) {
    return [
      savings > 0 ? `Extra ₹${savings.toLocaleString("en-IN")} OFF applied` : "Extra ₹500 OFF locked rate",
      "Five Coached sessions every week",
      "7 days of membership pause privilege",
      "Coach 1:1 baseline assessment & goal review",
      "Full open gym & community locker access",
    ];
  }
  return [
    "Standard  membership",
    "Five Coached sessions every week",
    "Open gym floor & arena equipment access",
    "Coach guided technique & form checks",
    "Community locker & change room access",
  ];
};

const ChoosePlan = React.forwardRef(
  (
    { activeData, activeTab, setActiveTab, handlePlanSelect, programs },
    ref,
  ) => {
    if (!activeData) return null;

    const currentTitle = activeData.title || "CORE";
    const currentSubtitle = activeData.subtitle || "ONE PATHWAY";
    const currentSessionInfo =
      activeData.sessionInfo ||
      (currentTitle === "CORE"
        ? "Five Coached sessions a week — Boxing, HYROX or Strength Training"
        : currentTitle === "ATHLETE"
          ? "Five coached sessions a week across two disciplines (Boxing + HYROX or Boxing + Strength Training)"
          : currentTitle === "BXC DUO"
            ? "Five coached sessions a week for 2 members across your chosen pathways"
            : currentTitle === "BXC FAMILY FIT"
              ? "Full arena access for parents + Junior coaching for kids (up to 4 members)"
              : currentTitle === "JUNIOR"
                ? "Five Coached sessions a week"
                : "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)");

    const dailyRate =
      activeData.dailyRate ||
      (currentTitle === "CORE"
        ? "₹92"
        : currentTitle === "ATHLETE"
          ? "₹132"
          : currentTitle === "BXC DUO"
            ? "₹224"
            : currentTitle === "BXC FAMILY FIT"
              ? "₹390"
              : currentTitle === "JUNIOR"
                ? "₹64"
                : "₹184");

    const dailyRateLabel =
      activeData.dailyRateLabel ||
      (currentTitle === "JUNIOR"
        ? "A DAY AS A FOUNDING MEMBER"
        : currentTitle === "BXC DUO"
          ? "A DAY FOR 2 ON 12-MONTH PLAN"
          : currentTitle === "BXC FAMILY FIT"
            ? "A DAY FOR THE WHOLE FAMILY"
            : "A DAY ON THE 12-MONTH PLAN");

    const dailyComparison =
      activeData.dailyComparison ||
      (currentTitle === "CORE"
        ? "Two coffees and a vada."
        : currentTitle === "ATHLETE"
          ? "One burger."
          : currentTitle === "BXC DUO"
            ? "Two coffees & breakfast for two."
            : currentTitle === "BXC FAMILY FIT"
              ? "One weekend family dinner."
              : currentTitle === "JUNIOR"
                ? "One masala dosa."
                : "One pizza.");

    const benefits =
      activeData.benefits && activeData.benefits.length > 0
        ? activeData.benefits
        : activeData.features && activeData.features.length > 0
          ? activeData.features.map((f) => ({ boldText: f, normalText: "" }))
          : currentTitle === "CORE"
            ? [
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
            ]
            : currentTitle === "ATHLETE"
              ? [
                {
                  boldText: "Strong and not out of breath.",
                  normalText:
                    "Most people get one. Two pathways gets you both.",
                },
                {
                  boldText: "You stop plateauing.",
                  normalText:
                    "Four sessions, two disciplines, nothing goes stale.",
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
              ]
              : currentTitle === "BXC DUO"
                ? [
                  {
                    boldText: "You never skip when someone waits.",
                    normalText:
                      "Partner accountability cuts skipped sessions by over 70%.",
                  },
                  {
                    boldText: "Shared grind builds stronger bonds.",
                    normalText:
                      "Sweat together in the ring, conquer HYROX benchmarks together.",
                  },
                  {
                    boldText: "Coached side-by-side.",
                    normalText:
                      "Train as a team with dedicated coaches pushing you both.",
                  },
                  {
                    boldText: "Better value, together.",
                    normalText:
                      "Complete premium arena access priced for two athletes.",
                  },
                ]
                : currentTitle === "BXC FAMILY FIT"
                  ? [
                    {
                      boldText: "Active role models inspire children.",
                      normalText:
                        "Kids do what they see. When parents train, healthy habits become second nature.",
                    },
                    {
                      boldText: "Screen-free family time with purpose.",
                      normalText:
                        "Replace screen time with punches, agility ladders, and shared sweat.",
                    },
                    {
                      boldText: "Concurrent schedules that save your weekend.",
                      normalText:
                        "Drop off junior for boxing while you hit the HYROX floor simultaneously.",
                    },
                    {
                      boldText: "One simple plan for everyone.",
                      normalText:
                        "Unrestricted arena access for the whole family without four separate bills.",
                    },
                  ]
                  : currentTitle === "JUNIOR"
                    ? [
                      {
                        boldText: "Confidence that shows up at school.",
                        normalText:
                          "A child who can hold a stance stops shrinking in a crowd.",
                      },
                      {
                        boldText: "They learn to handle themselves — and when not to.",
                        normalText:
                          "Discipline is taught before the punch is.",
                      },
                      {
                        boldText: "Focus that carries into homework.",
                        normalText:
                          "Three rounds of concentration, three evenings a week.",
                      },
                      {
                        boldText: "Off the screen, on their feet.",
                        normalText:
                          "Tired in the right way by 7pm.",
                      },
                    ]
                    : [
                      {
                        boldText: "Train the way fighters train.",
                        normalText:
                          "Five days, every discipline, nothing held back.",
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
                    ];

    const plans =
      activeData.plans && activeData.plans.length > 0
        ? activeData.plans
        : [];

    const getTwelveMonthIndex = (plansList) => {
      if (!plansList || plansList.length === 0) return 0;
      const idx = plansList.findIndex(
        (p) =>
          p.months &&
          (p.months.includes("12") ||
            p.months.toLowerCase().includes("12 month") ||
            p.months.toLowerCase().includes("1 year")),
      );
      return idx !== -1 ? idx : plansList.length - 1;
    };

    // Helper duration matchers
    const is1Month = (m = "") => {
      const s = String(m).toLowerCase().trim();
      return (
        s === "1 month" ||
        s === "1 months" ||
        s === "1m" ||
        (s.includes("1") &&
          !s.includes("12") &&
          !s.includes("24") &&
          !s.includes("10") &&
          !s.includes("11") &&
          !s.includes("16") &&
          !s.includes("18") &&
          !s.includes("year"))
      );
    };

    const is12Month = (m = "") => {
      const s = String(m).toLowerCase().trim();
      return (
        s.includes("12") ||
        s.includes("1 year") ||
        s.includes("12m") ||
        s.includes("12 month")
      );
    };

    const is6Month = (m = "") => {
      const s = String(m).toLowerCase().trim();
      return (
        (s.includes("6") &&
          !s.includes("16") &&
          !s.includes("26") &&
          !s.includes("36")) ||
        s.includes("6m") ||
        s.includes("6 month")
      );
    };

    const is24Month = (m = "") => {
      const s = String(m).toLowerCase().trim();
      return (
        s.includes("24") ||
        s.includes("2 year") ||
        s.includes("24m") ||
        s.includes("24 month")
      );
    };

    const is3Month = (m = "") => {
      const s = String(m).toLowerCase().trim();
      return (
        (s.includes("3") &&
          !s.includes("13") &&
          !s.includes("23") &&
          !s.includes("30") &&
          !s.includes("33")) ||
        s.includes("3m") ||
        s.includes("3 month")
      );
    };

    // Track which plan duration is selected to dynamically show EMI / Affordability - default to 12-month plan
    const [selectedPlanIdx, setSelectedPlanIdx] = useState(() =>
      getTwelveMonthIndex(plans),
    );

    // Sorted/arranged order: 1st: 1 Month, Center: 12 Months, 3rd: 6 Months, 4th: 24 Months, then 3 Months
    const carouselPlans = React.useMemo(() => {
      if (!plans || plans.length === 0) return [];
      const plan1 = plans.find((p) => is1Month(p.months));
      const plan12 = plans.find((p) => is12Month(p.months));
      const plan6 = plans.find((p) => is6Month(p.months));
      const plan24 = plans.find((p) => is24Month(p.months));
      const plan3 = plans.find((p) => is3Month(p.months));

      const arranged = [];
      if (plan1) arranged.push(plan1);
      if (plan12) arranged.push(plan12);
      if (plan6) arranged.push(plan6);
      if (plan24) arranged.push(plan24);
      if (plan3) arranged.push(plan3);

      plans.forEach((p) => {
        if (!arranged.some((item) => item.months === p.months)) {
          arranged.push(p);
        }
      });
      return arranged;
    }, [plans]);

    // Active carousel index in carouselPlans (default to 12 Months)
    const [activeCarouselIdx, setActiveCarouselIdx] = useState(() => {
      const idx = carouselPlans.findIndex((p) => is12Month(p.months));
      return idx !== -1 ? idx : 0;
    });

    const scrollContainerRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(() =>
      typeof window !== "undefined" ? window.innerWidth : 1280,
    );

    useEffect(() => {
      const updateWidth = () => {
        if (typeof window !== "undefined") {
          setWindowWidth(window.innerWidth);
        }
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const isDesktop = windowWidth >= 1024;
    const [desktopScrollLeft, setDesktopScrollLeft] = useState(0);

    // On mobile, show a generous peek (45px-55px) of adjacent cards so left and right cards are clearly visible
    const cardWidth = isDesktop
      ? 380
      : Math.min(Math.max(Math.round(windowWidth * 0.70), 250), 295);
    const cardGap = isDesktop ? 24 : 12;
    const step = cardWidth + cardGap;
    const sidePadding = isDesktop
      ? 0
      : Math.max(Math.round((windowWidth - cardWidth) / 2), 32);

    const getDesktopStep = () => {
      if (!scrollContainerRef.current) return step;
      const containerWidth = scrollContainerRef.current.clientWidth;
      return (containerWidth - 48) / 3 + 24;
    };

    const maxDesktopScroll = Math.max(
      0,
      (carouselPlans.length - 3) * getDesktopStep(),
    );

    const slideDesktop = (direction) => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const stepDesktop = getDesktopStep();
      const maxScroll = Math.max(0, (carouselPlans.length - 3) * stepDesktop);
      const targetScroll =
        direction === "next"
          ? container.scrollLeft + stepDesktop
          : container.scrollLeft - stepDesktop;
      const bounded = Math.max(0, Math.min(targetScroll, maxScroll));
      container.scrollTo({
        left: bounded,
        behavior: "smooth",
      });
      setDesktopScrollLeft(bounded);
    };

    const scrollToCard = (index) => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      if (isDesktop) {
        const stepDesktop = getDesktopStep();
        const maxScroll = Math.max(0, (carouselPlans.length - 3) * stepDesktop);
        let targetLeft = 0;
        if (index >= 3) {
          targetLeft = Math.min((index - 2) * stepDesktop, maxScroll);
        } else {
          targetLeft = 0; // Index 0, 1, 2 are in the starting three!
        }
        container.scrollTo({
          left: targetLeft,
          behavior: "smooth",
        });
        setDesktopScrollLeft(targetLeft);
      } else {
        const bounded = Math.max(0, Math.min(index, carouselPlans.length - 1));
        container.scrollTo({
          left: bounded * step,
          behavior: "smooth",
        });
      }
      setActiveCarouselIdx(index);
      const selectedPlan = carouselPlans[index];
      if (selectedPlan) {
        const origIdx = plans.findIndex((p) => p.months === selectedPlan.months);
        if (origIdx !== -1) setSelectedPlanIdx(origIdx);
      }
    };

    const handleScroll = (e) => {
      const container = e.currentTarget;
      const scrollLeft = container.scrollLeft;
      setDesktopScrollLeft(scrollLeft);
      if (!isDesktop) {
        const newIndex = Math.round(scrollLeft / step);
        const clamped = Math.max(0, Math.min(newIndex, carouselPlans.length - 1));
        if (clamped !== activeCarouselIdx) {
          setActiveCarouselIdx(clamped);
          const selectedPlan = carouselPlans[clamped];
          if (selectedPlan) {
            const origIdx = plans.findIndex(
              (p) => p.months === selectedPlan.months,
            );
            if (origIdx !== -1) setSelectedPlanIdx(origIdx);
          }
        }
      }
    };

    // Default to 12-month plan if activeData / plans change and scroll into view
    useEffect(() => {
      if (carouselPlans.length > 0) {
        const idx = carouselPlans.findIndex((p) => is12Month(p.months));
        const targetIdx = idx !== -1 ? idx : 0;
        setActiveCarouselIdx(targetIdx);
        const origIdx = plans.findIndex(
          (p) => p.months === carouselPlans[targetIdx]?.months,
        );
        if (origIdx !== -1) setSelectedPlanIdx(origIdx);

        const timer = setTimeout(() => {
          if (scrollContainerRef.current) {
            if (isDesktop) {
              scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: "smooth",
              });
              setDesktopScrollLeft(0);
            } else {
              scrollContainerRef.current.scrollTo({
                left: targetIdx * step,
                behavior: "smooth",
              });
            }
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }, [activeData?.title, carouselPlans.length, step, isDesktop]);

    // Listen for custom trigger to auto-select and highlight 12-month plan (e.g. from Founding30 CTA)
    useEffect(() => {
      const handleSelect12 = () => {
        const idx = carouselPlans.findIndex((p) => is12Month(p.months));
        if (idx !== -1) scrollToCard(idx);
      };
      window.addEventListener("select-twelve-month-plan", handleSelect12);
      return () => {
        window.removeEventListener("select-twelve-month-plan", handleSelect12);
      };
    }, [carouselPlans, step, isDesktop]);

    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TS0kzk3tqsYO7Z";

    const activePlan = plans[selectedPlanIdx] || plans[0] || {};
    const cleanTotalCurrent =
      activePlan.price || activePlan.totalPrice || "3500";
    const numericPrice =
      Number(String(cleanTotalCurrent).replace(/[^0-9]/g, "")) || 3500;
    const amountInPaise = numericPrice * 100;

    // Initialize and dynamically update Razorpay Affordability Widget for the active card
    useEffect(() => {
      let isMounted = true;

      const renderWidget = () => {
        if (!isMounted) return;
        const container = document.getElementById(
          "razorpay-affordability-widget",
        );
        if (!container) return;

        if (window.RazorpayAffordabilitySuite) {
          try {
            const widgetConfig = {
              key: razorpayKey,
              amount: amountInPaise,
              currency: "INR",
            };
            const rzp = new window.RazorpayAffordabilitySuite(widgetConfig);
            rzp.render();
          } catch (e) {
            console.warn("Razorpay Affordability Widget render error:", e);
          }
        }
      };

      const timer = setTimeout(() => {
        if (window.RazorpayAffordabilitySuite) {
          renderWidget();
        } else {
          const interval = setInterval(() => {
            if (window.RazorpayAffordabilitySuite) {
              clearInterval(interval);
              renderWidget();
            }
          }, 150);

          const maxTimer = setTimeout(() => {
            clearInterval(interval);
          }, 6000);

          return () => {
            clearInterval(interval);
            clearTimeout(maxTimer);
          };
        }
      }, 50);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }, [amountInPaise, selectedPlanIdx, plans, currentTitle, razorpayKey]);

    return (
      <div
        ref={ref}
        id="pricing"
        className="w-full max-w-7xl mx-auto border-t border-zinc-800/80 pt-12 pb-12 scroll-mt-20 md:scroll-mt-24 px-2 sm:px-4"
      >
        <span id="choose-plan" className="sr-only" />
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
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            CHOOSE YOUR <span className="text-[#ccf141]">PLAN</span>
          </h2>

          {/* PREMIUM PROGRAM SWITCHER TABS WITH SPIN BORDER ANIMATION */}
          <div className="w-full flex justify-center mt-5 mb-3 px-1 sm:px-4">
            <div className="relative inline-flex items-center p-1.5 sm:p-2 bg-[#101012]/95 backdrop-blur-xl border border-zinc-800/90 rounded-2xl sm:rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-1.5 sm:gap-2">
              {programs.map((prog) => {
                const isActive = activeTab === prog.id;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => setActiveTab && setActiveTab(prog.id)}
                    className="relative shrink-0 cursor-pointer select-none rounded-xl sm:rounded-full p-0 transition-transform active:scale-95 group focus:outline-none"
                  >
                    {isActive ? (
                      /* ACTIVE TAB: CONTINUOUS 360° SPIN BORDER BEAM ANIMATION */
                      <div className="relative p-[2px] rounded-xl sm:rounded-full overflow-hidden shadow-[0_0_30px_rgba(204,241,65,0.4)]">
                        {/* Spinning Conic Gradient Border */}
                        <div className="absolute inset-[-250%] bg-[conic-gradient(from_0deg,#ccf141_0deg,transparent_70deg,transparent_180deg,#ccf141_250deg,transparent_360deg)] animate-spin-border" />
                        {/* Active Tab Core Body */}
                        <div className="relative z-10 bg-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-[10px] sm:rounded-full flex items-center justify-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${prog.isComingSoon ? "bg-amber-400 shadow-[0_0_10px_#f59e0b]" : "bg-[#ccf141] shadow-[0_0_10px_#ccf141]"} animate-pulse shrink-0`} />
                          <span
                            className="font-black text-xs sm:text-[14px] text-white tracking-wider"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {prog.title}
                          </span>
                          {prog.isComingSoon && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full tracking-wider font-black bg-amber-500 text-black uppercase shadow-sm">
                              COMING SOON
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* INACTIVE TAB */
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 flex items-center justify-center gap-2">
                        <span
                          className="font-black text-xs sm:text-[14px] tracking-wider"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {prog.title}
                        </span>
                        {prog.isComingSoon && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider font-black bg-amber-500/15 text-amber-400 border border-amber-500/40 uppercase">
                            SOON
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* RESPONSIVE PEEK SLIDER STAGE (MOBILE & DESKTOP)                           */}
        {/* Order: 1 Month -> 12 Months (Centered) -> 6 Months -> 24 Months          */}
        {/* ========================================================================= */}
        <div className="w-full relative mb-8">
          {/* Program Header Strip */}
          <div className="mb-4 sm:mb-6 px-2 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3 flex-wrap">
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
              {activeData.isComingSoon && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/60 text-amber-400 text-xs font-mono font-black tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  COMING SOON
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-xs sm:text-[13px] md:text-sm text-zinc-400 font-medium max-w-xl text-left md:text-right leading-relaxed">
                {currentSessionInfo}
              </p>

              {/* Header Desktop Chevron Controls */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => (isDesktop ? slideDesktop("prev") : scrollToCard(activeCarouselIdx - 1))}
                  disabled={isDesktop ? desktopScrollLeft <= 10 : activeCarouselIdx === 0}
                  aria-label="Previous Plan"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700/80 hover:border-[#ccf141] hover:bg-[#ccf141] text-zinc-300 hover:text-black flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => (isDesktop ? slideDesktop("next") : scrollToCard(activeCarouselIdx + 1))}
                  disabled={isDesktop ? desktopScrollLeft >= maxDesktopScroll - 15 : activeCarouselIdx === carouselPlans.length - 1}
                  aria-label="Next Plan"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700/80 hover:border-[#ccf141] hover:bg-[#ccf141] text-zinc-300 hover:text-black flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Trust & Flexibility Feature Badges (Buy Now · Pause · No-Cost EMI) */}
          <div className="w-full mb-5 sm:mb-6 px-2 sm:px-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl sm:max-w-3xl mx-auto py-3 sm:py-3.5 px-3 sm:px-6 rounded-2xl bg-[#0f0f12]/90 border border-zinc-800/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              {/* Feature 1: Buy Now */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center shrink-0 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200">
                  <Play size={13} className="fill-amber-400 text-amber-400 translate-x-0.5" />
                </div>
                <div>
                  <h4
                    className="text-xs sm:text-[13px] md:text-sm font-black text-white uppercase tracking-tight leading-none"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Buy Now
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-tight mt-1">
                    start anytime
                  </p>
                </div>
              </div>

              {/* Feature 2: Pause */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left border-x border-zinc-800/80 px-1 sm:px-3 group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center shrink-0 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200">
                  <Pause size={13} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h4
                    className="text-xs sm:text-[13px] md:text-sm font-black text-white uppercase tracking-tight leading-none"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Pause
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-tight mt-1">
                    pack anytime
                  </p>
                </div>
              </div>

              {/* Feature 3: No-Cost EMI */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center shrink-0 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200">
                  <span className="text-[10px] sm:text-[11px] font-black text-amber-400 font-mono tracking-tighter leading-none">
                    EMI
                  </span>
                </div>
                <div>
                  <h4
                    className="text-xs sm:text-[13px] md:text-sm font-black text-white uppercase tracking-tight leading-none"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    No-Cost
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-tight mt-1">
                    EMI available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Stage Container with Floating Side Chevrons and Bleed Width */}
          <div className="relative w-full">
            {/* Floating Side Left Arrow (Desktop / Tablet) */}
            <button
              type="button"
              onClick={() => (isDesktop ? slideDesktop("prev") : scrollToCard(activeCarouselIdx - 1))}
              disabled={isDesktop ? desktopScrollLeft <= 10 : activeCarouselIdx === 0}
              aria-label="Slide Left"
              className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#101012]/90 hover:bg-[#ccf141] text-white hover:text-black border border-zinc-700 hover:border-[#ccf141] backdrop-blur-md items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.9)] active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Floating Side Right Arrow (Desktop / Tablet) */}
            <button
              type="button"
              onClick={() => (isDesktop ? slideDesktop("next") : scrollToCard(activeCarouselIdx + 1))}
              disabled={isDesktop ? desktopScrollLeft >= maxDesktopScroll - 15 : activeCarouselIdx === carouselPlans.length - 1}
              aria-label="Slide Right"
              className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#101012]/90 hover:bg-[#ccf141] text-white hover:text-black border border-zinc-700 hover:border-[#ccf141] backdrop-blur-md items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.9)] active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronRight size={24} />
            </button>

            {/* Native Touch & Smooth Scrollable Peek Carousel Stage */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`flex items-stretch overflow-x-auto snap-x snap-mandatory py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isDesktop
                  ? "w-full relative"
                  : "w-screen relative left-1/2 -translate-x-1/2"
                }`}
              style={{
                paddingLeft: isDesktop ? "0px" : `${sidePadding}px`,
                paddingRight: isDesktop ? "0px" : `${sidePadding}px`,
                gap: `${cardGap}px`,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {carouselPlans.map((plan, idx) => {
                const isCenter = idx === activeCarouselIdx;
                const isOneMonth = is1Month(plan.months);
                const isTwelveMonth = is12Month(plan.months);
                const isTwentyFourMonth = is24Month(plan.months);
                const isSixMonth = is6Month(plan.months);

                const cleanTotal = plan.price || plan.totalPrice || "";
                const numericPrice =
                  Number(String(cleanTotal).replace(/[^0-9]/g, "")) || 0;
                const originalPriceStr =
                  plan.originalPrice ||
                  (isTwentyFourMonth
                    ? Math.round(numericPrice * 1.45).toLocaleString("en-IN")
                    : isTwelveMonth
                      ? "42,000"
                      : isSixMonth
                        ? "21,000"
                        : plan.months?.includes("3")
                          ? "10,500"
                          : Math.round(numericPrice * 1.25).toLocaleString(
                            "en-IN",
                          ));

                const bullets = getPlanMobileBullets(plan, currentTitle);

                return (
                  <div
                    key={plan.months || idx}
                    id={isTwelveMonth ? "twelve-month-card" : `plan-card-${idx}`}
                    onClick={() => scrollToCard(idx)}
                    style={{
                      width: isDesktop ? "calc((100% - 48px) / 3)" : `${cardWidth}px`,
                      minHeight: isDesktop
                        ? currentTitle === "CORE" || currentTitle === "ATHLETE" || currentTitle === "ARENA" ? "640px" : "560px"
                        : currentTitle === "CORE" || currentTitle === "ATHLETE" || currentTitle === "ARENA" ? "560px" : "515px",
                    }}
                    className={`shrink-0 snap-center rounded-[24px] cursor-pointer select-none transition-all duration-300 flex flex-col justify-between ${isDesktop
                        ? isCenter
                          ? "scale-100 opacity-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20"
                          : "scale-100 opacity-95 hover:opacity-100 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-10"
                        : isCenter
                          ? "scale-100 opacity-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20"
                          : "scale-[0.95] opacity-80 hover:opacity-100 shadow-[0_8px_25px_rgba(0,0,0,0.6)] z-10"
                      }`}
                  >
                    <div
                      className={`w-full h-full rounded-[24px] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isCenter
                          ? isTwelveMonth
                            ? "bg-[#141417] border-2 border-[#ccf141]/85 shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(204,241,65,0.25)] ring-1 ring-[#ccf141]/30"
                            : isTwentyFourMonth
                              ? "bg-[#141417] border-2 border-amber-400/85 shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30"
                              : "bg-[#141417] border border-zinc-700/80 shadow-[0_20px_45px_rgba(0,0,0,0.95)] ring-1 ring-white/10"
                          : "bg-[#101012] hover:bg-[#141417] border border-zinc-700/90 shadow-md"
                        }`}
                    >

                      {/* Card Content Top Half */}
                      <div className="relative z-10 flex flex-col flex-grow">
                        {/* Duration Header & Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3
                            className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none"
                            style={{
                              fontFamily: '"BrutalTypeBold", sans-serif',
                            }}
                          >
                            {plan.months}
                          </h3>

                          {isTwelveMonth ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#18181b] text-green-400 border border-green-200 shrink-0">
                              Most Bought
                            </span>
                          ) : isTwentyFourMonth ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#18181b] text-amber-300 border border-amber-400/90  shrink-0">
                              BEST VALUE
                            </span>
                          ) : plan.popular || isSixMonth ? (
                            <span className="">

                            </span>
                          ) : null}
                        </div>

                        {/* Strikethrough Original Price */}
                        <div className="min-h-[18px]">
                          {originalPriceStr ? (
                            <span className="text-zinc-500 font-bold text-xs sm:text-sm line-through italic">
                              ₹{originalPriceStr}
                            </span>
                          ) : null}
                        </div>

                        {/* Active Big Price + /mo* text */}
                        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                          <span
                            className="text-[#c3e53f] font-black text-3xl sm:text-4xl tracking-tight leading-none"
                            style={{
                              fontFamily:
                                '"BrutalTypeBold", Impact, sans-serif',
                            }}
                          >
                            ₹{numericPrice.toLocaleString("en-IN")}
                          </span>
                          {!isOneMonth && (
                            <span className="text-zinc-400 font-medium text-xs sm:text-[13px]">
                              (₹{getEmiPerMonth(cleanTotal, plan.months)}/mo*)
                            </span>
                          )}
                        </div>

                        {/* Hairline Divider Line */}
                        <div className="h-[1px] bg-zinc-800/80 my-3 sm:my-3.5" />

                        {/* Feature Bullet Points / Specification */}
                        {currentTitle === "CORE" ? (
                          <div className="my-2.5 flex-grow space-y-1 text-left">
                            <div className="rounded-2xl bg-black/50 border border-zinc-800/90 p-3 sm:p-3.5 space-y-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                              {/* 1. Training access */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Training access</span>
                                <span className="text-[#ccf141] font-black tracking-tight">Choose 1 pathway</span>
                              </div>

                              {/* 2. Boxing / Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing / Strength</span>
                                <span className="text-zinc-200 font-semibold text-[11px]">If selected</span>
                              </div>

                              {/* 3. Weekly training allowance */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Weekly allowance</span>
                                <span className="text-white font-bold">Up to 5 visits</span>
                              </div>

                              {/* 4. Boxing coaching */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing coaching</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px] text-right">4 coached + 1 open</span>
                              </div>

                              {/* 5. Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Strength</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px]">CRM-guided open gym</span>
                              </div>

                              {/* 6. Performance assessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Performance assessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 7. 90-day reassessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">90-day reassessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 8. BXC Tribe */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">BXC Tribe</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 9. HYROX */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">HYROX</span>
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/35">
                                  Coming soon
                                </span>
                              </div>

                              {/* 10. Booking priority */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Booking priority</span>
                                <span className="text-zinc-300 font-medium text-[11px]">Standard</span>
                              </div>

                              {/* 11. Personal Training */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-500 font-medium">Personal Training</span>
                                <span className="text-zinc-400 text-[10.5px]">Paid separately</span>
                              </div>

                              {/* 12. Monthly 1:1 review */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pt-0.5">
                                <span className="text-zinc-500 font-medium">Monthly 1:1 review</span>
                                <span className="text-zinc-500 text-[10.5px]">Not included</span>
                              </div>
                            </div>
                          </div>
                        ) : currentTitle === "ATHLETE" ? (
                          <div className="my-2.5 flex-grow space-y-1 text-left">
                            <div className="rounded-2xl bg-black/50 border border-zinc-800/90 p-3 sm:p-3.5 space-y-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                              {/* 1. Training access */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Training access</span>
                                <span className="text-[#ccf141] font-black tracking-tight">Boxing + Strength</span>
                              </div>

                              {/* 2. Boxing & Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing & Strength</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Both Included
                                </span>
                              </div>

                              {/* 3. Weekly training allowance */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Weekly allowance</span>
                                <span className="text-white font-bold">Up to 5 visits</span>
                              </div>

                              {/* 4. Boxing coaching */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing coaching</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px] text-right">Based on primary focus</span>
                              </div>

                              {/* 5. Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Strength</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px]">CRM-guided open gym</span>
                              </div>

                              {/* 6. Performance assessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Performance assessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 7. 90-day reassessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">90-day reassessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 8. BXC Tribe */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">BXC Tribe</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 9. HYROX */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">HYROX</span>
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/35">
                                  Alt. coming soon
                                </span>
                              </div>

                              {/* 10. Booking priority */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Booking priority</span>
                                <span className="text-zinc-300 font-medium text-[11px]">Standard</span>
                              </div>

                              {/* 11. Personal Training */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-500 font-medium">Personal Training</span>
                                <span className="text-zinc-400 text-[10.5px]">Paid separately</span>
                              </div>

                              {/* 12. Monthly 1:1 review */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pt-0.5">
                                <span className="text-zinc-500 font-medium">Monthly 1:1 review</span>
                                <span className="text-zinc-500 text-[10.5px]">Not included</span>
                              </div>
                            </div>
                          </div>
                        ) : currentTitle === "ARENA" ? (
                          <div className="my-2.5 flex-grow space-y-1 text-left">
                            <div className="rounded-2xl bg-black/50 border border-zinc-800/90 p-3 sm:p-3.5 space-y-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                              {/* 1. Training access */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Training access</span>
                                <span className="text-[#ccf141] font-black tracking-tight">All pathways</span>
                              </div>

                              {/* 2. Boxing & Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing & Strength</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Both Included
                                </span>
                              </div>

                              {/* 3. HYROX */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">HYROX</span>
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/35">
                                  Included when launched*
                                </span>
                              </div>

                              {/* 4. Weekly training allowance */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Weekly allowance</span>
                                <span className="text-white font-bold">Up to 5 visits</span>
                              </div>

                              {/* 5. Boxing coaching */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Boxing coaching</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px] text-right">Based on primary focus</span>
                              </div>

                              {/* 6. Strength */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Strength</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px]">CRM-guided open gym</span>
                              </div>

                              {/* 7. Performance assessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Performance assessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 8. 90-day reassessment */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">90-day reassessment</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 9. BXC Tribe */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">BXC Tribe</span>
                                <span className="inline-flex items-center gap-1 text-[#ccf141] font-bold text-[10.5px]">
                                  <Check size={11} strokeWidth={3} /> Included
                                </span>
                              </div>

                              {/* 10. Booking priority */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-400 font-medium">Booking priority</span>
                                <span className="text-[#ccf141] font-semibold text-[10.5px]">Proposed priority</span>
                              </div>

                              {/* 11. Personal Training */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pb-1.5 border-b border-zinc-800/60">
                                <span className="text-zinc-500 font-medium">Personal Training</span>
                                <span className="text-zinc-400 text-[10.5px]">Paid separately</span>
                              </div>

                              {/* 12. Monthly 1:1 review */}
                              <div className="flex items-center justify-between text-[11.5px] sm:text-xs pt-0.5">
                                <span className="text-zinc-400 font-medium">Monthly 1:1 review</span>
                                <span className="text-zinc-200 font-semibold text-[10.5px]">Proposed benefit</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Feature Bullet Points with '+' Icons */
                          <div className="space-y-2.5 sm:space-y-3 my-1 flex-grow">
                            {bullets.map((item, bIdx) => (
                              <div
                                key={bIdx}
                                className="flex items-start gap-2.5"
                              >
                                <span className="text-zinc-400 font-bold text-sm leading-none shrink-0 mt-0.5 select-none">
                                  +
                                </span>
                                <span className="text-[12px] sm:text-[13px] leading-snug text-zinc-300 italic font-medium">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Button */}
                      <div className="relative mt-4 sm:mt-6 pt-2 shrink-0">
                        <button
                          type="button"
                          disabled={activeData.isComingSoon}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCenter) {
                              scrollToCard(idx);
                              return;
                            }
                            if (activeData.isComingSoon) return;
                            handlePlanSelect(
                              `${currentTitle} - ${plan.months}`,
                              cleanTotal,
                              plan.months,
                            );
                          }}
                          className={`w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-[0.98] flex items-center justify-center gap-1.5 ${activeData.isComingSoon
                              ? "bg-zinc-800 text-amber-400 border border-amber-500/40"
                              : "bg-[#ccf141] text-black hover:bg-zinc-100 hover:shadow-[0_6px_28px_rgba(255,51,102,0.28)]"
                            }`}
                          style={{
                            fontFamily: '"BrutalTypeBold", sans-serif',
                          }}
                        >
                          {activeData.isComingSoon
                            ? "COMING SOON"
                            : "Get Access"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COMING SOON FULL BLUR OVERLAY OVER SLIDER */}
            {activeData.isComingSoon && (
              <div className="absolute inset-0 z-40 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none transition-all duration-300 rounded-[24px]">
                <div className="absolute w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-black uppercase tracking-widest mb-4 shadow-sm">
                  <span>{currentTitle} · ADMISSIONS LAUNCHING SOON</span>
                </div>
                <h3
                  className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-3 leading-none drop-shadow-lg"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  COMING SOON
                </h3>
                <p
                  className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8 font-medium"
                  style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                >
                  We are currently setting up the arena floor and coaching cohorts for the{" "}
                  <strong className="text-white font-bold">{currentTitle}</strong> pathway. Online bookings and admissions will unlock shortly.
                </p>
              </div>
            )}
          </div>

        </div>


        {/* SEPARATE SECTION: WHAT IT ACTUALLY GIVES YOU & DAILY VALUE */}
        <motion.div
          key={`benefits-${currentTitle}`}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-8 sm:mt-12 w-full bg-[#0a0a0c] text-white border-2 border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative"
        >
          {/* Subtle ambient background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left Side: WHAT IT ACTUALLY GIVES YOU */}
            <div className="flex-1 p-6 sm:p-9 md:p-10 bg-[#0c0c0e]">
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6 select-none">
                <span className="w-2.5 h-2.5 bg-[#ccf141] rounded-[2px] shadow-[0_0_8px_#ccf141]" />
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-zinc-400"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  WHAT IT ACTUALLY GIVES YOU
                </span>
              </div>

              <div className="space-y-4 sm:space-y-4.5">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 group">
                    {/* Neon Lime Square Bullet from Reference Images */}
                    <span className="w-2.5 h-2.5 bg-[#ccf141] shrink-0 mt-1 rounded-[2px] shadow-[0_0_8px_rgba(204,241,65,0.4)] group-hover:scale-110 transition-transform" />
                    <p className="text-xs sm:text-[14px] leading-relaxed text-zinc-300">
                      <strong className="text-white font-black mr-1.5 tracking-tight">
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

            {/* Right Side: BLACK BOX (DAILY RATE & COMPARISON) */}
            <div className="w-full md:w-[320px] lg:w-[360px] bg-black text-white p-7 sm:p-9 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-zinc-800 shrink-0 relative overflow-hidden">
              {/* Radial neon glow behind daily rate */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,241,65,0.12)_0%,transparent_70%)] pointer-events-none" />

              {/* Giant Neon Rate */}
              <div
                className="relative z-10 text-6xl sm:text-7xl md:text-8xl font-black text-[#ccf141] tracking-tight leading-none select-none drop-shadow-[0_0_25px_rgba(204,241,65,0.45)] flex items-baseline justify-center gap-2"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                <span>{dailyRate}</span>
                <span className="text-lg sm:text-xl font-sans font-bold text-zinc-300">/ day</span>
              </div>

              {/* Subtitle / Term Label */}
              <span className="relative z-10 mt-3 text-[13px] sm:text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-300 uppercase select-none">
                {dailyRateLabel}
              </span>

              {/* Daily Comparison Punchline (e.g. "Two coffees & breakfast for two.") */}
              <div
                className="relative z-10 mt-4 text-sm sm:text-base md:text-lg font-bold text-white select-none leading-snug max-w-xs"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {dailyComparison}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  },
);

ChoosePlan.displayName = "ChoosePlan";

export default ChoosePlan;
