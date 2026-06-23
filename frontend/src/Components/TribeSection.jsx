import React from "react";
import { motion } from "framer-motion";

export default function TribeSection() {
  const points = [
    {
      title: "THE BXC TRIBE",
      highlight: "The Tribe is everyone who trains at BXC.",
      description: "Fight Club. Strength Lab. HYROX Lab. Run Club. Hybrid Performance. Junior Athletes. One Community."
    },
    {
      title: "SUNDAY RUNS & DRILLS",
      highlight: "The Tribe shows up on Sunday mornings.",
      description: "Before the city wakes up, the Tribe is already moving, pushing limits together."
    },
    {
      title: "COMMUNITY INTEGRITY",
      highlight: "The Tribe holds each other to the standard.",
      description: "We show up, support each other, and grow together. Accountability is our foundation."
    }
  ];

  return (
    <section className="bg-black overflow-hidden py-10 lg:py-0">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[650px] gap-10 items-stretch">

          {/* LEFT CONTENT */}
          <div className="flex items-center px-6 sm:px-12 md:px-16 lg:px-24  lg:py-0">
            <div className="w-full">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-white uppercase text-3xl md:text-4xl text-center md:text-left  font-black leading-none mb-10 tracking-wide"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                WHAT THE <span className="text-[#E5FF00]">TRIBE</span> IS
              </motion.h2>

              <div className="space-y-8">
                {points.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className="border-l-[3px] border-[#E5FF00]/40 hover:border-[#E5FF00] pl-6 transition-all duration-300 py-1"
                  >
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      {point.title}
                    </h3>
                    <p className="text-gray-100 text-lg md:text-xl font-bold mt-1 uppercase">
                      {point.highlight}
                    </p>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed mt-2 font-medium">
                      {point.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden group h-[300px] sm:h-[400px] lg:h-full min-h-[300px]"
          >
            {/* Left Black Overlay (Desktop) */}
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/45 to-transparent hidden lg:block"></div>

            {/* Bottom Overlay (Mobile/Tablet) */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden"></div>

            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop"
              alt="BXC Tribe Workout"
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}