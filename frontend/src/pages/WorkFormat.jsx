import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Zap,
  Target,
  Activity,
  HeartPulse,
  Timer,
  Sparkles,
  Shield,
  Trophy,
  Wind,
  Smile,
  Clock,
  ArrowRight,
  Check,
  ChevronRight,
  X,
  Phone,
  User,
  Calendar,
  Send,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// 7 WORKOUT FORMATS EXACTLY FROM REFERENCE IMAGE
const workoutFormatsData = [
  {
    id: "gym",
    title: "Gym",
    category: "strength",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Improve strength, endurance, and overall fitness through structured training.",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "FOUNDATION",
    badges: [
      {
        icon: Dumbbell,
        label: "Gain muscle",
      },
      {
        icon: Flame,
        label: "Lose weight",
      },
      {
        icon: Zap,
        label: "Increase strength",
      },
    ],
  },
  {
    id: "hrx",
    title: "HRX",
    category: "hiit",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Full-body fitness through natural movements and functional strength.",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "HYBRID SPEED",
    badges: [
      {
        icon: Dumbbell,
        label: "Gain muscle",
      },
      {
        icon: Target,
        label: "Increase strength",
      },
      {
        icon: Activity,
        label: "Improve mobility",
      },
    ],
  },
  {
    id: "dance-fitness",
    title: "Dance Fitness",
    category: "dance",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Turn up the music, burn the calories - Dance your way to fitness!",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "CARDIO RHYTHM",
    badges: [
      {
        icon: HeartPulse,
        label: "Increase endurance",
      },
      {
        icon: Timer,
        label: "Improve stamina",
      },
      {
        icon: Sparkles,
        label: "Reduce stress",
      },
    ],
  },
  {
    id: "hiit",
    title: "HIIT",
    category: "hiit",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Torch calories and boost stamina through fast-paced metabolic exercises.",
    image:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "HIGH INTENSITY",
    badges: [
      {
        icon: Flame,
        label: "Burn fat",
      },
      {
        icon: Shield,
        label: "Increase strength",
      },
      {
        icon: Zap,
        label: "Improve mobility",
      },
    ],
  },
  {
    id: "strength",
    title: "Strength",
    category: "strength",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "High Intensity workout using weights build your strength and fitness.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "PROGRESSIVE OVERLOAD",
    badges: [
      {
        icon: Dumbbell,
        label: "Comprehensive strength",
      },
      {
        icon: Trophy,
        label: "Agile Excellence",
      },
      {
        icon: Zap,
        label: "Explosive Power",
      },
    ],
  },
  {
    id: "yoga",
    title: "Yoga",
    category: "mind",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Blends movement, mindfulness, & breath for body and mind.",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "MIND & MOBILITY",
    badges: [
      {
        icon: Wind,
        label: "Discover dynamic flow",
      },
      {
        icon: Activity,
        label: "Improved flexibility",
      },
      {
        icon: HeartPulse,
        label: "Enhanced breathing",
      },
    ],
  },
  {
    id: "boxing",
    title: "Boxing",
    category: "fight",
    duration: "50 mins",
    durationSubtitle: "workout",
    desc: "Learn the movements & techniques, build stamina, and gain knockout power.",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop",
    categoryBadge: "FIGHT DISCIPLINE",
    badges: [
      {
        icon: Flame,
        label: "Improve stamina",
      },
      {
        icon: Shield,
        label: "Build core strength",
      },
      {
        icon: Target,
        label: "Learn a skill",
      },
    ],
  },
];

const categoryFilters = [
  { id: "all", label: "All Formats" },
  { id: "strength", label: "Strength & Gym" },
  { id: "hiit", label: "HIIT & HRX" },
  { id: "fight", label: "Fight & Boxing" },
  { id: "dance", label: "Dance Fitness" },
  { id: "mind", label: "Yoga & Mobility" },
];

