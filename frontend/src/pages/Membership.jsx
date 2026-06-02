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
    <div className="w-full bg-[#050505]  flex flex-col  overflow-hidden mt-[-80px]">
      {/* HERO SECTION */}
      <section className="relative w-full h-[80vh]   flex items-center justify-center overflow-hidden mb-10">
        {/* IMAGE BACKGROUND */}
        <img
          src={bannerImg}
          alt="Membership Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter grayscale-[50%]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#050505] z-[2]"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-start md:items-center justify-center text-left md:text-center px-4 sm:px-6 md:px-10 w-full h-full">
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
            className="flex flex-col items-start md:items-center w-full"
          >
            {/* MAIN HEADING */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="
                uppercase
                leading-[1.2] md:leading-[1]
                tracking-[-0.01em]
                text-left md:text-center
                drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]
                w-full
              "
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: "700",
              }}
            >
              <span
                className="block  text-transparent font-black uppercase text-[55px]  md:text-[80px] tracking-tight mb-3 whitespace-normal md:whitespace-nowrap"
                style={{
                  WebkitTextStroke: "0.2px #fff",
                  filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))",
                  fontFamily: '"BrutalTypeBold", Impact, sans-serif',
                }}
              >
                BXC <br className="block md:hidden" /> MEMBERSHIP PLANS
              </span>

              <span
                className="text-[#e5ff00] font-bold text-md  md:text-xl  md:mt-10 block "
                style={{
                  fontFamily: '"Brutal Font Light", sans-serif',
                }}
              >
                Train with Purpose. Transform with Confidence.
              </span>
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="
                text-gray-200
                max-w-3xl
                text-md
              
                md:text-xl
                leading-relaxed
                mt-6
                mb-10
                px-2
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

            {/* BUTTONS */}
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
                justify-start md:justify-center
                gap-3 sm:gap-4
                w-full
                sm:w-auto
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
                  px-3 py-3.5 sm:px-8 sm:py-4 md:px-10
                  bg-[#e5ff00] text-black
                  uppercase tracking-[0.05em] sm:tracking-[0.15em] md:tracking-[0.2em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center
                "
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 text-[10px] sm:text-[13px] md:text-[14px] whitespace-nowrap"
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
                  px-3 py-3.5 sm:px-8 sm:py-4 md:px-10
                  bg-white
                  text-black
                  uppercase tracking-[0.05em] sm:tracking-[0.15em] md:tracking-[0.2em]
                  rounded-lg
                  transition-all duration-500
                  cursor-pointer
                  flex justify-center
                "
              >
                <span className="absolute inset-0 bg-[#e5ff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
                <span
                  className="relative z-10 font-bold text-[10px] sm:text-[13px] md:text-[14px] whitespace-nowrap"
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
