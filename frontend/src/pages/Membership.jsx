import React, { useEffect } from "react";
import MembershipPlans from "../Components/Membership";
import AOS from "aos";
import "aos/dist/aos.css";
import bannerImg from "../assets/banner.png";
import WhatWeOffer from "../Components/WhatWeOffer";
import TrainingZones from "../Components/TrainingZones";
// import BuildProgress from "../Components/BuildProgress";
import BookForm from "../Components/BookForm";
import Founding from "../Components/Founding";
import Foot from "../Components/Foot";
import GymMarquee from "../Components/GymMarquee";

const Membership = () => {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ duration: 1000, once: true });
      AOS.refresh();
    };

    if (window.isPreloaderDone) {
      initAOS();
    } else {
      window.addEventListener("preloaderComplete", initAOS);
      return () => window.removeEventListener("preloaderComplete", initAOS);
    }
  }, []);

  return (
    <div className="w-full bg-[#050505]  flex flex-col  overflow-hidden ">
      {/* HERO SECTION */}
      <section className="relative mt-[80px] md:mt-0 w-full h-[50vh] md:h-screen   flex items-center justify-center overflow-hidden mb-10">
        {/* IMAGE BACKGROUND */}
        <img
          src={bannerImg}
          alt="Membership Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter grayscale-[50%]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#050505] z-[2]"></div>

        {/* HUGE BACKGROUND TEXT (Outline) */}
        <div className="absolute inset-x-0 top-10 md:top-30  flex justify-center pointer-events-none z-[5] overflow-hidden">
          <span 
            className="text-transparent font-black uppercase text-[50px] md:text-[150px] whitespace-nowrap select-none tracking-widest leading-none" 
            style={{ 
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.25)",
              fontFamily: '"BrutalTypeBold", Arial, sans-serif'
            }}
          >
            MEMBERSHIP
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative md:mt-[90px] z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between  md:gap-16 pt-20 md:pt-0">
          
          {/* LEFT SIDE: HEADING */}
          <div
            data-aos="fade-right"
            className="flex-1 w-full flex flex-col justify-center text-left z-10"
          >
            <h1
              className="
                text-white
                font-black
                
                uppercase
                leading-[0.95]
                tracking-tight
                drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]
              "
              style={{
                fontFamily: '"BrutalTypeBold", Impact, sans-serif',
              }}
            >
              <span className="block text-[44px] sm:text-[60px] md:text-[90px]   whitespace-normal md:whitespace-nowrap">
                BXC
              </span>
              <span className="block text-[44px] sm:text-[60px] md:text-[90px]  whitespace-normal md:whitespace-nowrap">
                MEMBERSHIP
              </span>
              <span className="block text-[44px] sm:text-[60px] md:text-[90px]  whitespace-normal md:whitespace-nowrap">
                PLANS
              </span>
            </h1>
          </div>

          {/* RIGHT SIDE: SUBTITLE & BUTTONS */}
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="flex-1 w-full flex flex-col justify-center items-start md:max-w-lg z-10"
          >
            <p
              className="
                text-[#c9c9c9]
                text-base md:text-[17px]
                mt-[-3px] md:mt-25
                leading-relaxed
                mb-5
              "
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
                fontWeight: 700,
              }}
            >
              At BXC, every plan is designed to give you access to our premium
              performance arena, structured coaching, and the BXC community.
              Choose the plan that suits your goals and timeline.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="
                flex
                flex-row
                items-center
                justify-start
                gap-3 sm:gap-4
                w-full
                max-w-[700px]
              "
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: 700,
              }}
            >
              <button
                onClick={() => {
                  const el = document.getElementById("book-your-free-gym-tour");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-[#e5ff00] text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center items-center
                  shadow-[0_0_20px_rgba(229,255,0,0.15)]
                "
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Book Your Free Gym Tour
                </span>
              </button>

              {/* PLANS BUTTON */}
              <button
                onClick={() => {
                  const el = document.getElementById("membership-plans");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  group relative overflow-hidden
                  px-4 py-3 md:px-8 md:py-3.5
                  bg-white
                  text-black
                  uppercase tracking-wider md:tracking-[0.05em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center items-center
                "
              >
                <span className="absolute inset-0 bg-[#e5ff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[11px] sm:text-[13px] md:text-[15px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Membership Plans
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP SECTION */}
      <div className="relative z-20">
        <div data-aos="fade-up">
          <Founding />
        </div>
      
        {/* <BuildProgress /> */}
        <div data-aos="fade-up" data-aos-delay="100">
          <BookForm />
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <MembershipPlans />
        </div>

          <div data-aos="fade-up" data-aos-delay="100">
          <WhatWeOffer />
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <TrainingZones />
        </div>
      </div>
       <Foot  />
      <GymMarquee  />
    </div>
  );
};

export default Membership;
