import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

const FloatingActions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    // Initial check for modals
    if (document.body.style.overflow === "hidden") {
      setIsModalOpen(true);
    }

    // Watch for any modal locking the body scroll
    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.style.overflow === "hidden");
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (typeof window === "undefined") return null;
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login')) return null;

  return createPortal(
    <>
      {/* BACK TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-8 w-12 h-12 md:w-14 md:h-14 bg-[#e5ff00] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(222,251,2,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(222,251,2,0.5)] transition-all duration-300 z-[9999] ${
          isVisible && !isModalOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={28} strokeWidth={2.5} />
      </button>

      {/* WHATSAPP CONTACT BUTTON */}
      <a
        href="https://wa.me/918925556900"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-8 right-8 z-[9999] flex flex-row-reverse items-center group cursor-pointer transition-all duration-300 ${
          isModalOpen ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
        aria-label="Contact on WhatsApp"
      >
        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#e5ff00] text-black rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 relative z-10">
          <FaWhatsapp size={32} />
        </div>

        {/* Speech Bubble */}
        <div
          className="mr-4 relative bg-white text-[#333] px-5 py-2.5 rounded-xl shadow-xl font-medium text-[14px] md:text-[16px] whitespace-nowrap min-w-[110px] text-center transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:-translate-x-1"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <span className="block group-hover:hidden transition-all duration-300">
            WhatsApp 
          </span>
          <span className="hidden group-hover:block transition-all duration-300 text-[#25D366]">
            WhatsApp
          </span>
          {/* Triangle pointing right */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-l-[10px] border-l-white border-b-[8px] border-b-transparent"></div>
        </div>
      </a>
    </>,
    document.body
  );
};

export default FloatingActions;
