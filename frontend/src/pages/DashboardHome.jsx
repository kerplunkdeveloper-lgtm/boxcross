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
  Loader2,
  CreditCard,
  UserCheck,
  XCircle,
  Plus,
} from "lucide-react";
import boxerBanner from "../assets/boxer-banner.png";
import gymhm from "../assets/gymhm.png";
import {
  getBookings,
  getPayments,
  getEventsListAdmin,
  getEventBookings,
  getFounders,
  getAttendance,
  getAthletes,
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

  const [totalAthletes, setTotalAthletes] = useState(0);
  const [presentAthletes, setPresentAthletes] = useState(0);
  const [absentAthletes, setAbsentAthletes] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);

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
      const dateStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })();

      const [
        bookingsRes,
        paymentsRes,
        eventsRes,
        eventBookingsRes,
        foundersRes,
        attendanceRes,
        athletesRes,
      ] = await Promise.all([
        getBookings(),
        getPayments(),
        getEventsListAdmin(),
        getEventBookings(),
        getFounders(),
        getAttendance({ date: dateStr }),
        getAthletes({ limit: 5 }),
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

      if (attendanceRes.data?.success && attendanceRes.data.stats) {
        setTotalAthletes(attendanceRes.data.stats.totalAthletes || 0);
        setPresentAthletes(attendanceRes.data.stats.presentCount || 0);
        setAbsentAthletes(attendanceRes.data.stats.absentCount || 0);
      }

      if (athletesRes.data?.success && Array.isArray(athletesRes.data.data)) {
        setRecentUsers(athletesRes.data.data.slice(0, 5));
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
    <div className="p-3.5 sm:p-5 md:p-8 relative overflow-hidden min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[var(--db-accent-glow)] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-9xl mx-auto z-10 relative space-y-4 sm:space-y-6 md:space-y-8">
        {/* Welcome Section with Balanced Executive Layout & Real-Time Clock */}
        <div
          className="relative overflow-hidden p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-[28px] border border-[var(--db-card-border)] bg-[var(--db-card)] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 group transition-all duration-300"
        >
          {/* Boxer Background Image Layer with Adaptive Theme Opacity */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <img
              src={boxerBanner}
              alt="Dashboard Banner Background"
              className={`w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out ${
                theme === "light" ? "opacity-[0.07]" : "opacity-30"
              }`}
            />
            {/* Cinematic Gradient Overlays to preserve legibility and aesthetic contrast */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.90) 50%, rgba(241,245,249,0.94) 100%)"
                    : "linear-gradient(135deg, rgba(10,10,10,0.94) 0%, rgba(15,15,15,0.78) 50%, rgba(10,10,10,0.92) 100%)",
              }}
            />
          </div>

          {/* Subtle accent light reflection inside the card */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-30 z-[1]" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-[var(--db-accent-glow)] rounded-full blur-3xl pointer-events-none opacity-20 z-[1]" />

          {/* Left Side: Avatar & 3-Tier Typography Hierarchy */}
          <div className="flex items-center gap-3.5 sm:gap-5 md:gap-6 z-10 min-w-0">
            {/* Profile Avatar with Refined Proportions */}
            <div
              onClick={() => navigate("/dashboard/profile")}
              className="relative group cursor-pointer shrink-0"
              title="Click to view profile"
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-2xl sm:rounded-full p-1 border shadow-md transition-all duration-300 group-hover:scale-105 ${
                theme === "light"
                  ? "bg-gradient-to-tr from-slate-200 via-slate-100 to-white border-slate-300 ring-2 ring-slate-200/50 ring-offset-2 ring-offset-white"
                  : "bg-gradient-to-tr from-[var(--db-accent-highlight)]/40 via-[var(--db-accent-highlight)]/15 to-transparent border-[var(--db-accent-highlight)]/30 ring-2 ring-[var(--db-accent-highlight)]/20 ring-offset-2 ring-offset-black"
              }`}>
                <div className="w-full h-full rounded-xl sm:rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl sm:rounded-full"
                    />
                  ) : (
                    <User
                      className="text-[var(--db-accent-highlight)] w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                    />
                  )}
                </div>
              </div>

              {/* Active Online Status Indicator */}
              <div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-500 border-2 border-[var(--db-card)] flex items-center justify-center shadow-md"
                title="Status: Online & Active"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Greeting & Subtitle Information */}
            <div className="text-left min-w-0 flex-1">
          
            
              {/* Main Greeting Headline */}
              <h1
                className="text-base sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-[var(--db-text-title)] leading-tight flex items-center gap-2 flex-wrap"
                style={{ fontFamily: '"Brutal Font", sans-serif' }}
              >
                <span>{getGreeting()},</span>
                <span
                  className="text-[var(--db-accent-highlight)]"
                  style={{ fontFamily: "'BrutalType Bold', sans-serif" }}
                >
                  {user.name}
                </span>
                <Sparkles
                  size={16}
                  className="text-[var(--db-accent-highlight)] animate-pulse shrink-0 inline-block"
                />
              </h1>

              {/* Contextual Subtitle */}
              <p className="text-xs sm:text-[13px] text-[var(--db-text-muted)] font-medium mt-1 leading-snug">
                Live athlete activity, class schedules, and club operations overview.
              </p>
            </div>
          </div>

          {/* Right Side - Dynamic Date & Time Display in Dedicated Self-Contained Card */}
          <div className="z-10 flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-2xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] shadow-sm shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
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
                    .toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--db-text-title)] font-mono"
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
                <span className="text-xs font-mono font-bold text-[var(--db-accent-highlight)]">
                  :{currentTime.toLocaleTimeString([], { second: "2-digit" })}
                </span>
                <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] ml-1">
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

            {/* Circular Clock Ornament */}
            <div
              className="w-11 h-11 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-card)] flex items-center justify-center text-[var(--db-accent-highlight)] shadow-sm shrink-0"
              title="Real-Time System Clock"
            >
              <Clock size={19} className="animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Dashboard Executive KPI Stats */}
        {(() => {
          const statCards = [
            {
              id: "total-athletes",
              title: "Total Athletes",
              shortTitle: "Athletes",
              value: totalAthletes,
              displayValue: totalAthletes.toLocaleString("en-IN"),
              icon: Users,
              accentText: theme === "dark" ? "text-blue-400" : "text-blue-600",
              iconBg: theme === "dark" ? "bg-blue-500/10 text-blue-400 border-blue-500/25 shadow-[0_0_14px_rgba(59,130,246,0.15)]" : "bg-blue-50 text-blue-600 border-blue-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-blue-500" : "bg-blue-500",
              borderHover: theme === "dark" ? "hover:border-blue-500/40 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]" : "hover:border-blue-500/40 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]",
              dotBg: theme === "dark" ? "bg-blue-400" : "bg-blue-500",
              loaderColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
              badgeText: "Athletes",
              link: "/dashboard/user-management",
            },
            {
              id: "present-athletes",
              title: "Athletes Present",
              shortTitle: "Present",
              value: presentAthletes,
              displayValue: presentAthletes.toLocaleString("en-IN"),
              icon: UserCheck,
              accentText: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
              iconBg: theme === "dark" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_14px_rgba(16,185,129,0.15)]" : "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-emerald-500" : "bg-emerald-500",
              borderHover: theme === "dark" ? "hover:border-emerald-500/40 hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)]" : "hover:border-emerald-500/40 hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)]",
              dotBg: theme === "dark" ? "bg-emerald-400" : "bg-emerald-500",
              loaderColor: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
              badgeText: "Present",
              link: "/dashboard/attendance",
            },
            {
              id: "absent-athletes",
              title: "Athletes Absent",
              shortTitle: "Absent",
              value: absentAthletes,
              displayValue: absentAthletes.toLocaleString("en-IN"),
              icon: XCircle,
              accentText: theme === "dark" ? "text-rose-400" : "text-rose-600",
              iconBg: theme === "dark" ? "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_14px_rgba(244,63,94,0.15)]" : "bg-rose-50 text-rose-600 border-rose-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-rose-500" : "bg-rose-500",
              borderHover: theme === "dark" ? "hover:border-rose-500/40 hover:shadow-[0_8px_24px_rgba(244,63,94,0.12)]" : "hover:border-rose-500/40 hover:shadow-[0_8px_24px_rgba(244,63,94,0.12)]",
              dotBg: theme === "dark" ? "bg-rose-400" : "bg-rose-500",
              loaderColor: theme === "dark" ? "text-rose-400" : "text-rose-600",
              badgeText: "Absent",
              link: "/dashboard/attendance",
            },
            {
              id: "visitors",
              title: "Free Gym Visitors",
              shortTitle: "Free Visitors",
              value: visitorCount,
              displayValue: visitorCount.toLocaleString("en-IN"),
              icon: Users,
              accentText: theme === "dark" ? "text-[#ccf141]" : "text-lime-700",
              iconBg:
                theme === "dark"
                  ? "bg-[#ccf141]/10 text-[#ccf141] border-[#ccf141]/25 shadow-[0_0_14px_rgba(229,255,0,0.15)]"
                  : "bg-lime-50 text-lime-700 border-lime-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-[#ccf141]" : "bg-lime-500",
              borderHover:
                theme === "dark"
                  ? "hover:border-[#ccf141]/40 hover:shadow-[0_8px_24px_rgba(229,255,0,0.12)]"
                  : "hover:border-lime-500/40 hover:shadow-[0_8px_24px_rgba(132,204,22,0.12)]",
              dotBg: theme === "dark" ? "bg-[#ccf141]" : "bg-lime-600",
              loaderColor: theme === "dark" ? "text-[#ccf141]" : "text-lime-600",
              badgeText: "Visitors",
              link: "/dashboard/bookings",
            },
            {
              id: "event-payments",
              title: "Event Payments",
              shortTitle: "Event Payments",
              value: totalPayments,
              displayValue: `₹${totalPayments.toLocaleString("en-IN")}`,
              icon: CreditCard,
              accentText: theme === "dark" ? "text-sky-400" : "text-sky-600",
              iconBg: theme === "dark" ? "bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-[0_0_14px_rgba(56,189,248,0.15)]" : "bg-sky-50 text-sky-600 border-sky-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-sky-500" : "bg-sky-500",
              borderHover: theme === "dark" ? "hover:border-sky-500/40 hover:shadow-[0_8px_24px_rgba(56,189,248,0.12)]" : "hover:border-sky-500/40 hover:shadow-[0_8px_24px_rgba(56,189,248,0.12)]",
              dotBg: theme === "dark" ? "bg-sky-400" : "bg-sky-500",
              loaderColor: theme === "dark" ? "text-sky-400" : "text-sky-600",
              badgeText: "Payments",
              link: "/dashboard/event-payments",
            },
            {
              id: "events",
              title: "Total Events",
              shortTitle: "Events",
              value: events.length,
              displayValue: events.length.toLocaleString("en-IN"),
              icon: Calendar,
              accentText: theme === "dark" ? "text-amber-400" : "text-amber-600",
              iconBg: theme === "dark" ? "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_14px_rgba(245,158,11,0.15)]" : "bg-amber-50 text-amber-600 border-amber-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-amber-500" : "bg-amber-500",
              borderHover: theme === "dark" ? "hover:border-amber-500/40 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]" : "hover:border-amber-500/40 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]",
              dotBg: theme === "dark" ? "bg-amber-400" : "bg-amber-500",
              loaderColor: theme === "dark" ? "text-amber-400" : "text-amber-600",
              badgeText: "Events",
              link: "/dashboard/events-list",
            },
            {
              id: "collection",
              title: "Event Revenue",
              shortTitle: "Revenue",
              value: eventRevenue,
              displayValue: `₹${eventRevenue.toLocaleString("en-IN")}`,
              icon: DollarSign,
              accentText: theme === "dark" ? "text-teal-400" : "text-teal-600",
              iconBg: theme === "dark" ? "bg-teal-500/10 text-teal-400 border-teal-500/25 shadow-[0_0_14px_rgba(20,184,166,0.15)]" : "bg-teal-50 text-teal-600 border-teal-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-teal-500" : "bg-teal-500",
              borderHover: theme === "dark" ? "hover:border-teal-500/40 hover:shadow-[0_8px_24px_rgba(20,184,166,0.12)]" : "hover:border-teal-500/40 hover:shadow-[0_8px_24px_rgba(20,184,166,0.12)]",
              dotBg: theme === "dark" ? "bg-teal-400" : "bg-teal-500",
              loaderColor: theme === "dark" ? "text-teal-400" : "text-teal-600",
              badgeText: "Collection",
              link: "/dashboard/event-payments",
            },
            {
              id: "founders",
              title: "Paid Founders",
              shortTitle: "Founders",
              value: paidFounders,
              displayValue: paidFounders.toLocaleString("en-IN"),
              icon: ShieldCheck,
              accentText: theme === "dark" ? "text-purple-400" : "text-purple-600",
              iconBg: theme === "dark" ? "bg-purple-500/10 text-purple-400 border-purple-500/25 shadow-[0_0_14px_rgba(168,85,247,0.15)]" : "bg-purple-50 text-purple-600 border-purple-200 shadow-sm",
              glowBg: theme === "dark" ? "bg-purple-500" : "bg-purple-500",
              borderHover: theme === "dark" ? "hover:border-purple-500/40 hover:shadow-[0_8px_24px_rgba(168,85,247,0.12)]" : "hover:border-purple-500/40 hover:shadow-[0_8px_24px_rgba(168,85,247,0.12)]",
              dotBg: theme === "dark" ? "bg-purple-400" : "bg-purple-500",
              loaderColor: theme === "dark" ? "text-purple-400" : "text-purple-600",
              badgeText: "Founders",
              link: "/dashboard/founding-members",
            },
          ];

          return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3.5 2xl:gap-4">
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
                    className={`group relative overflow-hidden rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] ${card.borderHover} p-3 sm:p-4 flex flex-col justify-between min-h-[105px] sm:min-h-[120px] shadow-lg hover:shadow-2xl transition-all duration-300 text-left cursor-pointer select-none`}
                    title={`${card.title}: ${card.displayValue}`}
                  >
                    {/* Ambient Glow in Top-Right Corner */}
                    <div
                      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-300 ${card.glowBg}`}
                    />

                    {/* Top Row: Themed Icon Badge + Status Tag with Micro-Arrow */}
                    <div className="flex items-center justify-between z-10 mb-2">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}
                      >
                        <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${card.dotBg}`}
                        />
                        <span className="text-[8.5px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors">
                          {card.badgeText}
                        </span>
                        <ArrowUpRight
                          size={10}
                          className="text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Large Numeric Value + Uppercase Label */}
                    <div className="z-10 mt-auto">
                      {loading ? (
                        <div className="h-6 sm:h-8 flex items-center">
                          <Loader2
                            size={18}
                            className={`animate-spin ${card.loaderColor}`}
                          />
                        </div>
                      ) : (
                        <div
                          className="text-lg sm:text-2xl lg:text-[21px] xl:text-2xl 2xl:text-3xl font-bold text-[var(--db-text-title)] tracking-tight leading-tight truncate"
                        >
                          {card.displayValue}
                        </div>
                      )}
                      <p
                        className="text-[9.5px] sm:text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wider text-[var(--db-text-muted)] mt-0.5 sm:mt-1 truncate group-hover:text-[var(--db-text)] transition-colors"
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

        {/* Recent Users Section */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] shadow-xl p-4 sm:p-5 md:p-6 text-left overflow-hidden">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-md sm:text-lg md:text-xl font-black uppercase tracking-wide text-[var(--db-text-title)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                Recent Athletes
              </h2>
              <p className="text-[var(--db-text-muted)] text-[10px] sm:text-xs mt-0.5">
                Latest user registrations and profiles.
              </p>
            </div>
            <button onClick={() => navigate("/dashboard/user-management")} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] hover:opacity-80 transition-opacity">
              View All <ArrowUpRight size={14} className="sm:w-[16px] sm:h-[16px]" />
            </button>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[9px] sm:text-[10px] font-black text-[var(--db-text-muted)] uppercase tracking-wider">
                    <th className="px-3 sm:px-4 py-2 bg-[var(--db-input-bg)] rounded-l-xl">Athlete Profile</th>
                    <th className="px-3 sm:px-4 py-2 bg-[var(--db-input-bg)]">Member ID</th>
                    <th className="px-3 sm:px-4 py-2 bg-[var(--db-input-bg)]">Contact</th>
                    <th className="px-3 sm:px-4 py-2 bg-[var(--db-input-bg)]">Batch</th>
                    <th className="px-3 sm:px-4 py-2 bg-[var(--db-input-bg)] text-right rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-[var(--db-text-muted)] text-sm font-semibold bg-[var(--db-input-bg)]/30 rounded-xl">
                        No recent athletes found
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((u) => (
                      <tr key={u._id} className="group hover:bg-[var(--db-input-bg)]/50 transition-colors">
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-l-xl border-y border-l border-transparent group-hover:border-[var(--db-card-border)]/50 bg-[var(--db-card)] group-hover:bg-transparent">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--db-accent-glow)] flex items-center justify-center shrink-0 border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] overflow-hidden">
                              {u.profileImage ? (
                                <img src={u.profileImage} alt={u.athleteName} className="w-full h-full object-cover" />
                              ) : (
                                <User size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-[var(--db-text)] text-xs sm:text-sm">{u.athleteName}</p>
                              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-bold mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 border-y border-transparent group-hover:border-[var(--db-card-border)]/50 bg-[var(--db-card)] group-hover:bg-transparent">
                          <span className="font-mono font-bold text-[10px] sm:text-xs text-[var(--db-text-muted)] bg-[var(--db-input-bg)] px-2 py-1 rounded-md border border-[var(--db-card-border)]">
                            {u.memberId || "N/A"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 border-y border-transparent group-hover:border-[var(--db-card-border)]/50 bg-[var(--db-card)] group-hover:bg-transparent">
                          <span className="text-[10px] sm:text-xs font-semibold text-[var(--db-text)]">
                            {u.phoneNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 border-y border-transparent group-hover:border-[var(--db-card-border)]/50 bg-[var(--db-card)] group-hover:bg-transparent">
                          <span className="px-2 sm:px-2.5 py-1 bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
                            {u.preferredBatch || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-r-xl border-y border-r border-transparent group-hover:border-[var(--db-card-border)]/50 text-right bg-[var(--db-card)] group-hover:bg-transparent">
                          <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider ${
                            u.isActive !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {u.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Premium Promo Banner Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-[var(--db-card-border)] bg-[var(--db-card)] shadow-2xl h-[230px] sm:h-[360px] lg:h-[480px] flex flex-col justify-end group transition-all duration-300 lg:sticky lg:top-6">
              <img
                src={gymhm}
                alt="Box & Cross Gym"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 text-left flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--db-accent-highlight)] text-[var(--db-accent-text)] shadow-lg mb-3">
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
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] hover:opacity-80 transition-opacity duration-300 cursor-pointer group"
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
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              theme === "dark"
                                ? "text-[#ff9e00] bg-[#ff9e00]/10"
                                : "text-amber-800 bg-amber-100 border border-amber-200"
                            }`}>
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
