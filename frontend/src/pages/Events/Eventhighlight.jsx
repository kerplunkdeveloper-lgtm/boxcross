import React, { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import h1 from '../../assets/images/e1.jpg'
import h2 from '../../assets/images/e2.jpg'
import h3 from '../../assets/images/e3.jpg'
import h4 from '../../assets/images/e4.jpg'
import h5 from '../../assets/images/e5.jpg'
import h6 from '../../assets/images/e6.jpg'
import h7 from '../../assets/images/e7.jpg'
import h8 from '../../assets/images/e8.jpg'
import h9 from '../../assets/images/e9.jpg'
import h10 from '../../assets/images/e10.jpg'
import h11 from '../../assets/images/e11.jpg'
import h12 from '../../assets/images/e12.jpg'
import h13 from '../../assets/images/e13.jpg'
import h14 from '../../assets/images/e14.jpg'
import h15 from '../../assets/images/e15.jpg'
import h16 from '../../assets/images/e16.jpg'
import h17 from '../../assets/images/e17.jpg'
import h18 from '../../assets/images/e18.jpg'
import h19 from '../../assets/images/e19.jpg'
import h20 from '../../assets/images/e20.jpg'








const highlightImages = [
  h1, h2, h3, h4,h5,h6,h7,h8,h9,h10,h11,h12,h13,h14,h15,h16,h17,h18,h19,h20
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
      <div className="max-w-8xl mx-auto">
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
                className="snap-center shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] h-[400px] md:h-[500px] rounded-md overflow-hidden shadow-lg relative group/item cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Highlight ${index + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/item:scale-110"
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
