import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const advantageCards = [
  {
    id: 1,
    title: "Proven Impact",
    description:
      "70% increase in engagement. 40% boost in productivity. Real results that matter.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
    alt: "High energy team celebrating corporate wellness results",
  },
  {
    id: 2,
    title: "Tailored For You",
    description:
      "Not mass-produced. Programs designed to integrate seamlessly with your company culture and schedule.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    alt: "Professional corporate woman smiling with coffee",
  },
  {
    id: 3,
    title: "Executive Stamina",
    description:
      "Peak physical and mental endurance conditioning built for modern executive performance.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop",
    alt: "Corporate leader in dark tailored suit reviewing work",
  },
  {
    id: 4,
    title: "Dynamic Engagement",
    description:
      "Inter-corporate challenges, team tournaments, and everyday energy that is truly contagious.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    alt: "Colleagues engaged in collaborative conference room meeting",
  },
  {
    id: 5,
    title: "Elite Arena Access",
    description:
      "State-of-the-art boxing rings, functional rigs, strength zones, and recovery suites.",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    alt: "Athlete curling heavy dumbbell in performance arena",
  },
  {
    id: 6,
    title: "100% Privacy & Security",
    description:
      "Enterprise HR dashboards with aggregate engagement analytics and zero individual data exposure.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    alt: "Digital lock security tablet on corporate desk",
  },
  {
    id: 7,
    title: "Seamless Digital App",
    description:
      "One-tap bookings, live streak tracking, and community challenges right inside the pocket app.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
    fallback:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    alt: "Mobile app with celebrating colleagues in background",
  },
];

