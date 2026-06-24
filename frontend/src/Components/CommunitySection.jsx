import React from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaInstagram,
  FaWhatsapp,
  FaStar,
  FaUser,
  FaUsers,
  FaBolt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import bannerBg from "../assets/hand.png";

export default function CommunitySection() {
  const stories = [
    {
      name: "PRIYA",
      role: "Hybrid Performance",
      quote: "I came for boxing. Stayed for people.",
      image:
        "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "KARTHIK",
      role: "HYROX Lab",
      quote: "Month 3 changed everything.",
      image:
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "ANITHA",
      role: "Parent",
      quote: "The discipline followed him home.",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const instaImages = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500",
  ];

  const handleBookTrial = () => {
    if (window.location.pathname === "/") {
      const element = document.getElementById("book-your-free-gym-tour");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollToBookForm", "true");
      window.location.href = "/#book-your-free-gym-tour";
    }
  };

  const handleWhatsappJoin = () => {
    window.open("https://wa.me/918925556900", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-black text-white py-0 md:py-20 md:px-5 overflow-hidden">
      <div className="max-w-8xl mx-auto">

        {/* Member Stories Section */}
        <div className="mb-20">
          <h2 
            data-aos="fade-up"
            className="text-3xl text-white font-black mb-10 text-center  uppercase tracking-wide" 
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            MEMBER STORIES
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stories.map((item, i) => (
              <motion.div
                key={i}
                data-aos="fade-up"
                data-aos-delay={100 + i * 150}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="card-border-spin-container rounded-3xl p-[1.5px] h-auto sm:h-60 group"
              >
                <div className="card-border-spin-inner rounded-[22px] overflow-hidden !flex !flex-col sm:!flex-row h-full">
                  {/* Image on the Left */}
                  <div className="w-full sm:w-[42%] h-60 sm:h-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 duration-700 grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>

                  {/* Content on the Right */}
                  <div className="w-full sm:w-[58%] p-6 flex flex-col justify-center">
                    <h3 className="text-[#E5FF00] text-2xl font-black tracking-wide">
                      {item.name}
                    </h3>

                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                      {item.role}
                    </p>

                    <p className="mt-4 text-base md:text-lg leading-relaxed font-semibold italic text-zinc-200">
                      "{item.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instagram Wall Section wrapped in a container with Spin Border */}
        <div
          data-aos="fade-up"
          className="card-border-spin-container rounded-[24px] md:rounded-[35px] p-[1.5px] mb-20"
        >
          <div className="card-border-spin-inner rounded-[22px] md:rounded-[33px] p-6 md:p-10 flex flex-col justify-between">
            <h2 
              className="text-3xl text-white font-black mb-10 text-center uppercase tracking-wide" 
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              Instagram Wall
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {instaImages.map((img, i) => (
                <motion.div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  whileHover={{ scale: 1.05 }}
                  className="overflow-hidden rounded-2xl border border-zinc-800 hover:border-[#E5FF00]/40 transition duration-300"
                >
                  <img
                    src={img}
                    alt={`Instagram Post ${i + 1}`}
                    className="h-44 w-full object-cover hover:brightness-110 transition duration-300 cursor-pointer"
                    onClick={() => window.open("https://www.instagram.com/boxandcross/", "_blank")}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col items-center justify-center mt-8">
              <h1 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-wider text-[#E5FF00] text-center">
                Every Sunday. Every Fight Night. Every PR. Every First Session.
              </h1>
              <a 
                href="https://www.instagram.com/boxandcross/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-6 hover:scale-110 transition duration-300"
              >
                <FaInstagram className="text-4xl text-[#E5FF00] hover:text-white transition duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section Box wrapped in Spin Border */}
        <div
          data-aos="zoom-in"
          className="card-border-spin-container rounded-[32px] p-[1.5px] mb-12"
        >
          <div 
            className="card-border-spin-inner relative rounded-[30px] overflow-hidden p-8 sm:p-12 md:p-16 lg:p-20 bg-cover bg-right flex flex-col justify-between"
            style={{ backgroundImage: `url(${bannerBg})` }}
          >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 md:via-black/85 to-black/35 z-0"></div>

            {/* Outlined BXC Logo in Top-Right */}
            <div 
              className="absolute top-4 right-4 sm:top-6 sm:right-8 text-[60px] sm:text-[80px] md:text-[120px] font-black opacity-10 sm:opacity-15 select-none pointer-events-none" 
              style={{ 
                fontFamily: '"Bebas Neue", sans-serif',
                WebkitTextStroke: "2px #E5FF00",
                color: "transparent"
              }}
            >
              BXC
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col justify-between h-full w-full">
              <div className="max-w-full lg:max-w-[75%]">
                {/* Tech Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5FF00]/10 border border-[#E5FF00]/30 text-[#E5FF00] text-xs uppercase tracking-widest font-extrabold w-fit mb-6"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5FF00] animate-pulse"></span>
                  Join The Movement
                </div>

                <h2 
                  className="text-3xl sm:text-5xl md:text-5xl font-black text-white leading-none uppercase tracking-tight" 
                  style={{ fontFamily: '"Bebas Neue", sans-serif' , lineHeight: '1.7' }}
                >
                  THE TRIBE IS <br className="hidden sm:block" /> ALREADY TRAINING.
                </h2>

                <h3 
                  className="text-[#E5FF00] text-xl sm:text-3xl md:text-4xl italic   mt-3 " 
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  YOUR FIRST SESSION IS FREE.
                </h3>
              </div>

              {/* Features Grid Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full">
                {[
                  { icon: FaUser, text: "Expert Coaches" },
                  { icon: FaStar, text: "World Class Training" },
                  { icon: FaUsers, text: "Supportive Community" },
                  { icon: FaBolt, text: "Premium Facilities" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-950/40 border border-zinc-900/50 backdrop-blur-md hover:border-[#E5FF00]/30 hover:bg-zinc-900/60 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 group-hover:bg-[#E5FF00] group-hover:border-[#E5FF00] transition-all duration-300 flex-shrink-0">
                        <Icon className="text-[#E5FF00] group-hover:text-black transition-colors duration-300 text-xl md:text-base" />
                      </div>
                      <span className="text-xl font-bold text-zinc-300 group-hover:text-white transition-colors duration-300">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full">
                {/* Book Free Trial */}
                <button 
                  onClick={handleBookTrial}
                  className="group relative overflow-hidden bg-[#E5FF00] text-black px-8 py-4.5 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,255,0,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>BOOK FREE TRIAL</span>
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>

                {/* WhatsApp Community */}
                <button 
                  onClick={handleWhatsappJoin}
                  className="group relative overflow-hidden border border-zinc-850 text-[#E5FF00] hover:text-black px-8 py-4.5 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#E5FF00] hover:border-[#E5FF00] hover:shadow-[0_0_20px_rgba(229,255,0,0.15)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-zinc-950/60 backdrop-blur-sm w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <FaWhatsapp className="text-base" />
                    <span>JOIN WHATSAPP COMMUNITY</span>
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="mt-16 pt-10 border-t border-zinc-900/60 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Location Card */}
            <div className="card-border-spin-container rounded-2xl p-[1px] h-full">
              <a
                href="https://maps.google.com/?q=No.+69,+Church+Street,+Krishna+Nagar,+Lawspet,+Pondicherry+-+605008"
                target="_blank"
                rel="noopener noreferrer"
                className="card-border-spin-inner !flex !flex-row !items-start gap-4 p-5 rounded-[15px] bg-[#0c0c0c]/90 hover:bg-[#0c0c0c]/85 transition-all duration-300 group cursor-pointer h-full"
              >
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-[#E5FF00] group-hover:border-[#E5FF00] transition-all duration-300 flex-shrink-0">
                  <FaMapMarkerAlt className="text-lg text-[#E5FF00] group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Location</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                    No. 69, Church Street, Krishna Nagar, Lawspet, Pondicherry - 605008
                  </span>
                </div>
              </a>
            </div>

            {/* Phone Card */}
            <div className="card-border-spin-container rounded-2xl p-[1px] h-full">
              <a
                href="tel:+918925556800"
                className="card-border-spin-inner !flex !flex-row !items-center gap-4 p-5 rounded-[15px] bg-[#0c0c0c]/90 hover:bg-[#0c0c0c]/85 transition-all duration-300 group cursor-pointer h-full"
              >
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-[#E5FF00] group-hover:border-[#E5FF00] transition-all duration-300 flex-shrink-0">
                  <FaPhoneAlt className="text-lg text-[#E5FF00] group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Call Us</span>
                  <span className="text-sm md:text-base text-zinc-300 group-hover:text-white transition-colors duration-300 font-bold tracking-wide">
                    +91 89255 56800
                  </span>
                </div>
              </a>
            </div>

            {/* Email Card */}
            <div className="card-border-spin-container rounded-2xl p-[1px] h-full">
              <a
                href="mailto:getfit@boxandcross.com"
                className="card-border-spin-inner !flex !flex-row !items-center gap-4 p-5 rounded-[15px] bg-[#0c0c0c]/90 hover:bg-[#0c0c0c]/85 transition-all duration-300 group cursor-pointer h-full"
              >
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-[#E5FF00] group-hover:border-[#E5FF00] transition-all duration-300 flex-shrink-0">
                  <FaEnvelope className="text-lg text-[#E5FF00] group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Email Us</span>
                  <span className="text-sm md:text-base text-zinc-300 group-hover:text-white transition-colors duration-300 font-bold tracking-wide">
                    getfit@boxandcross.com
                  </span>
                </div>
              </a>
            </div>
          </div>

        
        </div>

      </div>
    </section>
  );
}