import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10">
      <div
        className="
          px-4
          md:px-8
          lg:px-16
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
        {/* Left Side: Copyright */}
        <p
          className="
            text-[#8b8b8b]
            text-center
            md:text-left
            font-bold
            text-[14px]
            md:text-[15px]
            leading-relaxed
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

        {/* Right Side: Privacy Policy & Terms and Conditions */}
        <div
          className="
            flex
            items-center
            flex-wrap
            justify-center
            md:justify-end
            gap-6
            md:gap-8
            text-[14px]
            md:text-[15px]
            font-bold
            text-[#8b8b8b]
          "
          style={{ fontFamily: '"Brutal", sans-serif' }}
        >
          <Link
            to="https://boxandcross.com/privacy-policy/"
            className="inline-flex items-center gap-2.5 hover:text-white transition-colors duration-200"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#d9ff00] inline-block shrink-0 shadow-[0_0_8px_rgba(217,255,0,0.4)]"></span>
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="https://boxandcross.com/terms-and-conditions/"
            className="inline-flex items-center gap-2.5 hover:text-white transition-colors duration-200"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#d9ff00] inline-block shrink-0 shadow-[0_0_8px_rgba(217,255,0,0.4)]"></span>
            <span>Terms and Conditions</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;