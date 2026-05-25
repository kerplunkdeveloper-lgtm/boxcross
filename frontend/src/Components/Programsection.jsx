import React from "react";
import { motion } from "framer-motion";

const programs = [
  {
    number: "01",
    title: "HYROX LAB",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    desc: "Athlete-style conditioning program built for endurance, strength, speed, and HYROX performance.",
    button: "READ MORE →",
  },
  {
    number: "02",
    title: "FIGHT CLUB",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "FIGHT PERFORMANCE",
    image:
      "https://images.unsplash.com/photo-1518611012118-fbdf5804c1c3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "HYBRID PERFORMANCE",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "05",
    title: "STRENGTH LAB",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "06",
    title: "KIDS ATHLETIC PROGRAM",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
  },
];

const ProgramsSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">

      <div className="max-w-[1500px] mx-auto">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="
              inline-flex
              w-fit
              items-center
              bg-[#d9ff00]
              text-black
              font-bold
              uppercase
              text-[10px]
              md:text-xs
              px-4
              py-2
              rounded-lg
              tracking-wide
            "
          >
            Performance Programs
          </motion.div>

          {/* TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="
              text-white
              uppercase
              font-extrabold
              leading-none
              tracking-[-2px]
              text-[40px]
              sm:text-[55px]
              md:text-[75px]
              lg:text-[90px]
            "
          >
            Built For Results
          </motion.h2>

        </div>

        {/* PROGRAM LIST */}
        <div className="border-b border-white/10">

          {programs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="
                group
                border-t
                border-white/10
                py-8
                md:py-10
              "
            >

              <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1.2fr] gap-8 lg:gap-14 items-center">

                {/* NUMBER */}
                <div>
                  <span
                    className="
                      text-[#d9ff00]
                      text-sm
                      md:text-base
                      italic
                    "
                  >
                    {item.number}
                  </span>
                </div>

                {/* TITLE */}
                <div>

                  <h3
                    className="
                      text-white
                      uppercase
                      font-extrabold
                      leading-[1]
                      tracking-[-1px]
                      text-[34px]
                      sm:text-[45px]
                      md:text-[60px]
                    "
                  >
                    {item.title}
                  </h3>

                </div>

                {/* IMAGE + CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-center">

                  {/* IMAGE */}
                  <div className="overflow-hidden rounded-2xl">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                        w-full
                        h-[180px]
                        md:h-[220px]
                        object-cover
                        grayscale
                        group-hover:grayscale-0
                        group-hover:scale-105
                        transition-all
                        duration-700
                      "
                    />

                  </div>

                  {/* DESCRIPTION */}
                  {item.desc && (
                    <div>

                      <p
                        className="
                          text-[#9b9b9b]
                          text-sm
                          md:text-base
                          leading-[1.8]
                        "
                      >
                        {item.desc}
                      </p>

                      <button
                        className="
                          mt-6
                          text-[#d9ff00]
                          uppercase
                          font-bold
                          text-xs
                          tracking-wide
                          hover:translate-x-2
                          transition-all
                          duration-300
                        "
                      >
                        {item.button}
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default ProgramsSection;