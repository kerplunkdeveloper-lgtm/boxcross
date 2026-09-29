import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  MapPin,
  DollarSign,
  ArrowUpRight,
  Plus,
  Loader2,
  CreditCard,
} from "lucide-react";
import boxerBanner from "../assets/boxer-banner.png";
import gymhm from "../assets/gymhm.png";
import {
  getBookings,
  getPayments,
  getEventsListAdmin,
  getEventBookings,
  getFounders,
} from "../api/api";

const DashboardHome = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventRevenue, setEventRevenue] = useState(0);
  const [paidFounders, setPaidFounders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    if (shouldShow) setLoading(true);
    try {
      const [
        bookingsRes,
        paymentsRes,
        eventsRes,
        eventBookingsRes,
        foundersRes,
      ] = await Promise.all([
        getBookings(),
        getPayments(),
        getEventsListAdmin(),
        getEventBookings(),
        getFounders(),
      ]);

      if (bookingsRes.data?.success) {
        setVisitorCount(bookingsRes.data.count || bookingsRes.data.data.length);
      }

      if (paymentsRes.data?.success && Array.isArray(paymentsRes.data.data)) {
        const total = paymentsRes.data.data.reduce((sum, item) => {
          const status = item.paymentStatus || item.status;
          if (status === "success" || status === "completed") {
            return (
              sum +
              (Number(item.price) ||
                Number(item.amount) ||
                Number(item.planPrice) ||
                0)
            );
          }
          return sum;
        }, 0);
        setTotalPayments(total);
      }

      if (eventsRes.data?.success && Array.isArray(eventsRes.data.data)) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const upcomingEvents = eventsRes.data.data.filter((event) => {
          if (!event.schedules || event.schedules.length === 0) return true;
          return event.schedules.some((schedule) => {
            if (!schedule.date || schedule.date === "TBA") return true;
            const scheduleDate = new Date(schedule.date);
            if (isNaN(scheduleDate.getTime())) return true;
            scheduleDate.setHours(0, 0, 0, 0);
            return scheduleDate >= currentDate;
          });
        });

        setEvents(upcomingEvents);
      }

      if (
        eventBookingsRes.data?.success &&
        Array.isArray(eventBookingsRes.data.data)
      ) {
        const revenue = eventBookingsRes.data.data
          .filter(
            (b) =>
              b.status === "payment successfully" || b.status === "confirmed",
          )
          .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        setEventRevenue(revenue);
      }

      if (foundersRes.data?.success && Array.isArray(foundersRes.data.data)) {
        const paidCount = foundersRes.data.data.filter(
          (f) =>
            f.paymentStatus === "Completed" || f.paymentStatus === "completed",
        ).length;
        setPaidFounders(paidCount);
      }
    } catch (error) {
      console.error("Error loading dashboard home stats", error);
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats(true);
      const interval = setInterval(() => {
        fetchDashboardStats(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  if (!user) return null;

  return (
    <div className="px-2 py-6 md:p-8 relative overflow-hidden min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[var(--db-accent-glow)] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-9xl mx-auto z-10 relative space-y-10">
        {/* Welcome Section with Boxer Background Image and Real-Time Clock */}
        <div
          className="relative overflow-hidden py-7 px-6 md:py-9 md:px-10 min-h-[175px] sm:min-h-[195px] md:min-h-[220px] rounded-3xl border shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
          style={{
            background: "var(--db-glass-bg)",
            borderColor: "var(--db-glass-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Boxer Background Image Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <img
              src={boxerBanner}
              alt="Dashboard Banner Background"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Gradient Overlays to preserve legibility and aesthetic contrast */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0.90) 100%)"
                    : "linear-gradient(90deg, rgba(7,7,7,0.88) 0%, rgba(7,7,7,0.52) 45%, rgba(7,7,7,0.82) 100%)",
              }}
            />
          </div>

          {/* Subtle accent light reflection inside the card */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-40 z-[1]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-20 z-[1]" />

          <div className="flex items-center gap-4 sm:gap-6 md:gap-7 z-10">
            {/* Profile Image with Increased Size & Enhanced UI/UX */}
            <div
              onClick={() => navigate("/dashboard/profile")}
              className="relative group cursor-pointer shrink-0"
              title="Click to view profile"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full p-1.5 bg-gradient-to-tr from-[var(--db-accent-highlight)] via-[var(--db-accent-highlight)]/40 to-transparent border-2 sm:border-[3px] border-[var(--db-accent-highlight)]/40 shadow-2xl shadow-[var(--db-accent-glow)] ring-2 sm:ring-[3px] ring-[var(--db-accent-highlight)]/25 ring-offset-2 sm:ring-offset-4 ring-offset-[var(--db-card)] transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--db-accent-highlight)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-full"
                    />
                  ) : (
                    <User
                      size={54}
                      className="text-[var(--db-accent-highlight)]"
                    />
                  )}
                </div>
              </div>

              {/* Active Online Status Indicator */}
              <div
                className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 border-2 sm:border-[3px] border-[var(--db-card)] flex items-center justify-center shadow-lg"
                title="Status: Online & Active"
              >
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[var(--db-text-title)]"
                  style={{ fontFamily: '"Brutal Font", sans-serif' }}
                >
                  {getGreeting()},{" "}
                  <span
                    className="text-[var(--db-accent-highlight)]"
                    style={{ fontFamily: "'BrutalType Bold', sans-serif" }}
                  >
                    {" "}
                    {user.name}
                  </span>
                </h1>
                <Sparkles
                  size={16}
                  className="text-[var(--db-accent-highlight)] animate-pulse"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Date & Time Display with High-Tech Premium Glass Layout */}
          <div className="z-10 flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 sm:border-l border-[var(--db-glass-border)] pt-4 sm:pt-0 sm:pl-8">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 text-[var(--db-text-muted)] text-[10px] font-black uppercase tracking-widest">
                <Calendar
                  size={12}
                  className="text-[var(--db-accent-highlight)]"
                />
                <span>
                  {currentTime
                    .toLocaleDateString([], { weekday: "short" })
                    .toUpperCase()}
                  ,{" "}
                  {currentTime
                    .toLocaleDateString([], { month: "short", day: "numeric" })
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--db-text-title)]"
                  style={{ fontFamily: '"Brutal Font", sans-serif' }}
                >
                  {
                    currentTime
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .split(" ")[0]
                  }
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[var(--db-accent-highlight)] ml-0.5">
                  :{currentTime.toLocaleTimeString([], { second: "2-digit" })}
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)] ml-2">
                  {
                    currentTime
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .split(" ")[1]
                  }
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
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <Clock size={20} className="relative z-10 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Dashboard Executive KPI Stats - 5 Cards Aligned in 1 Row on Desktop */}
        {(() => {
          const statCards = [
            {
              id: "visitors",
              title: "Total Free Gym Visitors",
              shortTitle: "Free Visitors",
              value: visitorCount,
              displayValue: visitorCount.toLocaleString("en-IN"),
              icon: Users,
              accentText: "text-[#ccf141]",
              iconBg:
                "bg-[#ccf141]/10 text-[#ccf141] border-[#ccf141]/25 shadow-[0_0_14px_rgba(229,255,0,0.15)]",
              glowBg: "bg-[#ccf141]",
              borderHover:
                "hover:border-[#ccf141]/40 hover:shadow-[0_8px_24px_rgba(229,255,0,0.12)]",
              dotBg: "bg-[#ccf141]",
              loaderColor: "text-[#ccf141]",
              badgeText: "Visitors",
              link: "/dashboard/bookings",
            },
            {
              id: "event-payments",
              title: "No. of Event Payment",
              shortTitle: "Event Payments",
              value: totalPayments,
              displayValue: `₹${totalPayments.toLocaleString("en-IN")}`,
              icon: CreditCard,
              accentText: "text-sky-400",
              iconBg:
                "bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-[0_0_14px_rgba(56,189,248,0.15)]",
              glowBg: "bg-sky-500",
              borderHover:
                "hover:border-sky-500/40 hover:shadow-[0_8px_24px_rgba(56,189,248,0.12)]",
              dotBg: "bg-sky-400",
              loaderColor: "text-sky-400",
              badgeText: "Payments",
              link: "/dashboard/event-payments",
            },
            {
              id: "events",
              title: "No. of Events",
              shortTitle: "Events",
              value: events.length,
              displayValue: events.length.toLocaleString("en-IN"),
              icon: Calendar,
              accentText: "text-amber-400",
              iconBg:
                "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_14px_rgba(245,158,11,0.15)]",
              glowBg: "bg-amber-500",
              borderHover:
                "hover:border-amber-500/40 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]",
              dotBg: "bg-amber-400",
              loaderColor: "text-amber-400",
              badgeText: "Events",
              link: "/dashboard/events-list",
            },
            {
              id: "collection",
              title: "Event Collection",
              shortTitle: "Collection",
              value: eventRevenue,
              displayValue: `₹${eventRevenue.toLocaleString("en-IN")}`,
              icon: DollarSign,
              accentText: "text-emerald-400",
              iconBg:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_14px_rgba(16,185,129,0.15)]",
              glowBg: "bg-emerald-500",
              borderHover:
                "hover:border-emerald-500/40 hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)]",
              dotBg: "bg-emerald-400",
              loaderColor: "text-emerald-400",
              badgeText: "Revenue",
              link: "/dashboard/event-payments",
            },
            {
              id: "founders",
              title: "Paid Founders",
              shortTitle: "Founders",
              value: paidFounders,
              displayValue: paidFounders.toLocaleString("en-IN"),
              icon: ShieldCheck,
              accentText: "text-purple-400",
              iconBg:
                "bg-purple-500/10 text-purple-400 border-purple-500/25 shadow-[0_0_14px_rgba(168,85,247,0.15)]",
              glowBg: "bg-purple-500",
              borderHover:
                "hover:border-purple-500/40 hover:shadow-[0_8px_24px_rgba(168,85,247,0.12)]",
              dotBg: "bg-purple-400",
              loaderColor: "text-purple-400",
              badgeText: "Founders",
              link: "/dashboard/founding-members",
            },
          ];

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 2xl:gap-4">
              {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * idx }}
                    whileHover={{ y: -3, transition: { duration: 0.18 } }}
                    onClick={() => card.link && navigate(card.link)}
                    className={`group relative overflow-hidden rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] ${card.borderHover} p-3.5 sm:p-4 flex flex-col justify-between min-h-[114px] sm:min-h-[120px] shadow-lg hover:shadow-2xl transition-all duration-300 text-left cursor-pointer select-none`}
                    title={`${card.title}: ${card.displayValue}`}
                  >
                    {/* Ambient Glow in Top-Right Corner */}
                    <div
                      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-300 ${card.glowBg}`}
                    />

                    {/* Top Row: Themed Icon Badge + Status Tag with Micro-Arrow */}
                    <div className="flex items-center justify-between z-10 mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${card.dotBg}`}
                        />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors">
                          {card.badgeText}
                        </span>
                        <ArrowUpRight
                          size={11}
                          className="text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Large Numeric Value + Uppercase Label */}
                    <div className="z-10 mt-auto">
                      {loading ? (
                        <div className="h-7 sm:h-8 flex items-center">
                          <Loader2
                            size={20}
                            className={`animate-spin ${card.loaderColor}`}
                          />
                        </div>
                      ) : (
                        <div
                          className="text-xl sm:text-2xl lg:text-[21px] xl:text-2xl 2xl:text-3xl font-black text-[var(--db-text-title)] tracking-tight leading-tight truncate"
                          style={{ fontFamily: '"Brutal Font", sans-serif' }}
                        >
                          {card.displayValue}
                        </div>
                      )}
                      <p
                        className="text-[10px] 2xl:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mt-1 truncate group-hover:text-[var(--db-text)] transition-colors"
                        title={card.title}
                      >
                        {card.title}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })()}

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
                <h3
                  className="text-xl md:text-2xl font-black uppercase text-white tracking-wide leading-tight"
                  style={{ fontFamily: '"Brutal Font", sans-serif' }}
                >
                  Elite Athlete Arena
                </h3>
                <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mt-1.5">
                  Push your limits in our high-performance facility equipped
                  with state-of-the-art gear and expert coaching.
                </p>
              </div>
            </div>
          </div>

          {/* Right: CALENDAR EVENTS DETAILS SECTION */}
          <div className="lg:col-span-7 space-y-6 text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2
                  className="text-md md:text-xl font-black uppercase tracking-wide text-[var(--db-text-title)]"
                  style={{ fontFamily: '"Brutal Font", sans-serif' }}
                >
                  Active Class & Event Schedules
                </h2>
                <p className="text-[var(--db-text-muted)] text-xs mt-0.5">
                  Overview of current active gym schedules, time slots and
                  participant capacity.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/calendar")}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] hover:text-white transition-colors duration-300 cursor-pointer group"
              >
                Go to Calendar View
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>

            {loading ? (
              <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <Loader2
                  className="animate-spin text-[var(--db-accent-highlight)]"
                  size={32}
                />
                <p className="text-xs uppercase tracking-wider text-[var(--db-text-muted)] font-bold">
                  Syncing schedules...
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <Calendar
                  size={40}
                  className="text-[var(--db-text-muted)] mb-3"
                />
                <p className="text-sm font-bold text-[var(--db-text)]">
                  No Scheduled Events Yet
                </p>
                <p className="text-xs text-[var(--db-text-muted)] mt-1">
                  Schedules created by gym admins will display here.
                </p>
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
                <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                  {events.map((evt) => (
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
                            <span className="text-[10px] font-black text-[#e0e0e0] bg-[#ff9e00]/10 px-2 py-0.5 rounded-full">
                              ₹{evt.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[var(--db-text-muted)] text-[10px] font-semibold mt-1">
                            <MapPin
                              size={12}
                              className="shrink-0 text-[var(--db-accent-highlight)]"
                            />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Time Slots / Schedules in a clean horizontal flow */}
                      <div className="flex flex-wrap gap-2.5 max-w-full sm:max-w-[65%] justify-start sm:justify-end shrink-0">
                        {evt.schedules &&
                          evt.schedules.slice(0, 3).map((sch, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-2xl p-2.5 flex flex-col gap-1.5 min-w-[125px] flex-1 sm:flex-initial transition-all duration-350 hover:border-[var(--db-accent-highlight)]/30 hover:shadow-lg hover:shadow-[var(--db-accent-glow)]/5"
                            >
                              <span className="text-[9px] font-extrabold text-[var(--db-text-title)] uppercase flex items-center gap-1 border-b border-[var(--db-card-border)]/50 pb-1 mb-0.5">
                                <Calendar
                                  size={11}
                                  className="text-[var(--db-accent-highlight)] shrink-0"
                                />
                                {sch.date}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {sch.timeSlots &&
                                  sch.timeSlots.map((ts, tIdx) => {
                                    const isFull = ts.booked >= ts.slots;
                                    const isAlmostFull =
                                      !isFull && ts.slots - ts.booked <= 3;

                                    let badgeColor =
                                      "bg-[var(--db-accent-glow)] text-[var(--db-accent-highlight)] border-[var(--db-card-border)]";
                                    if (isFull) {
                                      badgeColor =
                                        "bg-red-500/10 text-red-400 border-red-500/20";
                                    } else if (isAlmostFull) {
                                      badgeColor =
                                        "bg-amber-500/10 text-amber-400 border-amber-500/20";
                                    }

                                    return (
                                      <span
                                        key={tIdx}
                                        className={`text-[9px] px-2 py-0.5 rounded-lg border font-mono font-bold transition-all duration-200 ${badgeColor}`}
                                        title={`Limit: ${ts.slots} | Booked: ${ts.booked}`}
                                      >
                                        {ts.time}{" "}
                                        <span className="opacity-75">
                                          ({ts.booked}/{ts.slots})
                                        </span>
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
