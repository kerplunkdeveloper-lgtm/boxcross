import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, ShieldCheck, Award, Clock, ArrowRight, Sparkles, Users, 
  MapPin, DollarSign, ArrowUpRight, Plus, Loader2 
} from "lucide-react";
import { getBookings, getPayments, getEventsListAdmin } from "../api/api";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [bookingsRes, paymentsRes, eventsRes] = await Promise.all([
          getBookings(),
          getPayments(),
          getEventsListAdmin()
        ]);

        if (bookingsRes.data?.success) {
          setVisitorCount(bookingsRes.data.count || bookingsRes.data.data.length);
        }
        
        if (paymentsRes.data?.success && Array.isArray(paymentsRes.data.data)) {
          const total = paymentsRes.data.data.reduce((sum, item) => {
            return sum + (Number(item.amount) || Number(item.planPrice) || 0);
          }, 0);
          setTotalPayments(total);
        }

        if (eventsRes.data?.success && Array.isArray(eventsRes.data.data)) {
          setEvents(eventsRes.data.data);
        }
      } catch (error) {
        console.error("Error loading dashboard home stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="px-2 py-6 md:p-8 relative overflow-hidden min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[var(--db-accent-glow)] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto z-10 relative space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--db-card-border)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/50 flex items-center justify-center overflow-hidden shadow-lg shadow-[var(--db-accent-glow)] shrink-0">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={30} className="text-[var(--db-accent-highlight)]" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[var(--db-text-title)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  Hi, <span className="text-[var(--db-accent-highlight)]"> {user.name}!</span>
                </h1>
                <Sparkles size={16} className="text-[var(--db-accent-highlight)] animate-pulse" />
              </div>
              <p className="text-[var(--db-text-muted)] text-xs md:text-sm mt-0.5">
                Welcome back to your Box & Cross Athlete Portal. Ready to crush it?
              </p>
            </div>
          </div>
        </div>

        {/* Cinematic Video Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-56 sm:h-72 md:h-80 lg:h-[440px] rounded-3xl overflow-hidden relative border border-[var(--db-card-border)] shadow-2xl"
        >
          {/* Loop Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source
              src="https://res.cloudinary.com/dubheb1lh/video/upload/v1779972237/100546-video-720_1_yostn5.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-10" />

          {/* Banner Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 text-left">
            <div className="flex flex-col items-start gap-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Arena
              </span>
              <span className="text-[9px] sm:text-xs text-gray-300 font-bold uppercase tracking-widest mt-1 pl-1">
                Box & Cross Elite Training
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* VISITOR COUNT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-5 md:p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-colors text-left"
          >
            <div className="absolute top-0 right-0 bg-[var(--db-accent-glow)] w-16 h-16 rounded-bl-[60px] pointer-events-none opacity-40" />
            <div className="flex items-center gap-3 z-10">
              <div className="p-2.5 rounded-xl bg-[var(--db-accent-glow)]/10 text-[var(--db-accent-highlight)] shrink-0">
                <Users size={20} />
              </div>
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                Total Bookings
              </span>
            </div>
            <div className="z-10 shrink-0">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-[var(--db-accent-highlight)]" />
              ) : (
                <p className="text-2xl md:text-3xl font-black text-[var(--db-text-title)] tracking-wide" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  {visitorCount}
                </p>
              )}
            </div>
          </motion.div>

          {/* TOTAL PAYMENT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-5 md:p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-colors text-left"
          >
            <div className="absolute top-0 right-0 bg-[var(--db-accent-glow)] w-16 h-16 rounded-bl-[60px] pointer-events-none opacity-40" />
            <div className="flex items-center gap-3 z-10">
              <div className="p-2.5 rounded-xl bg-[var(--db-accent-glow)]/10 text-[var(--db-accent-highlight)] shrink-0">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                Total Revenue
              </span>
            </div>
            <div className="z-10 shrink-0">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-[var(--db-accent-highlight)]" />
              ) : (
                <p className="text-2xl md:text-3xl font-black text-[var(--db-text-title)] tracking-wide" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  ₹{totalPayments.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </motion.div>

          {/* ACTIVE EVENTS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-5 md:p-6 flex items-center justify-between relative overflow-hidden shadow-2xl transition-colors text-left"
          >
            <div className="absolute top-0 right-0 bg-[var(--db-accent-glow)] w-16 h-16 rounded-bl-[60px] pointer-events-none opacity-40" />
            <div className="flex items-center gap-3 z-10">
              <div className="p-2.5 rounded-xl bg-[var(--db-accent-glow)]/10 text-[var(--db-accent-highlight)] shrink-0">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                Scheduled Events
              </span>
            </div>
            <div className="z-10 shrink-0">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-[var(--db-accent-highlight)]" />
              ) : (
                <p className="text-2xl md:text-3xl font-black text-[var(--db-text-title)] tracking-wide" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  {events.length}
                </p>
              )}
            </div>
          </motion.div>

        </div>

        {/* CALENDAR EVENTS DETAILS SECTION BELOW THE CARDS */}
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-text-title)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                Active Class & Event Schedules
              </h2>
              <p className="text-[var(--db-text-muted)] text-xs mt-0.5">
                Overview of current active gym schedules, time slots and participant capacity.
              </p>
            </div>
            
            <button 
              onClick={() => navigate("/dashboard/calendar")}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] hover:underline transition-all cursor-pointer"
            >
              Go to Calendar View
              <ArrowUpRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[var(--db-accent-highlight)]" size={32} />
              <p className="text-xs uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Syncing schedules...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <Calendar size={40} className="text-[var(--db-text-muted)] mb-3" />
              <p className="text-sm font-bold text-[var(--db-text)]">No Scheduled Events Yet</p>
              <p className="text-xs text-[var(--db-text-muted)] mt-1">Schedules created by gym admins will display here.</p>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/dashboard/calendar")}
                  className="mt-4 flex items-center gap-1 bg-[var(--db-accent-glow)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  <Plus size={14} /> Create First Event
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] overflow-hidden shadow-2xl p-6 md:p-8 transition-colors">
              <div className="divide-y divide-[var(--db-card-border)]/60">
                {events.slice(0, 8).map((evt, idx) => (
                  <div 
                    key={evt._id}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 ${
                      idx === 0 ? "pt-0" : ""
                    } ${
                      idx === events.length - 1 || idx === 7 ? "pb-0" : ""
                    }`}
                  >
                    {/* Left: Small Image & Title/Location */}
                    <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                      {/* Small Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--db-card-border)]">
                        <img 
                          src={evt.imageUrl} 
                          alt={evt.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      {/* Title, Location & Price */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black uppercase text-[var(--db-text-title)] truncate">
                            {evt.title}
                          </h3>
                          <span className="text-[10px] font-black text-[#ff9e00] bg-[#ff9e00]/10 px-2 py-0.5 rounded-full">
                            ₹{evt.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--db-text-muted)] text-[10px] font-semibold mt-1">
                          <MapPin size={12} className="shrink-0 text-[var(--db-accent-highlight)]" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Time Slots / Schedules in a clean horizontal flow */}
                    <div className="flex flex-wrap gap-2 md:max-w-[60%] shrink-0">
                      {evt.schedules && evt.schedules.slice(0, 3).map((sch, sIdx) => (
                        <div 
                          key={sIdx}
                          className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl p-2 flex flex-col gap-1 min-w-[120px]"
                        >
                          <span className="text-[8px] font-black text-[var(--db-text-title)] uppercase flex items-center gap-1">
                            <Calendar size={10} className="text-[var(--db-accent-highlight)]" />
                            {sch.date}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sch.timeSlots && sch.timeSlots.map((ts, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="text-[7.5px] bg-[var(--db-accent-glow)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] px-1.5 py-0.5 rounded font-mono font-semibold"
                                title={`Limit: ${ts.slots} | Booked: ${ts.booked}`}
                              >
                                {ts.time} ({ts.booked}/{ts.slots})
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
