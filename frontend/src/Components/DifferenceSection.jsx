import React from "react";
import {
  Dumbbell,
  HeartHandshake,
  BicepsFlexed,
  TimerReset,
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Performance Training",
    desc: "Structured boxing, strength, HYROX, and functional fitness programs designed for real performance.",
  },
  {
    icon: HeartHandshake,
    title: "Premium Experience",
    desc: "Train in a world-class environment built for comfort, focus, and high-performance training.",
  },
  {
    icon: BicepsFlexed,
    title: "Results Driven",
    desc: "Every session is designed to improve strength, endurance, conditioning, and overall fitness.",
  },
  {
    icon: TimerReset,
    title: "Discipline First",
    desc: "Consistency, mindset, and structured coaching built to help you perform at your best.",
  },
];

const DifferenceSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">

      <div className="max-w-[1600px] mx-auto">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-14">

          {/* BADGE */}
          <div className="inline-flex w-fit items-center bg-[#d9ff00] text-black font-bold uppercase text-xs md:text-sm px-5 py-3 rounded-xl tracking-wide">
            The BXC Difference
          </div>

          {/* TITLE */}
          <div className="max-w-[900px]">
            <h2
              className="
                text-white
                uppercase
                font-extrabold
                leading-[1]
                tracking-[-2px]
                text-[38px]
                sm:text-[55px]
                md:text-[75px]
                lg:text-[90px]
              "
            >
              Where Discipline Builds Real Performance.
            </h2>
          </div>

        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-8 items-stretch">

          {/* LEFT IMAGE */}
          <div className="relative overflow-hidden rounded-[30px] min-h-[350px] md:min-h-[750px]">

            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"
              alt="Gym"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                grayscale
                hover:scale-105
                transition-all
                duration-700
              "
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/20"></div>

          </div>

          {/* RIGHT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    group
                    bg-[#0d0d0d]
                    border
                    border-white/5
                    rounded-[28px]
                    p-8
                    md:p-10
                    min-h-[320px]
                    flex
                    flex-col
                    justify-start
                    transition-all
                    duration-500
                    hover:border-[#d9ff00]/40
                    hover:bg-[#121212]
                    hover:-translate-y-2
                  "
                >

                  {/* ICON */}
                  <div className="
                    w-[75px]
                    h-[75px]
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    mb-8
                  ">
                    <Icon
                      size={48}
                      strokeWidth={2.2}
                      className="
                        text-[#d9ff00]
                        group-hover:scale-110
                        transition-all
                        duration-500
                      "
                    />
                  </div>

                  {/* TITLE */}
                  <h3
                    className="
                      text-white
                      uppercase
                      font-extrabold
                      leading-[1.1]
                      tracking-[-1px]
                      text-[28px]
                      md:text-[34px]
                    "
                  >
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      text-[#8b8b8b]
                      text-base
                      md:text-[20px]
                      leading-[1.8]
                      mt-6
                    "
                  >
                    {item.desc}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default DifferenceSection;