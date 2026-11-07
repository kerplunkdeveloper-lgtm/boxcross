import React from "react";
import {
  UserRound,
  Mail,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

const TrialSection = () => {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-4 md:px-10 lg:px-20 overflow-hidden">

      {/* MAIN CONTAINER */}
      <div
        className="
          relative
          max-w-[1700px]
          mx-auto
          rounded-[30px]
          overflow-hidden
          min-h-[850px]
          flex
          items-center
        "
      >

        {/* BACKGROUND IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* CONTENT */}
        <div className="relative z-10 w-full px-5 md:px-10 lg:px-20 py-16">

          {/* LEFT CONTENT */}
          <div className="max-w-[850px]">

            {/* BADGE */}
            <div
              className="
                inline-flex
                items-center
                bg-[#d9ff00]
                text-black
                font-bold
                uppercase
                text-xs
                md:text-sm
                px-5
                py-3
                rounded-xl
                tracking-wide
                mb-8
              "
            >
              Book Your Trial
            </div>

            {/* TITLE */}
            <h2
              className="
                text-white
                uppercase
                font-extrabold
                leading-[1]
                tracking-[-2px]
                text-[42px]
                sm:text-[60px]
                md:text-[85px]
                lg:text-[100px]
                max-w-[900px]
              "
            >
              Start Your Performance Journey.
            </h2>

            {/* FORM */}
            <form className="mt-12">

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="
                      w-full
                      bg-black/40
                      backdrop-blur-md
                      border
                      border-white/10
                      rounded-2xl
                      px-6
                      pr-16
                      py-5
                      text-white
                      placeholder:text-white/70
                      outline-none
                      text-lg
                    "
                  />

                  <UserRound
                    size={24}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-white
                    "
                  />
                </div>

                {/* EMAIL */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="
                      w-full
                      bg-black/40
                      backdrop-blur-md
                      border
                      border-white/10
                      rounded-2xl
                      px-6
                      pr-16
                      py-5
                      text-white
                      placeholder:text-white/70
                      outline-none
                      text-lg
                    "
                  />

                  <Mail
                    size={24}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-white
                    "
                  />
                </div>

                {/* PHONE */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="
                      w-full
                      bg-black/40
                      backdrop-blur-md
                      border
                      border-white/10
                      rounded-2xl
                      px-6
                      py-5
                      text-white
                      placeholder:text-white/70
                      outline-none
                      text-lg
                    "
                  />
                </div>

                {/* SELECT */}
                <div className="relative">

                  <select
                    className="
                      w-full
                      appearance-none
                      bg-black/40
                      backdrop-blur-md
                      border
                      border-white/10
                      rounded-2xl
                      px-6
                      pr-16
                      py-5
                      text-white
                      outline-none
                      text-lg
                    "
                  >
                    <option>Select Memberships</option>
                    <option>Strength Training</option>
                    <option>Boxing</option>
                    <option>HYROX</option>
                  </select>

                  <ChevronDown
                    size={24}
                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-white
                      pointer-events-none
                    "
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div className="relative mt-5">

                <textarea
                  rows="5"
                  placeholder="Message"
                  className="
                    w-full
                    bg-black/40
                    backdrop-blur-md
                    border
                    border-white/10
                    rounded-2xl
                    px-6
                    pr-16
                    py-5
                    text-white
                    placeholder:text-white/70
                    outline-none
                    text-lg
                    resize-none
                  "
                ></textarea>

                <MessageSquare
                  size={24}
                  className="
                    absolute
                    right-5
                    top-6
                    text-white
                  "
                />

              </div>

              {/* BUTTON */}
              <button
                className="
                  w-full
                  mt-5
                  bg-[#d9ff00]
                  text-black
                  uppercase
                  font-extrabold
                  text-sm
                  md:text-lg
                  py-5
                  rounded-2xl
                  hover:bg-lime-300
                  transition-all
                  duration-300
                "
              >
                Book Your Seat
              </button>

            </form>

          </div>

          {/* FLOATING CARD */}
          <div
            className="
              absolute
              right-5
              bottom-5
              md:right-10
              md:bottom-10
              bg-[#d9ff00]
              rounded-[30px]
              p-6
              md:p-10
              w-[250px]
              md:w-[340px]
              shadow-2xl
            "
          >

            {/* TEXT */}
            <h3
              className="
                text-black
                uppercase
                font-extrabold
                leading-[1.2]
                tracking-[-1px]
                text-[32px]
                md:text-[48px]
              "
            >
              Founding Member Access
            </h3>

            {/* USERS */}
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
                  alt="member"
                  className="
                    w-[50px]
                    h-[50px]
                    md:w-[65px]
                    md:h-[65px]
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
                  w-[50px]
                  h-[50px]
                  md:w-[65px]
                  md:h-[65px]
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

export default TrialSection;