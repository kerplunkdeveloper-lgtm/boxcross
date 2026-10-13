import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Users, Star, ArrowRight, ShieldCheck } from "lucide-react";
import boxerImg from "../assets/founding30_boxer.jpg";

const Founding30Section = () => {
  const navigate = useNavigate();

  const handleClaimSpot = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const choosePlanElement =
      document.getElementById("choose-plan") ||
      document.getElementById("pricing") ||
      document.getElementById("membership-plans");

    if (choosePlanElement) {
      choosePlanElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const target =
          document.getElementById("choose-plan") ||
          document.getElementById("pricing") ||
          document.getElementById("membership-plans");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    }
  };

  return (
    <section
      id="founding-30"
      className="relative w-full bg-[#050505] text-white py-12 md:py-16 lg:py-20 overflow-hidden border-y border-zinc-900/80"
    >
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Boxer athlete image placed on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] h-full opacity-25 sm:opacity-35 lg:opacity-65 mix-blend-luminosity">
          <img
            src={boxerImg}
            alt="Box & Cross Founding Boxer"
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
          />
        </div>

        {/* Ambient Dark Gradients for high contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 lg:via-[#050505]/80 to-[#050505]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80"></div>

        {/* Subtle Neon Glow Accents */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#ccf141]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#ccf141]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Headings, Subtext & 3 Features (col-span-5) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            {/* Top Badge: FOUNDING 30 */}
            <div>
              <div className="inline-flex items-center justify-center px-4 py-1 rounded-md border border-[#ccf141] bg-black/40 backdrop-blur-sm">
                <span
                  className="text-[#ccf141] text-[11px] sm:text-[13px] font-black uppercase tracking-[0.22em]"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  FOUNDING 100
                </span>
              </div>
            </div>

            {/* Big Main Headline */}
            <div className="space-y-1">
              <h2
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black uppercase leading-[1.02] tracking-tight"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                THE FIRST 100.
              </h2>
              <h2
                className="text-[#ccf141] text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black uppercase leading-[1.02] tracking-tight drop-shadow-[0_0_25px_rgba(204,241,65,0.25)]"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                GET IN FOR ₹14,999/-
              </h2>
            </div>

            {/* Subtitle */}
            <p
              className="text-[#9ca3af] text-[11px] sm:text-[13px] uppercase tracking-[0.16em] font-bold leading-relaxed max-w-md"
              style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
            >
              BE PART OF THE FIRST MEMBERS AT BOX &amp; CROSS PERFORMANCE ARENA.
            </p>

            {/* 3 Numbered Feature Items */}
            <div className="space-y-4 pt-2">
              
              {/* Item 01 */}
              <div className="flex items-center gap-3 sm:gap-4 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#ccf141] bg-black/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(204,241,65,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <Lock size={17} className="text-[#ccf141]" />
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className="text-white text-lg sm:text-xl font-black"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    01
                  </span>
                  <div className="w-[1.5px] h-7 bg-zinc-700"></div>
                </div>
                <div className="flex flex-col">
                  <h4
                    className="text-[#ccf141] text-xs sm:text-[13px] font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    LOCK THE PRICE
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-snug">
                    Your founding membership is secured at ₹14,999.
                  </p>
                </div>
              </div>

              {/* Item 02 */}
              <div className="flex items-center gap-3 sm:gap-4 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#ccf141] bg-black/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(204,241,65,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <Users size={17} className="text-[#ccf141]" />
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className="text-white text-lg sm:text-xl font-black"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    02
                  </span>
                  <div className="w-[1.5px] h-7 bg-zinc-700"></div>
                </div>
                <div className="flex flex-col">
                  <h4
                    className="text-[#ccf141] text-xs sm:text-[13px] font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    BE THERE FROM THE START
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-snug">
                    Join the first generation of members at Box &amp; Cross Performance Arena.
                  </p>
                </div>
              </div>

              {/* Item 03 */}
              <div className="flex items-center gap-3 sm:gap-4 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#ccf141] bg-black/60 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(204,241,65,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <Star size={17} className="text-[#ccf141]" />
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className="text-white text-lg sm:text-xl font-black"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    03
                  </span>
                  <div className="w-[1.5px] h-7 bg-zinc-700"></div>
                </div>
                <div className="flex flex-col">
                  <h4
                    className="text-[#ccf141] text-xs sm:text-[13px] font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    FOUNDING STATUS
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-snug">
                    Build strength, sharpen your skills, and track your progress with coaching designed around your performance.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: The High-Contrast Pricing Card (col-span-4) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 flex justify-center py-2">
            <div
              onClick={handleClaimSpot}
              className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[28px] border-2 border-[#ccf141] bg-black/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_0_45px_rgba(204,241,65,0.18)] transition-all duration-300 hover:shadow-[0_0_65px_rgba(204,241,65,0.32)] cursor-pointer hover:scale-[1.01]"
            >
              
              {/* Header: REGULAR MEMBERSHIP */}
              <span
                className="text-zinc-400 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                REGULAR MEMBERSHIP
              </span>

              {/* Crossed-out Price: ₹25,000 */}
              <div className="relative inline-block my-1.5">
                <span
                  className="text-zinc-300 font-black text-2xl sm:text-3xl tracking-tight opacity-90"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  ₹42,000/-
                </span>
                {/* Red diagonal slash mark */}
                <div className="absolute left-[-10%] right-[-10%] top-1/2 h-[3px] bg-[#ef4444] -rotate-6 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)] pointer-events-none"></div>
              </div>

              {/* Giant Price: ₹ 14,000 */}
              <div className="my-1">
                <span
                  className="text-[#ccf141] font-black text-5xl sm:text-[62px] leading-none tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.35)]"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  ₹ 14,999
                </span>
              </div>

              {/* Label: — FOUNDING MEMBER PRICE — */}
              <div className="flex items-center justify-center gap-2 w-full my-3">
                <div className="h-[1px] bg-zinc-700 flex-1 max-w-[20px]"></div>
                <span
                  className="text-white/90 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-black whitespace-nowrap"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  FOUNDING MEMBER PRICE
                </span>
                <div className="h-[1px] bg-zinc-700 flex-1 max-w-[20px]"></div>
              </div>

              {/* Olive Green Pill Badge: SAVE ₹11,000 */}
              <div className="w-full max-w-[260px] py-2.5 px-4 rounded-xl bg-[#2a340b] border border-[#ccf141]/40 flex items-center justify-center shadow-inner my-2 hover:bg-[#34400e] transition-colors">
                <span
                  className="text-[#ccf141] font-black text-sm sm:text-base tracking-wider uppercase"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  SAVE ₹27,000
                </span>
              </div>

              {/* Spot Counter: ONLY 30 MEMBERS */}
              <div className="flex items-center justify-center gap-2 mt-4 text-[#ccf141]">
                <Users size={16} />
                <span
                  className="font-black text-xs sm:text-[13px] uppercase tracking-wider"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  ONLY 100 MEMBERS
                </span>
              </div>

              {/* Subtext: ONCE THEY'RE GONE, REGULAR PRICING BEGINS. */}
              <p
                className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold mt-1 text-center"
                style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
              >
                ONCE THEY&apos;RE GONE, REGULAR PRICING BEGINS.
              </p>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 30 SPOTS. NO MORE. + CTA (col-span-3)       */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-start justify-center space-y-6 pt-4 lg:pt-0">
            
            {/* Headline */}
            <div className="space-y-0 text-left">
              <h2
                className="text-[#ccf141] text-4xl sm:text-5xl lg:text-[62px] font-black uppercase leading-[0.95] tracking-tight drop-shadow-[0_0_20px_rgba(204,241,65,0.3)]"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                100 SPOTS.
              </h2>
              <h2
                className="text-white text-4xl sm:text-5xl lg:text-[62px] font-black uppercase leading-[0.95] tracking-tight"
                style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
              >
                NO MORE.
              </h2>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClaimSpot}
              className="group w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(204,241,65,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <span>CLAIM YOUR FOUNDING SPOT</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1.5 transition-transform duration-300 shrink-0"
              />
            </button>

            {/* Instant Trust Badge */}
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <ShieldCheck size={15} className="text-[#ccf141]" />
              <span>Direct WhatsApp &amp; In-Arena Priority Desk</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Founding30Section;
