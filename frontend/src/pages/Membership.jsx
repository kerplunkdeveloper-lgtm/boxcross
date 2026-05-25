import React from 'react';
import MembershipPlans from '../Components/Membership'; // Bringing in the membership pricing section
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Membership = () => {
  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col mt-[-80px]">
      {/* Banner Section */}
      <section className="relative w-full h-[30vh] md:h-[75vh] flex flex-col items-center justify-center overflow-hidden">

        {/* Background Image Area */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            // High-quality gym background image for the banner
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
          
          }}
        ></div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-[#050505]"></div>

        {/* Banner Content */}
        <div className="relative z-10 flex items-center justify-center w-full mt-10 md:mt-10 px-4">
          
          <div className="relative flex items-center justify-center w-full">
            {/* Outline Text */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-transparent font-black tracking-tight leading-none uppercase select-none opacity-50 w-full text-center text-[12vw] "
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.9)',
              }}
            >
              MEMBERSHIP
            </motion.h1>

            {/* Yellow Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              whileHover={{ scale: 1.05, x: "-50%", y: "-50%" }}
              whileTap={{ scale: 0.95, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
              className="absolute top-1/2 left-1/2 mt-[5vw] sm:mt-[3vw] md:mt-[2.5vw] lg:mt-[4vw] bg-[#defb02] px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-md text-black flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap shadow-2xl cursor-pointer"
            >
              <Link to="/" className="flex items-center">
                <span className="font-extrabold text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] tracking-wider hover:opacity-70 transition-opacity">HOME</span>
              </Link>
           
              <span className="text-[8px] sm:text-[10px] opacity-60">•</span>
              
              <span className="font-bold text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] tracking-wider underline decoration-[1.5px] underline-offset-4">MEMBERSHIP</span>
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* Render the actual pricing cards below the banner */}
      <div className="relative z-20">
        <MembershipPlans />
      </div>
    </div>
  );
};

export default Membership;