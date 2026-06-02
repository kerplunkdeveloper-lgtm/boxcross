import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  User,
  Sun,
  Moon,
  Bell,
  CheckCheck,
  CreditCard,
  Calendar,
  BookOpen,
  LogOut,
  Settings,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { 
  getBookings, 
  getPayments, 
  getEventBookings,
  getHomec1,
  getHomec2,
  getHomec3,
  getLeadsAdmin 
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHeader = ({ setSidebarOpen, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("boxcross_deleted_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const prevIdsRef = useRef([]);
  const [latestNotification, setLatestNotification] = useState(null);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq, startTime, duration, vol = 0.12) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(523.25, now,        0.3,  0.10); // C5
      playTone(659.25, now + 0.10, 0.3,  0.12); // E5
      playTone(783.99, now + 0.20, 0.45, 0.14); // G5
    } catch (e) {
      console.warn("Audio playback context failed or blocked", e);
    }
  };

  // Profile Dropdown States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleHeaderLogout = async () => {
    setShowProfileDropdown(false);
    const res = await logout();
    if (res.success) {
      toast.success("Logged out successfully.");
      navigate("/");
    } else {
      toast.error(res.message || "Failed to log out.");
    }
  };

  // Load read notification IDs from localStorage
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem("boxcross_read_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Resolve current active title based on path
  let activeTitle = "Dashboard";
  if (location.pathname.includes("/bookings")) {
    activeTitle = "Enquiry Members";
  } else if (location.pathname.includes("/memberships")) {
    activeTitle = "Membership Edit";
  } else if (location.pathname.includes("/payments")) {
    activeTitle = "Payment Details";
  } else if (location.pathname.includes("/events-list")) {
    activeTitle = "Events List";
  } else if (location.pathname.includes("/events")) {
    activeTitle = "Event Banners";
  } else if (location.pathname.includes("/event-payments")) {
    activeTitle = "Event Payments";
  } else if (location.pathname.includes("/profile")) {
    activeTitle = "Profile Settings";
  } else if (location.pathname.includes("/settings")) {
    activeTitle = "Settings";
  } else if (location.pathname.includes("/calendar")) {
    activeTitle = "Athlete & Events Schedule";
  } else if (location.pathname.includes("/homec1")) {
    activeTitle = "Trial Bookings";
  } else if (location.pathname.includes("/homec2")) {
    activeTitle = "Consultation Details";
  } else if (location.pathname.includes("/homec3")) {
    activeTitle = "Contact Enquiries";
  } else if (location.pathname.includes("/leads")) {
    activeTitle = "Captured Leads";
  } else if (location.pathname.includes("/founding-members")) {
    activeTitle = "Founding Members";
  } else if (location.pathname.includes("/founding-offer")) {
    activeTitle = "Offer Details Edit";
  }

  // Fetch real-time data and aggregate as notifications
  const fetchNotifications = async () => {
    try {
      let aggregated = [];

      const results = await Promise.allSettled([
        getBookings(),
        getPayments(),
        getEventBookings(),
        getHomec1(),
        getHomec2(),
        getHomec3(),
        getLeadsAdmin()
      ]);

      const [
        bookingsRes,
        paymentsRes,
        eventBookingsRes,
        homec1Res,
        homec2Res,
        homec3Res,
        leadsRes
      ] = results;

      // 1. Fetch Enquiry Bookings
      if (bookingsRes.status === "fulfilled" && bookingsRes.value.data?.success && Array.isArray(bookingsRes.value.data.data)) {
        bookingsRes.value.data.data.forEach((item) => {
          aggregated.push({
            id: `booking-${item._id}`,
            title: "New Enquiry Booking",
            message: `${item.name} scheduled a tour at ${item.time}`,
            time: new Date(item.createdAt || Date.now()),
            type: "booking",
            link: "/dashboard/bookings",
          });
        });
      }

      // 2. Fetch Membership Payments
      if (paymentsRes.status === "fulfilled" && paymentsRes.value.data?.success && Array.isArray(paymentsRes.value.data.data)) {
        paymentsRes.value.data.data.forEach((item) => {
          aggregated.push({
            id: `payment-${item._id}`,
            title: "Membership Payment",
            message: `Payment of ₹${item.price || item.amount || item.planPrice || 0} received (Status: ${item.paymentStatus || item.status || "success"})`,
            time: new Date(item.createdAt || Date.now()),
            type: "payment",
            link: "/dashboard/payments",
          });
        });
      }

      // 3. Fetch Event Bookings
      if (eventBookingsRes.status === "fulfilled" && eventBookingsRes.value.data?.success && Array.isArray(eventBookingsRes.value.data.data)) {
        eventBookingsRes.value.data.data.forEach((item) => {
          aggregated.push({
            id: `event-${item._id}`,
            title: "Event Booking",
            message: `${item.name} registered for ${item.event?.title || item.eventName || "event"} (${item.seats || 1} seats)`,
            time: new Date(item.createdAt || Date.now()),
            type: "event",
            link: "/dashboard/event-payments",
          });
        });
      }

      // 4. Fetch Trial Bookings (Homec1)
      if (homec1Res.status === "fulfilled" && homec1Res.value.data?.success && Array.isArray(homec1Res.value.data.data)) {
        homec1Res.value.data.data.forEach((item) => {
          aggregated.push({
            id: `homec1-${item._id}`,
            title: "New Trial Booking",
            message: `${item.name} booked a Free Trial`,
            time: new Date(item.createdAt || Date.now()),
            type: "booking",
            link: "/dashboard/homec1",
          });
        });
      }

      // 5. Fetch Consultation Requests (Homec2)
      if (homec2Res.status === "fulfilled" && homec2Res.value.data?.success && Array.isArray(homec2Res.value.data.data)) {
        homec2Res.value.data.data.forEach((item) => {
          aggregated.push({
            id: `homec2-${item._id}`,
            title: "New Consultation Request",
            message: `${item.name} requested a consultation`,
            time: new Date(item.createdAt || Date.now()),
            type: "event",
            link: "/dashboard/homec2",
          });
        });
      }

      // 6. Fetch Contact Form Enquiries (Homec3)
      if (homec3Res.status === "fulfilled" && homec3Res.value.data?.success && Array.isArray(homec3Res.value.data.data)) {
        homec3Res.value.data.data.forEach((item) => {
          aggregated.push({
            id: `homec3-${item._id}`,
            title: "New Contact Enquiry",
            message: `${item.name} sent: "${item.message || ""}"`,
            time: new Date(item.createdAt || Date.now()),
            type: "booking",
            link: "/dashboard/homec3",
          });
        });
      }

      // 7. Fetch Popup Leads
      if (leadsRes.status === "fulfilled" && leadsRes.value.data?.success && Array.isArray(leadsRes.value.data.data)) {
        leadsRes.value.data.data.forEach((item) => {
          aggregated.push({
            id: `lead-${item._id}`,
            title: "New Popup Lead Captured",
            message: `${item.name} registered (Phone: ${item.phone})`,
            time: new Date(item.createdAt || Date.now()),
            type: "event",
            link: "/dashboard/leads",
          });
        });
      }

      // Sort by time descending (newest first)
      aggregated.sort((a, b) => b.time.getTime() - a.time.getTime());

      // Filter out deleted notifications
      let currentDeleted = [];
      try {
        const stored = localStorage.getItem("boxcross_deleted_notifications");
        currentDeleted = stored ? JSON.parse(stored) : [];
      } catch (e) {}

      let currentRead = [];
      try {
        const stored = localStorage.getItem("boxcross_read_notifications");
        currentRead = stored ? JSON.parse(stored) : [];
      } catch (e) {}

      const activeFetched = aggregated.filter(
        (n) => !currentDeleted.includes(n.id),
      );

      if (prevIdsRef.current.length > 0) {
        const newItems = activeFetched.filter(
          (n) =>
            !prevIdsRef.current.includes(n.id) && !currentRead.includes(n.id),
        );
        if (newItems.length > 0) {
          playNotificationSound();
          setLatestNotification(newItems[0]);
        }
      }

      prevIdsRef.current = activeFetched.map((n) => n.id);
      setNotifications(activeFetched.slice(0, 15));
    } catch (err) {
      console.error("Notification aggregation error", err);
    }
  };

  // Fetch immediately, and poll every 5 seconds when tab is active (for real-time updates and performance optimization)
  useEffect(() => {
    fetchNotifications();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle clicking outside the notifications dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Calculate unread count
  const unreadNotifications = notifications.filter(
    (n) => !readIds.includes(n.id) && !deletedIds.includes(n.id),
  );
  const unreadCount = unreadNotifications.length;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updatedReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updatedReadIds);
    localStorage.setItem(
      "boxcross_read_notifications",
      JSON.stringify(updatedReadIds),
    );
  };

  // Delete notification permanently
  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    const updated = [...deletedIds, id];
    setDeletedIds(updated);
    localStorage.setItem(
      "boxcross_deleted_notifications",
      JSON.stringify(updated),
    );
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Mark individual notification as read and navigate
  const handleNotificationClick = (item) => {
    if (!readIds.includes(item.id)) {
      const updatedReadIds = [...readIds, item.id];
      setReadIds(updatedReadIds);
      localStorage.setItem(
        "boxcross_read_notifications",
        JSON.stringify(updatedReadIds),
      );
    }
    setShowDropdown(false);
    navigate(item.link);
  };

  // Helper to format relative dates
  const formatRelativeTime = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Helper to get notification type icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <BookOpen size={14} className="text-blue-400" />;
      case "payment":
        return <CreditCard size={14} className="text-emerald-400" />;
      case "event":
        return (
          <Calendar size={14} className="text-[var(--db-accent-highlight)]" />
        );
      default:
        return <Bell size={14} className="text-gray-400" />;
    }
  };

  return (
    <header className="h-20 bg-[var(--db-header)] border-b border-[var(--db-header-border)] px-6 md:px-8 flex items-center justify-between flex-shrink-0 transition-colors relative">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-[12px] md:text-xl font-bold uppercase tracking-wider text-[var(--db-text-title)]">
          {activeTitle}
        </h2>
      </div>

      {/* Action panel & User info */}
      <div className="flex items-center gap-5">
        {/* Real-time Notifications Bell Icon with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 rounded-full hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-all cursor-pointer relative"
            title="Activity Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 rounded-full text-[9px] font-black min-w-[18px] h-[18px] px-1 flex items-center justify-center"
                style={{
                  background: theme === "dark" ? "#e5ff00" : "#1e293b",
                  color:      theme === "dark" ? "#000000" : "#ffffff",
                  boxShadow:  theme === "dark" ? "0 0 10px rgba(229,255,0,0.5)" : "none",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed sm:absolute top-20 sm:top-14 left-3 right-3 sm:left-auto sm:right-0 w-auto sm:w-[400px] bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-50 overflow-hidden"
              >
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3.5 border-b border-[var(--db-card-border)] ${theme === "dark" ? "bg-[rgba(229,255,0,0.06)]" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-[#e5ff00] shadow-[0_0_12px_rgba(229,255,0,0.35)]" : "bg-slate-800"}`}>
                      <Bell size={13} className="text-black" style={{ color: theme === "dark" ? "#000" : "#fff" }} />
                    </div>
                    <div>
                      <span
                        className="text-xs font-black uppercase tracking-wider"
                        style={{ color: theme === "dark" ? "#ffffff" : "#0f172a" }}
                      >
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span
                          className="ml-2 px-1.5 py-0.5 text-[9px] font-black rounded-full"
                          style={{
                            background: theme === "dark" ? "#e5ff00" : "#1e293b",
                            color: theme === "dark" ? "#000" : "#fff",
                          }}
                        >
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-[10px] font-bold text-[var(--db-accent-highlight)] hover:opacity-75 transition-opacity cursor-pointer"
                    >
                      <CheckCheck size={11} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Feed */}
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar divide-y divide-[var(--db-card-border)]">
                  {notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--db-input-bg)] flex items-center justify-center">
                        <Bell size={20} className="text-[var(--db-text-muted)]" />
                      </div>
                      <p className="text-xs text-[var(--db-text-muted)] uppercase tracking-widest font-bold">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const isUnread = !readIds.includes(item.id);
                      const typeStyles = {
                        booking: {
                          bg:     theme === "dark" ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)",
                          border: theme === "dark" ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.2)",
                          text:   theme === "dark" ? "#60a5fa" : "#2563eb",
                          label:  "Booking",
                        },
                        payment: {
                          bg:     theme === "dark" ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
                          border: theme === "dark" ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.2)",
                          text:   theme === "dark" ? "#34d399" : "#059669",
                          label:  "Payment",
                        },
                        event: {
                          bg:     theme === "dark" ? "rgba(229,255,0,0.08)" : "rgba(202,138,4,0.1)",
                          border: theme === "dark" ? "rgba(229,255,0,0.2)" : "rgba(202,138,4,0.2)",
                          text:   theme === "dark" ? "#e5ff00" : "#b45309",
                          label:  "Event",
                        },
                      };
                      const ts = typeStyles[item.type] || typeStyles.event;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className="group flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-[var(--db-sidebar-link-hover)]"
                          style={{ background: isUnread ? (theme === "dark" ? "rgba(229,255,0,0.03)" : "rgba(15,23,42,0.02)") : "transparent" }}
                        >
                          {/* Icon badge */}
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: ts.bg, border: `1px solid ${ts.border}` }}
                          >
                            {getNotificationIcon(item.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-1 mb-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className="text-[10px] font-black uppercase tracking-wider leading-tight"
                                  style={{ color: theme === "dark" ? "#ffffff" : "#0f172a" }}
                                >{item.title}</span>
                                <span
                                  className="px-1.5 py-px text-[8px] font-bold uppercase tracking-wider rounded-full"
                                  style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}
                                >{ts.label}</span>
                              </div>
                              <span className="text-[9px] text-[var(--db-text-muted)] font-bold uppercase shrink-0 mt-0.5">{formatRelativeTime(item.time)}</span>
                            </div>
                            <p className="text-[11px] text-[var(--db-text-muted)] leading-relaxed line-clamp-2 pr-2">{item.message}</p>
                          </div>

                          {/* Right indicators */}
                          <div className="flex flex-col items-center gap-2 shrink-0 self-center">
                            {isUnread && (
                              <span
                                className="w-2 h-2 rounded-full group-hover:opacity-0 transition-opacity"
                                style={{
                                  background: theme === "dark" ? "#e5ff00" : "#1e293b",
                                  boxShadow: theme === "dark" ? "0 0 8px rgba(229,255,0,0.7)" : "none",
                                }}
                              />
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(e, item.id)}
                              className="p-1 rounded-lg text-[var(--db-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-[var(--db-card-border)] bg-[var(--db-input-bg)] flex items-center justify-center">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--db-text-muted)]">
                      {notifications.length} recent notifications
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Switcher Toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] transition-all cursor-pointer"
          title={theme === "dark" ? "Toggle Light Mode" : "Toggle Dark Mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Vertical divider line */}
        <span className="h-6 w-[1px] bg-[var(--db-card-border)] hidden sm:block" />

        {/* User Profile Dropdown Trigger */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden shrink-0">
              {user && user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-[var(--db-accent-highlight)]" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-[var(--db-text)] line-clamp-1">
                  {user.name}
                </p>
                <ChevronDown
                  size={12}
                  className={`text-[var(--db-text-muted)] transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`}
                />
              </div>
              <p className="text-[9px] text-[var(--db-accent-highlight)] font-semibold uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl p-3 z-50 transition-colors"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-2 pb-3 border-b border-[var(--db-card-border)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {user && user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={18}
                        className="text-[var(--db-accent-highlight)]"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--db-text)] truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[var(--db-text-muted)] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 mt-1 text-[8px] font-bold uppercase tracking-wider text-[var(--db-accent-highlight)] bg-[var(--db-accent-glow)] rounded-full border border-[var(--db-accent-highlight)]/20">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dropdown Actions */}
                <div className="py-1.5 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/dashboard/profile");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer text-left"
                  >
                    <User
                      size={14}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer text-left"
                  >
                    <Settings
                      size={14}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    Settings
                  </button>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-[var(--db-card-border)]">
                  <button
                    onClick={handleHeaderLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer text-left"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Real-time Slide-in Banner Notification */}
      <AnimatePresence>
        {latestNotification && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed top-5 right-4 left-4 sm:left-auto sm:right-5 w-auto sm:w-[380px] bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.3)] overflow-hidden z-[9999] cursor-pointer"
            onClick={() => {
              if (latestNotification.link) {
                navigate(latestNotification.link);
                setLatestNotification(null);
              }
            }}
          >
            {/* Top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[var(--db-accent)] via-[var(--db-accent)]/60 to-transparent" />

            <div className="p-4 flex gap-3 items-start">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[var(--db-accent)] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(229,255,0,0.35)]">
                <Bell size={16} className="text-black" />
              </div>

              {/* Text */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--db-accent-highlight)]">
                    New Activity
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setLatestNotification(null); }}
                    className="p-1 rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
                <h5 className="text-xs font-black text-[var(--db-text)] uppercase tracking-tight mb-0.5">
                  {latestNotification.title}
                </h5>
                <p className="text-[11px] text-[var(--db-text-muted)] leading-relaxed line-clamp-2">
                  {latestNotification.message}
                </p>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              onAnimationComplete={() => setLatestNotification(null)}
              className="h-0.5 bg-[var(--db-accent)]/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;
