import React from "react";
import MembershipPlans from "../Components/Membership";
import { motion } from "framer-motion";

import WhatWeOffer from "../Components/WhatWeOffer";
import TrainingZones from "../Components/TrainingZones";
import BuildProgress from "../Components/BuildProgress";

const Membership = () => {
  const videoUrl =
    "https://res.cloudinary.com/dubheb1lh/video/upload/v1780056052/vv_nbap32.mp4";

  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col mt-[-80px] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* VIDEO */}
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#050505] z-[2]"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-10 w-full">
          {/* TOP TEXT */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="
              text-[#e5ff00]
              uppercase
              tracking-[0.4em]
              text-[10px]
              sm:text-xs
              md:text-sm
              mb-10
              mt-10
              font-bold
            "
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
            }}
          >
            PUDUCHERRY, INDIA
          </motion.p>

          {/* MAIN HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="
              uppercase
              leading-[0.88]
              tracking-[-0.01em]
        
              text-center
              drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]
       
              text-[45px]
              md:text-[72px]
            "
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "700",
            }}
          >
            <span className="block text-white">PUDUCHERRY’S COMPLETE </span>

            <span className="block">
              <span className="text-[#e5ff00]">PERFORMANCE</span>{" "}
              <span className="text-white">ARENA</span>
            </span>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="
              text-gray-200
              max-w-4xl
              text-base
              sm:text-lg
              md:text-2xl
              leading-relaxed
              mt-8
              mb-12
              px-2
            "
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontWeight: 400,
            }}
          >
            Boxing, Strength, HYROX-style Conditioning & Community — built for
            people who train with purpose.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
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
                const el = document.getElementById("book-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="
                group relative overflow-hidden
                w-[85%] sm:w-auto
                px-10 py-4
                bg-[#e5ff00] text-black
                uppercase tracking-[0.2em]
                rounded-lg
                transition-all duration-500
                cursor-pointer
              "
            >
              <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
              <span
                className="relative z-10 text-[10px] md:text-[14px]"
                style={{
                  fontFamily: '"Brutal Font Bold", sans-serif',
                  fontWeight: 800,
                }}
              >
                Book Free Gym Tour
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
                w-[85%] sm:w-auto
                px-10 py-4
                bg-white
                 text-black
                uppercase tracking-[0.2em]
                rounded-lg
                transition-all duration-500
                cursor-pointer
              "
            >
              <span className="absolute inset-0  bg-[#e5ff00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-lg"></span>
              <span className="relative z-10 font-extrabold text-[10px] md:text-[14px]">
                Membership Plans
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* MEMBERSHIP SECTION */}
      <div className="relative z-20">
        <WhatWeOffer />
        <TrainingZones />
        <BuildProgress />
        <MembershipPlans />
      </div>
    </div>
  );
};

export default Membership;
