import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import boxcrosslogo from "../assets/login.png";
// import logo from "../assets/images/logo.png";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const origin = location.state?.from?.pathname || "/dashboard";
      navigate(origin, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    setLoading(false);
    if (!result.success) {
      setError(result.message);
      toast.error(result.message || "Failed to log in.");
    } else {
      toast.success("Welcome back, administrator!");
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
      <header className="relative w-full px-6 md:px-12 py-4 z-10 flex items-center justify-end  border-b border-white/[0.08]">
        {/* <div className="flex items-center select-none">
          <img src={logo} alt="Box & Cross Logo" className="h-11 md:h-14 w-auto object-contain" />
        </div> */}

        {/* Right Label */}
        <div
          className="text-xs md:text-2xl text-white font-medium font-black"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          GYM PORTAL
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 z-10 py-12">
        {/* Left Side: Bold Promotional Blocks (Desktop Only) */}
        <div className="hidden md:flex flex-col items-start text-left select-none max-w-lg mb-12">
          {/* ALL ABOUT Block */}
          <div className="bg-black/30 text-white   backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm    inline-block mb-3.5 shadow-xl shadow-black/10">
            <h1 className="text-2xl"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              All About
            </h1>
             
          </div>

          {/* HEALTH & FITNESS Block */}
          <div className="bg-black/30 text-white  backdrop-blur-md border border-white/10 px-6 py-4 rounded-sm   inline-block shadow-xl shadow-black/10">
           <h1 className="text-2xl"
             style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
           >
              Health & Fitness
            </h1>
          </div>
        </div>

        {/* Right Side: Floating Glassmorphic Login Card with Spin Border Animation */}
        <div className="w-full max-w-[460px] relative p-[1px] overflow-hidden rounded-[28px] bg-white/[0.05] shadow-2xl">
          {/* Spin border animation */}
          <div className="absolute inset-[-100px] bg-[conic-gradient(from_0deg,transparent_40%,#defb02_50%,transparent_60%)] animate-[spin_5s_linear_infinite] z-0 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full  bg-black/20 backdrop-blur-md rounded-[28px] p-10 md:p-12 relative z-10"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Header Title */}
              <div
                className="text-white/80 text-sm tracking-[0.18em] uppercase font-bold text-left italic border-b border-white/5 pb-3 mb-2"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                PROCEED TO LOGIN
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-lg text-left"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-1 text-left">
                <input
                  type="email"
                  placeholder="admin@boxcross.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-[#c8cacb] border-none text-black font-bold placeholder-[#6e7173] rounded-md px-6 text-sm outline-none focus:ring-2 focus:ring-[#defb02]/30 transition-all shadow-inner"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-[#c8cacb] border-none text-black font-bold placeholder-[#6e7173] rounded-md pl-6 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#defb02]/30 transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-4 gap-4">
                {/* Back to Membership Link */}
                <Link
                  to="/"
                  className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  &larr; Back to Membership
                </Link>

                {/* Submit button pill-shaped and styled gray like reference */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden w-full sm:w-auto px-12 py-3.5 bg-[#defb02] text-black font-extrabold uppercase tracking-widest text-xs rounded-md transition-all duration-500 cursor-pointer shadow-lg disabled:opacity-50"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></span>
                  <span className="relative z-10">
                    {loading ? "..." : "LOGIN"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      {/* Bottom Footer Area */}
      <footer className="relative w-full py-4 text-center z-10 border-t border-white/5 bg-black/25 backdrop-blur-sm select-none">
        <span
          className="text-[9px] tracking-widest text-white/30 uppercase font-bold"
          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
        >
          © 2026 BOX & CROSS. SECURED ADMIN INTERFACE.
        </span>
      </footer>
    </div>
  );
};

export default Auth;
