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
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "../assets/images/logo-new.png";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";
import juniorBoxer from "../assets/junior_boxer.jpg";
import duoCoupleImg from "../assets/duo_couple.jpg";
import familyFatherSonImg from "../assets/family_father_son.jpg";

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

  // 3 MEMBERSHIP TIERS (EXACT TO DESIGN REFERENCE)
  const membershipCards = [
    {
      id: "core",
      title: "CORE",
      tag: "1 PATHWAY",
      badge2: "ESSENTIAL",
      mobileBadge: "1 PATH",
      sessionBadge: "5 Coached / Wk",
      fromPrice: "₹2,800/mo",
      subtitle: "Boxing, HYROX or Strength",
      desc: "5 coached sessions a week dedicated to 1 chosen craft with full open gym access.",
      image: box1,
      path: "/membership/core",
      isPopular: false,
      btnText: "EXPLORE CORE",
    },
    {
      id: "athlete",
      title: "ATHLETE",
      tag: "2 PATHWAYS",
      badge2: "★ MOST POPULAR",
      mobileBadge: "2 PATHS",
      sessionBadge: "5 Coached / Wk",
      fromPrice: "₹4,000/mo",
      subtitle: "Combat + Conditioning Hybrid",
      desc: "5 coached sessions a week across two disciplines to forge endurance and power.",
      image: box2,
      path: "/membership/athlete",
      isPopular: true,
      btnText: "EXPLORE ATHLETE",
    },
    {
      id: "arena",
      title: "ARENA",
      tag: "ALL ACCESS",
      badge2: "VIP TIER",
      mobileBadge: "ALL IN",
      sessionBadge: "5 Coached / Wk",
      fromPrice: "₹5,600/mo",
      subtitle: "Unrestricted All Disciplines",
      desc: "5 coached sessions weekly across all pathways, priority ring time & VIP perks.",
      image: box3,
      path: "/membership/arena",
      isPopular: false,
      btnText: "EXPLORE ARENA",
    },
  ];

  // SPECIAL & PARTNER PROGRAMS (DUO, FAMILY, JUNIOR)
  const specialMembershipCards = [
    {
      id: "duo",
      title: "BXC DUO",
      tag: "2 PERSON PASS",
      badge2: "COUPLE / BUDDY",
      mobileBadge: "2 PERSON",
      fromPrice: "₹6,800/mo",
      subtitle: "Couple & Buddy Pass",
      desc: "Synchronized coaching, joint benchmarks & partner accountability for two.",
      image: duoCoupleImg,
      path: "/membership/duo",
      isPopular: false,
      btnText: "EXPLORE DUO",
    },
    {
      id: "family",
      title: "BXC FAMILY FIT",
      tag: "ALL AGES",
      badge2: "FAMILY PACK",
      mobileBadge: "ALL AGES",
      fromPrice: "₹11,900/mo",
      subtitle: "Parents + Kids (Up to 4)",
      desc: "Full arena access for parents + Junior coaching for kids under one plan.",
      image: familyFatherSonImg,
      path: "/membership/family",
      isPopular: false,
      btnText: "EXPLORE FAMILY",
    },
    {
      id: "junior",
      title: "JUNIOR CORE",
      tag: "UNDER 13",
      badge2: "YOUTH BOXING",
      mobileBadge: "UNDER 13",
      fromPrice: "₹1,958/mo",
      subtitle: "Youth Athletics (Ages 7–13)",
      desc: "Coached boxing fundamentals, agility drills & screen-free discipline.",
      image: juniorBoxer,
      path: "/membership/junior",
      isPopular: false,
      btnText: "EXPLORE JUNIOR",
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
    ${scrolled
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

              <div className="hidden lg:flex absolute left-[46%] -translate-x-1/2 items-center gap-5">
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
                    <div className="absolute left-0 top-full mt-3 w-52 bg-white shadow-2xl overflow-hidden z-[100]">
                      {arenaDropdown.map((item, idx) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className={`group flex items-center gap-3 px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all overflow-hidden ${idx !== arenaDropdown.length - 1
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

                {/* MEMBERSHIP WITH FULL-WIDTH DROP DOWN (IMAGE + TITLE ONLY) */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("membership")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-2 py-2 uppercase tracking-wider transition-all flex items-center gap-1 ${(isActive && location.pathname === "/") ||
                        location.pathname.includes("/membership") ||
                        location.pathname === "/core" ||
                        location.pathname === "/athlete" ||
                        location.pathname === "/arena" ||
                        location.pathname === "/junior" ||
                        location.pathname === "/junior-core" ||
                        location.pathname === "/family" ||
                        location.pathname === "/family-fit" ||
                        location.pathname === "/duo" ||
                        location.pathname === "/bxc-duo"
                        ? "text-[#ffffff]"
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

                  {/* DESKTOP FULL-WIDTH MEGA DROPDOWN (COMPACT IMAGE + TITLE ONLY) */}
                  {openDropdown === "membership" && (
                    <div className="fixed inset-x-4 top-full mt-2 max-w-[1040px] mx-auto w-auto before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] bg-[#0c0c0e]/98 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-4 z-[100] text-left">
                     

                      {/* ROW 1: 3 PRIMARY PATHWAYS */}
                      <div className="grid grid-cols-3 gap-3 my-2">
                        {membershipCards.map((card) => (
                          <Link
                            key={card.id}
                            to={card.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`group relative rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300 bg-[#121215] cursor-pointer hover:-translate-y-0.5 ${
                              card.isPopular
                                ? "border-2 border-[#ccf141] shadow-[0_0_20px_rgba(204,241,65,0.18)] hover:shadow-[0_0_30px_rgba(204,241,65,0.28)]"
                                : "border border-white/10 hover:border-[#ccf141]/60 hover:shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(204,241,65,0.1)]"
                            }`}
                          >
                            {/* TOP IMAGE */}
                            <div className="relative h-24 rounded-lg overflow-hidden bg-black mb-2">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover object-[center_18%] group-hover:scale-108 transition-transform duration-700 ease-out filter contrast-110 brightness-95 group-hover:brightness-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                              {/* TOP BADGE */}
                              <div className="absolute top-2 left-2 z-10">
                                <span
                                  className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                    card.isPopular
                                      ? "bg-[#ccf141] text-black shadow-sm font-extrabold"
                                      : "bg-black/75 backdrop-blur-md text-white border border-white/15"
                                  }`}
                                >
                                  {card.tag}
                                </span>
                              </div>

                              {/* ARROW CIRCLE ICON ON IMAGE BOTTOM RIGHT */}
                              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#ccf141] group-hover:text-black group-hover:border-[#ccf141] transition-all duration-300">
                                <ArrowRight
                                  size={11}
                                  className="group-hover:translate-x-0.5 transition-transform"
                                />
                              </div>
                            </div>

                            {/* CONTENT */}
                            <div className="flex flex-col flex-1 justify-between">
                              <div>
                                <h3
                                  className="text-[15px] font-black uppercase text-white tracking-tight group-hover:text-[#ccf141] transition-colors leading-none"
                                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                                >
                                  {card.title}
                                </h3>
                              </div>

                              {/* SUBTLE BOTTOM EXPLORE LINK */}
                              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                                <span
                                  className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors ${
                                    card.isPopular
                                      ? "text-[#ccf141]"
                                      : "text-neutral-400 group-hover:text-[#ccf141]"
                                  }`}
                                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                                >
                                  <span>Explore {card.title}</span>
                                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* ROW 2 DIVIDER & HEADING */}
                      <div className="flex items-center gap-2 my-2 pt-1.5 border-t border-white/10">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-[#ccf141] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141]" />
                          SPECIAL PASSES: DUO, FAMILY &amp; YOUTH PROGRAMS
                        </span>
                      </div>

                      {/* ROW 2: BXC DUO, BXC FAMILY FIT, JUNIOR CORE (3 CARDS) */}
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        {specialMembershipCards.map((card) => (
                          <Link
                            key={card.id}
                            to={card.path}
                            onClick={() => setOpenDropdown(null)}
                            className="group relative rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300 bg-[#121215] cursor-pointer hover:-translate-y-0.5 border border-white/10 hover:border-[#ccf141]/60 hover:shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(204,241,65,0.1)]"
                          >
                            {/* TOP IMAGE */}
                            <div className="relative h-22 rounded-lg overflow-hidden bg-black mb-2">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover object-[center_30%] group-hover:scale-108 transition-transform duration-700 ease-out filter contrast-110 brightness-95 group-hover:brightness-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                              {/* TOP BADGE */}
                              <div className="absolute top-2 left-2 z-10">
                                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#ccf141] border border-[#ccf141]/30">
                                  {card.tag}
                                </span>
                              </div>

                              {/* ARROW CIRCLE ICON ON IMAGE BOTTOM RIGHT */}
                              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#ccf141] group-hover:text-black group-hover:border-[#ccf141] transition-all duration-300">
                                <ArrowRight
                                  size={11}
                                  className="group-hover:translate-x-0.5 transition-transform"
                                />
                              </div>
                            </div>

                            {/* CONTENT */}
                            <div className="flex flex-col flex-1 justify-between">
                              <div>
                                <h3
                                  className="text-[14px] font-black uppercase text-white tracking-tight group-hover:text-[#ccf141] transition-colors leading-none"
                                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                                >
                                  {card.title}
                                </h3>
                              </div>

                              {/* SUBTLE BOTTOM EXPLORE LINK */}
                              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                                <span
                                  className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1 text-neutral-400 group-hover:text-[#ccf141] transition-colors"
                                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                                >
                                  <span>Explore {card.title}</span>
                                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* WORK FORMAT */}
                <NavLink
                  to="/work-format"
                  className={({ isActive }) =>
                    `px-2 py-2 uppercase tracking-wider transition-all ${
                      isActive ||
                      location.pathname === "/work-format" ||
                      location.pathname === "/workout-formats" ||
                      location.pathname === "/workformat"
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
                  WORK FORMAT
                </NavLink>

                {/* COMMUNITY DROPDOWN */}

                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter("community")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/community"
                    className={({ isActive }) =>
                      `px-2 py-2 uppercase tracking-wider transition-all flex items-center gap-1 ${isActive || location.pathname === "/events"
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
                          className={`group flex items-center gap-3 px-5 py-4 text-[11px] uppercase tracking-widest text-black hover:bg-gray-100 transition-all overflow-hidden ${idx !== communityDropdown.length - 1
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


              </div>

              {/* ================= RIGHT ================= */}

              <div className="lg:flex-1 flex items-center justify-end gap-4 lg:gap-5">
                {/* CALL BUTTON */}
                <a
                  href="tel:+918925556800"
                  className="hidden lg:flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#ccf141] text-black hover:bg-white transition-all duration-300 group shrink-0"
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
                    px-6 py-4 bg-[#ccf141] text-black rounded-xl
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
                  className="hidden lg:flex items-center justify-center w-[45px] h-[45px] text-white hover:text-[#ccf141] group transition-all duration-300 cursor-pointer shrink-0"
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
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-all duration-500 lg:hidden ${offcanvasOpen ? "opacity-100 visible" : "opacity-0 invisible"
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
            flex items-center justify-center text-white hover:text-[#ccf141] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
        </div>

        {/* MENU */}

        <div
          className="flex-1 overflow-y-auto px-5 py-3 space-y-0"
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
              className={`overflow-hidden transition-all duration-300 ${openDropdown === "arena" ? "max-h-60 pb-4" : "max-h-0"
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

          {/* MEMBERSHIP ACCORDION WITH 3-COLUMN GRID VIEW IN MOBILE */}

          <div className="border-b border-[#1f1f1f]">
            <div className="flex justify-between items-center py-2.5">
              <NavLink
                to="/"
                onClick={closeOffcanvas}
                className={({ isActive }) =>
                  `text-[14px] font-extrabold transition-colors ${isActive ||
                  location.pathname.includes("/membership") ||
                  location.pathname === "/core" ||
                  location.pathname === "/athlete" ||
                  location.pathname === "/arena" ||
                  location.pathname === "/junior" ||
                  location.pathname === "/junior-core" ||
                  location.pathname === "/family" ||
                  location.pathname === "/family-fit" ||
                  location.pathname === "/duo" ||
                  location.pathname === "/bxc-duo"
                    ? "text-[#ccf141]"
                    : "text-white hover:text-[#ccf141]"
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
                openDropdown === "membership" ? "max-h-[1600px] pb-5" : "max-h-0"
              }`}
            >
              {/* 1. TOP 3-GRID LAYOUT: CORE, ATHLETE, ARENA */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {membershipCards.map((card) => (
                  <Link
                    key={card.id}
                    to={card.path}
                    onClick={closeOffcanvas}
                    className={`group relative rounded-xl overflow-hidden border p-2 flex flex-col justify-between transition-all active:scale-95 bg-[#121215] cursor-pointer ${
                      card.isPopular
                        ? "border-[#ccf141] shadow-[0_0_15px_rgba(204,241,65,0.2)]"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-24 sm:h-28 rounded-lg overflow-hidden bg-black mb-1.5">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover object-[center_18%] filter contrast-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                      
                      {/* Top Badge */}
                      <span
                        className={`absolute top-1 left-1 px-1 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider ${
                          card.isPopular
                            ? "bg-[#ccf141] text-black font-extrabold"
                            : "bg-black/80 backdrop-blur-md text-white border border-white/20"
                        }`}
                      >
                        {card.mobileBadge}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h4
                          className="text-xs sm:text-[13px] font-black uppercase text-white tracking-tight leading-none group-hover:text-[#ccf141] transition-colors truncate"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {card.title}
                        </h4>

                      </div>

                      <span
                        className={`text-[8.5px] font-extrabold uppercase tracking-wider mt-2 py-1 px-1 rounded flex items-center justify-center gap-0.5 ${
                          card.isPopular
                            ? "bg-[#ccf141] text-black shadow-sm font-black"
                            : "bg-white/5 text-neutral-300 border border-white/10 group-hover:bg-[#ccf141] group-hover:text-black transition-colors"
                        }`}
                      >
                        <span>View</span>
                        <ArrowRight size={9} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 2. MIDDLE 2-GRID LAYOUT: BXC DUO & BXC FAMILY FIT */}
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                {/* BXC DUO CARD */}
                <Link
                  to="/duo"
                  onClick={closeOffcanvas}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#ccf141]/50 p-2.5 flex flex-col justify-between transition-all active:scale-95 bg-[#121215] cursor-pointer"
                >
                  <div className="relative h-20 rounded-lg overflow-hidden bg-black mb-1.5">
                    <img
                      src={duoCoupleImg}
                      alt="BXC Duo"
                      className="w-full h-full object-cover filter contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#ccf141] border border-[#ccf141]/30">
                      2 PERSON
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h4
                        className="text-xs font-black uppercase text-white tracking-tight leading-none group-hover:text-[#ccf141] transition-colors"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        BXC DUO
                      </h4>
                      <span className="text-[9.5px] text-neutral-400 block mt-0.5 truncate">
                        Couple &amp; Buddy Pass
                      </span>

                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider mt-2 py-1 px-1 rounded flex items-center justify-center gap-1 bg-white/5 text-neutral-300 border border-white/10 group-hover:bg-[#ccf141] group-hover:text-black transition-colors">
                      <span>View Duo</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>

                {/* BXC FAMILY FIT CARD */}
                <Link
                  to="/family"
                  onClick={closeOffcanvas}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#ccf141]/50 p-2.5 flex flex-col justify-between transition-all active:scale-95 bg-[#121215] cursor-pointer"
                >
                  <div className="relative h-20 rounded-lg overflow-hidden bg-black mb-1.5">
                    <img
                      src={familyFatherSonImg}
                      alt="BXC Family Fit"
                      className="w-full h-full object-cover filter contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#ccf141] border border-[#ccf141]/30">
                      ALL AGES
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h4
                        className="text-xs font-black uppercase text-white tracking-tight leading-none group-hover:text-[#ccf141] transition-colors"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        FAMILY FIT
                      </h4>
                      <span className="text-[9.5px] text-neutral-400 block mt-0.5 truncate">
                        Parents + Kids (Up to 4)
                      </span>

                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider mt-2 py-1 px-1 rounded flex items-center justify-center gap-1 bg-white/5 text-neutral-300 border border-white/10 group-hover:bg-[#ccf141] group-hover:text-black transition-colors">
                      <span>View Family</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </div>

              {/* 3. BOTTOM: JUNIOR CARD */}
              <Link
                to="/membership/junior"
                onClick={closeOffcanvas}
                className="mt-2.5 group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#ccf141]/50 p-2.5 flex items-center gap-3 transition-all active:scale-98 bg-[#121215] cursor-pointer"
              >
                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                  <img
                    src={juniorBoxer}
                    alt="Junior Core"
                    className="w-full h-full object-cover object-[center_34%] filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider bg-[#ccf141] text-black">
                    UNDER 13
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className="text-xs font-black uppercase text-white tracking-tight leading-none group-hover:text-[#ccf141] transition-colors"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        JUNIOR CORE
                      </h4>

                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-tight line-clamp-1">
                      Youth boxing fundamentals, discipline &amp; screen-free fitness.
                    </p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-[#ccf141] flex items-center gap-1">
                    <span>Explore Junior Program</span>
                    <ArrowRight size={10} />
                  </span>
                </div>
              </Link>

              {/* SECONDARY QUICK LINKS IN MOBILE */}
              <div className="pt-3 flex flex-col gap-2 border-t border-white/10 mt-3">
                <Link
                  to="/founding100"
                  onClick={closeOffcanvas}
                  className="flex items-center justify-between text-xs text-[#ccf141] font-bold uppercase tracking-wider py-1.5"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} />
                    Founding Members 100 Access
                  </span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/#membership-plans"
                  onClick={closeOffcanvas}
                  className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider py-1"
                >
                  Compare All Plans &amp; Pricing
                </Link>
                <Link
                  to="/#book-your-free-gym-tour"
                  onClick={closeOffcanvas}
                  className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider py-1"
                >
                  Book Free Trial / Gym Tour
                </Link>
              </div>
            </div>
          </div>

          {/* WORK FORMAT */}
          <div className="border-b border-[#1f1f1f]">
            <NavLink
              to="/work-format"
              onClick={closeOffcanvas}
              className={({ isActive }) =>
                `block py-2.5 text-[14px] font-extrabold uppercase transition-colors ${
                  isActive ||
                  location.pathname === "/work-format" ||
                  location.pathname === "/workout-formats" ||
                  location.pathname === "/workformat"
                    ? "text-[#ccf141]"
                    : "text-white hover:text-[#ccf141]"
                }`
              }
            >
              WORK FORMAT
            </NavLink>
          </div>

          {/* COMMUNITY */}

          <div className="border-b border-[#1f1f1f]">
            <div className="flex justify-between items-center py-2">
              <NavLink
                to="/community"
                onClick={closeOffcanvas}
                className={({ isActive }) =>
                  `text-[14px] font-extrabold transition-colors ${isActive || location.pathname === "/events"
                    ? "text-[#ccf141]"
                    : "text-white hover:text-[#ccf141]"
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
              className={`overflow-hidden transition-all duration-300 ${openDropdown === "community" ? "max-h-60 pb-4" : "max-h-0"
                }`}
            >
              <div className="flex flex-col gap-3 pl-2">
                {communityDropdown.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={closeOffcanvas}
                    className={({ isActive }) =>
                      `text-sm font-medium tracking-wider transition-colors ${isActive
                        ? "text-[#ccf141]"
                        : "text-gray-400 hover:text-white"
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

          <div className="mt-[50px]">
            {/* SOCIAL */}

            <div className="flex mt-5 gap-6">
              <a href="#" className="text-white hover:text-[#ccf141]">
                <FaFacebookF size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#ccf141]">
                <FaTwitter size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#ccf141]">
                <FaLinkedinIn size={20} />
              </a>

              <a href="#" className="text-white hover:text-[#ccf141]">
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
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] transition-all duration-500 hidden lg:block ${desktopOffcanvasOpen ? "opacity-100 visible" : "opacity-0 invisible"
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
            className="text-white hover:text-[#ccf141] transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
          >
            <XCircle size={32} strokeWidth={1.5} />
          </button>
        </div>

        <p
          className="text-gray-300 text-[19px] mb-12 leading-relaxed"
          style={{
            fontFamily: '"Brutal Font", sans-serif',
            fontWeight: 400,
          }}
        >
          Welcome to{" "}
          <span className="text-[#ccf141] font-bold">Box & Cross</span>, where
          passion meets performance and fitness <br /> becomes a lifestyle. Our
          mission is to empower individuals of all ages and <br /> fitness
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
                <Phone className="text-[#ccf141] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#ccf141] uppercase mb-1"
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
                    className="text-white text-lg hover:text-[#ccf141] transition-colors block"
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
                <Mail className="text-[#ccf141] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#ccf141] uppercase mb-1"
                    style={{
                      fontFamily: '"Brutal Font Bold", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    EMAIL US
                  </h4>
                  <a
                    href="mailto:getfit@boxandcross.com"
                    className="text-white text-lg hover:text-[#ccf141] transition-colors block"
                    style={{
                      fontFamily: '"Brutal Font Light", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    getfit@boxandcross.com
                  </a>
                </div>
              </div>

              {/* Location item */}
              <div className="flex items-start gap-4">
                <MapPin className="text-[#ccf141] shrink-0 mt-1" size={20} />
                <div>
                  <h4
                    className="text-[#ccf141] uppercase mb-1"
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
                      fontFamily: '"Brutal Font", sans-serif',
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

              {/* Admin Dashboard Button */}
              <div className="pt-6">
                <a
                  href="/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-[220px] h-[52px] bg-[#ccf141] text-black rounded-xl text-xs font-black tracking-wider uppercase hover:bg-white transition-colors duration-300"
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
              className="text-white uppercase tracking-wider mb-8"
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
            className="absolute top-8 right-8 text-white hover:text-[#ccf141] transition-all hover:scale-110 hover:rotate-90 cursor-pointer"
          >
            <X size={40} />
          </button>

          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? galleryImages.length - 1 : prev - 1,
              )
            }
            className="absolute left-8 text-white hover:text-[#ccf141] transition-all hover:scale-110 cursor-pointer"
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
            className="absolute right-8 text-white hover:text-[#ccf141] transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
