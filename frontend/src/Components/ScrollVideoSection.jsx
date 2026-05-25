import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import v2 from "../assets/v2.mp4"

gsap.registerPlugin(ScrollTrigger);

const SplitTextChars = ({ text }) => {
  return text.split("").map((char, i) => (
    <span 
      key={i} 
      className="char-span inline-block"
      style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
    >
      {char}
    </span>
  ));
};

const trainingZonesData = [
  {
    id: 0,
    title: "PULL PARTY",
    subtitle: "COMPLETE BACK DOMINATION",
    features: [
      "PRECISION LAT PULLDOWNS",
      "HEAVY COMPOUND ROWS",
      "REAR DELT ISOLATION"
    ],
    buttonText: "VIEW MEMBERSHIP"
  },
  {
    id: 1,
    title: "PUSH POWER",
    subtitle: "CHEST & TRICEPS OVERLOAD",
    features: [
      "INCLINE PRESS MASTERY",
      "CABLE FLY ISOLATION",
      "TRICEP EXTENSION ZONES"
    ],
    buttonText: "VIEW MEMBERSHIP"
  },
  {
    id: 2,
    title: "LEG LEGACY",
    subtitle: "LOWER BODY DESTRUCTION",
    features: [
      "HACK SQUAT MACHINE",
      "HEAVY LEG PRESS",
      "HAMSTRING CURL ISOLATION"
    ],
    buttonText: "VIEW MEMBERSHIP"
  },
  {
    id: 3,
    title: "CORE CRUSHER",
    subtitle: "ABDOMINAL SCULPTING",
    features: [
      "WEIGHTED CRUNCH STATIONS",
      "OBLIQUE TWISTERS",
      "PLANK VARIATION ZONES"
    ],
    buttonText: "VIEW MEMBERSHIP"
  },
  {
    id: 4,
    title: "CARDIO BURN",
    subtitle: "ENDURANCE & STAMINA",
    features: [
      "HIIT TREADMILLS",
      "STAIR CLIMBERS",
      "ASSAULT BIKES"
    ],
    buttonText: "VIEW MEMBERSHIP"
  },


];

const ScrollVideoSection = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const introTextRef1 = useRef(null);
  const introTextRef2 = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ctx;

    const initAnimations = () => {
      ctx = gsap.context(() => {
        const sections = gsap.utils.toArray(".step");

        video.pause();
        video.currentTime = 0;

        // Automatically calculate perfect segments based on the actual video length!
        // This ensures the moving animation works perfectly for v2.mp4 or ANY video.
        const totalDuration = video.duration || 15; 
        const segmentLength = totalDuration / sections.length;

        // 1. Premium Video Scrubbing Timeline (Perfect UI/UX)
        const videoTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, // 1.5 seconds of buttery smooth easing
          }
        });

        sections.forEach((step, i) => {
          // Add a mathematically perfect segment to the timeline
          videoTl.fromTo(
            video,
            { currentTime: i * segmentLength },
            { currentTime: (i + 1) * segmentLength, ease: "none", duration: 1 }
          );

          // 2. Smooth Content Animation trigger
          const isEven = i % 2 === 0;
          const contentElements = step.querySelectorAll("h1, h3, li, button");
          if (contentElements.length > 0) {
            gsap.fromTo(
              contentElements,
              { 
                opacity: 0, 
                x: isEven ? -150 : 150, 
                rotationY: isEven ? -25 : 25,
                scale: 0.95
              },
              {
                opacity: 1,
                x: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.4,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: {
                  trigger: step,
                  start: "top 75%",
                  toggleActions: "play reverse play reverse",
                },
              }
            );
          }
        });

        // 3. Intro text animation
        if (introTextRef1.current && introTextRef2.current) {
          const chars1 = introTextRef1.current.querySelectorAll('.char-span');
          const chars2 = introTextRef2.current.querySelectorAll('.char-span');
          
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: introTextRef1.current,
              start: "top 80%",
            }
          });

          tl.from(chars1, {
            y: 80,
            opacity: 0,
            rotationX: -90,
            stagger: 0.03,
            duration: 0.8,
            ease: "back.out(1.5)",
            transformOrigin: "50% 50% -50px"
          })
          .from(chars2, {
            y: 80,
            opacity: 0,
            rotationX: -90,
            stagger: 0.03,
            duration: 0.8,
            ease: "back.out(1.5)",
            transformOrigin: "50% 50% -50px"
          }, "-=0.4");
        }

      }, containerRef);
    };

    // CRITICAL FIX: Wait for video metadata to load before initializing GSAP!
    if (video.readyState >= 1) {
      initAnimations();
    } else {
      video.addEventListener("loadedmetadata", initAnimations);
    }

    return () => {
      if (ctx) ctx.revert();
      video.removeEventListener("loadedmetadata", initAnimations);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
    >
      {/* Sticky Background Video (Ensures the video is ONLY visible within this component) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source
            src={v2}
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Scroll Sections */}
      {/* Negative margin ensures these sections scroll over the sticky video */}
      <div className="relative z-10 -mt-[100vh] overflow-x-hidden">
        {/* Intro Section - Smart Training Zones */}
        <section className="w-full min-h-screen flex items-center justify-center bg-[#050505] px-4 relative z-20">
            <div className="flex flex-col items-center justify-center" style={{ perspective: '1200px' }}>
              <h2 
                ref={introTextRef1}
                className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] leading-[0.85] tracking-tight font-bold uppercase text-center" 
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                <SplitTextChars text="SMART TRAINING" />
              </h2>
              <h2 
                ref={introTextRef2}
                className="text-[#a3ff00] text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] leading-[0.85] tracking-tight font-bold uppercase text-center" 
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                <SplitTextChars text="ZONES" />
              </h2>
            </div>
        </section>

        {trainingZonesData.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
          <section
            key={item.id}
            className={`step min-h-screen flex items-center px-6 md:px-16 lg:px-24 xl:px-32 w-full ${isEven ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex flex-col max-w-xl md:max-w-2xl lg:max-w-3xl ${isEven ? 'items-start text-left' : 'items-end text-right'}`}>
              {/* Title */}
              <h1 
                className="text-white text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold uppercase leading-[0.85] tracking-tight mb-2" 
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {item.title}
              </h1>
              
              {/* Subtitle */}
              <h3 
                className="text-[#a3ff00] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-8"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {item.subtitle}
              </h3>

              {/* Features List */}
              <ul className={`flex flex-col gap-4 mb-10 ${isEven ? 'items-start' : 'items-end'}`}>
                {item.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-4 ${isEven ? '' : 'flex-row-reverse'}`}>
                    {/* Checkmark icon */}
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#a3ff00] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span 
                      className={`text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider ${isEven ? 'text-left' : 'text-right'}`}
                      style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button 
                className="bg-[#a3ff00] text-black text-xl md:text-2xl font-bold uppercase px-10 py-4 tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {item.buttonText}
              </button>
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollVideoSection;