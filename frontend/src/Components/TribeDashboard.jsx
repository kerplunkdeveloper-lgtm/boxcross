import React from "react";

const TribeDashboard = () => {
  const leaderboards = [
    {
      label: "FIGHT CLUB",
      title: "Member of the Month",
      color: "#E5FF00",
      rows: [
        { rank: "01", name: "Arjun R.", metric: "15 sessions" },
        { rank: "02", name: "Priya K.", metric: "12 sessions" },
        { rank: "03", name: "Ganesh R.", metric: "10 sessions" }
      ]
    },
    {
      label: "LIFTING CLUB",
      title: "Top PRs This Month",
      color: "#E5FF00",
      rows: [
        { rank: "01", name: "Karthik M.", metric: "230kg deadlift" },
        { rank: "02", name: "Divya S.", metric: "70kg squat" },
        { rank: "03", name: "Rajan P.", metric: "90kg bench" }
      ]
    },
    {
      label: "RUN CLUB",
      title: "Most Consistent This Month",
      color: "#00C2FF",
      rows: [
        { rank: "01", name: "Vikram A.", metric: "4 Sundays" },
        { rank: "02", name: "Meera T.", metric: "4 Sundays" },
        { rank: "03", name: "Arun D.", metric: "3 Sundays" }
      ]
    }
  ];

  const testimonials = [
    {
      text: "I came for the boxing. I stayed for the people. Six months later I cannot imagine training anywhere else.",
      name: "PRIYA",
      club: "HYBRID PERFORMANCE",
      duration: "6 MONTHS",
      color: "#E5FF00"
    },
    {
      text: "I thought HYROX was not for someone like me. Month three proved me completely wrong.",
      name: "KARTHIK",
      club: "HYROX LAB",
      duration: "3 MONTHS",
      color: "#E5FF00"
    },
    {
      text: "My son is a different person. The discipline he learned here followed him home and into school.",
      name: "ANITHA",
      club: "JUNIOR ATHLETES PARENT",
      duration: "8 MONTHS",
      color: "#E5FF00"
    },
    {
      text: "The Run Club got me out of bed every Sunday. Now I look forward to Monday because of it.",
      name: "RAJ",
      club: "RUN CLUB",
      duration: "3 MONTHS",
      color: "#00C2FF"
    },
    {
      text: "Coach Prabha is an amazing teacher and boxer. He genuinely loves the sport and makes you feel the same.",
      name: "PAVAN",
      club: "FIGHT CLUB",
      duration: "5 MONTHS",
      color: "#E5FF00"
    },
    {
      text: "Best place to train in Pondicherry. The community here is unlike anything the city has seen before.",
      name: "SUNDAR",
      club: "STRENGTH LAB",
      duration: "7 MONTHS",
      color: "#E5FF00"
    }
  ];

  return (
    <section className="bg-black py-16 sm:py-24 overflow-hidden border-t border-zinc-900/40">
      {/* SECTION 1: THIS MONTH */}
      <div className="max-w-7xl mx-auto px-2 md:px-8 lg:px-2 mb-24">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12">
          <div className="flex justify-center items-center gap-2 mb-4 text-[#E5FF00] text-xs font-black tracking-widest uppercase">
            <span className="w-6 h-[2px] bg-[#E5FF00]"></span>
            THE TRIBE COMPETING WITH ITSELF
          </div>

          <h2
            className="text-white flex justify-center items-center text-4xl md:text-5xl font-black leading-[0.95] tracking-tight uppercase mb-4"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            THIS 
            <span className="text-[#E5FF00] mx-3"> MONTH.</span>
          </h2>
          <p className="text-zinc-500 text-sm p-3 text-center md:text-base font-semibold">
            Not a competition. A dashboard. Every name on this board showed up.
          </p>
        </div>

        {/* Leaderboard Cards Grid */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {leaderboards.map((card, idx) => (
            <div 
              key={idx} 
              className="card-border-spin-container rounded-[20px] md:rounded-[28px] p-[1.5px] h-full"
              style={{ "--spin-glow-color": card.color }}
            >
              <div className="card-border-spin-inner relative rounded-[18px] md:rounded-[26px] overflow-hidden bg-zinc-950/90 h-full p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-[#E5FF00] text-md font-bold tracking-widest block mb-2 uppercase">
                    {card.label}
                  </span>

                  <h3
                  className="text-white text-xl md:text-[18px]  mt-3 font-black uppercase tracking-wider mb-6"
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                  >
                    {card.title}
                  </h3>

                  {/* Rows List */}
                  <div className="space-y-1">
                    {card.rows.map((row, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between py-3.5 border-b border-zinc-900 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#E5FF00] font-black text-sm tracking-wider">
                            {row.rank}
                          </span>
                          <span className="text-white font-black text-sm sm:text-base tracking-wide">
                            {row.name}
                          </span>
                        </div>
                        <span className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wide">
                          {row.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



     
    </section>
  );
};

export default TribeDashboard;
