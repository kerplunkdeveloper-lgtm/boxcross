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
      <div className="max-w-8xl mx-auto ">

        {/* Member Stories Section */}
        <div className="mb-20 lg:px-10">
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

        {/* Infinite Text Marquee */}
        <div className="w-full bg-black py-6 md:py-10 border-y border-zinc-900/60 overflow-hidden select-none pointer-events-none mb-20">
          <div className="marquee-experience-wrapper">
            <div className="marquee-experience-track">
              {Array(10).fill([
                "EXPERIENCE",
                "TEAM",
                "MOVEMENT"
              ]).flat().map((word, idx) => (
                <span
                  key={idx}
                  className="text-[60px] sm:text-[65px] md:text-[85px] lg:text-[105px] font-black uppercase tracking-wider mx-6 sm:mx-10 inline-block"
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.45)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            .marquee-experience-wrapper {
              width: 100%;
              overflow: hidden;
              display: flex;
            }
            .marquee-experience-track {
              display: flex;
              white-space: nowrap;
              width: max-content;
              animation: scrollLeftExperienceMarquee 38s linear infinite;
            }
            @keyframes scrollLeftExperienceMarquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
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

       
      </div>
    </section>
  );
}