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
      <div className="max-w-7xl mx-auto">

        {/* Member Stories Section */}
        <div className="mb-20">
          <h2 
            data-aos="fade-up"
            className="text-3xl text-[#E5FF00] font-black mb-10 text-center  uppercase tracking-wide" 
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
              className="text-3xl text-[#E5FF00] font-black mb-10 text-center uppercase tracking-wide" 
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
              <h1 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-wider text-zinc-300 text-center">
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
          className="card-border-spin-container rounded-[30px] p-[1.5px] mb-12"
        >
          <div 
            className="card-border-spin-inner relative rounded-[40px] overflow-hidden p-6 sm:p-10 md:p-12 bg-cover bg-right flex flex-col justify-between"
            style={{ backgroundImage: `url(${bannerBg})` }}
          >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 md:via-black/75 to-black/35 z-0"></div>

            {/* Outlined BXC Logo in Top-Right */}
            <div 
              className="absolute top-6 right-8 text-[80px] md:text-[110px] font-black opacity-15 select-none pointer-events-none hidden md:block" 
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
              <div className="max-w-full lg:max-w-[70%]">
                <span 
                  className="text-[#E5FF00] uppercase tracking-widest text-md md:text-sm font-bold"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  Join The Movement
                </span>

                <h1 
                  className="text-3xl  sm:text-2xl md:text-3xl  font-black mt-4 leading-none uppercase text-white" 
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  THE TRIBE IS ALREADY TRAINING.
                </h1>

                <h1 
                  className="text-[#E5FF00] mt-4 text-2xl sm:text-2xl md:text-3xl font-black mt-2 leading-none uppercase" 
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  YOUR FIRST SESSION IS FREE.
                </h1>
              </div>

              {/* Features Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 text-md md:text-sm font-bold text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <FaUser className="text-[#E5FF00] flex-shrink-0 text-md md:text-base" />
                  <span>Expert Coaches</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <FaStar className="text-[#E5FF00] flex-shrink-0 text-sm md:text-base" />
                  <span>World Class Training</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <FaUsers className="text-[#E5FF00] flex-shrink-0 text-sm md:text-base" />
                  <span>Supportive Community</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <FaBolt className="text-[#E5FF00] flex-shrink-0 text-sm md:text-base" />
                  <span>Premium Facilities</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12 w-full">
                <button 
                  onClick={handleBookTrial}
                  className="bg-[#E5FF00] hover:bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-3 transition duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
                >
                  <span>BOOK FREE TRIAL</span>
                  <FaArrowRight className="text-xs md:text-sm" />
                </button>

                <button 
                  onClick={handleWhatsappJoin}
                  className="border border-[#E5FF00]/40 text-[#E5FF00] hover:bg-[#E5FF00] hover:text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-3 transition duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-black/40 backdrop-blur-sm w-full sm:w-auto"
                >
                  <FaWhatsapp className="text-sm md:text-lg" />
                  <span>JOIN WHATSAPP COMMUNITY</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-900/60 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-zinc-500 font-medium">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2 hover:text-zinc-300 transition duration-300">
              <FaMapMarkerAlt className="text-[#E5FF00]" />
              <span>Multiple Locations</span>
            </div>
            <div className="flex items-center gap-2 hover:text-zinc-300 transition duration-300">
              <FaPhoneAlt className="text-[#E5FF00]" />
              <span>+91 89255 56800</span>
            </div>
            <div className="flex items-center gap-2 hover:text-zinc-300 transition duration-300">
              <FaEnvelope className="text-[#E5FF00]" />
              <span>hello@bxc.fit</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span>© 2024 BXC. All rights reserved.</span>
          </div>
        </div>

      </div>
    </section>
  );
}