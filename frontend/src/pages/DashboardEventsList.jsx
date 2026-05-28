import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Edit, Trash2, MapPin, DollarSign, ExternalLink, Save, X, Upload, Loader2, RefreshCw, Calendar, Clock, AlignLeft, Info
} from "lucide-react";
import { 
  getEventsListAdmin, createEventItem, updateEventItem, deleteEventItem 
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await getEventsListAdmin();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
    setSchedules([
      {
        date: "SAT 30 May",
        timeSlots: [
          { time: "6:00 AM", slots: 20, booked: 0 }
        ]
      },
      {
        date: "SUN 7 Jun",
        timeSlots: [
          { time: "8:00 AM", slots: 20, booked: 0 },
          { time: "9:00 AM", slots: 20, booked: 0 },
          { time: "10:00 AM", slots: 20, booked: 0 }
        ]
      }
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
    const toastId = toast.loading(editMode ? "Updating event..." : "Creating event...");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("location", location.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("schedules", JSON.stringify(schedules));
      
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
        toast.success(res.data.message || "Saved successfully!", { id: toastId });
        setShowModal(false);
        fetchEvents();
      } else {
        toast.error(res.data.message || "Failed to save event", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred while uploading. Please check inputs and credentials.",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This will also delete its image from Cloudinary.")) {
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
    <div className="p-6 md:p-8 min-h-screen bg-[#050505] text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#defb02]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
              Events Listing Manager
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              Admin Control Panel to create, edit, delete, and configure schedules for your fitness events.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchEvents}
              className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/5 transition-all flex items-center justify-center cursor-pointer"
              title="Reload event records"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-[#defb02]" : ""} />
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-[#defb02] text-black font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[#defb02]/10 hover:shadow-[#defb02]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Event
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#defb02]" size={36} />
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Fetching event records...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <Upload size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-bold uppercase mb-1">No Events Found</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Create your first fitness event to showcase it dynamically on the Events listing board.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              Add First Event
            </button>
          </div>
        ) : (
          /* Cards Grid Layout (Replacing Table) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 group"
              >
                {/* Event Photo with Hover Overlay actions */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black shrink-0">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/10 to-black/40 pointer-events-none" />

                  {/* Actions overlay panel */}
                  <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                    <button
                      onClick={() => handleOpenEdit(event)}
                      className="p-2 bg-black/70 hover:bg-[#defb02] text-white hover:text-black rounded-lg border border-white/10 hover:border-transparent transition-all cursor-pointer"
                      title="Edit Event Details"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 bg-black/70 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg border border-white/10 hover:border-transparent transition-all cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Price pill */}
                  <div className="absolute bottom-3 left-3 bg-[#ff9e00] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                    ₹{event.price} onwards
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase tracking-wide text-white group-hover:text-[#defb02] transition-colors leading-snug line-clamp-1">
                      {event.title}
                    </h3>

                    {/* Venue Location details */}
                    <div className="flex items-start gap-1.5 text-gray-400">
                      <MapPin size={13} className="text-gray-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed line-clamp-2">
                        {event.location}
                      </span>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  {/* Schedules Display list */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                        <Calendar size={10} />
                        Schedules ({event.schedules?.length || 0})
                      </span>
                    </div>

                    {!event.schedules || event.schedules.length === 0 ? (
                      <p className="text-[10px] text-gray-600 italic">No schedules set.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {event.schedules.map((sch, i) => (
                          <div key={i} className="text-[10px] bg-white/[0.02] border border-white/5 rounded-lg p-2 space-y-1">
                            <span className="font-extrabold text-[#defb02] uppercase">{sch.date}</span>
                            <div className="flex flex-wrap gap-1 text-[9px] text-gray-400">
                              {sch.timeSlots.map((ts, idx) => (
                                <span 
                                  key={idx} 
                                  className={`px-1.5 py-0.5 rounded border ${
                                    ts.booked >= ts.slots 
                                      ? "bg-red-500/10 border-red-500/20 text-red-400" 
                                      : "bg-white/5 border-white/5 text-gray-300"
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
                  <div className="text-[10px] text-gray-500">
                    {event.originalPrice ? (
                      <span>Original: <span className="line-through">₹{event.originalPrice}</span></span>
                    ) : (
                      <span>No discount set</span>
                    )}
                  </div>

                  {event.bookingLink && event.bookingLink !== "#" ? (
                    <a 
                      href={event.bookingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-[#defb02] hover:underline"
                    >
                      External link <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-600">Local booking enabled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Redesigned Add/Edit Event Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8"
              >
                {/* Modal Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.01]">
                  <h3 className="font-extrabold uppercase text-xs tracking-wider text-[#defb02]" style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}>
                    {editMode ? "Edit Event Details" : "Create New Event Post"}
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
                  
                  {/* SECTION 1: EVENT INFORMATION */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Info size={12} className="text-[#defb02]" />
                      Basic Event Details
                    </h4>

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Event Name / Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. JW Marriott Pool Workout"
                        className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-gray-700 transition-all"
                        required
                      />
                    </div>

                    {/* Venue Location */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Venue / Location Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-500" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Vile Parle East, Mumbai, Maharashtra"
                          className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-700 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Description / About Event
                      </label>
                      <div className="relative">
                        <AlignLeft size={14} className="absolute left-3.5 top-3.5 text-gray-500" />
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the training drills, scheduling, fitness gear, coaches, etc."
                          rows={3}
                          className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-700 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PRICING & LINKS */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <DollarSign size={12} className="text-[#defb02]" />
                      Pricing & External Bookings
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Price */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Active Booking Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 2790"
                          className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-gray-700 transition-all"
                          required
                        />
                      </div>

                      {/* Original Price */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Original Price (₹, optional slashed amount)
                        </label>
                        <input
                          type="number"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="e.g. 3100"
                          className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-gray-700 transition-all"
                        />
                      </div>
                    </div>

                    {/* External Booking Link */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        External Ticket Booking Link (Optional)
                      </label>
                      <div className="relative">
                        <ExternalLink size={14} className="absolute left-3.5 top-3.5 text-gray-500" />
                        <input
                          type="text"
                          value={bookingLink}
                          onChange={(e) => setBookingLink(e.target.value)}
                          placeholder="e.g. https://insider.in/event-link (leave blank for local seat booking)"
                          className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: DATE & TIME SLOTS MANAGEMENT */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#defb02]" />
                        Manage Date & Time Schedules
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setSchedules([
                            ...schedules,
                            { date: "", timeSlots: [{ time: "9:00 AM", slots: 20, booked: 0 }] }
                          ]);
                        }}
                        className="flex items-center gap-1 bg-[#defb02]/10 hover:bg-[#defb02]/15 text-[#defb02] border border-[#defb02]/20 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Plus size={10} />
                        Add Date Tab
                      </button>
                    </div>

                    {schedules.length === 0 ? (
                      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl text-center">
                        <p className="text-xs text-gray-500">No schedules configured. Users won't be able to pick dates on the checkout screen.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pr-1">
                        {schedules.map((schedule, sIndex) => (
                          <div 
                            key={sIndex} 
                            className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl relative space-y-4 transition-all"
                          >
                            {/* Date input */}
                            <div className="flex items-end justify-between gap-4">
                              <div className="flex-grow space-y-1">
                                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-500">
                                  Schedule Date Name
                                </label>
                                <div className="relative">
                                  <Calendar size={12} className="absolute left-3 top-2.5 text-gray-600" />
                                  <input
                                    type="text"
                                    value={schedule.date}
                                    onChange={(e) => {
                                      const updated = [...schedules];
                                      updated[sIndex].date = e.target.value;
                                      setSchedules(updated);
                                    }}
                                    placeholder="e.g. SAT 30 May"
                                    className="w-full bg-[#050505] border border-white/5 focus:border-[#defb02]/50 outline-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-800 transition-all"
                                    required
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSchedules(schedules.filter((_, idx) => idx !== sIndex));
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                                title="Remove Date Tab"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Time Slots lists */}
                            <div className="pl-3 border-l border-white/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                                  <Clock size={10} />
                                  Configure Time Slots
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...schedules];
                                    updated[sIndex].timeSlots.push({ time: "9:00 AM", slots: 20, booked: 0 });
                                    setSchedules(updated);
                                  }}
                                  className="text-[9px] font-bold uppercase text-[#defb02] hover:underline cursor-pointer"
                                >
                                  + Add Time Slot
                                </button>
                              </div>

                              {schedule.timeSlots.map((slot, tIndex) => (
                                <div key={tIndex} className="flex items-center gap-2 bg-[#050505] p-2 rounded-xl border border-white/5">
                                  {/* Slot Time */}
                                  <div className="flex-grow">
                                    <input
                                      type="text"
                                      value={slot.time}
                                      onChange={(e) => {
                                        const updated = [...schedules];
                                        updated[sIndex].timeSlots[tIndex].time = e.target.value;
                                        setSchedules(updated);
                                      }}
                                      placeholder="e.g. 8:00 AM"
                                      className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-gray-800"
                                      required
                                    />
                                  </div>

                                  {/* Capacity count */}
                                  <div className="w-24 flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                    <span className="text-[8px] text-gray-500 font-bold uppercase shrink-0">Limit:</span>
                                    <input
                                      type="number"
                                      value={slot.slots}
                                      onChange={(e) => {
                                        const updated = [...schedules];
                                        updated[sIndex].timeSlots[tIndex].slots = Number(e.target.value);
                                        setSchedules(updated);
                                      }}
                                      className="w-full bg-transparent border-none outline-none text-xs text-white text-center font-bold"
                                      required
                                    />
                                  </div>

                                  {/* Booked seats count */}
                                  <div className="text-[9px] text-gray-500 font-semibold px-2">
                                    Booked: {slot.booked || 0}
                                  </div>

                                  {/* Delete Specific Time Slot */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...schedules];
                                      updated[sIndex].timeSlots = updated[sIndex].timeSlots.filter((_, idx) => idx !== tIndex);
                                      setSchedules(updated);
                                    }}
                                    disabled={schedule.timeSlots.length <= 1}
                                    className="p-1 text-gray-600 hover:text-red-400 disabled:opacity-30 rounded transition-all cursor-pointer"
                                    title="Delete Time Slot"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: MEDIA UPLOAD AREA */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Upload size={12} className="text-[#defb02]" />
                      Event Photo / Artwork
                    </h4>

                    {/* Preview box */}
                    {imagePreview ? (
                      <div className="aspect-[16/9] w-full bg-[#050505] border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center group">
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
                        className="border-2 border-dashed border-white/10 hover:border-[#defb02]/50 bg-[#050505] hover:bg-white/[0.01] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#defb02]/10 group-hover:text-[#defb02] flex items-center justify-center transition-all">
                          <Upload size={20} className="text-gray-400 group-hover:text-[#defb02]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-gray-300">Click to upload poster image</p>
                          <p className="text-[10px] text-gray-600 mt-1">Supports PNG, JPG, JPEG (Max 10MB)</p>
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
                  <div className="pt-6 border-t border-white/5 flex justify-end gap-3 bg-white/[0.005]">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                      className="px-5 py-3 rounded-xl border border-white/15 bg-transparent text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 bg-[#defb02] text-black font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#defb02]/10 hover:shadow-[#defb02]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                      style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
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