const CultAdvantageSection = ({
  tagline = "WHY CHOOSE CULT FOR CORPORATES",
  titlePrimary = "THE",
  titleHighlight = "CULT",
  titleSecondary = "ADVANTAGE",
  description = "Our employee wellness programs meets your business sense",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Auto-scroll active card into view on small screens
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 1024) {
      const activeEl = scrollContainerRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : advantageCards.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < advantageCards.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-[#050505] text-white py-10 sm:py-12 lg:py-16 overflow-hidden relative select-none">
      {/* Background ambient glow behind header */}
      <div className="absolute top-6 left-1/4 w-80 h-80 bg-[#ccf141]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          {/* LEFT: SUBTITLE + STACKED ECHO TITLE */}
          <div className="relative">
            {/* Tagline */}
            <p className="text-neutral-400 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3">
              {tagline}
            </p>

            {/* STACKED "CULT" ECHO TYPOGRAPHY EFFECT */}
            <div className="relative pt-4 sm:pt-5 md:pt-6">
              {/* Ghost Echo Layer 2 (Highest, dimmest lime outline/tint) */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 flex items-baseline select-none pointer-events-none opacity-20 transition-all duration-300"
              >
                <span className="text-transparent font-black uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-none">
                  {titlePrimary}&nbsp;
                </span>
                <span className="text-[#ccf141] font-black uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-none">
                  {titleHighlight}
                </span>
              </div>

              {/* Ghost Echo Layer 1 (Middle, semi-faded) */}
              <div
                aria-hidden="true"
                className="absolute top-2 sm:top-2.5 md:top-3 left-0 flex items-baseline select-none pointer-events-none opacity-45 transition-all duration-300"
              >
                <span className="text-transparent font-black uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-none">
                  {titlePrimary}&nbsp;
                </span>
                <span className="text-[#ccf141] font-black uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-none">
                  {titleHighlight}
                </span>
              </div>

              {/* Main Heading Text */}
              <h2 className="relative z-10 font-black uppercase tracking-tight leading-[1.05] text-2xl sm:text-3xl md:text-4xl lg:text-[46px]">
                <span className="text-white">{titlePrimary}</span>{" "}
                <span className="text-[#ccf141] inline-block drop-shadow-[0_2px_18px_rgba(204,241,65,0.35)]">
                  {titleHighlight}
                </span>
                <br />
                <span className="text-white tracking-[0.03em] mt-0.5 inline-block">
                  {titleSecondary}
                </span>
              </h2>
            </div>
          </div>

          {/* RIGHT: SUBTEXT & RESPONSIVE CONTROLS */}
          <div className="flex flex-col items-start md:items-end justify-between gap-3 max-w-xs md:max-w-sm">
            <p className="text-neutral-300 text-xs sm:text-sm md:text-[15px] font-light leading-snug md:text-right">
              {description}
            </p>

            {/* Mobile / Tablet Nav Arrows */}
            <div className="flex items-center gap-2 lg:hidden pt-1">
              <button
                onClick={handlePrev}
                aria-label="Previous advantage"
                className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-[#ccf141] hover:border-[#ccf141] hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] text-neutral-400 font-mono px-1.5">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(advantageCards.length).padStart(2, "0")}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next advantage"
                className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-[#ccf141] hover:border-[#ccf141] hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE ACCORDION CONTAINER */}
        {/* ============================================================ */}
        <div
          ref={scrollContainerRef}
          className="
            flex flex-row items-stretch
            gap-2 sm:gap-2.5 lg:gap-3
            w-full
            h-[340px] sm:h-[380px] md:h-[400px] lg:h-[430px]
            overflow-x-auto lg:overflow-hidden
            snap-x snap-mandatory
            pb-3 lg:pb-0
            no-scrollbar
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {advantageCards.map((card, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={card.id}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => {
                  // Instant expansion on desktop hover
                  if (window.innerWidth >= 1024) {
                    setActiveIndex(index);
                  }
                }}
                className={`
                  relative
                  overflow-hidden
                  cursor-pointer
                  rounded-[16px] sm:rounded-[18px] lg:rounded-[20px]
                  transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                  snap-center
                  shrink-0 lg:shrink
                  ${
                    isActive
                      ? "w-[260px] xs:w-[280px] sm:w-[320px] lg:w-auto lg:flex-[3.2] border-2 border-[#ccf141] shadow-[0_0_28px_rgba(204,241,65,0.28)] z-20"
                      : "w-[65px] xs:w-[72px] sm:w-[80px] lg:w-auto lg:flex-1 border border-white/10 hover:border-white/30 z-10"
                  }
                `}
              >
                {/* CARD BACKGROUND IMAGE */}
                <img
                  src={card.image}
                  alt={card.alt}
                  onError={(e) => {
                    // Fallback to secondary image if primary fails
                    if (e.target.src !== card.fallback) {
                      e.target.src = card.fallback;
                    }
                  }}
                  className={`
                    w-full h-full object-cover
                    transition-all duration-700 ease-out
                    ${
                      isActive
                        ? "filter grayscale-0 contrast-100 brightness-100 scale-105"
                        : "filter grayscale contrast-125 brightness-[0.6] hover:brightness-[0.75] scale-100"
                    }
                  `}
                />

                {/* SLIGHT DARK TINT ON INACTIVE TO BLEND INTO BLACK */}
                <div
                  className={`
                    absolute inset-0 transition-opacity duration-500 pointer-events-none
                    ${
                      isActive
                        ? "opacity-0"
                        : "bg-black/35 hover:bg-black/15"
                    }
                  `}
                />

                {/* BOTTOM GRADIENT OVERLAY (Always visible on active for crisp readability) */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent
                    flex flex-col justify-end
                    p-4 sm:p-5 lg:p-6
                    transition-all duration-400 ease-out
                    ${
                      isActive
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                  `}
                >
                  {/* TEXT CONTENT WITH SMOOTH SLIDE-UP */}
                  <div
                    className={`
                      transition-all duration-500 ease-out transform
                      ${
                        isActive
                          ? "translate-y-0 opacity-100 delay-100"
                          : "translate-y-4 opacity-0"
                      }
                    `}
                  >
                    <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-tight mb-1.5 drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-neutral-200 text-xs sm:text-[13px] font-normal leading-relaxed max-w-sm drop-shadow">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* ACTIVE TOP MINI ACCENT BAR */}
                <div
                  className={`
                    absolute top-2.5 left-3.5 right-3.5 h-0.5 rounded-full bg-[#ccf141] transition-all duration-500
                    ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                  `}
                />
              </div>
            );
          })}
        </div>

        {/* BOTTOM DOTS INDICATOR FOR MOBILE */}
        <div className="flex items-center justify-center gap-1.5 mt-4 lg:hidden">
          {advantageCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-300 cursor-pointer
                ${
                  activeIndex === i
                    ? "w-6 bg-[#ccf141]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultAdvantageSection;

