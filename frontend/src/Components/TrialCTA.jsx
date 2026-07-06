import React from "react";

const TrialCTA = () => {
  const handleBookTrial = () => {
    if (window.location.pathname === "/") {
      const element = document.getElementById("book-your-free-gym-tour");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToBookForm", "true");
      window.location.href = "/#book-your-free-gym-tour";
    }
  };

  const handleWhatsappJoin = () => {
    window.open("https://wa.me/918925556900", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden  bg-[#E5FF00] flex flex-col justify-center items-center py-20 lg:py-32">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        <h1 
          className="select-none text-[18vw] font-black uppercase tracking-tight text-black/[0.04] leading-none"
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
        >
          TRIBE
        </h1>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Small Heading */}
        <p className="mb-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.45em] text-black/60">
          THE TRIBE IS ALREADY TRAINING
        </p>

        {/* Main Heading */}
        <h1 
          className="mx-auto max-w-4xl text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-black"
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
        >
          YOUR FIRST
          <br />
          SESSION.
          <br />
          FREE.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed text-black/70">
          Not ready to commit? Join the WhatsApp community first. When you are ready – we will be here.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button 
            onClick={handleBookTrial}
            className="group flex h-12 w-full sm:w-auto min-w-[220px] items-center justify-center bg-black px-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#E5FF00] transition-all duration-350 hover:bg-black/90 active:scale-95 cursor-pointer rounded-none"
          >
            <span>BOOK FREE TRIAL</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>

          <button 
            onClick={handleWhatsappJoin}
            className="group flex h-12 w-full sm:w-auto min-w-[220px] items-center justify-center border border-black px-8 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all duration-350 hover:bg-black hover:text-[#E5FF00] active:scale-95 cursor-pointer rounded-none"
          >
            <span>JOIN WHATSAPP</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              —
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrialCTA;