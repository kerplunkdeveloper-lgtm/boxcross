import React, { useState, useEffect, useRef } from "react";
import { Menu, User, Sun, Moon, Bell, CheckCheck, CreditCard, Calendar, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getBookings, getPayments, getEventBookings } from "../api/api";

const DashboardHeader = ({ setSidebarOpen, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
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
    activeTitle = "Enquiry Bookings";
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

      // Slice to top 15 notifications
      setNotifications(aggregated.slice(0, 15));
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
  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const updatedReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updatedReadIds);
    localStorage.setItem("boxcross_read_notifications", JSON.stringify(updatedReadIds));
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
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-[var(--db-text-title)]">
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
              <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center animate-pulse">
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
                        className={`py-3 flex items-start gap-3 cursor-pointer hover:bg-[var(--db-sidebar-link-hover)] px-2 rounded-xl transition-colors ${
                          isUnread ? "bg-[var(--db-accent-glow)]/5" : ""
                        }`}
                      >
                        {/* Left notification badge icon */}
                        <div className="w-8 h-8 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] flex items-center justify-center shrink-0 mt-0.5">
                          {getNotificationIcon(item.type)}
                        </div>

                        {/* Middle textual content info */}
                        <div className="flex-grow space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase text-[var(--db-text-title)]">{item.title}</span>
                            <span className="text-[8px] text-[var(--db-text-muted)] font-semibold">{formatRelativeTime(item.time)}</span>
                          </div>
                          <p className="text-[11px] text-[var(--db-text-muted)] leading-normal line-clamp-2">{item.message}</p>
                        </div>

                        {/* Right side unread dot notifier */}
                        {isUnread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--db-accent-highlight)] shrink-0 self-center" />
                        )}
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

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-[var(--db-text)]">{user.name}</p>
            <p className="text-[10px] text-[var(--db-accent-highlight)] font-semibold uppercase tracking-widest">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--db-accent-glow)] to-transparent border border-[var(--db-accent-highlight)]/40 flex items-center justify-center overflow-hidden">
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
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
