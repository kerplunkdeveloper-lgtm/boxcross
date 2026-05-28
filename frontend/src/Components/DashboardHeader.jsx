import React from "react";
import { Menu, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const DashboardHeader = ({ setSidebarOpen, user }) => {
  const location = useLocation();
  
  // Resolve current active title based on path
  let activeTitle = "Overview";
  if (location.pathname.includes("/bookings")) {
    activeTitle = "Bookings";
  } else if (location.pathname.includes("/settings")) {
    activeTitle = "Settings";
  }

  return (
    <header className="h-20 bg-[#0a0a0a] border-b border-white/5 px-6 md:px-8 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white">
          {activeTitle}
        </h2>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-bold text-gray-300">{user.name}</p>
          <p className="text-[10px] text-[#defb02] font-semibold uppercase tracking-widest">{user.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#defb02]/20 to-transparent border border-[#defb02]/40 flex items-center justify-center overflow-hidden">
          {user && user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-[#defb02]" />
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
