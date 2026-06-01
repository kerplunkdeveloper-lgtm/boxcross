import React from "react";
import foundersAsset from "../assets/right.png";
import { User, Crown, Star } from "lucide-react";


const Founding = () => {
  return (



    <div className="mt-[-190px] ">
    
      {/* Countdown Promo Banner */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 mt-16 md:mt-24">
        <div className="relative w-full rounded-[20px] md:rounded-[32px] border border-[#e5ff00] bg-black/80 backdrop-blur-md overflow-hidden shadow-[0_0_40px_rgba(229,255,0,0.15)] flex flex-col lg:flex-row items-center p-8 md:p-10 lg:p-14 gap-10 lg:gap-0">
          
          {/* Subtle X background pattern on the right (simulated with CSS pattern) */}
          <div 
            className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-5 pointer-events-none" 
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l5.373 5.373-24.627 24.627 24.627 24.627-5.373 5.373-24.627-24.627-24.627 24.627-5.373-5.373 24.627-24.627-24.627-24.627 5.373-5.373 24.627 24.627z\\' fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
              backgroundSize: "60px 60px"
            }}
          ></div>

          {/* Column 1: Huge Text */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10 pl-0 lg:pl-6">
            <div className="inline-block transform -skew-x-[16deg] bg-[#e5ff00] px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(229,255,0,0.2)]">
              <span className="inline-block transform skew-x-[16deg] text-black font-black uppercase tracking-wider text-[11px] md:text-[13px]">
                Founding Member Offer
              </span>
            </div>
            <h2 className="flex flex-col uppercase m-0 leading-[0.85] tracking-[-0.03em]" style={{ fontFamily: '"Brutal Font", Impact, sans-serif' }}>
              <span className="text-white text-[32px] md:text-[40px] font-black drop-shadow-md">
                THE FIRST 100.
              </span>
              <span className="text-[#e5ff00] text-[32px] md:text-[40px] mt-3 font-black drop-shadow-lg" style={{ textShadow: "0 0 20px rgba(229,255,0,0.15)" }}>
                THE FOUNDERS.
              </span>
            </h2>
          </div>

          {/* Vertical Divider (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:block w-px h-40 bg-gradient-to-b from-transparent via-zinc-600 to-transparent mx-6 xl:mx-10 z-10"></div>
          <div className="w-full h-px lg:hidden bg-gradient-to-r from-transparent via-zinc-600 to-transparent my-2 z-10"></div>

          {/* Column 2: Features */}
          <div className="flex-1 w-full flex flex-col justify-center gap-5 z-10 px-0 lg:px-4">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-5 group cursor-default">
              <div className="w-[42px] h-[42px] rounded-full border-2 border-[#e5ff00] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(229,255,0,0.15)]">
                <User size={18} className="text-[#e5ff00]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[13px] md:text-sm tracking-widest uppercase">FIRST 100 MEMBERS ONLY</span>
                <span className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase mt-0.5">ONLY</span>
              </div>
            </div>
            <div className="w-[85%] h-px bg-zinc-800 ml-16"></div>

            {/* Feature 2 */}
            <div className="flex items-center gap-5 group cursor-default">
              <div className="w-[42px] h-[42px] rounded-full border-2 border-[#e5ff00] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(229,255,0,0.15)]">
                <Crown size={18} className="text-[#e5ff00]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[13px] md:text-sm tracking-widest uppercase">FOUNDING MEMBER</span>
                <span className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase mt-0.5">PRIVILEGES FOREVER</span>
              </div>
            </div>
            <div className="w-[85%] h-px bg-zinc-800 ml-16"></div>

            {/* Feature 3 */}
            <div className="flex items-center gap-5 group cursor-default">
              <div className="w-[42px] h-[42px] rounded-full border-2 border-[#e5ff00] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(229,255,0,0.15)]">
                <Star size={18} className="text-[#e5ff00]" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[13px] md:text-sm tracking-widest uppercase">BE PART OF BXC</span>
                <span className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase mt-0.5">FROM DAY ONE</span>
              </div>
            </div>

          </div>

          {/* Vertical Divider (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:block w-px h-40 bg-gradient-to-b from-transparent via-zinc-600 to-transparent mx-6 xl:mx-10 z-10"></div>
          <div className="w-full h-px lg:hidden bg-gradient-to-r from-transparent via-zinc-600 to-transparent my-2 z-10"></div>

          {/* Column 3: Countdown */}
          <div className="flex-1 w-full flex flex-col items-center justify-center z-10 pr-0 lg:pr-6">
            
            <div className="flex items-center gap-4 w-full justify-center mb-6">
              <div className="h-px bg-zinc-600 flex-1 max-w-[30px]"></div>
              <span className="text-[#e5ff00] font-black text-[13px] tracking-widest uppercase">OFFER ENDS IN</span>
              <div className="h-px bg-zinc-600 flex-1 max-w-[30px]"></div>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-[#e5ff00] font-black text-5xl md:text-[64px] leading-none drop-shadow-[0_0_15px_rgba(229,255,0,0.3)] font-mono">07</span>
                <span className="text-zinc-400 text-[11px] tracking-widest font-bold mt-3 uppercase">HRS</span>
              </div>
              <span className="text-[#e5ff00] font-black text-4xl md:text-5xl -mt-8">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#e5ff00] font-black text-5xl md:text-[64px] leading-none drop-shadow-[0_0_15px_rgba(229,255,0,0.3)] font-mono">04</span>
                <span className="text-zinc-400 text-[11px] tracking-widest font-bold mt-3 uppercase">MINS</span>
              </div>
              <span className="text-[#e5ff00] font-black text-4xl md:text-5xl -mt-8">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#e5ff00] font-black text-5xl md:text-[64px] leading-none drop-shadow-[0_0_15px_rgba(229,255,0,0.3)] font-mono">02</span>
                <span className="text-zinc-400 text-[11px] tracking-widest font-bold mt-3 uppercase">SECS</span>
              </div>
            </div>

            <div className="inline-block transform -skew-x-[16deg] bg-[#e5ff00] px-8 py-2.5 shadow-[0_0_20px_rgba(229,255,0,0.2)] hover:scale-105 hover:bg-[#ccff00] transition-all cursor-pointer">
              <span className="inline-block transform skew-x-[16deg] text-black font-black uppercase tracking-widest text-[13px] md:text-sm">
                LIMITED TIME ONLY
              </span>
            </div>

          </div>

        </div>
      </div>
      <section
      id="founders"
      className="relative overflow-hidden  py-12 md:py-20 lg:py-28 mb-10 "
    >















      {/* Background Crowd */}
      <div
        className="absolute inset-0"
      
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Left Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

      {/* Top & Bottom Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)]" />

      {/* Smoke Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 items-center gap-10">
          {/* LEFT SIDE */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-block  bg-[#e5ff00] px-4 py-2 mb-5">
              <span className="inline-block text-black font-extrabold uppercase tracking-wider text-xs md:text-sm">
                Founding Member Offer
              </span>
            </div>

            {/* Heading */}
            <h1
              className="uppercase leading-[0.82] font-black text-[12px] md:text-[14px] "
              style={{
                fontFamily: '"Brutal Type Bold", sans-serif',
                fontWeight: 700,
              
                fontStyle: "normal",
                fontDisplay: "swap",
              }}
            >
              <div
                className="text-white text-[40px] md:text-[48px]"
                style={{
                  textShadow:
                    "0 5px 15px rgba(0,0,0,0.9),0 15px 35px rgba(0,0,0,0.9)",
                }}
              >
                THE FIRST 100.
              </div>

              <div
                className="text-[#e5ff00] text-[40px] md:text-[48px] mt-5"
                style={{
                  textShadow:
                    "0 5px 15px rgba(0,0,0,0.9),0 15px 35px rgba(0,0,0,0.9)",
                }}
              >
                THE FOUNDERS.
              </div>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-white text-lg md:text-2xl lg:text-3xl">
              Be part of{" "}
              <span className="text-[#e5ff00] font-bold">BXC</span> from the
              beginning.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <button
                className="
                  h-14
                  px-10
                  border
                  border-[#555]
                  text-white
                  bg-black/70
                  backdrop-blur-sm
                  rounded-md
                  font-bold
                  tracking-wide
                  hover:border-[#e5ff00]
                  transition-all
                  duration-300
                "
              >
                TRY FOR FREE
              </button>

              <button
                className="
                  h-14
                  px-10
                  bg-[#e5ff00]
                  text-black
                  rounded-md
                  font-black
                  tracking-wide
                  hover:scale-105
                  transition-all
                  duration-300
                  shadow-[0_0_25px_rgba(229,255,0,0.25)]
                "
              >
                JOIN NOW
              </button>
            </div>

            <p className="text-zinc-500 text-xs mt-8">
              *Effective Monthly Pricing including Extension, if any
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Ribbon */}
            <div className="absolute left-4 md:left-10 top-0 z-30">
              <div
                className="
                  bg-black/90
                  border-l-2
                  border-r-2
                  border-[#e5ff00]
                  w-[65px]
                  h-[260px]
                  flex
                  items-center
                  justify-center
                "
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)",
                }}
              >
                <span
                  className="
                    text-[#e5ff00]
                    font-black
                    text-xl
                    tracking-[0.2em]
                  "
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  FOUNDERS
                </span>
              </div>
            </div>

            {/* Asset Glow */}
            <div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-[#e5ff00]/10 blur-[120px]" />

            {/* Main Image */}
            <img
              src={foundersAsset}
              alt="Founders"
              className="
                relative
                z-20
                w-full
                max-w-[650px]
                object-contain
                drop-shadow-[0_35px_70px_rgba(0,0,0,0.95)]
              "
            />
          </div>
        </div>
      </div>

    
    </section>
    </div>
  
  );
};

export default Founding;