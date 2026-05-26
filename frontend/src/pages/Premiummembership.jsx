import React, { useRef } from "react";
import SuccessStories from "../Components/SuccessStories";
import Membership from "../Components/Membership";
import WhatWeOffer from "../Components/WhatWeOffer";
import {
  Activity,
  Dumbbell,
  Users,
  Snowflake,
  Lock,
  ShowerHead,
  Car,
  Wifi,
  Droplet,
  Zap,
  Music,
} from "lucide-react";

const Premiummembership = () => {
  const membershipRef = useRef(null);

  const scrollToMembership = () => {
    membershipRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const differences = [
    {
      icon: Activity,
      title: "9,000 SQ FT",
      desc: "Dedicated training space built for flow, not chaos.",
    },
    {
      icon: Dumbbell,
      title: "WORLD-CLASS BRANDS",
      desc: "Panatta, Nautilus, Booty Builder, RealLeader USA, Nike, Shua",
    },
    {
      icon: Users,
      title: "EXPERT COACHES",
      desc: "Certified trainers who build progress, not just guide workouts.",
    },
    {
      icon: Snowflake,
      title: "CLIMATE CONTROLLED",
      desc: "Centralized AC for peak performance comfort.",
    },
    {
      icon: Lock,
      title: "PREMIUM LOCKERS",
      desc: "Secure, spacious, and keyless RFID lockers.",
    },
    { icon: ShowerHead, title: "LUXURY SHOWERS", desc: "Private Showers" },
    {
      icon: Car,
      title: "VALET PARKING",
      desc: "Hassle-free parking for all members.",
    },
    {
      icon: Wifi,
      title: "FREE WI-FI",
      desc: "High-speed internet throughout the floor.",
    },
    {
      icon: Droplet,
      title: "SAUNA & STEAM",
      desc: "Detox, relax, and recover after your session.",
    },
    {
      icon: Zap,
      title: "BIO-HACK RECOVERY",
      desc: "Ice Baths & Red Light Therapy for elite recovery.",
    },
    {
      icon: Music,
      title: "LIVE DJ SETS",
      desc: "Electric atmosphere with curated gym playlists.",
    },
  ];

  return (
    <main className="w-full bg-[#0a0a0a] text-white min-h-screen">
      {/* =========================================
          HERO BANNER SECTION
          ========================================= */}
      <section className="w-full relative h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 opacity-80"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")',
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>

        {/* Content Area */}
        <div className="relative z-20 text-center flex flex-col items-center px-4 w-full max-w-5xl mt-16">
          <p className="text-[d9ff00] font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 md:mb-6 drop-shadow-lg">
            INDIRANAGAR, BANGALORE
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-[90px] lg:text-[120px] font-black text-white leading-[0.9] tracking-tight mb-6 drop-shadow-2xl"
            style={{
              fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
            }}
          >
            INDIRANAGAR'S MOST
            <br />
            <span className="text-[d9ff00]">PREMIUM</span> HEALTH CLUB
          </h1>
          <p className="text-gray-200 text-sm md:text-base lg:text-lg font-medium max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            The Best Gym In Indiranagar With Ice Bath, Sauna, Red Light & 9,000
            <br className="hidden md:block" /> SQ FT Of World-Class Equipment.
          </p>
          <button
            onClick={scrollToMembership}
            className="bg-[d9ff00] text-black font-black uppercase tracking-widest px-10 md:px-12 py-4 md:py-5 rounded-xl hover:bg-[#8ee000] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(163,255,0,0.3)] text-base md:text-lg"
            style={{
              fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
            }}
          >
            BOOK YOUR FREE GYM TOUR
          </button>
        </div>
      </section>

      {/* =========================================
          WHY CHOOSE US SECTION
          ========================================= */}
      <section className="w-full bg-[#050505] py-24 md:py-32 px-4 md:px-8 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-24">
            <h4 className="text-[d9ff00] font-black tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">
              WHY CHOOSE US
            </h4>
            <h2
              className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-none uppercase drop-shadow-lg"
              style={{
                fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
              }}
            >
              THE WOOHOO <span className="text-[d9ff00]">DIFFERENCE</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16">
            {differences.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border bg-[#1d2309] border-[#333] flex items-center justify-center mb-5 md:mb-6 group-hover:border-[d9ff00] group-hover:shadow-[0_0_15px_rgba(163,255,0,0.15)] transition-all duration-300">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[d9ff00]" />
                </div>
                <h3
                  className="text-white font-black text-lg md:text-xl uppercase tracking-wider mb-2"
                  style={{
                    fontFamily:
                      '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed max-w-[200px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatWeOffer onBookTour={scrollToMembership} />

      <SuccessStories />
      <div ref={membershipRef}>
        <Membership />
      </div>

      {/* Global CSS for hiding scrollbars but keeping snap scrolling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </main>
  );
};

export default Premiummembership;
