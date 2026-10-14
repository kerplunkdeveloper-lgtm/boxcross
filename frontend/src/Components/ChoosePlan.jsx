import React, { useState, useEffect } from "react";
import { Check, ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import BCMonogram from "./BCMonogram";

const getEmiPerMonth = (totalPriceStr, monthsStr = "") => {
  const numeric = Number(String(totalPriceStr).replace(/[^0-9]/g, "")) || 0;
  if (!numeric) return "0";
  let tenure = 3;
  if (monthsStr.includes("12")) tenure = 12;
  else if (monthsStr.includes("6")) tenure = 6;
  else if (monthsStr.includes("3")) tenure = 3;
  else tenure = 3;
  const emi = Math.round(numeric / tenure);
  return emi.toLocaleString("en-IN");
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
          : currentTitle === "JUNIOR"
            ? "Five Coached sessions a week"
            : "Five coached sessions a week, every pathway, every class (Boxing + HYROX + Strength Training)");

    const dailyRate =
      activeData.dailyRate ||
      (currentTitle === "CORE"
        ? "₹92"
        : currentTitle === "ATHLETE"
          ? "₹132"
          : currentTitle === "JUNIOR"
            ? "₹64"
            : "₹184");

    const dailyRateLabel =
      activeData.dailyRateLabel ||
      (currentTitle === "JUNIOR"
        ? "A DAY AS A FOUNDING MEMBER"
        : "A DAY ON THE 12-MONTH PLAN");

    const dailyComparison =
      activeData.dailyComparison ||
      (currentTitle === "CORE"
        ? "Two coffees and a vada."
        : currentTitle === "ATHLETE"
          ? "One burger."
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

    // Track which plan duration is selected to dynamically show EMI / Affordability - default to 12-month plan
    const [selectedPlanIdx, setSelectedPlanIdx] = useState(() =>
      getTwelveMonthIndex(plans),
    );

    // Keep index in bounds and default to 12-month plan if activeData / plans change
    useEffect(() => {
      if (plans && plans.length > 0) {
        const twelveIdx = getTwelveMonthIndex(plans);
        setSelectedPlanIdx(twelveIdx);
      }
    }, [activeData?.title]);

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
                          <span className="text-[9.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md sm:rounded-full tracking-wider font-extrabold bg-[#ccf141] text-black">
                            {prog.subtitle}
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
                        <span className="text-[9.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md sm:rounded-full tracking-wider font-extrabold bg-zinc-900/90 text-zinc-400 border border-zinc-700/50">
                          {prog.subtitle}
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

        {/* MAIN PRICING CARD (BLACK THEME WITH WHITE TEXT AND BORDERS) */}
        <motion.div
          key={currentTitle}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full bg-[#0a0a0a] text-white border-2 border-zinc-800 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* CARD TOP HEADER STRIP: PROGRAM + SUBTITLE + SESSION INFO */}
          <div className="bg-black text-white px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
            <div className="flex items-center gap-3.5 flex-wrap">
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
            <p className="text-xs sm:text-[13px] text-zinc-300 font-medium">
              {currentSessionInfo}
            </p>
          </div>

          {/* CARD BODY WITH DURATION COLUMNS & BENEFITS (WITH FULL BLUR OVERLAY WHEN COMING SOON) */}
          <div className="relative">
            {/* 4 DURATION COLUMNS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 bg-[#0a0a0a]">
              {plans.map((plan, idx) => {
                const cleanTotal =
                  plan.price ||
                  plan.totalPrice ||
                  "";
                const cleanPerMonth = plan.perMonth || plan.price;
                const hasDiscount = Boolean(plan.originalPrice);

                const isSaveTag =
                  plan.tag && plan.tag.toUpperCase().startsWith("SAVE");

                const saveText =
                  (plan.tag && plan.tag.toUpperCase().includes("SAVE")
                    ? plan.tag
                    : null) ||
                  (plan.subtitle && plan.subtitle.toUpperCase().includes("SAVE")
                    ? plan.subtitle
                    : null) ||
                  (hasDiscount && plan.originalPrice
                    ? `SAVE ₹${(
                      (Number(String(plan.originalPrice).replace(/[^0-9]/g, "")) || 0) -
                      (Number(String(cleanTotal).replace(/[^0-9]/g, "")) || 0)
                    ).toLocaleString("en-IN")}`
                    : null);

                const isSelected = selectedPlanIdx === idx;
                const isTwelveMonth = Boolean(
                  plan.months &&
                  (plan.months.includes("12") ||
                    plan.months.toLowerCase().includes("12 month") ||
                    plan.months.toLowerCase().includes("1 year")),
                );
                const planNumericPrice =
                  Number(String(cleanTotal).replace(/[^0-9]/g, "")) || 0;
                const planAmountInPaise = planNumericPrice * 100;

                return (
                  <div
                    key={idx}
                    className={`p-6 sm:p-7 md:p-8 flex flex-col items-center text-center justify-between transition-all duration-300 group cursor-pointer relative ${isTwelveMonth
                        ? "bg-zinc-900/60 ring-2 ring-[#ccf141] shadow-[0_0_30px_rgba(204,241,65,0.25)] rounded-xl z-10"
                        : isSelected
                          ? "bg-zinc-900/50 ring-2 ring-[#ccf141]/80 shadow-[0_0_20px_rgba(204,241,65,0.15)] rounded-xl z-10"
                          : "hover:bg-zinc-900/40 rounded-xl"
                      }`}
                    onClick={() => {
                      if (activeData.isComingSoon) {
                        setSelectedPlanIdx(idx);
                        return;
                      }
                      if (isSelected) {
                        handlePlanSelect(
                          `${currentTitle} - ${plan.months}`,
                          cleanTotal,
                          plan.months,
                        );
                      } else {
                        setSelectedPlanIdx(idx);
                      }
                    }}
                  >
                    {/* Fixed Center Highlight Badge for 12-Month Plan: 54.4% OFFER & HURRY UP 8 DAYS ONLY */}
                    {isTwelveMonth && (
                      <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-max max-w-[95%]">
                        <div className="relative group/offer">
                          {/* Outer ambient glow */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-amber-400 to-[#ccf141] rounded-full blur-[4px] opacity-75 animate-pulse" />

                          {/* Pill badge container */}
                          <div className="relative px-3 sm:px-3.5 py-1 sm:py-1.5 bg-[#0b0b0e]/95 backdrop-blur-md border border-[#ccf141]/60 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(204,241,65,0.25)]">
                            {/* Pulsing red live beacon */}
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>



                            <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />

                            {/* Urgent limited tag */}
                            <span className="px-1.5 py-0.5 rounded-[4px] bg-red-500/25 border border-red-500/50 text-red-400 font-mono font-black text-[8px] sm:text-[9px] uppercase tracking-wider leading-none shrink-0 animate-pulse">
                              LIMITED
                            </span>

                            {/* HURRY UP 8 DAYS ONLY */}
                            <span className="text-[9px] sm:text-[10px] font-mono font-extrabold uppercase tracking-tight text-yellow-400 leading-none whitespace-nowrap">
                              HURRY UP 8 DAYS ONLY
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="w-full flex flex-col items-center">
                      {/* Duration Label */}
                      <span
                        className={`text-zinc-400 font-bold uppercase text-xs sm:text-[13px] mb-2 select-none transition-colors ${isTwelveMonth ? "mt-6 sm:mt-6 text-white" : ""
                          }`}
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {plan.months}
                      </span>

                      {/* Total Price Line with Save Tag right beside it */}
                      <div className="flex items-center justify-center gap-2 flex-wrap my-1">
                        <span
                          className="font-black text-white text-[30px] sm:text-3xl md:text-[38px] leading-tight tracking-tight"
                          style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                        >
                          ₹{cleanTotal}/-
                        </span>
                        {saveText && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ccf141]/20 border border-[#ccf141]/50 text-[#ccf141] text-[10px] sm:text-[11px] font-black uppercase tracking-wider select-none whitespace-nowrap shadow-[0_0_10px_rgba(204,241,65,0.2)]"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141]"></span>
                            {saveText}
                          </span>
                        )}
                      </div>

                      {/* Strikethrough if discounted */}
                      {hasDiscount && (
                        <div className="my-0.5">
                          <span className="line-through text-zinc-400 font-medium  sm:text-[13px]">
                            ₹{plan.originalPrice}/-
                          </span>
                        </div>
                      )}

                      {/* Per Month Price */}
                      <div
                        className="text-xs sm:text-sm font-black text-yellow-400 tracking-tight leading-none my-1 flex items-baseline justify-center"
                        style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                      >
                        <span>₹{cleanPerMonth} / Month</span>
                      </div>

                      {/* EMI Affordability Widget with border and enhanced UI/UX */}
                      <div
                        className={`w-full mt-3.5 mb-1 px-3 py-2.5 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${isSelected
                            ? "border-[#ccf141]/60 bg-[#121215] shadow-[0_0_12px_rgba(204,241,65,0.1)]"
                            : isTwelveMonth
                              ? "border-[#ccf141]/40 bg-[#121215]/80 hover:border-[#ccf141]/70"
                              : "border-zinc-800/90 bg-[#0d0d10] hover:border-zinc-700"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanIdx(idx);
                        }}
                      >
                        <div className="w-full flex justify-center items-center min-h-[36px]">
                          {isSelected ? (
                            <div className="relative w-full flex justify-center items-center min-h-[36px]">
                              <div
                                id="razorpay-affordability-widget"
                                data-key={razorpayKey}
                                data-amount={planAmountInPaise}
                                data-currency="INR"
                                className="w-full flex justify-center items-center text-center text-xs text-zinc-200 font-sans"
                              ></div>
                              <div className="razorpay-fallback flex items-center justify-center gap-1.5 text-xs text-zinc-300 pointer-events-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-pulse"></span>
                                <span className="text-[11.5px] font-medium text-white">
                                  EMI from <strong className="text-[#ccf141] font-bold">₹{getEmiPerMonth(cleanTotal, plan.months)}/mo</strong>
                                </span>
                                <span className="text-[10px] text-zinc-500">•</span>
                                <span className="text-[10.5px] text-[#ccf141] font-bold underline underline-offset-2">
                                  View Plans
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full flex justify-center items-center text-center text-xs text-zinc-300 min-h-[36px]">
                              <div className="flex items-center justify-center gap-1.5 text-xs">
                                <span className="text-[11.5px] font-medium text-zinc-300">
                                  EMI from <strong className="text-white font-bold">₹{getEmiPerMonth(cleanTotal, plan.months)}/mo</strong>
                                </span>
                                <span className="text-[10px] text-zinc-500">•</span>
                                <span className="text-[10.5px] text-zinc-400 hover:text-[#ccf141] underline underline-offset-2 transition-colors">
                                  View Plans
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button: Outline Button with Spinning Border Beam */}
                    <div className="w-full pt-3">
                      <button
                        type="button"
                        disabled={activeData.isComingSoon}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeData.isComingSoon) return;
                          setSelectedPlanIdx(idx);
                          handlePlanSelect(
                            `${currentTitle} - ${plan.months}`,
                            cleanTotal,
                            plan.months,
                          );
                        }}
                        className={`relative w-full p-[1.5px] rounded-xl overflow-hidden select-none transition-all duration-300 ${activeData.isComingSoon
                            ? "opacity-90 cursor-not-allowed border border-amber-500/40"
                            : isTwelveMonth || isSelected
                              ? "cursor-pointer shadow-[0_0_25px_rgba(204,241,65,0.35)] active:scale-[0.98]"
                              : "cursor-pointer shadow-[0_0_15px_rgba(204,241,65,0.1)] hover:shadow-[0_0_25px_rgba(204,241,65,0.3)] active:scale-[0.98]"
                          }`}
                      >
                        {/* 360° Continuous Spinning Conic Border Animation */}
                        {!activeData.isComingSoon && (
                          <div className="absolute inset-[-250%] bg-[conic-gradient(from_0deg,#ccf141_0deg,transparent_70deg,transparent_180deg,#ccf141_250deg,transparent_360deg)] animate-spin-border" />
                        )}

                        {/* Outline Button Body */}
                        <div
                          className={`relative z-10 w-full py-2.5 sm:py-3 px-4 rounded-[10.5px] flex items-center justify-center gap-2 transition-all duration-300 ${activeData.isComingSoon
                              ? "bg-zinc-900/90 text-amber-400 font-black border border-amber-500/30"
                              : isTwelveMonth || isSelected
                                ? "bg-black text-[#ccf141] group-hover:bg-[#ccf141] group-hover:text-black"
                                : "bg-black text-white group-hover:bg-[#ccf141] group-hover:text-black"
                            }`}
                        >
                          <span
                            className="font-black uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {activeData.isComingSoon ? "COMING SOON" : "GET ACCESS"}
                          </span>
                          {!activeData.isComingSoon && (
                            <ArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                            />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CARD BOTTOM SECTION: WHAT IT ACTUALLY GIVES YOU + RIGHT BLACK BOX */}
            <div className="border-t border-zinc-800 flex flex-col md:flex-row items-stretch bg-black">
              {/* Left Side: WHAT IT ACTUALLY GIVES YOU */}
              <div className="flex-1 p-6 sm:p-8 md:p-9 bg-[#0e0e0e]">
                <span
                  className="block text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5 select-none"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  WHAT IT ACTUALLY GIVES YOU
                </span>

                <div className="space-y-4">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {/* Neon Lime Square Bullet from Reference Images */}
                      <span className="w-2.5 h-2.5 bg-[#ccf141] shrink-0 mt-1 rounded-[1.5px]" />
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-zinc-300">
                        <strong className="text-white font-black mr-1">
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

              {/* Right Side: BLACK BOX (₹75 / ₹108 / ₹151 A DAY AS A FOUNDING MEMBER) */}
              <div className="w-full md:w-[320px] lg:w-[360px] bg-black text-white p-6 sm:p-8 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-zinc-800 shrink-0">
                {/* Giant Neon Rate */}
                <div
                  className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#ccf141] tracking-tight leading-none select-none drop-shadow-[0_0_20px_rgba(204,241,65,0.45)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {dailyRate}  <span style={{ fontSize: "1.5rem" }}>per day</span>
                </div>

                {/* Subtitle */}
                <span
                  className="mt-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-300 uppercase select-none"
                >
                  {dailyRateLabel}
                </span>

                {/* Daily Comparison Punchline (e.g. "A dosa and a filter coffee.") */}
                <div
                  className="mt-4 text-base sm:text-lg lg:text-xl font-bold text-white select-none leading-snug"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {dailyComparison}
                </div>
              </div>
            </div>

            {/* COMING SOON FULL BLUR OVERLAY OVER PRICING COLUMNS & BENEFITS */}
            {activeData.isComingSoon && (
              <div className="absolute inset-0 z-30 backdrop-blur-md bg-black/85 flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none transition-all duration-300">
                {/* Subtle Ambient Amber Glow */}
                <div className="absolute w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />



                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-black uppercase tracking-widest mb-4 shadow-sm">
                  <span>{currentTitle} · ADMISSIONS LAUNCHING SOON</span>
                </div>

                {/* Main Title */}
                <h3
                  className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-3 leading-none drop-shadow-lg"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  COMING SOON
                </h3>

                {/* Explanatory Description */}
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
        </motion.div>
      </div>
    );
  },
);

ChoosePlan.displayName = "ChoosePlan";

export default ChoosePlan;
