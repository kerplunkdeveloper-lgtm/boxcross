import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  DollarSign,
  Crown,
  Sparkles,
  Image,
  FileText,
  BookOpen,
  MessageSquare,
  Settings,
  User,
  LogOut,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";
import logo from "../assets/images/logo-new.png";
import logo2 from "../assets/images/lightmode.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout, user: propUser }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const { theme } = useTheme();
  const location = useLocation();

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Dropdown states with path-matching initialization
  const [eventsOpen, setEventsOpen] = useState(() => {
    return (
      location.pathname.includes("/events") ||
      location.pathname.includes("/events-list") ||
      location.pathname.includes("/event-payments") ||
      location.pathname.includes("/event-participants")
    );
  });

  const [enquiriesOpen, setEnquiriesOpen] = useState(() => {
    return (
      location.pathname.includes("/homec1") ||
      location.pathname.includes("/homec2") ||
      location.pathname.includes("/homec3") ||
      location.pathname.includes("/bookings")
    );
  });

  const [membershipOpen, setMembershipOpen] = useState(() => {
    return (
      location.pathname.includes("/memberships") ||
      location.pathname.includes("/payments")
    );
  });

  const [offerFoundersOpen, setOfferFoundersOpen] = useState(() => {
    return (
      location.pathname.includes("/founding-members") ||
      location.pathname.includes("/founding-offer")
    );
  });

  // Keep dropdowns open if active route is within them
  useEffect(() => {
    if (
      location.pathname.includes("/events") ||
      location.pathname.includes("/events-list") ||
      location.pathname.includes("/event-payments") ||
      location.pathname.includes("/event-participants")
    ) {
      setEventsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.includes("/homec1") ||
      location.pathname.includes("/homec2") ||
      location.pathname.includes("/homec3") ||
      location.pathname.includes("/bookings")
    ) {
      setEnquiriesOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.includes("/memberships") ||
      location.pathname.includes("/payments")
    ) {
      setMembershipOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.includes("/founding-members") ||
      location.pathname.includes("/founding-offer")
    ) {
      setOfferFoundersOpen(true);
    }
  }, [location.pathname]);

  // Micro-animation mapping based on icon type / purpose
  const getIconAnimation = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("setting")) return "group-hover:rotate-90 group-hover:scale-120";
    if (n.includes("calendar") || n.includes("schedule")) return "group-hover:-translate-y-1 group-hover:scale-115";
    if (n.includes("dashboard")) return "group-hover:scale-120 group-hover:rotate-6";
    if (n.includes("user") || n.includes("participant") || n.includes("consultation")) return "group-hover:scale-115 group-hover:translate-x-0.5";
    if (n.includes("readiness") || n.includes("goal") || n.includes("clipboard")) return "group-hover:scale-120 group-hover:-rotate-6";
    if (n.includes("membership") || n.includes("plan")) return "group-hover:scale-120 group-hover:-rotate-12";
    if (n.includes("payment") || n.includes("dollar")) return "group-hover:scale-125 group-hover:rotate-12";
    if (n.includes("founder") || n.includes("crown")) return "group-hover:scale-125 group-hover:-translate-y-1 group-hover:rotate-12";
    if (n.includes("event") || n.includes("sparkle") || n.includes("offer")) return "group-hover:scale-125 group-hover:rotate-45";
    if (n.includes("banner") || n.includes("image")) return "group-hover:scale-115 group-hover:-rotate-6 group-hover:-translate-y-0.5";
    if (n.includes("lead") || n.includes("enquir") || n.includes("trial") || n.includes("form") || n.includes("file")) return "group-hover:scale-115 group-hover:-translate-y-0.5";
    if (n.includes("booking") || n.includes("book")) return "group-hover:scale-120 group-hover:-rotate-6";
    if (n.includes("message") || n.includes("contact")) return "group-hover:scale-120 group-hover:rotate-12 group-hover:-translate-y-0.5";
    if (n.includes("profile")) return "group-hover:scale-115 group-hover:-translate-y-0.5";
    if (n.includes("logout")) return "group-hover:-translate-x-1 group-hover:scale-115";
    return "group-hover:scale-120 group-hover:-translate-y-0.5";
  };

  // Dedicated NavIconPod Component with rich glow, glint, and spring physics
  const NavIconPod = ({
    Icon,
    name,
    isActive = false,
    collapsed = false,
    size = 15,
  }) => {
    const animClass = getIconAnimation(name);

    if (collapsed) {
      return (
        <div
          className={`sidebar-icon-spring relative w-10 h-10 mx-auto flex items-center justify-center rounded-xl overflow-hidden cursor-pointer select-none ${
            isActive
              ? theme === "dark"
                ? "bg-[#e5ff00] text-black shadow-[0_0_18px_rgba(229,255,0,0.55)] ring-2 ring-[#e5ff00]/50 scale-105 font-black"
                : "bg-[#e5ff00] text-black shadow-[0_4px_14px_rgba(216,245,0,0.6)] border border-black/15 ring-2 ring-[#e5ff00]/60 scale-105 font-black"
              : theme === "dark"
                ? "bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-[#e5ff00] group-hover:bg-[#e5ff00]/15 group-hover:border-[#e5ff00]/40 group-hover:shadow-[0_0_16px_rgba(229,255,0,0.35)] group-hover:scale-105 group-hover:-translate-y-0.5"
                : "bg-slate-100/90 border border-slate-200/80 text-slate-600 group-hover:text-black group-hover:bg-[#e5ff00]/30 group-hover:border-[#cbee00] group-hover:shadow-[0_2px_12px_rgba(229,255,0,0.35)] group-hover:scale-105 group-hover:-translate-y-0.5"
          }`}
        >
          {/* Ambient Backlight Aura on Hover */}
          <span
            className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
              isActive
                ? "opacity-60 bg-[#e5ff00]/40 blur-sm"
                : "opacity-0 group-hover:opacity-100 bg-[#e5ff00]/25 blur-md"
            }`}
          />

          {/* Micro Sheen Light Sweep on Hover */}
          <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </span>

          {/* Left Indicator Pill on Collapsed Tile */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
              isActive
                ? theme === "dark"
                  ? "h-5 bg-[#e5ff00] shadow-[0_0_12px_#e5ff00]"
                  : "h-5 bg-[#090d16] shadow-sm"
                : theme === "dark"
                  ? "h-0 bg-[#e5ff00] group-hover:h-3.5 group-hover:opacity-100 opacity-0 shadow-[0_0_8px_rgba(229,255,0,0.6)]"
                  : "h-0 bg-[#cbee00] group-hover:h-3.5 group-hover:opacity-100 opacity-0"
            }`}
          />

          {/* Icon */}
          <Icon
            size={17}
            className={`sidebar-icon-spring relative z-10 shrink-0 ${animClass}`}
          />
        </div>
      );
    }

    // Expanded View Icon Pod
    return (
      <div
        className={`sidebar-icon-spring relative w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden select-none ${
          isActive
            ? theme === "dark"
              ? "bg-[#e5ff00] text-black shadow-[0_0_14px_rgba(229,255,0,0.55)] ring-1 ring-[#e5ff00]/60 font-black"
              : "bg-[#e5ff00] text-black shadow-[0_2px_10px_rgba(216,245,0,0.55)] border border-black/15 ring-1 ring-[#e5ff00]/60 font-black"
            : theme === "dark"
              ? "bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-[#e5ff00] group-hover:bg-[#e5ff00]/15 group-hover:border-[#e5ff00]/40 group-hover:shadow-[0_0_12px_rgba(229,255,0,0.3)] group-hover:-translate-y-0.5"
              : "bg-slate-100/90 border border-slate-200/80 text-slate-600 group-hover:text-black group-hover:bg-[#e5ff00]/30 group-hover:border-[#cbee00] group-hover:shadow-[0_2px_10px_rgba(229,255,0,0.35)] group-hover:-translate-y-0.5"
        }`}
      >
        {/* Ambient Backlight Aura on Hover */}
        <span
          className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ${
            isActive
              ? "opacity-60 bg-[#e5ff00]/30 blur-sm"
              : "opacity-0 group-hover:opacity-100 bg-[#e5ff00]/25 blur-md"
          }`}
        />

        {/* Micro Sheen Light Sweep on Hover */}
        <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </span>

        {/* Icon */}
        <Icon
          size={size}
          className={`sidebar-icon-spring relative z-10 shrink-0 ${animClass}`}
        />
      </div>
    );
  };

  // Style helpers for items
  const getItemClass = (isActive) => {
    if (isActive) {
      return theme === "dark"
        ? "bg-gradient-to-r from-[#e5ff00]/18 via-[#e5ff00]/08 to-transparent !text-[#e5ff00] border border-[#e5ff00]/35 shadow-[0_0_16px_rgba(229,255,0,0.18)] font-black"
        : "bg-gradient-to-r from-[#e5ff00]/35 via-[#e5ff00]/20 to-transparent !text-slate-950 border border-[#cbee00] shadow-[0_2px_12px_rgba(216,245,0,0.25)] font-black";
    }
    return theme === "dark"
      ? "text-zinc-300 font-bold hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent"
      : "text-slate-600 font-bold hover:text-slate-950 hover:bg-slate-100/90 hover:border-slate-200/80 border border-transparent";
  };

  const getSubItemClass = (isActive) => {
    if (isActive) {
      return theme === "dark"
        ? "bg-gradient-to-r from-[#e5ff00]/16 via-[#e5ff00]/06 to-transparent !text-[#e5ff00] border border-[#e5ff00]/35 font-black shadow-[0_0_12px_rgba(229,255,0,0.12)]"
        : "bg-[#e5ff00]/25 !text-slate-950 border border-[#cbee00]/80 font-black shadow-sm";
    }
    return theme === "dark"
      ? "text-zinc-400 font-medium hover:text-white hover:bg-white/[0.05] hover:border-white/10 border border-transparent"
      : "text-slate-600 font-medium hover:text-slate-950 hover:bg-slate-100/90 hover:border-slate-200/80 border border-transparent";
  };

  const getTriggerClass = (hasActive) => {
    if (hasActive) {
      return theme === "dark"
        ? "!text-[#e5ff00] bg-gradient-to-r from-[#e5ff00]/15 via-[#e5ff00]/06 to-transparent border border-[#e5ff00]/30 font-black shadow-[0_0_12px_rgba(229,255,0,0.1)]"
        : "!text-slate-950 bg-gradient-to-r from-[#e5ff00]/25 via-[#e5ff00]/15 to-transparent border border-[#cbee00]/70 font-black shadow-sm";
    }
    return theme === "dark"
      ? "text-zinc-300 font-bold hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent"
      : "text-slate-600 font-bold hover:text-slate-950 hover:bg-slate-100/90 hover:border-slate-200/80 border border-transparent";
  };

  // Helper to render single nav item with tooltip for collapsed state
  const renderSingleItem = ({ to, name, icon: Icon, end = false, badge = null }) => {
    return (
      <div key={to} className="relative group hover:z-50">
        <NavLink
          to={to}
          end={end}
          onClick={closeSidebarOnMobile}
          className={({ isActive }) =>
            sidebarOpen
              ? `relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200 cursor-pointer overflow-hidden ${getItemClass(
                  isActive
                )}`
              : `relative w-full flex items-center justify-center py-0.5 transition-all duration-200 cursor-pointer`
          }
        >
          {({ isActive }) => (
            <>
              {sidebarOpen ? (
                <>
                  {/* Left Active/Hover Glowing Pill Indicator */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? theme === "dark"
                          ? "h-5 bg-[#e5ff00] shadow-[0_0_12px_#e5ff00]"
                          : "h-5 bg-[#090d16] shadow-sm"
                        : theme === "dark"
                          ? "h-0 bg-[#e5ff00] group-hover:h-3.5 group-hover:opacity-100 opacity-0 shadow-[0_0_8px_rgba(229,255,0,0.6)]"
                          : "h-0 bg-[#cbee00] group-hover:h-3.5 group-hover:opacity-100 opacity-0"
                    }`}
                  />

                  <div className="flex items-center gap-2.5 min-w-0">
                    <NavIconPod
                      Icon={Icon}
                      name={name}
                      isActive={isActive}
                      collapsed={false}
                    />
                    <span
                      className={`truncate group-hover:translate-x-0.5 transition-transform duration-200 ${
                        isActive
                          ? theme === "dark"
                            ? "!text-[#e5ff00] font-black"
                            : "!text-slate-950 font-black"
                          : "text-inherit"
                      }`}
                    >
                      {name}
                    </span>
                  </div>
                  {badge && (
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform duration-200">
                      {badge}
                    </span>
                  )}
                </>
              ) : (
                <NavIconPod
                  Icon={Icon}
                  name={name}
                  isActive={isActive}
                  collapsed={true}
                />
              )}
            </>
          )}
        </NavLink>

        {/* Hover Tooltip when sidebar is collapsed (Desktop only) */}
        {!sidebarOpen && (
          <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 items-center">
            <div className={`relative px-3 py-1.5 rounded-xl border flex items-center gap-2 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl ${
              theme === "dark"
                ? "bg-[#0b0c10]/95 border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(229,255,0,0.06)]"
                : "bg-white/95 border-slate-200 shadow-[0_12px_25px_rgba(15,23,42,0.12)]"
            }`}>
              <span className={`text-[11.5px] font-bold tracking-wide ${
                theme === "dark" ? "text-zinc-100" : "text-slate-900"
              }`}>
                {name}
              </span>
              {badge && (
                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {badge}
                </span>
              )}
              {/* Tooltip arrow pointer */}
              <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent ${
                theme === "dark" ? "border-r-white/15" : "border-r-slate-200"
              }`} />
              <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent ${
                theme === "dark" ? "border-r-[#0b0c10]" : "border-r-white"
              } mr-[-1px]`} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper to render dropdown group with flyout menu for collapsed state
  const renderDropdownGroup = ({
    title,
    icon: Icon,
    isOpen,
    setIsOpen,
    pathMatch,
    items,
  }) => {
    const hasActiveChild = pathMatch.some((path) => location.pathname.includes(path));

    return (
      <div key={title} className="relative group hover:z-50">
        {sidebarOpen ? (
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200 cursor-pointer overflow-hidden ${getTriggerClass(
                hasActiveChild
              )}`}
            >
              {/* Left Active/Hover Glowing Pill */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
                  hasActiveChild
                    ? theme === "dark"
                      ? "h-5 bg-[#e5ff00] shadow-[0_0_12px_#e5ff00]"
                      : "h-5 bg-[#090d16] shadow-sm"
                    : theme === "dark"
                      ? "h-0 bg-[#e5ff00] group-hover:h-3.5 group-hover:opacity-100 opacity-0 shadow-[0_0_8px_rgba(229,255,0,0.6)]"
                      : "h-0 bg-[#cbee00] group-hover:h-3.5 group-hover:opacity-100 opacity-0"
                }`}
              />

              <div className="flex items-center gap-2.5 min-w-0">
                <NavIconPod
                  Icon={Icon}
                  name={title}
                  isActive={hasActiveChild}
                  collapsed={false}
                />
                <span
                  className={`truncate group-hover:translate-x-0.5 transition-transform duration-200 ${
                    hasActiveChild
                      ? theme === "dark"
                        ? "!text-[#e5ff00] font-black"
                        : "!text-slate-950 font-black"
                      : "text-inherit"
                  }`}
                >
                  {title}
                </span>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                theme === "dark"
                  ? "group-hover:bg-white/[0.08] text-zinc-400 group-hover:text-zinc-200"
                  : "group-hover:bg-black/[0.05] text-slate-500 group-hover:text-black"
              }`}>
                <ChevronDown
                  size={13}
                  className={`shrink-0 sidebar-icon-spring ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isOpen && (
              <div className={`ml-3 pl-2.5 border-l space-y-1 my-1 ${
                theme === "dark" ? "border-white/[0.08]" : "border-slate-200"
              }`}>
                {items.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={closeSidebarOnMobile}
                      className={({ isActive }) =>
                        `group/sub relative w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${getSubItemClass(
                          isActive
                        )}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Sub connector pip */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 shrink-0 ${
                              isActive
                                ? theme === "dark"
                                  ? "bg-[#e5ff00] scale-125 shadow-[0_0_8px_#e5ff00]"
                                  : "bg-[#090d16] scale-125 shadow-sm"
                                : theme === "dark"
                                  ? "bg-zinc-600/80 group-hover/sub:bg-[#e5ff00] group-hover/sub:scale-125 group-hover/sub:shadow-[0_0_8px_rgba(229,255,0,0.6)]"
                                  : "bg-slate-300 group-hover/sub:bg-[#cbee00] group-hover/sub:scale-125 group-hover/sub:shadow-[0_0_6px_rgba(229,255,0,0.6)]"
                            }`}
                          />

                          {/* Sub-item Icon Pod */}
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isActive
                                ? theme === "dark"
                                  ? "bg-[#e5ff00] text-black shadow-[0_0_10px_rgba(229,255,0,0.4)]"
                                  : "bg-[#e5ff00] text-black shadow-sm border border-black/10"
                                : theme === "dark"
                                  ? "text-zinc-400 group-hover/sub:text-[#e5ff00] group-hover/sub:bg-[#e5ff00]/15 group-hover/sub:scale-110"
                                  : "text-slate-600 group-hover/sub:text-black group-hover/sub:bg-[#e5ff00]/25 group-hover/sub:scale-110"
                            }`}
                          >
                            <SubIcon
                              size={12}
                              className={`shrink-0 transition-all duration-200 group-hover/sub:scale-115 ${getIconAnimation(
                                sub.name
                              )}`}
                            />
                          </div>

                          <span
                            className={`truncate group-hover/sub:translate-x-1 transition-transform duration-200 ${
                              isActive
                                ? theme === "dark"
                                  ? "!text-[#e5ff00] font-black"
                                  : "!text-slate-950 font-black"
                                : "text-inherit"
                            }`}
                          >
                            {sub.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed View: Icon button + Flyout popover */
          <div className="flex justify-center py-0.5">
            <div className="cursor-pointer">
              <NavIconPod
                Icon={Icon}
                name={title}
                isActive={hasActiveChild}
                collapsed={true}
              />
            </div>

            {/* Flyout Submenu Popover on Hover (Desktop only) */}
            <div className="hidden lg:group-hover:block absolute left-full top-0 pl-3 z-50">
              <div className={`w-56 rounded-2xl p-2.5 space-y-1 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 ${
                theme === "dark"
                  ? "bg-[#0b0c10]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(229,255,0,0.06)]"
                  : "bg-white/95 border border-slate-200/90 shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
              }`}>
                {/* Popover Header */}
                <div className={`px-2.5 py-1.5 border-b mb-1.5 flex items-center justify-between ${
                  theme === "dark" ? "border-white/[0.08]" : "border-slate-200"
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === "dark" ? "text-zinc-400" : "text-slate-500"
                  }`}>
                    <Icon size={12} className={theme === "dark" ? "text-[#e5ff00]" : "text-black"} />
                    {title}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                    theme === "dark" ? "bg-[#e5ff00]/15 !text-[#e5ff00] border border-[#e5ff00]/30 shadow-[0_0_8px_rgba(229,255,0,0.2)]" : "bg-[#e5ff00] text-black border border-black/10 font-bold"
                  }`}>
                    {items.length} links
                  </span>
                </div>

                {/* Sub-item links */}
                {items.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={closeSidebarOnMobile}
                      className={({ isActive }) =>
                        `group/sub relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? theme === "dark"
                              ? "bg-gradient-to-r from-[#e5ff00]/20 via-[#e5ff00]/10 to-transparent !text-[#e5ff00] border border-[#e5ff00]/40 font-black shadow-[0_0_14px_rgba(229,255,0,0.2)]"
                              : "bg-gradient-to-r from-[#e5ff00]/35 to-[#e5ff00]/15 !text-slate-950 border border-[#cbee00] font-black shadow-sm"
                            : theme === "dark"
                              ? "text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 border border-transparent"
                              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isActive
                                ? theme === "dark"
                                  ? "bg-[#e5ff00] text-black shadow-[0_0_10px_rgba(229,255,0,0.4)]"
                                  : "bg-[#e5ff00] text-black shadow-sm border border-black/10"
                                : theme === "dark"
                                  ? "bg-white/[0.04] text-zinc-400 group-hover/sub:text-[#e5ff00] group-hover/sub:bg-[#e5ff00]/15 group-hover/sub:scale-110"
                                  : "bg-slate-100 text-slate-600 group-hover/sub:text-black group-hover/sub:bg-[#e5ff00]/25 group-hover/sub:scale-110"
                            }`}
                          >
                            <SubIcon
                              size={13}
                              className={`shrink-0 transition-transform duration-200 ${getIconAnimation(
                                sub.name
                              )}`}
                            />
                          </div>
                          <span
                            className={`truncate group-hover/sub:translate-x-0.5 transition-transform duration-200 ${
                              isActive
                                ? theme === "dark"
                                  ? "!text-[#e5ff00] font-black"
                                  : "!text-slate-950 font-black"
                                : "text-inherit"
                            }`}
                          >
                            {sub.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  );
                })}

                {/* Flyout pointer arrow */}
                <div className={`absolute right-full top-3.5 border-[6px] border-transparent ${
                  theme === "dark" ? "border-r-white/15" : "border-r-slate-200"
                }`} />
                <div className={`absolute right-full top-3.5 border-[5px] border-transparent ${
                  theme === "dark" ? "border-r-[#0b0c10]" : "border-r-white"
                } mr-[-1px]`} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper for Section Category Header
  const renderSectionHeader = (title) => {
    if (sidebarOpen) {
      return (
        <div className={`px-2 pb-1.5 pt-1 text-[9.5px] font-black uppercase tracking-[0.16em] flex items-center justify-between select-none ${
          theme === "dark" ? "text-zinc-400 font-extrabold" : "text-slate-400 font-extrabold"
        }`}>
          <span>{title}</span>
          {theme === "dark" && (
            <span className="flex-1 ml-2.5 h-[1px] bg-gradient-to-r from-white/[0.08] to-transparent" />
          )}
        </div>
      );
    }
    return <div className={`h-[1px] my-2 mx-1.5 ${theme === "dark" ? "bg-white/[0.08]" : "bg-slate-200/80"}`} />;
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 bg-[var(--db-sidebar)] border-r border-[var(--db-sidebar-border)] flex flex-col justify-between transform transition-all duration-300 select-none overflow-hidden ${
        theme === "dark"
          ? "shadow-[4px_0_30px_rgba(0,0,0,0.55)]"
          : "shadow-[2px_0_16px_rgba(15,23,42,0.03)]"
      } ${
        sidebarOpen
          ? "translate-x-0 w-[232px] lg:w-[232px]"
          : "-translate-x-full lg:w-[68px] lg:translate-x-0"
      }`}
    >
      {/* Subtle Ambient Backlight Glow for Dark Mode */}
      {theme === "dark" && (
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 bg-[#e5ff00]/[0.03] rounded-full blur-3xl" />
      )}

      {/* Brand Header */}
      <div
        className={`h-14 flex items-center border-b border-[var(--db-sidebar-border)] flex-shrink-0 bg-[var(--db-sidebar)] ${
          sidebarOpen ? "justify-between px-3.5" : "justify-center px-2"
        }`}
      >
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={theme === "light" ? logo2 : logo}
                alt="Box & Cross"
                className="w-[105px] h-7 object-contain"
              />
              {isAdmin && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider select-none shrink-0 ${
                  theme === "dark"
                    ? "bg-[#e5ff00] text-black shadow-[0_0_12px_rgba(229,255,0,0.45)] border border-[#e5ff00]/40"
                    : "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-xs border border-black/10"
                }`}>
                  <span style={{ fontFamily: '"Brutal Font", sans-serif' }}>ADMIN</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* Desktop Collapse Button */}
              <button
                className={`hidden lg:flex p-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  theme === "dark"
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/15"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70"
                }`}
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar (icons only)"
              >
                <ChevronLeft size={16} className="transition-transform duration-200 hover:-translate-x-0.5" />
              </button>
              {/* Mobile Close Button */}
              <button
                className={`lg:hidden p-1.5 rounded-lg transition-all duration-200 hover:rotate-90 hover:scale-110 cursor-pointer ${
                  theme === "dark"
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
                onClick={() => setSidebarOpen(false)}
                title="Close sidebar"
              >
                <X size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="relative group">
            <div
              onClick={() => setSidebarOpen(true)}
              className="group/bx sidebar-icon-spring relative w-9 h-9 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(229,255,0,0.3)] hover:shadow-[0_0_20px_rgba(229,255,0,0.65)] hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer overflow-hidden select-none"
            >
              <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/bx:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              <span className="relative z-10 transition-transform duration-300 group-hover/bx:scale-110">
                BX
              </span>
            </div>
            {/* Tooltip on logo */}
            <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 items-center">
              <div className={`relative px-3 py-1.5 rounded-xl border whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 ${
                theme === "dark"
                  ? "bg-[#0b0c10]/95 border-white/15 shadow-2xl text-[11px] font-bold text-zinc-100"
                  : "bg-white border-slate-200 shadow-xl text-[11px] font-bold text-slate-900"
              }`}>
                Box & Cross Admin (Click to expand)
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent ${
                  theme === "dark" ? "border-r-white/15" : "border-r-slate-200"
                }`} />
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent ${
                  theme === "dark" ? "border-r-[#0b0c10]" : "border-r-white"
                } mr-[-1px]`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categorized Nav Area */}
      <div
        className={`flex-grow py-3 space-y-3 ${
          sidebarOpen
            ? "overflow-y-auto custom-scrollbar px-2"
            : "overflow-visible lg:overflow-visible px-2"
        }`}
      >
        {/* SECTION 1: OVERVIEW */}
        <div>
          {renderSectionHeader("Overview")}
          <div className="space-y-0.5">
            {renderSingleItem({
              to: "/dashboard",
              name: "Dashboard",
              icon: LayoutDashboard,
              end: true,
            })}
            {renderSingleItem({
              to: "/dashboard/calendar",
              name: "Schedule & Calendar",
              icon: Calendar,
            })}
          </div>
        </div>

        {/* SECTION 2: MANAGEMENT */}
        {user && user.role === "admin" && (
          <div>
            {renderSectionHeader("Management")}
            <div className="space-y-0.5">
              {/* User Management */}
              {renderSingleItem({
                to: "/dashboard/user-management",
                name: "User Management",
                icon: Users,
              })}

              {/* Goals & Readiness */}
              {renderSingleItem({
                to: "/dashboard/goals-readiness",
                name: "Goals & Readiness",
                icon: ClipboardCheck,
              })}

              {/* Memberships Accordion / Flyout */}
              {renderDropdownGroup({
                title: "Memberships",
                icon: CreditCard,
                isOpen: membershipOpen,
                setIsOpen: setMembershipOpen,
                pathMatch: ["/memberships", "/payments"],
                items: [
                  {
                    name: "Membership Plans",
                    path: "/dashboard/memberships",
                    icon: CreditCard,
                  },
                  {
                    name: "Payment History",
                    path: "/dashboard/payments",
                    icon: DollarSign,
                  },
                ],
              })}

              {/* Founders Club Accordion / Flyout */}
              {renderDropdownGroup({
                title: "Founders Club",
                icon: Crown,
                isOpen: offerFoundersOpen,
                setIsOpen: setOfferFoundersOpen,
                pathMatch: ["/founding-members", "/founding-offer"],
                items: [
                  {
                    name: "Offer Details Edit",
                    path: "/dashboard/founding-offer",
                    icon: Sparkles,
                  },
                  {
                    name: "Founding Members",
                    path: "/dashboard/founding-members",
                    icon: Users,
                  },
                ],
              })}

              {/* Events Accordion / Flyout */}
              {renderDropdownGroup({
                title: "Events & Galas",
                icon: Sparkles,
                isOpen: eventsOpen,
                setIsOpen: setEventsOpen,
                pathMatch: [
                  "/events",
                  "/events-list",
                  "/event-payments",
                  "/event-participants",
                ],
                items: [
                  {
                    name: "Event Banners",
                    path: "/dashboard/events",
                    icon: Image,
                  },
                  {
                    name: "Events List",
                    path: "/dashboard/events-list",
                    icon: Calendar,
                  },
                  {
                    name: "Event Payments",
                    path: "/dashboard/event-payments",
                    icon: DollarSign,
                  },
                  {
                    name: "Participants",
                    path: "/dashboard/event-participants",
                    icon: Users,
                  },
                ],
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: CLIENT INQUIRIES */}
        {user && user.role === "admin" && (
          <div>
            {renderSectionHeader("Client Inquiries")}
            <div className="space-y-0.5">
              {renderDropdownGroup({
                title: "Enquiry Leads",
                icon: FileText,
                isOpen: enquiriesOpen,
                setIsOpen: setEnquiriesOpen,
                pathMatch: [
                  "/homec1",
                  "/homec2",
                  "/homec3",
                  "/bookings",
                ],
                items: [
                  {
                    name: "Gym Tour Bookings",
                    path: "/dashboard/bookings",
                    icon: BookOpen,
                  },
                  {
                    name: "Free Trial Form",
                    path: "/dashboard/homec1",
                    icon: FileText,
                  },
                  {
                    name: "Consultation Requests",
                    path: "/dashboard/homec2",
                    icon: Users,
                  },
                  {
                    name: "Contact Messages",
                    path: "/dashboard/homec3",
                    icon: MessageSquare,
                  },
                ],
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: PREFERENCES & SETTINGS */}
        <div>
          {renderSectionHeader("Preferences")}
          <div className="space-y-0.5">
            {renderSingleItem({
              to: "/dashboard/profile",
              name: "Profile Settings",
              icon: User,
            })}
            {renderSingleItem({
              to: "/dashboard/settings",
              name: "System Settings",
              icon: Settings,
            })}
          </div>
        </div>
      </div>

      {/* Footer Profile Snapshot & Logout */}
      <div className="p-2.5 border-t border-[var(--db-sidebar-border)] flex-shrink-0 bg-[var(--db-sidebar)] space-y-2">
        {sidebarOpen ? (
          <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
            theme === "dark"
              ? "bg-gradient-to-r from-white/[0.04] to-white/[0.015] border-white/[0.08] hover:border-[#e5ff00]/40 hover:shadow-[0_0_16px_rgba(229,255,0,0.12)] hover:bg-white/[0.06]"
              : "bg-gradient-to-r from-slate-50 to-slate-100/90 border-slate-200/90 hover:border-[#cbee00] hover:shadow-sm"
          }`}>
            <div className="flex items-center gap-2.5 min-w-0 group/profile cursor-pointer">
              <div className={`sidebar-icon-spring relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden shrink-0 transition-all ${
                theme === "dark"
                  ? "bg-gradient-to-tr from-[#e5ff00]/25 to-transparent border border-[#e5ff00]/40 group-hover/profile:scale-105 group-hover/profile:shadow-[0_0_14px_rgba(229,255,0,0.45)] group-hover/profile:border-[#e5ff00]"
                  : "bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-black/15 group-hover/profile:scale-105 group-hover/profile:shadow-[0_2px_10px_rgba(216,245,0,0.4)]"
              }`}>
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "Admin"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e5ff00] text-black font-black text-xs flex items-center justify-center rounded-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-[11.5px] font-bold truncate leading-tight transition-colors ${
                  theme === "dark"
                    ? "text-zinc-200 group-hover/profile:text-[#e5ff00]"
                    : "text-[var(--db-text)] group-hover/profile:text-[var(--db-accent-highlight)]"
                }`}>
                  {user?.name || "Admin"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className={`text-[9px] font-black uppercase tracking-wider ${
                    theme === "dark"
                      ? "text-[#e5ff00] bg-[#e5ff00]/15 px-1.5 py-0.5 rounded border border-[#e5ff00]/30 shadow-[0_0_8px_rgba(229,255,0,0.2)]"
                      : "text-black bg-[#e5ff00] px-1.5 py-0.5 rounded border border-black/10 shadow-xs"
                  }`}>
                    {user?.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out of session"
              className="group/logout relative p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all duration-300 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            >
              <LogOut
                size={15}
                className="transition-transform duration-300 group-hover/logout:-translate-x-0.5 group-hover/logout:scale-115"
              />
            </button>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col items-center">
            {/* Profile Avatar Icon with Tooltip */}
            <div className="relative group hover:z-50">
              <div className={`sidebar-icon-spring relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "border border-white/10 hover:border-[#e5ff00] hover:shadow-[0_0_16px_rgba(229,255,0,0.35)]"
                  : "border border-slate-200 hover:border-[#cbee00] hover:shadow-[0_2px_12px_rgba(216,245,0,0.35)]"
              }`}>
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "Admin"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e5ff00] text-black font-black text-xs flex items-center justify-center rounded-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 items-center">
                <div className={`relative px-3 py-1.5 rounded-xl border whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 ${
                  theme === "dark"
                    ? "bg-[#0b0c10]/95 border-white/15 shadow-2xl text-[11px] font-bold text-zinc-100"
                    : "bg-white border-slate-200 shadow-xl text-[11px] font-bold text-slate-900"
                }`}>
                  <p className="font-bold">{user?.name || "Admin"}</p>
                  <p className="text-[9px] text-[#e5ff00] uppercase font-black">{user?.role || "ADMIN"}</p>
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent ${
                    theme === "dark" ? "border-r-white/15" : "border-r-slate-200"
                  }`} />
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent ${
                    theme === "dark" ? "border-r-[#0b0c10]" : "border-r-white"
                  } mr-[-1px]`} />
                </div>
              </div>
            </div>

            {/* Logout Icon with Tooltip */}
            <div className="relative group hover:z-50">
              <button
                onClick={handleLogout}
                className="group/logout sidebar-icon-spring relative w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_16px_rgba(239,68,68,0.35)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer overflow-hidden"
              >
                <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <span className="absolute -inset-full bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover/logout:translate-x-full transition-transform duration-700 ease-out" />
                </span>
                <LogOut
                  size={16}
                  className="transition-transform duration-300 group-hover/logout:-translate-x-0.5 group-hover/logout:scale-115"
                />
              </button>
              <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 items-center">
                <div className="relative px-3 py-1.5 bg-red-950/95 border border-red-500/30 rounded-xl shadow-2xl text-[11px] font-bold text-red-300 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-red-500/30" />
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-red-950/95 mr-[-1px]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
