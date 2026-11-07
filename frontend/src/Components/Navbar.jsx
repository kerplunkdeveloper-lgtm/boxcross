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
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import CoinIcon from "./CoinIcon";

import logo from "../assets/images/logo-new.png";
import box1 from "../assets/box1.png";
import box2 from "../assets/box2.png";
import box3 from "../assets/box3.png";
import juniorBoxer from "../assets/junior_boxer.jpg";
import duoCoupleImg from "../assets/duo_couple.jpg";
import familyFatherSonImg from "../assets/family_father_son.jpg";
import membershipCoreImg from "../assets/membership_core.png";
import membershipAthleteImg from "../assets/membership_athlete.png";
import membershipArenaImg from "../assets/membership_arena.png";

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

  // 3 MEMBERSHIP CARDS (EXACT TO REFERENCE UI/UX)
  const referenceMembershipCards = [
    {
      id: "core",
      title: "CORE",
      tag: "1 PATHWAY",
      coin: "bronze",
      image: membershipCoreImg,
      path: "/membership/core",
      isFeatured: false,
    },
    {
      id: "athlete",
      title: "ATHLETE",
      tag: "2 PATHWAYS",
      coin: "silver",
      image: membershipAthleteImg,
      path: "/membership/athlete",
      isFeatured: true,
    },
    {
      id: "arena",
      title: "ARENA",
      tag: "ALL ACCESS",
      coin: "gold",
      image: membershipArenaImg,
      path: "/membership/arena",
      isFeatured: false,
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
      const currentScrollY = window.scrollY;
      // background style change after scrolling
      setScrolled(currentScrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`
    fixed top-0 z-[80] w-full 
    transition-all duration-300 ease-out translate-y-0
    ${scrolled ? "px-0 pt-0 shadow-2xl" : "px-0 md:px-0 pt-0 md:pt-0"}
  `}
      >
        {/* ================= NAVBAR ================= */}

        <nav
          style={{
            background:
              "linear-gradient(135deg, #292A2E 0%, #1C1C22 35%, #101119 70%, #0D0E17 100%)",
          }}
          className={`
            relative z-50 w-full
            transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              scrolled
                ? "py-2.5 px-4 md:px-8 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
                : "py-3 px-4 md:px-8 backdrop-blur-xl  border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
            }
          `}
        >
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              {/* ================= LEFT: LOGO ================= */}
              <div className="flex-1 flex items-center justify-start">
                <NavLink to="/home" className="inline-flex items-center flex-shrink-0">
                  <img
                    src={logo}
                    alt="Box & Cross"
                    className="w-38 sm:w-42 md:w-46 transition-opacity duration-300 hover:opacity-90"
                  />
                </NavLink>
              </div>

              {/* ================= CENTER: DESKTOP NAV (PERFECTLY CENTERED) ================= */}
              <div className="hidden lg:flex items-center justify-center gap-7 xl:gap-9">
                {/* HOME */}
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `group relative py-2 uppercase tracking-[0.12em] transition-all duration-200 text-[13.5px] font-semibold ${
                      isActive || location.pathname === "/home"
                        ? "text-white"
                        : "text-neutral-400 hover:text-white"
                    }`
                  }
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>HOME</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                      location.pathname === "/home"
                        ? "w-4 bg-[#ccf141] shadow-[0_0_8px_rgba(204,241,65,0.7)]"
                        : "w-0 group-hover:w-3.5 bg-white/40"
                    }`}
                  />
                </NavLink>

                {/* MEMBERSHIP WITH FULL-WIDTH DROP DOWN */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter("membership")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/"
                    className={({ isActive }) => {
                      const isMembershipActive =
                        (isActive && location.pathname === "/") ||
                        location.pathname.includes("/membership") ||
                        location.pathname === "/core" ||
                        location.pathname === "/athlete" ||
                        location.pathname === "/arena" ||
                        location.pathname === "/junior" ||
                        location.pathname === "/junior-core" ||
                        location.pathname === "/family" ||
                        location.pathname === "/family-fit" ||
                        location.pathname === "/duo" ||
                        location.pathname === "/bxc-duo";

                      return `relative py-2 uppercase tracking-[0.12em] transition-all duration-200 text-[13.5px] font-semibold flex items-center gap-1.5 ${
                        isMembershipActive
                          ? "text-white"
                          : "text-neutral-400 hover:text-white"
                      }`;
                    }}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <span>MEMBERSHIP</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 text-neutral-400 group-hover:text-white ${
                        openDropdown === "membership" ? "rotate-180 text-[#ccf141]" : ""
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                        location.pathname === "/" ||
                        location.pathname.includes("/membership") ||
                        location.pathname === "/core" ||
                        location.pathname === "/athlete" ||
                        location.pathname === "/arena" ||
                        location.pathname === "/junior" ||
                        location.pathname === "/family" ||
                        location.pathname === "/duo"
                          ? "w-4 bg-[#ccf141] shadow-[0_0_8px_rgba(204,241,65,0.7)]"
                          : "w-0 group-hover:w-3.5 bg-white/40"
                      }`}
                    />
                  </NavLink>
                </div>

                {/* WORK FORMAT */}
                <NavLink
                  to="/work-format"
                  className={({ isActive }) => {
                    const isWorkFormatActive =
                      isActive ||
                      location.pathname === "/work-format" ||
                      location.pathname === "/workout-formats" ||
                      location.pathname === "/workformat";

                    return `group relative py-2 uppercase tracking-[0.12em] transition-all duration-200 text-[13.5px] font-semibold ${
                      isWorkFormatActive
                        ? "text-white"
                        : "text-neutral-400 hover:text-white"
                    }`;
                  }}
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>WORK FORMAT</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                      location.pathname === "/work-format" ||
                      location.pathname === "/workout-formats" ||
                      location.pathname === "/workformat"
                        ? "w-4 bg-[#ccf141] shadow-[0_0_8px_rgba(204,241,65,0.7)]"
                        : "w-0 group-hover:w-3.5 bg-white/40"
                    }`}
                  />
                </NavLink>

                {/* COMMUNITY DROPDOWN */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter("community")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <NavLink
                    to="/community"
                    className={({ isActive }) => {
                      const isCommunityActive =
                        isActive ||
                        location.pathname === "/community" ||
                        location.pathname === "/events";

                      return `relative py-2 uppercase tracking-[0.12em] transition-all duration-200 text-[13.5px] font-semibold flex items-center gap-1.5 ${
                        isCommunityActive
                          ? "text-white"
                          : "text-neutral-400 hover:text-white"
                      }`;
                    }}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <span>COMMUNITY</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 text-neutral-400 group-hover:text-white ${
                        openDropdown === "community" ? "rotate-180 text-[#ccf141]" : ""
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                        location.pathname === "/community" || location.pathname === "/events"
                          ? "w-4 bg-[#ccf141] shadow-[0_0_8px_rgba(204,241,65,0.7)]"
                          : "w-0 group-hover:w-3.5 bg-white/40"
                      }`}
                    />
                  </NavLink>

                  {/* PREMIUM DARK GLASSMORPHIC DROPDOWN */}
                  {openDropdown === "community" && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-[100] animate-in fade-in slide-in-from-top-2">
                      {communityDropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className="group flex items-center justify-between px-4 py-3 rounded-xl text-[12px] uppercase font-bold tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100 text-[#ccf141] transition-all duration-200"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ================= RIGHT: ACTIONS ================= */}
              <div className="flex-1 flex items-center justify-end gap-3 sm:gap-3.5">
                {/* TALK TO US / CALL PILL */}
                <a
                  href="tel:+918925556800"
                  className="hidden lg:inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-white transition-all duration-300 group shadow-sm shrink-0"
                  aria-label="Call Box & Cross"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ccf141] flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Phone size={11} className="fill-black" />
                  </div>
                  <span
                    className="text-[12px] font-bold tracking-wider uppercase text-neutral-300 group-hover:text-white transition-colors"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    TALK TO US
                  </span>
                </a>

                {/* DESKTOP OFFCANVAS BUTTON */}
                <button
                  onClick={() => setDesktopOffcanvasOpen(true)}
                  className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#ccf141]/40 text-neutral-300 hover:text-[#ccf141] transition-all duration-300 cursor-pointer shrink-0"
                  aria-label="Open desktop menu"
                  title="Menu"
                >
                  <LayoutGrid
                    size={18}
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

          {/* ======================================================== */}
          {/* DESKTOP MEMBERSHIP DROPDOWN (FULL-VIEW REFERENCE UI/UX) */}
          {/* ======================================================== */}
          {openDropdown === "membership" && (
            <div
              onMouseEnter={() => handleDropdownEnter("membership")}
              onMouseLeave={handleDropdownLeave}
              className="hidden lg:block absolute left-0 right-0 top-full pt-2.5 w-full px-4 sm:px-6 md:px-8 xl:px-10 z-[100] text-left transition-all duration-300 animate-in fade-in slide-in-from-top-1"
            >
              <div className="max-w-[1600px] w-full mx-auto before:absolute before:-top-4 before:left-0 before:right-0 before:h-6 before:content-[''] bg-[#090e1b]/96 backdrop-blur-3xl border border-white/10 rounded-[28px] p-5 sm:p-6 lg:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative">
                
                {/* 6 CARDS IN FULL-VIEW 3-COLUMN x 2-ROW GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {referenceMembershipCards.map((card) => {
                    return (
                      <Link
                        key={card.id}
                        to={card.path}
                        onClick={() => setOpenDropdown(null)}
                        style={{
                          background:
                            "linear-gradient(135deg, #292A2E 0%, #1C1C22 35%, #101119 70%, #0D0E17 100%)",
                        }}
                        className={`group relative rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                          card.isFeatured
                            ? "border-[1.5px] border-[#ccf141] shadow-[0_0_24px_rgba(204,241,65,0.22)] hover:shadow-[0_0_32px_rgba(204,241,65,0.35)] hover:-translate-y-0.5"
                            : "border border-white/10 hover:border-white/20 hover:-translate-y-0.5 shadow-lg"
                        }`}
                      >
                        {/* TOP ROW: TAG & CIRCULAR ARROW BUTTON */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-300 transition-colors font-sans">
                            {card.tag}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/25 transition-all duration-300">
                            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* MAIN CONTENT ROW: IMAGE OR (3D METALLIC COIN + DIVIDER + PLAN TITLE) */}
                        <div className="flex items-center min-h-[50px] py-1">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.title}
                              className="h-10 sm:h-11 lg:h-12 w-auto max-w-[210px] object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <>
                              {/* 3D EMBOSSED METALLIC COIN */}
                              <CoinIcon type={card.coin} className="w-12 h-12 sm:w-14 sm:h-14" />

                              {/* VERTICAL DIVIDER LINE */}
                              <div className="h-9 w-[1px] bg-white/15 mx-4 shrink-0" />

                              {/* PLAN TITLE */}
                              <h3
                                className={`text-base sm:text-lg lg:text-xl font-black uppercase tracking-wider transition-colors ${
                                  card.isFeatured
                                    ? "text-[#ccf141]"
                                    : "text-white group-hover:text-[#ccf141]"
                                }`}
                                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                              >
                                {card.title}
                              </h3>
                            </>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
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
              to="/home"
              onClick={closeOffcanvas}
              className={({ isActive }) =>
                `block py-2 text-[14px] font-extrabold transition-colors ${
                  isActive || location.pathname === "/home"
                    ? "text-[#ccf141]"
                    : "text-white hover:text-[#ccf141]"
                }`
              }
            >
              HOME
            </NavLink>
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
              {/* MOBILE MEMBERSHIP 2-COLUMN GRID (EXACT REFERENCE UI/UX) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2.5">
                {referenceMembershipCards.map((card) => (
                  <Link
                    key={card.id}
                    to={card.path}
                    onClick={closeOffcanvas}
                    style={{
                      background:
                        "linear-gradient(135deg, #292A2E 0%, #1C1C22 35%, #101119 70%, #0D0E17 100%)",
                    }}
                    className={`group relative rounded-xl p-2.5 sm:p-3 flex flex-col justify-between transition-all active:scale-95 cursor-pointer ${
                      card.isFeatured
                        ? "border-[1.5px] border-[#ccf141] shadow-[0_0_15px_rgba(204,241,65,0.2)]"
                        : "border border-white/10 active:border-white/20"
                    }`}
                  >
                    {/* TOP ROW: TAG & CIRCULAR ARROW */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 font-sans truncate">
                        {card.tag}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-neutral-400 shrink-0">
                        <ArrowUpRight size={11} />
                      </div>
                    </div>

                    {/* MAIN ROW: IMAGE OR (3D METALLIC COIN + DIVIDER + PLAN TITLE) */}
                    <div className="flex items-center min-h-[36px] py-1">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-7 sm:h-8 w-auto max-w-[130px] object-contain"
                        />
                      ) : (
                        <>
                          <CoinIcon type={card.coin} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
                          <div className="h-6 w-[1px] bg-white/15 mx-2 shrink-0" />
                          <h4
                            className={`text-xs sm:text-[13.5px] font-black uppercase tracking-wider leading-tight truncate ${
                              card.isFeatured ? "text-[#ccf141]" : "text-white"
                            }`}
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {card.title}
                          </h4>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

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
