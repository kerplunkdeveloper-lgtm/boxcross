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
    <div className={`h-screen font-['Poppins'] flex overflow-hidden ${theme === 'dark' ? 'dashboard-dark' : 'dashboard-light'} bg-[var(--db-bg)] text-[var(--db-text)]`}>
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
      />

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader 
          setSidebarOpen={setSidebarOpen} 
          user={user} 
        />

        {/* Dynamic Nested Route content - independent scroll */}
        <main className="flex-grow overflow-y-auto bg-[var(--db-bg)] relative custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
