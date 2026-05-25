import React from "react";
import brand from "../assets/images/brandstory.png";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden mt-[-50px] flex items-center">

      {/* Background Image */}
      <img
        src={brand}
        alt="Brand Story"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-5 md:px-10 lg:px-20">

        {/* Big Stroke Text */}
        <h1 className="text-[30px] sm:text-[50px] md:text-[90px] lg:text-[120px] font-extrabold uppercase text-transparent stroke-text leading-none">
          Fitness Center
        </h1>

        {/* Bottom Grid */}
       

<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-10 justify-items-center md:justify-items-start">

  {/* LEFT */}
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    <h2 className="text-white text-3xl md:text-7xl font-bold uppercase leading-tight max-w-[600px]">
      Pondicherry’s Premier Performance Arena
    </h2>
  </motion.div>

  {/* RIGHT */}
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, delay: 0.2 }}
    viewport={{ once: true }}
    className="flex flex-col gap-8 md:mt-20 md:items-end"
  >

    <p className="text-gray-300 text-base md:text-md leading-[1.8] max-w-[400px]">
      We are dedicated to building strength, improving performance,
      and creating lasting results in a motivating environment.
    </p>

    <button className="bg-[#d9ff00] text-black uppercase font-bold px-8 py-4 rounded-xl w-fit hover:bg-lime-300 transition-all duration-300">
      Enter The Arena
    </button>

  </motion.div>

</div>




      </div>

      {/* Stroke Style */}
      <style>
        {`
          .stroke-text {
            -webkit-text-stroke: 2px rgba(255,255,255,0.25);
          }
        `}
      </style>

    </section>
  );
};

export default Hero;