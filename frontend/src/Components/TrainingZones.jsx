import React, { useState, useEffect, useRef } from "react";

const zones = [
  {
    title: "Boxing Zone",
    img: "https://images.unsplash.com/photo-1636581563884-39569e81cbad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Hyrox Zone",
    img: "https://fcdn.thg-corporate.com/hale/Hyrox_014_9c3015a9ea.jpg",
  },
  {
    title: "Strength Zone",
    img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Recovery Zone",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
  },
 
];

const TrainingZones = ({ onBookTour }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (onBookTour) {
      onBookTour();
    } else {
      const el = document.getElementById("book-form");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollEvent = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        setScrollProgress(scrollLeft / totalScrollable);
      }
    }
  };

  // Auto sliding logic with smart pause on interaction
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const cardWidth = container.querySelector(".snap-center")?.clientWidth || 340;
          container.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScrollEvent);
      handleScrollEvent();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScrollEvent);
      }
    };
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="w-full py-24 px-4 md:px-8 max-w-[1400px] mx-auto bg-[#0a0a0a]">
      {/* CSS injection for scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="mb-10 px-2 md:px-6">
        <span className="px-4 py-2 rounded-md border border-[#d9ff00]/30 bg-[#d9ff00]/10 text-[#d9ff00] uppercase"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
            fontSize:'16px',
            fontWeight:'600',
          }}>
           TAKE A LOOK
          </span>
        <h2
          className=" text-white text-[30px] md:text-[48px] mt-9 leading-none"
          style={{
              fontFamily: '"Brutal Font", sans-serif',
              fontWeight:'700',
            }}
        >
          OUR TRAINING <span className="text-[#d9ff00]">ZONES</span>
        </h2>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex overflow-x-auto gap-4 md:gap-6 px-2 md:px-6 pb-6 snap-x snap-mandatory custom-scrollbar scroll-smooth"
      >
        {zones.map((zone, i) => (
          <div
            key={i}
            className="min-w-[280px] md:min-w-[340px] h-[400px] md:h-[500px] relative rounded-2xl overflow-hidden snap-center group border border-[#222] hover:border-[#d9ff00]/40 transition-all duration-500 shadow-xl"
          >
            <img
              src={zone.img}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              alt={zone.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"></div>
            <h3
              className="absolute bottom-8 left-8 text-3xl font-black text-white uppercase tracking-wider shadow-black drop-shadow-xl"
              style={{
                fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
              }}
            >
              {zone.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Custom Functional Scrollbar & Navigation Controls */}
      <div className="flex items-center mt-8 gap-4 w-full max-w-xl mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d9ff00] hover:border-[#d9ff00] transition-colors duration-300 bg-black/40 cursor-pointer shrink-0"
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <div className="flex-1 h-1.5 bg-gray-900 border border-gray-800 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 bg-[#d9ff00] rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(217,255,0,0.6)]"
            style={{ 
              left: `${scrollProgress * 75}%`, 
              width: '25%' 
            }}
          ></div>
        </div>
        
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#d9ff00] hover:border-[#d9ff00] transition-colors duration-300 bg-black/40 cursor-pointer shrink-0"
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Centered Button with Sliding Hover Animation */}
      <div className="flex justify-center mt-16">
        <button
          onClick={handleScroll}
          className="group relative overflow-hidden bg-[#d9ff00] text-black font-black uppercase tracking-widest px-10 py-4 rounded-xl  transition-colors shadow-[0_0_20px_rgba(217,255,0,0.2)] text-lg cursor-pointer"
          style={{
            fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
          }}
        >
          <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-xl"></span>
          <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
            BOOK YOUR FREE GYM TOUR
          </span>
        </button>
      </div>
    </section>
  );
};

export default TrainingZones;
