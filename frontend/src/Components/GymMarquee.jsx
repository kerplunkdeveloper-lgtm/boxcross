import React from "react";

const GymMarquee = () => {
  const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
  ];

  return (
    <section className="w-full bg-black py-10 overflow-hidden">

      {/* MARQUEE */}
      <div className="marquee-wrapper">

        <div className="marquee-track">

          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden shrink-0 rounded-none"
            >

              {/* IMAGE */}
              <img
                src={img}
                alt="gym"
                className="
                  w-[260px] 
                  sm:w-[320px] 
                  md:w-[380px] 
                  lg:w-[420px]
                  h-[220px]
                  sm:h-[280px]
                  md:h-[250px]
                  object-cover
                  grayscale
                  group-hover:grayscale-0
                  transition-all
                  duration-500
                  ease-in-out
                  scale-100
                  group-hover:scale-105
                "
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500"></div>

            </div>
          ))}

        </div>

      </div>

      {/* STYLE */}
      <style>
        {`
          .marquee-wrapper {
            width: 100%;
            overflow: hidden;
          }

          .marquee-track {
            display: flex;
            width: max-content;
            animation: scrollRight 30s linear infinite;
          }

          .marquee-track:hover {
            animation-play-state: paused;
          }

          @keyframes scrollRight {
            from {
              transform: translateX(-50%);
            }

            to {
              transform: translateX(0%);
            }
          }
        `}
      </style>

    </section>
  );
};

export default GymMarquee;