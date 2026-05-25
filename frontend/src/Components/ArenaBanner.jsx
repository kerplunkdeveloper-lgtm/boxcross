import React from "react";

const ArenaBanner = () => {
  return (
    <section
      className="
        relative
        w-full
        min-h-[65vh]
        md:min-h-[80vh]
        lg:min-h-screen
        overflow-hidden
        bg-fixed
        bg-center
        bg-cover
        flex
        items-center
        justify-center
        px-5
        md:px-10
        lg:px-20
      "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop')",
      }}
    >

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* TOP BADGE */}
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
          Enter The Arena
        </div>

        {/* HEADING */}
        <h2
          className="
            text-white
            uppercase
            font-extrabold
         
           
            max-w-[1700px]
            text-[20px]
            sm:text-[25px]
            md:text-[30px]
            lg:text-[50px]
           
          "
        >
          Train With Elite Coaching & Real Performance.
        </h2>

        {/* BUTTON */}
        <button
          className="
            mt-10
            md:mt-14
            bg-[#d9ff00]
            text-black
            uppercase
            font-extrabold
            text-sm
            md:text-lg
            px-8
            md:px-14
            py-4
            md:py-6
            rounded-2xl
            hover:bg-lime-300
            transition-all
            duration-300
            hover:scale-105
          "
        >
          Book A Free Trial
        </button>

      </div>

    </section>
  );
};

export default ArenaBanner;