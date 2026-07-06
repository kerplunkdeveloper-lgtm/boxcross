import React from "react";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";

export default function CommunityCards() {
  const cards = [
    {
      label: "WHATSAPP COMMUNITY",
      icon: <FaWhatsapp />,
      titleLines: ["REAL TIME.", "REAL TRIBE."],
      desc: "Session reminders. Fight Night results. Run Club meetup points. Event announcements. The fastest way to stay inside the tribe — updates arrive before you need them.",
      btnText: "JOIN WHATSAPP →",
      action: () => window.open("https://wa.me/918925556900", "_blank"),
      solid: true,
      bgImg: "https://static0.anpoimages.com/wordpress/wp-content/uploads/2024/03/whatsapp-24a-ap-hero.jpg",
      overlayColor: "from-green-600/20 via-transparent to-black",
      spinColor: "#25D366"
    },
    {
      label: "INSTAGRAM",
      icon: <FaInstagram />,
      titleLines: ["THE VISUAL", "TRIBE."],
      desc: "Training content. Member transformations. Fight Night reels. Sunday Run Club mornings. The visual life of the BXC Hybrid Tribe — posted every week without fail.",
      btnText: "FOLLOW @BXCHYBRIDTRIBE →",
      action: () => window.open("https://www.instagram.com/boxandcrossboxing/", "_blank"),
      solid: false,
      bgImg: "https://www.herenow.film/wp-content/uploads/2023/12/Instagram-video-statistics-scaled.jpg",
      overlayColor: "from-pink-600/20 via-transparent to-black",
      spinColor: "#ee2a7b"
    },
    {
      label: "YOUTUBE",
      icon: <FaYoutube />,
      titleLines: ["THE FULL", "STORY."],
      desc: "Full Fight Night footage. Training breakdowns. HYROX simulation race replays. Coach-led technique tutorials. Every major event — documented and kept.",
      btnText: "SUBSCRIBE →",
      action: () => window.open("https://www.youtube.com/@boxandcross", "_blank"),
      solid: false,
      bgImg: "https://images.unsplash.com/photo-1649180543887-158357417159?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9nbyUyMHlvdXR1YmV8ZW58MHx8MHx8fDA%3D",
      overlayColor: "from-red-600/20 via-transparent to-black",
      spinColor: "#FF0000"
    }
  ];

  return (
    <section id="join-community-section" className="bg-[#0e0e0e] text-white py-16 sm:py-24 px-1 md:px-8 lg:px-12">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12">
          <div className="flex flex-col justify-center items-center gap-2 mb-4 text-[#E5FF00] text-xs font-black tracking-widest uppercase">
            <span className="w-6 h-[2px] bg-[#E5FF00]"></span>
            JOIN THE COMMUNITY
          </div>

          <h2
            className="text-white text-5xl flex flex-col justify-center items-center md:text-5xl font-black leading-[0.95] tracking-tight uppercase mb-4"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            THREE
            <span className="text-[#E5FF00] mx-3">WAYS IN</span>
          </h2>

          <p className="text-zinc-500 text-sm text-center p-2 md:text-base font-semibold ">
            Not ready to train yet? Join the community first. When you are ready — we will be here.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {cards.map((item, idx) => (
            <div 
              key={idx} 
              className="card-border-spin-container rounded-[20px] md:rounded-[28px] p-[1.5px] h-full group"
              style={{ "--spin-glow-color": item.spinColor }}
            >
              <div className="card-border-spin-inner relative rounded-[18px] md:rounded-[26px] overflow-hidden bg-zinc-950 h-full p-8 md:p-10 flex flex-col justify-between min-h-[380px]">
                
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  {/* Background Image */}
                  <img 
                    src={item.bgImg} 
                    alt="" 
                    className="w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" 
                  />
                  {/* Brand Color Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.overlayColor} opacity-50`}></div>
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <span className="text-3xl text-[#E5FF00] block mb-4 animate-bounce" role="img" aria-label={item.label} style={{ animationDuration: '3s' }}>
                    {item.icon}
                  </span>

                  {/* Small Label */}
                  <span className="text-[#E5FF00] text-[10px] md:text-xs font-black tracking-widest block mb-3 uppercase">
                    {item.label}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-white text-3xl font-black uppercase tracking-tight leading-[0.95] mb-5"
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                  >
                    {item.titleLines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed mb-8">
                    {item.desc}
                  </p>
                </div>

                {/* Button Container */}
                <div className="relative z-10">
                  <button
                    onClick={item.action}
                    className={`w-full sm:w-auto font-black uppercase tracking-wider text-[11px] md:text-xs px-6 py-3.5 transition-all duration-300 active:scale-95 cursor-pointer rounded-none ${
                      item.solid 
                        ? "bg-[#E5FF00] text-black hover:brightness-110" 
                        : "bg-transparent border border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    {item.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
