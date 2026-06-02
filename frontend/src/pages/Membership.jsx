import React from "react";
import MembershipPlans from "../Components/Membership";
import { motion } from "framer-motion";
import bannerImg from "../assets/banner.png";
import WhatWeOffer from "../Components/WhatWeOffer";
import TrainingZones from "../Components/TrainingZones";
// import BuildProgress from "../Components/BuildProgress";
import BookForm from "../Components/BookForm";
import Founding from "../Components/Founding";

const Membership = () => {
  return (
    <div className="w-full bg-[#050505]  flex flex-col  overflow-hidden ">
      {/* HERO SECTION */}
      <section className="relative mt-[80px] md:mt-0 w-full h-[50vh] md:h-[80vh]   flex items-center justify-center overflow-hidden mb-10">
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 },
              },
            }}
            className="flex-1 w-full flex flex-col justify-center text-left z-10"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
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
            </motion.h1>
          </motion.div>

          {/* RIGHT SIDE: SUBTITLE & BUTTONS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.4 },
              },
            }}
            className="flex-1 w-full flex flex-col justify-center items-start md:max-w-lg z-10"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="
                text-gray-200
                text-sm
                md:text-[20px]
                mt-[-3px] md:mt-25
                leading-relaxed
                mb-8
              "
              style={{
                fontFamily: '"Brutal Font Light", sans-serif',
                fontWeight: 700,
              }}
            >
              At BXC, every plan is designed to give you access to our premium
              performance arena, structured coaching, and the BXC community.
              Choose the plan that suits your goals and timeline.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="
                flex
                flex-row
                items-center
                justify-start
                gap-3 sm:gap-4
                w-full
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
                  flex-1 sm:flex-none
                  w-full sm:w-auto
                  px-3 py-3.5 sm:px-8 sm:py-4 md:px-8 lg:px-10
                  bg-[#e5ff00] text-black
                  uppercase tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.15em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center
                  shadow-[0_0_20px_rgba(229,255,0,0.15)]
                "
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[10px] sm:text-[12px] md:text-[13px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Prices and Plans
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
                  flex-1 sm:flex-none
                  w-full sm:w-auto
                  px-3 py-3.5 sm:px-8 sm:py-4 md:px-8 lg:px-10
                  bg-white
                  text-black
                  uppercase tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.15em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center
                "
              >
                <span className="absolute inset-0 bg-[#e5ff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 font-bold text-[10px] sm:text-[12px] md:text-[13px] whitespace-nowrap"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Membership Plans
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MEMBERSHIP SECTION */}
      <div className="relative z-20">
        <Founding />
        <WhatWeOffer />
        <TrainingZones />
        {/* <BuildProgress /> */}
        <BookForm />
        <MembershipPlans />
      </div>
    </div>
  );
};

export default Membership;
