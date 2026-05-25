import React, { useState, useRef } from 'react';
import Foot from "../Components/Foot";
import GymMarquee from "../Components/GymMarquee";
import { Check, Calendar, ArrowRight, Activity, Zap, Shield, User, Star } from 'lucide-react';
import PhonePeModal from './PhonePeModal';
import { motion } from 'framer-motion';
import box1 from "../assets/box1.png"
import box2 from "../assets/box2.png"
import box3 from "../assets/box3.png"



const programs = [
  {
    id: 'start',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#defb02]">
        <path d="M16 20h-4c-2.8 0-5-2.2-5-5v-1a5 5 0 0 1 5-5h2a2 2 0 0 1 2 2v2c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V9a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v3c0 2.8 2.2 5 5 5h3"></path>
        <path d="M9 13V9"></path>
      </svg>
    ),
    title: 'START',
    subtitle: 'FIGHT CLUB / STRENGTH LAB',
    desc: 'Perfect for beginners. Build fitness, strength and confidence.',
    price: '2,200',
    image: box1,
  },
  {
    id: 'transform',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#defb02]">
        <path d="m6.5 6.5 11 11"></path>
        <path d="m21 21-1-1"></path>
        <path d="m3 3 1 1"></path>
        <path d="m18 22 4-4"></path>
        <path d="m2 6 4-4"></path>
        <path d="m3 10 7-7"></path>
        <path d="m14 21 7-7"></path>
      </svg>
    ),
    title: 'TRANSFORM',
    subtitle: 'HYBRID PERFORMANCE',
    desc: 'Boxing + Strength + Conditioning. The complete transformation for body and mind.',
    price: '3,500',
    popular: true,
    image: box2,
  },
  {
    id: 'perform',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#defb02]">
        <path d="M14 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="m14 14-2.5-3.5L9 12 7.5 9" />
        <path d="M14 14v4l-4 4" />
        <path d="m14 14 3.5-2L22 15" />
        <path d="M17 5l-2.5 3.5-3.5-.5" />
      </svg>
    ),
    title: 'PERFORM', 
    subtitle: 'HYROX LAB / PERFORMANCE BOXING',
    desc: 'For athletes and competitors. Build endurance, power and peak performance.',
    price: '4,500',
    image: box3,
  }
];

