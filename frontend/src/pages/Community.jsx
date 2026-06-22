import React from "react";
import { Helmet } from "react-helmet-async";
import { Users, Flame, MessageCircle, ArrowRight, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const Community = () => {
  const pillars = [
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "TRIBE MENTALITY",
      desc: "No ego, just execution. We train side-by-side, sharing the struggle and celebrating every single breakthrough. You are never lifting alone.",
    },
    {
      icon: <Flame className="w-8 h-8 text-black" />,
      title: "CLAN EVENTS & BOOTCAMPS",
      desc: "From outdoor beach bootcamps to weekend strength challenges and social mixers, our events unite athletes from all walks of life.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-black" />,
      title: "CONSTANT SUPPORT",
      desc: "Our members-only forums and WhatsApp groups keep you locked in. Swap meal prep secrets, recovery hacks, and daily motivation.",
    },
  ];

  const highlights = [
    {
      type: "CHALLENGE",
      title: "30-DAY CLAN PULL-UP CLASH",
      status: "Active Now",
      desc: "Join 120+ members tracking daily reps to stack up points for the BXC Summer leaderboard.",
      tag: "Community event",
    },
    {
      type: "HIGHLIGHT",
      title: "SUNDAY BEACH SHRED RECAP",
      status: "Completed",
      desc: "Over 80 athletes conquered our high-intensity team relays and sandbag workouts at Pondy Beach.",
      tag: "Sunday Bootcamp",
    },
    {
      type: "SPOTLIGHT",
      title: "MEMBER OF THE MONTH: PRIYA K.",
      status: "July Selection",
      desc: "Priya crushed her PRs while coaching fellow members through active recovery workouts. True tribe leader.",
      tag: "Inspiration",
    },
  ];

  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col font-sans text-white">
      <Helmet>
        <title>The BXC Clan - Our Fitness Community | Box & Cross</title>
        <meta
          name="description"
          content="Join the strongest fitness community in Pondicherry. Train, connect, and grow alongside supportive athletes at Box & Cross."
        />
      </Helmet>

      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with custom sepia/neon overlay matching design specs */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop')",
            filter: "grayscale(1) brightness(0.2) sepia(1) hue-rotate(50deg) saturate(3.5)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
          <h1
            className="text-6xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-2xl leading-none"
            style={{
              fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif',
            }}
          >
            THE BXC CLAN
          </h1>
          <p className="text-gray-300 text-sm md:text-lg max-w-2xl mt-4 mb-8 drop-shadow-md px-4 leading-relaxed font-medium">
            We don't just lift weights — we build a tribe. Discover Pondicherry's
            most energetic, supportive, and relentless fitness family.
          </p>

          {/* Neon green stripes */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-2 bg-[#e5ff00] transform skew-x-[-30deg] shadow-[0_0_15px_rgba(229,255,0,0.6)]"
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Core Pillars */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <span
            className="text-[#e5ff00] text-xs font-black uppercase tracking-widest bg-[#e5ff00]/10 border border-[#e5ff00]/20 px-3 py-1.5 rounded-full"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            Our Foundation
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mt-6"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            WHAT MAKES US A TRIBE
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Gyms have clients. Box & Cross has a community. Here is how we stick together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#0a0a0a] border border-[#222] hover:border-[#e5ff00] transition-all duration-300 rounded-xl p-8 flex flex-col items-center text-center group shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e5ff00] opacity-[0.02] blur-[30px] group-hover:opacity-[0.08] transition-all" />
              <div className="w-16 h-16 bg-[#e5ff00] rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(229,255,0,0.3)]">
                {pillar.icon}
              </div>
              <h3
                className="text-white text-2xl font-black uppercase tracking-wide mb-4"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                {pillar.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Community Highlights Feed */}
      <section className="w-full bg-[#0a0a0a] border-t border-b border-[#1f1f1f] py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span
                className="text-[#e5ff00] text-xs font-black uppercase tracking-widest bg-[#e5ff00]/10 border border-[#e5ff00]/20 px-3 py-1.5 rounded-full"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                Live Feed
              </span>
              <h2
                className="text-5xl md:text-6xl font-black mt-6"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                CLAN HIGHLIGHTS & CHALLENGES
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              Stay in the loop with active member stats, physical challenges, and exclusive community events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#050505] border border-[#1f1f1f] rounded-xl p-6 relative flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#e5ff00] text-[11px] font-black tracking-widest uppercase border border-[#e5ff00]/20 bg-[#e5ff00]/5 px-2.5 py-1 rounded">
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      {item.status}
                    </span>
                  </div>
                  <h3
                    className="text-white text-2xl font-black mb-3 leading-snug uppercase"
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
                <div className="border-t border-[#1f1f1f] pt-4 flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                  <span>{item.tag}</span>
                  <Sparkles size={14} className="text-[#e5ff00]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Join the Clan CTA */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-20">
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#0a0a0a] to-[#121212] border border-[#222] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e5ff00] opacity-[0.03] blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5ff00] opacity-[0.02] blur-[100px] pointer-events-none" />

          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-[#e5ff00] text-xs font-black uppercase tracking-wider mb-4">
              <Trophy size={14} />
              JOIN THE INNER CIRCLE
            </div>
            <h2
              className="text-4xl md:text-6xl font-black leading-none mb-6"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              READY TO CLAIM <br /> YOUR SPOT IN THE CLAN?
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Join the official Box & Cross community networks. Engage with our trainers, participate in challenges, access exclusive nutritional schedules, and support your fellow athletes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 justify-center">
            <a
              href="https://wa.me/918925556900"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#e5ff00] hover:bg-white text-black font-black uppercase tracking-wider text-xs md:text-sm px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Join WhatsApp Clan
              <ArrowRight size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-[#444] hover:border-white text-white font-black uppercase tracking-wider text-xs md:text-sm px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <FaInstagram size={16} className="text-[#e5ff00]" />
              Follow Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
