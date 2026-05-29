import React from "react";
import { PhoneCall } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-5 md:px-10 lg:px-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-14 xl:gap-24 items-center">
        {/* LEFT CONTENT */}
        <div>
          {/* BADGE */}
          <div className="inline-flex items-center bg-[#d9ff00] text-black font-bold uppercase text-xs md:text-sm px-5 py-3 rounded-xl tracking-wide mb-8">
            About Us
          </div>

          {/* TITLE */}
          <h2
            className="
              text-white
              uppercase
              font-extrabold
              leading-[1.05]
              tracking-[-2px]
              text-[30px]
              sm:text-[42px]
              md:text-[50px]
              lg:text-[70px]
              max-w-[900px]
            "
          >
            Elevate Your Fitness & Performance
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              text-[#9b9b9b]
              text-base
              md:text-[20px]
              leading-[1.8]
              mt-10
              max-w-[700px]
            "
          >
            Box and Cross is a performance-focused training arena built for
            boxing, strength, HYROX, and functional fitness. Train with expert
            coaching in a high-energy environment designed for real
            transformation.
          </p>

          {/* FEATURES */}
          <div className="mt-12 space-y-7">
            {[
              "Boxing & Conditioning",
              "Strength & Endurance",
              "Premium Training Experience",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-8">
                <span
                  className="
                    text-[#9b9b9b]
                    italic
                    text-2xl
                    md:text-[30px]
                    min-w-[50px]
                  "
                >
                  0{index + 1}
                </span>

                <h3
                  className="
                    text-white
                    uppercase
                    font-bold
                    text-[24px]
                    md:text-[20px]
                    tracking-[-1px]
                  "
                >
                  {item}
                </h3>
              </div>
            ))}
          </div>

          {/* BUTTON + CONTACT */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-10 mt-14">
            {/* BUTTON */}
            <button
              className="
                bg-[#d9ff00]
                text-black
                uppercase
                font-extrabold
                text-sm
                md:text-md
                px-10
                md:px-14
                py-5
                rounded-2xl
                hover:bg-lime-300
                transition-all
                duration-300
                w-fit
              "
            >
              Experience BXC
            </button>

            {/* CALL */}
            <div className="flex items-center gap-5">
              <div
                className="
                  w-[55px]
                  h-[55px]
                  rounded-full
                  bg-[#111]
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <PhoneCall size={24} className="text-white" />
              </div>

              <h4
                className="
                  text-white
                  font-bold
                  text-[18px]
                  md:text-[20px]
                "
              >
                CALL : +91 89255 56800
              </h4>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          {/* IMAGE CONTAINER */}
          <div className="relative overflow-hidden  rounded-[34px]">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"
              alt="Gym"
              className="
                w-full
                h-[500px]
                md:h-[850px]
                object-cover
                grayscale
              "
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* FLOATING CARD */}
          <div
            className="
              absolute
              left-5
              bottom-5
              md:left-10
              md:bottom-10
              bg-[#d9ff00]
              rounded-[30px]
              p-6
              md:p-10
              w-[280px]
              md:w-[420px]
              shadow-2xl
            "
          >
            {/* TITLE */}
            <h3
              className="
                text-black
                uppercase
                font-extrabold
                leading-[1.15]
                tracking-[-1px]
                text-[20px]
                md:text-[24px]
              "
            >
              100+ <br />
              Performance <br />
              <br />
              Driven Community
            </h3>

            {/* AVATARS */}
            <div className="flex items-center mt-8">
              {[
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/12.jpg",
                "https://randomuser.me/api/portraits/women/68.jpg",
              ].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="user"
                  className="
                    w-[55px]
                    h-[55px]
                    md:w-[70px]
                    md:h-[70px]
                    rounded-full
                    object-cover
                    border-2
                    border-black
                    -ml-3
                    first:ml-0
                  "
                />
              ))}

              {/* PLUS */}
              <div
                className="
                  w-[55px]
                  h-[55px]
                  md:w-[70px]
                  md:h-[70px]
                  rounded-full
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  text-3xl
                  border-2
                  border-black
                  -ml-3
                "
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
