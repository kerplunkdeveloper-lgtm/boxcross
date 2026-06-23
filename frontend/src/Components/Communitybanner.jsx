import React from "react";
import crowdImg from "../assets/crowd.jpg";

const Communitybanner = () => {
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

  const handleScrollToJoin = () => {
    const element = document.getElementById("join-community-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative mt-[80px] md:mt-0 w-full h-[40vh] md:h-[80vh] flex items-center justify-center overflow-hidden mb-10">
        {/* IMAGE BACKGROUND */}
        <img
          src={crowdImg}
          alt="Community Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter grayscale-[30%] brightness-[0.7]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/55 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-[#050505] z-[2]"></div>

        {/* HUGE BACKGROUND TEXT (Outline) */}
        <div 
          data-aos="zoom-in"
          data-aos-duration="1200"
          className="absolute inset-x-0 top-10 md:top-30 flex justify-center pointer-events-none z-[5] overflow-hidden"
        >
          <span 
            className="text-transparent font-black uppercase text-[50px] md:text-[150px] whitespace-nowrap select-none tracking-widest leading-none" 
            style={{ 
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.25)",
              fontFamily: '"BrutalTypeBold", Arial, sans-serif'
            }}
          >
            COMMUNITY
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative md:mt-[90px] z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between md:gap-16 pt-20 md:pt-0">
          
          {/* LEFT SIDE: HEADING */}
          <div 
            data-aos="fade-right"
            className="flex-1 w-full flex flex-col justify-center text-center md:text-left z-10"
          >
            <h1
              className="text-white font-black mt-8 md:mt-20 uppercase leading-[0.95] tracking-tight drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]"
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              <span className="block text-[44px] sm:text-[60px] md:text-[85px] whitespace-normal md:whitespace-nowrap">
                BXC
              </span>
              <span className="block text-[44px] sm:text-[60px] md:text-[85px] whitespace-normal md:whitespace-nowrap">
                HYBRID
              </span>
              <span className="block text-[44px] sm:text-[60px] md:text-[85px] whitespace-normal md:whitespace-nowrap">
                TRIBE
              </span>
            </h1>
          </div>

          {/* RIGHT SIDE: SUBTITLE & BUTTONS */}
          <div 
            data-aos="fade-left"
            data-aos-delay="200"
            className="flex-1 w-full flex flex-col justify-center items-start md:max-w-lg z-10 text-left"
          >
            <p
              className="text-[#c9c9c9] text-base md:text-[17px] mt-[-3px] md:mt-25 leading-relaxed hidden md:block mb-5 font-bold"
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
              }}
            >
              The community that forms when serious people train together long
              enough to become something more than training partners. You train here. You belong here.
            </p>

            <div
              className="flex flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 w-full max-w-[700px] mt-4"
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: 700,
              }}
            >
              {/* JOIN THE TRIBE BUTTON */}
              <button
                onClick={handleScrollToJoin}
                className="group relative overflow-hidden px-4 py-3 md:px-8 md:py-3.5 bg-[#e5ff00] text-black uppercase tracking-wider md:tracking-[0.05em] rounded-lg transition-all duration-500 cursor-pointer flex justify-center items-center shadow-[0_0_20px_rgba(229,255,0,0.15)]"
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Join The Tribe
                </span>
              </button>

              {/* BOOK TRIAL BUTTON */}
              <button
                onClick={handleBookTrial}
                className="group relative overflow-hidden px-4 py-3 md:px-8 md:py-3.5 bg-white text-black uppercase tracking-wider md:tracking-[0.05em] rounded-lg transition-all duration-500 cursor-pointer flex justify-center items-center"
              >
                <span className="absolute inset-0 bg-[#e5ff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Book Free Trial
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Communitybanner;