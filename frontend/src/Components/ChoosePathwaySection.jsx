import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import CoinIcon from "./CoinIcon";
import membershipCoreImg from "../assets/membership_core.png";
import membershipAthleteImg from "../assets/membership_athlete.png";
import membershipArenaImg from "../assets/membership_arena.png";

const pathwayCards = [
  {
    id: "core",
    title: "CORE",
    tag: "1 PATHWAY",
    coin: "bronze",
    image: membershipCoreImg,
    description: "Focused training in one chosen discipline.",
    path: "/membership/core",
    isFeatured: false,
  },
  {
    id: "athlete",
    title: "ATHLETE",
    tag: "2 PATHWAYS",
    coin: "silver",
    image: membershipAthleteImg,
    description: "Hybrid training across two performance disciplines.",
    path: "/membership/athlete",
    isFeatured: true,
  },
  {
    id: "arena",
    title: "ARENA",
    tag: "ALL ACCESS",
    coin: "gold",
    image: membershipArenaImg,
    description: "Unrestricted access across all performance pathways.",
    path: "/membership/arena",
    isFeatured: false,
  },
];

const ChoosePathwaySection = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

      // Calculate active index on mobile slider
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(index, 0), pathwayCards.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const scrollAmount = direction === "left" ? -itemWidth : itemWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 300;
      scrollRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-[#050814] text-white py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* BACKGROUND AMBIENT GLOW */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(28,45,86,0.5),rgba(5,8,20,0.95)_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2
              className="text-white text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Choose your pathway
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-normal mt-1.5 sm:mt-2 tracking-normal">
              for all your performance needs
            </p>
          </div>

          {/* MOBILE SLIDER CONTROLS (ARROWS) */}
          <div className="flex md:hidden items-center gap-2 mt-4 sm:mt-0 self-end">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous pathway"
              className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-white/10 hover:bg-white text-white hover:text-black active:scale-95 cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-white/40"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next pathway"
              className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-white/10 hover:bg-white text-white hover:text-black active:scale-95 cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-white/40"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ================= CARDS CONTAINER ================= */}
        {/* Mobile: Horizontal scrollable slider with snap */}
        {/* Desktop (md & above): Exact 3x2 grid from reference image */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 pt-1 snap-x snap-mandatory md:snap-none -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {pathwayCards.map((card) => {
            return (
              <Link
                key={card.id}
                to={card.path}
                style={{
                  background:
                    "linear-gradient(135deg, #292A2E 0%, #1C1C22 35%, #101119 70%, #0D0E17 100%)",
                }}
                className={`group relative shrink-0 snap-center w-[84vw] sm:w-[360px] md:w-auto rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  card.isFeatured
                    ? "border-2 border-[#bbf421] shadow-[0_0_28px_rgba(187,244,33,0.3)] hover:shadow-[0_0_38px_rgba(187,244,33,0.45)] hover:-translate-y-1"
                    : "border border-white/10 hover:border-white/25 hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                }`}
              >
                {/* TOP ROW: TAG & CIRCULAR ARROW BUTTON */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors font-sans">
                    {card.tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300">
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>

                {/* MIDDLE ROW: BADGE IMAGE OR (3D METALLIC COIN + DIVIDER + TITLE) */}
                <div className="flex items-center min-h-[56px] mb-3">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-12 sm:h-13 md:h-14 w-auto max-w-[220px] sm:max-w-[240px] object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <>
                      <CoinIcon type={card.coin} className="w-13 h-13 sm:w-14 sm:h-14 shrink-0" />
                      <div className="h-10 w-[1px] bg-white/15 mx-4 shrink-0" />
                      <h3
                        className={`text-xl sm:text-2xl font-black uppercase tracking-wider transition-colors ${
                          card.isFeatured
                            ? "text-[#bbf421]"
                            : "text-white group-hover:text-[#bbf421]"
                        }`}
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {card.title}
                      </h3>
                    </>
                  )}
                </div>

                {/* DESCRIPTION */}
                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed mb-4 min-h-[38px] font-normal">
                  {card.description}
                </p>

                {/* DOTTED DIVIDER LINE */}
                <div className="w-full border-b border-dotted border-white/15 mb-4" />

                {/* BOTTOM ROW: "KNOW MORE" BUTTON */}
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 rounded-lg bg-white text-[#e05638] font-black text-[10.5px] sm:text-[11px] tracking-wider uppercase shadow-md group-hover:bg-neutral-100 group-hover:shadow-lg transition-all active:scale-95">
                    KNOW MORE
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE SLIDER DOT INDICATORS */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          {pathwayCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-7 bg-[#bbf421]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChoosePathwaySection;
