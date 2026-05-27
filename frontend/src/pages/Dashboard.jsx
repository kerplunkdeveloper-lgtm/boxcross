import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut, Home, BookOpen, Settings, Menu, X
} from "lucide-react";
import logo from "../assets/images/logo.png";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Home");

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/");
    }
  };

  if (!user) return null;

  const menuItems = [
    { name: "Home", icon: Home },
    { name: "Bookings", icon: BookOpen },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Logo */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <img src={logo} alt="Box & Cross" className="h-8 w-auto object-contain" />
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Menu Items (3 Menus) */}
          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#defb02] text-black shadow-lg shadow-[#defb02]/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
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

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        
        {/* 2. HEADER */}
        <header className="h-20 bg-[#0a0a0a] border-b border-white/5 px-6 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              {activeMenu}
            </h2>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-300">{user.name}</p>
              <p className="text-[10px] text-[#defb02] font-semibold uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#defb02]/20 to-transparent border border-[#defb02]/40 flex items-center justify-center">
              <User size={20} className="text-[#defb02]" />
            </div>
          </div>
        </header>

        {/* 3. MAIN CONTENT */}
        <main className="flex-grow p-6 md:p-8 flex items-center justify-center bg-[#050505]">
          <div className="w-full min-h-[300px] bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex items-center justify-center shadow-inner relative overflow-hidden">
            {/* Background Graphic elements */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#defb02]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="text-center z-10">
              <p className="text-5xl font-black uppercase tracking-widest text-[#defb02] mb-2" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                hello
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Tab: {activeMenu} content area
              </p>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default Dashboard;
