import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  LayoutGrid,
  Columns3,
  Play,
  Pause,
  Sparkles,
  Eye
} from "lucide-react";
import h1 from '../../assets/images/e1.JPG';
import h2 from '../../assets/images/e2.JPG';
import h3 from '../../assets/images/e3.JPG';
import h4 from '../../assets/images/e4.JPG';
import h5 from '../../assets/images/e5.JPG';
import h6 from '../../assets/images/e6.JPG';
import h7 from '../../assets/images/e7.JPG';
import h8 from '../../assets/images/e8.JPG';
import h9 from '../../assets/images/e9.JPG';
import h10 from '../../assets/images/e10.JPG';
import h11 from '../../assets/images/e11.JPG';
import h12 from '../../assets/images/e12.JPG';
import h13 from '../../assets/images/e13.JPG';
import h14 from '../../assets/images/e14.JPG';
import h15 from '../../assets/images/e15.JPG';
import h16 from '../../assets/images/e16.JPG';
import h17 from '../../assets/images/e17.JPG';
import h18 from '../../assets/images/e18.JPG';
import h19 from '../../assets/images/e19.JPG';
import h20 from '../../assets/images/e20.JPG';
import h21 from '../../assets/images/e21.JPG';
import h22 from '../../assets/images/e22.JPG';
import h23 from '../../assets/images/e23.JPG';
import h24 from '../../assets/images/e24.JPG';
import h25 from '../../assets/images/e25.JPG';
import h26 from '../../assets/images/e26.JPG';
import h27 from '../../assets/images/e27.JPG';
import h28 from '../../assets/images/e28.JPG';
import h29 from '../../assets/images/e29.JPG';

const highlightImages = [
  h1, h2, h3, h4, h5, h6, h7, h8, h9, h10,
  h11, h12, h13, h14, h15, h16, h17, h18, h19, h20,
  h21, h22, h23, h24, h25, h26, h27, h28, h29
];

