import React from "react";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Custom neon-green outlined SVGs to match the reference image style exactly
const FightIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12V9a4 4 0 0 1 8 0v3" />
    <path d="M6 12a3 3 0 0 0 6 0" />
    <path d="M12 12V9a4 4 0 0 1 8 0v3" />
    <path d="M12 12a3 3 0 0 0 6 0" />
    <path d="M6 12v6a2 2 0 0 0 4 0v-6M14 12v6a2 2 0 0 0 4 0v-6" />
  </svg>
);

const RunIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15" cy="4" r="2" />
    <path d="M12 8h3l2 3h-3.5L12 15l-3.5-3" />
    <path d="M12 15l1.5 5h3" />
    <path d="M9 18l-1.5 3h-3" />
  </svg>
);

const BarbellIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20M6 6v12M4 8v8M20 8v8M18 6v12" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
    <path d="M12 15v5M8 20h8" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15h11a3 3 0 0 0 0-6H4v12" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6 text-[#E5FF00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function CommunityCards() {
  const socialChannels = [
    {
      name: "WHATSAPP COMMUNITY",
      action: "JOIN WHATSAPP COMMUNITY",
      link: "https://wa.me/918925556900",
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.35)]">
          <FaWhatsapp className="w-6 h-6" />
        </div>
      ),
    },
    {
      name: "INSTAGRAM",
      action: "FOLLOW @BOXANDCROSS",
      link: "https://www.instagram.com/boxandcross/",
      icon: (
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_rgba(238,42,123,0.35)]">
          <FaInstagram className="w-6 h-6" />
        </div>
      ),
    },
    {
      name: "YOUTUBE",
      action: "SUBSCRIBE",
      link: "https://www.youtube.com/@boxandcross",
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_rgba(255,0,0,0.35)]">
          <FaYoutube className="w-6 h-6" />
        </div>
      ),
    },
  ];

  const tribeEvents = [
    { name: "Friday Fight Night", icon: <FightIcon /> },
    { name: "Sunday Tribe Run", icon: <RunIcon /> },
    { name: "Monthly PR Board", icon: <BarbellIcon /> },
    { name: "Monthly Hybrid Challenge", icon: <TrophyIcon /> },
    { name: "HYROX Simulation Race", icon: <FlagIcon /> },
    { name: "Junior Athletes Showcase", icon: <StarIcon /> },
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

  return (
    <section id="join-community-section" className="bg-black text-white pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Join the Community */}
          <div 
            data-aos="fade-right"
            className="card-border-spin-container rounded-3xl p-[1.5px]"
          >
            <div className="card-border-spin-inner rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-black text-center md:text-left  uppercase tracking-wide mb-8"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  JOIN THE COMMUNITY
                </h2>
                
                <div className="flex flex-col gap-2">
                  {socialChannels.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-5 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/40 px-4 rounded-2xl transition duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <div>
                          <div className="text-zinc-400 font-bold uppercase text-xs md:text-sm tracking-wider group-hover:text-white transition duration-300">
                            {item.name}
                          </div>
                          <div className="text-[#E5FF00] font-black uppercase text-sm md:text-base mt-1 group-hover:translate-x-1 transition duration-300">
                            {item.action}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-[#E5FF00] transform group-hover:translate-x-1.5 transition duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tribe Events */}
          <div 
            data-aos="fade-left"
            data-aos-delay="200"
            className="card-border-spin-container rounded-3xl p-[1.5px]"
          >
            <div className="card-border-spin-inner rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-black text-center md:text-left  uppercase tracking-wide mb-8"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  TRIBE EVENTS
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  {tribeEvents.map((event, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-[#E5FF00]/20 transition duration-300"
                    >
                      <div className="p-2 rounded-lg bg-zinc-900">
                        {event.icon}
                      </div>
                      <span className="text-zinc-200 text-sm md:text-base font-semibold">
                        {event.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBookTrial}
                className="w-full bg-[#E5FF00] hover:bg-white text-black font-black uppercase tracking-wider text-xs md:text-sm py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] mt-8 group"
              >
                <span className="font-bold tracking-wide">BOOK FREE TRIAL</span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
