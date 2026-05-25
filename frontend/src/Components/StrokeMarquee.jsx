import React from "react";

const StrokeMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-black py-6">
      <div className="marquee whitespace-nowrap flex items-center gap-16">
        
        <h1 className="stroke-text text-[80px] md:text-[140px] font-extrabold uppercase leading-none">
          Fitness Training
        </h1>

        <h1 className="stroke-text text-[80px] md:text-[140px] font-extrabold uppercase leading-none">
          Fitness Training
        </h1>

        <h1 className="stroke-text text-[80px] md:text-[140px] font-extrabold uppercase leading-none">
          Fitness Training
        </h1>

      </div>

      <style>
        {`
          .marquee {
            width: max-content;
            animation: marqueeMove 18s linear infinite;
          }

          @keyframes marqueeMove {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-33.33%);
            }
          }

          .stroke-text {
            color: transparent;
            -webkit-text-stroke: 1.5px rgba(255,255,255,0.2);
            letter-spacing: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default StrokeMarquee;