const Eventhighlight = () => {
  const [viewMode, setViewMode] = useState("slider"); // 'slider' | 'grid'
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Lightbox Modal state
  const [modalProgress, setModalProgress] = useState(0); // 0 to 100
  const [isModalPaused, setIsModalPaused] = useState(false);
  const MODAL_DURATION = 4000; // 4 seconds per slide

  const scrollRef = useRef(null);
  const thumbnailScrollRef = useRef(null);

  // Scroll to Next Slide in Slider View
  const scrollNext = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const firstChild = scrollRef.current.children[0];
      const itemWidth = firstChild ? firstChild.offsetWidth + 20 : 360;

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        setCurrentSlideIndex(0);
      } else {
        scrollRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }
  }, []);

  // Scroll to Previous Slide in Slider View
  const scrollPrev = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth } = scrollRef.current;
      const firstChild = scrollRef.current.children[0];
      const itemWidth = firstChild ? firstChild.offsetWidth + 20 : 360;

      if (scrollLeft <= 10) {
        scrollRef.current.scrollTo({
          left: scrollWidth,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
      }
    }
  };

  // Track active slide on scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0];
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 20;
        const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
        setCurrentSlideIndex(Math.min(Math.max(index, 0), highlightImages.length - 1));
      }
    }
  };

  // Autoplay timer for Slider
  useEffect(() => {
    if (!isAutoPlaying || isHovered || viewMode !== "slider") return;
    const timer = setInterval(() => {
      scrollNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, viewMode, scrollNext]);

  // Modal Next and Prev with progress reset
  const modalNext = useCallback(() => {
    setActiveModalIndex((prev) =>
      prev !== null ? (prev < highlightImages.length - 1 ? prev + 1 : 0) : null
    );
    setModalProgress(0);
  }, []);

  const modalPrev = useCallback(() => {
    setActiveModalIndex((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : highlightImages.length - 1) : null
    );
    setModalProgress(0);
  }, []);

  // Auto-advance progress timer for Modal
  useEffect(() => {
    if (activeModalIndex === null) {
      setModalProgress(0);
      return;
    }

    if (isModalPaused) return;

    setModalProgress(0);
    const intervalTime = 30; // 30ms tick
    const step = (intervalTime / MODAL_DURATION) * 100;

    const timer = setInterval(() => {
      setModalProgress((prev) => {
        if (prev + step >= 100) {
          modalNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeModalIndex, isModalPaused, modalNext]);

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalIndex(null);
      } else if (e.key === "ArrowLeft") {
        modalPrev();
      } else if (e.key === "ArrowRight") {
        modalNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModalIndex, modalNext, modalPrev]);

  // Touch swipe support for Mobile Lightbox Modal
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    const diffX = touchStartRef.current.x - touchEndRef.current.x;
    const diffY = touchStartRef.current.y - touchEndRef.current.y;

    // Horizontal swipe threshold: 40px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped Left -> Next Image
        modalNext();
      } else {
        // Swiped Right -> Previous Image
        modalPrev();
      }
    } else if (diffY < -75 && Math.abs(diffY) > Math.abs(diffX)) {
      // Swiped Downwards -> Close modal
      setActiveModalIndex(null);
    }
  };

  // Center active thumbnail in modal
  useEffect(() => {
    if (activeModalIndex !== null && thumbnailScrollRef.current) {
      const container = thumbnailScrollRef.current;
      const activeThumb = container.children[activeModalIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeModalIndex]);

  return (
    <section className="w-full py-8 sm:py-12 md:py-20 px-3 sm:px-6 md:px-8 bg-neutral-950/80 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[220px] sm:h-[350px] bg-[#ccf141]/5 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] bg-[#ccf141]/5 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-10 pb-5 sm:pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3 shadow-[0_0_15px_rgba(204,241,65,0.15)]">
              <Sparkles size={13} className="animate-pulse" />
              <span>Event Visual Archives</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
              Event <span className="text-[#ccf141]">Highlights</span>
            </h2>
            <p className="text-neutral-400 mt-1 sm:mt-2 max-w-xl text-xs sm:text-sm md:text-base font-normal">
              Relive the high adrenaline, community triumphs, and peak performance captured across our athletic battles and workshops.
            </p>
          </div>

          {/* View Mode & Carousel Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* View Switcher Tabs (Full width 50/50 on Mobile for Easy Thumb Tapping) */}
            <div className="grid grid-cols-2 sm:flex items-center bg-neutral-900/90 p-1 sm:p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-md">
              <button
                onClick={() => setViewMode("slider")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  viewMode === "slider"
                    ? "bg-[#ccf141] text-black shadow-md shadow-[#ccf141]/20 font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
                title="Slider Showcase"
              >
                <Columns3 size={15} />
                <span>Slider</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#ccf141] text-black shadow-md shadow-[#ccf141]/20 font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
                title="View All Gallery Grid"
              >
                <LayoutGrid size={15} />
                <span>All ({highlightImages.length})</span>
              </button>
            </div>

            {/* Slider Navigation Buttons (Visible in Slider Mode) */}
            {viewMode === "slider" && (
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                    isAutoPlaying
                      ? "bg-neutral-900/80 text-[#ccf141] border-[#ccf141]/30 hover:bg-neutral-800"
                      : "bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white hover:bg-neutral-800"
                  }`}
                  title={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
                  aria-label="Toggle Autoplay"
                >
                  {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="flex items-center gap-1 sm:gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                  <button
                    onClick={scrollPrev}
                    className="p-1.5 sm:p-2 text-white hover:text-[#ccf141] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-mono font-medium text-neutral-400 px-1.5 sm:px-2 select-none">
                    <span className="text-[#ccf141] font-bold">
                      {String(currentSlideIndex + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(highlightImages.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={scrollNext}
                    className="p-1.5 sm:p-2 text-white hover:text-[#ccf141] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- SLIDER VIEW ---------------- */}
        {viewMode === "slider" ? (
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Scrollable Container with Mobile Peeking Cards */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-5 pb-4 sm:pb-6 scroll-smooth select-none hide-scrollbar cursor-grab active:cursor-grabbing"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {highlightImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setActiveModalIndex(index);
                    setModalProgress(0);
                  }}
                  className="snap-start shrink-0 w-[78vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] aspect-[4/5] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden relative group/card cursor-pointer border border-white/10 hover:border-[#ccf141]/60 bg-neutral-900 shadow-xl hover:shadow-[0_12px_30px_rgba(204,241,65,0.15)] active:scale-[0.98] transition-all duration-300"
                >
                  {/* Image */}
                  <img
                    src={img}
                    alt={`Box & Cross Highlight ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-108"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 group-hover/card:from-black/90 transition-colors duration-300" />

                  {/* Top Badge: Moment Index */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] sm:text-xs font-mono font-medium">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ccf141] animate-ping" />
                    <span>#{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  {/* Hover / Tap Quick Action */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 group-hover/card:text-[#ccf141] group-hover/card:border-[#ccf141]/40 transition-all duration-300">
                    <Maximize2 size={15} />
                  </div>

                  {/* Bottom Info & Action */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 flex items-end justify-between gap-2 sm:gap-3">
                    <div>
                      <p className="text-[#ccf141] text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-0.5 sm:mb-1">
                        Moment Capture
                      </p>
                      <h4 className="text-white font-bold text-sm sm:text-base md:text-lg line-clamp-1">
                        Action #{index + 1}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#ccf141] text-black text-[11px] sm:text-xs font-bold shadow-md shadow-[#ccf141]/30 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint bar below slider */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-500 pt-1.5 sm:pt-2 px-1">
              <span>💡 Tap photo for Full-Screen HD View</span>
              <span className="hidden sm:inline">Use arrows or swipe to explore more</span>
            </div>
          </div>
        ) : (
          /* ---------------- GALLERY GRID VIEW (2-COLUMN MOBILE RESPONSIVE) ---------------- */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 animate-fadeIn">
            {highlightImages.map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveModalIndex(index);
                  setModalProgress(0);
                }}
                className="group relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#ccf141]/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_8px_25px_rgba(204,241,65,0.2)] active:scale-95"
              >
                {/* Image */}
                <img
                  src={img}
                  alt={`Highlight ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Index Pill */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] font-mono">
                  #{String(index + 1).padStart(2, "0")}
                </div>

                {/* Center Hover Action */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ccf141] text-black flex items-center justify-center shadow-lg shadow-[#ccf141]/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={18} />
                  </div>
                  <span className="text-white text-[10px] sm:text-xs font-bold tracking-wide uppercase bg-black/70 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md backdrop-blur-sm border border-white/10">
                    HD View
                  </span>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white text-[11px] sm:text-xs font-semibold truncate opacity-80 group-hover:opacity-100">
                  Highlight #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- FULLSCREEN HD LIGHTBOX MODAL WITH MOBILE SWIPE ---------------- */}
      {activeModalIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/98 backdrop-blur-2xl transition-all duration-300 select-none overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalIndex(null);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Progress Loading Bar (Stories Style) */}
          <div className="w-full bg-white/10 relative h-1 sm:h-1.5 overflow-hidden z-40">
            <div
              className="h-full bg-gradient-to-r from-lime-400 via-[#ccf141] to-lime-200 shadow-[0_0_15px_#ccf141] transition-[width] duration-75 ease-linear"
              style={{ width: `${modalProgress}%` }}
            />
          </div>

          {/* Modal Header Bar */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 z-40">
            {/* Left: Counter & Status */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#ccf141]/15 border border-[#ccf141]/40 text-[#ccf141] text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(204,241,65,0.25)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ccf141] animate-ping" />
                <span>
                  {activeModalIndex + 1} / {highlightImages.length}
                </span>
              </span>
              <span className="hidden md:inline text-neutral-300 text-xs font-medium tracking-wide">
                Box & Cross Visual Archive
              </span>
            </div>

            {/* Center: Autoplay Status & Play/Pause Button */}
            <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-white/15 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md shadow-lg">
              <button
                onClick={() => setIsModalPaused(!isModalPaused)}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white hover:text-[#ccf141] transition-colors cursor-pointer"
                title={isModalPaused ? "Resume Autoplay" : "Pause Autoplay"}
              >
                {isModalPaused ? (
                  <>
                    <Play size={13} className="text-[#ccf141] fill-[#ccf141]" />
                    <span className="text-neutral-300">Paused</span>
                  </>
                ) : (
                  <>
                    <Pause size={13} className="text-[#ccf141] fill-[#ccf141]" />
                    <span className="text-neutral-300">Autoplay</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Close Button */}
            <button
              onClick={() => setActiveModalIndex(null)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neutral-900/95 border border-white/20 text-white hover:text-black hover:bg-[#ccf141] hover:border-[#ccf141] transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 group"
              aria-label="Close modal"
            >
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">Close</span>
              <X size={16} className="transition-transform group-hover:rotate-90 duration-300" />
            </button>
          </div>

          {/* Modal Main Stage */}
          <div
            className="relative flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-2 sm:px-6 my-auto overflow-hidden"
            onMouseEnter={() => setIsModalPaused(true)}
            onMouseLeave={() => setIsModalPaused(false)}
          >
            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                modalPrev();
              }}
              className="absolute left-1 sm:left-4 md:left-6 z-40 p-2 sm:p-3.5 md:p-4 rounded-full bg-black/70 hover:bg-[#ccf141] text-white hover:text-black border border-white/20 hover:border-[#ccf141] transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-90 group"
              aria-label="Previous Image"
            >
              <ChevronLeft size={22} className="sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-1" />
            </button>

            {/* Displayed Image with Framer Motion Animation */}
            <div
              className="relative max-h-[58vh] sm:max-h-[70vh] md:max-h-[74vh] max-w-full flex items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeModalIndex}
                  src={highlightImages[activeModalIndex]}
                  alt={`Box & Cross Highlight ${activeModalIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="max-h-[58vh] sm:max-h-[70vh] md:max-h-[74vh] max-w-[94vw] md:max-w-[80vw] object-contain rounded-xl sm:rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/15"
                />
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                modalNext();
              }}
              className="absolute right-1 sm:right-4 md:right-6 z-40 p-2 sm:p-3.5 md:p-4 rounded-full bg-black/70 hover:bg-[#ccf141] text-white hover:text-black border border-white/20 hover:border-[#ccf141] transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-90 group"
              aria-label="Next Image"
            >
              <ChevronRight size={22} className="sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Swipe Hint for Mobile */}
          <div className="flex sm:hidden items-center justify-center text-[10px] text-neutral-400 py-0.5 select-none">
            <span>👈 Swipe left/right • Swipe down to close</span>
          </div>

          {/* Modal Bottom Thumbnail Strip */}
          <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 pb-2 sm:pb-3 z-40">
            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 px-1 hide-scrollbar justify-start sm:justify-center"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {highlightImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalIndex(i);
                    setModalProgress(0);
                  }}
                  className={`shrink-0 w-11 h-11 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                    activeModalIndex === i
                      ? "border-[#ccf141] scale-105 shadow-[0_0_18px_rgba(204,241,65,0.45)] ring-2 ring-[#ccf141]/30"
                      : "border-white/15 opacity-50 hover:opacity-100 hover:border-white/50"
                  }`}
                  aria-label={`Jump to photo ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {activeModalIndex === i && (
                    <div className="absolute inset-0 bg-[#ccf141]/20 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for clean scrolling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.4s ease-out forwards;
            }
          `,
        }}
      />
    </section>
  );
};

export default Eventhighlight;

