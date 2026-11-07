import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const communityCards = [
  {
    id: "clubs",
    title: "Interest-based clubs\nat every pincode",
    video:
      "https://res.cloudinary.com/dubheb1lh/video/upload/v1792585589/v5_u6m5ia.mp4",
   
   
  },
  {
    id: "events",
    title: "2000+ events\nevery month",
    video:
      "https://res.cloudinary.com/dubheb1lh/video/upload/v1792585618/v7_p4xpgo.mp4",
  
  },
  {
    id: "championships",
    title: "Unbound\nchampionships",
    video:
      "https://res.cloudinary.com/dubheb1lh/video/upload/v1792585605/v3_nowzlo.mp4",
   
  },
  {
    id: "carnival",
    title: "India's coolest\nfitness carnival",
    video:
     "https://res.cloudinary.com/dubheb1lh/video/upload/v1792585611/v4_pg6jxb.mp4",
      
    
  },
  {
    id: "energy",
    title: "Everyday energy\nis contagious",
    video:
     "https://res.cloudinary.com/dubheb1lh/video/upload/v1792585584/v2_wp3avt.mp4",
    
  },
];

const CoolestCommunitySection = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 300;
      const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-black text-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        {/* HEADER ROW */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal tracking-tight font-serif lowercase"
            style={{
              fontFamily: 'Georgia, "Playfair Display", "Times New Roman", serif',
              letterSpacing: "-0.02em",
            }}
          >
            the coolest fitness community
          </h2>

          {/* DESKTOP SCROLL CONTROLS */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "bg-white/10 hover:bg-white text-white hover:text-black cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-white/50"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                canScrollRight
                  ? "bg-white/10 hover:bg-white text-white hover:text-black cursor-pointer"
                  : "opacity-30 cursor-not-allowed text-white/50"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* HORIZONTAL CARDS CAROUSEL */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {communityCards.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative flex-shrink-0 snap-start w-[230px] sm:w-[260px] md:w-[285px] lg:w-[295px] h-[380px] sm:h-[420px] md:h-[460px] rounded-[22px] md:rounded-[26px] overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/25 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:-translate-y-1 block"
            >
              {/* VIDEO BACKGROUND */}
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={item.poster}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              >
                <source src={item.video} type="video/mp4" />
              </video>

              {/* BOTTOM GRADIENT SCRIM (exact to reference) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-35% to-transparent pointer-events-none" />

              {/* CARD TEXT AT BOTTOM */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10">
                <p
                  className="text-white text-[15px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.28] tracking-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] whitespace-pre-line"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoolestCommunitySection;

