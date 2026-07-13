import React from "react";
import { Phone } from "lucide-react";
import logo from "../../assets/eventlogo.png";
import { Link } from "react-router-dom";

const EventNavbar = () => {
  return (
    <nav className="w-full flex items-center  justify-between px-6 md:px-12 py-4 bg-black/10 backdrop-blur-md border-b border-white/5 fixed top-0 left-0 right-0 z-[9990] h-18 md:h-20">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <Link to={'/'} className="flex items-center">
          <img
            src={logo}
            alt="Box & Cross Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Right side: Responsive Call Number */}
      <div className="flex justify-end shrink-0">
        <a
          href="tel:+918925556800"
          className="flex items-center gap-2.5 px-3 py-2.5 md:px-5 md:py-3 rounded-full bg-white/5 border border-white/10 hover:border-[#e5ff00]/40 hover:bg-[#e5ff00]/5 transition-all text-white hover:text-[#e5ff00] group shadow-lg"
        >
          <Phone
            size={16}
            className="text-[#e5ff00] group-hover:scale-110 transition-transform duration-300 shrink-0"
          />
          <span
            className="hidden md:inline text-xs md:text-sm font-black tracking-wider uppercase"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            +91 89255 56800
          </span>
        </a>
      </div>
    </nav>
  );
};

export default EventNavbar;
