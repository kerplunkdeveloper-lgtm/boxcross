import React from "react";
import {
  CreditCard,
  Dumbbell,
  Activity,
  Flame,
  ShieldCheck,
  QrCode,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import logo from "../../assets/images/logo-new.png";
import { toast } from "react-hot-toast";

const AthleteSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  athlete,
  impersonatorAdmin,
  handleLogout,
  handleExitImpersonation,
  setIsPasswordModalOpen,
  setShowQR,
  copiedId,
  handleCopyMemberId,
}) => {
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    {
      id: "overview",
      name: "Digital Pass & Overview",
      shortName: "Pass",
      icon: CreditCard,
      badge: "ACTIVE",
    },
    {
      id: "coach",
      name: "My Coach & Training",
      shortName: "Coach",
      icon: Dumbbell,
      badge: athlete?.coach ? `Coach ${athlete.coach}` : "Assigned",
    },
    {
      id: "assessments",
      name: "Fitness & Assessments",
      shortName: "Metrics",
      icon: Activity,
      badge: "Health",
    },
    {
      id: "attendance",
      name: "Attendance & Biometrics",
      shortName: "Attendance",
      icon: Fingerprint,
      badge: "PUNCHES",
    },
    {
      id: "arena",
      name: "Arena Zones & Hours",
      shortName: "Arena",
      icon: Flame,
      badge: "Hyrox",
    },
    {
      id: "profile",
      name: "Profile & Security",
      shortName: "Profile",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  const coachNumber = "919876543210";
  const athleteFirstName = athlete?.athleteName?.split(" ")[0] || "Athlete";
  const whatsAppMessage = encodeURIComponent(
    `Hi Coach ${athlete?.coach || "Vivek"}, I am ${athlete?.athleteName || "Athlete"} (Member ID: ${athlete?.memberId || "BXC"}). I have a question regarding my training program.`
  );

  return (
    <>
      <aside
        style={{
          fontFamily: "var(--admin-font, 'Plus Jakarta Sans', 'Inter', sans-serif)",
        }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#09090b] border-r border-white/10 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"} w-72 h-screen select-none overflow-hidden`}
      >
        {/* Brand & Top Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-black/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <a
              href="/"
              className="flex items-center gap-2.5 focus:outline-none group"
            >
              <img
                src={logo}
                alt="Box & Cross"
                className="h-7 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              {!isCollapsed && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white truncate">
                    Box & Cross
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#ccf141]/15 border border-[#ccf141]/35 text-[#ccf141] text-[9px] font-black tracking-widest uppercase shrink-0">
                    ATHLETE
                  </span>
                </div>
              )}
            </a>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-2 pb-2">
            {!isCollapsed ? (
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                ATHLETE PORTAL
              </p>
            ) : (
              <div className="h-2 border-b border-white/5" />
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    closeSidebarOnMobile();
                  }}
                  className={`w-full flex items-center transition-all duration-150 cursor-pointer rounded-xl ${
                    isCollapsed
                      ? "h-11 justify-center"
                      : "px-3 py-2.5 justify-between"
                  } ${
                    isActive
                      ? "bg-[#ccf141] text-black font-extrabold shadow-lg shadow-[#ccf141]/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 font-semibold text-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        isActive ? "text-black" : "text-zinc-400 group-hover:text-[#ccf141]"
                      } transition-colors`}
                    />
                    {!isCollapsed && (
                      <span className="text-xs truncate tracking-wide">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? "bg-black/20 text-black border border-black/10"
                          : "bg-white/5 text-zinc-400 border border-white/10"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:flex pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-3 z-50 items-center">
                    <div className="px-3 py-1.5 bg-zinc-900 border border-white/15 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap text-xs font-bold text-white">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#ccf141]/20 text-[#ccf141] rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Pass QR trigger button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setShowQR(true);
                closeSidebarOnMobile();
              }}
              className={`w-full flex items-center transition-all duration-150 cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#ccf141]/40 ${
                isCollapsed
                  ? "h-11 justify-center text-[#ccf141]"
                  : "px-3 py-2.5 justify-between text-zinc-300 hover:text-white"
              }`}
              title="Show Scannable Pass QR"
            >
              <div className="flex items-center gap-3 min-w-0">
                <QrCode size={18} className="text-[#ccf141] shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs font-bold truncate">
                    Show QR Entry Pass
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#ccf141]/10 text-[#ccf141]">
                  SCAN
                </span>
              )}
            </button>
          </div>

          {/* Direct Coach WhatsApp Card (Only when expanded) */}
          {!isCollapsed && (
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-black border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ccf141] flex items-center gap-1.5">
                  <Sparkles size={11} /> Coach Direct
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {athlete?.coach || "Vivek"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Need form advice or training assistance? Chat directly with your mentor.
              </p>
              <a
                href={`https://wa.me/${coachNumber}?text=${whatsAppMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>WhatsApp Coach</span>
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-black/60 shrink-0 space-y-2">
          {/* Password Change Button */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className={`w-full flex items-center transition-colors cursor-pointer rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 ${
              isCollapsed
                ? "h-10 justify-center"
                : "px-3 py-2 text-xs font-semibold gap-2.5"
            }`}
            title="Change Account Password"
          >
            <Lock size={15} className="text-[#ccf141] shrink-0" />
            {!isCollapsed && <span>Change Password</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center transition-colors cursor-pointer rounded-xl text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 ${
              isCollapsed
                ? "h-10 justify-center"
                : "px-3 py-2 text-xs font-bold gap-2.5"
            }`}
            title="Sign out of Athlete Portal"
          >
            <LogOut size={15} className="shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AthleteSidebar;
