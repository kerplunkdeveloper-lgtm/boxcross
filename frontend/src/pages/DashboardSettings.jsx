import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  HelpCircle, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Sun, 
  Moon, 
  Bell, 
  Volume2, 
  Shield,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardSettings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Local state for mock interactive preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Title Header */}
        <div className="text-left">
          <h1 
            className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[var(--db-text-title)]"
            style={{ fontFamily: '"Brutal Font", sans-serif' }}
          >
            Dashboard Settings
          </h1>
          <p className="text-[var(--db-text-muted)] text-xs md:text-sm mt-1">
            Customize your dashboard look and feel, view profile summaries, and manage notification preferences.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Profile Details List Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-colors"
            >
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--db-card-border)]">
                <User size={18} className="text-[var(--db-accent-highlight)]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                  Profile Details Summary
                </span>
              </div>

              {/* Profile Details List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Header Block inside card */}
                <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] mb-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={28} className="text-[var(--db-accent-highlight)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--db-text)] uppercase tracking-wide">
                      {user.name}
                    </h3>
                    <p className="text-xs text-[var(--db-text-muted)]">
                      @{user.username || "username"}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 mt-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)] rounded-full border border-[var(--db-accent-highlight)]/25">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Detail Items */}
                <div className="p-3.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-accent-highlight)] shrink-0">
                    <User size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-extrabold tracking-wider block">Full Name</span>
                    <span className="text-xs font-bold text-[var(--db-text)] truncate block">{user.name}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-accent-highlight)] shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-extrabold tracking-wider block">Email Address</span>
                    <span className="text-xs font-bold text-[var(--db-text)] truncate block">{user.email}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-accent-highlight)] shrink-0">
                    <Phone size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-extrabold tracking-wider block">Phone Number</span>
                    <span className="text-xs font-bold text-[var(--db-text)] block">{user.contactNumber || "Not Set"}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-accent-highlight)] shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-extrabold tracking-wider block">Date of Birth</span>
                    <span className="text-xs font-bold text-[var(--db-text)] block">{user.dob || "Not Set"}</span>
                  </div>
                </div>
              </div>

              {/* View Profile Action Link */}
              <div className="mt-6 pt-4 border-t border-[var(--db-card-border)] flex justify-end">
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="group inline-flex items-center gap-2 px-5 py-3 bg-[var(--db-accent)] hover:bg-[var(--db-accent-hover)] text-[var(--db-accent-text)] font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-[var(--db-accent-glow)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  View Profile details
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Card 2: Appearance & Theme Setup Control */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-colors"
            >
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--db-card-border)]">
                <Sun size={18} className="text-[var(--db-accent-highlight)]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                  Theme Customization Control
                </span>
              </div>

              <p className="text-xs text-[var(--db-text-muted)] leading-relaxed mb-6">
                Toggle between light and dark interface styles depending on your environmental lighting.
              </p>

              {/* Theme Choices Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Light Mode choice */}
                <button
                  onClick={() => theme === "dark" && toggleTheme()}
                  className={`relative p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all cursor-pointer ${
                    theme === "light"
                      ? "border-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/10 shadow-lg"
                      : "border-[var(--db-card-border)] bg-[var(--db-input-bg)]/30 hover:bg-[var(--db-input-bg)]/60"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-2.5 rounded-xl ${theme === "light" ? "bg-[var(--db-accent-highlight)] text-[var(--db-accent-text)]" : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)]"}`}>
                      <Sun size={20} />
                    </div>
                    {theme === "light" && (
                      <div className="w-5 h-5 rounded-full bg-[var(--db-accent-highlight)] text-[var(--db-accent-text)] flex items-center justify-center">
                        <Check size={12} className="stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--db-text)]">Light Mode</h4>
                    <p className="text-[10px] text-[var(--db-text-muted)] mt-1">High visibility style, bright white backgrounds.</p>
                  </div>
                </button>

                {/* Dark Mode choice */}
                <button
                  onClick={() => theme === "light" && toggleTheme()}
                  className={`relative p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all cursor-pointer ${
                    theme === "dark"
                      ? "border-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)]/10 shadow-lg"
                      : "border-[var(--db-card-border)] bg-[var(--db-input-bg)]/30 hover:bg-[var(--db-input-bg)]/60"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-2.5 rounded-xl ${theme === "dark" ? "bg-[var(--db-accent-highlight)] text-[var(--db-accent-text)]" : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)]"}`}>
                      <Moon size={20} />
                    </div>
                    {theme === "dark" && (
                      <div className="w-5 h-5 rounded-full bg-[var(--db-accent-highlight)] text-[var(--db-accent-text)] flex items-center justify-center">
                        <Check size={12} className="stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--db-text)]">Dark Mode</h4>
                    <p className="text-[10px] text-[var(--db-text-muted)] mt-1">Midnight premium style, battery saving & easy on the eyes.</p>
                  </div>
                </button>

              </div>
            </motion.div>

          </div>

          {/* Column 3: Sidebar Controls */}
          <div className="space-y-6">
            
            {/* Preferences / Toggles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 shadow-2xl transition-colors"
            >
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--db-card-border)]">
                <Bell size={16} className="text-[var(--db-accent-highlight)]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                  Preferences
                </span>
              </div>

              <div className="space-y-5">
                {/* Email Toggles */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[var(--db-text)] block">Email Notifications</label>
                    <span className="text-[9px] text-[var(--db-text-muted)] leading-tight block">Receive membership expiry warnings</span>
                  </div>
                  <button 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative ${emailAlerts ? 'bg-[var(--db-accent)]' : 'bg-[var(--db-input-border)]'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${emailAlerts ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Real-time Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[var(--db-text)] block">Real-time Push Alerts</label>
                    <span className="text-[9px] text-[var(--db-text-muted)] leading-tight block">Notify instantly of new booking approvals</span>
                  </div>
                  <button 
                    onClick={() => setDesktopAlerts(!desktopAlerts)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative ${desktopAlerts ? 'bg-[var(--db-accent)]' : 'bg-[var(--db-input-border)]'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${desktopAlerts ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Sounds Effects */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[var(--db-text)] flex items-center gap-1.5">
                      <Volume2 size={13} />
                      Audio Sound Effects
                    </label>
                    <span className="text-[9px] text-[var(--db-text-muted)] leading-tight block">Play alert sound for notifications</span>
                  </div>
                  <button 
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative ${soundEffects ? 'bg-[var(--db-accent)]' : 'bg-[var(--db-input-border)]'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${soundEffects ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Verified Credentials Status */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 shadow-2xl transition-colors"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--db-card-border)]">
                <Shield size={16} className="text-[var(--db-accent-highlight)]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                  Account Integrity
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Fully Verified Account</span>
                    <span className="text-[9px] text-[var(--db-text-muted)] leading-normal mt-0.5 block">
                      Your identity and membership permissions are verified on the secure blockchain router database.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 shadow-2xl transition-colors flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={18} className="text-[var(--db-accent-highlight)]" />
                  <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                    Support & FAQs
                  </span>
                </div>

                <div className="space-y-3.5 text-[11px]">
                  <div>
                    <h4 className="font-bold text-[var(--db-text)] mb-0.5">How do I access the gym?</h4>
                    <p className="text-[var(--db-text-muted)] leading-relaxed">Present your active membership details at the front desk when arriving.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--db-text)] mb-0.5">Can I freeze my plan?</h4>
                    <p className="text-[var(--db-text-muted)] leading-relaxed">Yes, contact support to freeze membership for up to 30 days once per plan.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--db-card-border)] text-[9px] text-[var(--db-text-muted)] leading-relaxed mt-4">
                Need assistance? Email us at <a href="mailto:support@boxandcross.com" className="text-[var(--db-accent-highlight)] font-semibold hover:underline">support@boxandcross.com</a>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
