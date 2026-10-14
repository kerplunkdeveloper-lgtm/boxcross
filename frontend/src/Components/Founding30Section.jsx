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
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] h-full opacity-15 sm:opacity-25 lg:opacity-65 mix-blend-luminosity">
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6 xl:gap-8 lg:items-stretch items-center">

          {/* ======================================================== */}
          {/* LEFT COLUMN: Headings, Subtext & 3 Features (col-span-5) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left lg:justify-between lg:h-full space-y-6 lg:space-y-0 w-full">

            {/* Top Area: Badge + Main Headline + Subtitle */}
            <div className="space-y-3 sm:space-y-4 flex flex-col items-center lg:items-start w-full">
              {/* Top Badge */}
              <div className="flex justify-center lg:justify-start w-full">
                <div className="inline-flex items-center justify-center px-3.5 py-1 sm:py-1.5 rounded-full lg:rounded-md border border-[#ccf141] bg-black/60 backdrop-blur-sm shadow-[0_0_15px_rgba(204,241,65,0.18)]">
                  <span
                    className="text-[#ccf141] text-[10px] sm:text-xs font-black uppercase tracking-[0.22em]"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {badge}
                  </span>
                </div>
              </div>

              {/* Big Main Headline */}
              <div className="space-y-1 w-full">
                <h2
                  className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black uppercase leading-[1.05] tracking-tight"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {heading1}
                </h2>
                <h2
                  className="text-[#ccf141] text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black uppercase leading-[1.05] tracking-tight drop-shadow-[0_0_25px_rgba(204,241,65,0.25)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {heading2}
                </h2>
              </div>

              {/* Subtitle */}
              <p
                className="text-zinc-400 text-[11px] sm:text-xs lg:text-[11.5px] uppercase tracking-[0.16em] font-bold leading-relaxed max-w-md mx-auto lg:mx-0"
                style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
              >
                {subtitle}
              </p>
            </div>

            {/* Bottom Area: 3 Numbered Feature Items */}
            <div className="w-full max-w-md lg:max-w-none space-y-3 sm:space-y-3.5 pt-2 sm:pt-4 lg:pt-6">
              {featureList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 lg:p-0 rounded-2xl bg-zinc-950/60 lg:bg-transparent border border-zinc-800/60 lg:border-none backdrop-blur-sm lg:backdrop-blur-none group hover:border-[#ccf141]/40 transition-all text-left"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#ccf141] bg-black/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(204,241,65,0.15)] group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <span
                      className="text-white text-base sm:text-lg lg:text-xl font-black"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {item.num}
                    </span>
                    <div className="w-[1.5px] h-6 sm:h-7 bg-zinc-700"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4
                      className="text-[#ccf141] text-xs sm:text-[13px] font-black uppercase tracking-wider truncate sm:whitespace-normal"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-zinc-400 text-[11px] sm:text-xs lg:text-[13px] leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: The High-Contrast Pricing Card (col-span-4) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 flex justify-center lg:items-stretch lg:h-full py-2 lg:py-0 w-full">
            <motion.div
              onClick={handleClaimSpot}
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 350, damping: 25 } }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full max-w-[340px] sm:max-w-[360px] lg:h-full rounded-[26px] lg:rounded-[28px] border-2 border-[#ccf141] bg-black/90 backdrop-blur-xl p-5 sm:p-7 xl:p-8 flex flex-col justify-between items-center text-center shadow-[0_0_45px_rgba(204,241,65,0.18)] transition-all duration-300 hover:shadow-[0_0_65px_rgba(204,241,65,0.32)] cursor-pointer mx-auto"
            >

              {/* Card Top: Regular price, strikethrough, giant price & label */}
              <div className="w-full flex flex-col items-center">
                {/* Header */}
                <span
                  className="text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {regularLabel}
                </span>

                {/* Crossed-out Price */}
                <div className="relative inline-block my-1 sm:my-1.5">
                  <span
                    className="text-zinc-300 font-black text-2xl sm:text-3xl tracking-tight opacity-90"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {regularPrice}
                  </span>
                  {/* Red diagonal slash mark */}
                  <div className="absolute left-[-10%] right-[-10%] top-1/2 h-[3px] bg-[#ef4444] -rotate-6 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)] pointer-events-none"></div>
                </div>

                {/* Giant Price */}
                <div className="my-0.5 sm:my-1">
                  <span
                    className="text-[#ccf141] font-black text-4xl sm:text-5xl xl:text-[62px] leading-none tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.35)]"
                    style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                  >
                    {offerPrice}
                  </span>
                </div>

                {/* Label */}
                <div className="flex items-center justify-center gap-2 w-full my-2 sm:my-3">
                  <div className="h-[1px] bg-zinc-700 flex-1 max-w-[20px]"></div>
                  <span
                    className="text-white/90 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-black whitespace-nowrap"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {priceLabel}
                  </span>
                  <div className="h-[1px] bg-zinc-700 flex-1 max-w-[20px]"></div>
                </div>
              </div>

              {/* Card Middle: Olive Green Pill Badge */}
              <div className="w-full max-w-[260px] py-2 sm:py-2.5 px-4 rounded-xl bg-[#2a340b] border border-[#ccf141]/40 flex items-center justify-center shadow-inner my-2 sm:my-3 hover:bg-[#34400e] transition-colors">
                <span
                  className="text-[#ccf141] font-black text-xs sm:text-sm md:text-base tracking-wider uppercase"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {saveAmount}
                </span>
              </div>

              {/* Card Bottom: Spot Counter & Subtext */}
              <div className="w-full flex flex-col items-center">
                {/* Spot Counter */}
                <div className="flex items-center justify-center gap-2 text-[#ccf141]">
                  <Users size={16} />
                  <span
                    className="font-black text-xs sm:text-[13px] uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {spotsText}
                  </span>
                </div>

                {/* Subtext */}
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
          {/* RIGHT COLUMN: Spots Headline + CTA (col-span-3)           */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left justify-between lg:h-full space-y-5 lg:space-y-0 pt-2 sm:pt-4 lg:pt-0 w-full">

            {/* Top Area: Headline */}
            <div className="space-y-0 text-center lg:text-left">
              <h2
                className="text-[#ccf141] text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-black uppercase leading-[0.95] tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.3)]"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                {rightColHeading1}
              </h2>
              <h2
                className="text-white text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-black uppercase leading-[0.95] tracking-tight"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                {rightColHeading2}
              </h2>
            </div>

            {/* Bottom Area: CTA Button + Trust Badge */}
            <div className="w-full flex flex-col items-center lg:items-start space-y-3 pt-2 lg:pt-6">
              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClaimSpot}
                className="group w-full max-w-[340px] sm:max-w-[360px] px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(204,241,65,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <span>{ctaButtonText}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1.5 transition-transform duration-300 shrink-0"
                />
              </motion.button>

              {/* Instant Trust Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 text-xs font-medium">
                <ShieldCheck size={15} className="text-[#ccf141] shrink-0" />
                <span className="text-center sm:text-left">{trustText}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Founding30Section;
