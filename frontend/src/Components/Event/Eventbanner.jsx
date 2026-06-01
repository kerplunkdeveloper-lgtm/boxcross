import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Video,
  Image as ImageIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getActiveBanners } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";

const Eventbanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const autoPlayRef = useRef(null);

  // Fallback banners in case database is empty on fresh start
  const defaultBanners = [
    {
      _id: "default-1",
      title: "BoxCross Strength & Power Clash",
      description:
        "Gear up for the ultimate powerlifting showdown. Showcase your strength, break personal records, and claim the championship title. Registrations are open now!",
      mediaUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      _id: "default-2",
      title: "CrossFit Elite Games 2026",
      description:
        "Push your cardiovascular limits, conquer advanced gymnastics, and complete high-intensity workouts alongside BoxCross's top athletes. Witness or participate in our biggest event of the year.",
      mediaUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop",
      mediaType: "image",
    },
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await getActiveBanners();
        if (data.success && data.data.length > 0) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error(
          "Failed to load active event banners, using defaults",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  // Autoplay function
  const startAutoplay = () => {
    stopAutoplay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 8000); // Change slides every 8 seconds
  };

  const stopAutoplay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    if (displayBanners.length > 1) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [displayBanners, currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayBanners.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === displayBanners.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Framer Motion Animation Variants for Sliding effect
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  if (loading) {
    return (
      <section className="w-full aspect-video sm:aspect-auto sm:h-[70vh] md:h-[80vh] bg-black flex flex-col items-center justify-center relative z-10 border-b border-white/5">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-[#e5ff00]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span
            className="text-xs uppercase tracking-widest text-gray-500 font-bold"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            Loading Event Arena...
          </span>
        </div>
      </section>
    );
  }

  const currentBanner = displayBanners[currentIndex];

  return (
    <section
      className="relative w-full aspect-video sm:aspect-auto sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden select-none z-10 border-b border-white/5"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* 1. SLIDES - ANIMATED */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentBanner._id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Visual Media Background */}
            <div className="absolute inset-0 w-full h-full bg-black">
              {currentBanner.mediaType === "video" ? (
                <div className="w-full h-full relative">
                  <video
                    src={currentBanner.mediaUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                  />
                  {/* Mute/Unmute Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute bottom-5 sm:bottom-20 right-4 sm:right-10 z-30 p-2 sm:p-2.5 bg-black/60 hover:bg-black/90 hover:scale-105 text-white border border-white/10 rounded-full transition-all cursor-pointer"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? (
                      <VolumeX size={12} className="sm:w-4 sm:h-4" />
                    ) : (
                      <Volume2 size={12} className="sm:w-4 sm:h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <img
                  src={currentBanner.mediaUrl}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              )}
            </div>

            {/* Premium Dark Vignette and Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 z-10" />
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

            {/* Content Details Layer */}
            <div className="absolute inset-0 flex flex-col justify-end z-20 pb-6 sm:pb-20 md:pb-24 px-4 sm:px-16 lg:px-24">
              <div className="max-w-3xl">
                {/* Event Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full bg-[#e5ff00]/10 border border-[#e5ff00]/30 text-[#e5ff00] text-[15px] sm:text-[20px] font-black uppercase tracking-wider mb-1.5 sm:mb-4"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <Calendar size={10} className="sm:w-3 sm:h-3 animate-pulse" />
                  Upcoming Event
                </motion.div>

                {/* Banner Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-1.5 sm:mb-4 leading-none"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {currentBanner.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-gray-300 text-xl sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed mb-2 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-3 text-white/80"
                  style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                >
                  {currentBanner.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. NAVIGATION ARROWS (Only show if multiple banners) */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#e5ff00] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center transition-all duration-300 group cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft
              size={16}
              className="sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5"
            />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#e5ff00] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center transition-all duration-300 group cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight
              size={16}
              className="sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </>
      )}

      {/* 3. PAGINATION DOTS (Only show if multiple banners) */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
          {displayBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-[#e5ff00]"
                  : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Eventbanner;
