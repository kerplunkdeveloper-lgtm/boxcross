import React from "react";

const OurStory = () => {
  return (
    <section className="w-full bg-black text-white py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* LEFT CONTENT */}
        <div>

          {/* Badge */}
          <div className="inline-flex items-center bg-[#d9ff00] text-black font-semibold text-sm md:text-base px-5 py-2 rounded-xl mb-8">
            OUR STORY
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase ">
            WE ARE DEDICATED TO HELPING PEOPLE OF ALL FITNESS LEVELS ACHIEVE THEIR GOALS.
          </h2>

          {/* Description */}
          <p className="text-gray-400  leading-[1.8] mt-8 max-w-[700px]">
            We’re committed to helping you achieve your health and wellness
            goals through expert guidance, modern equipment, and a motivating
            atmosphere certified trainers design personalized programs.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 mt-10">

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Modern Fitness Equipment
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Nutrition & Wellness Support
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Personalized Training Programs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Motivating & Friendly Environment
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Flexible Membership Options
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#d9ff00] text-xl">›</span>
              <p className="text-gray-300 text-lg font-medium">
                Group Classes & Special Programs
              </p>
            </div>

          </div>

          {/* BUTTON */}
          <button className="mt-12 bg-[#d9ff00] hover:bg-lime-300 transition-all duration-300 text-black font-bold uppercase text-sm md:text-base px-8 md:px-12 py-4 rounded-2xl">
            START TRAINING TODAY
          </button>
        </div>

        {/* RIGHT IMAGE CARD */}
        <div className="relative w-full">

          <div className="relative overflow-hidden rounded-[30px]">

            {/* IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1974&auto=format&fit=crop"
              alt="Fitness"
              className="w-full h-[500px] md:h-[650px] object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#d9ff00]/95 via-[#d9ff00]/20 to-transparent"></div>

            {/* CONTENT */}
            <div className="absolute bottom-8 left-6 md:left-10 z-10 max-w-[90%]">

              <h3 className="text-black uppercase font-extrabold  text-xl md:text-2xl  lg:text-3xl ">
                “BUILDING A LEGACY OF
              </h3>

              <h3 className="uppercase text-2xl md:text-3xl  lg:text-5xl ">

                {/* OUTLINE TEXT */}
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "2px black",
                  }}
                >
                  FITNESS FROM
                </span>

                <span className="text-black font-extrabold">
                  {" "}
                  1994{" "}
                </span>

                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "2px black",
                  }}
                >
                  TO
                </span>

                <span className="text-black font-extrabold">
                  {" "}
                  2025.”
                </span>

              </h3>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default OurStory;