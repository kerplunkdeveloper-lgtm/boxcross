import React, { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import h1 from '../../assets/h1.jpeg'
import h2 from '../../assets/h2.jpeg'
import h3 from '../../assets/h3.jpeg'
import h4 from '../../assets/h4.jpeg'




const highlightImages = [
  h1, h2, h3, h4
];

const Eventhighlight = () => {
  const scrollRef = useRef(null);

  const scrollNext = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const itemWidth = scrollRef.current.children[0].offsetWidth + 16; // 16px gap
        scrollRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }
  }, []);

  const scrollPrev = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      if (scrollLeft <= 0) {
        scrollRef.current.scrollTo({
          left: scrollRef.current.scrollWidth,
          behavior: "smooth",
        });
      } else {
        const itemWidth = scrollRef.current.children[0].offsetWidth + 16;
        scrollRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      scrollNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [scrollNext]);

  return (
    <div className="w-full py-3 px-4 md:px-8">
      <div className="max-w-[1300px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          Event Highlights
        </h2>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {highlightImages.map((img, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-lg relative group/item cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Highlight ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover/item:bg-black/0 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 hover:bg-[#333] text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 hover:bg-[#333] text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `,
          }}
        />
      </div>
    </div>
  );
};

export default Eventhighlight;
