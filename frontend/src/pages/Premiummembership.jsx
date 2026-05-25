import React, { useRef } from 'react';
import SuccessStories from '../Components/SuccessStories';
import Membership from '../Components/Membership';
import { Link } from 'react-router-dom';
import tt from '../assets/t.webp'
import { Activity, Dumbbell, Users, Snowflake, Lock, ShowerHead, Car, Wifi, Droplet, Zap, Music, HeartPulse } from 'lucide-react';

const Premiummembership = () => {
  const membershipRef = useRef(null);
  
  const scrollToMembership = () => {
    membershipRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const differences = [
    { icon: Activity, title: "9,000 SQ FT", desc: "Dedicated training space built for flow, not chaos." },
    { icon: Dumbbell, title: "WORLD-CLASS BRANDS", desc: "Panatta, Nautilus, Booty Builder, RealLeader USA, Nike, Shua" },
    { icon: Users, title: "EXPERT COACHES", desc: "Certified trainers who build progress, not just guide workouts." },
    { icon: Snowflake, title: "CLIMATE CONTROLLED", desc: "Centralized AC for peak performance comfort." },
    { icon: Lock, title: "PREMIUM LOCKERS", desc: "Secure, spacious, and keyless RFID lockers." },
    { icon: ShowerHead, title: "LUXURY SHOWERS", desc: "Private Showers" },
    { icon: Car, title: "VALET PARKING", desc: "Hassle-free parking for all members." },
    { icon: Wifi, title: "FREE WI-FI", desc: "High-speed internet throughout the floor." },
    { icon: Droplet, title: "SAUNA & STEAM", desc: "Detox, relax, and recover after your session." },
    { icon: Zap, title: "BIO-HACK RECOVERY", desc: "Ice Baths & Red Light Therapy for elite recovery." },
    { icon: Music, title: "LIVE DJ SETS", desc: "Electric atmosphere with curated gym playlists." },
  ];

  const offers = [
    { icon: Dumbbell, title: "STRENGTH TRAINING", desc: "6,000 sq ft of elite strength equipment" },
    { icon: Zap, title: "FUNCTIONAL TRAINING", desc: "Dedicated functional training area" },
    { icon: HeartPulse, title: "RECOVERY", desc: "Recovery zone with stretching & elite tools" },
    { icon: Users, title: "PERSONAL TRAINING", desc: "1-on-1 sessions with expert trainers" },
    { icon: Users, title: "GROUP ENERGY", desc: "Community-driven workout sessions" },
  ];

  const zones = [
    { title: "BOOTY STATION", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80" },
    { title: "CURL CORNER", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" },
    { title: "IRON YARD", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" },
    { title: "PEC CITY", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80" },
  ];

  const benefits = [
    "Certified Strength & Conditioning Specialists",
    "Personalized Nutrition & Training Plans",
    "Continuous Progress Tracking & Adjustments",
    "Motivation that Matches Your Vibe"
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
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")' }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>

        {/* Content Area */}
        <div className="relative z-20 text-center flex flex-col items-center px-4 w-full max-w-5xl mt-16">
          <p className="text-[#a3ff00] font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 md:mb-6 drop-shadow-lg">
            INDIRANAGAR, BANGALORE
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-[90px] lg:text-[120px] font-black text-white leading-[0.9] tracking-tight mb-6 drop-shadow-2xl" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            INDIRANAGAR'S MOST<br />
            <span className="text-[#a3ff00]">PREMIUM</span> HEALTH CLUB
          </h1>
          <p className="text-gray-200 text-sm md:text-base lg:text-lg font-medium max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            The Best Gym In Indiranagar With Ice Bath, Sauna, Red Light & 9,000<br className="hidden md:block" /> SQ FT Of World-Class Equipment.
          </p>
          <button 
            onClick={scrollToMembership}
            className="bg-[#a3ff00] text-black font-black uppercase tracking-widest px-10 md:px-12 py-4 md:py-5 rounded-xl hover:bg-[#8ee000] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(163,255,0,0.3)] text-base md:text-lg"
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
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
            <h4 className="text-[#a3ff00] font-black tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">WHY CHOOSE US</h4>
            <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-none uppercase drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
              THE WOOHOO <span className="text-[#a3ff00]">DIFFERENCE</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16">
            {differences.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border bg-[#1d2309] border-[#333] flex items-center justify-center mb-5 md:mb-6 group-hover:border-[#a3ff00] group-hover:shadow-[0_0_15px_rgba(163,255,0,0.15)] transition-all duration-300">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[#a3ff00]" />
                </div>
                <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-wider mb-2" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>{item.title}</h3>
                <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          WHAT WE OFFER SECTION
          ========================================= */}
      <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 flex flex-col items-center">
            <h4 className="text-[#a3ff00] font-black tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">OUR SERVICES</h4>
            <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-none uppercase drop-shadow-lg mb-8" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
              WHAT WE <span className="text-[#a3ff00]">OFFER</span>
            </h2>
            <button 
              onClick={scrollToMembership}
              className="bg-[#a3ff00] text-black font-black uppercase tracking-widest px-8 md:px-10 py-3 rounded-md hover:bg-[#8ee000] transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(163,255,0,0.3)] text-xs md:text-sm" 
              style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
            >
              BOOK YOUR FREE GYM TOUR
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((item, index) => (
              <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 hover:border-[#333] transition-colors duration-300 group">
                <item.icon className="w-5 h-5 text-[#a3ff00] mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-wider mb-2" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>{item.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          OUR TRAINING ZONES SECTION
          ========================================= */}
      <section className="w-full py-24 px-4 md:px-8 max-w-[1400px] mx-auto bg-[#0a0a0a]">
        <div className="mb-10 px-2 md:px-6">
          <h4 className="text-[#a3ff00] font-black tracking-[0.2em] text-[10px] md:text-xs uppercase mb-2">TAKE A LOOK</h4>
          <h2 className="text-5xl md:text-[80px] font-black text-white leading-none" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            OUR TRAINING <span className="text-[#a3ff00]">ZONES</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 px-2 md:px-6 pb-6 snap-x snap-mandatory custom-scrollbar">
           {zones.map((zone, i) => (
             <div key={i} className="min-w-[280px] md:min-w-[340px] h-[400px] md:h-[500px] relative rounded-2xl overflow-hidden snap-center group border border-[#222]">
               <img src={zone.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0" alt={zone.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               <h3 className="absolute bottom-8 left-8 text-3xl font-black text-white uppercase tracking-wider shadow-black drop-shadow-xl" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                 {zone.title}
               </h3>
             </div>
           ))}
        </div>

        {/* Custom Mock Scrollbar */}
        <div className="flex items-center mt-6 gap-3 w-full max-w-4xl mx-auto px-4">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500 shrink-0"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
           <div className="flex-1 h-5 bg-white rounded-full p-1 shadow-inner">
             <div className="w-1/4 h-full bg-gray-400 rounded-full shadow-sm"></div>
           </div>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500 shrink-0"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </div>

        {/* Centered Button */}
        <div className="flex justify-center mt-16">
          <button 
            onClick={scrollToMembership}
            className="bg-[#a3ff00] text-black font-black uppercase tracking-widest px-10 py-4 rounded-xl hover:bg-[#8ee000] transition-colors shadow-[0_0_20px_rgba(163,255,0,0.2)]" 
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif', fontSize: '1.25rem' }}
          >
            BOOK YOUR FREE GYM TOUR
          </button>
        </div>
      </section>

      {/* =========================================
          BUILD REAL PROGRESS SECTION
          ========================================= */}
      <section className="w-full py-24 px-4 md:px-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 border-t border-[#1a1a1a]">
        
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <h4 className="text-[#a3ff00] font-black tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">EXPERT COACHING</h4>
          <h2 className="text-6xl md:text-[90px] font-black text-white leading-[0.9] mb-8" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            BUILD REAL<br/>
            <span className="text-[#a3ff00]">PROGRESS</span>
          </h2>
          
          <p className="text-white font-bold text-lg mb-6 leading-snug">
            Our certified trainers and expert coaches don't just guide workouts—they build progress.
          </p>
          <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed font-medium">
            Whether you're training for a marathon, recovering from an injury, or just starting your fitness journey, our team is here to elevate your performance. With personalized plans and data-driven insights, we ensure every rep counts towards your goals.
          </p>

          <ul className="space-y-4 mb-12">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-300 text-sm md:text-base font-bold">
                <div className="w-2 h-2 rounded-full bg-[#a3ff00] shadow-[0_0_8px_rgba(163,255,0,0.8)]"></div>
                {item}
              </li>
            ))}
          </ul>

<Link to="/trainers">

          <button 
            className="bg-[#a3ff00] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#8ee000] transition-colors shadow-[0_0_20px_rgba(163,255,0,0.2)]" 
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif', fontSize: '1.25rem' }}
          >
            MEET OUR TEAM
          </button>
        </Link>
        </div>

        {/* Right Glowing Icon/Image Area */}
        <div className="flex-1 w-full flex justify-center items-center relative min-h-[400px] lg:min-h-[600px]">
          {/* Intense Glow Background */}
          <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-[#a3ff00] blur-[100px] md:blur-[150px] opacity-20 rounded-full animate-pulse"></div>
          
          {/* Using a glowing generic user silhouette placeholder */}
          <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 text-[#a3ff00] drop-shadow-[0_0_20px_rgba(163,255,0,0.8)]">
           <img src={tt} alt="" />
          </div>
        </div>
      </section>

         <SuccessStories />
      <div ref={membershipRef}>
        <Membership/>
      </div>




      {/* Global CSS for hiding scrollbars but keeping snap scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
};

export default Premiummembership;