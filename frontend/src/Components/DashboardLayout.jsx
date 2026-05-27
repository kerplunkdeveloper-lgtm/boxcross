import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { toast } from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <DashboardHeader 
          setSidebarOpen={setSidebarOpen} 
          user={user} 
        />

        {/* Dynamic Nested Route content */}
        <main className="flex-grow bg-[#050505] relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
