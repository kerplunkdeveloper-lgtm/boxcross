import React from "react";
import tt from "../assets/t.webp";

const benefits = [
  "Certified Strength & Conditioning Specialists",
  "Personalized Nutrition & Training Plans",
  "Continuous Progress Tracking & Adjustments",
  "Motivation that Matches Your Vibe",
];

const BuildProgress = () => {
  return (
    <section className="w-full py-24 px-4 md:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 border-t border-[#1a1a1a] bg-black">
      {/* Left Content */}
      <div className="flex-1 max-w-2xl text-left">
        <span className="px-4 py-2 rounded-md  border border-[#d9ff00]/30 bg-[#d9ff00]/10 text-[#d9ff00] uppercase"
          style={{
            fontFamily: '"Bai Jamjuree", sans-serif',
            fontSize:'16px',
            fontWeight:'600',
          }}>
           EXPERT COACHING
          </span>
        <h2
          className=" text-white mt-5 leading-[0.9] mb-8"
          style={{
            fontFamily: '"Brutal Font", sans-serif',
            fontSize:'48px',
            fontWeight:'700',
          }}
        >
          BUILD REAL
          <br />
          <span className="text-[#d9ff00]">PROGRESS</span>
        </h2>

        <p className="text-white font-bold text-lg mb-6 leading-snug">
          Our certified trainers and expert coaches don't just guide
          workouts—they build progress.
        </p>
        <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed font-medium">
          Whether you're training for a marathon, recovering from an injury, or
          just starting your fitness journey, our team is here to elevate your
          performance. With personalized plans and data-driven insights, we
          ensure every rep counts towards your goals.
        </p>

        <ul className="space-y-4 mb-12">
          {benefits.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 text-gray-300 text-sm md:text-base font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-[#d9ff00] shadow-[0_0_8px_rgba(163,255,0,0.8)]"></div>
              {item}
            </li>
          ))}
        </ul>

        {/* <Link to="/trainers">
          <button
            className="group relative overflow-hidden bg-[#d9ff00] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(217,255,0,0.2)] cursor-pointer"
            style={{
              fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
              fontSize: "1.25rem",
            }}
          >
            <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-xl"></span>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              MEET OUR TEAM
            </span>
          </button>
        </Link> */}
      </div>

      {/* Right Glowing Icon/Image Area */}
      <div className="flex-1 w-full flex justify-center items-center relative min-h-[400px] lg:min-h-[600px]">
        {/* Intense Glow Background */}
        <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-[#d9ff00] blur-[100px] md:blur-[150px] opacity-20 rounded-full animate-pulse"></div>

        <div className="relative z-10 w-64 h-64 md:w-100 md:h-100 text-[#d9ff00] drop-shadow-[0_0_20px_rgba(163,255,0,0.8)]">
          <img
            src={tt}
            alt="expert trainer coaching illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BuildProgress;