const pricingData = {
  start: {
    title: "START (FIGHT CLUB / STRENGTH LAB)",
    features: ["Boxing", "Strength Training", "Conditioning", "Community Access"],
    plans: [
      { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "7,999", perMonth: "2,666", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
      { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "13,999", perMonth: "2,333", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
      { months: "12 MONTHS", subtitle: "BEST VALUE", price: "23,999", perMonth: "2,000", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
    ],
    starterPrice: "2,999"
  },
  transform: {
    title: "TRANSFORM (HYBRID PERFORMANCE)",
    features: ["Boxing", "Strength Training", "Conditioning", "Recovery", "Nutrition Guidance"],
    plans: [
      { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "11,999", perMonth: "4,000", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
      { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "19,999", perMonth: "3,333", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking", "1 Body composition test", "Nutrition guidance"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
      { months: "12 MONTHS", subtitle: "BEST VALUE", price: "34,999", perMonth: "2,917", highlights: ["All group classes", "Strength & conditioning", "Open gym access", "BXC community access", "Progress tracking", "2 Body composition tests", "Nutrition guidance", "Priority batch booking", "Flexible membership support"], buttonText: "CHOOSE PLAN" }
    ],
    starterPrice: "3,999"
  },
  perform: {
    title: "PERFORM (HYROX LAB / PERFORMANCE BOXING)",
    features: ["Advanced Boxing", "HYROX Training", "Peak Performance", "Recovery", "Nutrition"],
    plans: [
      { months: "3 MONTHS", subtitle: "START YOUR JOURNEY", price: "14,999", perMonth: "5,000", highlights: ["All advanced classes", "HYROX specific training", "Open gym access", "BXC community access", "Progress tracking"], buttonText: "GET STARTED" },
      { months: "6 MONTHS", subtitle: "BEST PROGRESS", price: "25,999", perMonth: "4,333", highlights: ["All advanced classes", "HYROX specific training", "Open gym access", "BXC community access", "Progress tracking", "2 Body composition tests"], tag: "RECOMMENDED", buttonText: "CHOOSE PLAN", isPopular: true },
      { months: "12 MONTHS", subtitle: "BEST VALUE", price: "45,999", perMonth: "3,833", highlights: ["All advanced classes", "HYROX specific training", "Open gym access", "BXC community access", "Progress tracking", "Monthly body composition", "Nutrition planning", "Priority batch booking"], buttonText: "CHOOSE PLAN" }
    ],
    starterPrice: "4,999"
  }
};

const Membership = () => {
  const [activeTab, setActiveTab] = useState('transform');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const pricingRef = useRef(null);
  const activeData = pricingData[activeTab];

  const handlePlanSelect = (planName, price) => {
    setSelectedPlan({ name: planName, price: price });
    setIsModalOpen(true);
  };

  const handleScrollToPlans = (e, id) => {
    e.stopPropagation();
    setActiveTab(id);
    // Smooth scroll to the pricing section
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className="w-full bg-[#0a0a0a] py-8 md:py-12 px-4 md:px-6 flex flex-col items-center justify-center font-sans text-white">
        
        {/* STEP 1: CHOOSE PROGRAM */}
        <div className="w-full max-w-[1000px] mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-[#defb02] font-bold text-[10px] tracking-[0.2em] mb-1 uppercase">STEP 1</p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase mb-2">
              CHOOSE YOUR PROGRAM
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div 
                key={prog.id}
                onClick={() => setActiveTab(prog.id)}
                className={`relative rounded-xl p-5 lg:p-6 cursor-pointer transition-all duration-300 border group overflow-hidden ${
                  activeTab === prog.id ? 'border-[#defb02] shadow-[0_0_15px_rgba(222,251,2,0.15)] scale-[1.02]' : 'border-gray-800 hover:border-gray-600'
                }`}
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0 bg-black">
                  <div 
                    className="absolute inset-0 opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(${prog.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                </div>

                {prog.popular && (
                  <div className="absolute top-0 right-0 bg-[#defb02] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase z-20">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col h-full text-left">
                  <div className="w-12 h-12 rounded-full border border-[#defb02]/50 flex items-center justify-center mb-6 bg-black/40 backdrop-blur-sm">
                    {prog.icon}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl mb-1">{prog.title}</h3>
                  <p className="text-[#defb02] text-[11px] tracking-widest uppercase mb-4">{prog.subtitle}</p>
                  <p className="text-gray-300 text-[12px] mb-8 min-h-[50px] leading-relaxed max-w-[90%]">
                    {prog.desc}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <p className="text-[11px] text-gray-300 uppercase tracking-widest font-bold mb-4 flex items-center">
                      FROM <span className="text-lg text-[#defb02] mx-1.5">₹{prog.price}</span> / MONTH
                    </p>
                    
                    <button 
                      onClick={(e) => handleScrollToPlans(e, prog.id)}
                      className={`group/btn w-full py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center rounded-lg border ${
                        activeTab === prog.id ? 'bg-[#defb02] border-[#defb02] text-black' : 'border-gray-500 text-white hover:border-[#defb02] bg-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        VIEW PLANS <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#111] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-600 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-[#defb02]/30 rounded-full text-[#defb02]">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5">PREMIUM 1:1 COACHING</h4>
                  <p className="text-gray-400 text-[10px]">Personalized training. Faster results.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-600 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-[#defb02]/30 rounded-full text-[#defb02]">
                  <Star size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5">JUNIOR ATHLETES</h4>
                  <p className="text-gray-400 text-[10px]">Boxing & Fitness for kids and young athletes.</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
          </div> */}
       
        </div>

        {/* STEP 2: CHOOSE PLAN */}
        <div ref={pricingRef} className="w-full max-w-[1000px] border-t border-gray-800 pt-12 pb-8 scroll-mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-[#defb02] font-bold text-[10px] tracking-[0.2em] mb-1 uppercase">STEP 2</p>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-wide uppercase mb-3">
              CHOOSE YOUR PLAN – {activeData.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 text-[11px]">
              {activeData.features.map((feature, i) => (
                <React.Fragment key={i}>
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-[#defb02]" /> {feature}
                  </span>
                  {i < activeData.features.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6">
            
            {/* PRICING CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
              {activeData.plans.map((plan, i) => (
                <div 
                  key={i} 
                  className={`bg-[#111] rounded-xl flex flex-col relative border ${
                    plan.isPopular ? 'border-[#defb02] shadow-[0_0_15px_rgba(249,115,22,0.1)] scale-[1.02] z-10' : 'border-gray-800'
                  }`}
                >
                  {plan.tag && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#defb02] text-black text-[9px] font-bold px-3 py-0.5 rounded-sm tracking-wider uppercase whitespace-nowrap z-10">
                      {plan.tag}
                    </div>
                  )}
                  
                  <div className="p-5 md:p-6 flex flex-col items-center text-center border-b border-gray-800">
                    <h3 className="text-base font-extrabold tracking-wider mb-1">{plan.months}</h3>
                    <p className="text-[#defb02] text-[9px] font-bold tracking-widest uppercase mb-4">{plan.subtitle}</p>
                    <div className="flex items-start justify-center gap-1 mb-1">
                      <span className="text-lg font-bold mt-1">₹</span>
                      <span className="text-3xl md:text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    </div>
                    <p className="text-gray-400 text-[10px]">₹{plan.perMonth} / month</p>
                  </div>
                  
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-300">
                          <Check size={14} className="text-[#defb02] shrink-0 mt-0.5" />
                          <span className="leading-snug">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => handlePlanSelect(`${activeData.title} - ${plan.months}`, plan.price)}
                      className={`group/planbtn relative overflow-hidden w-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-lg ${
                      plan.isPopular ? 'bg-[#defb02] text-black' : 'border border-gray-600 text-white hover:border-white'
                    }`}>
                      <div className="absolute inset-0 bg-white translate-x-[100%] group-hover/planbtn:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
                      <span className={`relative z-10 transition-colors duration-300 ${plan.isPopular ? 'text-black' : 'group-hover/planbtn:text-black'}`}>
                        {plan.buttonText}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* STARTER ACCESS CARD */}
            <div className="w-full lg:w-[220px] flex flex-col gap-4 mt-6 lg:mt-0">
              <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-center flex flex-col items-center justify-center flex-1 hover:border-gray-600 transition-colors cursor-pointer group">
                <Calendar size={24} className="text-[#defb02] mb-3" />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 group-hover:text-gray-300">NOT SURE?</p>
                <h4 className="text-sm font-bold mb-3 leading-tight">Try 1 Month<br/>Starter Access</h4>
                <p className="text-2xl font-extrabold mb-5">₹{activeData.starterPrice}</p>
                <button 
                  onClick={() => handlePlanSelect(`1 Month Starter Access - ${activeData.title}`, activeData.starterPrice)}
                  className="group/trybtn relative overflow-hidden w-full py-2 border border-gray-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:border-white transition-colors"
                >
                  <div className="absolute inset-0 bg-white translate-x-[100%] group-hover/trybtn:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
                  <span className="relative z-10 transition-colors duration-300 group-hover/trybtn:text-black">
                    TRY NOW
                  </span>
                </button>
              </div>
              
              <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-center hover:border-gray-600 transition-colors">
                <Shield size={20} className="text-[#defb02] mx-auto mb-2" />
                <h4 className="text-xs font-bold mb-1">Flexible<br/>Membership<br/>Support</h4>
                <p className="text-[10px] text-gray-400">We've got your back when life happens.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      <PhonePeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planDetails={selectedPlan} 
      />
      <Foot />
      <GymMarquee />
    </>
  );
};

export default Membership;
