import React from "react";
import founder from '../assets/images/founder.webp'

const FounderSection = () => {
  return (
    <section className="w-full bg-black text-white py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center lg:justify-start">

          <img
            src={founder}
            alt="Founder"
            className="w-[280px] sm:w-[350px] md:w-[420px] lg:w-[500px] object-contain"
          />

        </div>

        {/* RIGHT CONTENT */}
        <div className="text-center lg:text-left">

          {/* BADGE */}
          <div className="inline-flex items-center justify-center bg-[#d9ff00] text-black font-semibold uppercase text-xs md:text-sm px-5 py-2 rounded-xl mb-6">
            Meet The Founder
          </div>

          {/* TITLE */}
          <h2 className="text-[38px] sm:text-[52px] md:text-[68px] lg:text-[74px] font-extrabold uppercase leading-[1] tracking-[-2px]">
            Vasanth Raju
          </h2>

          {/* CONTENT */}
          <div className="mt-8 space-y-8">

            <p className="text-gray-400 text-base md:text-lg leading-[1.9] max-w-[700px] mx-auto lg:mx-0">
              We’re committed to helping you achieve your health and wellness
              goals through expert guidance, modern equipment, and a motivating
              atmosphere certified trainers design personalized programs.
            </p>

            <p className="text-gray-400 text-base md:text-lg leading-[1.9] max-w-[700px] mx-auto lg:mx-0">
              We’re committed to helping you achieve your health and wellness
              goals through expert guidance, modern equipment, and a motivating
              atmosphere certified trainers design personalized programs.
            </p>

            <p className="text-gray-400 text-base md:text-lg leading-[1.9] max-w-[700px] mx-auto lg:mx-0">
              We’re committed to helping you achieve your health and wellness
              goals through expert guidance, modern equipment, and a motivating
              atmosphere certified trainers design personalized programs.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FounderSection;