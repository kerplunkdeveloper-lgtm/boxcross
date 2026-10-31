import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Calendar,
  Filter,
  Trash2,
  Download,
  CheckCircle,
  Tag,
  Clock,
  Phone,
  Mail,
  Award,
  XCircle,
  X,
  Plus,
  Edit2,
  MessageCircle,
  MoreVertical,
  Clipboard,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ChevronDown,
  Ticket,
  TrendingUp,
  BarChart2,
  QrCode,
  RotateCcw,
  CircleDot,
  UserPlus,
  UserCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  getEventBookings,
  deleteEventBooking,
  updateEventBooking,
  getEventsList,
  getEventWalkIns,
  deleteEventWalkIn,
} from "../api/api";
import { toast } from "react-hot-toast";

// Helper function to format date string (e.g. YYYY-MM-DD) into DD / MM / YYYY
const formatDateToDMY = (dateVal) => {
  if (!dateVal) return "-";
  const yyyymmddMatch = String(dateVal).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmddMatch) {
    const [_, year, month, day] = yyyymmddMatch;
    return `${day} / ${month} / ${year}`;
  }
  const dmyMatch = String(dateVal).match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (dmyMatch) {
    const [_, day, month, year] = dmyMatch;
    return `${day} / ${month} / ${year}`;
  }
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

// Helper to parse date string into timestamp for accurate sorting (recent first)
const parseDateToTimestamp = (dateVal, fallbackCreatedAt = null) => {
  if (!dateVal) {
    return fallbackCreatedAt ? new Date(fallbackCreatedAt).getTime() : 0;
  }
  const yyyymmddMatch = String(dateVal).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmddMatch) {
    const [_, y, m, d] = yyyymmddMatch;
    return new Date(`${y}-${m}-${d}T00:00:00`).getTime();
  }
  const dmyMatch = String(dateVal).match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (dmyMatch) {
    const [_, d, m, y] = dmyMatch;
    return new Date(`${y}-${m}-${d}T00:00:00`).getTime();
  }
  const parsed = new Date(dateVal).getTime();
  if (!isNaN(parsed)) return parsed;
  return fallbackCreatedAt ? new Date(fallbackCreatedAt).getTime() : 0;
};

// Normalized date key helper to match regardless of format (YYYY-MM-DD vs DD/MM/YYYY vs ISO)
const normalizeDateKey = (dateVal) => {
  if (!dateVal) return "";
  const str = String(dateVal).trim();
  const yyyymmdd = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmdd) return `${yyyymmdd[1]}-${yyyymmdd[2]}-${yyyymmdd[3]}`;
  const dmy = str.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str;
};

// ─── Formatting Helper for Follow-up Dates ────────────────────────
const formatFollowUpDisplay = (val) => {
  if (!val) return "";

  if (
    val.includes("T") &&
    new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}").test(val)
  ) {
    const d = new Date(val);
    const isToday = d.toDateString() === new Date().toDateString();
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return isToday
      ? `Today, ${timeStr}`
      : `${d.toLocaleDateString("en-US", { day: "numeric", month: "short" })}, ${timeStr}`;
  }

  if (new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(val)) {
    const d = new Date(val);
    const isToday = d.toDateString() === new Date().toDateString();
    return isToday
      ? "Today"
      : d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  }

  return val;
};

