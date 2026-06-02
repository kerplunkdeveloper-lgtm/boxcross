import React from "react";
import { Dumbbell, Zap, HeartPulse, Users, ArrowUpRight } from "lucide-react";
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
    <section className="relative w-full overflow-hidden bg-black  mb-10 px-3 md:px-8">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#e5ff00]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1250px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-18 flex flex-col items-start md:items-center text-left md:text-center"
        >
          <span
            className="px-4 py-2 rounded-md border mb-5 bg-[#e5ff00] text-[#0a0a0a] uppercase"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            OUR SERVICES
          </span>

          <h2
            className=" uppercase text-white leading-none text-4xl md:text-5xl"
            style={{
              fontFamily: '"BrutalTypeBold", sans-serif',
              fontWeight: "700",
            }}
          >
            WHAT WE{" "}
            <span className="text-[#e5ff00] relative">
              OFFER
              <span className="absolute left-0 bottom-2 w-full h-3 bg-[#e5ff00]/20 -z-10 blur-md" />
            </span>
          </h2>

          <p
            className="text-gray-400 mt-7 max-w-2xl "
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
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
                y: -8,
                scale: 1.01,
              }}
              className="group relative overflow-hidden rounded-2xl p-[1.5px] bg-white/5"
            >
              {/* Spinning Border Layer */}
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_60%,#e5ff00_80%,#ffffff_95%,transparent_100%)] animate-border-spin opacity-20 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content Mask */}
              <div className="relative z-10 h-full w-full bg-[#0a0a0a]/95 backdrop-blur-xl rounded-[15px] p-8 md:p-10 flex flex-col justify-between overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute -right-20 -top-20 w-45 h-45 bg-[#e5ff00]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div>
                  {/* Top Icon Row */}
                  <div className="flex items-center justify-between mb-8">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-14 h-14 rounded-xl bg-[#e5ff00]/10 border border-[#e5ff00]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#e5ff00] group-hover:border-[#e5ff00]"
                    >
                      <item.icon className="w-6 h-6 text-[#e5ff00] transition-colors duration-300 group-hover:text-black" />
                    </motion.div>

                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-[#e5ff00] group-hover:border-[#e5ff00]/30 transition duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-white text-2xl uppercase tracking-wide mb-4 group-hover:text-[#e5ff00] transition duration-300"
                    style={{
                      fontFamily: '"Brutal Font", sans-serif',
                      fontWeight: "700",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-200 leading-relaxed"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Line Animation */}
                <div className="mt-8 relative w-full h-[1.5px] bg-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[#e5ff00] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes custom-border-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-border-spin {
          animation: custom-border-spin 6s linear infinite;
        }
        .group:hover .animate-border-spin {
          animation: custom-border-spin 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default WhatWeOffer;
