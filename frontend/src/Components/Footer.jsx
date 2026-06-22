import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10">
      <div
        className="
          px-0
          md:px-8
          lg:px-16
          py-9
          md:py-13
          flex
          items-center
          justify-center
          max-w-[1400px]
          mx-auto
        "
      >
        <p
          className="
            text-[#8b8b8b]
            text-center
            font-bold
            text-[17px]
            md:text-[18px]
            leading-relaxed
            
            md:px-4
          "
          style={{ fontFamily: '"Brutal", sans-serif' }}
        >
          Copyright © 2026{" "}
          <span className="text-[#d9ff00] font-bold">
            Box & Cross
          </span>{" "}
          . All Rights Reserved. Developed By{" "}
          <span className="text-[#d9ff00] font-bold">
            Kerplunk Media
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;