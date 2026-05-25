import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "15th batch student",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    review:
      "Joining this fitness center completely changed lifestyle! Trainers incredibly supportive, and the environment keeps.",
  },
  {
    name: "Ava Thompson",
    role: "8th batch student",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    review:
      "My strength, stamina, and confidence have all improved. Joining this gym was the best decision I made this year.",
  },
  {
    name: "Grace Miller",
    role: "10th batch student",
    image:
      "https://images.unsplash.com/photo-1491349174775-aaafddd81942?q=80&w=400&auto=format&fit=crop",
    review:
      "Excellent mix of motivation and professionalism. This place helped me build healthy habits that actually stick.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">

      <div className="max-w-[1600px] mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-16">

          {/* LEFT BADGE */}
          <div className="inline-flex w-fit items-center bg-[#d9ff00] text-black font-bold uppercase text-xs md:text-sm px-5 py-3 rounded-xl tracking-wide">
            Client Testimonials
          </div>

          {/* RIGHT TITLE */}
          <div className="max-w-[900px]">
            <h2 className="
              text-white
              uppercase
              font-extrabold
              leading-[1.05]
              tracking-[-2px]
              text-[20px]
              sm:text-[35px]
              md:text-[45px]
              lg:text-[59px]
            ">
              Every Transformation Client Story Inspires Us To Continue Delivering
            </h2>
          </div>

        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="
                relative
                bg-[#0a0a0a]
                border
                border-white/20
                rounded-[28px]
                p-8
                md:p-12
                min-h-[520px]
                flex
                flex-col
                justify-between
                transition-all
                duration-500
                hover:border-[#d9ff00]/50
                hover:bg-[#101010]
              "
            >

              {/* TOP CONTENT */}
              <div>

                {/* STARS */}
                <div className="flex items-center gap-2 mb-10">

                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      fill="#d9ff00"
                      stroke="#d9ff00"
                    />
                  ))}

                </div>

                {/* REVIEW */}
                <h3 className="
                  text-white
                  uppercase
                  font-extrabold
                  leading-[1.4]
                  text-[18px]
                  md:text-[20px]
                  tracking-[-1px]
                ">
                  “{item.review}”
                </h3>

              </div>

              {/* BOTTOM USER */}
              <div className="flex items-center gap-5 mt-14">

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-[75px]
                    h-[75px]
                    rounded-full
                    object-cover
                    border
                    border-white/10
                  "
                />

                {/* USER INFO */}
                <div>

                  <h4 className="
                    text-white
                    uppercase
                    font-bold
                    text-[22px]
                    md:text-[28px]
                    leading-none
                  ">
                    {item.name}
                  </h4>

                  <p className="
                    text-[#8a8a8a]
                    text-base
                    md:text-xl
                    mt-3
                  ">
                    {item.role}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;