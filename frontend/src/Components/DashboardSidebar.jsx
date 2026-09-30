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
} from "lucide-react";
import logo from "../assets/images/logo-new.png";
import logo2 from "../assets/images/lightmode.png";
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

  // Style helpers for items
  const getItemClass = (isActive) => {
    if (isActive) {
      return theme === "dark"
        ? "bg-[#ccf141]/12 text-[#ccf141] border border-[#ccf141]/30 shadow-[0_0_12px_rgba(229,255,0,0.1)] font-semibold"
        : "bg-slate-900 text-white font-semibold shadow-sm";
    }
    return "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]";
  };

  const getSubItemClass = (isActive) => {
    if (isActive) {
      return theme === "dark"
        ? "bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/35 font-semibold shadow-sm"
        : "bg-slate-800 text-white font-semibold shadow-sm";
    }
    return "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]";
  };

  const getTriggerClass = (hasActive) => {
    if (hasActive) {
      return theme === "dark"
        ? "text-[#ccf141] bg-[#ccf141]/8 border border-[#ccf141]/20 font-semibold"
        : "text-slate-900 bg-slate-100 border border-slate-200 font-semibold";
    }
    return "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]";
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
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{name}</span>
              </div>
              {badge && (
                <span className="text-[8px] font-semibold uppercase px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {badge}
                </span>
              )}
            </>
          ) : (
            <Icon size={16} className="shrink-0" />
          )}
        </NavLink>

        {/* Hover Tooltip when sidebar is collapsed (Desktop only) */}
        {!sidebarOpen && (
          <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
            <div className="relative px-2.5 py-1.5 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-lg shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[11.5px] font-bold text-[var(--db-text)]">
                {name}
              </span>
              {badge && (
                <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {badge}
                </span>
              )}
              {/* Tooltip arrow pointer */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[var(--db-card-border)]" />
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[var(--db-card)] mr-[-1px]" />
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
                <Icon size={15} className="shrink-0" />
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
              <div className="ml-2.5 pl-2.5 border-l border-[var(--db-card-border)] space-y-0.5 my-1">
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
                      <SubIcon size={13} className="shrink-0" />
                      <span className="truncate">{sub.name}</span>
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
              <Icon size={16} className="shrink-0" />
            </button>

            {/* Flyout Submenu Popover on Hover (Desktop only) */}
            <div className="hidden lg:group-hover:block absolute left-full top-0 pl-2.5 z-50">
              <div className="w-52 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] p-2 space-y-1 backdrop-blur-md">
                {/* Popover Header */}
                <div className="px-2 py-1 border-b border-[var(--db-card-border)] mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--db-text-muted)]">
                    {title}
                  </span>
                  <span className="text-[9px] font-semibold text-[var(--db-accent-highlight)]">
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
                      <SubIcon size={13} className="shrink-0" />
                      <span className="truncate">{sub.name}</span>
                    </NavLink>
                  );
                })}

                {/* Flyout pointer arrow */}
                <div className="absolute right-full top-3 border-[6px] border-transparent border-r-[var(--db-card-border)]" />
                <div className="absolute right-full top-3 border-[5px] border-transparent border-r-[var(--db-card)] mr-[-1px]" />
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
        <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--db-text-muted)]/70 flex items-center justify-between select-none">
          <span>{title}</span>
        </div>
      );
    }
    return (
      <div className="h-[1px] bg-[var(--db-card-border)]/60 my-2 mx-1.5" />
    );
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-[var(--db-sidebar)] border-r border-[var(--db-sidebar-border)] flex flex-col justify-between transform transition-all duration-300 select-none shadow-2xl lg:shadow-none ${
        sidebarOpen
          ? "translate-x-0 w-[264px] sm:w-[270px] lg:w-[232px]"
          : "-translate-x-full lg:w-[68px] lg:translate-x-0"
      }`}
    >
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
                <span className="text-[9px] text-[var(--db-accent-text)] font-black px-2 py-0.5 rounded-md bg-[var(--db-accent)] tracking-wider shadow-sm select-none shrink-0">
                  <span style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                    ADMIN
                  </span>
                </span>
              )}
            </div>
            <button
              className="lg:hidden p-2 rounded-xl text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-colors cursor-pointer"
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
              className="w-8 h-8 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] flex items-center justify-center font-black text-xs shadow-sm cursor-pointer"
            >
              BX
            </div>
            {/* Tooltip on logo */}
            <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2.5 z-50 items-center">
              <div className="relative px-2.5 py-1 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-lg shadow-xl text-[11px] font-bold text-[var(--db-text)] whitespace-nowrap">
                Box & Cross Admin
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[var(--db-card-border)]" />
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

              {/* Attendance & Biometrics */}
              {renderSingleItem({
                to: "/dashboard/attendance",
                name: "Athlete Attendance",
                icon: Fingerprint,
                badge: "LIVE",
              })}


              {/* Fight Club */}
              {renderSingleItem({
                to: "/dashboard/fight-club",
                name: "Fight Club",
                icon: Swords,
              })}

              {/* Performance Boxing */}
              {renderSingleItem({
                to: "/dashboard/performance-boxing",
                name: "Performance Boxing",
                icon: Trophy,
                badge: "ELITE"
              })}

              {/* Strength Lab */}
              {renderSingleItem({
                to: "/dashboard/strength-lab",
                name: "Strength Lab",
                icon: Dumbbell,
              })}

              {/* Hyrox Lab */}
              {renderSingleItem({
                to: "/dashboard/hyrox-lab",
                name: "Hyrox Lab",
                icon: Timer,
              })}

              {/* Hybrid Performance */}
              {renderSingleItem({
                to: "/dashboard/hybrid-performance",
                name: "Hybrid Performance",
                icon: Zap,
              })}

              {/* Athlete Performance Profile */}
              {renderSingleItem({
                to: "/dashboard/athlete-performance-profile",
                name: "Athlete Profile",
                icon: ClipboardList,
              })}

              {/* Junior Athlete Profile */}
              {renderSingleItem({
                to: "/dashboard/junior-athlete-profile",
                name: "Junior Profile",
                icon: Smile,
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
      <div className="p-2 border-t border-[var(--db-sidebar-border)] flex-shrink-0 bg-[var(--db-sidebar)] space-y-2">
        {sidebarOpen ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden shrink-0">
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
                <p className="text-[11.5px] font-bold text-[var(--db-text)] truncate leading-tight">
                  {user?.name || "Admin"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-[var(--db-accent-highlight)] uppercase tracking-wider">
                    {user?.role || "ADMIN"}
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
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-[var(--db-accent-highlight)]/30 flex items-center justify-center cursor-pointer">
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
                <div className="relative px-2.5 py-1.5 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-lg shadow-xl text-[11px] font-bold text-[var(--db-text)] whitespace-nowrap">
                  <p className="font-semibold text-[var(--db-text)]">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[9px] text-[var(--db-accent-highlight)] uppercase font-semibold tracking-wider">
                    {user?.role || "ADMIN"}
                  </p>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[var(--db-card-border)]" />
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-[var(--db-card)] mr-[-1px]" />
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
