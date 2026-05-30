import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, ShieldCheck, Award, Clock, ArrowRight, Sparkles, Users, 
  MapPin, DollarSign, ArrowUpRight, Plus, Loader2 
} from "lucide-react";
import gymhm from "../assets/gymhm.png";
import { getBookings, getPayments, getEventsListAdmin } from "../api/api";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


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

      <div className="max-w-9xl mx-auto z-10 relative space-y-10">
        
        {/* Welcome Section with Glassmorphism and Real-Time Clock */}
        <div 
          className="relative overflow-hidden p-6 md:p-8 rounded-3xl border shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{
            background: "var(--db-glass-bg)",
            borderColor: "var(--db-glass-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)"
          }}
        >
          {/* Subtle accent light reflection inside the card */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-40" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-20" />
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--db-accent-highlight)]/40 via-transparent to-[var(--db-accent-highlight)]/10 border-2 border-[var(--db-accent-highlight)]/30 flex items-center justify-center overflow-hidden shadow-lg shadow-[var(--db-accent-glow)] shrink-0">
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
                  Hi, <span className="text-[var(--db-accent-highlight)]" style={{fontFamily:"'BrutalType Bold', sans-serif"}}> {user.name}</span>
                </h1>
                <Sparkles size={16} className="text-[var(--db-accent-highlight)] animate-pulse" />
              </div>
              <p className="text-[var(--db-text-muted)] text-xs md:text-sm mt-0.5 font-semibold leading-relaxed max-w-md">
                Welcome back to your Box & Cross Athlete Portal. Ready to crush it?
              </p>
            </div>
          </div>

          {/* Right Side - Dynamic Date & Time Display with High-Tech Premium Glass Layout */}
          <div className="z-10 flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 sm:border-l border-[var(--db-glass-border)] pt-4 sm:pt-0 sm:pl-8">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 text-[var(--db-text-muted)] text-[10px] font-black uppercase tracking-widest">
                <Calendar size={12} className="text-[var(--db-accent-highlight)]" />
                <span>
                  {currentTime.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}, {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--db-text-title)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(" ")[0]}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[var(--db-accent-highlight)] ml-0.5">
                  :{currentTime.toLocaleTimeString([], { second: '2-digit' })}
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)] ml-2">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(" ")[1]}
                </span>
              </div>
            </div>

            {/* Premium circular glass clock ornament */}
            <div 
              className="w-12 h-12 rounded-2xl border flex items-center justify-center text-[var(--db-accent-highlight)] shadow-inner relative group overflow-hidden"
              style={{
                background: "var(--db-glass-bg)",
                borderColor: "var(--db-glass-border)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <Clock size={20} className="relative z-10 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Cinematic Video Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-56 sm:h-72 md:h-80 lg:h-[530px] rounded-3xl overflow-hidden relative border border-[var(--db-card-border)] shadow-2xl"
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







        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Premium Promo Banner Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative overflow-hidden rounded-[32px] border border-[var(--db-card-border)] bg-[var(--db-card)] shadow-2xl h-[320px] sm:h-[400px] lg:h-[480px] flex flex-col justify-end group transition-all duration-300 lg:sticky lg:top-6">
              <img 
                src={gymhm} 
                alt="Box & Cross Gym" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-left flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--db-accent-highlight)] text-black shadow-lg mb-3">
                  Box & Cross Club
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide leading-tight" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  Elite Athlete Arena
                </h3>
                <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mt-1.5">
                  Push your limits in our high-performance facility equipped with state-of-the-art gear and expert coaching.
                </p>
              </div>
            </div>
          </div>


          {/* Right: CALENDAR EVENTS DETAILS SECTION */}
          <div className="lg:col-span-7 space-y-6 text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-md md:text-xl font-black uppercase tracking-wide text-[var(--db-text-title)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  Active Class & Event Schedules
                </h2>
                <p className="text-[var(--db-text-muted)] text-xs mt-0.5">
                  Overview of current active gym schedules, time slots and participant capacity.
                </p>
              </div>
              
              <button 
                onClick={() => navigate("/dashboard/calendar")}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] hover:text-white transition-colors duration-300 cursor-pointer group"
              >
                Go to Calendar View
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
              <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] overflow-hidden shadow-2xl p-5 md:p-6 transition-colors">
                <div className="flex flex-col gap-2.5">
                  {events.slice(0, 8).map((evt) => (
                    <div 
                      key={evt._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-4 hover:bg-[var(--db-input-bg)]/25 border border-transparent hover:border-[var(--db-card-border)]/50 rounded-2xl transition-all duration-300"
                    >
                      {/* Left: Small Image & Title/Location */}
                      <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                        {/* Small Image */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--db-card-border)]">
                          <img 
                            src={evt.imageUrl} 
                            alt={evt.title} 
                            className="w-full h-full object-cover transition-transform duration-350 hover:scale-105" 
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
                      <div className="flex flex-wrap gap-2.5 max-w-full sm:max-w-[65%] justify-start sm:justify-end shrink-0">
                        {evt.schedules && evt.schedules.slice(0, 3).map((sch, sIdx) => (
                          <div 
                            key={sIdx}
                            className="bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-2xl p-2.5 flex flex-col gap-1.5 min-w-[125px] flex-1 sm:flex-initial transition-all duration-350 hover:border-[var(--db-accent-highlight)]/30 hover:shadow-lg hover:shadow-[var(--db-accent-glow)]/5"
                          >
                            <span className="text-[9px] font-extrabold text-[var(--db-text-title)] uppercase flex items-center gap-1 border-b border-[var(--db-card-border)]/50 pb-1 mb-0.5">
                              <Calendar size={11} className="text-[var(--db-accent-highlight)] shrink-0" />
                              {sch.date}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {sch.timeSlots && sch.timeSlots.map((ts, tIdx) => {
                                const isFull = ts.booked >= ts.slots;
                                const isAlmostFull = !isFull && (ts.slots - ts.booked <= 3);

                                let badgeColor = "bg-[var(--db-accent-glow)] text-[var(--db-accent-highlight)] border-[var(--db-card-border)]";
                                if (isFull) {
                                  badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                                } else if (isAlmostFull) {
                                  badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                                }

                                return (
                                  <span 
                                    key={tIdx} 
                                    className={`text-[9px] px-2 py-0.5 rounded-lg border font-mono font-bold transition-all duration-200 ${badgeColor}`}
                                    title={`Limit: ${ts.slots} | Booked: ${ts.booked}`}
                                  >
                                    {ts.time} <span className="opacity-75">({ts.booked}/{ts.slots})</span>
                                  </span>
                                );
                              })}
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
    </div>
  );
};

export default DashboardHome;
