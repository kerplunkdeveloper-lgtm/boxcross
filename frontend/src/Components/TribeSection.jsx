import React from "react";
import crowdImg from "../assets/runn.png";

export default function TribeSection() {
  const clubs = [
    {
      id: "01",
      title: "FIGHT CLUB",
      emoji: "🥊",
      desc: "Boxing is for everyone. Learn real technique, build confidence, and train.",
      anchor: "ANCHOR EVENT: FRIDAY FIGHT NIGHT",
      color: "#E5FF00",
      btnText: "JOIN FIGHT CLUB →",
      whatsappUrl: "https://chat.whatsapp.com/BhyGsHUgRH652l9EjNOsdK?mode=gi_t"
    },
    {
      id: "02",
      title: "LIFTING CLUB",
      emoji: "🏋️",
      desc: "A coached strength program designed to help you lift smarter, grow stronger, and achieve lasting results.",
      anchor: "ANCHOR EVENT: MONTHLY PR BOARD",
      color: "#E5FF00",
      btnText: "JOIN LIFTING CLUB →",
      whatsappUrl: "https://chat.whatsapp.com/FWLbfQazVl5CU8REQdaaIC?mode=gi_t"
    },
    {
      id: "03",
      title: "RUN CLUB",
      emoji: "🏃",
      desc: "More than a run. A weekly ritual where the Tribe comes together to move, connect, and grow stronger.",
      anchor: "ANCHOR EVENT: SUNDAY SUNRISE RUN",
      color: "#00C2FF",
      btnText: "JOIN RUN CLUB →",
      whatsappUrl: "https://chat.whatsapp.com/Lspdy1NQv44JfxQMC9Vrlx?mode=gi_t"
    }
  ];

  return (
    <section className="bg-black py-16 overflow-hidden">
      {/* Top Section: WHAT THE TRIBE IS */}
      <div className="max-w-8xl mx-auto px-6 md:px-8 lg:px-20 mb-32 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Three Truths Content */}
          <div className="flex flex-col">
            <div data-aos="fade-up" className="mb-12">
              <div className="flex items-center gap-2 mb-4 text-[#E5FF00] text-xs font-black tracking-widest uppercase">
                <span className="w-6 h-[2px] bg-[#E5FF00]"></span>
                WHAT THE TRIBE IS
              </div>
              
              <h2
                className="text-white text-5xl md:text-5xl font-black leading-[0.95] tracking-tight uppercase"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                THREE <br />
                <span className="text-[#E5FF00]">TRUTHS.</span>
              </h2>
            </div>

            <div className="flex flex-col border-t border-zinc-900">
              {/* Item 1 */}
              <div data-aos="fade-up" data-aos-delay="100" className="flex flex-col sm:flex-row gap-5 md:gap-10 py-10 border-b border-zinc-900 last:border-0 items-start">
                <span className="text-[#E5FF00] font-black text-sm md:text-base tracking-wider shrink-0 mt-1">
                  01
                </span>
                <div>
                  <h3 className="text-white text-xl md:text-xl font-black tracking-tight mb-3">
                    The Tribe is everyone who trains at BXC.
                  </h3>
                  <p className="text-zinc-500 font-medium text-sm md:text-md leading-relaxed">
                    Fight Club. Lifting Club. HYROX Lab. Run Club. Hybrid Performance. Junior Athletes. Every program.
                    One community. One standard. One city that is getting stronger every week.
                  </p>
                </div>
              </div>
              
              {/* Item 2 */}
              <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-5 md:gap-10 py-10 border-b border-zinc-900 last:border-0 items-start">
                <span className="text-[#E5FF00] font-black text-sm md:text-base tracking-wider shrink-0 mt-1">
                  02
                </span>
                <div>
                  <h3 className="text-white text-xl md:text-xl font-black tracking-tight mb-3">
                    The Tribe shows up on Sunday mornings.
                  </h3>
                  <p className="text-zinc-500 font-medium text-sm md:text-md leading-relaxed">
                    Before the city finds its rhythm, the Hybrid Tribe is already moving through Pondicherry, India.
                    Building something one run at a time. Every Sunday. Without fail.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-5 md:gap-10 py-10 border-b border-zinc-900 last:border-0 items-start">
                <span className="text-[#E5FF00] font-black text-sm md:text-base tracking-wider shrink-0 mt-1">
                  03
                </span>
                <div>
                  <h3 className="text-white text-xl md:text-xl font-black tracking-tight mb-3">
                    The Tribe holds each other to the standard.
                  </h3>
                  <p className="text-zinc-500 font-medium text-sm md:text-md leading-relaxed">
                    Not motivation. Not hype. The quiet accountability of people who show up every week and notice
                    when you don't. That is the difference between a gym and a tribe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div
            data-aos="fade-left"
            className="relative h-[400px] lg:h-[calc(100%-2rem)] min-h-[500px] rounded-[22px] md:rounded-[30px] overflow-hidden sticky top-24"
          >
            <img
              src={crowdImg}
              alt="The Tribe"
              className="w-full h-full object-cover"
            />
            {/* Optional Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

        </div>
      </div>

      {/* Bottom Section: THE CLUBS (From Reference Image) */}
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12">
          <div className="flex justify-center items-center gap-2 mb-4 text-[#E5FF00] text-xs font-black tracking-widest uppercase">
            <span className="w-6 h-[2px] bg-[#E5FF00]"></span>
            THREE COMMUNITIES. ONE TRIBE
          </div>
          
          <h2
            className="text-white text-center text-4xl md:text-5xl font-black leading-[0.95] tracking-tight uppercase mb-4"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            THE <span className="text-[#E5FF00]">CLUBS</span>
          </h2>
          
          <p className="text-center text-zinc-500 text-sm md:text-base font-semibold max-w-lg mx-auto">
            Pick your entry point. Every club belongs to the same tribe.
          </p>
        </div>

        {/* Grid of Clubs */}
        <div 
          data-aos="fade-up"
          data-aos-delay="100"
          className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900 bg-[#070707] divide-y md:divide-y-0 md:divide-x divide-zinc-900 overflow-hidden"
        >
          {clubs.map((item, idx) => (
            <div key={idx} className="flex flex-col h-full relative">
              {/* Colored Top Accent Bar */}
              <div className="w-full h-[4px]" style={{ backgroundColor: item.color }} />

              {/* Card Content */}
              <div className="flex flex-col justify-between h-full p-8 md:p-10 bg-zinc-950/20">
                <div>
                  {/* Number */}
                  <span className="text-zinc-700 text-xs font-bold tracking-widest block mb-4">
                    {item.id}
                  </span>
                  
                  {/* Emoji / Icon */}
                  <span className="text-3xl md:text-4xl block mb-6 animate-pulse" role="img" aria-label={item.title}>
                    {item.emoji}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight leading-[0.95] mb-5"
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                  >
                    {item.title.split(" ").map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed mb-8">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom elements */}
                <div>
                  {/* Anchor Event */}
                  <div className="text-[#E5FF00] text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-6">
                    <span>⚡</span>
                    <span>{item.anchor}</span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => window.open(item.whatsappUrl, "_blank")}
                    className="w-full sm:w-auto text-black font-black uppercase tracking-wider text-xs md:text-sm px-6 py-3.5 transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer rounded-none"
                    style={{ backgroundColor: item.color }}
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
