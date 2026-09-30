import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Dumbbell,
  Activity,
  Flame,
  ShieldCheck,
  Shield,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Phone,
  Mail,
  QrCode,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Copy,
  Check,
  User,
  Zap,
  Target,
  FileText,
  HeartPulse,
  Info,
  Layers,
  X,
  Printer,
  ChevronDown,
  Fingerprint,
  Radio,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AthleteSidebar from "../Components/Athlete/AthleteSidebar";
import AthleteHeader from "../Components/Athlete/AthleteHeader";
import {
  getAthleteMe,
  updateAthlete,
  getGoalsReadiness,
  getEntryBaselines,
  getAthleteAttendanceHistory,
  punchBiometric,
} from "../api/api";
import logo from "../assets/images/logo-new.png";

const AthleteDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation tab state with URL query param sync
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTabState] = useState(initialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  // Athlete state from local storage or server
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

  // Layout states
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 1:1 Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSlot, setReviewSlot] = useState("Morning (07:00 AM)");
  const [reviewNote, setReviewNote] = useState("");
  const [bookingReview, setBookingReview] = useState(false);

  // Assessment & Baseline data (optional fetch for athlete)
  const [athleteAssessments, setAthleteAssessments] = useState(null);

  // Verify auth on mount and load athlete data
  useEffect(() => {
    const token =
      localStorage.getItem("boxcross_athlete_token") ||
      localStorage.getItem("boxcross_token");

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
          localStorage.setItem("boxcross_athlete", JSON.stringify(data.athlete));
        }
      } catch (err) {
        console.warn("Using cached athlete data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // Attendance state
  const [attendanceStats, setAttendanceStats] = useState({
    totalWorkouts: 0,
    monthlyAttended: 0,
    monthlyRate: 0,
    currentStreak: 0,
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [punchingSelf, setPunchingSelf] = useState(false);

  // Fetch Athlete Attendance
  const fetchMyAttendance = async (athleteId) => {
    if (!athleteId) return;
    try {
      setLoadingAttendance(true);
      const { data } = await getAthleteAttendanceHistory(athleteId);
      if (data && data.success) {
        if (data.stats) setAttendanceStats(data.stats);
        if (data.records) setAttendanceRecords(data.records);
      }
    } catch (err) {
      console.warn("Could not fetch athlete attendance history:", err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (athlete?._id) {
      fetchMyAttendance(athlete._id);
    }
  }, [athlete?._id, activeTab]);

  // Self Punch Simulator
  const handleSelfPunch = async () => {
    if (!athlete?._id) return;
    try {
      setPunchingSelf(true);
      const { data } = await punchBiometric({
        athleteId: athlete._id,
        memberId: athlete.memberId,
        punchType: "auto",
        terminalId: "BXC-APP-PASS",
        deviceName: "Athlete Mobile Pass (Biometric)",
        location: "Front Turnstile Gate",
      });
      if (data && data.success) {
        toast.success(data.message || "Attendance recorded!");
        fetchMyAttendance(athlete._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Biometric punch failed");
    } finally {
      setPunchingSelf(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("boxcross_athlete_token");
    localStorage.removeItem("boxcross_athlete");
    localStorage.removeItem("boxcross_impersonator_admin");
    toast.success("Logged out successfully");
    navigate("/login?tab=athlete", { replace: true });
  };

  // Exit Impersonation Mode
  const handleExitImpersonation = () => {
    const returnUrl =
      impersonatorAdmin?.returnUrl || "/dashboard/user-management";
    localStorage.removeItem("boxcross_impersonator_admin");
    localStorage.removeItem("boxcross_athlete_token");
    localStorage.removeItem("boxcross_athlete");
    toast.success("Exited Impersonation Mode. Welcome back to Admin Dashboard!");
    navigate(returnUrl, { replace: true });
  };

  // Copy Member ID
  const handleCopyMemberId = () => {
    if (!athlete?.memberId) return;
    navigator.clipboard.writeText(athlete.memberId);
    setCopiedId(true);
    toast.success(`Copied ID: ${athlete.memberId}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Password Change
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

  // Handle Book Review Session
  const handleBookReview = (e) => {
    e.preventDefault();
    setBookingReview(true);
    setTimeout(() => {
      setBookingReview(false);
      setIsReviewModalOpen(false);
      toast.success(
        `1:1 Session requested with Coach ${athlete?.coach || "Vivek"} for ${reviewSlot}!`
      );
      setReviewNote("");
    }, 600);
  };

  // Calculate days active
  const daysActive = athlete?.dateOfJoining
    ? Math.max(
        1,
        Math.floor(
          (new Date() - new Date(athlete.dateOfJoining)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 1;

  const coachNumber = "919876543210";
  const whatsAppMessage = encodeURIComponent(
    `Hi Coach ${athlete?.coach || "Vivek"}, I am ${athlete?.athleteName || "Athlete"} (Member ID: ${athlete?.memberId || "BXC"}). I have a question regarding my Box & Cross training.`
  );

  if (loading && !athlete) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
          Loading Box & Cross Athlete Portal...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "var(--admin-font, 'Plus Jakarta Sans', 'Inter', sans-serif)",
      }}
      className="min-h-screen flex bg-[#070708] text-white selection:bg-[#ccf141] selection:text-black overflow-x-hidden"
    >
      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ──────────────── Athlete Sidebar ──────────────── */}
      <AthleteSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        athlete={athlete}
        impersonatorAdmin={impersonatorAdmin}
        handleLogout={handleLogout}
        handleExitImpersonation={handleExitImpersonation}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        setShowQR={setShowQR}
        copiedId={copiedId}
        handleCopyMemberId={handleCopyMemberId}
      />

      {/* ──────────────── Main Content Wrapper ──────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Impersonation Mode Banner (If Admin Impersonating Athlete) */}
        {impersonatorAdmin && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-lg z-40 shrink-0 font-sans border-b border-black/20">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
              <span>Impersonation Session:</span>
              <span className="underline font-black">
                {athlete?.athleteName} ({athlete?.memberId})
              </span>
              <span className="hidden md:inline text-xs font-semibold text-neutral-800">
                — Superadmin Mode
              </span>
            </div>
            <button
              onClick={handleExitImpersonation}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black text-[#ccf141] hover:bg-neutral-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow"
            >
              <span>Exit & Return to Admin</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* ──────────────── Athlete Header ──────────────── */}
        <AthleteHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          athlete={athlete}
          impersonatorAdmin={impersonatorAdmin}
          handleLogout={handleLogout}
          handleExitImpersonation={handleExitImpersonation}
          setIsPasswordModalOpen={setIsPasswordModalOpen}
          setShowQR={setShowQR}
          copiedId={copiedId}
          handleCopyMemberId={handleCopyMemberId}
        />

        {/* ──────────────── Scrollable Main Content ──────────────── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-8 bg-[radial-gradient(ellipse_60%_35%_at_50%_0%,rgba(204,241,65,0.04),transparent_75%)]">
          <AnimatePresence mode="wait">
            {/* ══════════════ TAB 1: DIGITAL PASS & OVERVIEW ══════════════ */}
            {activeTab === "overview" && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Hero Greeting Card */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-black p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-2 z-10">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccf141]">
                      <Sparkles size={16} />
                      <span>BOX & CROSS ATHLETE PORTAL</span>
                    </div>
                    <h2
                      className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Welcome back, {athlete?.athleteName || "Athlete"}!
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xl leading-relaxed">
                      Your official digital arena pass, personalized coach link, and
                      training performance dashboard. Present this ID at the entry turnstiles.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 z-10">
                    <div className="bg-black/60 border border-white/10 px-4 py-2.5 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-zinc-400">
                        Consecutive Days
                      </p>
                      <p className="text-xl font-black text-[#ccf141]">
                        {daysActive} <span className="text-xs font-semibold text-zinc-400">Days</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setShowQR(true)}
                      className="px-4 py-3 rounded-2xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-[#ccf141]/10 cursor-pointer"
                    >
                      <QrCode size={16} />
                      <span>Scan Entry Pass</span>
                    </button>
                  </div>
                </div>

                {/* 4 Bento Quick Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-zinc-900/70 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Active Streak
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Flame size={16} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                      {daysActive} <span className="text-sm font-semibold text-zinc-500">Days</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Joined {athlete?.dateOfJoining ? new Date(athlete.dateOfJoining).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "Recently"}
                    </p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Assigned Coach
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#ccf141]/10 text-[#ccf141] flex items-center justify-center">
                        <Dumbbell size={16} />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-2 truncate">
                      Coach {athlete?.coach || "Vivek"}
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} /> BXC Certified Coach
                    </p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Membership Status
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <ShieldCheck size={16} />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-2">
                      {athlete?.status || "Active"} Pass
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Full Arena & Zone Access
                    </p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Arena Operating
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-white mt-2">
                      Open Today
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      05:30 AM – 10:00 PM
                    </p>
                  </div>
                </div>

                {/* 2-Column Section: Digital Pass Hero & Coach Spotlight */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left (7 Cols): The Holographic Digital Pass */}
                  <div className="lg:col-span-7 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
                    {/* Glowing ambient accents */}
                    <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#ccf141]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Pass Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center font-black text-lg text-[#ccf141]">
                          {athlete?.athleteName
                            ? athlete.athleteName.charAt(0).toUpperCase()
                            : "B"}
                        </div>
                        <div>
                          <h3
                            className="text-base sm:text-lg font-black uppercase tracking-wider text-white"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {athlete?.athleteName}
                          </h3>
                          <p className="text-[11px] text-zinc-400 font-semibold tracking-wide">
                            BOX & CROSS PERFORMANCE ARENA
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                        ACTIVE PASS
                      </span>
                    </div>

                    {/* Member ID Box */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#ccf141]">
                        OFFICIAL MEMBER ID
                      </p>
                      <div className="flex items-center justify-between bg-black/60 border border-[#ccf141]/30 p-4 rounded-2xl">
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
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
                          Joined Date
                        </p>
                        <p className="text-xs font-black text-white mt-1">
                          {athlete?.dateOfJoining
                            ? new Date(athlete.dateOfJoining).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
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

                    {/* Barcode & Scan trigger */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 h-5 opacity-70">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 1].map((w, i) => (
                            <div
                              key={i}
                              className="bg-white h-full"
                              style={{ width: `${w * 1.5}px` }}
                            />
                          ))}
                        </div>
                        <p className="text-[9px] font-mono tracking-widest text-zinc-400">
                          {athlete?.memberId || "BXC-001"} • SCAN AT TURNSTILE
                        </p>
                      </div>

                      <button
                        onClick={() => setShowQR(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <QrCode size={14} className="text-[#ccf141]" />
                        <span>Show Large QR Pass</span>
                      </button>
                    </div>
                  </div>

                  {/* Right (5 Cols): Coach Spotlight & Operating Hours */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Head Coach Card */}
                    <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
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
                          {athlete?.coach ? athlete.coach.charAt(0).toUpperCase() : "V"}
                        </div>
                        <div>
                          <h4
                            className="text-lg font-black uppercase tracking-wider text-white"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            Coach {athlete?.coach || "Vivek"}
                          </h4>
                          <p className="text-xs text-zinc-400 font-medium">
                            Personalized Performance & Strength Mentorship
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                        "Consistency beats talent every single time. Keep showing up, execute the program, and celebrate every milestone."
                      </p>

                      <div className="pt-1 flex gap-2">
                        <a
                          href={`https://wa.me/${coachNumber}?text=${whatsAppMessage}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp Coach</span>
                        </a>

                        <button
                          onClick={() => setIsReviewModalOpen(true)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          Book 1:1 Review
                        </button>
                      </div>
                    </div>

                    {/* Operating Timetable Card */}
                    <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ccf141] flex items-center gap-1.5">
                          <Clock size={14} /> Arena Operating Timetable
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          All Zones Active
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-zinc-400 font-medium">Morning Session</span>
                          <span className="font-bold text-white font-mono">05:30 AM – 12:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-zinc-400 font-medium">Evening Session</span>
                          <span className="font-bold text-white font-mono">04:30 PM – 10:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-zinc-400 font-medium">Sunday Recovery</span>
                          <span className="font-bold text-amber-400 font-mono">07:00 AM – 01:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Arena Disciplines & Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    onClick={() => setActiveTab("arena")}
                    className="bg-zinc-900/50 hover:bg-zinc-900/80 transition-all border border-white/10 rounded-2xl p-6 space-y-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ccf141]/10 text-[#ccf141] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Flame size={20} />
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        Hyrox & Sled Zone
                      </h4>
                      <ChevronRight size={15} className="text-zinc-500 group-hover:text-white" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Access to 50m turf sled tracks, Concept2 SkiErgs, Echo bikes, and sled pushes with your active pass.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("arena")}
                    className="bg-zinc-900/50 hover:bg-zinc-900/80 transition-all border border-white/10 rounded-2xl p-6 space-y-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        CrossFit & Weightlifting
                      </h4>
                      <ChevronRight size={15} className="text-zinc-500 group-hover:text-white" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Custom Rogue rigs, Olympic barbells, calibrated bumper plates, and gymnastic ring stations.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("arena")}
                    className="bg-zinc-900/50 hover:bg-zinc-900/80 transition-all border border-white/10 rounded-2xl p-6 space-y-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield size={20} />
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        Contrast Therapy
                      </h4>
                      <ChevronRight size={15} className="text-zinc-500 group-hover:text-white" />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Recharge with sub-zero ice baths, infrared dry saunas, and targeted myofascial release after training.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ TAB 2: MY COACH & TRAINING ══════════════ */}
            {activeTab === "coach" && (
              <motion.div
                key="tab-coach"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Coach Banner */}
                <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/15 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ccf141] via-lime-500 to-amber-500 p-1 shrink-0 shadow-xl shadow-[#ccf141]/20">
                        <div className="w-full h-full rounded-[20px] bg-black flex items-center justify-center text-2xl font-black text-[#ccf141]">
                          {athlete?.coach ? athlete.coach.charAt(0).toUpperCase() : "V"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#ccf141]">
                            OFFICIAL HEAD COACH
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black">
                            ACTIVE
                          </span>
                        </div>
                        <h2
                          className="text-2xl sm:text-3xl font-black uppercase text-white"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          Coach {athlete?.coach || "Vivek"}
                        </h2>
                        <p className="text-xs text-zinc-400 max-w-lg">
                          Head of Functional Strength, Hyrox Preparation, and Athlete Conditioning at Box & Cross Arena.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`https://wa.me/${coachNumber}?text=${whatsAppMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        <MessageSquare size={16} />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-[#ccf141] text-black hover:bg-white transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ccf141]/10"
                      >
                        <Calendar size={16} />
                        <span>Book 1:1 Review</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Operating Timetable & Training Sessions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left (6 Cols): Weekly Training Sessions */}
                  <div className="lg:col-span-6 bg-zinc-900/70 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <Clock size={18} className="text-[#ccf141]" />
                        Daily Arena Timetable
                      </h3>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">
                        IST Zone
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-white">
                            Morning Strength & Hyrox
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            High energy, sled workouts, Olympic lifting platforms
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-white/10 font-mono text-xs font-bold text-white shrink-0">
                          05:30 AM – 12:00 PM
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-white">
                            Evening Conditioning & Combat
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            WODs, heavy bag striking, rowing simulations
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30 font-mono text-xs font-bold shrink-0">
                          04:30 PM – 10:00 PM
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-white">
                            Sunday Contrast Recovery
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Ice plunge bath, infrared sauna, deep tissue work
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs font-bold shrink-0">
                          07:00 AM – 01:00 PM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right (6 Cols): Training Philosophy & Advice */}
                  <div className="lg:col-span-6 bg-zinc-900/70 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <Zap size={18} className="text-[#ccf141]" />
                        Coach Training Protocols
                      </h3>
                      <span className="text-[10px] text-[#ccf141] uppercase font-bold">
                        BXC Standards
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-zinc-300">
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <p className="font-black text-white uppercase text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141]" />
                          Pre-Workout Preparation
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Perform 8-10 minutes of active dynamic joint mobility and hip activation before touching the bar or sled.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <p className="font-black text-white uppercase text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Progressive Overload Tracking
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Log your baseline sets and sled resistance every week. Incremental gains compound into elite conditioning.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <p className="font-black text-white uppercase text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          Post-Training Recovery
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          End high-volume days with 5 minutes in the cold plunge followed by hydration and 25g+ protein intake.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ TAB 3: FITNESS & ASSESSMENTS ══════════════ */}
            {activeTab === "assessments" && (
              <motion.div
                key="tab-assessments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Header overview */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccf141]">
                    <Activity size={16} />
                    <span>PERFORMANCE & READINESS HUB</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-black uppercase text-white"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Physical Benchmarks & Baseline
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                    Track your fitness goals, physical readiness indices, movement restrictions,
                    and baseline athletic testing recorded during your Box & Cross onboarding.
                  </p>
                </div>

                {/* Benchmark Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Goals & Target Card */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ccf141]/10 text-[#ccf141] flex items-center justify-center">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        Primary Target Focus
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Tailored for your current training block
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Target Discipline</span>
                        <span className="font-bold text-white">Hyrox & Functional Strength</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Weekly Target</span>
                        <span className="font-bold text-[#ccf141]">4 – 5 Sessions</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Readiness Score</span>
                        <span className="font-bold text-emerald-400">92% Optimal</span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Baseline Test Card */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        Entry Baseline Benchmarks
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Recorded on intake assessment
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">500m Row Test</span>
                        <span className="font-bold font-mono text-white">1m 38s</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Push-Up Capacity</span>
                        <span className="font-bold font-mono text-white">35 Reps</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Plank Stability</span>
                        <span className="font-bold font-mono text-white">2m 15s</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Posture & Body Scan Card */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">
                        AI Posture & Movement Scan
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Kinematic body symmetry scan
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Shoulder Alignment</span>
                        <span className="font-bold text-emerald-400">Neutral Symmetrical</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Pelvic Tilt</span>
                        <span className="font-bold text-white">Normal Range</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                        <span className="text-zinc-400">Movement Health</span>
                        <span className="font-bold text-emerald-400">Grade A</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action for Review */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase text-white">
                      Want to update your baseline benchmarks?
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Schedule a 1:1 physical re-assessment with Coach {athlete?.coach || "Vivek"} at the reception desk.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs hover:bg-white transition-all cursor-pointer shrink-0"
                  >
                    Request Re-Assessment
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══════════════ TAB 4: ARENA FACILITIES & ZONES ══════════════ */}
            {activeTab === "arena" && (
              <motion.div
                key="tab-arena"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Arena Header */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccf141]">
                    <Flame size={16} />
                    <span>BOX & CROSS FACILITY ACCESS</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-black uppercase text-white"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Training Zones & Equipment
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                    Your active digital pass gives you unrestricted access to all 4 performance zones.
                    Always scan your pass barcode or QR at the entrance turnstile.
                  </p>
                </div>

                {/* 4 Interactive Zone Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Zone 1 */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#ccf141]/10 text-[#ccf141] flex items-center justify-center font-black">
                        01
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30">
                        HYROX SLED TRACK
                      </span>
                    </div>
                    <h3
                      className="text-lg font-black uppercase text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      50M Turf & Ergometer Fleet
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Equipped with official competition-spec torque sleds, Concept2 SkiErgs,
                      RowErgs, and Rogue Echo bikes for maximal aerobic threshold development.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-zinc-300">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Competition Sleds</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Echo Bikes</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Concept2 Rowers</span>
                    </div>
                  </div>

                  {/* Zone 2 */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black">
                        02
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        CROSSFIT & RIG
                      </span>
                    </div>
                    <h3
                      className="text-lg font-black uppercase text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Custom Olympic Rig Arena
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Massive multi-bay Rogue rig with ring muscle-up attachments, wall-ball targets,
                      climbing ropes, and Olympic lifting platforms with bumper plates.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-zinc-300">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Olympic Barbells</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Rogue Bumper Plates</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Gymnastic Rings</span>
                    </div>
                  </div>

                  {/* Zone 3 */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
                        03
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        COMBAT & STRIKING
                      </span>
                    </div>
                    <h3
                      className="text-lg font-black uppercase text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Boxing Bags & Sparring Turf
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Heavy 6ft Thai tear-drop bags, speed bags, slip cords, and cushioned sparring
                      flooring for high-intensity boxing intervals and power mechanics.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-zinc-300">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Heavy Bags</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Focus Mitts</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Speed Ropes</span>
                    </div>
                  </div>

                  {/* Zone 4 */}
                  <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black">
                        04
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        CONTRAST RECOVERY
                      </span>
                    </div>
                    <h3
                      className="text-lg font-black uppercase text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Cold Plunge & Finnish Sauna
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Sub-zero ice therapy baths at 3°C, infrared Finnish dry saunas, and Hyperice
                      percussion massage loungers for accelerated recovery and central nervous reset.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-zinc-300">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Cold Plunge (3°C)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Dry Sauna</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">Hypervolt Lounge</span>
                    </div>
                  </div>
                </div>

                {/* Etiquette Rules */}
                <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#ccf141]">
                    Arena Guidelines & Protocol
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-400 list-disc list-inside">
                    <li>Scan your Digital Pass ID at the front turnstile upon entry.</li>
                    <li>Wipe down all ergometer handles and benches after intense rounds.</li>
                    <li>Always re-rack your barbells, plates, and dumbbells into designated trees.</li>
                    <li>Wear clean indoor training shoes in the turf and lifting platforms.</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ══════════════ TAB 5: PROFILE & SECURITY ══════════════ */}
            {activeTab === "profile" && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                {/* Profile Overview Card */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ccf141] to-lime-600 p-[2px] shrink-0 shadow-lg shadow-[#ccf141]/20">
                        <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center font-black text-2xl text-[#ccf141]">
                          {athlete?.athleteName ? athlete.athleteName.charAt(0).toUpperCase() : "A"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-xl font-black uppercase text-white tracking-wide"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {athlete?.athleteName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            {athlete?.status || "Active"}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[#ccf141]">
                          Member ID: {athlete?.memberId || "BOXCROSS-001"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyMemberId}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedId ? "Copied" : "Copy Member ID"}</span>
                      </button>

                      <button
                        onClick={() => setShowQR(true)}
                        className="px-3.5 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase flex items-center gap-1.5 hover:bg-white cursor-pointer"
                      >
                        <QrCode size={14} />
                        <span>Pass QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Full Name</span>
                      <p className="font-bold text-white text-sm">{athlete?.athleteName || "—"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Official Member ID</span>
                      <p className="font-mono font-bold text-[#ccf141] text-sm">{athlete?.memberId || "—"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Assigned Head Coach</span>
                      <p className="font-bold text-white text-sm">Coach {athlete?.coach || "Vivek"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Phone Number</span>
                      <p className="font-bold text-white text-sm">{athlete?.phone || "Not recorded"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Email Address</span>
                      <p className="font-bold text-white text-sm truncate">{athlete?.email || "Not recorded"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Date of Joining</span>
                      <p className="font-bold text-white text-sm">
                        {athlete?.dateOfJoining
                          ? new Date(athlete.dateOfJoining).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Age & Gender</span>
                      <p className="font-bold text-white text-sm">
                        {athlete?.age ? `${athlete.age} yrs` : "—"} • {athlete?.gender || "—"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Account Access Tier</span>
                      <p className="font-bold text-emerald-400 text-sm">Full Arena Athlete Access</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Days Active</span>
                      <p className="font-bold text-[#ccf141] text-sm">{daysActive} Consecutive Days</p>
                    </div>
                  </div>
                </div>

                {/* Password & Security Card */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <Lock size={18} className="text-[#ccf141]" />
                      <h3
                        className="text-base font-black uppercase text-white tracking-wider"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        Change Account Password
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl text-xs">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Enter at least 4 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="px-6 py-2.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider shadow-lg hover:bg-white transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {updatingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ══════════════ TAB 6: ATTENDANCE & BIOMETRICS ══════════════ */}
            {activeTab === "attendance" && (
              <motion.div
                key="tab-attendance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                {/* Hero Header with Interactive Turnstile Punch */}
                <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(204,241,65,0.08),transparent_70%)] pointer-events-none" />

                  <div className="space-y-2 z-10">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccf141]">
                      <Fingerprint size={16} className="animate-pulse" />
                      <span>BOX & CROSS BIOMETRIC ACCESS</span>
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-black uppercase text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      Attendance &amp; Arena Check-In
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xl leading-relaxed">
                      Real-time biometric punch logs, consecutive training streaks, and mobile gate pass verification.
                    </p>
                  </div>

                  {/* Quick Self Punch Button */}
                  <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={handleSelfPunch}
                      disabled={punchingSelf}
                      className="px-5 py-3 rounded-2xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-[#ccf141]/20 cursor-pointer disabled:opacity-50"
                    >
                      <Fingerprint size={18} />
                      <span>{punchingSelf ? "Scanning Pass..." : "Punch Gym Turnstile"}</span>
                    </button>

                    <button
                      onClick={() => fetchMyAttendance(athlete?._id)}
                      className="px-3.5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      title="Sync records"
                    >
                      <span>Sync</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Badges */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Total Workouts */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider">Total Workouts</span>
                      <Dumbbell size={15} className="text-[#ccf141]" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-white">
                      {attendanceStats.totalWorkouts || 0}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-medium">Sessions logged in system</span>
                  </div>

                  {/* Current Streak */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/30 bg-amber-500/5 shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider">Active Streak</span>
                      <Flame size={15} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">
                      {attendanceStats.currentStreak || 0} <span className="text-xs text-amber-300/80 font-bold">Days</span>
                    </p>
                    <span className="text-[10px] text-amber-500/70 font-medium">Consecutive workout streak 🔥</span>
                  </div>

                  {/* Monthly Attendance */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 bg-emerald-500/5 shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider">This Month</span>
                      <CheckCircle2 size={15} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {attendanceStats.monthlyAttended || 0} <span className="text-xs text-zinc-400 font-semibold">({attendanceStats.monthlyRate || 0}%)</span>
                    </p>
                    <span className="text-[10px] text-emerald-500/70 font-medium">Monthly consistency rate</span>
                  </div>

                  {/* Biometric Status */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 bg-cyan-500/5 shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-cyan-400">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider">Biometric Pass</span>
                      <Fingerprint size={15} />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-cyan-400">
                      Active &amp; Ready
                    </p>
                    <span className="text-[10px] text-cyan-500/70 font-medium">BioSync-X1 Verified</span>
                  </div>
                </div>

                {/* Attendance History Table */}
                <div className="rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl overflow-hidden space-y-0">
                  <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h3
                        className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <Calendar size={15} className="text-[#ccf141]" />
                        <span>Recent Training Check-Ins</span>
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Historical gate punches verified by Box &amp; Cross biometric turnstiles
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                      {attendanceRecords.length} Records
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/40 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          <th className="py-3 px-4 sm:px-6">Date</th>
                          <th className="py-3 px-4">Check-In</th>
                          <th className="py-3 px-4">Check-Out</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4">Session / Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loadingAttendance ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-zinc-500">
                              <div className="w-7 h-7 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin mx-auto mb-2" />
                              <span>Loading your attendance records...</span>
                            </td>
                          </tr>
                        ) : attendanceRecords.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-zinc-400 space-y-2">
                              <Fingerprint size={32} className="mx-auto text-zinc-600 mb-1" />
                              <p className="text-xs font-bold text-zinc-300">
                                No check-in records found yet.
                              </p>
                              <p className="text-[11px] text-zinc-500">
                                Tap "Punch Gym Turnstile" above to simulate your first biometric entry!
                              </p>
                            </td>
                          </tr>
                        ) : (
                          attendanceRecords.map((rec) => (
                            <tr key={rec._id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white">
                                {rec.date}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                                {rec.checkInTime || "--"}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-cyan-400">
                                {rec.checkOutTime || "--"}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                    rec.status === "Present"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : rec.status === "Late"
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  }`}
                                >
                                  {rec.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-mono text-[11px] text-zinc-300 flex items-center gap-1.5">
                                  {rec.method === "Biometric" ? (
                                    <Fingerprint size={13} className="text-cyan-400" />
                                  ) : (
                                    <UserCheck size={13} className="text-zinc-400" />
                                  )}
                                  <span>{rec.method || "Biometric"}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                                {rec.notes || rec.batch || "General Session"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ──────────────── MODAL 1: LARGE PASS QR CODE MODAL ──────────────── */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/20 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 text-white relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ccf141]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <QrCode size={20} className="text-[#ccf141]" />
                  <h3
                    className="text-base font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Arena Turnstile Pass
                  </h3>
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scannable Pass Box */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black border border-[#ccf141]/30 space-y-4">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-xl">
                  {/* Clean QR Graphic Mockup */}
                  <div className="w-full h-full border-4 border-black p-3 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-9 h-9 bg-black" />
                      <div className="w-9 h-9 bg-black" />
                    </div>
                    <div className="text-center font-mono font-black text-[10px] text-black tracking-widest">
                      {athlete?.memberId || "BXC-001"}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-9 h-9 bg-black" />
                      <div className="w-5 h-5 bg-black" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-mono text-lg font-black text-[#ccf141] tracking-widest">
                    {athlete?.memberId || "BXC-001"}
                  </h4>
                  <p className="text-xs font-black uppercase text-white">
                    {athlete?.athleteName}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Present this code at the Box & Cross entry sensor
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleCopyMemberId}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-zinc-300"
                >
                  {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedId ? "Copied" : "Copy ID"}</span>
                </button>

                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-xs hover:bg-white transition-all cursor-pointer text-center"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MODAL 2: CHANGE PASSWORD MODAL ──────────────── */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-5 text-white shadow-2xl"
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
                  className="text-zinc-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
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
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2 rounded-xl bg-[#ccf141] text-black font-extrabold uppercase tracking-wider shadow-lg hover:bg-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {updatingPassword ? "Updating..." : "Save Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MODAL 3: BOOK 1:1 REVIEW WITH COACH ──────────────── */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#ccf141]" />
                  <h3
                    className="text-base font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Book 1:1 Coach Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleBookReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Assigned Coach
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Coach ${athlete?.coach || "Vivek"}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-bold cursor-not-allowed opacity-80"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Select Preferred Time Slot
                  </label>
                  <select
                    value={reviewSlot}
                    onChange={(e) => setReviewSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                  >
                    <option value="Morning (07:00 AM)">Morning Session — 07:00 AM</option>
                    <option value="Morning (09:00 AM)">Morning Session — 09:00 AM</option>
                    <option value="Evening (05:30 PM)">Evening Session — 05:30 PM</option>
                    <option value="Evening (07:30 PM)">Evening Session — 07:30 PM</option>
                    <option value="Sunday Recovery (08:30 AM)">Sunday Recovery — 08:30 AM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Notes / Goals for Review (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need to adjust my sled pacing and review shoulder mobility..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-[#ccf141]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingReview}
                    className="px-5 py-2 rounded-xl bg-[#ccf141] text-black font-extrabold uppercase tracking-wider shadow-lg hover:bg-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {bookingReview ? "Submitting..." : "Confirm Booking"}
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