// ─── Bottom Analytics Panel (3-column) ───────────────────────────────────────
const EventOverviewPanel = ({
  activeBookings,
  noneCount,
  confirmedCount,
  attendedCount,
  awaitingCount,
  noResponseCount,
  notComingCount,
  totalSlots,
  bookedSlots,
  getNormalizedStatus,
  onSelectBooking,
}) => {
  const total = activeBookings.length;
  const confirmPct =
    total > 0
      ? Math.round(((confirmedCount + attendedCount) / total) * 100)
      : 0;

  // Donut segments
  const segments = [
    {
      label: "None",
      count: noneCount || 0,
      color: "#a1a1aa",
      dotColor: "#71717a",
    },
    {
      label: "Confirmed",
      count: confirmedCount,
      color: "#4ade80",
      dotColor: "#22c55e",
    },
    {
      label: "Attended",
      count: attendedCount,
      color: "#34d399",
      dotColor: "#10b981",
    },
    {
      label: "Awaiting",
      count: awaitingCount,
      color: "#facc15",
      dotColor: "#eab308",
    },
    {
      label: "No Response",
      count: noResponseCount,
      color: "#f87171",
      dotColor: "#ef4444",
    },
    {
      label: "Not Coming",
      count: notComingCount,
      color: "#f97316",
      dotColor: "#ea580c",
    },
  ];

  // Build SVG donut
  const R = 52,
    CX = 70,
    CY = 70,
    stroke = 14;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  const donutArcs = segments.map((seg) => {
    const pct = total > 0 ? seg.count / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const arc = {
      ...seg,
      strokeDasharray: `${dash} ${gap}`,
      strokeDashoffset: -offset * circumference,
    };
    offset += pct;
    return arc;
  });

  // Registration trend: daily cumulative count for last 7 days
  const today = new Date();
  const trendDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const trendData = trendDays.map((day) => {
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    const cumCount = activeBookings.filter(
      (b) => new Date(b.createdAt) <= dayEnd,
    ).length;
    return {
      label: day.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
      }),
      value: cumCount,
    };
  });

  // SVG line chart calculations
  const W = 340,
    H = 110,
    PAD_L = 28,
    PAD_R = 12,
    PAD_T = 14,
    PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const maxVal = Math.max(...trendData.map((d) => d.value), 1);
  const pts = trendData.map((d, i) => ({
    x: PAD_L + (i / (trendData.length - 1)) * chartW,
    y: PAD_T + chartH - (d.value / maxVal) * chartH,
    label: d.label,
    value: d.value,
  }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${pts[0].x},${PAD_T + chartH} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length - 1].x},${PAD_T + chartH} Z`;

  // Scheduled follow-ups
  const scheduledFollowUps = activeBookings
    .filter((b) => b.nextFollowUp && b.nextFollowUp.trim() !== "")
    .sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp));

  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
      {/* ── Col 1: Scheduled Follow-ups ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-5 shadow-xl flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-black uppercase tracking-wider text-[var(--db-text)]"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            Scheduled Follow-ups
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#ccf141] text-black text-[9px] font-black">
              {scheduledFollowUps.length}
            </span>
          </h3>
        </div>
        <div
          className="flex flex-col gap-1 overflow-y-auto"
          style={{ maxHeight: "220px" }}
        >
          {scheduledFollowUps.length === 0 ? (
            <p className="text-[11px] text-[var(--db-text-muted)] italic py-4 text-center">
              No scheduled follow-ups.
            </p>
          ) : (
            scheduledFollowUps.map((b) => (
              <div
                key={b._id}
                onClick={() => onSelectBooking && onSelectBooking(b)}
                className="flex items-center gap-2 xl:gap-3 py-2 border-b border-[var(--db-card-border)] cursor-pointer hover:bg-[var(--db-sidebar-link-hover)] px-2 rounded transition-colors"
              >
                <Clock size={15} className="text-[#eab308] flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12px] font-bold text-[var(--db-text)] truncate">
                    {b.name}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--db-text-muted)] truncate block">
                    {b.phone}
                  </span>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-[11px] font-black text-[#eab308] whitespace-nowrap">
                    {formatFollowUpDisplay(b.nextFollowUp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* ── Col 2: Event Overview donut ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-5 shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-black uppercase tracking-wider text-[var(--db-text)]"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            Event Overview
          </h3>
          <span className="text-[10px] font-bold text-[var(--db-accent-highlight)] cursor-pointer hover:underline">
            View Report
          </span>
        </div>
        <div className="text-[10px] text-[var(--db-text-muted)] font-semibold -mt-2">
          Confirmation Rate
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <svg width="110" height="110" viewBox="0 0 140 140">
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={stroke}
              />
              {donutArcs.map((arc, i) => (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={stroke}
                  strokeDasharray={arc.strokeDasharray}
                  strokeDashoffset={arc.strokeDashoffset}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: `${CX}px ${CY}px`,
                    transition: "stroke-dasharray 0.6s ease",
                  }}
                  strokeLinecap="butt"
                />
              ))}
              <text
                x={CX}
                y={CY - 6}
                textAnchor="middle"
                fill="#fff"
                fontSize="19"
                fontWeight="900"
              >
                {confirmPct}%
              </text>
              <text
                x={CX}
                y={CY + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8.5"
                fontWeight="700"
              >
                {confirmedCount} / {total}
              </text>
            </svg>
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: seg.dotColor }}
                  />
                  <span className="text-[10px] text-[var(--db-text)] font-semibold">
                    {seg.label}
                  </span>
                </div>
                <span className="text-[10px] font-black text-[var(--db-text)] font-mono">
                  {seg.count} (
                  {total > 0 ? Math.round((seg.count / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--db-card-border)] pt-3 flex items-center justify-between">
          <span className="text-[11px] text-[var(--db-text-muted)] font-semibold">
            Seats Filled
          </span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width:
                    totalSlots > 0
                      ? `${Math.min((bookedSlots / totalSlots) * 100, 100)}%`
                      : "0%",
                  background: "linear-gradient(90deg,#ccf141,#a3d900)",
                }}
              />
            </div>
            <span className="text-sm font-black text-[var(--db-accent-highlight)]">
              {bookedSlots}
            </span>
            <span className="text-[11px] text-[var(--db-text-muted)]">
              / {totalSlots}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Col 3: Registration Trend ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-5 shadow-xl flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-black uppercase tracking-wider text-[var(--db-text)]"
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            Registration Trend
          </h3>
          <TrendingUp size={14} className="text-[var(--db-accent-highlight)]" />
        </div>
        <div style={{ minHeight: `${H}px` }}>
          <svg
            width="100%"
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trendGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ccf141" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ccf141" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
              const y = PAD_T + chartH - frac * chartH;
              return (
                <g key={i}>
                  <line
                    x1={PAD_L}
                    y1={y}
                    x2={W - PAD_R}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD_L - 4}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="7"
                  >
                    {Math.round(frac * maxVal)}
                  </text>
                </g>
              );
            })}
            <path d={areaPath} fill="url(#trendGrad2)" />
            <polyline
              points={polyline}
              fill="none"
              stroke="#ccf141"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {pts.map((pt, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={pt.x - 12}
                  y={PAD_T}
                  width={24}
                  height={chartH}
                  fill="transparent"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === i ? 5 : 3.5}
                  fill="#ccf141"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  style={{ transition: "r 0.15s ease" }}
                />
                {hoveredIdx === i && (
                  <>
                    <rect
                      x={pt.x - 14}
                      y={pt.y - 20}
                      width={28}
                      height={14}
                      rx={4}
                      fill="#ccf141"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 9}
                      textAnchor="middle"
                      fill="#000"
                      fontSize="8"
                      fontWeight="900"
                    >
                      {pt.value}
                    </text>
                  </>
                )}
              </g>
            ))}
            {pts.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={H - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="7"
              >
                {pt.label}
              </text>
            ))}
          </svg>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--db-card-border)] pt-2">
          <div className="text-center">
            <div className="text-lg font-black text-[var(--db-accent-highlight)]">
              {trendData[trendData.length - 1].value}
            </div>
            <div className="text-[9px] text-[var(--db-text-muted)] font-bold uppercase tracking-wider">
              Total
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-[var(--db-text)]">
              +
              {Math.max(
                0,
                trendData[trendData.length - 1].value -
                  trendData[trendData.length - 2].value,
              )}
            </div>
            <div className="text-[9px] text-[var(--db-text-muted)] font-bold uppercase tracking-wider">
              Today
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-[var(--db-text)]">
              {(() => {
                const d = trendData.slice(-3);
                const diff = d[2].value - d[0].value;
                return diff >= 0 ? `+${diff}` : diff;
              })()}
            </div>
            <div className="text-[9px] text-[var(--db-text-muted)] font-bold uppercase tracking-wider">
              3 Days
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardEventParticipants = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState(() => {
    try {
      return sessionStorage.getItem("bxc_event_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  // Walk-in participants states
  const [walkIns, setWalkIns] = useState([]);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInEventFilter, setWalkInEventFilter] = useState("all");
  const [walkInSearch, setWalkInSearch] = useState("");
  const [deletingWalkInId, setDeletingWalkInId] = useState(null);

  // Custom interactive CRM states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [newLogActivity, setNewLogActivity] = useState("");
  const [newLogType, setNewLogType] = useState("Call");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const eventDropdownRef = useRef(null);
  const [dateFilter, setDateFilter] = useState(() => {
    try {
      return sessionStorage.getItem("bxc_date_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dateDropdownRef = useRef(null);

  // Helper to persist event selection across pages
  const updateEventFilter = (val) => {
    setEventFilter(val);
    setDateFilter("all");
    setCurrentPage(1);
    try {
      sessionStorage.setItem("bxc_event_filter", val);
      sessionStorage.setItem("bxc_date_filter", "all");
      sessionStorage.setItem("bxc_time_slot_filter", "all");
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to persist schedule date selection across pages
  const updateDateFilter = (val) => {
    setDateFilter(val);
    setCurrentPage(1);
    try {
      sessionStorage.setItem("bxc_date_filter", val);
      sessionStorage.setItem("bxc_time_slot_filter", "all");
    } catch (e) {
      console.error(e);
    }
  };

  // Close event and date dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        eventDropdownRef.current &&
        !eventDropdownRef.current.contains(e.target)
      ) {
        setShowEventDropdown(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      ) {
        setShowDateDropdown(false);
      }
    };
    if (showEventDropdown || showDateDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEventDropdown, showDateDropdown]);

  const fetchBookings = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const [bookingsRes, eventsRes, walkInsRes] = await Promise.all([
        getEventBookings(),
        getEventsList(),
        getEventWalkIns().catch(() => ({ data: { success: false, data: [] } })),
      ]);
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data);
      }
      if (walkInsRes && walkInsRes.data && walkInsRes.data.success) {
        setWalkIns(walkInsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching event data", error);
      toast.error("Failed to load event participants");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings(true);
      const interval = setInterval(() => {
        fetchBookings(false);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Sync edit notes text when selection changes
  useEffect(() => {
    if (selectedBooking) {
      setNoteText(selectedBooking.notes || "");
    }
  }, [selectedBooking]);

  const handleUpdateBooking = async (id, updatedFields) => {
    try {
      const { data } = await updateEventBooking(id, updatedFields);
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, ...data.data } : b)),
        );
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking(data.data);
        }
        toast.success("Record updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update record");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this participant record? This will also revert the booked seat slots.",
      )
    ) {
      return;
    }

    const originalBookings = bookings;
    setBookings((prev) => prev.filter((b) => b._id !== id));
    setDeletingId(id);
    const toastId = toast.loading("Deleting participant record...");
    try {
      const { data } = await deleteEventBooking(id);
      if (data.success) {
        toast.success("Record deleted successfully", { id: toastId });
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking(null);
        }
        fetchBookings(false);
      } else {
        setBookings(originalBookings);
        toast.error("Failed to delete record", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      setBookings(originalBookings);
      toast.error("An error occurred while deleting.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected participant(s)? This will also revert their booked seat slots in the database.`,
      )
    ) {
      return;
    }

    const toastId = toast.loading(`Deleting ${selectedRows.length} records...`);
    const originalBookings = bookings;

    setBookings((prev) => prev.filter((b) => !selectedRows.includes(b._id)));

    try {
      let successCount = 0;
      for (const id of selectedRows) {
        const { data } = await deleteEventBooking(id);
        if (data.success) {
          successCount++;
        }
      }
      toast.success(`Successfully deleted ${successCount} record(s).`, {
        id: toastId,
      });
      setSelectedRows([]);
      setIsSelectMode(false);
      if (selectedBooking && selectedRows.includes(selectedBooking._id)) {
        setSelectedBooking(null);
      }
      fetchBookings(false);
    } catch (error) {
      console.error(error);
      setBookings(originalBookings);
      toast.error("An error occurred during bulk deletion.", { id: toastId });
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedRows.length === 0) return;
    const toastId = toast.loading(`Updating ${selectedRows.length} records...`);
    try {
      let successCount = 0;
      for (const id of selectedRows) {
        const { data } = await updateEventBooking(id, { status: newStatus });
        if (data.success) {
          successCount++;
        }
      }
      fetchBookings(false);
      setSelectedRows([]);
      setShowBulkMenu(false);
      toast.success(`Successfully updated ${successCount} records!`, {
        id: toastId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bulk records", { id: toastId });
    }
  };

  const getNormalizedStatus = (booking) => {
    if (!booking) return "None";
    const status = (booking.status || "").trim();
    if (
      status === "payment successfully" ||
      status === "confirmed" ||
      status === "Confirmed"
    ) {
      return "Confirmed";
    }
    if (status === "Attended" || status === "attended") {
      return "Attended";
    }
    if (
      status === "cancelled" ||
      status === "failed" ||
      status === "notcoming" ||
      status === "Not Coming"
    ) {
      return "Not Coming";
    }
    if (status === "awaiting" || status === "Awaiting") {
      return "Awaiting";
    }
    if (status === "followup" || status === "Follow-up") {
      return "Follow-up";
    }
    if (status === "noresponse" || status === "No Response") {
      return "No Response";
    }
    if (
      status === "None" ||
      status === "none" ||
      status === "not payment" ||
      !status
    ) {
      return "None";
    }

    return "None";
  };

  // Build a map of events to their dates (from events definition & actual bookings)
  const eventScheduleMap = new Map();
  events.forEach((evt) => {
    const title = evt.title;
    if (title && !eventScheduleMap.has(title)) {
      eventScheduleMap.set(title, new Set());
    }
    if (title && evt.schedules) {
      evt.schedules.forEach((sched) => {
        if (sched.date) eventScheduleMap.get(title).add(sched.date);
      });
    }
  });
  bookings.forEach((b) => {
    const title = b.event?.title;
    if (title && b.date) {
      if (!eventScheduleMap.has(title)) eventScheduleMap.set(title, new Set());
      eventScheduleMap.get(title).add(b.date);
    }
  });

  // Helper to determine the latest relevant timestamp for an event (recent first)
  const getEventLatestTimestamp = (title) => {
    let latest = 0;
    const titleKey = (title || "").trim().toLowerCase();

    // 1. From events collection (schedules and createdAt)
    const evt = events.find(
      (e) => (e.title || "").trim().toLowerCase() === titleKey,
    );
    if (evt) {
      if (evt.createdAt) {
        const t = new Date(evt.createdAt).getTime();
        if (!isNaN(t) && t > latest) latest = t;
      }
      if (evt.updatedAt) {
        const t = new Date(evt.updatedAt).getTime();
        if (!isNaN(t) && t > latest) latest = t;
      }
      if (Array.isArray(evt.schedules)) {
        evt.schedules.forEach((s) => {
          if (s?.date) {
            const t = parseDateToTimestamp(s.date, evt.createdAt);
            if (t > latest) latest = t;
          }
        });
      }
    }

    // 2. From bookings collection (event schedule dates, booking createdAt, and event createdAt)
    bookings.forEach((b) => {
      if ((b.event?.title || "").trim().toLowerCase() === titleKey) {
        if (b.event?.createdAt) {
          const t = new Date(b.event.createdAt).getTime();
          if (!isNaN(t) && t > latest) latest = t;
        }
        if (b.date) {
          const t = parseDateToTimestamp(b.date, b.createdAt);
          if (t > latest) latest = t;
        }
        if (b.createdAt) {
          const t = new Date(b.createdAt).getTime();
          if (!isNaN(t) && t > latest) latest = t;
        }
      }
    });

    // 3. Fallback: preserve order in events array (backend returns events sorted by createdAt: -1)
    if (latest === 0 && evt) {
      const idx = events.indexOf(evt);
      if (idx !== -1) {
        latest = (events.length - idx) * 1000;
      }
    }

    return latest;
  };

  // Helper to get image for an event by title
  const getEventImage = (title) => {
    if (!title) return null;
    const clean = title.trim().toLowerCase();
    const ev = events.find((e) => e.title && e.title.trim().toLowerCase() === clean);
    if (ev && ev.imageUrl) return ev.imageUrl;
    const bk = bookings.find(
      (b) => b.event && b.event.title && b.event.title.trim().toLowerCase() === clean && b.event.imageUrl
    );
    if (bk && bk.event && bk.event.imageUrl) return bk.event.imageUrl;
    const wi = walkIns.find(
      (w) => ((w.eventName && w.eventName.trim().toLowerCase() === clean) || (w.event && w.event.title && w.event.title.trim().toLowerCase() === clean)) && (w.event && w.event.imageUrl)
    );
    if (wi && wi.event && wi.event.imageUrl) return wi.event.imageUrl;
    return null;
  };

  // Delete walk-in entry
  const handleDeleteWalkIn = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this walk-in participant?")) {
      return;
    }
    setDeletingWalkInId(id);
    try {
      const res = await deleteEventWalkIn(id);
      if (res.data?.success) {
        toast.success("Walk-in participant deleted");
        setWalkIns((prev) => prev.filter((w) => w._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete walk-in");
    } finally {
      setDeletingWalkInId(null);
    }
  };

  // Export walk-ins to CSV
  const exportWalkInsToCSV = () => {
    const dataToExport = filteredWalkIns;
    if (!dataToExport || dataToExport.length === 0) {
      toast.error("No walk-in participants to export");
      return;
    }
    const headers = ["Name", "Phone", "Event", "Status", "Date Registered"];
    const rows = dataToExport.map((w) => [
      `"${(w.name || "").replace(/"/g, '""')}"`,
      `"${(w.phone || "").replace(/"/g, '""')}"`,
      `"${(w.eventName || w.event?.title || "").replace(/"/g, '""')}"`,
      `"${(w.status || "Attended").replace(/"/g, '""')}"`,
      `"${w.createdAt ? new Date(w.createdAt).toLocaleString() : ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `WalkIns_${walkInEventFilter !== "all" ? walkInEventFilter.replace(/\s+/g, "_") : "AllEvents"}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Walk-ins exported successfully");
  };

  // Calculate distinct events (combine from events list & bookings & walk-ins, sorted by most recent first)
  const uniqueEvents = Array.from(
    new Set([
      ...events.map((e) => e.title),
      ...bookings.map((b) => b.event?.title),
      ...walkIns.map((w) => w.eventName || w.event?.title),
    ].filter(Boolean)),
  ).sort((a, b) => {
    const timeB = getEventLatestTimestamp(b);
    const timeA = getEventLatestTimestamp(a);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    // Fallback tie-breaker: order in events array
    const idxA = events.findIndex((e) => e.title === a);
    const idxB = events.findIndex((e) => e.title === b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    // Further tie-breaker: booking count
    const countB = bookings.filter((x) => x.event?.title === b).length;
    const countA = bookings.filter((x) => x.event?.title === a).length;
    return countB - countA;
  });

  // Filtered Walk-ins for modal view
  const filteredWalkIns = walkIns.filter((w) => {
    const wEvtName = (w.eventName || w.event?.title || "").trim().toLowerCase();
    const matchesEvent =
      walkInEventFilter === "all" ||
      wEvtName === walkInEventFilter.trim().toLowerCase();

    const matchesSearch =
      !walkInSearch ||
      (w.name && w.name.toLowerCase().includes(walkInSearch.toLowerCase())) ||
      (w.phone && w.phone.toLowerCase().includes(walkInSearch.toLowerCase())) ||
      wEvtName.includes(walkInSearch.toLowerCase());

    return matchesEvent && matchesSearch;
  });

  // Available schedule dates (filtered to selected event if chosen, or all distinct dates)
  let availableDates = [];
  if (eventFilter !== "all" && eventScheduleMap.has(eventFilter)) {
    availableDates = Array.from(eventScheduleMap.get(eventFilter)).sort(
      (a, b) => parseDateToTimestamp(b) - parseDateToTimestamp(a),
    );
  } else {
    const allDates = new Set();
    eventScheduleMap.forEach((dates) => {
      dates.forEach((d) => allDates.add(d));
    });
    bookings.forEach((b) => {
      if (b.date) allDates.add(b.date);
    });
    availableDates = Array.from(allDates).sort(
      (a, b) => parseDateToTimestamp(b) - parseDateToTimestamp(a),
    );
  }

  // Auto-reset dateFilter if it was selected for a different event and is not in availableDates
  useEffect(() => {
    if (!loading && availableDates.length > 0 && dateFilter !== "all") {
      const exists = availableDates.some(
        (d) => normalizeDateKey(d) === normalizeDateKey(dateFilter),
      );
      if (!exists) {
        updateDateFilter("all");
      }
    }
  }, [availableDates, dateFilter, loading]);

  // Current active event bookings (filtered by Event & Schedule Date)
  const activeBookings = bookings
    .filter((b) => eventFilter === "all" || b.event?.title === eventFilter)
    .filter(
      (b) =>
        dateFilter === "all" ||
        normalizeDateKey(b.date) === normalizeDateKey(dateFilter),
    );

  // Status-based counts
  const totalRegistrations = activeBookings.length;

  // Booked seats: Only count confirmed & attended bookings (matches DashboardEventPayments)
  const totalSeats = activeBookings
    .filter((b) => {
      const s = (b.status || "").toLowerCase();
      return (
        s === "payment successfully" ||
        s === "confirmed" ||
        s === "attended"
      );
    })
    .reduce((sum, b) => sum + (Number(b.seats) || 1), 0);

  const noneCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "None",
  ).length;

  const confirmedCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Confirmed",
  ).length;

  const attendedCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Attended",
  ).length;

  const awaitingCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Awaiting",
  ).length;

  const followUpCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Follow-up",
  ).length;

  const noResponseCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "No Response",
  ).length;

  const notComingCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Not Coming",
  ).length;

  const getCapacityStats = () => {
    let totalSlots = 0;

    const filteredEvents =
      eventFilter === "all"
        ? events
        : events.filter((e) => (e.title || "") === eventFilter);

    filteredEvents.forEach((evt) => {
      if (evt.schedules) {
        evt.schedules.forEach((sched) => {
          if (
            dateFilter === "all" ||
            normalizeDateKey(sched.date) === normalizeDateKey(dateFilter)
          ) {
            if (sched.timeSlots) {
              sched.timeSlots.forEach((slot) => {
                totalSlots += Number(slot.slots) || 0;
              });
            }
          }
        });
      }
    });

    const availableSlots = Math.max(0, totalSlots - totalSeats);
    return { availableSlots, totalSlots };
  };

  const { availableSlots, totalSlots } = getCapacityStats();

  // Filter based on search & tab status filter
  const filteredBookings = activeBookings.filter((booking) => {
    const query = searchQuery?.toLowerCase() || "";
    const matchesSearch =
      booking.name?.toLowerCase().includes(query) ||
      booking.email?.toLowerCase().includes(query) ||
      booking.phone?.toLowerCase().includes(query);

    let matchesStatus = true;
    const normalized = getNormalizedStatus(booking);
    if (statusFilter === "none") {
      matchesStatus = normalized === "None";
    } else if (statusFilter === "confirmed") {
      matchesStatus = normalized === "Confirmed" || normalized === "Attended";
    } else if (statusFilter === "awaiting") {
      matchesStatus = normalized === "Awaiting";
    } else if (statusFilter === "followup") {
      matchesStatus = normalized === "Follow-up";
    } else if (statusFilter === "noresponse") {
      matchesStatus = normalized === "No Response";
    } else if (statusFilter === "notcoming") {
      matchesStatus = normalized === "Not Coming";
    }

    return matchesSearch && matchesStatus;
  });

  // Set the first booking as selected on initial load or filter change (desktop only)
  useEffect(() => {
    if (filteredBookings.length > 0) {
      const freshBooking = selectedBooking
        ? filteredBookings.find((b) => b._id === selectedBooking._id)
        : null;
      if (freshBooking) {
        setSelectedBooking(freshBooking);
      } else if (window.innerWidth >= 1280) {
        // Only auto-select on desktop to prevent mobile modal from popping up
        setSelectedBooking(filteredBookings[0]);
      }
    } else {
      setSelectedBooking(null);
    }
  }, [bookings, eventFilter, dateFilter, statusFilter, searchQuery]);

  // Client-side pagination
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentItems.map((item) => item._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  // Timeline building with fallback
  const getTimeline = (booking) => {
    if (booking.timeline && booking.timeline.length > 0) {
      return booking.timeline;
    }
    const list = [];
    const dateStr = booking.createdAt
      ? new Date(booking.createdAt).toLocaleString(undefined, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    list.push({
      time: dateStr,
      activity: `Registered - Initiated checkout for ${booking.event?.title || "Event"}`,
      type: "system",
    });

    if (
      booking.status === "payment successfully" ||
      booking.status === "confirmed"
    ) {
      list.push({
        time: dateStr,
        activity: "Confirmed - Will be attending",
        type: "status",
      });
    }
    return list;
  };

  const handleAddTimelineLog = async () => {
    if (!newLogActivity.trim()) return;
    const newLog = {
      time: new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      activity: `${newLogType} - ${newLogActivity}`,
      type: newLogType.toLowerCase(),
    };
    const updatedTimeline = [...(selectedBooking.timeline || []), newLog];
    const lastContactStr = `${new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" })}, ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} ${newLogType} Sent`;

    await handleUpdateBooking(selectedBooking._id, {
      timeline: updatedTimeline,
      lastContact: lastContactStr,
    });
    setNewLogActivity("");
  };

  const handleDeleteTimelineLog = async (idxToDelete) => {
    if (!window.confirm("Are you sure you want to delete this timeline log?"))
      return;
    const updatedTimeline = selectedBooking.timeline.filter(
      (_, idx) => idx !== idxToDelete,
    );
    await handleUpdateBooking(selectedBooking._id, {
      timeline: updatedTimeline,
    });
  };

  const handleSaveNotes = async () => {
    await handleUpdateBooking(selectedBooking._id, { notes: noteText });
    setEditingNotes(false);
  };

  const handleExportToExcel = () => {
    const headers = [
      { name: "Sl. No", width: 70 },
      { name: "Name", width: 220 },
      { name: "Phone", width: 150 },
      { name: "Event Title", width: 220 },
      { name: "Schedule Date", width: 150 },
      { name: "Time Slot", width: 150 },
      { name: "Seats", width: 80 },
      { name: "Status", width: 140 },
      { name: "Last Contact", width: 200 },
      { name: "Follow-up", width: 160 },
      { name: "Notes", width: 350 },
    ];

    const rows = filteredBookings.map((booking, index) => [
      index + 1,
      booking.name || "-",
      booking.phone || "-",
      booking.event?.title || "-",
      formatDateToDMY(booking.date),
      booking.timeSlot || "-",
      booking.seats || 0,
      getNormalizedStatus(booking),
      booking.lastContact || "-",
      booking.nextFollowUp ? formatFollowUpDisplay(booking.nextFollowUp) : "-",
      booking.notes || "-",
    ]);

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Event Participants</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
          th { 
            background-color: #ccf141; 
            color: #111827; 
            font-weight: 800; 
            font-size: 13px;
            border: 1px solid #d1d5db; 
            text-align: left;
            padding: 12px 16px;
            text-transform: uppercase;
          }
          td { 
            color: #374151;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #d1d5db; 
            padding: 10px 16px;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
    `;

    headers.forEach((h) => {
      html += `              <th width="${h.width}">${h.name}</th>\n`;
    });

    html += `            </tr>
          </thead>
          <tbody>
    `;

    rows.forEach((row) => {
      html += `            <tr>\n`;
      row.forEach((cell) => {
        const escapedCell = String(cell)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
        html += `              <td>${escapedCell}</td>\n`;
      });
      html += `            </tr>\n`;
    });

    html += `          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Event_Participants_${new Date().toISOString().split("T")[0]}.xls`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-2 mt-2 space-y-4 sm:space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      <style>{`
        .custom-datetime-picker::-webkit-calendar-picker-indicator {
          filter: invert(1);
          transform: scale(1.1);
          cursor: pointer;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6 relative z-10">
        {/* Header Title + Dynamic Event Button Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--db-card-border)] pb-3.5 sm:pb-4 relative z-40">
          <div className="text-left flex items-center justify-between w-full sm:w-auto">
            <h1
              className="text-lg sm:text-xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
              style={{ fontFamily: '"Brutal Font", sans-serif' }}
            >
              Event Participants
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
            {(eventFilter !== "all" || dateFilter !== "all") && (
              <button
                type="button"
                onClick={() => updateEventFilter("all")}
                className="flex items-center gap-1.5 px-3 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                title="Reset filters to All Events and All Dates"
              >
                <RotateCcw size={11} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Walk-in Participants Button */}
            <button
              type="button"
              onClick={() => {
                setWalkInEventFilter(eventFilter !== "all" ? eventFilter : "all");
                setShowWalkInModal(true);
              }}
              className="px-3.5 py-2 bg-[var(--db-card)] hover:bg-[var(--db-sidebar-link-hover)] text-white hover:text-[#ccf141] border border-[var(--db-card-border)] hover:border-[#ccf141]/40 text-[10px] font-black uppercase rounded-full flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all shadow-md shrink-0"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              title="View Walk-in Participants"
            >
              <UserCheck size={13} className="text-[#ccf141]" />
              <span>Walk-ins</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#ccf141] text-black">
                {eventFilter === "all"
                  ? walkIns.length
                  : walkIns.filter((w) => (w.eventName || w.event?.title) === eventFilter).length}
              </span>
            </button>

            {eventFilter !== "all" && (
              <button 
                onClick={() => setShowQRModal(true)}
                className="px-3.5 py-2 bg-[#ccf141] text-black text-[10px] font-black uppercase rounded-full flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform shadow-md shrink-0"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <QrCode size={13} /> QR Check-in
              </button>
            )}

            {/* Dynamic Event Button Dropdown */}
            <div className="relative z-50" ref={eventDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEventDropdown(!showEventDropdown)}
                className="flex items-center justify-between gap-2.5 h-10 px-4 rounded-full bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[#ccf141]/50 text-xs font-black uppercase tracking-wider text-[var(--db-text)] shadow-lg transition-all cursor-pointer min-w-[200px] sm:min-w-[240px] max-w-[320px] sm:max-w-[420px]"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                title="Filter by Event"
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {eventFilter === "all" ? (
                    <div className="w-5 h-5 rounded-full bg-[#ccf141]/20 flex items-center justify-center text-[#ccf141] shrink-0">
                      <Users size={12} />
                    </div>
                  ) : getEventImage(eventFilter) ? (
                    <img
                      src={getEventImage(eventFilter)}
                      alt={eventFilter}
                      className="w-5 h-5 rounded-md object-cover shrink-0 border border-[#ccf141]/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#ccf141]/20 flex items-center justify-center text-[#ccf141] shrink-0">
                      <Award size={12} />
                    </div>
                  )}
                  <span className="truncate text-[11px] sm:text-xs">
                    {eventFilter === "all" ? "All Events" : eventFilter}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ccf141] text-black shrink-0">
                    {eventFilter === "all"
                      ? bookings.length
                      : bookings.filter((b) => b.event?.title === eventFilter).length}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-gray-400 shrink-0 ${
                    showEventDropdown ? "rotate-180 text-[#ccf141]" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showEventDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setShowEventDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 sm:w-88 md:w-96 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
                    >
                    {/* Dropdown Header with search */}
                    <div className="p-3 border-b border-[var(--db-card-border)] bg-[var(--db-card)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-accent-highlight)]">
                          Select Event ({uniqueEvents.length + 1})
                        </span>
                        {eventFilter !== "all" && (
                          <button
                            type="button"
                            onClick={() => {
                              setEventFilter("all");
                              setCurrentPage(1);
                              setShowEventDropdown(false);
                            }}
                            className="text-[10px] font-bold text-red-400 hover:underline cursor-pointer"
                          >
                            Reset to All
                          </button>
                        )}
                      </div>
                      {uniqueEvents.length > 3 && (
                        <div className="relative">
                          <Search
                            size={12}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                          <input
                            type="text"
                            placeholder="Search event name..."
                            value={eventSearchQuery}
                            onChange={(e) => setEventSearchQuery(e.target.value)}
                            className="w-full h-8 pl-7 pr-3 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-lg text-[11px] text-[var(--db-text)] placeholder-gray-500 outline-none focus:border-[var(--db-accent-highlight)]"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Options List */}
                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                      {/* All Events Option */}
                      {(!eventSearchQuery || "all events".includes(eventSearchQuery.toLowerCase())) && (
                        <button
                          type="button"
                          onClick={() => {
                            updateEventFilter("all");
                            setShowEventDropdown(false);
                            setEventSearchQuery("");
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            eventFilter === "all"
                              ? "bg-[#ccf141] text-black shadow-md font-black"
                              : "hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] font-semibold"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Users
                              size={14}
                              className={
                                eventFilter === "all"
                                  ? "text-black"
                                  : "text-[var(--db-accent-highlight)]"
                              }
                            />
                            <span className="uppercase text-[11px] tracking-wide">
                              All Events
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                eventFilter === "all"
                                  ? "bg-black text-[#ccf141]"
                                  : "bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)]"
                              }`}
                            >
                              {bookings.length}
                            </span>
                            {eventFilter === "all" && (
                              <Check size={14} className="text-black" />
                            )}
                          </div>
                        </button>
                      )}

                      {/* Event Items */}
                      {uniqueEvents
                        .filter((evt) =>
                          !eventSearchQuery ||
                          evt.toLowerCase().includes(eventSearchQuery.toLowerCase()),
                        )
                        .map((evt) => {
                          const count = bookings.filter(
                            (b) => b.event?.title === evt,
                          ).length;
                          const isSelected = eventFilter === evt;
                          return (
                            <button
                              type="button"
                              key={evt}
                              onClick={() => {
                                updateEventFilter(evt);
                                setShowEventDropdown(false);
                                setEventSearchQuery("");
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#ccf141] text-black shadow-md font-black"
                                  : "hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] font-semibold"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {getEventImage(evt) ? (
                                  <img
                                    src={getEventImage(evt)}
                                    alt={evt}
                                    className="w-6 h-6 rounded-md object-cover shrink-0 border border-black/10 shadow-sm"
                                  />
                                ) : (
                                  <Award
                                    size={14}
                                    className={`shrink-0 ${
                                      isSelected
                                        ? "text-black"
                                        : "text-[var(--db-accent-highlight)]"
                                    }`}
                                  />
                                )}
                                <span
                                  className="truncate uppercase text-[11px] tracking-wide"
                                  title={evt}
                                >
                                  {evt}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                    isSelected
                                      ? "bg-black text-[#ccf141]"
                                      : "bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)]"
                                  }`}
                                >
                                  {count}
                                </span>
                                {isSelected && (
                                  <Check size={14} className="text-black" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Event Schedule Date Button Dropdown */}
            <div className="relative z-50" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`flex items-center justify-between gap-2 h-10 px-3.5 rounded-full border text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer whitespace-nowrap ${
                  dateFilter !== "all"
                    ? "bg-[#ccf141] text-black border-[#ccf141]"
                    : "bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[#ccf141]/50 text-[var(--db-text)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                title="Filter by Event Schedule Date"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Calendar
                    size={13}
                    className={dateFilter !== "all" ? "text-black" : "text-[#ccf141]"}
                  />
                  <span>
                    {dateFilter === "all"
                      ? "All Dates"
                      : formatDateToDMY(dateFilter)}
                  </span>
                  {dateFilter !== "all" && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black text-[#ccf141]">
                      {activeBookings.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    dateFilter !== "all" ? "text-black" : "text-gray-400"
                  } ${showDateDropdown ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showDateDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setShowDateDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-3 border-b border-[var(--db-card-border)] bg-[var(--db-card)] flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-accent-highlight)]">
                          Schedule Dates {availableDates.length > 0 ? `(${availableDates.length})` : ""}
                        </span>
                        {dateFilter !== "all" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateDateFilter("all");
                              setShowDateDropdown(false);
                            }}
                            className="text-[10px] font-bold text-red-400 hover:underline cursor-pointer"
                          >
                            All Dates
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                        {/* All Dates option */}
                        <button
                          type="button"
                          onClick={() => {
                            updateDateFilter("all");
                            setShowDateDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            dateFilter === "all"
                              ? "bg-[#ccf141] text-black shadow-md font-black"
                              : "hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] font-semibold"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={13}
                              className={dateFilter === "all" ? "text-black" : "text-[#ccf141]"}
                            />
                            <span className="uppercase text-[11px] tracking-wide">
                              All Schedule Dates
                            </span>
                          </div>
                          {dateFilter === "all" && <Check size={14} className="text-black" />}
                        </button>

                        {availableDates.map((d) => {
                          const isSelected = normalizeDateKey(dateFilter) === normalizeDateKey(d);
                          const dateCount = bookings.filter((b) => {
                            const matchE = eventFilter === "all" || b.event?.title === eventFilter;
                            const matchD = normalizeDateKey(b.date) === normalizeDateKey(d);
                            return matchE && matchD;
                          }).length;

                          return (
                            <button
                              type="button"
                              key={d}
                              onClick={() => {
                                updateDateFilter(d);
                                setShowDateDropdown(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#ccf141] text-black shadow-md font-black"
                                  : "hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] font-semibold"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={13}
                                  className={isSelected ? "text-black" : "text-[#ccf141]"}
                                />
                                <span className="font-mono text-xs">
                                  {formatDateToDMY(d)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                    isSelected
                                      ? "bg-black text-[#ccf141]"
                                      : "bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)]"
                                  }`}
                                >
                                  {dateCount}
                                </span>
                                {isSelected && <Check size={14} className="text-black" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats Grid - 6 Cards Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {/* Card 1: Total Slots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-blue-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Total Slots"
              >
                Total Slots
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
                <Ticket size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-blue-400 font-mono leading-none tracking-tight">
                {totalSlots}
              </h3>
            </div>
          </motion.div>

          {/* Card 2: Booked Slots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.04 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-cyan-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Booked Slots"
              >
                Booked Slots
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Ticket size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono leading-none tracking-tight">
                {totalSeats}
              </h3>
            </div>
          </motion.div>

          {/* Card 3: Remaining Slots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Remaining Slots"
              >
                Remaining Slots
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <Ticket size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-purple-400 font-mono leading-none tracking-tight">
                {availableSlots}
              </h3>
            </div>
          </motion.div>

          {/* Card 4: Confirmed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-green-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Confirmed"
              >
                Confirmed
              </span>
              <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.15)]">
                <Check size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-green-400 font-mono leading-none tracking-tight">
                {confirmedCount}
              </h3>
            </div>
          </motion.div>

          {/* Card 5: Attend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[#ccf141]/50 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Attend"
              >
                Attend
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center text-[#ccf141] shrink-0 shadow-[0_0_12px_rgba(204,241,65,0.15)]">
                <Award size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#ccf141] font-mono leading-none tracking-tight">
                {attendedCount}
              </h3>
            </div>
          </motion.div>

          {/* Card 6: Not Coming */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-red-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden group min-h-[96px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] group-hover:text-[var(--db-text)] transition-colors truncate"
                title="Not Coming"
              >
                Not Coming
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
                <XCircle size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-red-400 font-mono leading-none tracking-tight">
                {notComingCount}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Main layout: Left content + Right sidebar */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left column: Table + Analytics */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Left Table Panel */}
            <motion.div
              layout
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-4 sm:p-5 md:p-6 shadow-2xl transition-all duration-300 w-full min-w-0"
            >
              {/* Table Header controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-6 pb-4 border-b border-[var(--db-card-border)]">
                {/* Left: Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    All ({activeBookings.length})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("none");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "none"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    None ({noneCount})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("confirmed");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "confirmed"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Confirmed ({confirmedCount})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("awaiting");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "awaiting"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Awaiting ({awaitingCount})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("followup");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "followup"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Follow-up ({followUpCount})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("noresponse");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "noresponse"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    No Response ({noResponseCount})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("notcoming");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "notcoming"
                        ? "bg-[#ccf141] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Not Coming ({notComingCount})
                  </button>
                </div>

                {/* Right: Options Menu */}
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={handleExportToExcel}
                    className="flex items-center gap-1.5 h-8 px-3 bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] hover:bg-[#ccf141]/20 text-[10px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <Download size={11} /> Export to Excel
                  </button>

                  {isSelectMode && selectedRows.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 h-8 px-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      <Trash2 size={11} /> Delete Selected (
                      {selectedRows.length})
                    </button>
                  )}

                  <button
                    onClick={() => setShowManageMenu(!showManageMenu)}
                    className="flex items-center justify-center w-8 h-8 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] rounded-full transition-all cursor-pointer"
                    title="Options"
                  >
                    <MoreVertical size={13} />
                  </button>

                  <AnimatePresence>
                    {showManageMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 top-8 w-44 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setIsSelectMode(!isSelectMode);
                            setSelectedRows([]);
                            setShowManageMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] cursor-pointer"
                        >
                          {isSelectMode ? "Hide Checkboxes" : "Show Checkboxes"}
                        </button>
                        <button
                          onClick={() => {
                            setIsSelectMode(true);
                            const allIds = currentItems.map((b) => b._id);
                            setSelectedRows(allIds);
                            setShowManageMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--db-sidebar-link-hover)] border-t border-[var(--db-card-border)] text-[var(--db-text)] cursor-pointer"
                        >
                          Select All
                        </button>
                        {isSelectMode && (
                          <button
                            onClick={() => {
                              setSelectedRows([]);
                              setShowManageMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-[var(--db-sidebar-link-hover)] border-t border-[var(--db-card-border)] text-[var(--db-text)] cursor-pointer"
                          >
                            Deselect All
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-[var(--db-text-muted)] text-xs gap-2">
                  <svg
                    className="animate-spin h-6 w-6 text-[var(--db-accent-highlight)]"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Loading event participants...</span>
                </div>
              ) : currentItems.length > 0 ? (
                <>
                  {/* Mobile Cards View */}
                  <div className="block md:hidden space-y-3">
                    {currentItems.map((booking, index) => {
                      const isSelected = selectedBooking && selectedBooking._id === booking._id;
                      const ns = getNormalizedStatus(booking);
                      const statusColorMap = {
                        None: "border-zinc-500/30 text-zinc-400 bg-zinc-500/10",
                        Confirmed: "border-green-500/30 text-green-400 bg-green-500/10",
                        Attended: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
                        Awaiting: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
                        "Follow-up": "border-blue-500/30 text-blue-400 bg-blue-500/10",
                        "No Response": "border-gray-500/30 text-gray-400 bg-gray-500/10",
                        "Not Coming": "border-red-500/30 text-red-400 bg-red-500/10",
                      };

                      return (
                        <div
                          key={booking._id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[#ccf141]/50 rounded-2xl p-4 space-y-3 shadow-lg cursor-pointer transition-all ${
                            isSelected ? "border-[var(--db-accent-highlight)] shadow-[0_0_15px_rgba(204,241,65,0.15)]" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ccf141]/20 to-[#ccf141]/5 border border-[#ccf141]/20 flex items-center justify-center text-[#ccf141] font-black text-[10px] flex-shrink-0">
                                  {booking.name.charAt(0).toUpperCase()}
                                </div>
                                <h4 className="font-bold text-sm text-[var(--db-text)] truncate">{booking.name}</h4>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] font-bold">
                                  #{indexOfFirstItem + index + 1}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)]">
                                  {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${statusColorMap[ns] || "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}>
                                  {ns}
                                </span>
                                {booking.date && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/20 font-bold flex items-center gap-1">
                                    <Calendar size={10} />
                                    {formatDateToDMY(booking.date)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBooking(booking._id);
                              }}
                              className="p-2 text-[var(--db-text-muted)] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete Participant"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Contacts */}
                          <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-[var(--db-card-border)]/50" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`tel:${booking.phone}`}
                              className="flex items-center gap-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] font-mono text-[11px]"
                            >
                              <Phone size={12} className="text-gray-500" />
                              <span>{booking.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${booking.phone}?text=Hi ${booking.name}, this is Box %26 Cross regarding your registration...`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold inline-flex items-center gap-1"
                            >
                              WhatsApp
                            </a>
                          </div>

                          {/* Follow up & notes snippet */}
                          {(booking.nextFollowUp || booking.notes) && (
                            <div className="text-[10px] text-[var(--db-text-muted)] bg-[var(--db-card)]/60 rounded-xl p-2 space-y-1">
                              {booking.nextFollowUp && (
                                <div className="flex items-center gap-1 text-[#eab308]">
                                  <Clock size={10} />
                                  <span>Next Follow-up: {formatFollowUpDisplay(booking.nextFollowUp)}</span>
                                </div>
                              )}
                              {booking.notes && (
                                <p className="line-clamp-1 italic text-[10px] text-[var(--db-text-muted)]">
                                  Note: {booking.notes}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-[var(--db-text-muted)] pt-1">
                            <span>Tap to open CRM details</span>
                            <span className="text-[var(--db-accent-highlight)] font-bold">Details →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto w-full custom-scrollbar pb-2">
                    <table
                      className="w-full text-left border-collapse table-fixed"
                      style={{ minWidth: "1100px" }}
                    >
                    <colgroup>
                      {isSelectMode && <col style={{ width: "3%" }} />}
                      <col style={{ width: "5%" }} /> {/* Sl.No */}
                      <col style={{ width: "14%" }} /> {/* Name */}
                      <col style={{ width: "11%" }} /> {/* Phone */}
                      <col style={{ width: "12%" }} /> {/* Event Date */}
                      <col style={{ width: "5%" }} /> {/* Seats */}
                      <col style={{ width: "12%" }} /> {/* Status */}
                      <col style={{ width: "15%" }} /> {/* Last Contact */}
                      <col style={{ width: "12%" }} /> {/* Follow-up */}
                      <col style={{ width: "12%" }} /> {/* Notes */}
                      <col style={{ width: "8%" }} /> {/* Actions */}
                    </colgroup>
                    <thead>
                      <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[12px] uppercase font-extrabold tracking-wider">
                        {isSelectMode && (
                          <th className="py-2.5 px-2 w-7">
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                currentItems.length > 0 &&
                                selectedRows.length === currentItems.length
                              }
                              className="rounded border-[var(--db-card-border)] bg-[var(--db-input-bg)] focus:ring-[var(--db-accent-highlight)] cursor-pointer"
                            />
                          </th>
                        )}
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Sl.No
                        </th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Name</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Phone</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[#ccf141]">
                            <Calendar size={12} />
                            <span>Event Date</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Seats
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Status
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Last Contact
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Follow-up
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Notes
                        </th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--db-card-border)]">
                      {currentItems.map((booking, index) => {
                        const isSelected =
                          selectedBooking &&
                          selectedBooking._id === booking._id;
                        return (
                          <tr
                            key={booking._id}
                            onClick={() => setSelectedBooking(booking)}
                            className={`group hover:bg-[#1a1a1a] transition-all cursor-pointer border-l-[3px] border-transparent hover:border-[#ccf141] ${
                              isSelected
                                ? "bg-[#1a1a1a] !border-l-[3px] !border-[#ccf141] shadow-[inset_0_0_20px_rgba(204,241,65,0.03)]"
                                : ""
                            }`}
                          >
                            {/* Checkbox */}
                            {isSelectMode && (
                              <td
                                className="py-2 px-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(booking._id)}
                                  onChange={() => handleSelectRow(booking._id)}
                                  className="rounded border-[var(--db-card-border)] bg-[var(--db-input-bg)] focus:ring-[var(--db-accent-highlight)] cursor-pointer"
                                />
                              </td>
                            )}

                            {/* Sl.No */}
                            <td className="py-2 px-2 text-center font-mono font-bold text-xs text-[var(--db-text-muted)] whitespace-nowrap">
                              {indexOfFirstItem + index + 1}
                            </td>

                            {/* Name */}
                            <td className="py-2 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ccf141]/20 to-[#ccf141]/5 border border-[#ccf141]/20 flex items-center justify-center text-[#ccf141] font-black text-[10px] flex-shrink-0 group-hover:scale-110 transition-transform">
                                  {booking.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-[var(--db-text)] text-[12px] truncate max-w-[110px]" title={booking.name}>
                                  {booking.name}
                                </span>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="py-2 px-3 text-[14px] text-[var(--db-text-muted)] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Phone size={11} className="text-gray-500" />
                                <span className="font-mono">
                                  {booking.phone}
                                </span>
                              </div>
                            </td>

                            {/* Event Date & Time */}
                            <td className="py-2 px-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-[#ccf141] font-mono">
                                  <Calendar size={11} className="shrink-0" />
                                  <span>{formatDateToDMY(booking.date)}</span>
                                </div>
                                {booking.timeSlot && (
                                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono mt-0.5">
                                    <Clock size={10} className="shrink-0 text-gray-500" />
                                    <span className="truncate max-w-[130px]" title={booking.timeSlot}>
                                      {booking.timeSlot}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Seats */}
                            <td className="py-2 px-2 text-center text-[14px] font-black text-[var(--db-text)]">
                              {booking.seats}
                            </td>

                            {/* Status */}
                            <td
                              className="py-2 px-2 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(() => {
                                const ns = getNormalizedStatus(booking);
                                const statusColorMap = {
                                  None:
                                    "border-zinc-500/30 text-zinc-400 bg-zinc-500/10",
                                  Confirmed:
                                    "border-green-500/30 text-green-400 bg-green-500/10",
                                  Attended:
                                    "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                                  Awaiting:
                                    "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
                                  "Follow-up":
                                    "border-blue-500/30 text-blue-400 bg-blue-500/10",
                                  "No Response":
                                    "border-gray-500/30 text-gray-400 bg-gray-500/10",
                                  "Not Coming":
                                    "border-red-500/30 text-red-400 bg-red-500/10",
                                };
                                return (
                                  <select
                                    value={ns}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const toDb = {
                                        None: "None",
                                        Confirmed: "payment successfully",
                                        Attended: "Attended",
                                        Awaiting: "Awaiting",
                                        "Follow-up": "Follow-up",
                                        "No Response": "No Response",
                                        "Not Coming": "cancelled",
                                      };
                                      handleUpdateBooking(booking._id, {
                                        status: toDb[val] || val,
                                      });
                                    }}
                                    className={`px-1.5 py-0.5 rounded-sm text-[13px] uppercase tracking-wider font-extrabold border cursor-pointer focus:outline-none transition-all ${statusColorMap[ns] || "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}
                                  >
                                    <option
                                      value="None"
                                      className="bg-[#121212] text-zinc-400"
                                    >
                                      None
                                    </option>
                                    <option
                                      value="Confirmed"
                                      className="bg-[#121212] text-green-400"
                                    >
                                      Confirmed
                                    </option>
                                    <option
                                      value="Attended"
                                      className="bg-[#121212] text-emerald-400"
                                    >
                                      Attended
                                    </option>
                                    <option
                                      value="Awaiting"
                                      className="bg-[#121212] text-yellow-400"
                                    >
                                      Awaiting
                                    </option>
                                    <option
                                      value="Follow-up"
                                      className="bg-[#121212] text-blue-400"
                                    >
                                      Follow-up
                                    </option>
                                    <option
                                      value="No Response"
                                      className="bg-[#121212] text-gray-400"
                                    >
                                      No Response
                                    </option>
                                    <option
                                      value="Not Coming"
                                      className="bg-[#121212] text-red-400"
                                    >
                                      Not Coming
                                    </option>
                                  </select>
                                );
                              })()}
                            </td>

                            {/* Last Contact */}
                            <td
                              className="py-2 px-2 align-middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <textarea
                                key={
                                  booking._id +
                                  "-lc-" +
                                  (booking.lastContact || "")
                                }
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = "auto";
                                    el.style.height = el.scrollHeight + "px";
                                  }
                                }}
                                defaultValue={booking.lastContact || ""}
                                rows={1}
                                onInput={(e) => {
                                  e.target.style.height = "auto";
                                  e.target.style.height =
                                    e.target.scrollHeight + "px";
                                }}
                                onBlur={(e) => {
                                  if (
                                    e.target.value !==
                                    (booking.lastContact || "")
                                  ) {
                                    handleUpdateBooking(booking._id, {
                                      lastContact: e.target.value,
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey)
                                    e.target.blur();
                                }}
                                placeholder="-"
                                className="w-full bg-transparent border-b border-transparent hover:border-gray-700 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[var(--db-text)] text-[10px] font-semibold text-center leading-snug px-1 py-0.5 focus:outline-none transition-all rounded resize-none overflow-hidden"
                              />
                            </td>

                            {/* Next Follow-up */}
                            <td
                              className="py-2 px-2 align-middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                key={
                                  booking._id +
                                  "-nf-" +
                                  (booking.nextFollowUp || "")
                                }
                                type="datetime-local"
                                defaultValue={(() => {
                                  if (!booking.nextFollowUp) return "";
                                  const val = String(booking.nextFollowUp);
                                  if (
                                    new RegExp(
                                      "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}",
                                    ).test(val)
                                  )
                                    return val;
                                  if (
                                    new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(
                                      val,
                                    )
                                  )
                                    return `${val}T09:00`;
                                  return "";
                                })()}
                                onBlur={(e) => {
                                  if (
                                    e.target.value !==
                                    (booking.nextFollowUp || "")
                                  ) {
                                    handleUpdateBooking(booking._id, {
                                      nextFollowUp: e.target.value,
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") e.target.blur();
                                }}
                                className="custom-datetime-picker w-full bg-transparent border-b border-transparent hover:border-gray-700 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[10px] font-extrabold text-orange-400 text-center leading-snug px-1 py-0.5 focus:outline-none transition-all rounded"
                              />
                            </td>

                            {/* Notes */}
                            <td
                              className="py-2 px-2 align-middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <textarea
                                key={
                                  booking._id + "-nt-" + (booking.notes || "")
                                }
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = "auto";
                                    el.style.height = el.scrollHeight + "px";
                                  }
                                }}
                                defaultValue={booking.notes || ""}
                                rows={1}
                                onInput={(e) => {
                                  e.target.style.height = "auto";
                                  e.target.style.height =
                                    e.target.scrollHeight + "px";
                                }}
                                onBlur={(e) => {
                                  if (
                                    e.target.value !== (booking.notes || "")
                                  ) {
                                    handleUpdateBooking(booking._id, {
                                      notes: e.target.value,
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey)
                                    e.target.blur();
                                }}
                                placeholder="-"
                                className="w-full bg-transparent border-b border-transparent hover:border-gray-700 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[var(--db-text)] text-[10px] text-center leading-snug px-1 py-0.5 focus:outline-none transition-all rounded resize-none overflow-hidden"
                              />
                            </td>

                            {/* Actions */}
                            <td
                              className="py-4 px-3 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1.5 relative">
                                <a
                                  href={`https://wa.me/${booking.phone}?text=Hi ${booking.name}, this is Box & Cross regarding your registration for ${booking.event?.title || "our event"}...`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 hover:bg-green-500/10 text-green-400 rounded-md transition-all cursor-pointer"
                                  title="Send WhatsApp Message"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                </a>
                                <a
                                  href={`tel:${booking.phone}`}
                                  className="p-1.5 hover:bg-yellow-500/10 text-yellow-400 rounded-md transition-all cursor-pointer"
                                  title="Call Participant"
                                >
                                  <Phone size={18} />
                                </a>
                                <button
                                  onClick={() => setSelectedBooking(booking)}
                                  className="p-1.5 hover:bg-purple-500/10 text-purple-400 rounded-md transition-all cursor-pointer"
                                  title="Edit notes & timeline"
                                >
                                  <Clipboard size={18} />
                                </button>

                                {/* 3-dots actions menu */}
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setActiveMenuId(
                                        activeMenuId === booking._id
                                          ? null
                                          : booking._id,
                                      )
                                    }
                                    className="p-1.5 hover:bg-gray-500/10 text-[var(--db-text-muted)] rounded-md transition-all cursor-pointer"
                                  >
                                    <MoreVertical size={18} />
                                  </button>
                                  <AnimatePresence>
                                    {activeMenuId === booking._id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setActiveMenuId(null)}
                                        />
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          className="absolute right-0 bottom-8 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-xl z-50 w-36 overflow-hidden"
                                        >
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "payment successfully",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-green-400 cursor-pointer"
                                          >
                                            ✓ Confirmed
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "Attended",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-emerald-400 cursor-pointer"
                                          >
                                            🏆 Attended
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "Awaiting",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-yellow-400 cursor-pointer"
                                          >
                                            ⏳ Awaiting
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "Follow-up",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-blue-400 cursor-pointer"
                                          >
                                            🔄 Follow-up
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "No Response",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-gray-400 cursor-pointer"
                                          >
                                            📵 No Response
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleUpdateBooking(booking._id, {
                                                status: "cancelled",
                                              });
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-red-400 cursor-pointer"
                                          >
                                            ✗ Not Coming
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDeleteBooking(booking._id);
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-red-500 border-t border-[var(--db-card-border)] cursor-pointer"
                                          >
                                            🗑 Delete Record
                                          </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
              ) : (
                <div className="py-12 text-center text-gray-500 text-xs">
                  No matching participant records found.
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--db-card-border)]">
                  <span className="text-xs text-[var(--db-text-muted)] font-bold">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
                    {filteredBookings.length} entries
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#ccf141] text-black shadow-md font-black"
                              : "border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bottom Analytics — 3 columns */}
            <EventOverviewPanel
              activeBookings={activeBookings}
              noneCount={noneCount}
              confirmedCount={confirmedCount}
              attendedCount={attendedCount}
              awaitingCount={awaitingCount}
              noResponseCount={noResponseCount}
              notComingCount={notComingCount}
              totalSlots={totalSlots}
              bookedSlots={totalSeats}
              getNormalizedStatus={getNormalizedStatus}
              onSelectBooking={setSelectedBooking}
            />
          </div>
          {/* end left column */}

          {/* Right Sliding Detail Panel */}
          <AnimatePresence>
            {selectedBooking && (
              <>
                {/* Mobile Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm"
                  onClick={() => setSelectedBooking(null)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 100, x: 0 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 100, x: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-[var(--db-card)] border-t border-[var(--db-card-border)] rounded-t-[32px] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar xl:sticky xl:z-20 xl:h-[calc(100vh-48px)] xl:w-[310px] 2xl:w-[330px] xl:border xl:rounded-[24px] xl:p-5 xl:shadow-2xl xl:top-[24px] flex flex-col gap-5 xl:gap-6"
                >
                  {/* Close button for mobile */}
                  <div className="absolute top-4 right-4 xl:hidden z-10">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-full text-[var(--db-text-muted)] hover:text-white cursor-pointer transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Panel Header */}
                  <div className="flex items-start justify-between pr-10 xl:pr-0">
                    <div className="flex items-start justify-between w-full">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h2 className="text-xl font-black text-[var(--db-text)] uppercase tracking-wide leading-tight break-words">
                          {selectedBooking.name}
                        </h2>
                        {(() => {
                          const ns = getNormalizedStatus(selectedBooking);
                          const statusColorMap = {
                            None:
                              "border-zinc-500/30 text-zinc-400 bg-zinc-500/10",
                            Confirmed:
                              "border-green-500/30 text-green-400 bg-green-500/10",
                            Attended:
                              "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
                            Awaiting:
                              "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
                            "Follow-up":
                              "border-blue-500/30 text-blue-400 bg-blue-500/10",
                            "No Response":
                              "border-gray-500/30 text-gray-400 bg-gray-500/10",
                            "Not Coming":
                              "border-red-500/30 text-red-400 bg-red-500/10",
                          };
                          return (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[12px] uppercase tracking-widest font-black border ${statusColorMap[ns] || "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}
                            >
                              {ns}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Quick Attendance Checkbox */}
                      <button
                        onClick={() => {
                          const isAttended =
                            getNormalizedStatus(selectedBooking) === "Attended";
                          handleUpdateBooking(selectedBooking._id, {
                            status: isAttended ? "Confirmed" : "Attended",
                          });
                        }}
                        className={`ml-3 mt-1 flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                          getNormalizedStatus(selectedBooking) === "Attended"
                            ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            : "border-[var(--db-card-border)] bg-[var(--db-input-bg)] hover:border-cyan-500/50"
                        }`}
                        title={
                          getNormalizedStatus(selectedBooking) === "Attended"
                            ? "Revert to Confirmed"
                            : "Mark as Attended"
                        }
                      >
                        {getNormalizedStatus(selectedBooking) ===
                          "Attended" && <Check size={16} strokeWidth={4} />}
                      </button>
                    </div>
                  </div>
                  {/* Direct Contacts */}
                  <div className="space-y-2 pb-3 border-b border-[var(--db-card-border)]">
                    <div className="flex items-center gap-1.5 text-[12px] text-[var(--db-text-muted)] font-semibold">
                      <Phone size={11} className="text-gray-500" />
                      <span className="font-mono">{selectedBooking.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[var(--db-text-muted)] font-semibold truncate">
                      <Mail size={11} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{selectedBooking.email}</span>
                    </div>
                  </div>

                  {/* Grid stats */}
                  <div className="grid grid-cols-2 gap-2.5 pb-4 border-b border-[var(--db-card-border)]">
                    <div className="bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] rounded-xl p-3">
                      <div className="text-[10px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">
                        Seats Reserved
                      </div>
                      <div className="text-lg font-black font-mono mt-0.5 text-cyan-400">
                        {selectedBooking.seats || 1}
                      </div>
                    </div>
                    <div className="bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] rounded-xl p-3">
                      <div className="text-[10px] text-[var(--db-text-muted)] font-black uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={11} className="text-[#ccf141]" />
                        Event Date
                      </div>
                      <div className="text-xs font-mono font-bold text-[#ccf141] mt-0.5">
                        {formatDateToDMY(selectedBooking.date)}
                        {selectedBooking.timeSlot && (
                          <div className="text-[10px] text-[var(--db-text)] font-semibold mt-0.5">
                            {selectedBooking.timeSlot}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] rounded-xl p-3">
                      <div className="text-[10px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">
                        Registered On
                      </div>
                      <div className="text-xs font-bold mt-0.5 text-[var(--db-text)] font-mono">
                        {selectedBooking.createdAt
                          ? new Date(
                              selectedBooking.createdAt,
                            ).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) +
                            ` at ${new Date(selectedBooking.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                      Communication Timeline
                    </h3>

                    <div className="relative border-l border-gray-700 pl-4 space-y-4 ml-2">
                      {getTimeline(selectedBooking).map((item, idx) => (
                        <div key={idx} className="relative group">
                          {/* Status timeline node marker */}
                          <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--db-accent-highlight)] border border-[var(--db-card)]" />
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-[10px] text-gray-500 font-extrabold">
                                {item.time}
                              </div>
                              <div className="text-[11px] text-[var(--db-text)] font-semibold mt-0.5 leading-relaxed">
                                {item.activity}
                              </div>
                            </div>
                            {selectedBooking.timeline &&
                              selectedBooking.timeline.length > 0 && (
                                <button
                                  onClick={() => handleDeleteTimelineLog(idx)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all ml-2"
                                  title="Delete Log"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Log Form */}
                    <div className="bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl p-3 space-y-2 mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
                          Log Interaction
                        </span>
                        <select
                          value={newLogType}
                          onChange={(e) => setNewLogType(e.target.value)}
                          className="bg-transparent border-none text-[10px] font-bold text-[var(--db-accent-highlight)] outline-none cursor-pointer"
                        >
                          <option value="Call" className="bg-[var(--db-card)]">
                            Call
                          </option>
                          <option
                            value="WhatsApp"
                            className="bg-[var(--db-card)]"
                          >
                            WhatsApp
                          </option>
                          <option value="Email" className="bg-[var(--db-card)]">
                            Email
                          </option>
                          <option
                            value="Status"
                            className="bg-[var(--db-card)]"
                          >
                            Status
                          </option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Log detail (e.g. Spoke to attendee)..."
                          value={newLogActivity}
                          onChange={(e) => setNewLogActivity(e.target.value)}
                          className="w-full bg-transparent border-none text-xs text-[var(--db-text)] placeholder-gray-600 outline-none"
                        />
                        <button
                          onClick={handleAddTimelineLog}
                          className="p-1 text-[var(--db-accent-highlight)] hover:scale-110 transition-all cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3 pt-4 border-t border-[var(--db-card-border)]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                        Notes
                      </h3>
                      <button
                        onClick={() => setEditingNotes(!editingNotes)}
                        className="p-1 text-gray-500 hover:text-[var(--db-text)] transition-colors cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>

                    {editingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Write custom notes for this participant..."
                          className="w-full h-16 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-lg p-2 text-xs text-[var(--db-text)] outline-none resize-none focus:border-[var(--db-accent-highlight)]"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNotes(false)}
                            className="px-2.5 py-1 rounded text-[10px] font-bold border border-[var(--db-card-border)] text-[var(--db-text-muted)] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNotes}
                            className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#ccf141] text-black cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[var(--db-text-muted)] leading-relaxed italic whitespace-pre-wrap">
                        {selectedBooking.notes || "No custom notes recorded."}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2 pt-4 border-t border-[var(--db-card-border)]">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                      Quick Actions
                    </h3>
                    <a
                      href={`https://wa.me/${selectedBooking.phone}?text=Hi ${selectedBooking.name}, this is Box %26 Cross regarding your registration...`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-green-500/20 hover:scale-[1.02] shadow-[0_4px_15px_rgba(34,197,94,0.15)] transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Send WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#ccf141]/20 to-[#ccf141]/5 border border-[#ccf141]/30 text-[#ccf141] hover:from-[#ccf141]/30 hover:to-[#ccf141]/15 hover:scale-[1.02] shadow-[0_4px_15px_rgba(204,241,65,0.15)] transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      <Phone size={13} /> Call Now
                    </a>
                    <button
                      onClick={() =>
                        handleUpdateBooking(selectedBooking._id, {
                          status: "None",
                        })
                      }
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] hover:scale-[1.02] transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      <CircleDot size={13} /> Reset to None
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateBooking(selectedBooking._id, {
                          status: "Awaiting",
                        })
                      }
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] hover:scale-[1.02] transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      <Clock size={13} /> Mark Awaiting
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateBooking(selectedBooking._id, {
                          status: "cancelled",
                        })
                      }
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-500/5 border border-red-500/30 text-red-400 hover:from-red-500/30 hover:to-red-500/15 hover:scale-[1.02] shadow-[0_4px_15px_rgba(239,68,68,0.1)] transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      <XCircle size={13} /> Not Coming
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>


      {/* Walk-in Participants Modal */}
      <AnimatePresence>
        {showWalkInModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[110]"
              onClick={() => setShowWalkInModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-[111] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--db-card-border)] bg-[var(--db-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ccf141]/20 flex items-center justify-center text-[#ccf141]">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        className="text-base sm:text-lg font-black uppercase tracking-wide text-white"
                        style={{ fontFamily: '"Brutal Font", sans-serif' }}
                      >
                        Walk-in Participants
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ccf141] text-black">
                        {filteredWalkIns.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--db-text-muted)]">
                      New members who registered and checked in at the event entrance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWalkInModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--db-card-border)] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filters & Actions Bar */}
              <div className="p-4 border-b border-[var(--db-card-border)] bg-[var(--db-card)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
                  {/* Particular Event Filter Selector */}
                  <div className="relative min-w-[220px]">
                    <select
                      value={walkInEventFilter}
                      onChange={(e) => setWalkInEventFilter(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl text-xs font-bold text-white uppercase outline-none focus:border-[#ccf141] transition-colors cursor-pointer appearance-none"
                    >
                      <option value="all" className="bg-[#181818] text-white">
                        All Events ({walkIns.length})
                      </option>
                      {uniqueEvents.map((evt) => {
                        const count = walkIns.filter(
                          (w) => (w.eventName || w.event?.title) === evt
                        ).length;
                        return (
                          <option key={evt} value={evt} className="bg-[#181818] text-white">
                            {evt} ({count})
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Search walk-in by name or phone..."
                      value={walkInSearch}
                      onChange={(e) => setWalkInSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#ccf141] transition-colors"
                    />
                    {walkInSearch && (
                      <button
                        onClick={() => setWalkInSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Export CSV Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={exportWalkInsToCSV}
                    disabled={filteredWalkIns.length === 0}
                    className="h-9 px-3.5 bg-[var(--db-input-bg)] hover:bg-[var(--db-sidebar-link-hover)] text-white text-xs font-bold rounded-xl border border-[var(--db-card-border)] hover:border-[#ccf141]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download size={13} className="text-[#ccf141]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Walk-in List / Table */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {filteredWalkIns.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-gray-800/60 border border-gray-700/50 flex items-center justify-center mx-auto text-gray-500">
                      <Users size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-300">
                      No walk-in participants found
                    </p>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      {walkInSearch
                        ? "Try adjusting your search query or event filter."
                        : "Walk-ins registered from the QR Check-in page will appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--db-card-border)] text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Participant</th>
                          <th className="py-2.5 px-3">Mobile Number</th>
                          <th className="py-2.5 px-3">Event</th>
                          <th className="py-2.5 px-3">Checked-in At</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--db-card-border)]/50">
                        {filteredWalkIns.map((w, idx) => {
                          const eventTitle = w.eventName || w.event?.title || "Event";
                          const eventImg = getEventImage(eventTitle);
                          return (
                            <tr
                              key={w._id}
                              className="hover:bg-white/[0.02] transition-colors group"
                            >
                              <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-[#ccf141]/15 text-[#ccf141] font-black text-xs flex items-center justify-center shrink-0 uppercase border border-[#ccf141]/30">
                                    {w.name ? w.name.charAt(0) : "W"}
                                  </div>
                                  <div>
                                    <span className="font-bold text-white text-xs block">
                                      {w.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">
                                      Walk-in Member
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`tel:${w.phone}`}
                                    className="font-mono text-gray-300 hover:text-[#ccf141] transition-colors font-medium flex items-center gap-1.5"
                                  >
                                    <Phone size={12} className="text-gray-500" />
                                    <span>{w.phone}</span>
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard?.writeText(w.phone);
                                      toast.success("Phone copied to clipboard");
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity cursor-pointer"
                                    title="Copy phone"
                                  >
                                    <Copy size={11} />
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2 max-w-[200px]">
                                  {eventImg ? (
                                    <img
                                      src={eventImg}
                                      alt={eventTitle}
                                      className="w-6 h-6 rounded-md object-cover shrink-0 border border-white/10"
                                    />
                                  ) : (
                                    <Award size={14} className="text-[#ccf141] shrink-0" />
                                  )}
                                  <span
                                    className="truncate text-[11px] font-semibold text-gray-200 uppercase tracking-wide"
                                    title={eventTitle}
                                  >
                                    {eventTitle}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                                {w.createdAt
                                  ? new Date(w.createdAt).toLocaleString(undefined, {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "-"}
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/30">
                                  <Check size={10} />
                                  <span>{w.status || "Attended"}</span>
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteWalkIn(w._id, e)}
                                  disabled={deletingWalkInId === w._id}
                                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Delete walk-in"
                                >
                                  {deletingWalkInId === w._id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 border-t border-[var(--db-card-border)] bg-[var(--db-card)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--db-text-muted)] font-medium">
                  Showing {filteredWalkIns.length} of {walkIns.length} total walk-ins
                </span>
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 bg-[var(--db-input-bg)] hover:bg-[var(--db-sidebar-link-hover)] text-white text-xs font-bold rounded-xl border border-[var(--db-card-border)] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QR Check-in Modal */}
      <AnimatePresence>
        {showQRModal && eventFilter !== "all" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowQRModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--db-card-border)] bg-[#ccf141] text-black">
                <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <QrCode size={18} /> Event Check-In QR
                </h2>
                <button onClick={() => setShowQRModal(false)} className="hover:text-black/70 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center justify-center space-y-3">
                {getEventImage(eventFilter) && (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#ccf141] shadow-lg mb-1">
                    <img
                      src={getEventImage(eventFilter)}
                      alt={eventFilter}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-xs text-center text-[var(--db-text-muted)] font-bold uppercase tracking-wide">
                  {eventFilter}
                </p>
                <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-[#ccf141]">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + "/event-checkin?event=" + encodeURIComponent(eventFilter))}`} 
                    alt="Check-in QR Code" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-4">
                  Scan this code with a mobile device to mark attendance.
                  <br /><br />
                  <span className="text-[#ccf141] font-bold">Note for Local Testing:</span> If you scan this on your phone while running on `localhost`, it won't work. Click the button below to test it directly on this PC instead.
                </p>
                <a 
                  href={`/event-checkin?event=${encodeURIComponent(eventFilter)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full py-2.5 bg-[var(--db-input-bg)] text-white text-xs font-bold rounded-xl border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] transition-colors text-center"
                >
                  Test Check-in Page Here
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardEventParticipants;
