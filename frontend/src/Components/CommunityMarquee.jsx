import React from 'react';

const CommunityMarquee = () => {
  const items = [
    "FRIDAY FIGHT NIGHT",
    "SUNDAY TRIBE RUN",
    "MONTHLY PR BOARD",
    "PONDICHERRY, INDIA",
    "FIGHT CLUB",
    "LIFTING CLUB",
    "RUN CLUB",
    "HYROX LAB",
    "HYBRID PERFORMANCE"
  ];

  return (
    <div className="w-full bg-[#090909] py-4 border-y border-zinc-900/60 overflow-hidden flex items-center select-none pointer-events-none relative z-10">
      <div className="flex whitespace-nowrap animate-[scrollLeftMarquee_97s_linear_infinite] w-max">
        {[...Array(10)].map((_, arrayIdx) => (
          <div key={arrayIdx} className="flex items-center shrink-0">
            {items.map((item, idx) => (
              <React.Fragment key={`${arrayIdx}-${idx}`}>
                <div className="w-1.5 h-2 bg-[#E5FF00] mx-8 md:mx-12 shrink-0 shadow-[0_0_8px_rgba(229,255,0,0.4)]"></div>
                <span 
                  className="text-zinc-500 font-bold text-xs md:text-2xl tracking-[0.2em] uppercase shrink-0"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scrollLeftMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CommunityMarquee;
