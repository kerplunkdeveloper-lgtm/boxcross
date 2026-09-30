import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import DashboardSidebar from "./DashboardSidebar";
import { Helmet } from 'react-helmet-async'
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success("Logged out successfully.");
      navigate("/");
    } else {
      toast.error(res.message || "Failed to log out.");
    }
  };

  if (!user) return null;

  return (
    <div 
      style={{ fontFamily: "var(--admin-font, 'Plus Jakarta Sans', 'Inter', sans-serif)" }}
      className={`h-screen flex overflow-hidden ${theme === 'dark' ? 'dashboard-dark' : 'dashboard-light'} bg-[var(--db-bg)] text-[var(--db-text)]`}
    >
      {/* Sidebar */}
      <Helmet>
      <title>Dashboard | Box &amp; Cross</title>
      <meta name="description" content="Dashboard | Box &amp; Cross" />
      <meta name="keywords" content="Box &amp; Cross, Dashboard" />
      
    </Helmet>
      <DashboardSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleLogout={handleLogout}
        user={user} 
      />

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <DashboardHeader 
          setSidebarOpen={setSidebarOpen} 
          sidebarOpen={sidebarOpen}
          user={user} 
        />

        {/* Dynamic Nested Route content - independent scroll with ambient depth */}
        <main className="flex-grow overflow-y-auto bg-[var(--db-bg)] relative custom-scrollbar">
          {theme === "dark" && (
            <div 
              className="pointer-events-none absolute top-0 left-0 right-0 h-80 opacity-40 bg-[radial-gradient(ellipse_60%_35%_at_50%_0%,rgba(229,255,0,0.06),transparent_75%)]" 
              aria-hidden="true"
            />
          )}
          <div className="relative z-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
