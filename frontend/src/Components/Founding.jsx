import React from "react";
import foundersAsset from "../assets/right.png";
import { User, Crown, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";


const Founding = () => {
  return (

    <div className="">
    
      {/* Countdown Promo Banner */}
      <div className="relative z-20 max-w-8xl mx-auto px-4 md:px-6 lg:px-10 mb-20">
        <div className="relative w-full rounded-[24px] md:rounded-[32px] border border-[#e5ff00] bg-black overflow-hidden flex flex-col lg:flex-row p-6 md:p-8 lg:p-12 gap-8 lg:gap-0 shadow-[0_0_50px_rgba(229,255,0,0.15)]">
          
          {/* Subtle X background pattern on the right */}
          <div 
            className="absolute top-0 right-0 w-full lg:w-1/3 h-full opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l5.373 5.373-24.627 24.627 24.627 24.627-5.373 5.373-24.627-24.627-24.627 24.627-5.373-5.373 24.627-24.627-24.627-24.627 5.373-5.373 24.627 24.627z\\' fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
              backgroundSize: "60px 60px"
            }}
          ></div>

          {/* Column 1: Huge Text */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10 pr-0 lg:pr-6">
            
            <div className="inline-block transform -skew-x-[12deg] bg-[#e5ff00] px-4 py-1.5 mb-6">
              <span className="inline-block transform skew-x-[12deg] text-black font-black uppercase tracking-wider text-[12px] md:text-[14px]">
                Founding Member Offer
              </span>
            </div>
            
            <h2 className="flex flex-col uppercase m-0 leading-[0.8] tracking-[-0.03em]" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>
              <span className="text-white text-[30px] md:text-[48px] font-black">
                THE FIRST 100.
              </span>
              <span className="text-[#e5ff00] text-[30px] md:text-[48px] font-black  mt-2" style={{ textShadow: "0 0 20px rgba(229,255,0,0.2)" }}>
                THE FOUNDERS.
              </span>
            </h2>

            <div className="flex items-start justify-center lg:justify-start gap-3 md:gap-5 mt-10 w-full">
              {/* Icon 1 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <Crown size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">FOUNDING MEMBER</span>
                <span className="text-[#e5ff00] font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">PRIVILEGES FOREVER</span>
              </div>
              
              <div className="w-px h-14 bg-zinc-800 mt-2"></div>
              
              {/* Icon 2 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <Star size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">BE PART OF BXC</span>
                <span className="text-[#e5ff00] font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">FROM DAY ONE</span>
              </div>
              
              <div className="w-px h-14 bg-zinc-800 mt-2"></div>
              
              {/* Icon 3 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <User size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">FIRST 100 MEMBERS</span>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">ONLY</span>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px h-[85%] self-center bg-zinc-800 mx-4 z-10"></div>
          <div className="lg:hidden w-full h-px bg-zinc-800 my-4 z-10"></div>

          {/* Column 2: Price */}
          <div className="flex-1 w-full flex flex-col items-center justify-center z-10 px-0 lg:px-6">
            
            <div className="flex items-center gap-4 w-full justify-center mb-5">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[40px]"></div>
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">EXCLUSIVE PRICE</span>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[40px]"></div>
            </div>

            <div className="text-center mb-5 leading-[1.1]">
              <span className="block text-white font-black text-[18px] md:text-[20px] tracking-wide uppercase">ANY PLAN</span>
              <span className="block text-[#e5ff00] font-black text-[18px] md:text-[20px] tracking-wide uppercase">ONE PRICE</span>
            </div>

            <div className="relative w-full max-w-[280px] border border-[#e5ff00] rounded-[24px] flex flex-col items-center justify-center py-7 mb-10">
              <div className="flex items-start">
                <span className="text-[#e5ff00] font-black text-3xl md:text-4xl mt-1.5 mr-1.5">₹</span>
                <span className="text-white font-black text-[60px] md:text-[76px] leading-none tracking-tighter" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>12,000</span>
              </div>
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#e5ff00] px-8 py-1.5 rounded-md whitespace-nowrap">
                <span className="text-black font-black text-[13px] tracking-widest uppercase">FOR 1 YEAR</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full justify-center">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[50px]"></div>
              <div className="text-center leading-[1.2]">
                <span className="block text-white font-bold text-[12px] md:text-[13px] tracking-widest uppercase">YOU SAVE</span>
                <span className="block text-[#e5ff00] font-bold text-[12px] md:text-[13px] tracking-widest uppercase">UP TO ₹6,000</span>
              </div>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[50px]"></div>
            </div>

          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px h-[85%] self-center bg-zinc-800 mx-4 z-10"></div>
          <div className="lg:hidden w-full h-px bg-zinc-800 my-4 z-10"></div>

          {/* Column 3: Countdown */}
          <div className="flex-1 w-full flex flex-col items-center justify-center z-10 pl-0 lg:pl-6">
            
            <div className="flex items-center gap-4 w-full justify-center mb-6">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[30px]"></div>
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">OFFER ENDS IN</span>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[30px]"></div>
            </div>

            <div className="flex items-start justify-center gap-2 md:gap-3 mb-10">
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">07</span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">HRS</span>
              </div>
              <span className="text-[#e5ff00] font-black text-[40px] leading-none mt-1.5">:</span>
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">04</span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">MINS</span>
              </div>
              <span className="text-[#e5ff00] font-black text-[40px] leading-none mt-1.5">:</span>
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">02</span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">SECS</span>
              </div>
            </div>

            <div className="border-[1.5px] border-[#e5ff00] rounded-[14px] px-6 py-3 flex items-center justify-center gap-2.5 mb-5 w-full max-w-[260px] cursor-pointer hover:bg-[#e5ff00]/10 transition-colors">
              <Clock size={18} className="text-[#e5ff00]" />
              <span className="text-[#e5ff00] font-bold uppercase tracking-wider text-[13px] md:text-[14px]">
                LIMITED TIME ONLY
              </span>
            </div>

            <span className="text-white/90 text-[14px] font-medium tracking-wide">Once it's gone, it's gone.</span>

          </div>

        </div>
      </div>






      
    </div>
  
  );
};

export default Founding;