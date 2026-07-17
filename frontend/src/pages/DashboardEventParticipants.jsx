import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Calendar, Filter, Trash2, Download, CheckCircle, Tag, Clock, Phone, Mail, Award, XCircle,
  X, Plus, Edit2, MessageCircle, MoreVertical, Clipboard, Check, ChevronLeft, ChevronRight, MessageSquare, ChevronDown,
  Ticket
} from "lucide-react";
import { getEventBookings, deleteEventBooking, updateEventBooking, getEventsList } from "../api/api";
import { toast } from "react-hot-toast";

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
        getEventsList()
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
          prev.map((b) => (b._id === id ? { ...b, ...data.data } : b))
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
    if (!window.confirm("Are you sure you want to delete this participant record? This will also revert the booked seat slots.")) {
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
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected participant(s)? This will also revert their booked seat slots in the database.`)) {
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
      toast.success(`Successfully deleted ${successCount} record(s).`, { id: toastId });
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
      toast.success(`Successfully updated ${successCount} records!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bulk records", { id: toastId });
    }
  };

  const getNormalizedStatus = (booking) => {
    if (!booking) return "Awaiting";
    const status = booking.status;
    if (status === "payment successfully" || status === "confirmed" || status === "Confirmed") {
      return "Confirmed";
    }
    if (status === "cancelled" || status === "failed" || status === "notcoming" || status === "Not Coming") {
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
  const uniqueEvents = Array.from(new Set(bookings.map((b) => b.event?.title).filter(Boolean)));

  // Current active event bookings
  const activeBookings = eventFilter === "all"
    ? bookings
    : bookings.filter((b) => b.event?.title === eventFilter);

  // Status-based counts
  const totalRegistrations = activeBookings.length;
  
  const confirmedCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Confirmed"
  ).length;

  const awaitingCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Awaiting"
  ).length;

  const followUpCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Follow-up"
  ).length;

  const noResponseCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "No Response"
  ).length;

  const notComingCount = activeBookings.filter(
    (b) => getNormalizedStatus(b) === "Not Coming"
  ).length;

  const getCapacityStats = () => {
    let totalSlots = 0;
    let bookedSlots = 0;

    const filteredEvents = eventFilter === "all"
      ? events
      : events.filter(e => e.title === eventFilter);

    filteredEvents.forEach(evt => {
      if (evt.schedules) {
        evt.schedules.forEach(sched => {
          if (sched.timeSlots) {
            sched.timeSlots.forEach(slot => {
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
      const freshBooking = selectedBooking ? filteredBookings.find((b) => b._id === selectedBooking._id) : null;
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
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
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
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
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
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      : "N/A";

    list.push({
      time: dateStr,
      activity: `Registered - Initiated checkout for ${booking.event?.title || "Event"}`,
      type: "system"
    });

    if (booking.status === "payment successfully" || booking.status === "confirmed") {
      list.push({
        time: dateStr,
        activity: "Confirmed - Will be attending",
        type: "status"
      });
    }
    return list;
  };

  const handleAddTimelineLog = async () => {
    if (!newLogActivity.trim()) return;
    const newLog = {
      time: new Date().toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      activity: `${newLogType} - ${newLogActivity}`,
      type: newLogType.toLowerCase()
    };
    const updatedTimeline = [...(selectedBooking.timeline || []), newLog];
    const lastContactStr = `${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ${newLogType} Sent`;

    await handleUpdateBooking(selectedBooking._id, {
      timeline: updatedTimeline,
      lastContact: lastContactStr
    });
    setNewLogActivity("");
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
      { name: "Status", width: 160 }
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
            minute: "2-digit"
          })
        : "N/A",
      booking.status || ""
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

    headers.forEach(h => {
      html += `              <th width="${h.width}">${h.name}</th>\n`;
    });

    html += `            </tr>
          </thead>
          <tbody>
    `;

    rows.forEach(row => {
      html += `            <tr>\n`;
      row.forEach(cell => {
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

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Event_Participants_${new Date().toISOString().split('T')[0]}.xls`);
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
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
              Event Participants
            </h1>
          </div>

          {/* Dynamic Event Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-full">
            <button
              onClick={() => { setEventFilter("all"); setCurrentPage(1); }}
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
              const count = bookings.filter((b) => b.event?.title === evt).length;
              return (
                <button
                  key={evt}
                  onClick={() => { setEventFilter(evt); setCurrentPage(1); }}
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

        {/* Split screen content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Panel */}
          <motion.div
            layout
            className={`bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 shadow-2xl transition-all duration-300 ${
              selectedBooking ? "lg:col-span-8 xl:col-span-8" : "lg:col-span-12"
            }`}
          >
            {/* Table Header controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--db-card-border)]">
              
              {/* Left: Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
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
                  onClick={() => { setStatusFilter("confirmed"); setCurrentPage(1); }}
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
                  onClick={() => { setStatusFilter("awaiting"); setCurrentPage(1); }}
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
                  onClick={() => { setStatusFilter("followup"); setCurrentPage(1); }}
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
                  onClick={() => { setStatusFilter("noresponse"); setCurrentPage(1); }}
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
                  onClick={() => { setStatusFilter("notcoming"); setCurrentPage(1); }}
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
                    <Trash2 size={11} /> Delete Selected ({selectedRows.length})
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
                <svg className="animate-spin h-6 w-6 text-[var(--db-accent-highlight)]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Loading event participants...</span>
              </div>
            ) : currentItems.length > 0 ? (
              <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                <table className="w-full text-left border-collapse table-fixed" style={{minWidth:"820px"}}>
                  <colgroup>
                    <col style={{width:"18%"}} /> {/* Name */}
                    <col style={{width:"14%"}} /> {/* Phone */}
                    <col style={{width:"5%"}} />  {/* Seats */}
                    <col style={{width:"12%"}} /> {/* Status */}
                    <col style={{width:"15%"}} /> {/* Last Contact */}
                    <col style={{width:"13%"}} /> {/* Follow-up */}
                    <col style={{width:"13%"}} /> {/* Notes */}
                    <col style={{width:"10%"}} /> {/* Actions */}
                  </colgroup>
                  <thead>
                    <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[9px] uppercase font-extrabold tracking-wider">
                      {isSelectMode && (
                        <th className="py-2.5 px-2 w-7">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={currentItems.length > 0 && selectedRows.length === currentItems.length}
                            className="rounded border-[var(--db-card-border)] bg-[var(--db-input-bg)] focus:ring-[var(--db-accent-highlight)] cursor-pointer"
                          />
                        </th>
                      )}
                      <th className="py-2.5 px-3 whitespace-nowrap">Name</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Phone</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap">Seats</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-2 whitespace-nowrap">Last Contact</th>
                      <th className="py-2.5 px-2 whitespace-nowrap">Follow-up</th>
                      <th className="py-2.5 px-2 whitespace-nowrap">Notes</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)]">
                    {currentItems.map((booking) => {
                      const isSelected = selectedBooking && selectedBooking._id === booking._id;
                      return (
                        <tr
                          key={booking._id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`hover:bg-[var(--db-table-hover)] transition-colors cursor-pointer ${
                            isSelected ? "bg-[var(--db-table-hover)] border-l-4 border-[var(--db-accent-highlight)]" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          {isSelectMode && (
                            <td className="py-2 px-2" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(booking._id)}
                                onChange={() => handleSelectRow(booking._id)}
                                className="rounded border-[var(--db-card-border)] bg-[var(--db-input-bg)] focus:ring-[var(--db-accent-highlight)] cursor-pointer"
                              />
                            </td>
                          )}

                          {/* Name */}
                          <td className="py-2 px-3 font-bold text-[var(--db-text)] text-[11px] whitespace-nowrap">
                            {booking.name}
                          </td>

                          {/* Phone */}
                          <td className="py-2 px-3 text-[11px] text-[var(--db-text-muted)] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Phone size={11} className="text-gray-500" />
                              <span className="font-mono">{booking.phone}</span>
                            </div>
                          </td>

                          {/* Seats */}
                          <td className="py-2 px-2 text-center text-[11px] font-black text-[var(--db-text)]">
                            {booking.seats}
                          </td>

                          {/* Status */}
                          <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            {(() => {
                              const ns = getNormalizedStatus(booking);
                              const statusColorMap = {
                                "Confirmed":   "border-green-500/30 text-green-400 bg-green-500/10",
                                "Awaiting":    "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
                                "Follow-up":   "border-blue-500/30 text-blue-400 bg-blue-500/10",
                                "No Response": "border-gray-500/30 text-gray-400 bg-gray-500/10",
                                "Not Coming":  "border-red-500/30 text-red-400 bg-red-500/10",
                              };
                              return (
                                <select
                                  value={ns}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const toDb = {
                                      "Confirmed":   "payment successfully",
                                      "Awaiting":    "Awaiting",
                                      "Follow-up":   "Follow-up",
                                      "No Response": "No Response",
                                      "Not Coming":  "cancelled",
                                    };
                                    handleUpdateBooking(booking._id, { status: toDb[val] || val });
                                  }}
                                  className={`px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-extrabold border cursor-pointer focus:outline-none transition-all ${statusColorMap[ns] || "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}
                                >
                                  <option value="Confirmed"   className="bg-[#121212] text-green-400">Confirmed</option>
                                  <option value="Awaiting"    className="bg-[#121212] text-yellow-400">Awaiting</option>
                                  <option value="Follow-up"   className="bg-[#121212] text-blue-400">Follow-up</option>
                                  <option value="No Response" className="bg-[#121212] text-gray-400">No Response</option>
                                  <option value="Not Coming"  className="bg-[#121212] text-red-400">Not Coming</option>
                                </select>
                              );
                            })()}
                          </td>

                          {/* Last Contact */}
                          <td className="py-2 px-2 text-[11px] text-[var(--db-text)] font-semibold max-w-[120px]" onClick={(e) => e.stopPropagation()}>
                            <input
                              key={booking._id + "-lc-" + (booking.lastContact || "")}
                              type="text"
                              defaultValue={booking.lastContact || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (booking.lastContact || "")) {
                                  handleUpdateBooking(booking._id, { lastContact: e.target.value });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.target.blur();
                              }}
                              placeholder="-"
                              className="w-full bg-transparent border-b border-transparent hover:border-gray-800 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[var(--db-text)] text-[11px] font-semibold px-1 py-0.5 focus:outline-none transition-all rounded"
                            />
                          </td>

                          {/* Next Follow-up */}
                          <td className="py-2 px-2 text-[11px] font-extrabold text-orange-400 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <input
                              key={booking._id + "-nf-" + (booking.nextFollowUp || "")}
                              type="text"
                              defaultValue={booking.nextFollowUp || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (booking.nextFollowUp || "")) {
                                  handleUpdateBooking(booking._id, { nextFollowUp: e.target.value });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.target.blur();
                              }}
                              placeholder="-"
                              className="w-full bg-transparent border-b border-transparent hover:border-gray-800 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[11px] font-extrabold text-orange-400 px-1 py-0.5 focus:outline-none transition-all rounded"
                            />
                          </td>

                          {/* Notes */}
                          <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              key={booking._id + "-nt-" + (booking.notes || "")}
                              type="text"
                              defaultValue={booking.notes || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (booking.notes || "")) {
                                  handleUpdateBooking(booking._id, { notes: e.target.value });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.target.blur();
                              }}
                              placeholder="-"
                              className="w-full bg-transparent border-b border-transparent hover:border-gray-800 focus:border-[var(--db-accent-highlight)] focus:bg-[var(--db-input-bg)] text-[var(--db-text)] text-[11px] px-1 py-0.5 focus:outline-none transition-all rounded text-center"
                            />
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5 relative">
                              <a
                                href={`https://wa.me/${booking.phone}?text=Hi ${booking.name}, this is Box & Cross regarding your registration for ${booking.event?.title || "our event"}...`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 hover:bg-green-500/10 text-green-400 rounded-md transition-all cursor-pointer"
                                title="Send WhatsApp Message"
                              >
                                <MessageCircle size={13} />
                              </a>
                              <a
                                href={`tel:${booking.phone}`}
                                className="p-1.5 hover:bg-yellow-500/10 text-yellow-400 rounded-md transition-all cursor-pointer"
                                title="Call Participant"
                              >
                                <Phone size={13} />
                              </a>
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="p-1.5 hover:bg-purple-500/10 text-purple-400 rounded-md transition-all cursor-pointer"
                                title="Edit notes & timeline"
                              >
                                <Clipboard size={13} />
                              </button>
                              
                              {/* 3-dots actions menu */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveMenuId(activeMenuId === booking._id ? null : booking._id)}
                                  className="p-1.5 hover:bg-gray-500/10 text-[var(--db-text-muted)] rounded-md transition-all cursor-pointer"
                                >
                                  <MoreVertical size={13} />
                                </button>
                                <AnimatePresence>
                                  {activeMenuId === booking._id && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 bottom-8 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-xl z-50 w-36 overflow-hidden"
                                      >
                                        <button
                                          onClick={() => {
                                            handleUpdateBooking(booking._id, { status: "payment successfully" });
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-green-400 cursor-pointer"
                                        >
                                          ✓ Confirmed
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleUpdateBooking(booking._id, { status: "Awaiting" });
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-yellow-400 cursor-pointer"
                                        >
                                          ⏳ Awaiting
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleUpdateBooking(booking._id, { status: "Follow-up" });
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-blue-400 cursor-pointer"
                                        >
                                          🔄 Follow-up
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleUpdateBooking(booking._id, { status: "No Response" });
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-[11px] font-bold hover:bg-[var(--db-sidebar-link-hover)] text-gray-400 cursor-pointer"
                                        >
                                          📵 No Response
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleUpdateBooking(booking._id, { status: "cancelled" });
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} entries
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Sliding Detail Panel */}
          <AnimatePresence>
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-4 xl:col-span-4 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 shadow-2xl sticky top-6 text-left space-y-6"
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-[var(--db-text)] uppercase tracking-wide">
                      {selectedBooking.name}
                    </h2>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-black ${
                      selectedBooking.status === 'payment successfully' || selectedBooking.status === 'confirmed'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : selectedBooking.status === 'not payment'
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {selectedBooking.status === 'payment successfully' || selectedBooking.status === 'confirmed' ? 'Confirmed' : selectedBooking.status === 'not payment' ? 'Awaiting' : 'Not Coming'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-1.5 hover:bg-gray-500/10 text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Direct Contacts */}
                <div className="space-y-3 pb-4 border-b border-[var(--db-card-border)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--db-text-muted)] font-semibold">
                    <Phone size={13} className="text-gray-500" />
                    <span className="font-mono">{selectedBooking.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--db-text-muted)] font-semibold">
                    <Mail size={13} className="text-gray-500" />
                    <span>{selectedBooking.email}</span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[var(--db-card-border)]">
                  <div>
                    <div className="text-[9px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">Seats</div>
                    <div className="text-sm font-extrabold mt-0.5">{selectedBooking.seats}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[var(--db-text-muted)] font-black uppercase tracking-wider">Registered On</div>
                    <div className="text-xs font-semibold mt-0.5">
                      {selectedBooking.createdAt 
                        ? new Date(selectedBooking.createdAt).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) + `, ${new Date(selectedBooking.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
                        : "N/A"
                      }
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                    Communication Timeline
                  </h3>

                  <div className="relative border-l border-gray-700 pl-4 space-y-4 ml-2">
                    {getTimeline(selectedBooking).map((item, idx) => (
                      <div key={idx} className="relative">
                        {/* Status timeline node marker */}
                        <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--db-accent-highlight)] border border-[var(--db-card)]" />
                        <div className="text-[10px] text-gray-500 font-extrabold">{item.time}</div>
                        <div className="text-[11px] text-[var(--db-text)] font-semibold mt-0.5 leading-relaxed">
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Log Form */}
                  <div className="bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl p-3 space-y-2 mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">Log Interaction</span>
                      <select
                        value={newLogType}
                        onChange={(e) => setNewLogType(e.target.value)}
                        className="bg-transparent border-none text-[10px] font-bold text-[var(--db-accent-highlight)] outline-none cursor-pointer"
                      >
                        <option value="Call" className="bg-[var(--db-card)]">Call</option>
                        <option value="WhatsApp" className="bg-[var(--db-card)]">WhatsApp</option>
                        <option value="Email" className="bg-[var(--db-card)]">Email</option>
                        <option value="Status" className="bg-[var(--db-card)]">Status</option>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardEventParticipants;
