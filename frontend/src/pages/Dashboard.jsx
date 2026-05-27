import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, ShieldCheck, Flame, 
  LogOut, Activity, Award, Clock, ArrowRight,
  Sparkles, CheckCircle, HelpCircle, Dumbbell
} from "lucide-react";
import { getMyBookings } from "../api/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch bookings for the logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getMyBookings();
        if (data.success) {
          setBookings(data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/");
    }
  };

  if (!user) return null;

  // Calculate days remaining for membership
  let daysRemaining = 0;
  let expiryStr = "N/A";
  if (user.membership?.status === "active" && user.membership?.endDate) {
    const expiry = new Date(user.membership.endDate);
    const diffTime = expiry - new Date();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    expiryStr = expiry.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const joinDateStr = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-16 px-4 md:px-8 font-sans relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#defb02]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#defb02]/20 to-transparent border border-[#defb02]/50 flex items-center justify-center shadow-lg shadow-[#defb02]/10">
              <User size={30} className="text-[#defb02]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  Hey, {user.name}!
                </h1>
                <Sparkles size={16} className="text-[#defb02] animate-pulse" />
              </div>
              <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                Welcome back to your Box & Cross Athlete Portal. Ready to crush it?
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer bg-black/40 backdrop-blur-sm"
            style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* MEMBERSHIP STATUS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Decorative Pattern */}
            <div className="absolute top-0 right-0 bg-[#defb02]/5 w-24 h-24 rounded-bl-[100px] pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  Membership Overview
                </span>
              </div>

              {user.membership?.status === "active" ? (
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase mb-1" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                    {user.membership.planName}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    Active Member
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Expires On</p>
                      <p className="text-sm font-bold flex items-center gap-1.5 text-gray-300">
                        <Calendar size={14} className="text-gray-400" />
                        {expiryStr}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Time Remaining</p>
                      <p className="text-sm font-bold flex items-center gap-1.5 text-[#defb02]">
                        <Clock size={14} />
                        {daysRemaining} Days
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Total Price Paid</p>
                      <p className="text-sm font-bold text-gray-300">₹{user.membership.price}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-2" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                    No Active Membership
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed max-w-lg">
                    Access group classes, expert trainers, and premium gym features by selecting a membership plan. Start your fitness journey today.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#defb02] text-black font-black uppercase tracking-widest text-xs transition-transform duration-300 hover:scale-105"
                    style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  >
                    View Pricing Plans
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* PROFILE SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  Athlete Profile
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Account Name</p>
                    <p className="text-xs font-bold text-gray-300">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Email Address</p>
                    <p className="text-xs font-bold text-gray-300 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Joined On</p>
                    <p className="text-xs font-bold text-gray-300">{joinDateStr}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> Secure Account Active
            </div>
          </motion.div>
        </div>

        {/* BOOKINGS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT BOOKINGS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  Your Booked Gym Tours
                </span>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-sm font-bold">
                {bookings.length} Total
              </span>
            </div>

            {loadingBookings ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500 text-xs gap-2">
                <svg className="animate-spin h-6 w-6 text-[#defb02]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Loading your visits...</span>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#defb02]/10 border border-[#defb02]/20 flex items-center justify-center text-[#defb02]">
                        <Dumbbell size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{booking.goal}</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                          Scheduled visit
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <Calendar size={13} className="text-gray-500" />
                        <span>{booking.day} {booking.month}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <Clock size={13} className="text-gray-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-sm">
                        <CheckCircle size={10} />
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
                <p className="text-gray-500 text-xs md:text-sm mb-4">No gym tour visits scheduled yet.</p>
                <button
                  onClick={() => {
                    const el = document.getElementById("book-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate("/");
                    }
                  }}
                  className="px-4 py-2 border border-[#defb02]/30 text-[#defb02] hover:bg-[#defb02] hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all"
                  style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                >
                  Book a Visit Now
                </button>
              </div>
            )}
          </motion.div>

          {/* HELP & SUPPORT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  Help & FAQs
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-gray-200 mb-1">How do I access the gym?</h4>
                  <p className="text-gray-500 leading-relaxed">Present your active membership details at the front desk when arriving.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 mb-1">Can I freeze my plan?</h4>
                  <p className="text-gray-500 leading-relaxed">Yes, contact support to freeze membership for up to 30 days once per plan.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-gray-400 leading-relaxed">
              Need assistance? Email us at <a href="mailto:support@boxandcross.com" className="text-[#defb02] font-semibold hover:underline">support@boxandcross.com</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
