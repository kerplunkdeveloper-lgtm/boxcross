import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Import local assets
import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';
import img5 from '../assets/5.webp';
import img6 from '../assets/6.webp';
import img7 from '../assets/7.webp';
import img8 from '../assets/8.webp';
import img9 from '../assets/9.webp';
import img10 from '../assets/10.webp';

const Trainers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const sectionRefs = useRef([]);

  const trainers = [
    {
      firstName:"VIVEK", roles: "CO FOUNDER • MASTER PERSONAL TRAINER • PERFORMANCE COACH",
      experience: "10+ YRS", clients: "700+", tier: "TIER 5",
      specializations: ["Professional Bodybuilding & Competition Preparation", "Advanced Body Transformation", "Posing, Stage Presence & Aesthetic Mastery", "Kettlebell Training & Dynamic Strength", "TRX & Suspension Based Functional Training", "Myofascial Release & Recovery Optimisation", "Physique Sculpting & Muscle Hypertrophy","Mindset Coaching & Performance Psychology"],
      about: "I'm Vivek, co founder of WooHoo Health Club and a 14 time competitive bodybuilding champion. My journey started on the stage as a professional dancer before moving into the world of elite performance. That background shaped everything about the way I train. I understand discipline, performance under pressure, and the art of presenting the body at its absolute best.",
      Certifications:["Certified Personal Trainer (CPT)","Certified Nutritionist (CN)","Certified Sports Nutritionist (CSN)","Certified Strength and Conditioning Specialist (CSCS)","Certified Pilates Instructor (CPI)","Certified Yoga Instructor (CYI)","Certified Mobility Specialist (CMS)"],
      Achievements:["14 Time Competitive Bodybuilding Champion", "World 5th Place Ranking in Professional Bodybuilding", "Professional Dancer featured on Zee TV", "Co Founder, WooHoo Health Club", "700+ Clients Coached Across a Decade of Practice"],
      msg:"I lead with courage and grow with intention.",

      image: img1, thumbnail: img1
    },
    { 
      firstName: "JENKINS", roles: "SENIOR PERSONAL TRAINER • YOGA INSTRUCTOR",
      experience: "5+ YRS", clients: "300+", tier: "TIER 4",
      specializations: ["Yoga & Flexibility Training", "Core Strength & Stability", "Pre & Post Natal Fitness", "Mindfulness & Meditation Coaching"],
      image: img2, thumbnail: img2
    },
    {
      firstName: "MARCUS", lastName: "WRIGHT", roles: "STRENGTH COACH • NUTRITION SPECIALIST",
      experience: "10+ YRS", clients: "1000+", tier: "TIER 5",
      specializations: ["Olympic Weightlifting", "Powerlifting Coaching", "Macro & Micro Nutritional Planning", "Injury Rehabilitation"],
      image: img3, thumbnail: img3
    },
    {
      firstName: "ALEX", lastName: "CARTER", roles: "HEAD OF ATHLETIC DEVELOPMENT",
      experience: "8+ YRS", clients: "500+", tier: "TIER 4",
      specializations: ["Athletic Performance", "Speed & Agility Training", "Injury Prevention", "Mobility Mastery"],
      image: img4, thumbnail: img4
    },
    {
      firstName: "JESSICA", lastName: "PEARSON", roles: "NUTRITION & WELLNESS COACH",
      experience: "6+ YRS", clients: "400+", tier: "TIER 3",
      specializations: ["Gut Health Optimization", "Hormonal Balance Nutrition", "Plant-Based Performance", "Weight Management"],
      image: img5, thumbnail: img5
    },
    {
      firstName: "DAVID", lastName: "CHEN", roles: "MARTIAL ARTS & HIIT SPECIALIST",
      experience: "12+ YRS", clients: "800+", tier: "TIER 5",
      specializations: ["Boxing Conditioning", "Muay Thai Fundamentals", "High-Intensity Interval Training", "Endurance Building"],
      image: img6, thumbnail: img6
    },
    {
      firstName: "EMILY", lastName: "DAVIS", roles: "PILATES & CORE SPECIALIST",
      experience: "4+ YRS", clients: "250+", tier: "TIER 3",
      specializations: ["Reformer Pilates", "Postural Alignment", "Pelvic Floor Strengthening", "Breathwork Practices"],
      image: img7, thumbnail: img7
    },
    {
      firstName: "MICHAEL", lastName: "SCOTT", roles: "REHABILITATION & RECOVERY COACH",
      experience: "9+ YRS", clients: "450+", tier: "TIER 4",
      specializations: ["Post-Surgery Rehab", "Joint Mobility", "Myofascial Release", "Chronic Pain Management"],
      image: img8, thumbnail: img8
    },
    {
      firstName: "CHLOE", lastName: "ADAMS", roles: "FEMALE FITNESS SPECIALIST",
      experience: "5+ YRS", clients: "350+", tier: "TIER 3",
      specializations: ["Women's Strength Training", "Glute Development", "Pre & Post Natal Fitness", "Confidence Building"],
      image: img9, thumbnail: img9
    },
    {
      firstName: "JAMES", lastName: "WILSON", roles: "ENDURANCE & TRIATHLON COACH",
      experience: "15+ YRS", clients: "1200+", tier: "TIER 5",
      specializations: ["Marathon Prep", "Triathlon Conditioning", "VO2 Max Training", "Biomechanics Analysis"],
      image: img10, thumbnail: img10
    }
  ];

  // Intersection Observer for Desktop ScrollSpy
  useEffect(() => {
    // Only run intersection observer on large screens where right side scrolls
    if (window.innerWidth < 1024) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveTab(index);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px', 
        threshold: 0.1, 
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activeTrainer = trainers[activeTab];

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-20 lg:pt-0">
      
      {/* =========================================
          MOBILE UX: Image with Tabs & Bottom Sheet
          ========================================= */}
      <div className="lg:hidden flex flex-col w-full h-[calc(100vh-80px)] bg-[#050505] relative overflow-hidden">
        
        {/* Trainer Image Display */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex justify-center items-end">
           {/* Faint Background Text */}
           <div className="absolute top-10 left-0 w-full flex justify-center opacity-[0.04] pointer-events-none transition-opacity duration-300" key={`bg-${activeTrainer.firstName}`}>
             <span className="text-[120px] font-black text-transparent leading-none whitespace-nowrap" style={{ WebkitTextStroke: '2px white', fontFamily: '"Bebas Neue", sans-serif' }}>
               {activeTrainer.firstName}
             </span>
           </div>

           {/* Main Image */}
           <img src={activeTrainer.image} className="w-auto h-[90%] object-contain object-bottom relative z-10 animate-fade-in-up" alt={activeTrainer.firstName} key={activeTrainer.firstName} />
           <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none"></div>

           {/* Basic Info Overlay */}
           <div className="absolute bottom-6 left-0 w-full px-6 z-30 flex flex-col items-center text-center">
              <h1 className="text-6xl font-black leading-none mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                 <span className="text-white">{activeTrainer.firstName} </span>
                 <span className="text-[#a3ff00] drop-shadow-[0_0_10px_rgba(163,255,0,0.3)]">{activeTrainer.lastName}</span>
              </h1>
              <p className="text-[#a3ff00] font-bold text-[10px] tracking-widest uppercase mb-6 max-w-[90%]">
                 {activeTrainer.roles}
              </p>
              <button 
                 onClick={() => setShowMobileInfo(true)}
                 className="px-8 py-3 border border-[#a3ff00] text-[#a3ff00] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#a3ff00] hover:text-black transition-all bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(163,255,0,0.2)]"
              >
                 More Info
              </button>
           </div>
        </div>

        {/* Horizontal Thumbnails (Tabs) */}
        <div className="h-24 w-full bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center px-4 overflow-x-auto custom-scrollbar shrink-0 gap-4">
           {trainers.map((t, i) => (
              <button 
                 key={i}
                 onClick={() => { setActiveTab(i); setShowMobileInfo(false); }}
                 className={`w-14 h-14 rounded-md overflow-hidden border-2 shrink-0 transition-all ${activeTab === i ? 'border-[#a3ff00] scale-110 shadow-[0_0_10px_rgba(163,255,0,0.3)]' : 'border-[#333] opacity-40'}`}
              >
                 <img src={t.thumbnail} className="w-full h-full object-cover grayscale" alt="Thumbnail" />
              </button>
           ))}
        </div>

        {/* Bottom Sheet / Modal for "More Info" */}
        <div className={`absolute bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-[#222] rounded-t-3xl z-50 transition-transform duration-500 ease-in-out flex flex-col ${showMobileInfo ? 'translate-y-0 h-[85%]' : 'translate-y-full h-[85%]'}`}>
           {/* Drag Handle & Close */}
           <div className="w-full flex justify-center py-5 relative">
              <div className="w-12 h-1.5 bg-[#333] rounded-full"></div>
              <button onClick={() => setShowMobileInfo(false)} className="absolute right-6 top-4 text-gray-500 hover:text-[#a3ff00] transition-colors p-1">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
           </div>
           
           {/* Modal Content */}
           <div className="flex-1 overflow-y-auto px-6 pb-12 custom-scrollbar">
              <h2 className="text-5xl font-black mb-8 leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                 <span className="text-white">{activeTrainer.firstName} </span>
                 <span className="text-[#a3ff00]">{activeTrainer.lastName}</span>
              </h2>
              
              {/* Stats */}
              <div className="flex justify-between border-y border-[#222] py-5 mb-8 bg-[#050505] px-4 rounded-xl">
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{activeTrainer.experience}</span>
                    <span className="text-gray-500 text-[9px] tracking-widest mt-1 uppercase">Experience</span>
                 </div>
                 <div className="w-px h-10 bg-[#222]"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{activeTrainer.clients}</span>
                    <span className="text-gray-500 text-[9px] tracking-widest mt-1 uppercase">Clients</span>
                 </div>
                 <div className="w-px h-10 bg-[#222]"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{activeTrainer.tier}</span>
                    <span className="text-gray-500 text-[9px] tracking-widest mt-1 uppercase">Tier</span>
                 </div>
              </div>

              {/* Specializations */}
              <div>
                 <p className="text-gray-400 text-[10px] tracking-widest font-bold mb-4 uppercase">Specializations</p>
                 <div className="flex flex-wrap gap-2">
                    {activeTrainer.specializations.map((spec, i) => (
                       <span key={i} className="px-4 py-2 rounded-full border border-[#222] text-gray-300 text-xs bg-[#050505]">
                          {spec}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>


      {/* =========================================
          DESKTOP UX: Sticky ScrollSpy
          ========================================= */}
      <div className="hidden lg:flex w-full relative">
        
        {/* Left Fixed Area */}
        <div className="w-[50%] xl:w-[55%] h-screen sticky top-0 flex border-r border-[#222] bg-[#050505]">
          
          {/* Thumbnails Sidebar */}
          <div className="w-28 h-full border-r border-[#1a1a1a] flex flex-col items-center py-8 bg-[#080808] overflow-y-auto custom-scrollbar shrink-0 z-20">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-px h-12 bg-[#a3ff00]"></div>
              <span className="text-gray-500 text-[10px] tracking-[0.3em] font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                SELECT TRAINER
              </span>
              <div className="w-px h-12 bg-[#a3ff00]"></div>
            </div>
            
            <div className="flex flex-col gap-5 pb-8">
              {trainers.map((t, i) => (
                <button 
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 relative group
                    ${activeTab === i ? 'border-[#a3ff00] scale-110 shadow-[0_0_20px_rgba(163,255,0,0.3)] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={t.thumbnail} alt={t.firstName} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                  {/* Tooltip on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white tracking-widest">{i + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Large Image Showcase */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex items-end justify-center z-10">
            {/* Name Typography Background */}
            <div className="absolute inset-0 flex flex-col justify-center items-center opacity-[0.03] pointer-events-none select-none transition-opacity duration-300" key={activeTrainer.firstName}>
              <span className="text-[250px] xl:text-[300px] font-black text-transparent leading-[0.75]" style={{ WebkitTextStroke: '2px white', fontFamily: '"Bebas Neue", sans-serif' }}>
                {activeTrainer.firstName}
              </span>
              <span className="text-[250px] xl:text-[300px] font-black text-transparent leading-[0.75]" style={{ WebkitTextStroke: '2px white', fontFamily: '"Bebas Neue", sans-serif' }}>
                {activeTrainer.firstName}
              </span>
              <span className="text-[250px] xl:text-[300px] font-black text-transparent leading-[0.75]" style={{ WebkitTextStroke: '2px white', fontFamily: '"Bebas Neue", sans-serif' }}>
                {activeTrainer.firstName}
              </span>
            </div>
            
            <img 
              src={activeTrainer.image} 
              alt={activeTrainer.name} 
              className="w-auto h-[95%] object-contain object-bottom filter drop-shadow-2xl transition-all duration-500 animate-fade-in-up relative z-20" 
              key={`${activeTrainer.firstName}-img`}
            />
            <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#050505] to-transparent z-30 pointer-events-none"></div>
          </div>
        </div>

        {/* Right Scrollable Area */}
        <div className="w-[50%] xl:w-[45%] bg-[#050505] flex flex-col">
          {trainers.map((trainer, index) => (
            <div 
              key={index}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="w-full min-h-screen p-16 xl:p-24 flex flex-col justify-center border-b border-[#111] relative"
            >
              {/* Active Indicator Line */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-[#a3ff00] rounded-r-full transition-all duration-500 shadow-[0_0_15px_rgba(163,255,0,0.5)] ${activeTab === index ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}></div>

              <div className={`max-w-xl transition-all duration-700 ease-out ${activeTab === index ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-10'}`}>
                
                <p className="text-[#a3ff00] font-bold text-sm tracking-[0.2em] uppercase mb-4">
                  {trainer.roles}
                </p>
                
                <h1 className="text-[80px] xl:text-[100px] font-black mb-12 leading-none tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  <span className="text-white block">{trainer.firstName} </span>
                  <span className="text-[#a3ff00] drop-shadow-[0_0_20px_rgba(163,255,0,0.2)]">{trainer.lastName}</span>
                </h1>

                <div className="flex items-center gap-x-12 pb-10 mb-10 border-b border-[#222]">
                  <div className="flex flex-col">
                    <span className="text-5xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{trainer.experience}</span>
                    <span className="text-gray-500 text-[11px] tracking-[0.2em] font-bold mt-3 uppercase">Experience</span>
                  </div>
                  <div className="w-px h-16 bg-[#333]"></div>
                  <div className="flex flex-col">
                    <span className="text-5xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{trainer.clients}</span>
                    <span className="text-gray-500 text-[11px] tracking-[0.2em] font-bold mt-3 uppercase">Clients</span>
                  </div>
                  <div className="w-px h-16 bg-[#333]"></div>
                  <div className="flex flex-col">
                    <span className="text-5xl font-black text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{trainer.tier}</span>
                    <span className="text-gray-500 text-[11px] tracking-[0.2em] font-bold mt-3 uppercase">Tier</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-[12px] tracking-[0.2em] font-bold mb-6 uppercase">Specializations</p>
                  <div className="flex flex-wrap gap-4">
                    {trainer.specializations.map((spec, i) => (
                      <span key={i} className="px-5 py-3 rounded-full border border-[#2a2a2a] text-gray-300 text-sm font-medium bg-[#0f0f0f] hover:border-[#a3ff00] hover:text-white transition-all cursor-default hover:-translate-y-1">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>



                <div className="mt-6">
                  <Link to="/premium-plans">
                  <button className="bg-black border border-[#fff] p-5 rounded-full text-white">BOOK YOUR SESSION</button>
                  
                  </Link>
              
                </div>



              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}} />
    </div>
  );
};

export default Trainers;
