import React from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import logo from "../assets/images/logo.png";
import logo2 from "../assets/images/lightmode.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Calendar", path: "/dashboard/calendar", icon: Calendar },
    { name: "Enquiry members", path: "/dashboard/bookings", icon: BookOpen },
    {
      name: "Membership edit",
      path: "/dashboard/memberships",
      icon: CreditCard,
    },
    { name: "Payment details", path: "/dashboard/payments", icon: DollarSign },
  ];

  if (user && user.role === "admin") {
    menuItems.push({
      name: "Event banners",
      path: "/dashboard/events",
      icon: Image,
    });
    menuItems.push({
      name: "Events list",
      path: "/dashboard/events-list",
      icon: Calendar,
    });
    menuItems.push({
      name: "Event payments",
      path: "/dashboard/event-payments",
      icon: DollarSign,
    });
    menuItems.push({
      name: "Home/trialform ",
      path: "/dashboard/homec1",
      icon: FileText,
    });
    menuItems.push({
      name: "Consult us form ",
      path: "/dashboard/homec2",
      icon: Users,
    });
    menuItems.push({
      name: "Contact Form",
      path: "/dashboard/homec3",
      icon: MessageSquare,
    });
  }

  // Keep these at the very end of the list
  menuItems.push({
    name: "Profile settings",
    path: "/dashboard/profile",
    icon: User,
  });
  menuItems.push({
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  });

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
          {menuItems.map((item) => {
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
        </nav>
      </div>

      {/* Footer logout */}
      <div className="p-4 border-t border-[var(--db-sidebar-border)] flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
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
