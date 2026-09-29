import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import boxcrosslogo from "../assets/login.png";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, UserCheck } from "lucide-react";
import { loginAthlete } from "../api/api";

const Auth = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: "admin" or "athlete"
  const searchParams = new URLSearchParams(location.search);
  const initialMode =
    searchParams.get("tab") === "athlete" ? "athlete" : "admin";
  const [authMode, setAuthMode] = useState(initialMode);

  // Admin form state
  const [email, setEmail] = useState("");

  // Athlete form state
  const [memberId, setMemberId] = useState("");

  // Common form state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (authMode === "admin") {
      if (!email || !password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Failed to log in as admin.");
        toast.error(result.message || "Failed to log in.");
      } else {
        toast.success("Welcome back, administrator!");
        navigate("/dashboard");
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
            JSON.stringify(data.athlete),
          );
          toast.success(
            data.message || `Welcome, ${data.athlete.athleteName}!`,
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
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden flex flex-col justify-between">
      {/* Background Monochrome Gym Image with High Contrast and Grayscale filter */}
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale contrast-[1.25] brightness-[1.55] pointer-events-none z-0"
        style={{ backgroundImage: `url(${boxcrosslogo})` }}
      />

      {/* Top Header Bar */}
      <header className="relative w-full px-6 md:px-12 py-4 z-10 flex items-center justify-between border-b border-white/[0.08]">
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#ccf141] transition-colors cursor-pointer"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          &larr; Box & Cross Arena
        </Link>

        {/* Right Label */}
        <div
          className="text-xs md:text-2xl text-white font-black"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          {authMode === "athlete" ? "ATHLETE PORTAL" : "ADMIN PORTAL"}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 z-10 py-8">
        {/* Left Side: Promotional Blocks (Desktop Only) */}
        <div className="hidden md:flex flex-col items-start text-left select-none max-w-lg mb-6">
          <div className="bg-black/30 text-white backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm inline-block mb-3.5 shadow-xl shadow-black/10">
            <h1
              className="text-2xl"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Box & Cross
            </h1>
          </div>

          <div className="bg-black/30 text-white backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm inline-block shadow-xl shadow-black/10">
            <h1
              className="text-2xl text-[#ccf141]"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Performance Arena
            </h1>
          </div>

          <p className="text-xs text-zinc-400 mt-4 leading-relaxed max-w-sm">
            {authMode === "athlete"
              ? "Access your athlete identity card, track membership details, and stay connected with your dedicated coach."
              : "Secure administrative management for memberships, athletes, events, and bookings."}
          </p>
        </div>

        {/* Right Side: Floating Glassmorphic Login Card */}
        <div className="w-full max-w-[460px] relative p-[1px] overflow-hidden rounded-[28px] bg-white/[0.05] shadow-2xl">
          {/* Spin border animation */}
          <div className="absolute inset-[-100px] bg-[conic-gradient(from_0deg,transparent_40%,#ccf141_50%,transparent_60%)] animate-[spin_5s_linear_infinite] z-0 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-black/40 backdrop-blur-md rounded-[28px] p-8 sm:p-10 relative z-10"
          >
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("athlete");
                  setError("");
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === "athlete"
                    ? "bg-[#ccf141] text-black shadow-md"
                    : "text-zinc-300 hover:text-white"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <UserCheck size={14} />
                <span>Athlete</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("admin");
                  setError("");
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === "admin"
                    ? "bg-[#ccf141] text-black shadow-md"
                    : "text-zinc-300 hover:text-white"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header Title */}
              <div
                className="text-white/80 text-xs tracking-[0.18em] uppercase font-bold text-left italic border-b border-white/10 pb-2 mb-2"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                {authMode === "athlete"
                  ? "ATHLETE MEMBER LOGIN"
                  : "ADMINISTRATOR LOGIN"}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-lg text-left"
                >
                  {error}
                </motion.div>
              )}

              {/* Identifier Input */}
              {authMode === "athlete" ? (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#ccf141]">
                    Member ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BOXCROSS-001"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                    className="w-full h-13 bg-[#c8cacb] border-none text-black font-mono font-bold placeholder-[#6e7173] rounded-md px-5 text-sm outline-none focus:ring-2 focus:ring-[#ccf141]/40 transition-all shadow-inner tracking-wider"
                    required
                  />
                  <p className="text-[10px] text-zinc-400">
                    Use the auto-generated Member ID given by gym admin.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#ccf141]">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@boxcross.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-13 bg-[#c8cacb] border-none text-black font-bold placeholder-[#6e7173] rounded-md px-5 text-sm outline-none focus:ring-2 focus:ring-[#ccf141]/40 transition-all shadow-inner"
                    required
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1 text-left relative">
                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-13 bg-[#c8cacb] border-none text-black font-bold placeholder-[#6e7173] rounded-md pl-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#ccf141]/40 transition-all shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-3 gap-4">
                <Link
                  to="/"
                  className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  &larr; Home
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden w-full sm:w-auto px-10 py-3 bg-[#ccf141] text-black font-extrabold uppercase tracking-widest text-xs rounded-md transition-all duration-300 cursor-pointer shadow-lg disabled:opacity-50 hover:bg-white"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span className="relative z-10">
                    {loading ? "AUTHENTICATING..." : "ENTER PORTAL"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      {/* Bottom Footer Area */}
      <footer className="relative w-full py-3.5 text-center z-10 border-t border-white/5 bg-black/30 backdrop-blur-sm select-none">
        <span
          className="text-[9px] tracking-widest text-white/40 uppercase font-bold"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          © 2026 BOX & CROSS. SECURED ACCESS PORTAL.
        </span>
      </footer>
    </div>
  );
};

export default Auth;
