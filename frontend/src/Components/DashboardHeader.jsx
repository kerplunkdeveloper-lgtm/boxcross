import React from "react";
import { Menu, User, Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const DashboardHeader = ({ setSidebarOpen, user }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Resolve current active title based on path
  let activeTitle = "Dashboard";
  if (location.pathname.includes("/bookings")) {
    activeTitle = "Enquiry Bookings";
  } else if (location.pathname.includes("/memberships")) {
    activeTitle = "Membership Edit";
  } else if (location.pathname.includes("/payments")) {
    activeTitle = "Payment Details";
  } else if (location.pathname.includes("/events-list")) {
    activeTitle = "Events List";
  } else if (location.pathname.includes("/events")) {
    activeTitle = "Event Banners";
  } else if (location.pathname.includes("/event-payments")) {
    activeTitle = "Event Payments";
  } else if (location.pathname.includes("/profile")) {
    activeTitle = "Profile Settings";
  } else if (location.pathname.includes("/settings")) {
    activeTitle = "Settings";
  }

  return (
    <header className="h-20 bg-[var(--db-header)] border-b border-[var(--db-header-border)] px-6 md:px-8 flex items-center justify-between flex-shrink-0 transition-colors">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-[var(--db-text-title)]">
          {activeTitle}
        </h2>
      </div>

      {/* Action panel & User info */}
      <div className="flex items-center gap-5">
        {/* Theme Switcher Toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] transition-all cursor-pointer"
          title={theme === "dark" ? "Toggle Light Mode" : "Toggle Dark Mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Vertical divider line */}
        <span className="h-6 w-[1px] bg-[var(--db-card-border)] hidden sm:block" />

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-[var(--db-text)]">{user.name}</p>
            <p className="text-[10px] text-[var(--db-accent-highlight)] font-semibold uppercase tracking-widest">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden">
            {user && user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-[var(--db-accent-highlight)]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