const WorkFormat = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("idle"); // "idle" | "submitting" | "success"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    slot: "Morning (6:00 AM - 9:00 AM)",
    date: "Tomorrow",
  });

  const filteredFormats =
    activeFilter === "all"
      ? workoutFormatsData
      : workoutFormatsData.filter((item) => item.category === activeFilter);

  const handleOpenModal = (format) => {
    setSelectedFormat(format);
    setBookingStatus("idle");
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setBookingStatus("submitting");

    setTimeout(() => {
      setBookingStatus("success");
    }, 800);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hi Box & Cross Team! I want to book a free trial for the "${selectedFormat?.title || "Workout"}" format (${formData.slot}, ${formData.date}). Name: ${formData.name || "Member"}`
    );
    window.open(`https://wa.me/918925556900?text=${text}`, "_blank");
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#070709] text-white min-h-screen selection:bg-[#ccf141] selection:text-black pt-24 md:pt-28 pb-24 relative">
      <Helmet>
        <title>Workout Formats | Box &amp; Cross – Performance Arena</title>
        <meta
          name="description"
          content="Explore our 7 signature 50-minute coached workout formats: Gym, HRX, Dance Fitness, HIIT, Strength, Yoga, and Boxing. Engineered for high-output athletic progression."
        />
        <meta property="og:title" content="Workout Formats | Box & Cross Arena" />
        <meta
          property="og:description"
          content="Seven coached workout formats across strength, combat athletics, functional endurance, and mobility."
        />
      </Helmet>

      {/* TOP AMBIENT NEON GLOW ACCENT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-[#ccf141]/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          <Link to="/" className="hover:text-white transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight size={13} className="text-neutral-600 shrink-0" />
          <span className="text-[#ccf141] font-bold shrink-0">Workout Formats</span>
        </nav>

        {/* HERO TITLE & SUBHEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
           

            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none"
              style={{ fontFamily: '"BrutalTypeBold", "Impact", sans-serif' }}
            >
              Workout <span className="text-[#ccf141]">formats</span>
            </h1>

          
          </div>

         
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 mb-8 sm:mb-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categoryFilters.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#ccf141] text-black shadow-[0_0_20px_rgba(204,241,65,0.35)] scale-[1.02]"
                    : "bg-neutral-900/80 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* CARDS GRID: 7 FORMATS MATCHING REFERENCE IMAGE           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {filteredFormats.map((format, idx) => (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl bg-[#101013] border border-zinc-800/90 hover:border-[#ccf141]/60 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(204,241,65,0.18)] hover:-translate-y-1.5"
            >
              {/* TOP IMAGE WITH HIGH CONTRAST BLACK & WHITE TREATMENT */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                <img
                  src={format.image}
                  alt={format.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:scale-108 group-hover:brightness-100 transition-all duration-700 ease-out"
                />

                {/* DUAL GRADIENT SCRIMS FOR CINEMATIC EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-[#101013]/30 via-40% to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* TOP BADGE */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-widest bg-black/85 backdrop-blur-md text-[#ccf141] border border-[#ccf141]/35 shadow-md">
                    {format.categoryBadge}
                  </span>
                </div>

                {/* 3 CIRCULAR FEATURE ICONS WITH NEON GREEN ACCENTS OVERLAID AT BOTTOM OF IMAGE */}
                <div className="absolute bottom-2 inset-x-3 z-10 grid grid-cols-3 gap-2">
                  {format.badges.map((badge, bIdx) => {
                    const IconComp = badge.icon;
                    return (
                      <div
                        key={bIdx}
                        className="flex flex-col items-center text-center p-1"
                      >
                        {/* Circular Neon-Accented Glass Orb */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#ccf141] shadow-[0_4px_20px_rgba(0,0,0,0.7)] group-hover:border-[#ccf141]/50 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(204,241,65,0.3)] transition-all duration-300">
                          <IconComp size={17} className="text-[#ccf141]" />
                        </div>

                        {/* Label below orb */}
                        <span
                          className="text-[10px] sm:text-[10.5px] font-bold text-zinc-200 uppercase tracking-tight mt-1.5 leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2"
                          style={{ fontFamily: '"Brutal Font Bold", sans-serif' }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD LOWER BODY: TITLE, TIME, DESC & BUTTON */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  {/* TITLE AND 50 MINS BADGE ROW */}
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3
                      className="text-2xl sm:text-[28px] font-black uppercase text-white tracking-tight group-hover:text-[#ccf141] transition-colors leading-none"
                      style={{ fontFamily: '"BrutalTypeBold", "Impact", sans-serif' }}
                    >
                      {format.title}
                    </h3>

                    <div className="text-right shrink-0">
                      <span
                        className="block text-xs sm:text-sm font-black text-white font-mono leading-none tracking-tight"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {format.duration}
                      </span>
                      <span className="block text-[9.5px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                        {format.durationSubtitle}
                      </span>
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p
                    className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed line-clamp-2 font-normal"
                    style={{ fontFamily: '"Brutal Font Light", sans-serif' }}
                  >
                    {format.desc}
                  </p>
                </div>

                {/* TRY FOR FREE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleOpenModal(format)}
                  className="w-full mt-2 py-3 sm:py-3.5 px-4 rounded-xl bg-white text-black font-black uppercase text-xs sm:text-[12.5px] tracking-wider hover:bg-[#ccf141] hover:text-black hover:shadow-[0_0_25px_rgba(204,241,65,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md group/btn"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>TRY FOR FREE</span>
                  <ArrowRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM MOTIVATIONAL BANNER */}
        <div className="mt-16 sm:mt-20 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#ccf141]/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#ccf141] mb-1.5 block">
              100% BEGINNER &amp; ADVANCED FRIENDLY
            </span>
            <h3
              className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              First Time at Box &amp; Cross?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mt-1">
              Every format is scaled by certified coaches to your individual baseline.
              Claim your complimentary free trial class today and feel the arena energy.
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex items-center gap-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => handleOpenModal(workoutFormatsData[0])}
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs sm:text-sm hover:bg-white shadow-[0_0_20px_rgba(204,241,65,0.35)] transition-all cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              BOOK FIRST FREE CLASS
            </button>
            <a
              href="https://wa.me/918925556900?text=Hi%20Box%20%26%20Cross%20Team!%20I%20would%20like%20to%20know%20more%20about%20the%20workout%20formats."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs sm:text-sm border border-white/15 flex items-center gap-2 transition-all"
            >
              <FaWhatsapp size={16} className="text-[#25D366]" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FREE TRIAL BOOKING MODAL                                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0f0f13] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(204,241,65,0.15)] overflow-hidden p-6 sm:p-8"
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={17} />
              </button>

              {bookingStatus === "success" ? (
                /* SUCCESS STATE */
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ccf141]/20 border border-[#ccf141] flex items-center justify-center text-[#ccf141] mb-5 shadow-[0_0_30px_rgba(204,241,65,0.4)]">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    FREE TRIAL RESERVED!
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-sm">
                    We've booked your complimentary <span className="text-[#ccf141] font-bold">{selectedFormat?.title}</span> pass.
                    Our coach desk will reach out via WhatsApp with your arena orientation details.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      <FaWhatsapp size={16} />
                      <span>Chat on WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="py-3 px-6 rounded-xl bg-white/10 text-white font-bold uppercase tracking-wider text-xs hover:bg-white/20"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* BOOKING FORM */
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccf141]/15 border border-[#ccf141]/40 text-[#ccf141] text-[10px] font-bold uppercase tracking-wider mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-pulse" />
                    <span>COMPLIMENTARY PASS</span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-none"
                    style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                  >
                    TRY {selectedFormat?.title} FOR FREE
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1.5">
                    Experience our 50-minute coached workout. No credit card required.
                  </p>

                  <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                    {/* NAME */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ccf141] transition-colors"
                        />
                      </div>
                    </div>

                    {/* PHONE */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ccf141] transition-colors"
                        />
                      </div>
                    </div>

                    {/* SLOT & DATE */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                          Preferred Day
                        </label>
                        <select
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-3 rounded-xl bg-black/60 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ccf141] transition-colors cursor-pointer"
                        >
                          <option value="Today">Today</option>
                          <option value="Tomorrow">Tomorrow</option>
                          <option value="This Weekend">This Weekend</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                          Preferred Slot
                        </label>
                        <select
                          value={formData.slot}
                          onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                          className="w-full px-3 py-3 rounded-xl bg-black/60 border border-zinc-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ccf141] transition-colors cursor-pointer"
                        >
                          <option value="Morning (6:00 AM - 9:00 AM)">Morning (6 - 9 AM)</option>
                          <option value="Midday (10:00 AM - 1:00 PM)">Midday (10 - 1 PM)</option>
                          <option value="Evening (5:00 PM - 9:00 PM)">Evening (5 - 9 PM)</option>
                        </select>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={bookingStatus === "submitting"}
                        className="w-full py-3.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs sm:text-sm hover:bg-white shadow-[0_0_25px_rgba(204,241,65,0.4)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {bookingStatus === "submitting" ? (
                          <span>CONFIRMING PASS...</span>
                        ) : (
                          <>
                            <span>CONFIRM FREE PASS</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* DIRECT WHATSAPP OPTION */}
                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={handleWhatsAppDirect}
                        className="text-[11px] text-zinc-400 hover:text-[#25D366] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FaWhatsapp size={14} className="text-[#25D366]" />
                        <span>Or click here to book directly on WhatsApp</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkFormat;

