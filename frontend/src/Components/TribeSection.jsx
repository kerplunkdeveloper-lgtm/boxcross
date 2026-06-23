import React from "react";
import crowdImg from "../assets/runn.png";

export default function TribeSection() {
  const subCommunities = [
    {
      title: "FIGHT CLUB",
      desc: "Fighters. Discipline. Boxing.",
      img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=150&auto=format&fit=crop"
    },
    {
      title: "STRENGTH LAB",
      desc: "Strength. Power. Progress.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop"
    },
    {
      title: "HYROX LAB",
      desc: "Endurance. Race Day. Grit.",
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop"
    },
    {
      title: "RUN CLUB",
      desc: "Sunday Sunrise Runs.",
      img: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=150&auto=format&fit=crop"
    },
    {
      title: "JUNIOR ATHLETES",
      desc: "Future Champions.",
      img: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-black py-12  sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT CARD: WHAT THE TRIBE IS */}
          <div 
            data-aos="fade-right"
            className="card-border-spin-container rounded-[24px] md:rounded-[32px] p-[1.5px] h-full"
          >
            <div 
              className="card-border-spin-inner relative w-full h-full min-h-[480px] md:min-h-[580px] rounded-[22px] md:rounded-[30px] overflow-hidden bg-cover bg-right flex flex-col justify-center p-6 sm:p-8 md:p-12"
              style={{ backgroundImage: `url(${crowdImg})` }}
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 sm:via-black/75 to-black/20 z-0"></div>



              {/* Text Content */}
              <div className="relative z-10 w-full flex flex-col justify-center">
                <h2 
                  className="text-white text-3xl md:text-4xl font-black uppercase tracking-wider mb-8"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  WHAT THE TRIBE IS
                </h2>

                <div className="space-y-6">
                  <p className="text-zinc-200 text-sm sm:text-base font-semibold leading-relaxed max-w-[90%] sm:max-w-[80%]">
                    The Tribe is everyone who trains at BXC. 
                  </p>

                  <p className="text-zinc-200 text-sm sm:text-base font-semibold leading-relaxed max-w-[50%] sm:max-w-[50%]">
                    Fight Club. Strength Lab. HYROX Lab. Run Club. Hybrid Performance. Junior Athletes. One Community.
                  </p>

                  <div className="w-12 h-[2px] bg-[#E5FF00]/60"></div>

                  <p className="text-zinc-200 text-sm sm:text-base font-semibold leading-relaxed max-w-[50%] sm:max-w-[50%]">
                    The Tribe shows up on Sunday mornings. Before the city wakes up, the Tribe is already moving.
                  </p>

                  <div className="w-12 h-[2px] bg-[#E5FF00]/60"></div>

                  <p className="text-zinc-200 text-sm sm:text-base font-semibold leading-relaxed max-w-[50%] sm:max-w-[50%]">
                    The Tribe holds each other to the standard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: SUB-COMMUNITIES */}
          <div 
            data-aos="fade-left"
            data-aos-delay="150"
            className="card-border-spin-container rounded-[24px] md:rounded-[32px] p-[1.5px] h-full"
          >
            <div className="card-border-spin-inner relative w-full h-full rounded-[22px] md:rounded-[30px] overflow-hidden bg-zinc-950 flex flex-col p-6 sm:p-8 md:p-10 justify-between">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-black uppercase tracking-wider mb-8"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  SUB-COMMUNITIES
                </h2>

                <div className="flex flex-col">
                  {subCommunities.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between py-4 border-b border-zinc-900/60 last:border-0 gap-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="w-12 h-12 sm:w-50 sm:h-17 rounded-md object-cover border border-zinc-800 flex-shrink-0"
                        />
                        <div>
                          <h3 
                            className="text-[#E5FF00] font-black text-sm sm:text-base md:text-md tracking-wider uppercase leading-none"
                            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-zinc-400 text-[11px] sm:text-xs md:text-sm font-semibold mt-1.5 leading-none">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => window.open("https://wa.me/918925556900", "_blank")}
                        className="border border-[#E5FF00] text-[#E5FF00] hover:bg-[#E5FF00] hover:text-black rounded-lg px-4 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-black tracking-wider transition-all duration-300 active:scale-95 cursor-pointer uppercase flex-shrink-0"
                      >
                        JOIN
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}