import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Dumbbell,
  Calendar,
  LogOut,
  Shield,
  Copy,
  Check,
  Clock,
  Sparkles,
  Award,
  Flame,
  Phone,
  Mail,
  QrCode,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../assets/images/logo-new.png";
import { getAthleteMe, updateAthlete } from "../api/api";

const AthleteDashboard = () => {
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(() => {
    try {
      const stored = localStorage.getItem("boxcross_athlete");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [impersonatorAdmin, setImpersonatorAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("boxcross_impersonator_admin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Verify auth on mount
  useEffect(() => {
    const token = localStorage.getItem("boxcross_athlete_token");
    if (!token && !athlete) {
      toast.error("Please login to access your Athlete Dashboard");
      navigate("/login?tab=athlete", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data } = await getAthleteMe();
        if (data && data.success && data.athlete) {
          setAthlete(data.athlete);
          localStorage.setItem(
            "boxcross_athlete",
            JSON.stringify(data.athlete),
          );
        }
      } catch (err) {
        console.warn("Using cached athlete data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("boxcross_athlete_token");
    localStorage.removeItem("boxcross_athlete");
    localStorage.removeItem("boxcross_impersonator_admin");
    toast.success("Logged out successfully");
    navigate("/login?tab=athlete", { replace: true });
  };

  const handleExitImpersonation = () => {
    const returnUrl =
      impersonatorAdmin?.returnUrl || "/dashboard/user-management";
    localStorage.removeItem("boxcross_impersonator_admin");
    localStorage.removeItem("boxcross_athlete_token");
    localStorage.removeItem("boxcross_athlete");
    toast.success(
      "Exited Impersonation Mode. Welcome back to Admin Dashboard!",
    );
    navigate(returnUrl, { replace: true });
  };

  const handleCopyMemberId = () => {
    if (!athlete?.memberId) return;
    navigator.clipboard.writeText(athlete.memberId);
    setCopiedId(true);
    toast.success(`Copied ${athlete.memberId}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { data } = await updateAthlete(athlete._id, {
        password: newPassword,
      });
      if (data && data.success) {
        toast.success("Password changed successfully!");
        setIsPasswordModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Calculate days active
  const daysActive = athlete?.dateOfJoining
    ? Math.max(
        1,
        Math.floor(
          (new Date() - new Date(athlete.dateOfJoining)) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 1;

  if (loading && !athlete) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <div className="w-10 h-10 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
          Loading Athlete Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#ccf141] selection:text-black">
      {/* Impersonation Banner (Admin viewing as Athlete) */}
      {impersonatorAdmin && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl z-50 sticky top-0 font-sans border-b border-black/20">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
            <span>👁️ Impersonation Mode:</span>
            <span className="underline font-black">
              {athlete?.athleteName} ({athlete?.memberId})
            </span>
            <span className="hidden md:inline text-xs font-semibold text-neutral-800">
              — Admin Session ({impersonatorAdmin?.name || "Admin"})
            </span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black text-[#ccf141] hover:bg-neutral-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            <span>Exit & Return to Admin</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header
        className={`sticky ${impersonatorAdmin ? "top-[46px]" : "top-0"} z-40 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Box & Cross"
            className="h-8 sm:h-9 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] text-[10px] font-black tracking-widest uppercase">
            Athlete Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            title="Change Password"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Lock size={13} className="text-[#ccf141]" />
            <span className="hidden md:inline">Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-black p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccf141]">
              <Sparkles size={16} />
              <span>Box & Cross Athlete Dashboard</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Welcome back, {athlete?.athleteName || "Athlete"}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xl">
              Your official Box & Cross member identity, training coach, and
              performance hub. Stay consistent, push your limits.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                Current Status
              </p>
              <p className="text-sm font-black text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {athlete?.status || "Active"} Member
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Digital Pass & Coach Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Digital Membership Pass (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Holographic accent glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#ccf141]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center font-black text-lg text-[#ccf141]">
                    {athlete?.athleteName
                      ? athlete.athleteName.charAt(0).toUpperCase()
                      : "B"}
                  </div>
                  <div>
                    <h2
                      className="text-base sm:text-lg font-black uppercase tracking-wider text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {athlete?.athleteName}
                    </h2>
                    <p className="text-[11px] text-zinc-400 font-semibold">
                      BOX & CROSS PERFORMANCE ARENA
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                  ACTIVE PASS
                </span>
              </div>

              {/* Member ID Display Hero */}
              <div className="py-6 space-y-2">
                <p className="text-[10px] uppercase font-black tracking-widest text-[#ccf141]">
                  Official Member ID
                </p>
                <div className="flex items-center justify-between bg-black/50 border border-[#ccf141]/30 p-4 rounded-2xl">
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white">
                    {athlete?.memberId || "BOXCROSS-001"}
                  </span>
                  <button
                    onClick={handleCopyMemberId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ccf141] text-black text-xs font-black uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                  >
                    {copiedId ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedId ? "Copied" : "Copy ID"}</span>
                  </button>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[9px] uppercase font-bold text-zinc-400">
                    Age
                  </p>
                  <p className="text-sm font-black text-white mt-0.5">
                    {athlete?.age || "—"} yrs
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[9px] uppercase font-bold text-zinc-400">
                    Gender
                  </p>
                  <p className="text-sm font-black text-white mt-0.5">
                    {athlete?.gender || "—"}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[9px] uppercase font-bold text-zinc-400">
                    Joined
                  </p>
                  <p className="text-xs font-black text-white mt-1">
                    {athlete?.dateOfJoining
                      ? new Date(athlete.dateOfJoining).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[9px] uppercase font-bold text-zinc-400">
                    Active Days
                  </p>
                  <p className="text-sm font-black text-[#ccf141] mt-0.5">
                    {daysActive} Days
                  </p>
                </div>
              </div>
            </div>

            {/* Barcode Graphic Footer */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-zinc-500">
              <div className="space-y-1">
                <div className="flex items-center gap-1 h-5 opacity-70">
                  {/* Decorative barcode stripes */}
                  {[
                    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 1,
                  ].map((w, i) => (
                    <div
                      key={i}
                      className="bg-white h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-mono tracking-widest text-zinc-400">
                  {athlete?.memberId || "BOXCROSS-001"} • SCAN AT ENTRY
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode size={13} className="text-[#ccf141]" />
                  <span>{showQR ? "Hide Pass QR" : "Show QR"}</span>
                </button>
              </div>
            </div>

            {/* QR Modal / Overlay */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-black border border-[#ccf141]/40 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center">
                  {/* Simple QR placeholder representation using CSS grid */}
                  <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-7 h-7 bg-black" />
                      <div className="w-7 h-7 bg-black" />
                    </div>
                    <p className="text-[8px] font-mono text-black font-bold">
                      {athlete?.memberId}
                    </p>
                    <div className="flex justify-between">
                      <div className="w-7 h-7 bg-black" />
                      <div className="w-4 h-4 bg-black" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Present this Member ID at the reception turnstile
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Assigned Coach & Facility Hub (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coach Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ccf141] flex items-center gap-1.5">
                  <Dumbbell size={14} /> Assigned Head Coach
                </span>
                <span className="text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  BXC Certified
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
                  {athlete?.coach ? athlete.coach.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3
                    className="text-lg font-black uppercase tracking-wider text-white"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Coach {athlete?.coach || "Vivek"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    Personalized Performance & Strength Mentorship
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                "Consistency beats talent every single time. Keep showing up,
                execute the program, and celebrate every milestone."
              </p>

              <div className="pt-1 flex gap-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp Coach</span>
                </a>
                <button
                  onClick={() =>
                    toast.success("Coaching appointment request sent to desk!")
                  }
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Book 1:1 Review
                </button>
              </div>
            </motion.div>

            {/* Gym Timings & Facility Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ccf141]">
                <Clock size={14} /> Arena Operating Hours
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Morning Session</span>
                  <span className="font-bold text-white">
                    05:30 AM – 12:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-zinc-400">Evening Session</span>
                  <span className="font-bold text-white">
                    04:30 PM – 10:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-zinc-400">Sunday Recovery</span>
                  <span className="font-bold text-amber-400">
                    07:00 AM – 01:00 PM
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ccf141]/10 text-[#ccf141] flex items-center justify-center">
              <Flame size={20} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Hyrox & CrossFit Zone
            </h4>
            <p className="text-xs text-zinc-400">
              Access to simulation sled tracks, Concept2 SkiErgs, Echo bikes,
              and Olympic platforms with your active pass.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Upcoming Fight Nights
            </h4>
            <p className="text-xs text-zinc-400">
              Check out our monthly amateur fight exhibitions, sparring clinics,
              and workshops via Box & Cross events.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Recovery & Wellness
            </h4>
            <p className="text-xs text-zinc-400">
              Recharge with ice baths, infrared saunas, and targeted myofascial
              release protocols after high-volume sessions.
            </p>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-5 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-[#ccf141]" />
                  <h3
                    className="text-base font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Change Password
                  </h3>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter at least 4 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2 rounded-xl bg-[#ccf141] text-black font-extrabold uppercase tracking-wider shadow-lg hover:bg-white transition-all disabled:opacity-50"
                  >
                    {updatingPassword ? "Updating..." : "Save Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AthleteDashboard;
