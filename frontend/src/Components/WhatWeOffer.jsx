import React from "react";
import {
  Dumbbell,
  Zap,
  HeartPulse,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const offers = [
  {
    icon: Dumbbell,
    title: "STRENGTH TRAINING",
    desc: "6,000 sq ft of elite strength equipment",
  },
  {
    icon: Zap,
    title: "FUNCTIONAL TRAINING",
    desc: "Dedicated functional training area",
  },
  {
    icon: HeartPulse,
    title: "RECOVERY",
    desc: "Recovery zone with stretching & elite tools",
  },
  {
    icon: Users,
    title: "PERSONAL TRAINING",
    desc: "1-on-1 sessions with expert trainers",
  },
  {
    icon: Users,
    title: "GROUP ENERGY",
    desc: "Community-driven workout sessions",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemAnimation = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const WhatWeOffer = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black py-24 md:py-32 px-4 md:px-8">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#d9ff00]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center"
        >
          <span className="px-4 py-2 rounded-full border border-[#d9ff00]/30 bg-[#d9ff00]/10 text-[#d9ff00] text-[10px] md:text-xs tracking-[0.3em] font-bold uppercase">
            OUR SERVICES
          </span>

          <h2
            className="mt-6 text-5xl md:text-6xl lg:text-[90px] font-black uppercase text-white leading-none"
            style={{
              fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
            }}
          >
            WHAT WE{" "}
            <span className="text-[#d9ff00] relative">
              OFFER
              <span className="absolute left-0 bottom-2 w-full h-3 bg-[#d9ff00]/20 -z-10 blur-md" />
            </span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl text-sm md:text-base leading-relaxed">
            Transform your body with world-class fitness experiences,
            high-energy sessions, and elite recovery facilities.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {offers.map((item, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl"
            >
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-[#d9ff00] via-white/20 to-[#d9ff00] animate-spin-slow">
                <div className="w-full h-full bg-black rounded-3xl" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 h-full bg-[#0b0b0b]/95 backdrop-blur-xl rounded-3xl border border-white/5 p-8 md:p-10 overflow-hidden">
                
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#d9ff00]/10 via-transparent to-transparent" />

                {/* Top Icon */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-[#d9ff00]/10 border border-[#d9ff00]/20 flex items-center justify-center"
                  >
                    <item.icon className="w-8 h-8 text-[#d9ff00]" />
                  </motion.div>

                  <ArrowUpRight className="text-gray-600 group-hover:text-[#d9ff00] transition duration-300" />
                </div>

                {/* Title */}
                <h3
                  className="text-white font-black text-2xl md:text-3xl uppercase tracking-wide leading-tight mb-4 group-hover:text-[#d9ff00] transition duration-300"
                  style={{
                    fontFamily:
                      '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom Line Animation */}
                <div className="mt-8 w-0 group-hover:w-full h-[2px] bg-[#d9ff00] transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        .animate-spin-slow {
          background-size: 300% 300%;
          animation: borderRotate 6s linear infinite;
        }

        @keyframes borderRotate {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default WhatWeOffer;