import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  QrCode,
  Lock,
  LogOut,
  ChevronDown,
  Shield,
  Copy,
  Check,
  Sparkles,
  Clock,
  ExternalLink,
  User,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AthleteHeader = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  athlete,
  impersonatorAdmin,
  handleLogout,
  handleExitImpersonation,
  setIsPasswordModalOpen,
  setShowQR,
  copiedId,
  handleCopyMemberId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate live arena open/closed status based on current time
  const [arenaStatus, setArenaStatus] = useState({
    isOpen: true,
    message: "Arena Open",
    session: "Morning / Evening",
  });

  useEffect(() => {
    const checkArenaStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;

      // Arena Hours: Morning 05:30 to 12:00, Evening 16:30 to 22:00
      const isMorning = currentTime >= 5.5 && currentTime < 12.0;
      const isEvening = currentTime >= 16.5 && currentTime < 22.0;

      if (isMorning) {
        setArenaStatus({
          isOpen: true,
          message: "Arena Open",
          session: "Morning Session (Closes 12 PM)",
        });
      } else if (isEvening) {
        setArenaStatus({
          isOpen: true,
          message: "Arena Open",
          session: "Evening Session (Closes 10 PM)",
        });
      } else if (currentTime < 5.5) {
        setArenaStatus({
          isOpen: false,
          message: "Arena Opens 05:30 AM",
          session: "Early Morning Recovery",
        });
      } else if (currentTime >= 12.0 && currentTime < 16.5) {
        setArenaStatus({
          isOpen: false,
          message: "Arena Reopens 04:30 PM",
          session: "Mid-day Sanitation & Rest",
        });
      } else {
        setArenaStatus({
          isOpen: false,
          message: "Arena Closed for Night",
          session: "Reopens 05:30 AM Tomorrow",
        });
      }
    };

    checkArenaStatus();
    const interval = setInterval(checkArenaStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const tabTitles = {
    overview: "Digital Pass & Performance Hub",
    coach: "My Coach & Training Schedule",
    assessments: "Fitness Benchmarks & Assessments",
    attendance: "Attendance & Biometric Turnstile Logs",
    arena: "Arena Zones, Equipment & Hours",
    profile: "Athlete Profile & Security",
  };

  return (
    <header
      style={{
        fontFamily: "var(--admin-font, 'Plus Jakarta Sans', 'Inter', sans-serif)",
      }}
      className="sticky top-0 z-30 h-16 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Drawer Toggle & Active Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white bg-white/5 border border-white/10 transition-colors cursor-pointer"
          title="Open Navigation"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>Box & Cross</span>
            <span>/</span>
            <span className="text-[#ccf141]">Athlete Portal</span>
          </div>
          <h1
            className="text-sm sm:text-base font-black uppercase text-white truncate tracking-tight"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            {tabTitles[activeTab] || "Athlete Dashboard"}
          </h1>
        </div>
      </div>

      {/* Center: Live Arena Operating Status Pill (Desktop only) */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            arenaStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        <span className="font-bold text-white text-[11px]">
          {arenaStatus.message}
        </span>
        <span className="text-[10px] text-zinc-400 font-medium">
          • {arenaStatus.session}
        </span>
      </div>

      {/* Right: Quick Pass QR, Password, & User Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Quick QR Pass Button */}
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#ccf141] text-black hover:bg-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ccf141]/10 cursor-pointer"
          title="Open Scannable Entry Pass"
        >
          <QrCode size={14} />
          <span className="hidden sm:inline">Pass QR</span>
        </button>

        {/* Quick Password Lock (Hidden on small mobile) */}
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          title="Change Password"
        >
          <Lock size={13} className="text-[#ccf141]" />
          <span>Security</span>
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ccf141] to-lime-600 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-[6.5px] bg-black flex items-center justify-center font-black text-xs text-[#ccf141]">
                {athlete?.athleteName
                  ? athlete.athleteName.charAt(0).toUpperCase()
                  : "A"}
              </div>
            </div>

            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-black uppercase text-white truncate max-w-[110px] leading-tight">
                {athlete?.athleteName || "Athlete"}
              </p>
              <p className="text-[10px] font-mono text-[#ccf141] leading-tight">
                {athlete?.memberId || "BXC-001"}
              </p>
            </div>

            <ChevronDown
              size={13}
              className={`text-zinc-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-zinc-950 border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header inside dropdown */}
              <div className="p-3 border-b border-white/10 rounded-xl bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    MEMBER PASS
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase">
                    {athlete?.status || "Active"}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-1 uppercase">
                  {athlete?.athleteName || "Athlete"}
                </h4>
                <div className="mt-2 flex items-center justify-between bg-black/60 p-2 rounded-lg border border-white/5 font-mono text-xs">
                  <span className="text-zinc-400 text-[10px]">MEMBER ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#ccf141] font-bold">
                      {athlete?.memberId || "BXC-001"}
                    </span>
                    <button
                      onClick={handleCopyMemberId}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="Copy ID"
                    >
                      {copiedId ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
                {athlete?.coach && (
                  <p className="text-[11px] text-zinc-400 mt-2 font-medium">
                    Assigned Mentor:{" "}
                    <span className="text-white font-bold">Coach {athlete.coach}</span>
                  </p>
                )}
              </div>

              {/* Impersonation exit option in dropdown (if admin viewing) */}
              {impersonatorAdmin && (
                <div className="p-2 border-b border-white/10">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleExitImpersonation();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-400 text-black font-black text-xs uppercase cursor-pointer"
                  >
                    <span>Exit Impersonation</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* Dropdown Options */}
              <div className="py-1 text-xs font-semibold space-y-0.5">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowQR(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <QrCode size={14} className="text-[#ccf141]" />
                  <span>View Scannable QR Pass</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Lock size={14} className="text-[#ccf141]" />
                  <span>Change Password</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AthleteHeader;
