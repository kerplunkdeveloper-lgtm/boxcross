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
} from "lucide-react";
import {
  getEventBookings,
  deleteEventBooking,
  updateEventBooking,
  getEventsList,
} from "../api/api";
import { toast } from "react-hot-toast";

// ─── Bottom Analytics Panel (3-column) ───────────────────────────────────────
const EventOverviewPanel = ({
  activeBookings,
  confirmedCount,
  awaitingCount,
  noResponseCount,
  notComingCount,
  totalSlots,
  bookedSlots,
  getNormalizedStatus,
  onSelectBooking,
}) => {
  const total = activeBookings.length;
  const confirmPct = total > 0 ? Math.round((confirmedCount / total) * 100) : 0;

  // Donut segments
  const segments = [
    {
      label: "Confirmed",
      count: confirmedCount,
      color: "#4ade80",
      dotColor: "#22c55e",
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

  // Today's follow-ups
  const todayStr = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  const todayFollowUps = activeBookings.filter(
    (b) =>
      b.nextFollowUp &&
      (b.nextFollowUp.includes(todayStr) ||
        b.nextFollowUp.toLowerCase().includes("today")),
  );

  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ── Col 1: Today's Follow-ups ── */}
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
            Today's Follow-ups
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#e5ff00] text-black text-[9px] font-black">
              {todayFollowUps.length}
            </span>
          </h3>
          <span className="text-[10px] font-bold text-[var(--db-accent-highlight)] cursor-pointer hover:underline">
            View All
          </span>
        </div>
        <div
          className="flex flex-col gap-1 overflow-y-auto"
          style={{ maxHeight: "220px" }}
        >
          {todayFollowUps.length === 0 ? (
            <p className="text-[11px] text-[var(--db-text-muted)] italic py-4 text-center">
              No follow-ups for today.
            </p>
          ) : (
            todayFollowUps.map((b) => (
              <div
                key={b._id}
                onClick={() => onSelectBooking && onSelectBooking(b)}
                className="flex items-center justify-between gap-2 py-2 border-b border-[var(--db-card-border)] cursor-pointer hover:bg-[var(--db-sidebar-link-hover)] px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock size={10} className="text-orange-400 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-[var(--db-text)] truncate">
                    {b.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono text-[var(--db-text-muted)]">
                    {b.phone}
                  </span>
                  <span className="text-[10px] font-black text-orange-400 whitespace-nowrap">
                    {b.nextFollowUp}
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
                <span className="text-[10px] font-black text-[var(--db-text-muted)]">
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
                  background: "linear-gradient(90deg,#e5ff00,#a3d900)",
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
                <stop offset="0%" stopColor="#e5ff00" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#e5ff00" stopOpacity="0" />
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
              stroke="#e5ff00"
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
                  fill="#e5ff00"
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
                      fill="#e5ff00"
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
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  // Custom interactive CRM states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [newLogActivity, setNewLogActivity] = useState("");
  const [newLogType, setNewLogType] = useState("Call");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchBookings = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const [bookingsRes, eventsRes] = await Promise.all([
        getEventBookings(),
        getEventsList(),
      ]);
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data);
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
    if (!booking) return "Awaiting";
    const status = booking.status;
    if (
      status === "payment successfully" ||
      status === "confirmed" ||
      status === "Confirmed"
    ) {
      return "Confirmed";
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

    // Fallback for legacy "not payment" status:
    const createdAtDate = new Date(booking.createdAt);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    if (createdAtDate >= oneDayAgo) return "Awaiting";
    if (createdAtDate >= threeDaysAgo) return "Follow-up";
    return "No Response";
  };

  // Calculate distinct events
  const uniqueEvents = Array.from(
    new Set(bookings.map((b) => b.event?.title).filter(Boolean)),
  );

  // Current active event bookings
  const activeBookings =
    eventFilter === "all"
      ? bookings
      : bookings.filter((b) => b.event?.title === eventFilter);

  // Status-based counts
  const totalRegistrations = activeBookings.length;

  const confirmedCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Confirmed",
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
    let bookedSlots = 0;

    const filteredEvents =
      eventFilter === "all"
        ? events
        : events.filter((e) => e.title === eventFilter);

    filteredEvents.forEach((evt) => {
      if (evt.schedules) {
        evt.schedules.forEach((sched) => {
          if (sched.timeSlots) {
            sched.timeSlots.forEach((slot) => {
              totalSlots += Number(slot.slots) || 0;
              bookedSlots += Number(slot.booked) || 0;
            });
          }
        });
      }
    });

    const availableSlots = Math.max(0, totalSlots - bookedSlots);
    return { availableSlots, totalSlots };
  };

  const { availableSlots, totalSlots } = getCapacityStats();

  // Filter based on search & tab status filter
  const filteredBookings = activeBookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.toLowerCase().includes(query);

    let matchesStatus = true;
    const normalized = getNormalizedStatus(booking);
    if (statusFilter === "confirmed") {
      matchesStatus = normalized === "Confirmed";
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

  // Set the first booking as selected on initial load or filter change
  useEffect(() => {
    if (filteredBookings.length > 0) {
      const freshBooking = selectedBooking
        ? filteredBookings.find((b) => b._id === selectedBooking._id)
        : null;
      if (freshBooking) {
        setSelectedBooking(freshBooking);
      } else {
        setSelectedBooking(filteredBookings[0]);
      }
    } else {
      setSelectedBooking(null);
    }
  }, [bookings, eventFilter, statusFilter, searchQuery]);

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
    if (!window.confirm("Are you sure you want to delete this timeline log?")) return;
    const updatedTimeline = selectedBooking.timeline.filter((_, idx) => idx !== idxToDelete);
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
      { name: "Participant Name", width: 180 },
      { name: "Email", width: 260 },
      { name: "Phone", width: 150 },
      { name: "Event Title", width: 250 },
      { name: "Schedule Date", width: 150 },
      { name: "Time Slot", width: 150 },
      { name: "Seats Booked", width: 100 },
      { name: "Ticket Type", width: 120 },
      { name: "Registration Date", width: 180 },
      { name: "Status", width: 160 },
    ];

    const rows = filteredBookings.map((booking) => [
      booking.name || "",
      booking.email || "",
      booking.phone || "",
      booking.event?.title || "Deleted Event",
      booking.date || "",
      booking.timeSlot || "",
      booking.seats || 0,
      Number(booking.totalAmount) === 0 ? "Free Entry" : "Paid Ticket",
      booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      booking.status || "",
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
          table { border-collapse: collapse; }
          th { 
            background-color: #e5ff00; 
            color: #000000; 
            font-weight: bold; 
            font-family: Arial, sans-serif; 
            font-size: 11px;
            border: 1px solid #cccccc; 
            text-align: left;
            padding: 8px;
          }
          td { 
            font-weight: bold; 
            font-family: Arial, sans-serif; 
            font-size: 10pt;
            border: 1px solid #cccccc; 
            padding: 8px;
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
    <div className="p-6 md:p-8 space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-8xl mx-auto space-y-6 relative z-10">
        {/* Header Title + Dynamic Event Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--db-card-border)] pb-4">
          <div className="text-left">
            <h1
              className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
              style={{ fontFamily: '"Brutal Font", sans-serif' }}
            >
              Event Participants
            </h1>
          </div>

          {/* Dynamic Event Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-full">
            <button
              onClick={() => {
                setEventFilter("all");
                setCurrentPage(1);
              }}


              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                eventFilter === "all"
                  ? "bg-[#e5ff00] text-black shadow-md border border-[#e5ff00]"
                  : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
              }`}
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Users size={11} />
              All Events ({bookings.length})
            </button>
            {uniqueEvents.map((evt) => {
              const count = bookings.filter(
                (b) => b.event?.title === evt,
              ).length;
              return (
                <button
                  key={evt}
                  onClick={() => {
                    setEventFilter(evt);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    eventFilter === evt
                      ? "bg-[#e5ff00] text-black shadow-md border border-[#e5ff00]"
                      : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                  }`}
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <Award size={11} />
                  {evt} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Total Registrations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] flex-shrink-0">
              <Users size={18} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {totalRegistrations}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-semibold mt-1 whitespace-nowrap">
                Total Registrations
              </p>
            </div>
          </motion.div>

          {/* Card 2: Confirmed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] flex-shrink-0">
              <Check size={18} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {confirmedCount}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-semibold mt-1 whitespace-nowrap">
                Confirmed
              </p>
            </div>
          </motion.div>

          {/* Card 3: Awaiting Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)] flex-shrink-0">
              <Clock size={18} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {awaitingCount}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-semibold mt-1 whitespace-nowrap">
                Awaiting Confirmation
              </p>
            </div>
          </motion.div>

          {/* Card 4: Follow-up Pending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] flex-shrink-0">
              <Phone size={18} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {followUpCount}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-semibold mt-1 whitespace-nowrap">
                Follow-up Pending
              </p>
            </div>
          </motion.div>

          {/* Card 5: Not Coming */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] flex-shrink-0">
              <XCircle size={18} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {notComingCount}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-semibold mt-1 whitespace-nowrap">
                Not Coming
              </p>
            </div>
          </motion.div>

          {/* Card 6: Available Seats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[20px] p-4 flex items-center gap-3 shadow-lg transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex-shrink-0">
              <Ticket size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-[var(--db-text)] leading-none">
                {availableSlots}
              </h3>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-[11px] text-[var(--db-text-muted)] font-semibold whitespace-nowrap">
                  Available Seats
                </p>
                <span className="text-[11px] text-[var(--db-text-muted)] font-bold whitespace-nowrap pl-1">
                  of {totalSlots}
                </span>
              </div>
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
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-2 shadow-2xl transition-all duration-300 w-full min-w-0"
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
                        ? "bg-[#e5ff00] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    All ({activeBookings.length})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("confirmed");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === "confirmed"
                        ? "bg-[#e5ff00] text-black shadow-md"
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
                        ? "bg-[#e5ff00] text-black shadow-md"
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
                        ? "bg-[#e5ff00] text-black shadow-md"
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
                        ? "bg-[#e5ff00] text-black shadow-md"
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
                        ? "bg-[#e5ff00] text-black shadow-md"
                        : "bg-transparent border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                    }`}
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Not Coming ({notComingCount})
                  </button>
                </div>

                {/* Right: Options Menu */}
                <div className="relative flex items-center gap-2">
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
                <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                  <table
                    className="w-full text-left border-collapse table-fixed"
                    style={{ minWidth: "1050px" }}
                  >
                    <colgroup>
                      <col style={{ width: "14%" }} /> {/* Name */}
                      <col style={{ width: "11%" }} /> {/* Phone */}
                      <col style={{ width: "7%" }} /> {/* Seats */}
                      <col style={{ width: "14%" }} /> {/* Status */}
                      <col style={{ width: "18%" }} /> {/* Last Contact */}
                      <col style={{ width: "14%" }} /> {/* Follow-up */}
                      <col style={{ width: "14%" }} /> {/* Notes */}
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
                        <th className="py-2.5 px-3 whitespace-nowrap">Name</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Phone</th>
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
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">Notes</th>
                        <th className="py-2.5 px-2 text-center whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--db-card-border)]">
                      {currentItems.map((booking) => {
                        const isSelected =
                          selectedBooking &&
                          selectedBooking._id === booking._id;
                        return (
                          <tr
                            key={booking._id}
                            onClick={() => setSelectedBooking(booking)}
                            className={`hover:bg-[var(--db-table-hover)] transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[var(--db-table-hover)] border-l-4 border-[var(--db-accent-highlight)]"
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

                            {/* Name */}
                            <td className="py-2 px-3 font-bold text-[var(--db-text)] text-[14px] whitespace-nowrap">
                              {booking.name}
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
                                  Confirmed:
                                    "border-green-500/30 text-green-400 bg-green-500/10",
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
                                        Confirmed: "payment successfully",
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
                                      value="Confirmed"
                                      className="bg-[#121212] text-green-400"
                                    >
                                      Confirmed
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
                                key={booking._id + "-lc-" + (booking.lastContact || "")}
                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                defaultValue={booking.lastContact || ""}
                                rows={1}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onBlur={(e) => {
                                  if (e.target.value !== (booking.lastContact || "")) {
                                    handleUpdateBooking(booking._id, { lastContact: e.target.value });
                                  }
                                }}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) e.target.blur(); }}
                                placeholder="-"
                                className="w-full bg-transparent border-b border-transparent hover:border-gray-700 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[var(--db-text)] text-[10px] font-semibold text-center leading-snug px-1 py-0.5 focus:outline-none transition-all rounded resize-none overflow-hidden"
                              />
                            </td>

                            {/* Next Follow-up */}
                            <td
                              className="py-2 px-2 align-middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <textarea
                                key={booking._id + "-nf-" + (booking.nextFollowUp || "")}
                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                defaultValue={booking.nextFollowUp || ""}
                                rows={1}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onBlur={(e) => {
                                  if (e.target.value !== (booking.nextFollowUp || "")) {
                                    handleUpdateBooking(booking._id, { nextFollowUp: e.target.value });
                                  }
                                }}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) e.target.blur(); }}
                                placeholder="-"
                                className="w-full bg-transparent border-b border-transparent hover:border-gray-700 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[10px] font-extrabold text-orange-400 text-center leading-snug px-1 py-0.5 focus:outline-none transition-all rounded resize-none overflow-hidden"
                              />
                            </td>

                            {/* Notes */}
                            <td
                              className="py-2 px-2 align-middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <textarea
                                key={booking._id + "-nt-" + (booking.notes || "")}
                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                defaultValue={booking.notes || ""}
                                rows={1}
                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onBlur={(e) => {
                                  if (e.target.value !== (booking.notes || "")) {
                                    handleUpdateBooking(booking._id, { notes: e.target.value });
                                  }
                                }}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) e.target.blur(); }}
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
                              ? "bg-[#e5ff00] text-black shadow-md font-black"
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
              confirmedCount={confirmedCount}
              awaitingCount={awaitingCount}
              noResponseCount={noResponseCount}
              notComingCount={notComingCount}
              totalSlots={totalSlots}
              bookedSlots={totalSlots - availableSlots}
              getNormalizedStatus={getNormalizedStatus}
              onSelectBooking={setSelectedBooking}
            />
          </div>
          {/* end left column */}

          {/* Right Sliding Detail Panel */}
          <AnimatePresence>
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.3 }}
                className="w-full xl:w-[310px] 2xl:w-[330px] flex-shrink-0 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-4 shadow-2xl xl:sticky text-left space-y-4 overflow-y-auto"
                style={{ top: "24px", maxHeight: "calc(100vh - 48px)" }}
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-[var(--db-text)] uppercase tracking-wide leading-tight">
                      {selectedBooking.name}
                    </h2>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[12px] uppercase tracking-widest font-black ${
                        selectedBooking.status === "payment successfully" ||
                        selectedBooking.status === "confirmed"
                          ? "bg-green-500/10 border border-green-500/20 text-green-400"
                          : selectedBooking.status === "not payment"
                            ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}
                    >
                      {selectedBooking.status === "payment successfully" ||
                      selectedBooking.status === "confirmed"
                        ? "Confirmed"
                        : selectedBooking.status === "not payment"
                          ? "Awaiting"
                          : "Not Coming"}
                    </span>
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
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[var(--db-card-border)]">
                  <div>
                    <div className="text-[12px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">
                      Seats
                    </div>
                    <div className="text-sm font-extrabold mt-0.5">
                      {selectedBooking.seats}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">
                      Registered On
                    </div>
                    <div className="text-[12px] font-semibold mt-0.5">
                      {selectedBooking.createdAt
                        ? new Date(
                            selectedBooking.createdAt,
                          ).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) +
                          `, ${new Date(selectedBooking.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
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
                          {selectedBooking.timeline && selectedBooking.timeline.length > 0 && (
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
                        <option value="Status" className="bg-[var(--db-card)]">
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
                          className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#e5ff00] text-black cursor-pointer"
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
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all font-bold text-xs cursor-pointer"
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
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-[#e5ff00]/10 border border-[#e5ff00]/20 text-[#e5ff00] hover:bg-[#e5ff00]/20 transition-all font-bold text-xs cursor-pointer"
                  >
                    <Phone size={13} /> Call Now
                  </a>
                  <button
                    onClick={() =>
                      handleUpdateBooking(selectedBooking._id, {
                        status: "Awaiting",
                      })
                    }
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all font-bold text-xs cursor-pointer"
                  >
                    <Clock size={13} /> Mark Awaiting
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateBooking(selectedBooking._id, {
                        status: "cancelled",
                      })
                    }
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-bold text-xs cursor-pointer"
                  >
                    <XCircle size={13} /> Not Coming
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardEventParticipants;
