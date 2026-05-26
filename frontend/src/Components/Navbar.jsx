import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  X,
  ChevronDown,
  LayoutGrid,
  PhoneOutgoing,
  Send,
  MapPinned,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

import logo from "../assets/images/logo.png";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [desktopOffcanvasOpen, setDesktopOffcanvasOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1470&auto=format&fit=crop",
  ];

  const dropdownTimeoutRef = useRef(null);

  // ================= DROPDOWNS =================

  const arenaDropdown = [
    {
      name: "BRAND STORY",
      path: "https://boxandcross.com/brand-story/",
    },
    {
      name: "FACILITY",
      path: "https://boxandcross.com/facility/",
    },
    {
      name: "PHILOSOPHY",
      path: "https://boxandcross.com/philosophy/",
    },
    {
      name: "WHY BXC",
      path: "https://boxandcross.com/why-bxc/",
    },
  ];

  const communityDropdown = [
    {
      name: "EVENTS",
      path: "https://boxandcross.com/events/",
    },
    {
      name: "CHALLENGES",
      path: "https://boxandcross.com/challenges/",
    },
    {
      name: "LEADERBOARDS",
      path: "https://boxandcross.com/leaderboards/",
    },
    {
      name: "FIGHT NIGHTS",
      path: "https://boxandcross.com/fight-nights/",
    },
  ];

  const membershipDropdown = [
    {
      name: "FIGHT CLUB",
      path: "https://boxandcross.com/fight-club/",
    },
    {
      name: "STRENGTH LAB",
      path: "https://boxandcross.com/strength-lab/",
    },
    {
      name: "HYBRID PERFORMANCE",
      path: "https://boxandcross.com/hybrid-performance/",
    },
    {
      name: "FIGHT PERFORMANCE",
      path: "https://boxandcross.com/fight-performance/",
    },
    {
      name: "HYROX LAB",
      path: "https://boxandcross.com/hyrox-lab/",
    },
    {
      name: "JUNIOR ATHLETES",
      path: "https://boxandcross.com/junior-athletes/",
    },
    {
      name: "1:1 COACHING",
      path: "https://boxandcross.com/1-1-coaching/",
    },
  ];

  // ================= DESKTOP DROPDOWN =================

  const handleDropdownEnter = (dropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }

    setOpenDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // ================= MOBILE =================

  const toggleMobileDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeOffcanvas = () => {
    setOffcanvasOpen(false);
    setOpenDropdown(null);
  };

  // ================= BODY SCROLL =================

  useEffect(() => {
    if (offcanvasOpen || desktopOffcanvasOpen || galleryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [offcanvasOpen, desktopOffcanvasOpen, galleryModalOpen]);

  // ================= SCROLL LISTENER =================

  useEffect(() => {
    const handleScroll = () => {
      if (offcanvasOpen) return; // Don't hide navbar if mobile menu is open

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, offcanvasOpen, desktopOffcanvasOpen]);

  return (
    <>
      <div
        className={`sticky top-0 z-[80] transition-transform duration-500 ease-in-out md:px-10 md:pt-4 ${
          isNavVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        {/* ================= NAVBAR ================= */}

        <nav className="relative md:rounded-2xl py-2  md:py-0  z-50 bg-black  border-b border-[d9ff00]/20 backdrop-blur-sm">
          <div className=" md:px-4">
            <div className="flex justify-between items-center">
              {/* ================= LOGO ================= */}

              <NavLink to="/" className="flex items-center flex-shrink-0">
                <img src={logo} alt="Box & Cross" className="w-52 md:w-52" />
              </NavLink>

              {/* ================= DESKTOP NAV ================= */}

              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {/* HOME */}

                <a
                  href="https://boxandcross.com/"
                  className="px-3 py-2 text-[14px] font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-all"
                >
                  HOME
                </a>

                {/* THE ARENA */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("arena")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-2 text-[14px] font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-all flex items-center gap-1">
                    THE ARENA
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "arena" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openDropdown === "arena" && (
                    <div className="absolute left-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                      {arenaDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className={`block px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all ${
                            idx !== arenaDropdown.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* COACHING */}

                <a
                  href="https://boxandcross.com/coaching/"
                  className="px-3 py-2 text-[14px] font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-all"
                >
                  COACHING
                </a>

                {/* COMMUNITY */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("community")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-2 text-[14px]  text-gray-400 hover:text-white uppercase tracking-wider transition-all flex items-center gap-1">
                    COMMUNITY
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "community" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openDropdown === "community" && (
                    <div className="absolute left-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                      {communityDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className={`block px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all ${
                            idx !== communityDropdown.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* MEMBERSHIP */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("membership")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="px-3 py-2 text-[14px] font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-all flex items-center gap-1">
                    MEMBERSHIP
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "membership" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openDropdown === "membership" && (
                    <div className="absolute left-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                      {membershipDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className={`block px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all ${
                            idx !== membershipDropdown.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* CONTACT */}

                <a
                  href="https://boxandcross.com/contact-us/"
                  className="px-3 py-2 text-[14px] font-bold  text-gray-400 hover:text-white uppercase tracking-wider transition-all"
                >
                  CONTACT US
                </a>
              </div>

              {/* ================= RIGHT ================= */}

              <div className="flex items-center gap-4">
                {/* CTA */}

                <a
                  href="https://boxandcross.com/contact-us/"
                  rel="noopener noreferrer"
                  className="hidden lg:flex relative overflow-hidden px-8 py-4 bg-[#defb02] text-black rounded-xl text-xs  tracking-wider uppercase group"
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>

                  <span className="relative z-10 text-[14px] font-bold">
                    ENTER THE ARENA
                  </span>
                </a>

                {/* DESKTOP OFFCANVAS BUTTON */}
                <button
                  onClick={() => setDesktopOffcanvasOpen(true)}
                  className="hidden lg:flex items-center justify-center w-12 h-12 text-white hover:text-[#defb02] group transition-all duration-300 ml-4 cursor-pointer"
                  aria-label="Open desktop menu"
                >
                  <LayoutGrid
                    size={28}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </button>

                {/* MOBILE BUTTON */}

                <button
                  onClick={() => setOffcanvasOpen(true)}
                  className="lg:hidden flex flex-col gap-[5px] justify-center items-center w-10 h-10 group cursor-pointer"
                  aria-label="Toggle menu"
                >
                  <div className="w-5 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-7"></div>

                  <div className="w-7 h-[2px] bg-white rounded-full transition-all duration-300"></div>

                  <div className="w-5 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-7"></div>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= OVERLAY ================= */}

      <div
        onClick={closeOffcanvas}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-all duration-500 lg:hidden ${
          offcanvasOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`fixed top-0 left-0 h-screen w-full bg-[#0a0a0a] z-[100]
        transition-transform duration-500 ease-in-out
        ${offcanvasOpen ? "translate-x-0" : "-translate-x-full"}
        lg:hidden flex flex-col`}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between px-5 py-5 border-b border-[#1f1f1f]">
          <img src={logo} alt="logo" className="w-50" />

          <button
            onClick={closeOffcanvas}
            className="w-10 h-10 bg-[#181818] relative top-[-28px] right-[-20px]
            flex items-center justify-center text-white hover:text-[#defb02] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
        </div>

        {/* MENU */}

        <div
          className="flex-1 overflow-y-auto px-6 py-2 space-y-0"
          style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
        >
          {/* HOME */}

          <div className="border-b border-[#1f1f1f]">
            <a
              href="/"
              onClick={closeOffcanvas}
              className="block py-2 text-white text-[14px] font-extrabold transition-colors "
            >
              HOME
            </a>
          </div>

          {/* THE ARENA */}

          <div className="border-b border-[#1f1f1f]">
            <button
              onClick={() => toggleMobileDropdown("arena")}
              className="w-full flex justify-between items-center py-2 text-white text-[14px] font-extrabold transition-colors "
            >
              THE ARENA
              <span className="bg-[#1a1a1a] text-gray-400 w-8 h-8 flex items-center justify-center text-xl font-light rounded-sm">
                {openDropdown === "arena" ? "-" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "arena" ? "max-h-60 pb-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {arenaDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={closeOffcanvas}
                    className="text-sm text-gray-400 hover:text-white font-medium tracking-wider"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COACHING */}

          <div className="border-b border-[#1f1f1f]">
            <a
              href="https://boxandcross.com/coaching/"
              onClick={closeOffcanvas}
              className="block py-2 text-white text-[14px] font-extrabold transition-colors"
            >
              COACHING
            </a>
          </div>

          {/* COMMUNITY */}

          <div className="border-b border-[#1f1f1f]">
            <button
              onClick={() => toggleMobileDropdown("community")}
              className="w-full flex justify-between items-center py-2 text-white text-[14px] font-extrabold transition-colors"
            >
              COMMUNITY
              <span className="bg-[#1a1a1a] text-gray-400 w-8 h-8 flex items-center justify-center text-xl font-light rounded-sm">
                {openDropdown === "community" ? "-" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "community" ? "max-h-60 pb-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {communityDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={closeOffcanvas}
                    className="text-sm text-gray-400 hover:text-white font-medium tracking-wider"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* MEMBERSHIP */}

          <div className="border-b border-[#1f1f1f]">
            <button
              onClick={() => toggleMobileDropdown("membership")}
              className="w-full flex justify-between items-center py-2 text-white text-[14px] font-extrabold transition-colors"
            >
              MEMBERSHIP
              <span className="bg-[#1a1a1a] text-gray-400 w-8 h-8 flex items-center justify-center text-xl font-light rounded-sm">
                {openDropdown === "membership" ? "-" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "membership" ? "max-h-[500px] pb-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {membershipDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={closeOffcanvas}
                    className="text-sm text-gray-400 hover:text-white font-medium tracking-wider"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACT */}

          <div className="border-b border-[#1f1f1f]">
            <a
              href="https://boxandcross.com/contact-us/"
              onClick={closeOffcanvas}
              className="block py-2 text-white text-[14px] font-extrabold transition-colors "
            >
              CONTACT US
            </a>
          </div>

          {/* FOOTER */}

          <div className=" mt-50px">
            {/* SOCIAL */}

            <div className="flex mt-5  gap-6">
              <a href="#" className="text-white hover:text-[#defb02]">
                <FaFacebookF size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#defb02]">
                <FaTwitter size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#defb02]">
                <FaLinkedinIn size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#defb02]">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP OFFCANVAS ================= */}

      {/* Overlay */}
      <div
        onClick={() => setDesktopOffcanvasOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] transition-all duration-500 hidden lg:block ${
          desktopOffcanvasOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-[65vw] bg-black z-[100] p-12 overflow-y-auto
        transition-all duration-500 ease-in-out hidden lg:flex flex-col border-l border-[#1f1f1f]
        ${desktopOffcanvasOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}
      >
        <div className="flex justify-between items-start mb-12">
          <img src={logo} alt="Box & Cross" className="w-52" />
          <button
            onClick={() => setDesktopOffcanvasOpen(false)}
            className="text-white hover:text-[#defb02] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
          >
            <XCircle size={32} strokeWidth={1.5} />
          </button>
        </div>

        <p
          className="text-gray-400 text-[18px] mb-12 leading-relaxed"
          style={{
            fontFamily: '"Brutal Font Light", sans-serif',
            fontWeight: 400,
          }}
        >
          Welcome to{" "}
          <span className="text-[#defb02] font-bold">Box & Cross</span>, where
          passion meets performance and fitness <br /> becomes a lifestyle. Our
          mission is to empower individuals of all ages and <br />
          fitness.
        </p>

        <div className="grid grid-cols-2 gap-12">
          {/* Left Column: Contact */}
          <div>
            <h3
              className="text-white text-2xl font-black uppercase tracking-wider mb-8"
              style={{
                fontFamily: '"Brutal Font Bold", sans-serif',
                fontWeight: 700,
              }}
            >
              REACH OUT — WE'RE JUST A MESSAGE AWAY!
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <PhoneOutgoing className="text-[#defb02] shrink-0" size={24} />
                <div>
                  <h4
                    className="text-[#defb02] uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    NEED ANY HELP
                  </h4>
                  <a
                    href="tel:+918925556900"
                    className="text-white text-lg hover:text-[#defb02] transition-colors block"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    +91 89255 56900
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Send className="text-[#defb02] shrink-0" size={24} />
                <div>
                  <h4
                    className="text-[#defb02]  uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    EMAIL US
                  </h4>
                  <a
                    href="mailto:hello@boxandcross.com"
                    className="text-white text-lg hover:text-[#defb02] transition-colors block"
                  >
                    hello@boxandcross.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPinned className="text-[#defb02] shrink-0" size={24} />
                <div>
                  <h4
                    className="text-[#defb02]  uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    LOCATION
                  </h4>
                  <p
                    className="text-white  leading-relaxed "
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 400,
                      fontSize: "20px",
                    }}
                  >
                    No. 69, Church Street, Krishna Nagar, Lawspet, Pondicherry -
                    605008
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Gallery */}
          <div>
            <h3
              className="text-white  uppercase tracking-wider mb-8"
              style={{
                fontFamily: '"Brutal Font Bold", sans-serif',
                fontWeight: 600,
                fontSize: "28px",
              }}
            >
              PHOTO GALLERY
            </h3>

            <div className="grid grid-cols-6 gap-2">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer overflow-hidden group ${idx < 3 ? "col-span-2 h-28" : "col-span-3 h-40"}`}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setGalleryModalOpen(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= GALLERY MODAL ================= */}

      {galleryModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center backdrop-blur-md">
          <button
            onClick={() => setGalleryModalOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-[#defb02] transition-all hover:scale-110 hover:rotate-90 cursor-pointer"
          >
            <X size={40} />
          </button>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? galleryImages.length - 1 : prev - 1,
              )
            }
            className="absolute left-8 text-white hover:text-[#defb02] transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft size={48} />
          </button>

          <img
            src={galleryImages[currentImageIndex]}
            alt="Gallery Large"
            className="max-h-[89vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === galleryImages.length - 1 ? 0 : prev + 1,
              )
            }
            className="absolute right-8 text-white hover:text-[#defb02] transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
