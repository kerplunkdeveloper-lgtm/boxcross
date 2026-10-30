import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Search,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Trash2,
  Users,
  ArrowUpDown,
  Download,
  X,
  Award,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  Ticket,
} from "lucide-react";
import {
  getEventBookings,
  deleteEventBooking,
  updateEventBooking,
  getEventsList,
} from "../api/api";
import { toast } from "react-hot-toast";

// Helper function to format date string (e.g. YYYY-MM-DD) into DD / MM / YYYY
const formatDateToDMY = (dateVal) => {
  if (!dateVal) return "";

  // Try matching YYYY-MM-DD
  const yyyymmddMatch = String(dateVal).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmddMatch) {
    const [_, year, month, day] = yyyymmddMatch;
    return `${day} / ${month} / ${year}`;
  }

  // Try matching DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = String(dateVal).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [_, day, month, year] = dmyMatch;
    return `${day} / ${month} / ${year}`;
  }

  // Fallback to standard JS Date parsing
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) {
    return String(dateVal);
  }

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
  // Try matching YYYY-MM-DD
  const yyyymmddMatch = String(dateVal).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmddMatch) {
    const [_, y, m, d] = yyyymmddMatch;
    return new Date(`${y}-${m}-${d}T00:00:00`).getTime();
  }
  // Try matching DD-MM-YYYY or DD/MM/YYYY
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

// Normalized slot key helper (strips whitespace and standardizes format)
const normalizeSlotKey = (slotVal) => {
  if (!slotVal) return "";
  return String(slotVal).trim().toLowerCase().replace(/\s+/g, " ");
};

