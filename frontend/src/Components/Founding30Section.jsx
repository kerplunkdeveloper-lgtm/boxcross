import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Users, Star, ArrowRight, ShieldCheck } from "lucide-react";
import boxerImg from "../assets/founding30_boxer.jpg";

const Founding30Section = ({
  badge = "MEMBERS OFFER 100",
  heading1 = "THE FIRST 100.",
  heading2 = "GET IN FOR ₹14,999/-",
  subtitle = "BE PART OF THE FIRST MEMBERS AT BOX & CROSS PERFORMANCE ARENA.",
  features,
  regularLabel = "REGULAR MEMBERSHIP",
  regularPrice = "₹42,000/-",
  offerPrice = "₹ 14,999",
  priceLabel = "FOUNDING MEMBER PRICE",
  saveAmount = "SAVE ₹27,000",
  spotsText = "ONLY 100 MEMBERS",
  disclaimer = "ONCE THEY'RE GONE, REGULAR PRICING BEGINS.",
  rightColHeading1 = "100 SPOTS.",
  rightColHeading2 = "NO MORE.",
  ctaButtonText = "CLAIM YOUR FOUNDING SPOT",
  trustText = "Direct WhatsApp & In-Arena Priority Desk",
  onCtaClick,
  targetSectionId,
}) => {
  const navigate = useNavigate();

  const defaultFeatures = [
    {
      num: "01",
      icon: <Lock size={17} className="text-[#ccf141]" />,
      title: "LOCK THE PRICE",
      desc: "Your founding membership is secured at ₹14,999.",
    },
    {
      num: "02",
      icon: <Users size={17} className="text-[#ccf141]" />,
      title: "BE THERE FROM THE START",
      desc: "Join the first generation of members at Box & Cross Performance Arena.",
    },
    {
      num: "03",
      icon: <Star size={17} className="text-[#ccf141]" />,
      title: "FOUNDING STATUS",
      desc: "Build strength, sharpen your skills, and track your progress with coaching designed around your performance.",
    },
  ];

  const featureList = features && features.length > 0 ? features : defaultFeatures;

  const handleClaimSpot = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof onCtaClick === "function") {
      onCtaClick();
      return;
    }

    const scrollToTwelveMonthCard = () => {
      // Ensure ChoosePlan selects the 12-month plan index
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("select-twelve-month-plan"));
      }

      // Priority: 12-month card, then targetSectionId, then section fallbacks
      const targetCard =
        document.getElementById("twelve-month-card") ||
        document.querySelector('[data-twelve-month="true"]') ||
        (targetSectionId ? document.getElementById(targetSectionId) : null) ||
        document.getElementById("choose-plan") ||
        document.getElementById("pricing") ||
        document.getElementById("membership-plans");

      if (targetCard) {
        const isMobile =
          typeof window !== "undefined" && window.innerWidth < 768;

        if (isMobile) {
          // Precise smooth scroll on mobile to center the 12-month card on screen
          const rect = targetCard.getBoundingClientRect();
          const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          const targetY =
            currentScroll + rect.top + rect.height / 2 - window.innerHeight / 2;

          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth",
          });
        } else {
          targetCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        // Add a premium glowing pulse animation on the 12-month card for instant visual feedback
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

        return true;
      }
      return false;
    };

    if (!scrollToTwelveMonthCard()) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const destination = currentPath.includes("founder")
        ? "/founder-members-offers"
        : "/membership";
      navigate(destination);
      setTimeout(() => {
        scrollToTwelveMonthCard();
      }, 350);
    }
  };

  return (
    <section
      id="founding-30"
      className="relative w-full bg-[#050505] text-white py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden border-y border-zinc-900/80"
    >
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Boxer athlete image placed on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] h-full opacity-30 sm:opacity-40 lg:opacity-65 mix-blend-luminosity">
          <img
            src={boxerImg}
            alt="Box & Cross Founding Boxer"
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
          />
        </div>

        {/* Ambient Dark Gradients for high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#050505] via-[#050505]/95 lg:via-[#050505]/80 to-[#050505]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/85"></div>

        {/* Subtle Neon Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* ======================================================== */}
        {/* MOBILE-ONLY HEADER: Clean, punchy & compact (lg:hidden) */}
        {/* ======================================================== */}
        <div className="lg:hidden flex flex-col items-center text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ccf141]/40 bg-[#ccf141]/10 backdrop-blur-md shadow-sm mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] shadow-[0_0_6px_#ccf141] animate-pulse" />
            <span
              className="text-[#ccf141] text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              {badge}
            </span>
          </div>
          <h2
            className="text-white text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight"
            style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
          >
            {heading1}{" "}
            <span className="text-[#ccf141] drop-shadow-[0_0_15px_rgba(204,241,65,0.3)]">
              {heading2}
            </span>
          </h2>
          <p
            className="text-zinc-400 text-[11px] sm:text-xs uppercase tracking-[0.12em] font-semibold mt-1.5 max-w-xs sm:max-w-sm"
            style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
          >
            {subtitle}
          </p>
        </div>

        {/* ======================================================== */}
        {/* MAIN GRID: Mobile stacks cleanly; Desktop has 3 columns */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-6 xl:gap-8 items-stretch">

          {/* ======================================================== */}
          {/* COLUMN 1 (Desktop: Left | Mobile: Concise perks below)   */}
          {/* ======================================================== */}
          <div className="order-last lg:order-first flex flex-col justify-between h-full w-full space-y-4 lg:space-y-0 text-center lg:text-left items-center lg:items-start">

            {/* Desktop-only Top Area: Badge + Big Headlines + Subtitle */}
            <div className="hidden lg:flex space-y-3 sm:space-y-3.5 flex-col items-start w-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ccf141]/40 bg-[#ccf141]/10 backdrop-blur-md shadow-[0_0_15px_rgba(204,241,65,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] shadow-[0_0_6px_#ccf141] animate-pulse" />
                <span
                  className="text-[#ccf141] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {badge}
                </span>
              </div>

              <div className="space-y-1 w-full">
                <h2
                  className="text-white text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-black uppercase leading-[1.05] tracking-tight"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {heading1}
                </h2>
                <h2
                  className="text-[#ccf141] text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.25)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {heading2}
                </h2>
              </div>

              <p
                className="text-zinc-400 text-xs lg:text-[12px] uppercase tracking-[0.14em] font-semibold leading-relaxed max-w-md"
                style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
              >
                {subtitle}
              </p>
            </div>

            {/* Feature Perks: On Mobile concise 1-line chips; on Desktop rich cards */}
            <div className="w-full space-y-2 sm:space-y-2.5 lg:space-y-3 pt-1 lg:pt-6">
              {featureList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 lg:p-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-sm group hover:border-[#ccf141]/40 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl border border-[#ccf141]/50 bg-black/70 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(204,241,65,0.12)] group-hover:scale-105 group-hover:border-[#ccf141] transition-all duration-300">
                    <div className="scale-85 sm:scale-90 lg:scale-100 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span
                      className="text-white text-sm sm:text-base lg:text-lg font-black"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {item.num}
                    </span>
                    <div className="w-[1px] h-5 sm:h-6 bg-zinc-700/80"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4
                      className="text-[#ccf141] text-[11px] sm:text-xs lg:text-[12.5px] font-black uppercase tracking-wider truncate"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {item.title}
                    </h4>
                    {/* On mobile, keep description concise and punchy */}
                    <p className="text-zinc-400 text-[10px] sm:text-[11px] lg:text-xs leading-snug line-clamp-1 lg:line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2 (Center: High-Contrast Pricing Card)            */}
          {/* ======================================================== */}
          <div className="order-first lg:order-none flex justify-center items-center lg:items-stretch h-full w-full py-1 lg:py-0">
            <motion.div
              onClick={handleClaimSpot}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 25 } }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-[360px] lg:max-w-none rounded-[24px] sm:rounded-[28px] border-2 border-[#ccf141] bg-gradient-to-b from-[#111114]/95 via-black/95 to-black/95 backdrop-blur-xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between items-center text-center shadow-[0_0_40px_rgba(204,241,65,0.22)] hover:shadow-[0_0_60px_rgba(204,241,65,0.35)] transition-all duration-300 cursor-pointer mx-auto"
            >

              {/* Card Top: Regular price, strikethrough, giant price & label */}
              <div className="w-full flex flex-col items-center">
                {/* Header Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span>{regularLabel}</span>
                </div>

                {/* Crossed-out Price */}
                <div className="relative inline-block my-1 sm:my-1.5">
                  <span
                    className="text-zinc-400 font-black text-xl sm:text-2xl lg:text-3xl tracking-tight opacity-80"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {regularPrice}
                  </span>
                  {/* Red diagonal slash mark */}
                  <div className="absolute left-[-12%] right-[-12%] top-1/2 h-[2.5px] sm:h-[3px] bg-[#ef4444] -rotate-6 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)] pointer-events-none"></div>
                </div>

                {/* Giant Offer Price */}
                <div className="my-0.5 sm:my-1">
                  <span
                    className="text-[#ccf141] font-black text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px] leading-none tracking-tight drop-shadow-[0_0_25px_rgba(204,241,65,0.35)]"
                    style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                  >
                    {offerPrice}
                  </span>
                </div>

                {/* Label */}
                <div className="flex items-center justify-center gap-2 w-full my-1.5 sm:my-2.5">
                  <div className="h-[1px] bg-zinc-800 flex-1"></div>
                  <span
                    className="text-white/90 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.18em] font-black whitespace-nowrap"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {priceLabel}
                  </span>
                  <div className="h-[1px] bg-zinc-800 flex-1"></div>
                </div>
              </div>

              {/* Card Middle: Olive Green Savings Pill Badge */}
              <div className="w-full max-w-[260px] py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-[#2a340b]/90 border border-[#ccf141]/50 flex items-center justify-center shadow-inner my-2 sm:my-2.5 hover:bg-[#34400e] transition-colors">
                <span
                  className="text-[#ccf141] font-black text-xs sm:text-sm tracking-wider uppercase"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {saveAmount}
                </span>
              </div>

              {/* Mobile-Only Progress Bar & Urgency inside card */}
              <div className="w-full lg:hidden my-2 pt-2 border-t border-zinc-800/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-pulse" />
                    {spotsText}
                  </span>
                  <span className="text-[#ccf141] font-mono font-bold">82% Claimed</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                  <div className="bg-gradient-to-r from-[#ccf141]/80 to-[#ccf141] h-full rounded-full w-[82%] shadow-[0_0_8px_#ccf141]" />
                </div>
              </div>

              {/* Mobile-Only Direct Action Button right inside the card */}
              <div className="w-full lg:hidden pt-2">
                <button
                  type="button"
                  onClick={handleClaimSpot}
                  className="w-full py-3 px-5 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(204,241,65,0.4)] transition-all cursor-pointer active:scale-95"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>{ctaButtonText}</span>
                  <ArrowRight size={15} />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-[10px] mt-2 font-medium">
                  <ShieldCheck size={13} className="text-[#ccf141] shrink-0" />
                  <span>{trustText}</span>
                </div>
              </div>

              {/* Desktop Card Bottom: Spot Counter & Subtext */}
              <div className="hidden lg:flex w-full flex-col items-center pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-center gap-2 text-[#ccf141]">
                  <Users size={15} />
                  <span
                    className="font-black text-xs sm:text-[13px] uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {spotsText}
                  </span>
                </div>
                <p
                  className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold mt-1 text-center"
                  style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
                >
                  {disclaimer}
                </p>
              </div>

            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 3 (Desktop Only: Spots Headline + Status + CTA)   */}
          {/* (Hidden on mobile to eliminate bloat & repetition)      */}
          {/* ======================================================== */}
          <div className="hidden lg:flex flex-col justify-between h-full w-full space-y-6 text-left items-start pt-0">

            {/* Top Area: Urgency Badge + Big Headline + Subtext */}
            <div className="space-y-3 sm:space-y-3.5 flex flex-col items-start w-full">
              {/* Urgency Badge (perfectly aligned with Left column badge) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-ping" />
                <span
                  className="text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  STRICT ALLOCATION CAP
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-0">
                <h2
                  className="text-[#ccf141] text-3xl sm:text-4xl lg:text-[38px] xl:text-[46px] font-black uppercase leading-[0.95] tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.3)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {rightColHeading1}
                </h2>
                <h2
                  className="text-white text-3xl sm:text-4xl lg:text-[38px] xl:text-[46px] font-black uppercase leading-[0.95] tracking-tight"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {rightColHeading2}
                </h2>
              </div>

              <p
                className="text-zinc-400 text-xs lg:text-[12px] uppercase tracking-[0.14em] font-semibold leading-relaxed max-w-md mt-2"
                style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
              >
                Strictly limited to the first 100 members. Once all allocations are locked, regular pricing resumes immediately.
              </p>
            </div>

            {/* Middle: Live Tier Allocation Card */}
            <div className="w-full rounded-2xl bg-black/60 border border-zinc-800/80 backdrop-blur-md p-3.5 sm:p-4 my-2 lg:my-0 space-y-2.5 shadow-lg text-left">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ccf141] animate-pulse" />
                  Live Allocation Status
                </span>
                <span className="text-[#ccf141] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider">
                  TIER 1 ACTIVE
                </span>
              </div>
              {/* Visual Progress Bar */}
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                <div className="bg-gradient-to-r from-[#ccf141]/80 to-[#ccf141] h-full rounded-full w-[82%] shadow-[0_0_10px_#ccf141]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                <span>82% Claimed</span>
                <span className="text-zinc-300 font-semibold">Limited Spots Remaining</span>
              </div>
            </div>

            {/* Bottom Area: CTA Button + Trust Badge */}
            <div className="w-full flex flex-col items-start space-y-2.5 pt-0">
              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaimSpot}
                className="group w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(204,241,65,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <span>{ctaButtonText}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1.5 transition-transform duration-300 shrink-0"
                />
              </motion.button>

              {/* Instant Trust Badge */}
              <div className="flex items-center justify-start gap-2 text-zinc-400 text-xs font-medium">
                <ShieldCheck size={15} className="text-[#ccf141] shrink-0" />
                <span className="text-left">{trustText}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Founding30Section;
