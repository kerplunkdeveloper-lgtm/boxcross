import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-white/10">

      <div
        className="
          max-w-[1700px]
          mx-auto
          px-5
          md:px-8
          lg:px-10
          py-4
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-4
        "
      >

        {/* LEFT */}
        <p
          className="
            text-[#8b8b8b]
            text-xs
            md:text-sm
            text-center
            md:text-left
          "
        >
          Copyright © 2026{" "}
          <span className="text-[#d9ff00] font-bold">
            Box & Cross
          </span>{" "}
          . All Rights Reserved.
        </p>

        {/* RIGHT LINKS */}
        <div
          className="
            flex
            items-center
            flex-wrap
            justify-center
            gap-4
            md:gap-6
          "
        >

          {[
            "Privacy Policy",
            "Terms of Use",
            "FAQs",
          ].map((item, index) => (
            <button
              key={index}
              className="
                text-[#8b8b8b]
                hover:text-white
                transition-all
                duration-300
                text-xs
                md:text-sm
              "
            >
              {item}
            </button>
          ))}

        </div>

      </div>

    </footer>
  );
};

export default Footer;