import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  DollarSign,
  ExternalLink,
  Save,
  X,
  Upload,
  Loader2,
  RefreshCw,
  Clock,
  AlignLeft,
  Info,
  Trash2,
  Edit,
} from "lucide-react";
import {
  getEventsListAdmin,
  createEventItem,
  updateEventItem,
  deleteEventItem,
  getBookings,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Helper for Date Conversion to YYYY-MM-DD
const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  try {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const yyyy = d.getFullYear();
      const mm = (d.getMonth() + 1).toString().padStart(2, "0");
      const dd = d.getDate().toString().padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch (e) {}

  // Parse "SAT 30 May" style
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    const day = parts.length === 3 ? parts[1] : parts[0];
    const monthName = parts.length === 3 ? parts[2] : parts[1];
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const cleanMonth = monthName.toLowerCase().substring(0, 3);
    if (months[cleanMonth] !== undefined && !isNaN(parseInt(day, 10))) {
      const d = new Date();
      d.setMonth(months[cleanMonth]);
      d.setDate(parseInt(day, 10));
      const yyyy = d.getFullYear();
      const mm = (d.getMonth() + 1).toString().padStart(2, "0");
      const dd = d.getDate().toString().padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  return "";
};

// Robust custom formatter
const formatCustomDateString = (dateVal) => {
  if (!dateVal) return "";
  let date;
  if (typeof dateVal === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      const [year, month, day] = dateVal.split("-").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateVal);
    }
  } else {
    date = dateVal;
  }
  if (isNaN(date.getTime())) return String(dateVal);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

// Helper to convert 12-hour AM/PM string to 24-hour HH:mm
const convertTo24Hour = (time12) => {
  if (!time12) return "";
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    if (/^\d{2}:\d{2}$/.test(time12)) return time12;
    if (/^\d{1}:\d{2}$/.test(time12)) return `0${time12}`;
    return time12;
  }
  let [_, hoursStr, minutes, modifier] = match;
  let hours = parseInt(hoursStr, 10);
  if (modifier.toUpperCase() === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  const hh = hours.toString().padStart(2, "0");
  return `${hh}:${minutes}`;
};

// Helper to convert 24-hour HH:mm string to 12-hour AM/PM
const convertTo12Hour = (time24) => {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

const DashboardCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal Control
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [price, setPrice] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  // Fetch all events and bookings
  const fetchData = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    if (shouldShow) setLoading(true);
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEventsListAdmin(),
        getBookings(),
      ]);

      if (eventsRes.data?.success) {
        setEvents(eventsRes.data.data);
      }
      if (bookingsRes.data?.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (error) {
      console.error("Error loading dashboard calendar data", error);
      toast.error("Failed to load calendar content");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper parser to read date strings of events and bookings
  const parseEventDate = (dateStr) => {
    if (!dateStr) return null;
    const clean = dateStr.trim();
    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return new Date(clean);
    }
    // "SAT 30 May" or "SUN 7 Jun" or "30 May 2026"
    try {
      const parsed = Date.parse(clean);
      if (!isNaN(parsed)) return new Date(parsed);

      const parts = clean.split(/\s+/);
      if (parts.length >= 3) {
        const dayNum = parseInt(parts[1]);
        const monthName = parts[2];
        const currentYear = new Date().getFullYear();

        const monthMap = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          aug: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dec: 11,
        };

        const mLower = monthName.toLowerCase().substring(0, 3);
        if (mLower in monthMap) {
          return new Date(currentYear, monthMap[mLower], dayNum);
        }
      }
    } catch (e) {
      // fail silently
    }
    return null;
  };

  // Helper parser for visitor bookings (e.g. day=28, month="May")
  const parseBookingDate = (booking) => {
    if (!booking.day || !booking.month) return null;
    const currentYear = new Date().getFullYear();
    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    const mLower = booking.month.toLowerCase().substring(0, 3);
    if (mLower in monthMap) {
      return new Date(currentYear, monthMap[mLower], parseInt(booking.day));
    }
    return null;
  };

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Check if dates match (ignoring hours/minutes)
  const isSameDate = (d1, d2) => {
    return (
      d1 &&
      d2 &&
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Formats date to "SAT 30 May" style
  const formatDateToCustom = (date) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // File picker handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be under 10MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Trigger modal to Add Event on a specific day
  const handleCellClick = (dayDate) => {
    setEditMode(false);
    setCurrentId(null);
    setTitle("");
    setLocation("");
    setDescription("");
    setOriginalPrice("");
    setPrice("");
    setBookingLink("");
    setImageFile(null);
    setImagePreview("");
    // Pre-populate schedules with selected date
    setSchedules([
      {
        date: formatDateToCustom(dayDate),
        timeSlots: [{ time: "9:00 AM", slots: 20, booked: 0 }],
      },
    ]);
    setShowFormModal(true);
  };

  // Trigger modal to Edit Event
  const handleOpenEdit = (event, e) => {
    e.stopPropagation(); // Avoid triggering day cell click
    setEditMode(true);
    setCurrentId(event._id);
    setTitle(event.title);
    setLocation(event.location);
    setDescription(event.description || "");
    setOriginalPrice(event.originalPrice ? String(event.originalPrice) : "");
    setPrice(String(event.price));
    setBookingLink(event.bookingLink || "");
    setSchedules(event.schedules || []);
    setImageFile(null);
    setImagePreview(event.imageUrl);
    setShowFormModal(true);
  };

  // Delete event
  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const toastId = toast.loading("Deleting event...");
    try {
      const { data } = await deleteEventItem(id);
      if (data.success) {
        toast.success("Event deleted successfully", { id: toastId });
        fetchData();
      } else {
        toast.error("Failed to delete event", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting event", { id: toastId });
    }
  };

  // Create/Update Event Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !price) {
      toast.error("Title, Location, and Price are required");
      return;
    }
    if (!editMode && !imageFile) {
      toast.error("Please upload an event cover image");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      editMode ? "Updating event..." : "Creating event...",
    );

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("location", location.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("schedules", JSON.stringify(schedules));
      formData.append("originalPrice", originalPrice || "");
      formData.append("bookingLink", bookingLink.trim() || "#");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (editMode) {
        res = await updateEventItem(currentId, formData);
      } else {
        res = await createEventItem(formData);
      }

      if (res.data?.success) {
        toast.success(
          editMode
            ? "Event updated successfully!"
            : "Event created successfully!",
          { id: toastId },
        );
        setShowFormModal(false);
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to save event", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while saving the event",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Generate Calendar Days list
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);
  const calendarCells = [];

  // Padding cells from previous month
  const prevMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  const prevMonthDays = getDaysInMonth(prevMonthDate);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevMonthDays - i,
      ),
      isCurrentMonth: false,
    });
  }

  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
    });
  }

  // Padding cells for next month to complete the 6-week view grid (42 cells)
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
    });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h1
              className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
              style={{ fontFamily: '"Brutal Font", sans-serif' }}
            >
              Athlete & Events Schedule
            </h1>
            <p className="text-[var(--db-text-muted)] text-[10px] md:text-sm mt-1">
              Visual monthly calendar view. Click any day to create events.
              Manage bookings and class schedules in real-time.
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={() => handleCellClick(new Date())}
              className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer w-fit self-end sm:self-auto"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Plus size={14} strokeWidth={2.5} />
              Quick Add Event
            </button>
          )}
        </div>

        {/* Calendar Card container */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] overflow-hidden shadow-2xl p-6 md:p-8 transition-colors">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2">
              <CalendarIcon
                className="text-[var(--db-accent-highlight)]"
                size={20}
              />
              <h2
                className="text-lg font-black uppercase tracking-widest text-[var(--db-text-title)]"
                style={{ fontFamily: '"Brutal Font", sans-serif' }}
              >
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl p-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[var(--db-sidebar-link-hover)] rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-[10px] uppercase font-extrabold tracking-wider text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-md transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-[var(--db-sidebar-link-hover)] rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Table Loading indicator */}
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-[var(--db-text-muted)] text-xs gap-2">
              <Loader2
                className="animate-spin text-[var(--db-accent-highlight)]"
                size={32}
              />
              <p className="uppercase tracking-widest font-black text-[10px]">
                Loading schedules...
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px] border border-[var(--db-card-border)] rounded-2xl overflow-hidden">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 bg-[var(--db-input-bg)] border-b border-[var(--db-card-border)]">
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-[var(--db-text-muted)]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day cells grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-[var(--db-card-border)] bg-[var(--db-card-border)]/20">
                  {calendarCells.map((cell, idx) => {
                    const isToday = isSameDate(cell.date, new Date());

                    // Filter events for this cell's date
                    const cellEvents = events.filter(
                      (evt) =>
                        evt.schedules &&
                        evt.schedules.some((sch) => {
                          const parsed = parseEventDate(sch.date);
                          return isSameDate(parsed, cell.date);
                        }),
                    );

                    // Filter visitor tours/bookings for this cell's date
                    const cellBookings = bookings.filter((b) => {
                      const parsed = parseBookingDate(b);
                      return isSameDate(parsed, cell.date);
                    });

                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          user?.role === "admin" && handleCellClick(cell.date)
                        }
                        className={`min-h-[110px] p-2 bg-[var(--db-card)] hover:bg-[var(--db-table-hover)] transition-colors flex flex-col justify-between group cursor-pointer relative ${
                          cell.isCurrentMonth ? "" : "opacity-40"
                        }`}
                      >
                        {/* Day indicator number */}
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                              isToday
                                ? "bg-[var(--db-accent)] text-[var(--db-accent-text)]"
                                : cell.isCurrentMonth
                                  ? "text-[var(--db-text)]"
                                  : "text-[var(--db-text-muted)]"
                            }`}
                          >
                            {cell.date.getDate()}
                          </span>

                          {/* Quick add icon */}
                          {user?.role === "admin" && (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-accent-highlight)] rounded-md">
                              <Plus size={10} />
                            </span>
                          )}
                        </div>

                        {/* List events/bookings inside cell */}
                        <div className="mt-2 space-y-1 flex-grow overflow-y-auto max-h-[70px] custom-scrollbar">
                          {/* Events */}
                          {cellEvents.map((evt, eIdx) => (
                            <div
                              key={evt._id + eIdx}
                              onClick={(e) => handleOpenEdit(evt, e)}
                              className="text-[9px] font-semibold bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/20 text-[var(--db-accent-highlight)] px-1.5 py-0.5 rounded truncate flex items-center justify-between hover:scale-[1.02] transition-transform"
                              title={`${evt.title} (${evt.location})`}
                            >
                              <span className="truncate">{evt.title}</span>
                              <div className="flex gap-1 shrink-0 ml-1">
                                <Edit size={8} />
                              </div>
                            </div>
                          ))}

                          {/* Visitor Bookings */}
                          {cellBookings.map((bk, bIdx) => (
                            <div
                              key={bk._id + bIdx}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded truncate"
                              title={`Tour visit: ${bk.name} (${bk.time})`}
                            >
                              <span>Tour: {bk.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT EVENT FORM MODAL */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
              className="absolute inset-0 z-0"
              onClick={() => setShowFormModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal header */}
              <div className="p-6 border-b border-[var(--db-card-border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 flex items-center justify-center text-[var(--db-accent-highlight)]">
                    <CalendarIcon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[var(--db-text-title)]">
                      {editMode
                        ? "Modify Scheduled Event"
                        : "Create New Event Schedule"}
                    </h3>
                    <p className="text-[10px] text-[var(--db-text-muted)]">
                      Configure details, time slots, and cover banner image
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-2 text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-xl hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form container */}
              <form
                onSubmit={handleSubmit}
                className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar text-left"
              >
                {/* Image picker banner section */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                    Event Display Banner
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-[21/9] rounded-2xl border-2 border-dashed border-[var(--db-card-border)] hover:border-[var(--db-accent-highlight)]/50 bg-[var(--db-input-bg)] flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-all group"
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-1.5 text-xs font-bold uppercase tracking-wider">
                          <Upload size={14} />
                          Replace Banner
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--db-card)] border border-[var(--db-card-border)] flex items-center justify-center mx-auto text-[var(--db-text-muted)]">
                          <Upload size={16} />
                        </div>
                        <div className="text-xs font-bold text-[var(--db-text)]">
                          Click or Drop to Upload Image
                        </div>
                        <div className="text-[10px] text-[var(--db-text-muted)]">
                          PNG, JPG, WEBP (Ratio 16:9 or 21:9)
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form fields row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. CrossFit Showdown"
                      className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                      Venue Location
                    </label>
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                      />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Box & Cross CrossFit Arena"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Form Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                    Description
                  </label>
                  <div className="relative">
                    <AlignLeft
                      size={14}
                      className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the class event guidelines, duration, rules..."
                      rows={3}
                      className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Pricing grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                      Registration Price (₹)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={14}
                        className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                      />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 499"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                      Cut Price (₹ - Optional)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={14}
                        className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                      />
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="e.g. 999"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all font-mono line-through"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                      Booking Link (Optional)
                    </label>
                    <div className="relative">
                      <ExternalLink
                        size={14}
                        className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                      />
                      <input
                        type="text"
                        value={bookingLink}
                        onChange={(e) => setBookingLink(e.target.value)}
                        placeholder="External booking URL"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* schedules Section */}
                <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <CalendarIcon
                        size={12}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      Configure Date Schedules
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const formattedToday = today
                          .toISOString()
                          .split("T")[0];
                        setSchedules([
                          ...schedules,
                          {
                            date: formatCustomDateString(formattedToday),
                            timeSlots: [
                              { time: "9:00 AM", slots: 20, booked: 0 },
                            ],
                          },
                        ]);
                      }}
                      className="flex items-center gap-1 bg-[var(--db-accent-glow)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Plus size={10} />
                      Add Date
                    </button>
                  </div>

                  {schedules.map((schedule, sIndex) => (
                    <div
                      key={sIndex}
                      className="p-5 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-2xl relative space-y-4 transition-all"
                    >
                      {/* Date details row */}
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-grow space-y-1">
                          <label className="block text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                            Schedule Date
                          </label>
                          <div className="relative">
                            <CalendarIcon
                              size={12}
                              className="absolute left-3 top-3.5 text-[var(--db-text-muted)] pointer-events-none z-10"
                            />
                            <input
                              type="date"
                              value={convertToYYYYMMDD(schedule.date)}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                const updated = [...schedules];
                                updated[sIndex].date = formatCustomDateString(
                                  e.target.value,
                                );
                                setSchedules(updated);
                              }}
                              onClick={(e) =>
                                e.target.showPicker && e.target.showPicker()
                              }
                              className="w-full bg-[var(--db-bg)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--db-text)] transition-all font-semibold cursor-pointer"
                              style={{ colorScheme: 'dark' }}
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSchedules(
                              schedules.filter((_, idx) => idx !== sIndex),
                            )
                          }
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer h-[40px] flex items-center justify-center shrink-0 border border-red-500/5"
                          title="Remove Date"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Time Slots sub-settings */}
                      <div className="pl-4 border-l border-[var(--db-card-border)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                            <Clock
                              size={11}
                              className="text-[var(--db-accent-highlight)]"
                            />
                            Configure Time Slots
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...schedules];
                              updated[sIndex].timeSlots.push({
                                time: "9:00 AM",
                                slots: 20,
                                booked: 0,
                              });
                              setSchedules(updated);
                            }}
                            className="text-[9px] font-black uppercase text-[var(--db-accent-highlight)] hover:underline cursor-pointer"
                          >
                            + Add Time Slot
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {schedule.timeSlots.map((slot, tIndex) => (
                            <div
                              key={tIndex}
                              className="grid grid-cols-12 gap-3 items-center bg-[var(--db-bg)] p-3 rounded-xl border border-[var(--db-card-border)]/60"
                            >
                              {/* Slot Time */}
                              <div className="col-span-6 sm:col-span-5 space-y-1 text-left">
                                <span className="text-[8px] font-extrabold uppercase text-[var(--db-text-muted)] tracking-wider">
                                  Start Time
                                </span>
                                <div className="relative">
                                  <Clock
                                    size={12}
                                    className="absolute left-2.5 top-3 text-[var(--db-text-muted)] pointer-events-none"
                                  />
                                  <input
                                    type="time"
                                    value={convertTo24Hour(slot.time)}
                                    onChange={(e) => {
                                      const updated = [...schedules];
                                      updated[sIndex].timeSlots[tIndex].time =
                                        convertTo12Hour(e.target.value);
                                      setSchedules(updated);
                                    }}
                                    onClick={(e) =>
                                      e.target.showPicker &&
                                      e.target.showPicker()
                                    }
                                    className="w-full bg-[var(--db-card)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-lg pl-7 pr-2 py-1.5 text-xs text-[var(--db-text)] [color-scheme:dark] transition-all font-semibold cursor-pointer"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Capacity Limit */}
                              <div className="col-span-4 sm:col-span-5 space-y-1 text-left">
                                <span className="text-[8px] font-extrabold uppercase text-[var(--db-text-muted)] tracking-wider">
                                  Capacity Limit
                                </span>
                                <div className="flex items-center bg-[var(--db-card)] border border-[var(--db-card-border)] focus-within:border-[var(--db-accent-highlight)]/50 rounded-lg overflow-hidden h-[36px] transition-all">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...schedules];
                                      const currentVal =
                                        updated[sIndex].timeSlots[tIndex].slots;
                                      if (currentVal > 1) {
                                        updated[sIndex].timeSlots[
                                          tIndex
                                        ].slots = currentVal - 1;
                                        setSchedules(updated);
                                      }
                                    }}
                                    className="px-2.5 h-full text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] hover:bg-white/[0.03] active:scale-95 transition-all font-extrabold cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={slot.slots}
                                    onChange={(e) => {
                                      const updated = [...schedules];
                                      updated[sIndex].timeSlots[tIndex].slots =
                                        Number(e.target.value);
                                      setSchedules(updated);
                                    }}
                                    className="w-full bg-transparent border-none outline-none text-xs text-[var(--db-text)] text-center font-bold font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...schedules];
                                      const currentVal =
                                        updated[sIndex].timeSlots[tIndex].slots;
                                      updated[sIndex].timeSlots[tIndex].slots =
                                        currentVal + 1;
                                      setSchedules(updated);
                                    }}
                                    className="px-2.5 h-full text-[var(--db-text-muted)] hover:text-[var(--db-accent-highlight)] hover:bg-white/[0.03] active:scale-95 transition-all font-extrabold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Delete Specific Time Slot */}
                              <div className="col-span-2 sm:col-span-2 flex justify-end pt-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...schedules];
                                    updated[sIndex].timeSlots = updated[
                                      sIndex
                                    ].timeSlots.filter(
                                      (_, idx) => idx !== tIndex,
                                    );
                                    setSchedules(updated);
                                  }}
                                  disabled={schedule.timeSlots.length <= 1}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-30 rounded-lg transition-all cursor-pointer"
                                  title="Delete Time Slot"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>

              {/* Action buttons footer */}
              {user?.role === "admin" ? (
                <div className="p-6 border-t border-[var(--db-card-border)] bg-[var(--db-input-bg)] flex justify-between gap-4 shrink-0">
                  {editMode ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        handleDeleteEvent(currentId, e);
                        setShowFormModal(false);
                      }}
                      className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete Event
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
                      className="px-4 py-2.5 border border-[var(--db-input-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Save size={14} />
                      )}
                      {editMode ? "Save Changes" : "Create Schedule"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 border-t border-[var(--db-card-border)] bg-[var(--db-input-bg)] flex justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-6 py-2.5 bg-[var(--db-accent)] text-[var(--db-accent-text)] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardCalendar;
