import React from 'react';

const ReformerPilates = () => {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center bg-[#111111] overflow-hidden">
      
      {/* Background Image Area */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
       
          backgroundImage: "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop')",
          backgroundPosition: "center 40%"
        }}
      >
        {/* Dark overlay for text readability - stronger on mobile, fading out on desktop */}
        <div className="absolute inset-0 bg-black/70 md:bg-gradient-to-r md:from-black/95 md:via-black/60 md:to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center">
        <div className="max-w-2xl flex flex-col items-start">
          
          {/* Main Title */}
          <h2 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-black leading-[0.85] tracking-tight mb-6" 
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
          >
            <span className="text-white drop-shadow-lg">REFORMER </span>
            <span className="text-[#a3ff00] drop-shadow-lg">PILATES</span>
          </h2>

          {/* Description Text */}
          <p className="text-gray-200 text-lg md:text-xl lg:text-2xl font-sans mb-10 leading-relaxed max-w-xl drop-shadow-md">
            Transform your core, flexibility, and strength with our state-of-the-art reformer sessions. Now open for members and non-members.
          </p>

          {/* Call to Action Button */}
          <button className="bg-[#a3ff00] hover:bg-white  text-black font-bold text-md md:text-xl px-8 py-4 rounded-xl transition-transform duration-300 hover:scale-105 tracking-widest uppercase  shadow-[0_0_20px_rgba(163,255,0,0.3)]">
            View Pricing & Timings
          </button>

        </div>
      </div>
      
    </section>
  );
};

export default ReformerPilates;