const DashboardEventPayments = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState(() => {
    try {
      return sessionStorage.getItem("bxc_event_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [dateFilter, setDateFilter] = useState(() => {
    try {
      return sessionStorage.getItem("bxc_date_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [timeSlotFilter, setTimeSlotFilter] = useState(() => {
    try {
      return sessionStorage.getItem("bxc_time_slot_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [viewScreenshotUrl, setViewScreenshotUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState(null);

  const updateEventFilter = (val) => {
    setEventFilter(val);
    setDateFilter("all");
    setTimeSlotFilter("all");
    try {
      sessionStorage.setItem("bxc_event_filter", val);
      sessionStorage.setItem("bxc_date_filter", "all");
      sessionStorage.setItem("bxc_time_slot_filter", "all");
    } catch (e) {
      console.error(e);
    }
  };

  const updateDateFilter = (val) => {
    setDateFilter(val);
    setTimeSlotFilter("all");
    try {
      sessionStorage.setItem("bxc_date_filter", val);
      sessionStorage.setItem("bxc_time_slot_filter", "all");
    } catch (e) {
      console.error(e);
    }
  };

  const updateTimeSlotFilter = (val) => {
    setTimeSlotFilter(val);
    try {
      sessionStorage.setItem("bxc_time_slot_filter", val);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const [bookingsRes, eventsRes] = await Promise.all([
        getEventBookings(),
        getEventsList(),
      ]);
      if (bookingsRes.data?.success) {
        setBookings(bookingsRes.data.data);
      }
      if (eventsRes.data?.success) {
        setEvents(eventsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching event bookings", error);
      toast.error("Failed to load event bookings");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings(true);
      const interval = setInterval(() => {
        fetchBookings(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle Delete
  const handleDeleteBooking = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event booking record? This will also revert the booked seat slots.",
      )
    ) {
      return;
    }

    // Optimistically update the UI
    const originalBookings = bookings;
    setBookings((prev) => prev.filter((b) => b._id !== id));
    setDeletingId(id);
    const toastId = toast.loading("Deleting booking record...");
    try {
      const { data } = await deleteEventBooking(id);
      if (data.success) {
        toast.success(data.message || "Record deleted successfully", {
          id: toastId,
        });
        fetchBookings(false);
      } else {
        // Rollback
        setBookings(originalBookings);
        toast.error("Failed to delete record", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      // Rollback
      setBookings(originalBookings);
      toast.error("An error occurred while deleting the booking record.", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Build a comprehensive map of each event with its separate schedules and slots
  const eventScheduleMap = new Map();

  // 1. Populate from defined events collection
  events.forEach((evt) => {
    const title = evt.title;
    if (title && !eventScheduleMap.has(title)) {
      eventScheduleMap.set(title, {
        title,
        schedules: new Map(), // rawDate -> Set of timeSlots
        latestTimestamp: 0,
        bookingCount: 0,
      });
    }
    const item = eventScheduleMap.get(title);
    if (item && evt.schedules) {
      evt.schedules.forEach((sched) => {
        const rawDate = sched.date;
        const ts = parseDateToTimestamp(rawDate);
        if (ts > item.latestTimestamp) item.latestTimestamp = ts;
        if (!item.schedules.has(rawDate)) {
          item.schedules.set(rawDate, new Set());
        }
        if (sched.timeSlots) {
          sched.timeSlots.forEach((slot) => {
            if (slot.time) item.schedules.get(rawDate).add(slot.time.trim());
          });
        }
      });
    }
  });

  // 2. Populate from actual bookings
  bookings.forEach((b) => {
    const title = b.event?.title || "Deleted Event";
    if (!eventScheduleMap.has(title)) {
      eventScheduleMap.set(title, {
        title,
        schedules: new Map(),
        latestTimestamp: 0,
        bookingCount: 0,
      });
    }
    const item = eventScheduleMap.get(title);
    item.bookingCount += 1;

    const ts = parseDateToTimestamp(b.date, b.createdAt);
    if (ts > item.latestTimestamp) item.latestTimestamp = ts;

    if (b.date) {
      if (!item.schedules.has(b.date)) {
        item.schedules.set(b.date, new Set());
      }
      if (b.timeSlot) {
        item.schedules.get(b.date).add(b.timeSlot.trim());
      }
    }
  });

  // Sorted list of all events (recent date first)
  const sortedEvents = Array.from(eventScheduleMap.values()).sort(
    (a, b) => b.latestTimestamp - a.latestTimestamp,
  );

  // Separate schedule dates:
  // If an event is selected, ONLY show the schedule dates belonging to that event!
  let availableDates = [];
  if (eventFilter !== "all" && eventScheduleMap.has(eventFilter)) {
    const selectedEvt = eventScheduleMap.get(eventFilter);
    availableDates = Array.from(selectedEvt.schedules.keys()).sort(
      (a, b) => parseDateToTimestamp(b) - parseDateToTimestamp(a),
    );
  } else {
    // If All Events is selected, collect all distinct schedule dates
    const allDates = new Set();
    eventScheduleMap.forEach((evt) => {
      evt.schedules.forEach((_, dateKey) => allDates.add(dateKey));
    });
    availableDates = Array.from(allDates).sort(
      (a, b) => parseDateToTimestamp(b) - parseDateToTimestamp(a),
    );
  }

  // Separate time slots:
  // If an event and/or date is selected, ONLY show time slots belonging to that event and date!
  let availableTimeSlots = [];
  if (eventFilter !== "all" && eventScheduleMap.has(eventFilter)) {
    const selectedEvt = eventScheduleMap.get(eventFilter);
    if (dateFilter !== "all" && selectedEvt.schedules.has(dateFilter)) {
      availableTimeSlots = Array.from(selectedEvt.schedules.get(dateFilter)).sort();
    } else {
      const slots = new Set();
      selectedEvt.schedules.forEach((slotSet) => {
        slotSet.forEach((s) => slots.add(s));
      });
      availableTimeSlots = Array.from(slots).sort();
    }
  } else if (dateFilter !== "all") {
    const slots = new Set();
    eventScheduleMap.forEach((evt) => {
      if (evt.schedules.has(dateFilter)) {
        evt.schedules.get(dateFilter).forEach((s) => slots.add(s));
      }
    });
    availableTimeSlots = Array.from(slots).sort();
  } else {
    const slots = new Set();
    eventScheduleMap.forEach((evt) => {
      evt.schedules.forEach((slotSet) => {
        slotSet.forEach((s) => slots.add(s));
      });
    });
    availableTimeSlots = Array.from(slots).sort();
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

  // Compute stats strictly scoped to filtered event, schedule date & time
  const statsBookings = bookings
    .filter((b) => eventFilter === "all" || (b.event?.title || "Deleted Event") === eventFilter)
    .filter((b) => dateFilter === "all" || normalizeDateKey(b.date) === normalizeDateKey(dateFilter))
    .filter((b) => timeSlotFilter === "all" || normalizeSlotKey(b.timeSlot) === normalizeSlotKey(timeSlotFilter));

  const totalVolume = statsBookings
    .filter(
      (b) => b.status === "payment successfully" || b.status === "confirmed",
    )
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  const totalSeats = statsBookings
    .filter(
      (b) => b.status === "payment successfully" || b.status === "confirmed",
    )
    .reduce((sum, b) => sum + (Number(b.seats) || 0), 0);

  // Calculate total slots allocated for the selected event / date / slot filter
  let totalSlotsAllocated = 0;
  const filteredEventsForCapacity =
    eventFilter === "all"
      ? events
      : events.filter((e) => (e.title || "Deleted Event") === eventFilter);

  filteredEventsForCapacity.forEach((evt) => {
    if (evt.schedules) {
      evt.schedules.forEach((sched) => {
        if (
          dateFilter === "all" ||
          normalizeDateKey(sched.date) === normalizeDateKey(dateFilter)
        ) {
          if (sched.timeSlots) {
            sched.timeSlots.forEach((slot) => {
              if (
                timeSlotFilter === "all" ||
                normalizeSlotKey(slot.time) === normalizeSlotKey(timeSlotFilter)
              ) {
                totalSlotsAllocated += Number(slot.slots) || 0;
              }
            });
          }
        }
      });
    }
  });

  const remainingSeats = Math.max(0, totalSlotsAllocated - totalSeats);

  const successfulTxns = statsBookings.filter(
    (b) => b.status === "payment successfully" || b.status === "confirmed",
  ).length;
  const pendingTxns = statsBookings.filter(
    (b) => b.status === "not payment" || b.status === "None" || !b.status,
  ).length;
  const failedTxns = statsBookings.filter(
    (b) => b.status === "failed",
  ).length;

    // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    eventFilter,
    dateFilter,
    timeSlotFilter,
    statusFilter,
    paymentMethodFilter,
  ]);

  // Helper to retrieve event image
  const getEventImage = (booking) => {
    if (booking.event?.imageUrl) return booking.event.imageUrl;
    const title = booking.event?.title;
    const eventId =
      booking.event?._id ||
      (typeof booking.event === "string" ? booking.event : null);
    const matched = events.find(
      (e) => (eventId && e._id === eventId) || (title && e.title === title)
    );
    return matched?.imageUrl || "";
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.name?.toLowerCase().includes(query) ||
      booking.email?.toLowerCase().includes(query) ||
      booking.phone?.toLowerCase().includes(query) ||
      (booking.event?.title || "").toLowerCase().includes(query) ||
      (booking.razorpayOrderId || "").toLowerCase().includes(query) ||
      (booking.razorpayPaymentId || "").toLowerCase().includes(query);

    const matchesEvent =
      eventFilter === "all" ||
      (booking.event?.title || "Deleted Event") === eventFilter;

    const matchesDate =
      dateFilter === "all" ||
      normalizeDateKey(booking.date) === normalizeDateKey(dateFilter);

    const matchesTimeSlot =
      timeSlotFilter === "all" ||
      normalizeSlotKey(booking.timeSlot) === normalizeSlotKey(timeSlotFilter);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status === statusFilter ||
      (statusFilter === "not payment" && (booking.status === "None" || !booking.status));

    const matchesPaymentMethod =
      paymentMethodFilter === "all" ||
      (booking.paymentMethod || "razorpay") === paymentMethodFilter;

    return (
      matchesSearch &&
      matchesEvent &&
      matchesDate &&
      matchesTimeSlot &&
      matchesStatus &&
      matchesPaymentMethod
    );
  });

    // Client-side pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    eventFilter !== "all" ||
    dateFilter !== "all" ||
    timeSlotFilter !== "all" ||
    statusFilter !== "all" ||
    paymentMethodFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    updateEventFilter("all");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
  };

  const handleExportToExcel = () => {
    const headers = [
      { name: "Name", width: 180 },
      { name: "Email", width: 260 },
      { name: "Phone", width: 150 },
      { name: "Event Title", width: 250 },
      { name: "Schedule Date", width: 150 },
      { name: "Schedule Time Slot", width: 150 },
      { name: "Seats", width: 80 },
      { name: "Total Amount", width: 130 },
      { name: "Payment Method", width: 150 },
      { name: "Payment Screenshot", width: 300 },
      { name: "Razorpay Order ID", width: 220 },
      { name: "Razorpay Payment ID", width: 220 },
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
      Number(booking.totalAmount) === 0
        ? "Free Plan"
        : `₹${booking.totalAmount}`,
      booking.paymentMethod || "razorpay",
      booking.paymentScreenshot || "N/A",
      booking.razorpayOrderId || "N/A",
      booking.razorpayPaymentId || "N/A",
      booking.status || "",
    ]);

    // Construct the XML/HTML spreadsheet template for Excel
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Event Bookings</x:Name>
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
            background-color: #ccf141; 
            color: #000000; 
            font-weight: bold; 
            font-family: Arial, sans-serif; 
            font-size: 11pt;
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
        // Escape special HTML chars to prevent tag breaking
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
    const sanitizedEventTag =
      eventFilter !== "all"
        ? `${eventFilter.replace(/[^a-zA-Z0-9]/g, "_")}_`
        : "";
    link.setAttribute(
      "download",
      `Event_Bookings_${sanitizedEventTag}${new Date().toISOString().split("T")[0]}.xls`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="mt-2 space-y-4 sm:space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6 relative z-10">
        {/* Header Title */}
        <div className="text-left">
          <h1
            className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
            style={{ fontFamily: '"Brutal Font", sans-serif' }}
          >
            Event Payments & Bookings
          </h1>
          <p className="text-[var(--db-text-muted)] text-[11px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
            View details of users who registered for fitness events, track
            transaction status, and manage reservations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5">
          {/* Card 1: Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest truncate max-w-[170px]">
                {eventFilter === "all" ? "Event Collection" : `${eventFilter} Revenue`}
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-[var(--db-text)] mt-0.5 sm:mt-1">
                ₹{totalVolume.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 flex items-center justify-center text-[var(--db-accent-highlight)] shrink-0">
              <DollarSign size={18} />
            </div>
          </motion.div>

          {/* Card 2: No. of Seats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.03 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                No. of Seats Booked
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-cyan-400 mt-0.5 sm:mt-1 font-mono">
                {totalSeats}
              </h3>
            </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Ticket size={18} />
            </div>
           
          </motion.div>

          {/* Card: Remaining Seats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest truncate">
                Remaining Seats
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-purple-400 mt-0.5 sm:mt-1 font-mono">
                {remainingSeats}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Ticket size={18} />
            </div>
          </motion.div>

          {/* Card 3: Success Payments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
               Booking person Group
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-[var(--db-accent-highlight)] mt-0.5 sm:mt-1">
                {successfulTxns}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0">
              <CheckCircle size={18} />
            </div>
          </motion.div>

          {/* Card 3: Pending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Pending
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-yellow-500 mt-0.5 sm:mt-1">
                {pendingTxns}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
          </motion.div>

          {/* Card 4: Failed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Failed
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-red-500 mt-0.5 sm:mt-1">
                {failedTxns}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
          </motion.div>
        </div>

        {/* Main List Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-2xl transition-colors"
        >
          {/* List Header controls */}
          <div className="space-y-4 mb-5 pb-4 border-b border-[var(--db-card-border)]">
            {/* Top Row: Title & Record Counter + Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-left">
                <CreditCard
                  size={18}
                  className="text-[var(--db-accent-highlight)]"
                />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[var(--db-accent-highlight)]">
                  Event Booking Records
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)]">
                  {filteredBookings.length} {filteredBookings.length === 1 ? "record" : "records"}
                </span>
              </div>

              {/* Action buttons (Reset & Export to Excel) */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3.5 h-8.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    title="Reset all filters"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  onClick={handleExportToExcel}
                  className="flex items-center gap-1.5 px-4 h-8.5 bg-[#ccf141] hover:bg-[#d4eb00] active:scale-95 text-black font-black uppercase tracking-wider text-[10px] rounded-full shadow-lg shadow-[#ccf141]/10 transition-all cursor-pointer whitespace-nowrap"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <Download size={12} />
                  Export to Excel
                </button>
              </div>
            </div>

            {/* Bottom Row: Unified Filters Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] sm:min-w-[240px]">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search user, event, order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-gray-500 rounded-full pl-9 pr-4 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                />
              </div>

              {/* Event Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)] focus-within:border-[var(--db-accent-highlight)] transition-colors">
                <Award size={12} className="mr-1.5 text-gray-500 shrink-0 pointer-events-none" />
                <select
                  value={eventFilter}
                  onChange={(e) => updateEventFilter(e.target.value)}
                  className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[var(--db-text)] cursor-pointer pr-5 text-xs appearance-none max-w-[180px] sm:max-w-[220px] truncate"
                  title="Filter by Event"
                >
                  <option
                    value="all"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    All Events ({sortedEvents.length})
                  </option>
                  {sortedEvents.map((evt) => (
                    <option
                      key={evt.title}
                      value={evt.title}
                      className="bg-[var(--db-card)] text-[var(--db-text)]"
                    >
                      {evt.title} ({evt.bookingCount})
                    </option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 pointer-events-none text-gray-500 shrink-0" />
              </div>

              {/* Schedule Date Filter Dropdown (Strictly Separated for Selected Event) */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)] focus-within:border-[var(--db-accent-highlight)] transition-colors">
                <Calendar size={12} className="mr-1.5 text-gray-500 shrink-0 pointer-events-none" />
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "all") {
                      updateDateFilter("all");
                    } else if (val.includes(":::")) {
                      const [evtTitle, rawDate] = val.split(":::");
                      setEventFilter(evtTitle);
                      setDateFilter(rawDate);
                      setTimeSlotFilter("all");
                      try {
                        sessionStorage.setItem("bxc_event_filter", evtTitle);
                        sessionStorage.setItem("bxc_date_filter", rawDate);
                        sessionStorage.setItem("bxc_time_slot_filter", "all");
                      } catch (err) {
                        console.error(err);
                      }
                    } else {
                      updateDateFilter(val);
                    }
                  }}
                  className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[var(--db-text)] cursor-pointer pr-5 text-xs appearance-none max-w-[150px] sm:max-w-[180px] truncate"
                  title="Filter by Schedule Date"
                >
                  <option
                    value="all"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    {eventFilter !== "all"
                      ? `All Dates (${availableDates.length})`
                      : "All Schedule Dates"}
                  </option>
                  {eventFilter !== "all" ? (
                    availableDates.map((d) => {
                      const dateBookingCount = bookings.filter(
                        (b) =>
                          (b.event?.title || "Deleted Event") === eventFilter &&
                          normalizeDateKey(b.date) === normalizeDateKey(d),
                      ).length;
                      return (
                        <option
                          key={d}
                          value={d}
                          className="bg-[var(--db-card)] text-[var(--db-text)]"
                        >
                          {formatDateToDMY(d)} ({dateBookingCount} booked)
                        </option>
                      );
                    })
                  ) : (
                    sortedEvents.map((evt) => {
                      const datesForEvt = Array.from(evt.schedules.keys());
                      if (datesForEvt.length === 0) return null;
                      return (
                        <optgroup
                          key={evt.title}
                          label={evt.title}
                          className="bg-[var(--db-card)] text-[var(--db-accent-highlight)] font-bold"
                        >
                          {datesForEvt.map((d) => {
                            const dateBookingCount = bookings.filter(
                              (b) =>
                                (b.event?.title || "Deleted Event") === evt.title &&
                                normalizeDateKey(b.date) === normalizeDateKey(d),
                            ).length;
                            return (
                              <option
                                key={`${evt.title}-${d}`}
                                value={`${evt.title}:::${d}`}
                                className="bg-[var(--db-card)] text-[var(--db-text)] font-normal"
                              >
                                {formatDateToDMY(d)} {dateBookingCount > 0 ? `(${dateBookingCount} booked)` : ""}
                              </option>
                            );
                          })}
                        </optgroup>
                      );
                    })
                  )}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 pointer-events-none text-gray-500 shrink-0" />
              </div>

              {/* Time Slot Filter Dropdown (Strictly Separated for Selected Event & Date) */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)] focus-within:border-[var(--db-accent-highlight)] transition-colors">
                <Clock size={12} className="mr-1.5 text-gray-500 shrink-0 pointer-events-none" />
                <select
                  value={timeSlotFilter}
                  onChange={(e) => updateTimeSlotFilter(e.target.value)}
                  className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[var(--db-text)] cursor-pointer pr-5 text-xs appearance-none max-w-[140px] sm:max-w-[160px] truncate"
                  title="Filter by Time Slot"
                >
                  <option
                    value="all"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    All Slots {availableTimeSlots.length > 0 ? `(${availableTimeSlots.length})` : ""}
                  </option>
                  {availableTimeSlots.map((slot) => {
                    const slotBookingCount = bookings.filter((b) => {
                      const matchE =
                        eventFilter === "all" ||
                        (b.event?.title || "Deleted Event") === eventFilter;
                      const matchD =
                        dateFilter === "all" ||
                        normalizeDateKey(b.date) === normalizeDateKey(dateFilter);
                      const matchS = normalizeSlotKey(b.timeSlot) === normalizeSlotKey(slot);
                      return matchE && matchD && matchS;
                    }).length;
                    return (
                      <option
                        key={slot}
                        value={slot}
                        className="bg-[var(--db-card)] text-[var(--db-text)]"
                      >
                        {slot} {slotBookingCount > 0 ? `(${slotBookingCount} booked)` : ""}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 pointer-events-none text-gray-500 shrink-0" />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)] focus-within:border-[var(--db-accent-highlight)] transition-colors">
                <Filter size={12} className="mr-1.5 text-gray-500 shrink-0 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[var(--db-text)] cursor-pointer pr-5 text-xs appearance-none max-w-[130px] truncate"
                >
                  <option
                    value="all"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    All Status
                  </option>
                  <option
                    value="payment successfully"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Payment Successfully
                  </option>
                  <option
                    value="pending barcode verification"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Pending Barcode
                  </option>
                  <option
                    value="not payment"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Not Payment
                  </option>
                  <option
                    value="confirmed"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Confirmed
                  </option>
                  <option
                    value="failed"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Failed
                  </option>
                  <option
                    value="cancelled"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Cancelled
                  </option>
                </select>
                <ChevronDown size={11} className="absolute right-2.5 pointer-events-none text-gray-500 shrink-0" />
              </div>

              {/* Payment Method Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)] focus-within:border-[var(--db-accent-highlight)] transition-colors">
                <Filter size={12} className="mr-1.5 text-gray-500 shrink-0 pointer-events-none" />
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[var(--db-text)] cursor-pointer pr-5 text-xs appearance-none max-w-[120px] truncate"
                >
                  <option
                    value="all"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    All Methods
                  </option>
                  <option
                    value="razorpay"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Razorpay
                  </option>
                  <option
                    value="barcode"
                    className="bg-[var(--db-card)] text-[var(--db-text)]"
                  >
                    Barcode Scan
                  </option>
                </select>
                <ChevronDown size={11} className="absolute right-2.5 pointer-events-none text-gray-500 shrink-0" />
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--db-card-border)]/40 text-[11px]">
                <span className="text-[10px] uppercase font-bold text-[var(--db-text-muted)] mr-1">
                  Active:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] font-mono text-[10px]">
                    Search: &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-red-400 cursor-pointer ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {eventFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] font-bold text-[10px]">
                    <Award size={10} />
                    {eventFilter}
                    <button
                      onClick={() => updateEventFilter("all")}
                      className="hover:text-white cursor-pointer ml-0.5 font-bold"
                      title="Clear Event filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] font-mono text-[10px]">
                    <Calendar size={10} />
                    {formatDateToDMY(dateFilter)}
                    <button
                      onClick={() => updateDateFilter("all")}
                      className="hover:text-white cursor-pointer ml-0.5 font-bold"
                      title="Clear Date filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {timeSlotFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] font-mono text-[10px]">
                    <Clock size={10} />
                    {timeSlotFilter}
                    <button
                      onClick={() => updateTimeSlotFilter("all")}
                      className="hover:text-white cursor-pointer ml-0.5 font-bold"
                      title="Clear Time Slot filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] capitalize text-[10px]">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="hover:text-red-400 cursor-pointer ml-0.5 font-bold"
                      title="Clear Status filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {paymentMethodFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] capitalize text-[10px]">
                    Method: {paymentMethodFilter}
                    <button
                      onClick={() => setPaymentMethodFilter("all")}
                      className="hover:text-red-400 cursor-pointer ml-0.5 font-bold"
                      title="Clear Method filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] text-red-400 hover:underline cursor-pointer ml-1 font-bold"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Records Display (Dual-View: Mobile Cards + Desktop Table) */}
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
              <span>Loading event bookings...</span>
            </div>
          ) : filteredBookings.length > 0 ? (
            <>
              {/* Mobile Cards View */}
              <div className="block md:hidden space-y-3">
                {paginatedBookings.map((booking, index) => {
                  const eventTitle = booking.event?.title || "Deleted Event";
                  const eventImg = getEventImage(booking);
                  return (
                  <div
                    key={booking._id}
                    className="bg-[var(--db-input-bg)]/40 border border-[var(--db-input-border)] rounded-2xl p-3.5 space-y-3 shadow-md"
                  >
                    {/* Top Row: Name, Seats, and Amount */}
                    <div className="flex items-start justify-between gap-2 border-b border-[var(--db-card-border)]/50 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] font-mono font-bold">
                            #{indexOfFirstItem + index + 1}
                          </span>
                          <h4 className="font-bold text-sm text-[var(--db-text)] leading-snug">
                            {booking.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] font-mono font-bold">
                            {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
                          </span>
                          {(booking.paymentMethod || "razorpay").toLowerCase() === "barcode" ? (
                            <span className="px-2 py-0.5 rounded bg-[#ccf141]/10 border border-[#ccf141]/20 text-[#ccf141] uppercase text-[9px] font-black">
                              🤳 Barcode
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase text-[9px] font-black">
                              💳 Razorpay
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {Number(booking.totalAmount) === 0 ? (
                          <span className="text-xs font-black uppercase tracking-wider text-[#ccf141]">
                            Free Plan
                          </span>
                        ) : (
                          <span className="text-sm font-black font-mono text-[var(--db-accent-highlight)]">
                            ₹{booking.totalAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event & Schedule */}
                    <div className="p-2.5 rounded-xl bg-[var(--db-card)]/80 border border-[var(--db-card-border)]/60 flex items-center gap-3">
                      {eventImg ? (
                        <img
                          src={eventImg}
                          alt={eventTitle}
                          className="w-12 h-12 rounded-xl object-cover border border-[var(--db-card-border)] shrink-0 bg-black/20"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex items-center justify-center shrink-0 text-[var(--db-accent-highlight)]">
                          <Ticket size={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--db-text)] break-words leading-snug">
                          {eventTitle}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--db-text-muted)] font-medium mt-1">
                          <Calendar size={11} className="text-[var(--db-accent-highlight)] shrink-0" />
                          <span className="font-bold text-[var(--db-accent-highlight)] uppercase font-mono">
                            {formatDateToDMY(booking.date)}
                          </span>
                          <span>•</span>
                          <span className="truncate font-mono">{booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {booking.phone && (
                        <a
                          href={`tel:${booking.phone}`}
                          className="flex items-center gap-1 text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] font-mono truncate py-1"
                        >
                          📞 <span className="truncate">{booking.phone}</span>
                        </a>
                      )}
                      {booking.email && (
                        <a
                          href={`mailto:${booking.email}`}
                          className="flex items-center gap-1 text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] truncate py-1"
                        >
                          ✉️ <span className="truncate">{booking.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Screenshot Preview Button if present */}
                    {booking.paymentScreenshot && (
                      <div className="pt-1">
                        <button
                          onClick={() => setViewScreenshotUrl(booking.paymentScreenshot)}
                          className="w-full py-1.5 px-3 bg-[var(--db-card)] border border-[var(--db-input-border)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          🔍 View Payment Screenshot
                        </button>
                      </div>
                    )}

                    {/* Bottom Status & Delete Bar */}
                    <div className="pt-2 border-t border-[var(--db-card-border)]/50 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <select
                          value={booking.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const toastId = toast.loading("Updating booking status...");
                            try {
                              const { data } = await updateEventBooking(booking._id, { status: newStatus });
                              if (data.success) {
                                toast.success("Booking status updated successfully!", { id: toastId });
                                fetchBookings();
                              } else {
                                toast.error(data.message || "Failed to update status", { id: toastId });
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error("Error updating booking status", { id: toastId });
                            }
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-xl text-[10px] uppercase font-bold bg-[var(--db-card)] border cursor-pointer outline-none ${
                            booking.status === "payment successfully" || booking.status === "confirmed"
                              ? "text-green-400 border-green-500/20"
                              : booking.status === "pending barcode verification"
                                ? "text-blue-400 border-blue-500/20"
                                : booking.status === "not payment" || booking.status === "None"
                                  ? "text-yellow-500 border-yellow-500/20"
                                  : "text-red-400 border-red-500/20"
                          }`}
                        >
                          <option value="None">None</option>
                          <option value="not payment">Not Payment</option>
                          <option value="pending barcode verification">Pending Barcode</option>
                          <option value="payment successfully">Payment Successfully</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        disabled={deletingId === booking._id}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer shrink-0 border border-red-500/10"
                        title="Delete Booking Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full custom-scrollbar pb-2">
                <table className="w-full text-left border-collapse min-w-[1450px]">
                  <thead>
                    <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-3 text-center rounded-l-xl border-r border-[var(--db-card-border)]/40 w-16 whitespace-nowrap">
                      Sl.No
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40 whitespace-nowrap">
                      Name
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40 min-w-[200px]">
                      Email & Phone
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40 min-w-[320px]">
                      Event Details
                    </th>
                    <th className="py-4 px-4 min-w-[180px] whitespace-nowrap border-r border-[var(--db-card-border)]/40">
                      Schedule Date/Time
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Seats
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Total Amount
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Method
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40 text-center">
                      Screenshot
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Razorpay Order ID
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Razorpay Payment ID
                    </th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">
                      Status
                    </th>
                    <th className="py-4 px-4 text-center rounded-r-xl">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {paginatedBookings.map((booking, index) => {
                    const eventTitle = booking.event?.title || "Deleted Event";
                    const eventImg = getEventImage(booking);
                    return (
                    <tr
                      key={booking._id}
                      className="hover:bg-[var(--db-table-hover)] transition-colors"
                    >
                      {/* Sl.No */}
                      <td className="py-4 px-3 text-center font-mono font-bold text-xs text-[var(--db-text-muted)] border-r border-[var(--db-card-border)]/30 w-16">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Name */}
                      <td className="py-4 px-4 text-left font-bold text-[var(--db-text)] text-sm whitespace-nowrap border-r border-[var(--db-card-border)]/30">
                        {booking.name}
                      </td>

                      {/* Email & Phone (Combined Field) */}
                      <td className="py-4 px-4 text-left border-r border-[var(--db-card-border)]/30 min-w-[200px]">
                        <div className="flex flex-col gap-1">
                          {booking.email ? (
                            <a
                              href={`mailto:${booking.email}`}
                              className="text-xs text-[var(--db-text)] hover:text-[var(--db-accent-highlight)] font-medium truncate flex items-center gap-1.5 transition-colors"
                              title={booking.email}
                            >
                              <Mail size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate">{booking.email}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-[var(--db-text-muted)]">-</span>
                          )}
                          {booking.phone && (
                            <a
                              href={`tel:${booking.phone}`}
                              className="text-[11px] text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] font-mono truncate flex items-center gap-1.5 transition-colors"
                              title={booking.phone}
                            >
                              <Phone size={11} className="text-gray-400 shrink-0" />
                              <span>{booking.phone}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Event Details */}
                      <td className="py-4 px-4 text-left border-r border-[var(--db-card-border)]/30 min-w-[320px] max-w-[420px]">
                        <div className="flex items-center gap-3">
                          {eventImg ? (
                            <img
                              src={eventImg}
                              alt={eventTitle}
                              className="w-12 h-12 rounded-xl object-cover border border-[var(--db-card-border)] shadow-sm shrink-0 bg-black/20"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex items-center justify-center shrink-0 text-[var(--db-accent-highlight)]">
                              <Ticket size={20} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-bold text-sm text-[var(--db-text)] break-words whitespace-normal leading-snug"
                              title={eventTitle}
                            >
                              {eventTitle}
                            </div>
                            {booking.createdAt && (
                              <div className="text-[10px] text-[var(--db-text-muted)] mt-1 flex items-center gap-1 font-mono">
                                <span>Booked on:</span>
                                <span className="text-gray-400 font-semibold">{formatDateToDMY(booking.createdAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Schedule Date/Time */}
                      <td className="py-4 px-4 text-left border-r border-[var(--db-card-border)]/30 min-w-[180px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--db-accent-highlight)] uppercase font-mono">
                          <Calendar size={12} className="shrink-0" />
                          <span>{formatDateToDMY(booking.date)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <Clock size={11} className="text-gray-500 shrink-0" />
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-[var(--db-text-muted)] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-md font-mono">
                            {booking.timeSlot || "Standard Slot"}
                          </span>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-bold font-mono border-r border-[var(--db-card-border)]/30">
                        {booking.seats}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-4 text-sm text-[var(--db-accent-highlight)] font-extrabold font-mono border-r border-[var(--db-card-border)]/30">
                        {Number(booking.totalAmount) === 0 ? (
                          <span className="text-xs font-black uppercase tracking-wider text-[#ccf141]">
                            Free Plan
                          </span>
                        ) : (
                          `₹${booking.totalAmount.toLocaleString()}`
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4 text-xs font-bold border-r border-[var(--db-card-border)]/30">
                        {(booking.paymentMethod || "razorpay").toLowerCase() ===
                        "barcode" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ccf141]/10 border border-[#ccf141]/20 text-[#ccf141] uppercase text-[10px] tracking-wide font-black">
                            🤳 Barcode
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase text-[10px] tracking-wide font-black">
                            💳 Razorpay
                          </span>
                        )}
                      </td>

                      {/* Payment Screenshot */}
                      <td className="py-4 px-4 text-center border-r border-[var(--db-card-border)]/30">
                        {booking.paymentScreenshot ? (
                          <button
                            onClick={() =>
                              setViewScreenshotUrl(booking.paymentScreenshot)
                            }
                            className="px-2.5 py-1 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all duration-200"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-[10px] text-[var(--db-text-muted)]">
                            -
                          </span>
                        )}
                      </td>

                      {/* Razorpay Order ID */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-mono border-r border-[var(--db-card-border)]/30">
                        {booking.razorpayOrderId || "N/A"}
                      </td>

                      {/* Razorpay Payment ID */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-mono border-r border-[var(--db-card-border)]/30">
                        {booking.razorpayPaymentId || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 border-r border-[var(--db-card-border)]/30">
                        {Number(booking.totalAmount) === 0 &&
                        (booking.status === "payment successfully" ||
                          booking.status === "confirmed") ? (
                          <span className="inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black bg-[#ccf141]/10 border border-[#ccf141]/20 text-[#ccf141]">
                            Free Entry Successful
                          </span>
                        ) : (
                          <select
                            value={booking.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const toastId = toast.loading(
                                "Updating booking status...",
                              );
                              try {
                                const { data } = await updateEventBooking(
                                  booking._id,
                                  { status: newStatus },
                                );
                                if (data.success) {
                                  toast.success(
                                    "Booking status updated successfully!",
                                    { id: toastId },
                                  );
                                  fetchBookings();
                                } else {
                                  toast.error(
                                    data.message || "Failed to update status",
                                    { id: toastId },
                                  );
                                }
                              } catch (err) {
                                console.error(err);
                                toast.error("Error updating booking status", {
                                  id: toastId,
                                });
                              }
                            }}
                            className={`px-2 py-1 rounded text-[10px] uppercase font-bold bg-[var(--db-input-bg)] border border-[var(--db-input-border)] cursor-pointer outline-none ${
                              booking.status === "payment successfully" ||
                              booking.status === "confirmed"
                                ? "text-green-400 border-green-500/20"
                                : booking.status ===
                                    "pending barcode verification"
                                  ? "text-blue-400 border-blue-500/20"
                                  : booking.status === "not payment" || booking.status === "None"
                                    ? "text-yellow-500 border-yellow-500/20"
                                    : "text-red-400 border-red-500/20"
                            }`}
                          >
                            <option value="None">None</option>
                            <option value="not payment">Not Payment</option>
                            <option value="pending barcode verification">
                              Pending Barcode
                            </option>
                            <option value="payment successfully">
                              Payment Successfully
                            </option>
                            <option value="confirmed">Confirmed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>

                      {/* Delete Action Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          disabled={deletingId === booking._id}
                          className="p-2 bg-transparent hover:bg-red-500/10 text-[var(--db-text-muted)] hover:text-red-400 rounded-lg transition-all cursor-pointer"
                          title="Delete Booking Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredBookings.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-[var(--db-card-border)]">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--db-text-muted)] font-bold">
                  <span>
                    Showing{" "}
                    <span className="text-[var(--db-text)] font-mono">
                      {filteredBookings.length > 0 ? indexOfFirstItem + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="text-[var(--db-text)] font-mono">
                      {Math.min(indexOfLastItem, filteredBookings.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-[var(--db-text)] font-mono">
                      {filteredBookings.length}
                    </span>{" "}
                    entries
                  </span>

                  <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--db-card-border)]">
                    <span className="text-[11px] text-[var(--db-text-muted)] font-semibold">Rows:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-[var(--db-text)]"
                      title="Previous Page"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-8 h-8 flex items-center justify-center text-xs text-[var(--db-text-muted)] font-bold"
                        >
                          ...
                        </span>
                      ) : (
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
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-[var(--db-text)]"
                      title="Next Page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              No matching booking records found.
            </div>
          )}
        </motion.div>
      </div>

      {/* Screenshot Lightbox Preview Modal */}
      <AnimatePresence>
        {viewScreenshotUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col relative shadow-2xl"
            >
              <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--db-card-border)]">
                <span className="font-extrabold uppercase text-xs tracking-wider text-[var(--db-accent-highlight)]">
                  Payment Screenshot
                </span>
                <button
                  onClick={() => setViewScreenshotUrl("")}
                  className="p-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg hover:bg-[var(--db-sidebar-link-hover)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-black">
                <img
                  src={viewScreenshotUrl}
                  alt="Payment Screenshot"
                  className="max-h-[60vh] object-contain rounded-lg border border-white/5 shadow-2xl"
                />
              </div>
              <div className="p-4 bg-white/[0.01] border-t border-[var(--db-card-border)] flex justify-end">
                <button
                  onClick={() => setViewScreenshotUrl("")}
                  className="px-4 py-2 border border-[var(--db-input-border)] hover:bg-white/5 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardEventPayments;
