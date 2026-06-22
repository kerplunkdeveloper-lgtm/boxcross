import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10">
      <div
        className="
          px-6
          md:px-8
          lg:px-20
          py-6
          md:py-8
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-4
          max-w-[1400px]
          mx-auto
        "
      >
        {/* LEFT: Copyright Info */}
        <p
          className="
            text-[#8b8b8b]
            text-center
            md:text-left
            font-bold
            text-[14px]
            md:text-[16px]
            leading-relaxed
            px-16
            md:px-0
          "
          style={{ fontFamily: '"Brutal", sans-serif' }}
        >
          Copyright © 2026{" "}
          <span className="text-[#d9ff00] font-bold mx-1">
            Box & Cross .
          </span>{" "}
          All Rights Reserved.
        </p>

        {/* RIGHT: Developer Info */}
        <p
          className="
            text-[#8b8b8b]
            text-center
            md:text-left
            font-bold
            text-[14px]
            md:text-[16px]
            px-16
            md:px-0
          "
          style={{ fontFamily: '"Brutal", sans-serif' }}
        >
          Developed By{" "}
          <span className="text-[#d9ff00] font-bold ml-1">
            Kelpunk Media
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;