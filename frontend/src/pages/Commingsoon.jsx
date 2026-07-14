import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Dumbbell, ArrowUpRight } from "lucide-react";

const Commingsoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden px-6 selection:bg-[#e5ff00] selection:text-black">
      {/* Top Right "Go to Events" Link */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={() => navigate("/events")}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-[#e5ff00] text-black border border-white/10 hover:border-[#e5ff00] font-bold uppercase tracking-wider text-[11px] px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95 group"
        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
      >
        <span>Go to Events</span>
        <ArrowUpRight size={13} className="transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.button>
      {/* Background Radial Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#e5ff00]/5 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#ff9e00]/3 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[10000ms]" />

      {/* Decorative Grid Lines for futuristic look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Content Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-xl"
      >
        {/* Animated Badge Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-[#e5ff00]/20 rounded-2xl blur-xl scale-125 animate-pulse" />
          <div className="w-16 h-16 bg-[#e5ff00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e5ff00]/30 border border-white/10 relative z-10">
            <Dumbbell className="text-black w-8 h-8 animate-bounce duration-[2500ms]" />
          </div>
        </motion.div>

        {/* Brand tracking title */}
        <motion.h4
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 0.7, letterSpacing: "0.4em" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xs uppercase font-semibold text-gray-400 tracking-[0.4em] mb-4 uppercase"
        >
          Box & Cross
        </motion.h4>

        {/* Main Title with Neon hover effect */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none cursor-default"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          Coming <span className="text-[#e5ff00] drop-shadow-[0_0_15px_rgba(229,255,0,0.3)]">Soon</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-sm sm:text-base text-gray-300 font-light max-w-md leading-relaxed mb-10"
          style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
        >
          We are currently crafting a premium, high-octane fitness experience for our tribe. The ultimate transformation environment is on its way.
        </motion.p>

        {/* Futuristic Infinite Loading Bar */}
        <div className="w-48 sm:w-64 h-[3px] bg-white/10 rounded-full overflow-hidden relative mb-12">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#e5ff00] to-transparent"
          />
        </div>

        {/* Footer Brand Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-gray-500"
        >
          <Flame size={12} className="text-[#e5ff00]" />
          <span>Where the tribe begins</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Commingsoon;