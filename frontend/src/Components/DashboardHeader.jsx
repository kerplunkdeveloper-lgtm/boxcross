import React, { useState, useEffect, useRef } from "react";
import { Menu, User, Sun, Moon, Bell, CheckCheck, CreditCard, Calendar, BookOpen, LogOut, Settings, ChevronDown, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getBookings, getPayments, getEventBookings } from "../api/api";
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
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(523.25, now, 0.35); // C5
      playTone(783.99, now + 0.08, 0.45); // G5
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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
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
  }

  // Fetch real-time data and aggregate as notifications
  const fetchNotifications = async () => {
    try {
      let aggregated = [];

      // 1. Fetch Enquiry Bookings
      try {
        const res = await getBookings();
        if (res.data?.success && Array.isArray(res.data.data)) {
          res.data.data.forEach(item => {
            aggregated.push({
              id: `booking-${item._id}`,
              title: "New Enquiry Booking",
              message: `${item.name} scheduled a tour at ${item.time}`,
              time: new Date(item.createdAt || Date.now()),
              type: "booking",
              link: "/dashboard/bookings"
            });
          });
        }
      } catch (e) {
        console.error("Failed to fetch enquiry bookings for notifications", e);
      }

      // 2. Fetch Membership Payments
      try {
        const res = await getPayments();
        if (res.data?.success && Array.isArray(res.data.data)) {
          res.data.data.forEach(item => {
            aggregated.push({
              id: `payment-${item._id}`,
              title: "Membership Payment",
              message: `Payment of ₹${item.amount || item.planPrice || 0} received from user (Status: ${item.status})`,
              time: new Date(item.createdAt || Date.now()),
              type: "payment",
              link: "/dashboard/payments"
            });
          });
        }
      } catch (e) {
        console.error("Failed to fetch membership payments for notifications", e);
      }

      // 3. Fetch Event Bookings
      try {
        const res = await getEventBookings();
        if (res.data?.success && Array.isArray(res.data.data)) {
          res.data.data.forEach(item => {
            aggregated.push({
              id: `event-${item._id}`,
              title: "Event Booking",
              message: `${item.name} registered for ${item.eventName || 'event'} (${item.seats || 1} seats)`,
              time: new Date(item.createdAt || Date.now()),
              type: "event",
              link: "/dashboard/event-payments"
            });
          });
        }
      } catch (e) {
        console.error("Failed to fetch event bookings for notifications", e);
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

      const activeFetched = aggregated.filter(n => !currentDeleted.includes(n.id));

      if (prevIdsRef.current.length > 0) {
        const newItems = activeFetched.filter(n => !prevIdsRef.current.includes(n.id) && !currentRead.includes(n.id));
        if (newItems.length > 0) {
          playNotificationSound();
          setLatestNotification(newItems[0]);
        }
      }

      prevIdsRef.current = activeFetched.map(n => n.id);
      setNotifications(activeFetched.slice(0, 15));
    } catch (err) {
      console.error("Notification aggregation error", err);
    }
  };

  // Fetch immediately and poll every 25 seconds for real-time updates
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
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
  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id) && !deletedIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const updatedReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updatedReadIds);
    localStorage.setItem("boxcross_read_notifications", JSON.stringify(updatedReadIds));
  };

  // Delete notification permanently
  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    const updated = [...deletedIds, id];
    setDeletedIds(updated);
    localStorage.setItem("boxcross_deleted_notifications", JSON.stringify(updated));
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // Mark individual notification as read and navigate
  const handleNotificationClick = (item) => {
    if (!readIds.includes(item.id)) {
      const updatedReadIds = [...readIds, item.id];
      setReadIds(updatedReadIds);
      localStorage.setItem("boxcross_read_notifications", JSON.stringify(updatedReadIds));
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
        return <Calendar size={14} className="text-[var(--db-accent-highlight)]" />;
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
              <span className="absolute top-0.5 right-0.5 bg-[var(--db-accent-highlight)] text-black rounded-full text-[9px] font-black min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-[0_0_10px_rgba(222,251,2,0.4)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showDropdown && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl p-4 z-50 text-left transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--db-card-border)]">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--db-text-title)] flex items-center gap-1.5">
                  <Bell size={12} className="text-[var(--db-accent-highlight)]" />
                  Notifications Center
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[var(--db-accent-highlight)] hover:underline cursor-pointer"
                  >
                    <CheckCheck size={10} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification feed list */}
              <div className="mt-3 max-h-[300px] overflow-y-auto divide-y divide-[var(--db-card-border)] custom-scrollbar pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--db-text-muted)] uppercase tracking-wide">
                    All caught up! No recent activity.
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isUnread = !readIds.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`py-2.5 flex items-start gap-3 cursor-pointer hover:bg-[var(--db-sidebar-link-hover)] px-2 rounded-xl transition-colors group relative ${
                          isUnread ? "bg-[var(--db-accent-glow)]/5" : ""
                        }`}
                      >
                        {/* Left notification badge icon */}
                        <div className="w-8.5 h-8.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:border-[var(--db-accent-highlight)]/40">
                          {getNotificationIcon(item.type)}
                        </div>

                        {/* Middle textual content info */}
                        <div className="flex-grow min-w-0 space-y-0.5 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text)] truncate">{item.title}</span>
                            <span className="text-[8px] text-[var(--db-text-muted)] font-extrabold uppercase shrink-0">{formatRelativeTime(item.time)}</span>
                          </div>
                          <p className="text-[11px] text-[var(--db-text-muted)] leading-relaxed line-clamp-2 pr-6">{item.message}</p>
                        </div>

                        {/* Right side actions and indicators */}
                        <div className="flex items-center gap-1.5 shrink-0 self-center z-10">
                          {isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--db-accent-highlight)] shadow-[0_0_6px_rgba(222,251,2,0.6)] group-hover:opacity-0 transition-opacity" />
                          )}
                          
                          {/* Delete button */}
                          <button
                            onClick={(e) => handleDeleteNotification(e, item.id)}
                            className="p-1.5 rounded-lg text-[var(--db-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 cursor-pointer"
                            title="Delete Notification"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
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
                <p className="text-xs font-bold text-[var(--db-text)] line-clamp-1">{user.name}</p>
                <ChevronDown size={12} className={`text-[var(--db-text-muted)] transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-[9px] text-[var(--db-accent-highlight)] font-semibold uppercase tracking-wider">{user.role}</p>
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
                      <User size={18} className="text-[var(--db-accent-highlight)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[var(--db-text)] truncate">{user.name}</p>
                    <p className="text-[10px] text-[var(--db-text-muted)] truncate">{user.email}</p>
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
                    <User size={14} className="text-[var(--db-accent-highlight)]" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer text-left"
                  >
                    <Settings size={14} className="text-[var(--db-accent-highlight)]" />
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
            initial={{ opacity: 0, y: -20, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, x: 10 }}
            className="fixed top-6 right-6 z-[9999] w-80 sm:w-96 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 flex gap-3 text-left items-start cursor-pointer"
            onClick={() => {
              if (latestNotification.link) {
                navigate(latestNotification.link);
                setLatestNotification(null);
              }
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#defb02]">
              {getNotificationIcon(latestNotification.type)}
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#defb02]">
                  New Activity Alert
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLatestNotification(null);
                  }}
                  className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              <h5 className="text-xs font-bold text-white uppercase tracking-tight">
                {latestNotification.title}
              </h5>
              <p className="text-xs text-gray-400 leading-normal">
                {latestNotification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;
