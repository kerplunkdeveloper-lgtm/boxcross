import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ArrowUp, MessageCircle } from "lucide-react";
import logo from "../assets/images/logo-new.png";

const Foot = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[#111111] border-t border-white/10 overflow-hidden md:px-10 px-2  md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 ">
        {/* COLUMN 1 */}
        <div className="lg:col-span-2  md:px-20  py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">
          {/* LOGO */}
          <img
            src={logo} // replace with your logo
            alt="logo"
            className="w-[200px] object-contain"
          />

          {/* DESCRIPTION */}
          <p
            className="text-[#9b9b9b]  leading-[1.6] mt-6 "
            style={{
              fontSize: "18px",
              fontFamily: "Brutal Font Light, sans-serif",
              fontWeight: "600",
            }}
          >
            Stay connected and motivated by joining our newsletter Get exclusive
            fitness tips, workout guides.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mt-8">
            <a
              href="/"
              className="
                w-[36px]
                h-[36px]
                rounded-full
                border
                border-white/10
                flex
                items-center
                justify-center
                text-white
                hover:bg-[#d9ff00]
                hover:text-black
                transition-all
                duration-300
              "
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="/"
              className="
                w-[36px]
                h-[36px]
                rounded-full
                border
                border-white/10
                flex
                items-center
                justify-center
                text-white
                hover:bg-[#d9ff00]
                hover:text-black
                transition-all
                duration-300
              "
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="px-6 md:px-8 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">
          <h3
            className="text-white uppercase tracking-wide"
            style={{
              fontFamily: '"Brutal Font Bold", sans-serif',
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            Memberships
          </h3>

          <ul className="mt-8 space-y-5">
            {[
              {
                name: "Fight Club",
                path: "https://boxandcross.com/fight-club/",
              },
              {
                name: "Strength Lab",
                path: "https://boxandcross.com/strength-lab/",
              },
              {
                name: "Hybrid Performance",
                path: "https://boxandcross.com/hybrid-performance/",
              },
              {
                name: "Fight Performance",
                path: "https://boxandcross.com/fight-performance/",
              },
              { name: "HYROX Lab", path: "https://boxandcross.com/hyrox-lab/" },
              {
                name: "Junior Athletes",
                path: "https://boxandcross.com/junior-athletes/",
              },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="
                    flex
                    items-center
                    gap-3
                    text-[#b3b3b3]
                    hover:text-[#d9ff00]
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                  style={{
                    fontFamily: '"Brutal Type Light", sans-serif',
                    fontSize: "15px",
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-[#7a7a7a] transform rotate-45 inline-block shrink-0"></span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="px-6 md:px-8 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/10">
          <h3
            className="text-white uppercase tracking-wide"
            style={{
              fontFamily: '"Brutal Font Bold", sans-serif',
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            Opening Hours
          </h3>

          <div
            className="mt-8 space-y-8"
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontSize: "15px",
            }}
          >
            <div>
              <p
                className="text-[#827979] leading-[1.8]"
                style={{
                  fontWeight: "600",
                }}
              >
                Morning 05:00 Am -
              </p>
              <p
                className="text-[#827979] leading-[1.8]"
                style={{
                  fontWeight: "600",
                }}
              >
                12:00 Pm
              </p>
            </div>

            <div>
              <p
                className="text-[#827979] leading-[1.8]"
                style={{
                  fontWeight: "600",
                }}
              >
                Evening 04:00 Pm -
              </p>
              <p
                className="text-[#827979] leading-[1.8]"
                style={{
                  fontWeight: "600",
                }}
              >
                10:00 Pm
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 4 */}
        <div className="px-6 md:px-8 py-10 lg:py-12">
          <h3
            className="text-white uppercase tracking-wide"
            style={{
              fontFamily: '"Brutal Font Bold", sans-serif',
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            Location
          </h3>

          <div
            className="mt-8 space-y-8"
            style={{
              fontFamily: '"Brutal Font Light", sans-serif',
              fontSize: "15px",
            }}
          >
            <p
              className="text-[#827979] leading-[1.8] max-w-[300px]"
              style={{
                fontWeight: "600",
              }}
            > 
              No. 69, Church Street,
              <br />
              Krishna Nagar, Lawspet,
              <br />
              Pondicherry, Pondicherry -<br />
              605008
            </p>

            <div className="space-y-4 flex flex-col">
              <a
                href="mailto:hello@boxandcross.com"
                className="text-[#827979] hover:text-[#d9ff00] transition-all duration-300 w-fit"
                style={{
                  fontWeight: "600",
                }}
              >
                hello@boxandcross.com
              </a>

              <a
                href="tel:+918925556800"
                className="text-[#827979] hover:text-[#d9ff00] transition-all duration-300 w-fit"
                style={{
                  fontWeight: "600",
                }}
              >
                +91 89255 56800
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-8 w-12 h-12 md:w-14 md:h-14 bg-[#e5ff00] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(222,251,2,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(222,251,2,0.5)] transition-all duration-300 z-[100] ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={28} strokeWidth={2.5} />
      </button>

      {/* WHATSAPP CONTACT BUTTON */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-row-reverse items-center group cursor-pointer">
        <a
          href="https://wa.me/918925556900"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#e5ff00] text-black rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 relative z-10"
        >
          <FaWhatsapp size={34} />
        </a>

        {/* Speech Bubble */}
        <div
          className="mr-4 relative bg-white text-[#333] px-5 py-2.5 rounded-xl shadow-xl font-medium text-[16px] whitespace-nowrap min-w-[110px] text-center transition-all duration-300"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <span className="block group-hover:hidden transition-all duration-300">
            Contact us
          </span>
          <span className="hidden group-hover:block transition-all duration-300 ">
            WhatsApp
          </span>
          {/* Triangle pointing right */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-l-[10px] border-l-white border-b-[8px] border-b-transparent"></div>
        </div>
      </div>
    </footer>
  );
};

export default Foot;
