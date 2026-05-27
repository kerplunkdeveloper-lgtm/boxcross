import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Settings, LogOut, X, CreditCard, DollarSign } from "lucide-react";
import logo from "../assets/images/logo.png";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: Home },
    { name: "Bookings", path: "/dashboard/bookings", icon: BookOpen },
    { name: "Memberships", path: "/dashboard/memberships", icon: CreditCard },
    { name: "Payment Details", path: "/dashboard/payments", icon: DollarSign },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        {/* Header with logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <img src={logo} alt="Box & Cross" className="h-8 w-auto object-contain" />
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Nav Links */}
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#defb02] text-black shadow-lg shadow-[#defb02]/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
                style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
