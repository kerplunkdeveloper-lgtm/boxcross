import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BuiltWithBest = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const logosRef = useRef([]);
  logosRef.current = [];

  const addToRefs = (el) => {
    if (el && !logosRef.current.includes(el)) {
      logosRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stunning 3D flip-in for central text
      gsap.from(textRef.current, {
        scale: 0.5,
        opacity: 0,
        rotationX: -45,
        rotation: -25,
        y: 100,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });

      // Majestic scattered entry for logos
      gsap.from(logosRef.current, {
        opacity: 0,
        scale: 0,
        y: 80,
        rotation: () => Math.random() * 40 - 20,
        duration: 1.2,
        stagger: 0.15,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        },
        onComplete: () => {
          // Add a subtle, continuous floating animation to all logos!
          gsap.to(logosRef.current, {
            y: "+=15",
            rotation: () => Math.random() * 6 - 3,
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: {
              amount: 1.5,
              from: "random"
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#030303] min-h-[60vh] md:min-h-screen py-24 px-4 relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Premium Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(163,255,0,0.06)_0%,_rgba(3,3,3,1)_60%)] z-0 pointer-events-none"></div>

      {/* Absolute positioning for scattered logos on ALL screens */}
      <div className="absolute inset-0 w-full h-full max-w-7xl mx-auto pointer-events-none z-10" style={{ perspective: "1000px" }}>
        
        {/* Nike Placeholder */}
        <div ref={addToRefs} className="absolute top-[8%] left-[15%] md:top-[15%] md:left-[25%] -translate-x-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(255,255,255,0.1)]">
          <span className="text-white text-5xl font-black italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>NIKE</span>
        </div>
        
        {/* Panatta Placeholder */}
        <div ref={addToRefs} className="absolute top-[8%] right-[15%] md:top-[15%] md:right-[25%] translate-x-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(0,229,255,0.2)]">
          <div className="text-[#00e5ff] border-[3px] border-[#00e5ff] rounded-[100%] px-6 py-1 text-2xl font-black italic tracking-widest flex items-center justify-center scale-y-75 shadow-[0_0_20px_rgba(0,229,255,0.4)] inset-shadow">
            <span className="scale-y-125">PANATTA</span>
          </div>
        </div>

        {/* Nautilus Placeholder */}
        <div ref={addToRefs} className="absolute top-[45%] left-[5%] md:top-[50%] md:left-[10%] -translate-y-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(255,102,0,0.2)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#ff6600] rounded-full border-t-transparent border-r-transparent transform -rotate-45 shadow-[0_0_10px_rgba(255,102,0,0.5)]"></div>
            <span className="text-white font-black italic tracking-widest text-xl" style={{ fontFamily: 'Arial, sans-serif' }}>NAUTILUS</span>
          </div>
        </div>

        {/* Realleader USA Placeholder */}
        <div ref={addToRefs} className="absolute top-[45%] right-[5%] md:top-[50%] md:right-[10%] -translate-y-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(0,229,255,0.2)]">
          <div className="flex items-baseline">
            <span className="text-[#00e5ff] text-5xl italic font-black mr-1" style={{ fontFamily: 'Arial, sans-serif' }}>R</span>
            <span className="text-white font-bold tracking-widest text-lg">ealleader USA</span>
          </div>
        </div>

        {/* SHUA Placeholder */}
        <div ref={addToRefs} className="absolute bottom-[10%] left-[20%] md:bottom-[20%] md:left-[28%] -translate-x-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(230,92,64,0.2)]">
          <div className="flex items-center gap-2 text-[#e65c40] font-black text-3xl tracking-widest" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex flex-col gap-1.5 -skew-x-12">
              <div className="w-5 h-2 bg-[#e65c40] shadow-[0_0_10px_rgba(230,92,64,0.5)]"></div>
              <div className="w-5 h-2 bg-[#e65c40] ml-3 shadow-[0_0_10px_rgba(230,92,64,0.5)]"></div>
            </div>
            SHUA
          </div>
        </div>

        {/* Booty Builder Placeholder */}
        <div ref={addToRefs} className="absolute bottom-[10%] right-[20%] md:bottom-[20%] md:right-[28%] translate-x-1/2 flex justify-center opacity-100 scale-50 md:scale-100 origin-center drop-shadow-[0_10px_15px_rgba(51,136,255,0.2)]">
          <div className="flex items-center gap-2">
            <div className="flex text-[#3388ff] text-xl">
              <span className="w-6 h-6 border-2 border-[#3388ff] rounded-full flex items-center justify-center font-bold text-[10px] bg-[#030303] z-10 shadow-[0_0_10px_rgba(51,136,255,0.5)]">B</span>
              <span className="w-6 h-6 border-2 border-[#3388ff] rounded-full flex items-center justify-center font-bold text-[10px] -ml-2 bg-[#030303] shadow-[0_0_10px_rgba(51,136,255,0.5)]">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-sans font-medium text-lg tracking-wider leading-none mb-1">Booty Builder</span>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest leading-none">The original hip thrust machine</span>
            </div>
          </div>
        </div>

      </div>

      {/* Central Text */}
      <div 
        ref={textRef} 
        className="flex flex-col items-center justify-center transform -rotate-6 z-20 my-16 md:my-0"
        style={{ perspective: "1000px" }}
      >
        <h2 
          className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-6xl sm:text-7xl md:text-[130px] font-black leading-[0.85] tracking-tight drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]" 
          style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
        >
          BUILT WITH
        </h2>
        <div className="relative">
          {/* Intense neon glow behind text */}
          <div className="absolute inset-0 bg-[#a3ff00] blur-[70px] opacity-25 rounded-full scale-110"></div>
          <h2 
            className="relative text-[#a3ff00] text-6xl sm:text-7xl md:text-[130px] font-black leading-[0.85] tracking-tight drop-shadow-[0_0_20px_rgba(163,255,0,0.5)]" 
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
          >
            THE BEST
          </h2>
        </div>
      </div>

    </section>
  );
};

export default BuiltWithBest;
