import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Settings,
  LogOut,
  X,
  CreditCard,
  DollarSign,
  Image,
  Calendar,
  User,
  Users,
  FileText,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Crown,
} from "lucide-react";
import logo from "../assets/images/logo-new.png";
import logo2 from "../assets/images/lightmode.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const [eventsOpen, setEventsOpen] = useState(() => {
    return (
      location.pathname.includes("/events") ||
      location.pathname.includes("/events-list") ||
      location.pathname.includes("/event-payments")
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

  useEffect(() => {
    if (
      location.pathname.includes("/events") ||
      location.pathname.includes("/events-list") ||
      location.pathname.includes("/event-payments")
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

  const baseMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Calendar", path: "/dashboard/calendar", icon: Calendar },
  ];

  const footerMenuItems = [
    {
      name: "Profile settings",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--db-sidebar)] border-r border-[var(--db-sidebar-border)] flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 transition-colors ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header with logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[var(--db-sidebar-border)] flex-shrink-0">
        <img
          src={theme === "light" ? logo2 : logo}
          alt="Box & Cross"
          className="w-[150px] object-contain"
        />
        <button
          className="lg:hidden text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Nav Links (Scrollable) */}
      <div className="flex-grow overflow-y-auto custom-scrollbar py-6">
        <nav className="px-4 space-y-2">
          {baseMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-lg shadow-[var(--db-accent-glow)]"
                      : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                  }`
                }
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}

          {/* Membership dropdown for Admin */}
          {user && user.role === "admin" && (
            <div className="space-y-1">
              <button
                onClick={() => setMembershipOpen(!membershipOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                  location.pathname.includes("/memberships") ||
                  location.pathname.includes("/payments")
                    ? "text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/5 border border-[var(--db-accent-highlight)]/20"
                    : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className={location.pathname.includes("/memberships") || location.pathname.includes("/payments") ? "text-[var(--db-accent-highlight)]" : ""} />
                  <span>Membership</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    membershipOpen ? "rotate-180 text-[var(--db-accent-highlight)]" : "text-[var(--db-text-muted)]"
                  }`}
                />
              </button>

              {membershipOpen && (
                <div className="relative pl-6 ml-6 mt-1 space-y-1 transition-all">
                  <div className="absolute left-[3px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-[var(--db-accent-highlight)] via-[var(--db-accent-highlight)]/40 to-transparent rounded-full" />

                  <NavLink
                    to="/dashboard/memberships"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <CreditCard size={14} />
                    Membership edit
                  </NavLink>

                  <NavLink
                    to="/dashboard/payments"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <DollarSign size={14} />
                    Payment details
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Offer Founders dropdown for Admin */}
          {user && user.role === "admin" && (
            <div className="space-y-1">
              <button
                onClick={() => setOfferFoundersOpen(!offerFoundersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                  location.pathname.includes("/founding-members") ||
                  location.pathname.includes("/founding-offer")
                    ? "text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/5 border border-[var(--db-accent-highlight)]/20"
                    : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <Crown size={18} className={location.pathname.includes("/founding-members") || location.pathname.includes("/founding-offer") ? "text-[var(--db-accent-highlight)]" : ""} />
                  <span>Offer Founders</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    offerFoundersOpen ? "rotate-180 text-[var(--db-accent-highlight)]" : "text-[var(--db-text-muted)]"
                  }`}
                />
              </button>

              {offerFoundersOpen && (
                <div className="relative pl-6 ml-6 mt-1 space-y-1 transition-all">
                  <div className="absolute left-[3px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-[var(--db-accent-highlight)] via-[var(--db-accent-highlight)]/40 to-transparent rounded-full" />

                  <NavLink
                    to="/dashboard/founding-offer"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Crown size={14} />
                    Offer details edit
                  </NavLink>
                  
                  <NavLink
                    to="/dashboard/founding-members"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Users size={14} />
                    Founding members
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Events dropdown for Admin */}
          {user && user.role === "admin" && (
            <div className="space-y-1">
              <button
                onClick={() => setEventsOpen(!eventsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                  location.pathname.includes("/events") ||
                  location.pathname.includes("/events-list") ||
                  location.pathname.includes("/event-payments")
                    ? "text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/5 border border-[var(--db-accent-highlight)]/20"
                    : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className={location.pathname.includes("/events") || location.pathname.includes("/events-list") || location.pathname.includes("/event-payments") ? "text-[var(--db-accent-highlight)]" : ""} />
                  <span>Events</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    eventsOpen ? "rotate-180 text-[var(--db-accent-highlight)]" : "text-[var(--db-text-muted)]"
                  }`}
                />
              </button>

              {eventsOpen && (
                <div className="relative pl-6 ml-6 mt-1 space-y-1 transition-all">
                  <div className="absolute left-[3px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-[var(--db-accent-highlight)] via-[var(--db-accent-highlight)]/40 to-transparent rounded-full" />

                  <NavLink
                    to="/dashboard/events"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Image size={14} />
                    Event banners
                  </NavLink>

                  <NavLink
                    to="/dashboard/events-list"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Calendar size={14} />
                    Events list
                  </NavLink>

                  <NavLink
                    to="/dashboard/event-payments"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <DollarSign size={14} />
                    Event payments
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Website Enquiry form dropdown for Admin */}
          {user && user.role === "admin" && (
            <div className="space-y-1">
              <button
                onClick={() => setEnquiriesOpen(!enquiriesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                  location.pathname.includes("/homec1") ||
                  location.pathname.includes("/homec2") ||
                  location.pathname.includes("/homec3") ||
                  location.pathname.includes("/bookings")
                    ? "text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/5 border border-[var(--db-accent-highlight)]/20"
                    : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className={location.pathname.includes("/homec1") || location.pathname.includes("/homec2") || location.pathname.includes("/homec3") || location.pathname.includes("/bookings") ? "text-[var(--db-accent-highlight)]" : ""} />
                  <span>Enquiry forms</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    enquiriesOpen ? "rotate-180 text-[var(--db-accent-highlight)]" : "text-[var(--db-text-muted)]"
                  }`}
                />
              </button>

              {enquiriesOpen && (
                <div className="relative pl-6 ml-6 mt-1 space-y-1 transition-all">
                  <div className="absolute left-[3px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-[var(--db-accent-highlight)] via-[var(--db-accent-highlight)]/40 to-transparent rounded-full" />

                  <NavLink
                    to="/dashboard/bookings"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <BookOpen size={14} />
                    Book gym free tour
                  </NavLink>

                  <NavLink
                    to="/dashboard/homec1"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <FileText size={14} />
                    Home/trialform
                  </NavLink>

                  <NavLink
                    to="/dashboard/homec2"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Users size={14} />
                    Consult us form
                  </NavLink>

                  <NavLink
                    to="/dashboard/homec3"
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                          : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                      }`
                    }
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <MessageSquare size={14} />
                    Contact Form
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Settings items */}
          {footerMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-lg shadow-[var(--db-accent-glow)]"
                      : "text-[var(--db-sidebar-link-text)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                  }`
                }
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer logout */}
      <div className="p-4 border-t border-[var(--db-sidebar-border)] flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wider text-red-400 bg-[var(--db-sidebar-link-hover)] hover:text-red-400 transition-all cursor-pointer"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
