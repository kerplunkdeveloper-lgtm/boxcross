import React from "react";
import {
  HeartPulse,
  Dumbbell,
  Users,
  Snowflake,
  Lock,
  ShowerHead,
  Car,
  Wifi,
} from "lucide-react";

const features = [
  {
    icon: HeartPulse,
    title: "10,000 SQ FT",
    desc: "Spacious high-performance training environment designed for boxing, strength, HYROX, and functional fitness.",
  },
  {
    icon: Dumbbell,
    title: "ELITE EQUIPMENT",
    desc: "Featuring premium strength and performance equipment built for serious training and athletic development.",
  },
  {
    icon: Users,
    title: "EXPERT COACHING",
    desc: "Train with experienced coaches focused on performance, discipline, transformation, and real results.",
  },
  {
    icon: Snowflake,
    title: "CLIMATE CONTROLLED",
    desc: "Fully air-conditioned environment designed for comfort, recovery, and peak training performance.",
  },
  {
    icon: Lock,
    title: "SMART LOCKERS",
    desc: "Secure locker access for a seamless and premium training experience.",
  },
  {
    icon: ShowerHead,
    title: "PREMIUM SHOWERS",
    desc: "Modern shower facilities designed for recovery, comfort, and convenience after every session.",
  },
  {
    icon: Car,
    title: "EASY PARKING",
    desc: "Convenient parking access for a smooth training experience from arrival to workout.",
  },
  {
    icon: Wifi,
    title: "HIGH-SPEED WI-FI",
    desc: "Stay connected with uninterrupted high-speed internet access throughout the arena.",
  },
];

const ExperienceSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">

      {/* TOP */}
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-14">

          {/* BADGE */}
          <div className="inline-flex w-fit items-center bg-[#d9ff00] text-black font-bold uppercase text-xs md:text-sm px-5 py-3 rounded-xl tracking-wide">
            Premium Facilities For Real Performance
          </div>

          {/* TITLE */}
          <h2 className="
            text-white
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            uppercase
            tracking-[-2px]
            leading-none
          ">
            The BXC Experience
          </h2>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  relative
                  bg-[#0a0a0a]
                  border
                  border-white/5
                  rounded-[26px]
                  p-8
                  md:p-10
                  min-h-[320px]
                  flex
                  flex-col
                  items-center
                  text-center
                  justify-start
                  transition-all
                  duration-500
                  hover:border-[#d9ff00]/40
                  hover:-translate-y-2
                  hover:bg-[#111]
                "
              >

                {/* GLOW */}
                <div className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-500
                  bg-[radial-gradient(circle_at_top,rgba(217,255,0,0.12),transparent_70%)]
                  rounded-[26px]
                "></div>

                {/* ICON */}
                <div className="
                  relative
                  z-10
                  w-[90px]
                  h-[90px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mb-8
                ">
                  <Icon
                    size={48}
                    strokeWidth={2.3}
                    className="
                      text-[#d9ff00]
                      transition-all
                      duration-500
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* TITLE */}
                <h3 className="
                  relative
                  z-10
                  text-white
                  text-2xl
                  md:text-[18px]
                  font-extrabold
                  uppercase
                  leading-tight
                ">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="
                  relative
                  z-10
                  text-[#8b8b8b]
                  text-base
                  md:text-[12px]
                  leading-[1.8]
                  mt-6
                ">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;