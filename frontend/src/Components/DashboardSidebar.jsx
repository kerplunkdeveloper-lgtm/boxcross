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
  ShieldCheck,
  ClipboardCheck,
  Activity,
  ClipboardList,
  Fingerprint,
  Swords,
  Trophy,
  Dumbbell,
  Timer,
  Zap,
  Smile,
  Target,
  Flame,
} from "lucide-react";
import logo from "../assets/images/logo-new.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  user: propUser,
}) => {
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
      // Note: /memfound is intentionally excluded — it belongs only to offerFoundersOpen
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
      location.pathname.includes("/memfound") ||
      location.pathname.includes("/founder-plans") ||
      location.pathname.includes("/founderplans") ||
      location.pathname.includes("/founder-payments") ||
      location.pathname.includes("/founderpayment")
    );
  });

  const [clubOpen, setClubOpen] = useState(() => {
    return (
      location.pathname.includes("/fight-club") ||
      location.pathname.includes("/performance-boxing") ||
      location.pathname.includes("/strength-lab") ||
      location.pathname.includes("/hyrox-lab") ||
      location.pathname.includes("/hybrid-performance") ||
      location.pathname.includes("/athlete-performance-profile") ||
      location.pathname.includes("/junior-athlete-profile")
    );
  });

  // Single combined useEffect replaces 4 separate ones watching the same dep
  useEffect(() => {
    const p = location.pathname;
    if (
      p.includes("/events") ||
      p.includes("/events-list") ||
      p.includes("/event-payments") ||
      p.includes("/event-participants")
    ) setEventsOpen(true);
    if (
      p.includes("/homec1") ||
      p.includes("/homec2") ||
      p.includes("/homec3") ||
      p.includes("/bookings")
      // /memfound excluded — only opens offerFoundersOpen
    ) setEnquiriesOpen(true);
    if (
      p.includes("/memberships") ||
      p.includes("/payments")
    ) setMembershipOpen(true);
    if (
      p.includes("/memfound") ||
      p.includes("/founder-plans") ||
      p.includes("/founderplans") ||
      p.includes("/founder-payments") ||
      p.includes("/founderpayment")
    ) setOfferFoundersOpen(true);
    if (
      p.includes("/fight-club") ||
      p.includes("/performance-boxing") ||
      p.includes("/strength-lab") ||
      p.includes("/hyrox-lab") ||
      p.includes("/hybrid-performance") ||
      p.includes("/athlete-performance-profile") ||
      p.includes("/junior-athlete-profile")
    ) setClubOpen(true);
  }, [location.pathname]);

  // Style helpers for items
  const getItemClass = (isActive) => {
    if (isActive) {
      return "relative bg-gradient-to-r from-[#ccf141]/20 via-[#ccf141]/12 to-[#ccf141]/5 text-[#ccf141] border border-[#ccf141]/40 shadow-[0_0_16px_rgba(204,241,65,0.22),inset_0_1px_1px_rgba(255,255,255,0.25)] font-semibold backdrop-blur-md";
    }
    return "text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent transition-colors";
  };

  const getSubItemClass = (isActive) => {
    if (isActive) {
      return "bg-[#ccf141]/20 text-[#ccf141] border border-[#ccf141]/40 shadow-[0_0_12px_rgba(204,241,65,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold backdrop-blur-sm";
    }
    return "text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-transparent transition-colors";
  };

  const getTriggerClass = (hasActive) => {
    if (hasActive) {
      return "text-[#ccf141] bg-[#ccf141]/10 border border-[#ccf141]/25 font-semibold backdrop-blur-sm";
    }
    return "text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent transition-colors";
  };

  // Helper to render single nav item with tooltip for collapsed state
  const renderSingleItem = ({
    to,
    name,
    icon: Icon,
    end = false,
    badge = null,
  }) => {
    return (
      <div key={to} className="relative group hover:z-50">
        <NavLink
          to={to}
          end={end}
          onClick={closeSidebarOnMobile}
          className={({ isActive }) =>
            sidebarOpen
              ? `w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium tracking-normal transition-all duration-150 cursor-pointer ${getItemClass(
                  isActive,
                )}`
              : `w-9 h-9 mx-auto flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${getItemClass(
                  isActive,
                )}`
          }
        >
          {({ isActive }) => (
            <>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={15}
                      className={`shrink-0 transition-colors ${
                        isActive ? "text-[#ccf141]" : "text-zinc-400 group-hover:text-white"
                      }`}
                    />
                    <span className="truncate">{name}</span>
                  </div>
                  {badge && (
                    <span className="text-[8px] font-semibold uppercase px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {badge}
                    </span>
                  )}
                </>
              ) : (
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-[#ccf141]" : "text-zinc-400 group-hover:text-white"
                  }`}
                />
              )}
            </>
          )}
        </NavLink>

        {/* Hover Tooltip when sidebar is collapsed (Desktop only) */}
        {!sidebarOpen && (
          <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
            <div className="relative px-2.5 py-1.5 bg-[#09090b] border border-white/15 rounded-lg shadow-2xl flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
              <span className="text-[11.5px] font-bold text-white">
                {name}
              </span>
              {badge && (
                <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {badge}
                </span>
              )}
              {/* Tooltip arrow pointer */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-white/15" />
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[#09090b] mr-[-1px]" />
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
    const hasActiveChild = pathMatch.some((path) =>
      location.pathname.includes(path),
    );

    return (
      <div key={title} className="relative group hover:z-50">
        {sidebarOpen ? (
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium tracking-normal transition-all duration-150 cursor-pointer ${getTriggerClass(
                hasActiveChild,
              )}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  size={15}
                  className={`shrink-0 transition-colors ${
                    hasActiveChild ? "text-[#ccf141]" : "text-zinc-400 group-hover:text-white"
                  }`}
                />
                <span className="truncate">{title}</span>
              </div>
              <ChevronDown
                size={13}
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="ml-2.5 pl-2.5 border-l border-white/10 space-y-0.5 my-1">
                {items.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={closeSidebarOnMobile}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium tracking-wide transition-all duration-150 cursor-pointer ${getSubItemClass(
                          isActive,
                        )}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <SubIcon
                            size={13}
                            className={`shrink-0 transition-colors ${
                              isActive ? "text-[#ccf141]" : "text-zinc-400 group-hover:text-white"
                            }`}
                          />
                          <span className="truncate">{sub.name}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[8px] font-semibold uppercase px-1 py-0.2 rounded bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30">
                              {sub.badge}
                            </span>
                          )}
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
          <div className="flex justify-center">
            <button
              className={`w-9 h-9 mx-auto flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${getTriggerClass(
                hasActiveChild,
              )}`}
            >
              <Icon
                size={16}
                className={`shrink-0 ${
                  hasActiveChild ? "text-[#ccf141]" : "text-zinc-400"
                }`}
              />
            </button>

            {/* Flyout Submenu Popover on Hover (Desktop only) */}
            <div className="hidden lg:group-hover:block absolute left-full top-0 pl-2.5 z-50">
              <div className="w-52 bg-[#09090b]/95 border border-white/15 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.65)] p-2 space-y-1 backdrop-blur-xl">
                {/* Popover Header */}
                <div className="px-2 py-1 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    {title}
                  </span>
                  <span className="text-[9px] font-semibold text-[#ccf141]">
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
                        `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${getSubItemClass(
                          isActive,
                        )}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <SubIcon
                            size={13}
                            className={`shrink-0 ${
                              isActive ? "text-[#ccf141]" : "text-zinc-400"
                            }`}
                          />
                          <span className="truncate">{sub.name}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[8px] font-semibold uppercase px-1 py-0.2 rounded bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30">
                              {sub.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

                {/* Flyout pointer arrow */}
                <div className="absolute right-full top-3 border-[6px] border-transparent border-r-white/15" />
                <div className="absolute right-full top-3 border-[5px] border-transparent border-r-[#09090b] mr-[-1px]" />
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
        <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between select-none">
          <span>{title}</span>
        </div>
      );
    }
    return (
      <div className="h-[1px] bg-white/10 my-2 mx-1.5" />
    );
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#000000] border-r border-white/10 flex flex-col justify-between transform transition-all duration-300 select-none shadow-2xl lg:shadow-none ${
        sidebarOpen
          ? "translate-x-0 w-[264px] sm:w-[270px] lg:w-[232px]"
          : "-translate-x-full lg:w-[68px] lg:translate-x-0"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-14 flex items-center border-b border-white/10 flex-shrink-0 bg-[#000000] ${
          sidebarOpen ? "justify-between px-3.5" : "justify-center px-2"
        }`}
      >
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Box & Cross"
                className="w-[105px] h-7 object-contain"
              />
              {isAdmin && (
                <span className="text-[9px] text-black font-black px-2 py-0.5 rounded-md bg-[#ccf141] tracking-wider shadow-sm select-none shrink-0">
                  <span style={{ fontFamily: "var(--admin-font, 'Poppins', sans-serif)" }}>
                    ADMIN
                  </span>
                </span>
              )}
            </div>
            <button
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <div className="relative group">
            <div
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 rounded-xl bg-[#ccf141] text-black flex items-center justify-center font-black text-xs shadow-sm cursor-pointer"
            >
              BX
            </div>
            {/* Tooltip on logo */}
            <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
              <div className="relative px-2.5 py-1 bg-[#09090b] border border-white/15 rounded-lg shadow-xl text-[11px] font-bold text-white whitespace-nowrap">
                Box & Cross Admin
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-white/15" />
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
        {isAdmin && (
          <div>
            {renderSectionHeader("Management")}
            <div className="space-y-0.5">
              {/* User Management */}
              {renderSingleItem({
                to: "/dashboard/user-management",
                name: "User Management",
                icon: Users,
              })}

              {/* Attendance & Biometrics */}
              {renderSingleItem({
                to: "/dashboard/attendance",
                name: "User Attendance",
                icon: Fingerprint,
                badge: "LIVE",
              })}

              {/* Club Accordion / Flyout */}
              {renderDropdownGroup({
                title: "Club",
                icon: Flame,
                isOpen: clubOpen,
                setIsOpen: setClubOpen,
                pathMatch: [
                  "/fight-club",
                  "/performance-boxing",
                  "/strength-lab",
                  "/hyrox-lab",
                  "/hybrid-performance",
                  "/athlete-performance-profile",
                  "/junior-athlete-profile",
                ],
                items: [
                  {
                    name: "Fight Club",
                    path: "/dashboard/fight-club",
                    icon: Swords,
                  },
                  {
                    name: "Performance Boxing",
                    path: "/dashboard/performance-boxing",
                    icon: Trophy,
                    badge: "ELITE",
                  },
                  {
                    name: "Strength Lab",
                    path: "/dashboard/strength-lab",
                    icon: Dumbbell,
                  },
                  {
                    name: "HyroxLab",
                    path: "/dashboard/hyrox-lab",
                    icon: Timer,
                  },
                  {
                    name: "HybridPerformance",
                    path: "/dashboard/hybrid-performance",
                    icon: Zap,
                  },
                  {
                    name: "Athlete Profile",
                    path: "/dashboard/athlete-performance-profile",
                    icon: ClipboardList,
                  },
                  {
                    name: "Junior Profile",
                    path: "/dashboard/junior-athlete-profile",
                    icon: Smile,
                  },
                ],
              })}

              {/* Goals & Readiness */}
              {renderSingleItem({
                to: "/dashboard/goals-readiness",
                name: "Goals & Readiness",
                icon: ClipboardCheck,
              })}

              {/* Entry Baseline */}
              {renderSingleItem({
                to: "/dashboard/entry-baseline",
                name: "Entry Baseline",
                icon: Target,
              })}

              {/* AI Body Analysis */}
              {renderSingleItem({
                to: "/dashboard/ai-body-analysis",
                name: "AI Body Analysis",
                icon: Activity,
                badge: "AI",
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

              {/* Founder Member Club Accordion / Flyout */}
              {renderDropdownGroup({
                title: "Founder Member Club",
                icon: Crown,
                isOpen: offerFoundersOpen,
                setIsOpen: setOfferFoundersOpen,
                pathMatch: [
                  "/founder-plans",
                  "/founderplans",
                  "/founder-payments",
                  "/founderpayment",
                  "/memfound",
                ],
                items: [
                  {
                    name: "Founder Plans",
                    path: "/dashboard/founder-plans",
                    icon: Crown,
                  },
                  {
                    name: "Founder Payment History",
                    path: "/dashboard/founder-payments",
                    icon: DollarSign,
                  },
                  {
                    name: "Memfound Registrations",
                    path: "/dashboard/memfound",
                    icon: Sparkles,
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
        {isAdmin && (
          <div>
            {renderSectionHeader("Client Inquiries")}
            <div className="space-y-0.5">
              {renderDropdownGroup({
                title: "Enquiry Leads",
                icon: FileText,
                isOpen: enquiriesOpen,
                setIsOpen: setEnquiriesOpen,
                pathMatch: ["/homec1", "/homec2", "/homec3", "/bookings"],
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
      <div className="p-2 border-t border-white/10 flex-shrink-0 bg-[#000000] space-y-2">
        {sidebarOpen ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ccf141]/20 to-transparent border border-[#ccf141]/40 flex items-center justify-center overflow-hidden shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "Admin"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-[#ccf141] text-black font-black text-xs flex items-center justify-center rounded-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11.5px] font-bold text-white truncate leading-tight">
                  {user?.name || "Admin"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-[#ccf141] uppercase tracking-wider">
                    {(user?.role?.toLowerCase() === "athlete" ? "USER" : user?.role) || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out of session"
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 flex flex-col items-center">
            {/* Profile Avatar Icon with Tooltip */}
            <div className="relative group hover:z-50">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#ccf141]/40 flex items-center justify-center cursor-pointer">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || "Admin"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-[#ccf141] text-black font-black text-xs flex items-center justify-center rounded-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
                <div className="relative px-2.5 py-1.5 bg-[#09090b] border border-white/15 rounded-lg shadow-xl text-[11px] font-bold text-white whitespace-nowrap">
                  <p className="font-semibold text-white">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[9px] text-[#ccf141] uppercase font-semibold tracking-wider">
                    {(user?.role?.toLowerCase() === "athlete" ? "USER" : user?.role) || "ADMIN"}
                  </p>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-white/15" />
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-[#09090b] mr-[-1px]" />
                </div>
              </div>
            </div>

            {/* Logout Icon with Tooltip */}
            <div className="relative group hover:z-50">
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
              </button>
              <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
                <div className="relative px-2.5 py-1 bg-red-950/90 border border-red-500/30 rounded-lg shadow-xl text-[11px] font-bold text-red-300 whitespace-nowrap">
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-red-500/30" />
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
