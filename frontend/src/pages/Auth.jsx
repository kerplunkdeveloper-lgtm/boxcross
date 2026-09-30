import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  UserCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X,
} from "lucide-react";
import { loginAthlete } from "../api/api";

const Auth = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: "admin" or "athlete"
  const searchParams = new URLSearchParams(location.search);
  const initialMode =
    searchParams.get("tab") === "athlete" || location.pathname === "/athlete-login"
      ? "athlete"
      : "admin";
  const [authMode, setAuthMode] = useState(initialMode);

  // Form states
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    const savedRemember = localStorage.getItem("boxcross_remember_me") === "true";
    setRememberMe(savedRemember);
    if (savedRemember) {
      const savedEmail = localStorage.getItem("boxcross_remember_email") || "";
      const savedMemberId = localStorage.getItem("boxcross_remember_member_id") || "";
      if (savedEmail) setEmail(savedEmail);
      if (savedMemberId) setMemberId(savedMemberId);
    }
  }, []);

  // Sync mode if URL search param changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "athlete") {
      setAuthMode("athlete");
    } else if (tab === "admin") {
      setAuthMode("admin");
    }
  }, [location.search]);

  // Redirect if already logged in as Admin
  useEffect(() => {
    if (user && user.role === "admin") {
      const origin = location.state?.from?.pathname || "/dashboard";
      navigate(origin, { replace: true });
    }
  }, [user, navigate, location]);

  // Check if athlete is already logged in
  useEffect(() => {
    const athleteToken = localStorage.getItem("boxcross_athlete_token");
    if (athleteToken && authMode === "athlete") {
      navigate("/athlete-dashboard", { replace: true });
    }
  }, [authMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Save or clear remembered credentials
    if (rememberMe) {
      localStorage.setItem("boxcross_remember_me", "true");
      if (authMode === "admin" && email) {
        localStorage.setItem("boxcross_remember_email", email);
      }
      if (authMode === "athlete" && memberId) {
        localStorage.setItem("boxcross_remember_member_id", memberId);
      }
    } else {
      localStorage.removeItem("boxcross_remember_me");
      localStorage.removeItem("boxcross_remember_email");
      localStorage.removeItem("boxcross_remember_member_id");
    }

    if (authMode === "admin") {
      if (!email || !password) {
        setError("Please enter both administrator email and password.");
        setLoading(false);
        return;
      }

      try {
        const result = await login(email, password);
        setLoading(false);
        if (!result.success) {
          setError(result.message || "Invalid administrator credentials.");
          toast.error(result.message || "Failed to log in.");
        } else {
          toast.success("Welcome back, Administrator!");
          navigate("/dashboard");
        }
      } catch (err) {
        setLoading(false);
        const msg = err.response?.data?.message || "Failed to log in as administrator.";
        setError(msg);
        toast.error(msg);
      }
    } else {
      // Athlete Login with Member ID
      if (!memberId || !password) {
        setError("Please enter both Member ID and Password.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await loginAthlete({
          memberId: memberId.trim().toUpperCase(),
          password,
        });

        if (data && data.success) {
          localStorage.setItem("boxcross_athlete_token", data.token);
          localStorage.setItem(
            "boxcross_athlete",
            JSON.stringify(data.athlete)
          );
          toast.success(
            data.message || `Welcome, ${data.athlete.athleteName}!`
          );
          navigate("/athlete-dashboard");
        } else {
          setError(data.message || "Failed to log in.");
          toast.error(data.message || "Failed to log in.");
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Invalid Member ID or Password. Please try again.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#c8ff00] selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP 100% EXACT REPLICA SPLIT VIEW (lg and above)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block relative w-full h-screen min-h-[660px] max-h-[1080px] overflow-hidden select-none bg-black">
        {/* Full-width Canvas Background Image (Clipped precisely along the polygon divider) */}
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-left bg-cover pointer-events-none z-0"
          style={{
            backgroundImage: "url('/admin_portal_ref.png')",
            clipPath:
              "polygon(0 0, 50.4% 0, 46.0% 22.0%, 43.0% 28.0%, 53.2% 51.6%, 49.8% 73.3%, 45.2% 100%, 0 100%)",
          }}
        />

        {/* Subtle Ambient Vignette Overlay on Left Side to enhance contrast */}
        <div
          className="absolute inset-y-0 left-0 w-[55%] pointer-events-none z-[1] bg-gradient-to-r from-black/25 via-transparent to-transparent"
          style={{
            clipPath:
              "polygon(0 0, 50.4% 0, 46.0% 22.0%, 43.0% 28.0%, 53.2% 51.6%, 49.8% 73.3%, 45.2% 100%, 0 100%)",
          }}
        />

       

      

        {/* ─────────────────────────────────────────────────────────────
            EXACT POLYGONAL DIVIDER & ELECTRIC LIME PANEL (SVG Vector)
            Coordinates mathematically aligned to the reference image:
            P1 (518, 0) -> P2 (475, 132) -> P3 (445, 168 Chevron Apex)
            -> P4 (545, 309 Notch) -> P5 (512, 438) -> P6 (468, 600 Bottom)
        ───────────────────────────────────────────────────────────── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Neon Glow */}
            <filter id="neonGlowDesktop" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow
                dx="-2"
                dy="0"
                stdDeviation="6"
                floodColor="#c8ff00"
                floodOpacity="0.85"
              />
              <feDropShadow
                dx="-1"
                dy="0"
                stdDeviation="14"
                floodColor="#c8ff00"
                floodOpacity="0.4"
              />
            </filter>

            {/* 3D Bevel Facet Linear Gradient */}
            <linearGradient id="bevelGradDesktop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#080e02" />
              <stop offset="40%" stopColor="#142203" />
              <stop offset="75%" stopColor="#243906" />
              <stop offset="100%" stopColor="#101a02" />
            </linearGradient>

            {/* Solid Electric Lime Gradient */}
            <linearGradient id="limePanelDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c8ff00" />
              <stop offset="50%" stopColor="#c4fa00" />
              <stop offset="100%" stopColor="#bff500" />
            </linearGradient>
          </defs>

          {/* 1. 3D Chamfer Bevel Strip Layer */}
          <polygon
            points="504,0 460,132 430,168 532,310 498,440 452,600 468,600 512,438 545,309 445,168 475,132 518,0"
            fill="url(#bevelGradDesktop)"
          />

          {/* 2. Main Electric Lime Surface covering right half */}
          <polygon
            points="518,0 1000,0 1000,600 468,600 512,438 545,309 445,168 475,132"
            fill="url(#limePanelDesktop)"
          />

          {/* 3. Outer Glowing Neon Stroke along bevel edge */}
          <polyline
            points="504,0 460,132 430,168 532,310 498,440 452,600"
            stroke="#c8ff00"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
            filter="url(#neonGlowDesktop)"
          />

          {/* 4. Secondary Highlight Line along the inner facet seam */}
          <polyline
            points="518,0 475,132 445,168 545,309 512,438 468,600"
            stroke="#d8ff33"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
            opacity="0.85"
          />
        </svg>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT INTERACTIVE FORM CONTAINER (DESKTOP)
        ───────────────────────────────────────────────────────────── */}
        <div className="absolute right-0 top-0 bottom-0 w-[48%] xl:w-[46%] z-20 flex flex-col justify-between py-8 px-10 xl:px-16 text-black">
          {/* Top Right Header: ADMIN / ATHLETE PORTAL with black underline */}
          <div className="flex flex-col items-end pt-2">
            <h2
              className="text-lg xl:text-xl font-black tracking-widest text-black uppercase"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              {authMode === "athlete" ? "ATHLETE PORTAL" : "ADMIN PORTAL"}
            </h2>
            <div className="w-8 h-[3px] bg-black mt-1" />
          </div>

          {/* Main Form Center Box */}
          <div className="w-full max-w-[420px] mx-auto my-auto space-y-5">
            {/* Pill Role Switcher */}
            <div className="w-full p-1 bg-black/10 rounded-full flex items-center border border-black/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("athlete");
                  setError("");
                }}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === "athlete"
                    ? "bg-black text-white shadow-md"
                    : "text-black/80 hover:text-black"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <User size={15} />
                <span>ATHLETE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("admin");
                  setError("");
                }}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === "admin"
                    ? "bg-black text-white shadow-md"
                    : "text-black/80 hover:text-black"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <ShieldCheck
                  size={15}
                  className={authMode === "admin" ? "text-[#c8ff00]" : "text-black"}
                />
                <span>ADMIN</span>
              </button>
            </div>

            {/* Subheader: ADMINISTRATOR LOGIN / ATHLETE MEMBER LOGIN with divider line */}
            <div className="flex items-center gap-3 pt-1">
              <span
                className="text-[11px] xl:text-xs font-black italic tracking-[0.16em] uppercase text-black select-none whitespace-nowrap"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {authMode === "athlete"
                  ? "ATHLETE MEMBER LOGIN"
                  : "ADMINISTRATOR LOGIN"}
              </span>
              <div className="h-[1px] bg-black/20 flex-grow" />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/15 border border-black/30 text-black text-xs font-bold px-4 py-2.5 rounded-xl text-left"
              >
                {error}
              </motion.div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Email or Member ID */}
              <div className="space-y-1 text-left">
                <label
                  className="text-[11px] font-black tracking-wider uppercase text-black block"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {authMode === "athlete" ? "MEMBER ID" : "ADMIN EMAIL"}
                </label>
                <div className="relative bg-[#ddf575] hover:bg-[#d6f06a] focus-within:bg-[#e4fc80] focus-within:ring-2 focus-within:ring-black/25 rounded-xl h-12 flex items-center px-4 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  {authMode === "athlete" ? (
                    <UserCheck size={18} className="text-black/70 mr-3 flex-shrink-0" />
                  ) : (
                    <Mail size={18} className="text-black/70 mr-3 flex-shrink-0" />
                  )}
                  <input
                    type={authMode === "athlete" ? "text" : "email"}
                    placeholder={
                      authMode === "athlete"
                        ? "e.g. BOXCROSS-001"
                        : "admin@boxcross.com"
                    }
                    value={authMode === "athlete" ? memberId : email}
                    onChange={(e) =>
                      authMode === "athlete"
                        ? setMemberId(e.target.value.toUpperCase())
                        : setEmail(e.target.value)
                    }
                    className="w-full bg-transparent text-black font-bold text-sm placeholder:text-black/45 focus:outline-none tracking-normal"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1 text-left">
                <label
                  className="text-[11px] font-black tracking-wider uppercase text-black block"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  PASSWORD
                </label>
                <div className="relative bg-[#ddf575] hover:bg-[#d6f06a] focus-within:bg-[#e4fc80] focus-within:ring-2 focus-within:ring-black/25 rounded-xl h-12 flex items-center px-4 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  <Lock size={18} className="text-black/70 mr-3 flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-black font-bold text-sm placeholder:text-black/45 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-black/60 hover:text-black cursor-pointer focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border-2 border-black flex items-center justify-center transition-all cursor-pointer ${
                      rememberMe ? "bg-black text-[#c8ff00]" : "bg-transparent"
                    }`}
                  >
                    {rememberMe && <Check size={11} strokeWidth={3.5} />}
                  </button>
                  <span
                    className="text-black/90 font-bold group-hover:text-black transition-colors"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-black font-bold underline underline-offset-2 hover:opacity-75 cursor-pointer transition-opacity"
                >
                  Forgot password?
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-4">
                <Link
                  to="/"
                  className="text-xs xl:text-sm font-black tracking-wider text-black hover:opacity-75 flex items-center gap-1.5 cursor-pointer transition-all group"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span>HOME</span>
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black hover:bg-neutral-900 active:scale-[0.98] text-[#c8ff00] font-black tracking-widest text-xs xl:text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-black/25 flex items-center gap-2 cursor-pointer transition-all group disabled:opacity-50"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>{loading ? "AUTHENTICATING..." : "ENTER PORTAL"}</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>

          {/* Footer Copyright */}
          <div className="text-center select-none pt-2">
            <span
              className="text-[10px] xl:text-[11px] font-black tracking-[0.2em] text-black/60 uppercase"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              &copy; 2026 BOX &amp; CROSS. SECURED ACCESS PORTAL.
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE & TABLET RESPONSIVE VIEW (< lg)
          100% EXACT REPLICA OF admin_mobile_ref.jpg
      ───────────────────────────────────────────────────────────── */}
      <div className="block lg:hidden min-h-screen bg-black text-black overflow-y-auto select-none">
        {/* Top Hero Section with Athlete Graphic & Polygonal Bevel */}
        <div className="relative w-full h-[40vh] min-h-[300px] max-h-[400px] overflow-hidden bg-black">
          {/* Athlete Hero Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: "url('/admin_mobile_ref.jpg')",
            }}
          />

          {/* Top Edge Brand Link (Subtle overlay for navigation back home) */}
          <div className="absolute top-4 left-5 z-20">
            <Link
              to="/"
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <span className="w-5 h-[2.5px] bg-[#c8ff00] rounded-full inline-block shadow-[0_0_8px_#c8ff00]" />
              <span
                className="text-xs font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                BOX &amp; CROSS{" "}
                <span className="text-[#c8ff00]">ARENA</span>
              </span>
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ELECTRIC LIME FORM SHEET WITH ORGANIC WAVE CREST
            Matches admin_mobile_ref.jpg with the raised roof on left
        ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 -mt-8 sm:-mt-10">
          {/* Organic Wave SVG Header */}
          <div className="relative w-full overflow-hidden leading-none select-none">
            <svg
              viewBox="0 0 400 58"
              className="w-full h-15 sm:h-16 block -mb-[1px]"
              preserveAspectRatio="none"
              fill="#c8ff00"
            >
              <path d="M 0,28 C 0,12 12,0 28,0 L 210,0 C 230,0 238,14 248,32 C 256,48 266,56 284,56 L 400,56 L 400,59 L 0,59 Z" />
            </svg>

            {/* Content inside the raised left tab: ADMIN PORTAL */}
            <div className="absolute top-2 left-6 sm:left-8 z-10 flex flex-col">
              <h2
                className="text-xl sm:text-2xl font-black tracking-wider text-black uppercase"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {authMode === "athlete" ? "ATHLETE PORTAL" : "ADMIN PORTAL"}
              </h2>
              <div className="w-12 h-[3.5px] bg-black mt-1" />
            </div>
          </div>

          {/* Main Electric Lime Form Body */}
          <div className="bg-[#c8ff00] text-black px-6 sm:px-8 pb-10 pt-3 space-y-4">
            {/* Dual-Segment Switcher Pill */}
            <div className="w-full grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("athlete");
                  setError("");
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === "athlete"
                    ? "bg-black text-white shadow-md"
                    : "bg-[#ddf575] text-black hover:bg-[#d4ec67]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <User size={16} />
                <span>ATHLETE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("admin");
                  setError("");
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === "admin"
                    ? "bg-black text-white shadow-md"
                    : "bg-[#ddf575] text-black hover:bg-[#d4ec67]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <ShieldCheck
                  size={16}
                  className={authMode === "admin" ? "text-[#c8ff00]" : "text-black"}
                />
                <span>ADMIN</span>
              </button>
            </div>

            {/* Subheader: ADMINISTRATOR LOGIN / ATHLETE MEMBER LOGIN */}
            <div className="flex items-center gap-3 pt-1">
              <span
                className="text-xs sm:text-sm font-black italic tracking-[0.16em] uppercase text-black select-none whitespace-nowrap"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {authMode === "athlete"
                  ? "ATHLETE MEMBER LOGIN"
                  : "ADMINISTRATOR LOGIN"}
              </span>
              <div className="h-[1.5px] bg-black/25 flex-grow" />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/15 border border-black/30 text-black text-xs font-bold px-4 py-2.5 rounded-xl text-left"
              >
                {error}
              </motion.div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Email or Member ID */}
              <div className="space-y-1 text-left">
                <label
                  htmlFor="mobile-identifier-input"
                  className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-black block"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  {authMode === "athlete" ? "MEMBER ID" : "ADMIN EMAIL"}
                </label>
                <div className="relative bg-[#e2f980] hover:bg-[#daf272] focus-within:bg-[#ebfd8c] focus-within:ring-2 focus-within:ring-black/25 rounded-xl h-13 flex items-center px-4 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  {authMode === "athlete" ? (
                    <UserCheck size={19} className="text-black/75 mr-3 flex-shrink-0" />
                  ) : (
                    <Mail size={19} className="text-black/75 mr-3 flex-shrink-0" />
                  )}
                  <input
                    id="mobile-identifier-input"
                    type={authMode === "athlete" ? "text" : "email"}
                    inputMode={authMode === "athlete" ? "text" : "email"}
                    autoCapitalize={authMode === "athlete" ? "characters" : "none"}
                    autoCorrect="off"
                    autoComplete={authMode === "athlete" ? "username" : "email"}
                    enterKeyHint="next"
                    placeholder={
                      authMode === "athlete"
                        ? "e.g. BOXCROSS-001"
                        : "admin@boxcross.com"
                    }
                    value={authMode === "athlete" ? memberId : email}
                    onChange={(e) =>
                      authMode === "athlete"
                        ? setMemberId(e.target.value.toUpperCase())
                        : setEmail(e.target.value)
                    }
                    className="w-full bg-transparent text-black font-bold text-base placeholder:text-black/45 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1 text-left">
                <label
                  htmlFor="mobile-password-input"
                  className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-black block"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  PASSWORD
                </label>
                <div className="relative bg-[#e2f980] hover:bg-[#daf272] focus-within:bg-[#ebfd8c] focus-within:ring-2 focus-within:ring-black/25 rounded-xl h-13 flex items-center px-4 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  <Lock size={19} className="text-black/75 mr-3 flex-shrink-0" />
                  <input
                    id="mobile-password-input"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="current-password"
                    enterKeyHint="go"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-black font-bold text-base placeholder:text-black/45 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 p-1 text-black/60 hover:text-black cursor-pointer focus:outline-none transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border-2 border-black flex items-center justify-center transition-all ${
                      rememberMe ? "bg-black text-[#c8ff00]" : "bg-transparent"
                    }`}
                  >
                    {rememberMe && <Check size={11} strokeWidth={3.5} />}
                  </button>
                  <span
                    className="text-black font-bold select-none"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-black font-bold underline underline-offset-2 hover:opacity-75 cursor-pointer transition-opacity"
                >
                  Forgot password?
                </button>
              </div>

              {/* Full-Width Enter Portal Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 bg-black hover:bg-neutral-900 active:scale-[0.98] text-[#c8ff00] font-black tracking-widest text-xs sm:text-sm rounded-xl shadow-xl shadow-black/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>{loading ? "AUTHENTICATING..." : "ENTER PORTAL"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Home Link below Button */}
              <div className="pt-2 text-left">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wider text-black hover:opacity-75 cursor-pointer transition-opacity"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <ArrowLeft size={16} />
                  <span>HOME</span>
                </Link>
              </div>
            </form>

            {/* Footer Copyright */}
            <div className="text-center pt-4 select-none">
              <span
                className="text-[9px] sm:text-[10px] font-black tracking-[0.18em] text-black/55 uppercase"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                &copy; 2026 BOX &amp; CROSS. SECURED ACCESS PORTAL.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FORGOT PASSWORD ASSISTANCE MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-[#c8ff00]/40 rounded-2xl p-6 text-white shadow-2xl text-left"
            >
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#c8ff00]/15 text-[#c8ff00] flex items-center justify-center">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3
                    className="text-base font-black tracking-wide text-white uppercase"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Credential Recovery
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Box &amp; Cross Security Portal
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed mb-6">
                {authMode === "admin" ? (
                  <>
                    <p>
                      Administrator credentials are tied to secure master system
                      records. If you have forgotten your password or need a reset:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                      <li>
                        Contact the master infrastructure team at{" "}
                        <span className="text-[#c8ff00] font-bold">
                          admin@boxcross.com
                        </span>
                      </li>
                      <li>
                        Reset master password directly via the secure server CLI
                        utility.
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>
                      Athlete member logins are generated and managed by the Box &amp;
                      Cross gym administration desk.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                      <li>
                        Visit the Box &amp; Cross front desk with your registered phone
                        number or ID proof.
                      </li>
                      <li>
                        Ask your personal trainer or coach for your official Member
                        ID credentials.
                      </li>
                    </ul>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-3 bg-[#c8ff00] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-white transition-colors cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
