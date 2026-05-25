import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 md:bottom-10 md:right-10 z-[100] p-4 rounded-full bg-[#a3ff00] text-black shadow-[0_0_20px_rgba(163,255,0,0.5)] transition-all duration-700 ease-in-out hover:scale-110 hover:bg-[#8ee000] hover:shadow-[0_0_30px_rgba(163,255,0,0.8)] group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      {/* Outer pulsing ring for aesthetic effect */}
      <div className="absolute inset-0 rounded-full border-2 border-[#a3ff00] animate-ping opacity-60"></div>
      
      {/* Inner icon container */}
      <div className="relative z-10 flex items-center justify-center">
        <svg 
          className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </button>
  );
};

export default BackToTopButton;
