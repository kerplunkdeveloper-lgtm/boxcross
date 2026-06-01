import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  ExternalLink,
  Save,
  X,
  Upload,
  Loader2,
  RefreshCw,
  Calendar,
  Clock,
  AlignLeft,
  Info,
  Sparkles,
  ListTodo,
} from "lucide-react";
import {
  getEventsListAdmin,
  createEventItem,
  updateEventItem,
  deleteEventItem,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Helper for Date Conversion to YYYY-MM-DD
const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  try {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      // Format locally to avoid UTC timezone shift issues!
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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

// Formats a Date object or YYYY-MM-DD string to "SAT 30 May YYYY" style
const formatDateToCustom = (dateVal) => {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);
  
  // Format locally instead of relying on default toString which might shift
  const year = date.getFullYear();
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
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${year}`;
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

const DashboardEventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [terms, setTerms] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [benefits, setBenefits] = useState("");
  const [agenda, setAgenda] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  // Fetch events
  const fetchEvents = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    if (shouldShow) setLoading(true);
    try {
      const { data } = await getEventsListAdmin();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(true);
    const interval = setInterval(() => {
      fetchEvents(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle file select and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 10MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setTitle("");
    setLocation("");
    setDescription("");
    setOriginalPrice("");
    setPrice("");
    setBookingLink("");
    setInclusions("");
    setExclusions("");
    setTerms("");
    setCategory("");
    setDuration("");
    setCalories("");
    setBenefits("");
    setAgenda([]);
    setSchedules([
      {
        date: "SAT 30 May",
        timeSlots: [{ time: "6:00 AM", slots: 20, booked: 0 }],
      },
      {
        date: "SUN 7 Jun",
        timeSlots: [
          { time: "8:00 AM", slots: 20, booked: 0 },
          { time: "9:00 AM", slots: 20, booked: 0 },
          { time: "10:00 AM", slots: 20, booked: 0 },
        ],
      },
    ]);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (event) => {
    setEditMode(true);
    setCurrentId(event._id);
    setTitle(event.title);
    setLocation(event.location);
    setDescription(event.description || "");
    setOriginalPrice(event.originalPrice ? String(event.originalPrice) : "");
    setPrice(String(event.price));
    setBookingLink(event.bookingLink || "");
    setInclusions(event.inclusions ? event.inclusions.join("\n") : "");
    setExclusions(event.exclusions ? event.exclusions.join("\n") : "");
    setTerms(event.termsAndConditions ? event.termsAndConditions.join("\n") : "");
    setCategory(event.category || "");
    setDuration(event.duration || "");
    setCalories(event.calories || "");
    setBenefits(event.benefits ? event.benefits.join("\n") : "");
    setAgenda(event.agenda || []);
    setSchedules(event.schedules || []);
    setImageFile(null);
    setImagePreview(event.imageUrl);
    setShowModal(true);
  };

  // Handle Submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !price) {
      toast.error("Title, Location, and Price are required fields");
      return;
    }

    if (!editMode && !imageFile) {
      toast.error("Please upload an event image");
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

      const incArray = inclusions.split("\n").map((s) => s.trim()).filter(Boolean);
      const excArray = exclusions.split("\n").map((s) => s.trim()).filter(Boolean);
      const termsArray = terms.split("\n").map((s) => s.trim()).filter(Boolean);
      formData.append("inclusions", JSON.stringify(incArray));
      formData.append("exclusions", JSON.stringify(excArray));
      formData.append("termsAndConditions", JSON.stringify(termsArray));

      formData.append("category", category.trim());
      formData.append("duration", duration.trim());
      formData.append("calories", calories.trim());

      const benefitsArray = benefits.split("\n").map((s) => s.trim()).filter(Boolean);
      formData.append("benefits", JSON.stringify(benefitsArray));
      formData.append("agenda", JSON.stringify(agenda));

      if (originalPrice) {
        formData.append("originalPrice", originalPrice);
      } else {
        formData.append("originalPrice", "");
      }

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

      if (res.data.success) {
        toast.success(res.data.message || "Saved successfully!", {
          id: toastId,
        });
        setShowModal(false);
        fetchEvents();
      } else {
        toast.error(res.data.message || "Failed to save event", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while uploading. Please check inputs and credentials.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This will also delete its image from Cloudinary.",
      )
    ) {
      return;
    }

    const toastId = toast.loading("Deleting event...");
    try {
      const { data } = await deleteEventItem(id);
      if (data.success) {
        toast.success("Event deleted successfully", { id: toastId });
        fetchEvents();
      } else {
        toast.error("Failed to delete event", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event", { id: toastId });
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[var(--db-accent-glow)] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--db-card-border)]">
          <div>
            <h1
              className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
              style={{ fontFamily: '"Brutal Font", sans-serif' }}
            >
              Events Listing
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchEvents}
              className="p-3 bg-[var(--db-input-bg)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-xl border border-[var(--db-input-border)] transition-all flex items-center justify-center cursor-pointer"
              title="Reload event records"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin text-[var(--db-accent-highlight)]"
                    : ""
                }
              />
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Event
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2
              className="animate-spin text-[var(--db-accent-highlight)]"
              size={36}
            />
            <p className="text-xs uppercase tracking-widest text-[var(--db-text-muted)] font-bold">
              Fetching event records...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <Upload size={48} className="text-[var(--db-text-muted)] mb-4" />
            <h3 className="text-lg font-bold uppercase mb-1 text-[var(--db-accent-highlight)]">
              No Events Found
            </h3>
            <p className="text-sm text-[var(--db-text-muted)]  max-w-sm mb-6">
              Create your first fitness event to showcase it dynamically on the
              Events listing board.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              Add First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[var(--db-card-border-hover)] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 group"
              >
                {/* Event Photo with Hover Overlay actions */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black shrink-0">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--db-card)] via-black/10 to-black/40 pointer-events-none" />

                  {/* Actions overlay panel */}
                  <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                    <button
                      onClick={() => handleOpenEdit(event)}
                      className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
                      title="Edit Event Details"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 bg-black/60 hover:bg-red-500/90 text-white rounded-lg backdrop-blur-sm border border-white/10 hover:border-red-500 transition-all cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Price pill */}
                  <div className="absolute bottom-3 left-3 bg-[#e5ff00] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
                    ₹{event.price} onwards
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase tracking-wide text-[var(--db-text)] leading-snug line-clamp-1">
                      {event.title}
                    </h3>

                    {/* Venue Location details */}
                    <div className="flex items-start gap-1.5 text-[var(--db-text-muted)]">
                      <MapPin
                        size={13}
                        className="text-[var(--db-text-muted)] shrink-0 mt-0.5"
                      />
                      <span className="text-[11px] leading-relaxed line-clamp-2">
                        {event.location}
                      </span>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-[11px] text-[var(--db-text-muted)] font-medium leading-relaxed line-clamp-2">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  {/* Schedules Display list */}
                  <div className="pt-3 border-t border-[var(--db-card-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1">
                        <Calendar size={10} />
                        Schedules ({event.schedules?.length || 0})
                      </span>
                    </div>

                    {!event.schedules || event.schedules.length === 0 ? (
                      <p className="text-[10px] text-[var(--db-text-muted)] italic">
                        No schedules set.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {event.schedules.map((sch, i) => (
                          <div
                            key={i}
                            className="text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-lg p-2 space-y-1"
                          >
                            <span className="font-extrabold text-[var(--db-accent-highlight)] uppercase">
                              {/^\d{4}-\d{2}-\d{2}$/.test(sch.date) ? formatDateToCustom(sch.date) : sch.date}
                            </span>
                            <div className="flex flex-wrap gap-1 text-[9px] text-[var(--db-text-muted)]">
                              {sch.timeSlots.map((ts, idx) => (
                                <span
                                  key={idx}
                                  className={`px-1.5 py-0.5 rounded border ${
                                    ts.booked >= ts.slots
                                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                                      : "bg-white/5 border-white/5 text-[var(--db-text)]"
                                  }`}
                                >
                                  {ts.time} ({ts.booked}/{ts.slots})
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Link Panel */}
                <div className="px-5 pb-5 pt-1 flex items-center justify-between shrink-0">
                  <div className="text-[10px] text-[var(--db-text-muted)]">
                    {event.originalPrice ? (
                      <span>
                        Original:{" "}
                        <span className="line-through">
                          ₹{event.originalPrice}
                        </span>
                      </span>
                    ) : (
                      <span>No discount set</span>
                    )}
                  </div>

                  {event.bookingLink && event.bookingLink !== "#" ? (
                    <a
                      href={event.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-[var(--db-accent-highlight)] hover:underline"
                    >
                      External link <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-[var(--db-text-muted)]">
                      Local booking enabled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Redesigned Add/Edit Event Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8"
              >
                {/* Modal Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--db-card-border)] bg-white/[0.01]">
                  <h3
                    className="font-extrabold uppercase text-xs tracking-wider text-[var(--db-accent-highlight)]"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {editMode ? "Edit Event Details" : "Create New Event Post"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar"
                >
                  {/* SECTION 1: EVENT INFORMATION */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <Info
                        size={12}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      Basic Event Details
                    </h4>

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        Event Name / Title{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        required
                      />
                    </div>

                    {/* Venue Location */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        Venue / Location Address{" "}
                        <span className="text-red-500">*</span>
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
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        Description / About Event
                      </label>
                      <div className="relative">
                        <AlignLeft
                          size={14}
                          className="absolute left-3.5 top-3.5 text-[var(--db-text-muted)]"
                        />
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Venue Inclusions & Exclusions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Inclusions */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Venue Inclusions (One per line)
                        </label>
                        <textarea
                          value={inclusions}
                          onChange={(e) => setInclusions(e.target.value)}
                          rows={4}
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-green-500/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                        />
                      </div>
                      {/* Exclusions */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Venue Exclusions (One per line)
                        </label>
                        <textarea
                          value={exclusions}
                          onChange={(e) => setExclusions(e.target.value)}
                          rows={4}
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-red-500/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        Terms and Conditions (One per line)
                      </label>
                      <textarea
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        rows={4}
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* SECTION 1.5: DETAILED METRICS & BENEFITS */}
                  <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <Sparkles
                        size={12}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      Event Metrics & Benefits
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Category */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Category / Badge (e.g. Fitness)
                        </label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. Fitness"
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Duration (e.g. 50 mins)
                        </label>
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="e.g. 50 mins"
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        />
                      </div>

                      {/* Calories */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Calories (e.g. 400 calories)
                        </label>
                        <input
                          type="text"
                          value={calories}
                          onChange={(e) => setCalories(e.target.value)}
                          placeholder="e.g. 400 calories"
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        />
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        Benefits / Key Highlights (One per line)
                      </label>
                      <textarea
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                        rows={3}
                        placeholder="e.g. Double the Caloric Burn&#10;Maximum Core & Muscle Activation"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* SECTION 1.6: TYPICAL SESSION AGENDA */}
                  <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                        <ListTodo
                          size={12}
                          className="text-[var(--db-accent-highlight)]"
                        />
                        Typical Session Agenda (Timeline)
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setAgenda([
                            ...agenda,
                            { title: "", duration: "", color: "green" },
                          ]);
                        }}
                        className="flex items-center gap-1 bg-[var(--db-accent-glow)] hover:bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Plus size={10} />
                        Add Agenda Step
                      </button>
                    </div>

                    {agenda.length === 0 ? (
                      <div className="p-6 bg-white/[0.01] border border-[var(--db-card-border)] rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                        <p className="text-xs text-[var(--db-text-muted)]">
                          No agenda steps configured.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAgenda([
                              { title: "", duration: "", color: "green" },
                            ]);
                          }}
                         className="flex items-center gap-1 bg-[var(--db-accent-glow)] hover:bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <Plus size={12} />
                          Create First Step
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {agenda.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row gap-3 items-end bg-[var(--db-input-bg)] p-4 rounded-2xl border border-[var(--db-input-border)]"
                          >
                            {/* Step Title */}
                            <div className="flex-grow space-y-1 w-full text-left">
                              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                                Step Title
                              </label>
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => {
                                  const updated = [...agenda];
                                  updated[idx].title = e.target.value;
                                  setAgenda(updated);
                                }}
                                placeholder="e.g. Warm up in Water"
                                className="w-full bg-[var(--db-bg)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-3 py-2 text-xs text-[var(--db-text)]"
                                required
                              />
                            </div>

                            {/* Step Duration */}
                            <div className="w-full sm:w-32 space-y-1 text-left">
                              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={step.duration}
                                onChange={(e) => {
                                  const updated = [...agenda];
                                  updated[idx].duration = e.target.value;
                                  setAgenda(updated);
                                }}
                                placeholder="e.g. 5 mins"
                                className="w-full bg-[var(--db-bg)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-3 py-2 text-xs text-[var(--db-text)]"
                                required
                              />
                            </div>

                            {/* Step Color Selection */}
                            <div className="w-full sm:w-32 space-y-1 text-left">
                              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                                Bullet Color
                              </label>
                              <select
                                value={step.color}
                                onChange={(e) => {
                                  const updated = [...agenda];
                                  updated[idx].color = e.target.value;
                                  setAgenda(updated);
                                }}
                                className="w-full bg-[var(--db-bg)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-3 py-2 text-xs text-[var(--db-text)]"
                              >
                                <option value="green">Green</option>
                                <option value="orange">Orange</option>
                                <option value="blue">Blue</option>
                                <option value="red">Red/Pink</option>
                                <option value="purple">Purple</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setAgenda(agenda.filter((_, sIdx) => sIdx !== idx));
                              }}
                              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer h-[38px] flex items-center justify-center shrink-0 border border-red-500/5"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Dashed Bottom Add Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setAgenda([
                              ...agenda,
                              { title: "", duration: "", color: "green" },
                            ]);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/50 rounded-2xl text-xs font-black tracking-wider uppercase text-[var(--db-text-muted)] hover:text-[var(--db-text)] bg-[var(--db-input-bg)] hover:bg-[var(--db-accent-glow)]/5 transition-all cursor-pointer"
                        >
                          <Plus size={14} className="text-[var(--db-accent-highlight)]" />
                          Add Step
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: PRICING & LINKS */}
                  <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <DollarSign
                        size={12}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      Pricing & External Bookings
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Price */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Active Booking Price (₹){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 2790"
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                          required
                        />
                      </div>

                      {/* Original Price */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                          Original Price (₹, optional slashed amount)
                        </label>
                        <input
                          type="number"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="e.g. 3100"
                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        />
                      </div>
                    </div>

                    {/* External Booking Link */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)]">
                        External Ticket Booking Link (Optional)
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

                          className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: DATE & TIME SLOTS MANAGEMENT */}
                  <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                        <Calendar
                          size={12}
                          className="text-[var(--db-accent-highlight)]"
                        />
                        Manage Date & Time Schedules
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
                              date: formattedToday,
                              timeSlots: [
                                { time: "9:00 AM", slots: 20, booked: 0 },
                              ],
                            },
                          ]);
                        }}
                        className="flex items-center gap-1 bg-[var(--db-accent-glow)] hover:bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Plus size={10} />
                        Add Date Tab
                      </button>
                    </div>

                    {schedules.length === 0 ? (
                      <div className="p-6 bg-white/[0.01] border border-[var(--db-card-border)] rounded-2xl text-center">
                        <p className="text-xs text-[var(--db-text-muted)]">
                          No schedules configured. Users won't be able to pick
                          dates on the checkout screen.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 pr-1">
                        {schedules.map((schedule, sIndex) => (
                          <div
                            key={sIndex}
                            className="p-5 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-2xl relative space-y-4 transition-all"
                          >
                            {/* Date input */}
                            <div className="flex items-end justify-between gap-4">
                              <div className="flex-grow space-y-1">
                                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">
                                  Schedule Date
                                </label>
                                <div className="relative">
                                  <Calendar
                                    size={12}
                                    className="absolute left-3 top-3.5 text-[var(--db-text-muted)] pointer-events-none z-10"
                                  />
                                  <input
                                    type="date"
                                    value={convertToYYYYMMDD(schedule.date)}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                      const updated = [...schedules];
                                      updated[sIndex].date = e.target.value;
                                      setSchedules(updated);
                                    }}
                                    onClick={(e) =>
                                      e.target.showPicker &&
                                      e.target.showPicker()
                                    }
                                    className="w-full bg-[var(--db-bg)] border border-[var(--db-card-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--db-text)] transition-all font-semibold cursor-pointer"
                                    style={{ colorScheme: 'dark' }}
                                    required
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSchedules(
                                    schedules.filter(
                                      (_, idx) => idx !== sIndex,
                                    ),
                                  );
                                }}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer h-[40px] flex items-center justify-center shrink-0 border border-red-500/5"
                                title="Remove Date Tab"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Time Slots lists */}
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
                                            updated[sIndex].timeSlots[
                                              tIndex
                                            ].time = convertTo12Hour(
                                              e.target.value,
                                            );
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

                                    {/* Capacity count */}
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
                                              updated[sIndex].timeSlots[tIndex]
                                                .slots;
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
                                            updated[sIndex].timeSlots[
                                              tIndex
                                            ].slots = Number(e.target.value);
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
                                              updated[sIndex].timeSlots[tIndex]
                                                .slots;
                                            updated[sIndex].timeSlots[
                                              tIndex
                                            ].slots = currentVal + 1;
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
                                        disabled={
                                          schedule.timeSlots.length <= 1
                                        }
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
                    )}
                  </div>

                  {/* SECTION 4: MEDIA UPLOAD AREA */}
                  <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <Upload
                        size={12}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      Event Photo / Artwork
                    </h4>

                    {/* Preview box */}
                    {imagePreview ? (
                      <div className="aspect-[16/9] w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-2xl relative overflow-hidden flex items-center justify-center group">
                        <img
                          src={imagePreview}
                          alt="Upload Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute top-3 right-3 p-2 bg-black/80 text-red-400 hover:text-red-300 rounded-full transition-all border border-red-500/20 cursor-pointer z-10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/50 bg-[var(--db-input-bg)] hover:bg-white/[0.01] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[var(--db-accent-glow)] group-hover:text-[var(--db-accent-highlight)] flex items-center justify-center transition-all">
                          <Upload
                            size={20}
                            className="text-[var(--db-text-muted)] group-hover:text-[var(--db-accent-highlight)]"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--db-text)]">
                            Click to upload poster image
                          </p>
                          <p className="text-[10px] text-[var(--db-text-muted)] mt-1">
                            Supports PNG, JPG, JPEG (Max 10MB)
                          </p>
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

                  {/* Submit Panel */}
                  <div className="pt-6 border-t border-[var(--db-card-border)] flex justify-end gap-3 bg-white/[0.005]">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                      className="px-5 py-3 rounded-xl border border-[var(--db-input-border)] bg-transparent text-xs font-bold uppercase tracking-wider text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Save Event
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardEventsList;
