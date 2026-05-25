import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import founder1 from "../assets/1.webp";
import founder2 from "../assets/2.webp";
import founder3 from "../assets/3.webp";



gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const scrollTextRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoContentRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const horizontalSlidesRef = useRef(null);

  const founders = [
    {
      name: "VIVEK",
      role: "CO FOUNDER",
      desc: "Ensuring WooHoo remains Bangalore's premier fitness destination.",
      img: founder1
    },
    {
      name: "KHALEEL",
      role: "CO FOUNDER",
      desc: "Building the strongest fitness community in the heart of the city.",
      img: founder2 
    },
    {
      name: "THOMAS",
      role: "HEADCOACH",
      desc: "Designing world-class training programs for elite results.",
      img: founder3 
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
        }
      });

      // 1. Fade out "SCROLL TO ENTER" immediately as scroll starts
      tl.to(scrollTextRef.current, {
        opacity: 0,
        duration: 0.1
      }, 0);

      // 2. Scale the text massively to zoom "through" the 'O'
      // We also fade it out towards the end to transition smoothly
      tl.to(textRef.current, {
        scale: 120,
        opacity: 0,
        duration: 1,
        ease: "power2.in"
      }, 0);

      // 3. Fade in the video banner section as the zoom happens
      tl.fromTo(videoSectionRef.current, {
        opacity: 0,
        scale: 1.1
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power1.out"
      }, 0.5);

      // 4. Staggered reveal for the text and button inside the video banner
      tl.fromTo(videoContentRef.current.children, {
        y: 50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, 0.7);

      // 5. Horizontal scroll for the founders section
      if (horizontalContainerRef.current && horizontalSlidesRef.current) {
        gsap.to(horizontalSlidesRef.current, {
          x: () => -(horizontalSlidesRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalContainerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (founders.length - 1),
            invalidateOnRefresh: true,
            end: () => "+=" + horizontalSlidesRef.current.scrollWidth
          }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#050505] relative w-full ">
      {/* The sticky container that holds the entire animation */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black flex items-center justify-center">
        
        {/* about hero section  */}
        {/* The ABOUT Text Layer */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1 
            ref={textRef} 
            className="text-[#a3ff00] text-[25vw] md:text-[32vw] font-black leading-none m-0 p-0 tracking-tight"
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif', transformOrigin: "50% 50%" }}
          >
            ABOUT
          </h1>
        </div>

        {/* Scroll To Enter Indicator */}
        <div ref={scrollTextRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <span className="text-gray-500 tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase">Scroll to enter</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#a3ff00] to-transparent"></div>
        </div>

        {/* Video Banner Layer (Revealed after zooming into 'O') */}
        <div ref={videoSectionRef} className="absolute inset-0 z-30  opacity-0 w-full h-full flex flex-col items-center justify-center pointer-events-auto bg-black">
           {/* Background Video */}
           <video 
             autoPlay 
             loop 
             muted 
             playsInline
             className="absolute inset-0 w-full h-full object-cover opacity-60"
           >
             {/* Using a stable Mixkit direct video link because Pexels blocks localhost embedding */}
             <source src="https://www.pexels.com/download/video/12188774/" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-0"></div>

           {/* Content inside video banner */}
           <div ref={videoContentRef} className="relative z-10 text-center px-4 max-w-5xl mt-20">
             <h4 className="text-[#a3ff00] font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 drop-shadow-md">
               ESTABLISHED IN BANGALORE
             </h4>
             
             <h2 className="text-6xl sm:text-7xl md:text-[90px] lg:text-[120px] font-black text-white leading-[0.9] tracking-tight mb-6 drop-shadow-2xl" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
               A WHOLE<br/>
               <span className="text-[#a3ff00]">NEW WORLD</span>
             </h2>
             
            
             
            
           </div>
        </div>

      </div>

      {/* =========================================
          THE VISIONARIES SECTION
          ========================================= */}
      <section className="relative w-full bg-black py-32 px-4 flex flex-col items-center justify-center border-t border-[#111]">
        
        {/* Floating Green Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-[#a3ff00] rounded-full opacity-30 animate-pulse shadow-[0_0_10px_#a3ff00]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h4 className="text-[#a3ff00] font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            THE VISIONARIES
          </h4>
          
          <h2 className="text-5xl md:text-7xl lg:text-[90px] font-black text-white uppercase leading-none mb-10 tracking-tight" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            BEHIND THE VISION
          </h2>
          
          {/* Subtle separator line */}
          <div className="w-full max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-[#222] to-transparent "></div>
          
          <p className="text-gray-400 text-sm md:text-base lg:text-lg font-medium leading-relaxed mx-auto max-w-2xl">
            From day one, our goal was simple to create Bangalore's premier fitness destination. We built a space that pulses with energy where elite equipment, a strong community, and a drive for real results come together. WooHoo is the result of that vision.
          </p>
        </div>
      </section>

      {/* =========================================
          HORIZONTAL SCROLL SLIDES (FOUNDERS)
          ========================================= */}
      <div ref={horizontalContainerRef} className=" h-screen w-full bg-[#050505] overflow-hidden flex flex-col justify-center border-t border-[#1a1a1a]">
        <div 
          ref={horizontalSlidesRef} 
          className="flex h-full"
          style={{ width: `${founders.length * 100}vw` }}
        >
          {founders.map((founder, i) => (
            <div key={i} className="w-screen h-full flex items-end justify-center relative flex-shrink-0 overflow-hidden bg-black pb-0 md:pb-10">
              
              {/* Floating Green Particles for continuity */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(15)].map((_, j) => (
                  <div 
                    key={j} 
                    className="absolute w-1 h-1 bg-[#a3ff00] rounded-full opacity-30 animate-pulse shadow-[0_0_10px_#a3ff00]"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Massive Neon Background Text */}
              <h1 
                className="text-[32vw] md:text-[35vw] font-black text-[#a3ff00] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap" 
                style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
              >
                {founder.name}
              </h1>

              {/* Person Image (Ideally a transparent PNG) */}
              {/* Added a subtle gradient mask in case a full rectangular image is used, so it blends nicely into the bottom */}
              <img 
                src={founder.img} 
                alt={founder.name} 
                className="relative z-10 h-[60vh] md:h-[80vh] object-cover object-top"
                style={{
                  maskImage: 'linear-gradient(to top, transparent 0%, black 15%)', 
                  WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' 
                }}
              />

              {/* Bottom Right Info text */}
              <div className="absolute bottom-8 right-6 md:bottom-12 md:right-16 z-20 text-right">
                <h3 className="text-[#a3ff00] text-3xl md:text-5xl font-black uppercase tracking-widest drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                  {founder.role}
                </h3>
                <p className="text-[#a3ff00] text-xs md:text-sm font-bold max-w-[200px] md:max-w-[280px] ml-auto mt-2 leading-relaxed drop-shadow-md">
                  {founder.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          FEATURE BLOCKS SECTION (SMART ZONES / COMMUNITY)
          ========================================= */}
      <section className="relative w-full bg-black py-24 md:py-40 px-6 md:px-10 lg:px-20 border-t border-[#1a1a1a] overflow-hidden">
        
        {/* Floating Green Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, j) => (
            <div 
              key={j} 
              className="absolute w-1 h-1 bg-[#a3ff00] rounded-full opacity-30 animate-pulse shadow-[0_0_10px_#a3ff00]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Container for the 2 blocks */}
        <div className="max-w-7xl mx-auto flex flex-col gap-32 md:gap-48 relative z-10">
          


  {/* Block 0*/}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left mt-4 md:mt-0">
              <h4 className="text-[#a3ff00] font-black tracking-widest text-xs md:text-sm uppercase mb-3" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
           FORMING A HABIT
              </h4>
              <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[0.9] tracking-tight mb-6 uppercase drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            ELITE<br/>EQUIPMENT
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg">
         6,000 sq ft of elite equipment from Panatta, Nautilus, Real Leader, Shua, Booty Builder, and Nike. We don't compromise on quality because you shouldn't compromise on your results.
              </p>
              <button className="bg-transparent border border-[#333] text-white font-bold uppercase tracking-widest px-10 py-4 text-xs md:text-sm hover:border-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm">
                VIEW EQUIPMENT
              </button>
            </div>

            {/* Image Container */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative group w-full max-w-[550px] mx-auto md:mx-0">
                {/* Offset neon outline (Top Right) */}
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-[#a3ff00] rounded-[2rem] md:rounded-[3rem] z-0 transition-all duration-500 group-hover:-top-6 group-hover:-right-6 md:group-hover:-top-8 md:group-hover:-right-8"></div>
                {/* Image itself */}
                <div className="relative z-10 w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-square bg-gray-900 shadow-2xl">
                  <img 
                    src="https://images.pexels.com/photos/33258636/pexels-photo-33258636.jpeg" 
                    alt="Vibrant Community" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>






          
          {/* Block 1: Smart Zones (Image Left, Text Right) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
            {/* Image Container */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <div className="relative group w-full max-w-[550px] mx-auto md:mx-0">
                {/* Offset neon outline (Top Left) */}
                <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-full h-full border border-[#a3ff00] rounded-[2rem] md:rounded-[3rem] z-0 transition-all duration-500 group-hover:-top-6 group-hover:-left-6 md:group-hover:-top-8 md:group-hover:-left-8"></div>
                {/* Image itself */}
                <div className="relative z-10 w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-square bg-gray-900 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000" 
                    alt="Smart Zones" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left mt-4 md:mt-0">
              <h4 className="text-[#a3ff00] font-black tracking-widest text-xs md:text-sm uppercase mb-3" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                THE NEXT LEVEL
              </h4>
              <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[0.9] tracking-tight mb-6 uppercase drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                SMART<br/>ZONES
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg">
                Split into smart training zones for effortless flow. From Panatta's machines to dedicated recovery, and functional zones, every detail has been built to help you train smarter and stronger.
              </p>
              <button className="bg-transparent border border-[#333] text-white font-bold uppercase tracking-widest px-10 py-4 text-xs md:text-sm hover:border-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm">
                VIEW ZONES
              </button>
            </div>
          </div>


          {/* Block 2: Vibrant Community (Text Left, Image Right) */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left mt-4 md:mt-0">
              <h4 className="text-[#a3ff00] font-black tracking-widest text-xs md:text-sm uppercase mb-3" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                BELONGING
              </h4>
              <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[0.9] tracking-tight mb-6 uppercase drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                VIBRANT<br/>COMMUNITY
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg">
                At WooHoo, fitness is about more than just lifting weights. It's about being part of a community that actually shows up. Whether you're a beginner or a seasoned athlete, you'll find the support you need to hit your goals.
              </p>
              <button className="bg-transparent border border-[#333] text-white font-bold uppercase tracking-widest px-10 py-4 text-xs md:text-sm hover:border-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm">
                JOIN US
              </button>
            </div>

            {/* Image Container */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative group w-full max-w-[550px] mx-auto md:mx-0">
                {/* Offset neon outline (Top Right) */}
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-[#a3ff00] rounded-[2rem] md:rounded-[3rem] z-0 transition-all duration-500 group-hover:-top-6 group-hover:-right-6 md:group-hover:-top-8 md:group-hover:-right-8"></div>
                {/* Image itself */}
                <div className="relative z-10 w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-square bg-gray-900 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Vibrant Community" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>



       


        </div>
      </section>

      {/* =========================================
          PUSH YOUR LIMITS SECTION
          ========================================= */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden border-t border-[#1a1a1a]">
        
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          {/* Using a stable Mixkit direct video link */}
          <source src="https://www.pexels.com/download/video/32115638/" />
        </video>
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 flex flex-col items-center w-full max-w-5xl">
          <h2 className="text-6xl sm:text-7xl md:text-[90px] lg:text-[130px] font-black text-white leading-[0.9] tracking-tight mb-8 drop-shadow-2xl uppercase" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
            PUSH YOUR <span className="text-[#a3ff00]">LIMITS</span>
          </h2>
          
          <button 
            className="bg-[#a3ff00] text-black font-black uppercase tracking-widest px-8 md:px-12 py-4 rounded-sm hover:bg-[#8ee000] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(163,255,0,0.3)] text-sm md:text-lg"
            style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}
          >
            START TRAINING TODAY
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;