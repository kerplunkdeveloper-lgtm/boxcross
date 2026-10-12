import React from "react";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
        ? "Three coached sessions a week — Fight, HYROX or Strength"
        : currentTitle === "ATHLETE"
        ? "Four coached sessions a week across two disciplines"
        : currentTitle === "JUNIOR"
        ? "Three coached sessions a week"
        : "Five coached sessions a week, every pathway, every class");

    const dailyRate =
      activeData.dailyRate ||
      (currentTitle === "CORE"
        ? "₹75"
        : currentTitle === "ATHLETE"
        ? "₹108"
        : currentTitle === "JUNIOR"
        ? "₹64"
        : "₹151");

    const dailyComparison =
      activeData.dailyComparison ||
      (currentTitle === "CORE"
        ? "A dosa and a filter coffee."
        : currentTitle === "ATHLETE"
        ? "One burger."
        : currentTitle === "JUNIOR"
        ? "One masala dosa."
        : "One cinema ticket.");

    const benefits =
      activeData.benefits && activeData.benefits.length > 0
        ? activeData.benefits
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

    return (
      <div
        ref={ref}
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
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            CHOOSE YOUR <span className="text-[#ccf141]">PLAN</span>
          </h2>

          <p
            className="text-zinc-400 text-xs sm:text-sm max-w-2xl text-center font-medium"
            style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
          >
            Select a program below to review its rates, coached sessions, and founding member benefits.
          </p>

          {/* PROGRAM SWITCHER TABS */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 mb-3">
            {programs.map((prog) => {
              const isActive = activeTab === prog.id;
              return (
                <button
                  key={prog.id}
                  type="button"
                  onClick={() => setActiveTab && setActiveTab(prog.id)}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.35)] scale-105"
                      : "bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
                  }`}
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>{prog.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? "bg-black/20 text-black font-extrabold"
                        : "bg-black/60 text-zinc-500"
                    }`}
                  >
                    {prog.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FOUNDING MEMBER RATES TOP BANNER (As seen in Reference Image 2) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-black border-t-2 border-x-2 border-zinc-800 rounded-t-xl overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-stretch justify-between divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Logo / Arena Tag */}
            <div className="px-5 py-4 flex flex-col justify-center min-w-[220px]">
              <span
                className="text-white text-base sm:text-lg font-black tracking-wider uppercase leading-none"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                BOX &amp; CROSS
              </span>
              <span
                className="text-[#ccf141] text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-[0.25em] uppercase mt-1"
              >
                PERFORMANCE ARENA
              </span>
            </div>

            {/* Middle Title */}
            <div className="px-6 py-4 flex-1 flex flex-col justify-center">
              <h3
                className="text-white text-lg sm:text-2xl font-black uppercase tracking-wider leading-none"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                FOUNDING MEMBER RATES
              </h3>
              <p className="text-zinc-400 text-xs mt-1 font-mono">
                {currentTitle} · {currentSubtitle} · Guaranteed Rate For Your Full Term
              </p>
            </div>

            {/* Right Badge */}
            <div className="bg-[#ccf141] px-6 py-4 flex flex-col justify-center items-center md:items-end text-black min-w-[190px]">
              <span
                className="text-[11px] font-black uppercase tracking-widest leading-tight text-center md:text-right"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                FOUNDING MEMBER
              </span>
              <span
                className="text-sm font-black uppercase tracking-wider text-center md:text-right"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                100 ONLY
              </span>
            </div>
          </div>
        </motion.div>

        {/* MAIN PRICING CARD (BLACK THEME WITH WHITE TEXT AND BORDERS) */}
        <motion.div
          key={currentTitle}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full bg-[#0a0a0a] text-white border-2 border-zinc-800 rounded-b-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* CARD TOP HEADER STRIP: PROGRAM + SUBTITLE + SESSION INFO */}
          <div className="bg-black text-white px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
            <div className="flex items-baseline gap-3.5">
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
            <p className="text-xs sm:text-[13px] text-zinc-300 font-medium">
              {currentSessionInfo}
            </p>
          </div>

          {/* 4 DURATION COLUMNS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 bg-[#0a0a0a]">
            {plans.map((plan, idx) => {
              const cleanTotal =
                plan.totalPrice ||
                plan.price ||
                "";
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
                    {/* Duration Label */}
                    <span
                      className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs sm:text-[13px] mb-2 select-none"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {plan.months}
                    </span>

                    {/* Massive Bold Monthly Rate */}
                    <div
                      className="text-4xl sm:text-5xl md:text-[54px] font-black text-white tracking-tight leading-none my-1 flex items-baseline justify-center"
                      style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                    >
                      <span>₹{cleanPerMonth}</span>
                    </div>

                    {/* Subtext: A MONTH */}
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-zinc-400 mt-1 mb-3">
                      A MONTH
                    </span>

                    {/* Total Price Line with Strikethrough if discounted */}
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

                  {/* Bottom Action Badge / Button */}
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
                        className="w-full py-2.5 px-4 bg-[#ccf141] hover:bg-[#bfe635] text-black font-black uppercase tracking-wider text-xs sm:text-sm rounded-none transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-1.5 active:scale-[0.98]"
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
                        className="w-full py-2 px-4 border border-zinc-700 hover:border-[#ccf141] text-zinc-300 hover:text-white font-bold uppercase tracking-wider text-xs rounded-none transition-all duration-200 cursor-pointer active:scale-[0.98] bg-transparent"
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
                {dailyRate}
              </div>

              {/* Subtitle */}
              <span
                className="mt-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-300 uppercase select-none"
              >
                A DAY AS A FOUNDING MEMBER
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
        </motion.div>
      </div>
    );
  },
);

ChoosePlan.displayName = "ChoosePlan";

export default ChoosePlan;
