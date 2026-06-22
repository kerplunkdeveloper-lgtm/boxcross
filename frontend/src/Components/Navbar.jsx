import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  X,
  ChevronDown,
  LayoutGrid,
  Phone,
  Mail,
  MapPin,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "../assets/images/logo-new.png";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [desktopOffcanvasOpen, setDesktopOffcanvasOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

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

  const membershipDropdown = [
    {
      name: "First 100 offer",
      scrollToId: "founders",
    },
    {
      name: "BOOK FREE TRIAL",
      scrollToId: "book-your-free-gym-tour",
    },
    {
      name: "PROGRAMS",
      scrollToId: "membership-plans",
    },
    {
      name: "PLANS & PRICING",
      scrollToId: "pricing",
    },
  ];

  const communityDropdown = [
    {
      name: "EVENTS",
      path: "/events",
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
      if (offcanvasOpen) return;

      const currentScrollY = window.scrollY;

      // navbar show/hide
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      // background change after scrolling
      setScrolled(currentScrollY > 80);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, offcanvasOpen]);

  return (
    <>
      <div
        className={`
    fixed top-0 z-[80] w-full
    transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${isNavVisible ? "translate-y-0" : "-translate-y-full"}
    ${scrolled ? "px-0 pt-0" : "px-0 md:px-5 pt-0 md:pt-4"}
  `}
      >
        {/* ================= NAVBAR ================= */}

        <nav
          className={`
    relative z-50 w-full
    transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      scrolled
        ? "py-3 px-4 md:px-8 bg-black backdrop-blur-xl border-b border-white/10 md:rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        : "py-3 px-4 md:px-5 bg-black backdrop-blur-md md:rounded-2xl border border-white/5 shadow-none"
    }
  `}
        >
          <div
            className={`transition-all duration-700 ${scrolled ? "md:px-2" : "md:px-3"}`}
          >
            <div className="relative flex items-center justify-between w-full">
              {/* ================= LOGO ================= */}

              <div className="flex-shrink-0">
                <NavLink
                  to="https://boxandcross.com"
                  className="flex items-center flex-shrink-0"
                >
                  <img src={logo} alt="Box & Cross" className="w-45 md:w-48" />
                </NavLink>
              </div>

              {/* ================= DESKTOP NAV ================= */}

              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-5">
                {/* HOME */}

                <a
                  href="https://boxandcross.com/"
                  className="px-2 py-2 text-gray-400 hover:text-white uppercase tracking-wider transition-all"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  HOME
                </a>


                   {/* THE ARENA */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("arena")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className="px-2 py-2 text-[#808080] hover:text-white uppercase tracking-wider transition-all flex items-center gap-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    THE ARENA
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "arena" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openDropdown === "arena" && (
                    <div className="absolute left-0 top-full mt-3 w-52 bg-white shadow-2xl  overflow-hidden z-[100]">
                      {arenaDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className={`group flex items-center gap-3 px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all overflow-hidden ${
                            idx !== arenaDropdown.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          {/* Hover Line */}
                          <span className="relative w-0 group-hover:w-10 h-[1.5px] overflow-hidden transition-all duration-500 ease-out">
                            <span className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                          </span>

                          {/* Text */}
                          <span className="transition-all duration-300 group-hover:translate-x-1">
                            {item.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>





              {/* COACHING */}

                <a
                  href="https://boxandcross.com/coaching/"
                  className="px-2 py-2 text-[#808080] hover:text-white uppercase tracking-wider transition-all"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  COACHING
                </a>




                {/* MEMBERSHIP */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("membership")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-2 py-2 uppercase tracking-wider transition-all flex items-center gap-1 ${
                        (isActive && location.pathname === "/") ||
                        location.pathname.includes("/membership")
                          ? "text-[#fffffff]"
                          : "text-gray-400 hover:text-white"
                      }`
                    }
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    MEMBERSHIP
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "membership" ? "rotate-180" : ""}`}
                    />
                  </NavLink>

                  {openDropdown === "membership" && (
                    <div className="absolute left-0 top-full mt-3 w-60 bg-white shadow-2xl overflow-hidden z-[100]">
                      {membershipDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path || `/#${item.scrollToId}`}
                          onClick={(e) => {
                            if (item.scrollToId) {
                              const el = document.getElementById(
                                item.scrollToId,
                              );
                              if (el) {
                                e.preventDefault();
                                el.scrollIntoView({ behavior: "smooth" });
                                setOpenDropdown(null);
                              }
                            }
                          }}
                          className={`group flex items-center gap-3 px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all overflow-hidden ${
                            idx !== membershipDropdown.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          {/* Hover Line */}
                          <span className="relative w-0 group-hover:w-10 h-[1.5px] overflow-hidden transition-all duration-500 ease-out">
                            <span className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                          </span>

                          {/* Text */}
                          <span className="transition-all duration-300 group-hover:translate-x-1">
                            {item.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>


                {/* COMMUNITY DROPDOWN */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("community")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/community"
                    className={({ isActive }) =>
                      `px-2 py-2 uppercase tracking-wider transition-all flex items-center gap-1 ${
                        isActive || location.pathname === "/events"
                          ? "text-white"
                          : "text-[#808080] hover:text-white"
                      }`
                    }
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    COMMUNITY
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${openDropdown === "community" ? "rotate-180" : ""}`}
                    />
                  </NavLink>

                  {openDropdown === "community" && (
                    <div className="absolute left-0 top-full mt-3 w-52 bg-white shadow-2xl overflow-hidden z-[100]">
                      {communityDropdown.map((item, idx) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`group flex items-center gap-3 px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all overflow-hidden ${
                            idx !== communityDropdown.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          {/* Hover Line */}
                          <span className="relative w-0 group-hover:w-10 h-[1.5px] overflow-hidden transition-all duration-500 ease-out">
                            <span className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                          </span>

                          {/* Text */}
                          <span className="transition-all duration-300 group-hover:translate-x-1">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                





             

              
                {/* CONTACT */}

                <a
                  href="https://boxandcross.com/contact-us/"
                  className="px-2 py-2 text-[#808080] hover:text-white uppercase tracking-wider transition-all"
                  style={{
                    fontFamily: '"Brutal Font Bold", sans-serif',
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  CONTACT 
                </a>
              </div>

              {/* ================= RIGHT ================= */}

              <div className="lg:flex-1 flex items-center justify-end gap-4 lg:gap-5">
                {/* CALL BUTTON */}
                <a
                  href="tel:+918925556800"
                  className="hidden lg:flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#e5ff00] text-black hover:bg-white transition-all duration-300 group shrink-0"
                  aria-label="Call Us"
                >
                  <div className="relative flex items-center justify-center">
                    <Phone
                      size={18}
                      className="fill-black group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -top-[2px] -right-[6px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>
                </a>

                {/* CTA */}
                <Link
                  to="/"
                  onClick={(e) => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      const element = document.getElementById(
                        "book-your-free-gym-tour",
                      );
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    } else {
                      sessionStorage.setItem("scrollToBookForm", "true");
                    }
                  }}
                  className={`
                    hidden lg:flex relative overflow-hidden
                    px-6 py-4 bg-[#e5ff00] text-black rounded-xl
                   tracking-wider uppercase group
                    transition-all duration-500 shrink-0
                  `}
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span
                    className="relative z-10"
                    style={{
                      fontFamily: '"BrutalTypeBold", sans-serif',
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    PLANS AND PRICING
                  </span>
                </Link>

                {/* DESKTOP OFFCANVAS BUTTON */}
                <button
                  onClick={() => setDesktopOffcanvasOpen(true)}
                  className="hidden lg:flex items-center justify-center w-[45px] h-[45px] text-white hover:text-[#e5ff00] group transition-all duration-300 cursor-pointer shrink-0"
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
            flex items-center justify-center text-white hover:text-[#e5ff00] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
        </div>

        {/* MENU */}

        <div
          className="flex-1 overflow-y-auto px-6 py-2 space-y-0"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          {/* HOME */}

          <div className="border-b border-[#1f1f1f]">
            <NavLink
              to="https://boxandcross.com/"
              onClick={closeOffcanvas}
              className="block py-2 text-white text-[14px] font-extrabold transition-colors "
            >
              HOME
            </NavLink>
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

         

          {/* MEMBERSHIP */}

          <div className="border-b border-[#1f1f1f]">
            <div className="flex justify-between items-center py-2">
              <NavLink
                to="/"
                onClick={closeOffcanvas}
                className={({ isActive }) =>
                  `text-[14px] font-extrabold transition-colors ${
                    isActive
                      ? "text-[#e5ff00]"
                      : "text-white hover:text-[#e5ff00]"
                  }`
                }
              >
                MEMBERSHIP
              </NavLink>
              <button
                onClick={() => toggleMobileDropdown("membership")}
                className="bg-[#1a1a1a] text-gray-400 w-8 h-8 flex items-center justify-center text-xl font-light rounded-sm cursor-pointer"
              >
                {openDropdown === "membership" ? "-" : "+"}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "membership" ? "max-h-[500px] pb-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {membershipDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={item.path || `/#${item.scrollToId}`}
                    onClick={(e) => {
                      if (item.scrollToId) {
                        const el = document.getElementById(item.scrollToId);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                      closeOffcanvas();
                    }}
                    className="text-sm text-gray-400 hover:text-white font-medium tracking-wider"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

           {/* COMMUNITY */}

          <div className="border-b border-[#1f1f1f]">
            <div className="flex justify-between items-center py-2">
              <NavLink
                to="/community"
                onClick={closeOffcanvas}
                className={({ isActive }) =>
                  `text-[14px] font-extrabold transition-colors ${
                    isActive || location.pathname === "/events"
                      ? "text-[#e5ff00]"
                      : "text-white hover:text-[#e5ff00]"
                  }`
                }
              >
                COMMUNITY
              </NavLink>
              <button
                onClick={() => toggleMobileDropdown("community")}
                className="bg-[#1a1a1a] text-gray-400 w-8 h-8 flex items-center justify-center text-xl font-light rounded-sm cursor-pointer"
              >
                {openDropdown === "community" ? "-" : "+"}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "community" ? "max-h-60 pb-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {communityDropdown.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={closeOffcanvas}
                    className={({ isActive }) =>
                      `text-sm font-medium tracking-wider transition-colors ${
                        isActive ? "text-[#e5ff00]" : "text-gray-400 hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
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
              <a href="#" className="text-white hover:text-[#e5ff00]">
                <FaFacebookF size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#e5ff00]">
                <FaTwitter size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#e5ff00]">
                <FaLinkedinIn size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#e5ff00]">
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
            className="text-white hover:text-[#e5ff00] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
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
          <span className="text-[#e5ff00] font-bold">Box & Cross</span>, where
          passion meets performance and fitness <br /> becomes a lifestyle. Our
          mission is to empower individuals of all ages and <br />
          abilities to build strength, move better, and train with purpose  — in a space <br /> built for results.
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
              {/* Phone item */}
              <div className="flex items-start gap-4">
                <Phone className="text-[#e5ff00] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#e5ff00] uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    NEED ANY HELP
                  </h4>
                  <a
                    href="tel:+918925556800"
                    className="text-white text-lg hover:text-[#e5ff00] transition-colors block"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    +91 89255 56800
                  </a>
                </div>
              </div>

              {/* Email item */}
              <div className="flex items-start gap-4">
                <Mail className="text-[#e5ff00] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#e5ff00] uppercase mb-1"
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
                    className="text-white text-lg hover:text-[#e5ff00] transition-colors block"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    hello@boxandcross.com
                  </a>
                </div>
              </div>

              {/* Location item */}
              <div className="flex items-start gap-4">
                <MapPin className="text-[#e5ff00] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#e5ff00] uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    LOCATION
                  </h4>
                  <p
                    className="text-white leading-relaxed"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  >
                    No. 69, Church Street, Krishna Nagar,
                    <br />
                    Lawspet, Pondicherry - 605008
                  </p>
                </div>
              </div>

              {/* Admin Dashboard Button (opens in separate page) */}
              <div className="pt-6">
                <a
                  href="/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-[220px] h-[52px] bg-[#e5ff00] text-black rounded-xl text-xs font-black tracking-wider uppercase hover:bg-white transition-colors duration-300"
                  style={{
                    fontFamily: '"BrutalTypeBold", sans-serif',
                    fontSize: "13px",
                  }}
                >
                  Admin Dashboard
                </a>
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
            className="absolute top-8 right-8 text-white hover:text-[#e5ff00] transition-all hover:scale-110 hover:rotate-90 cursor-pointer"
          >
            <X size={40} />
          </button>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? galleryImages.length - 1 : prev - 1,
              )
            }
            className="absolute left-8 text-white hover:text-[#e5ff00] transition-all hover:scale-110 cursor-pointer"
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
            className="absolute right-8 text-white hover:text-[#e5ff00] transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
