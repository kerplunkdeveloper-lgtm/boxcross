import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Calendar, Filter, Trash2, Download, CheckCircle, Tag, Clock, Phone, Mail, Award, XCircle
} from "lucide-react";
import { getEventBookings, deleteEventBooking } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardEventParticipants = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("confirmed"); // default to confirmed participants
  const [deletingId, setDeletingId] = useState(null);

  const fetchBookings = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const { data } = await getEventBookings();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching event bookings/participants", error);
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
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle Delete Participant
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
        toast.success(data.message || "Record deleted successfully", { id: toastId });
        fetchBookings(false);
      } else {
        setBookings(originalBookings);
        toast.error("Failed to delete record", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      setBookings(originalBookings);
      toast.error("An error occurred while deleting the participant record.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  // Unique events for the filter dropdown
  const uniqueEvents = Array.from(
    new Set(
      bookings
        .map((b) => b.event?.title)
        .filter(Boolean)
    )
  );

  // Compute Stats based on selected event tab
  const activeBookings = eventFilter === "all"
    ? bookings
    : bookings.filter((b) => b.event?.title === eventFilter);

  const totalRegistrations = activeBookings.length;
  
  const confirmedCount = activeBookings.filter(
    (b) => b.status === "payment successfully" || b.status === "confirmed"
  ).length;

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const awaitingConfirmationCount = activeBookings.filter(
    (b) => b.status === "not payment" && new Date(b.createdAt) >= oneDayAgo
  ).length;

  const followUpCount = activeBookings.filter(
    (b) => b.status === "not payment" && new Date(b.createdAt) < oneDayAgo
  ).length;

  const notComingCount = activeBookings.filter(
    (b) => b.status === "cancelled" || b.status === "failed"
  ).length;

  // Filter Bookings/Participants
  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.toLowerCase().includes(query) ||
      (booking.event?.title || "").toLowerCase().includes(query);

    const matchesEvent = 
      eventFilter === "all" || 
      booking.event?.title === eventFilter;

    let matchesStatus = true;
    if (statusFilter === "confirmed") {
      matchesStatus = booking.status === "payment successfully" || booking.status === "confirmed";
    } else if (statusFilter === "paid") {
      matchesStatus = (booking.status === "payment successfully" || booking.status === "confirmed") && booking.totalAmount > 0;
    } else if (statusFilter === "free") {
      matchesStatus = (booking.status === "payment successfully" || booking.status === "confirmed") && booking.totalAmount === 0;
    } else if (statusFilter === "pending") {
      matchesStatus = booking.status === "not payment";
    } else if (statusFilter === "failed") {
      matchesStatus = booking.status === "failed";
    } else if (statusFilter === "all") {
      matchesStatus = true;
    }

    return matchesSearch && matchesEvent && matchesStatus;
  });

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
        
        {/* Header Title */}
        <div className="text-left flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
              Event Participants
            </h1>

          </div>

            {/* Dynamic Event Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-3 mb-2 relative z-20">
          <button
            onClick={() => setEventFilter("all")}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              eventFilter === "all"
                ? "bg-[#e5ff00] text-black shadow-lg shadow-[#e5ff00]/10 border border-[#e5ff00]"
                : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
            }`}
            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
          >
            <Users size={13} />
            All Events ({bookings.length})
          </button>
          
          {uniqueEvents.map((evt) => {
            const count = bookings.filter((b) => b.event?.title === evt).length;

            return (
              <button
                key={evt}
                onClick={() => setEventFilter(evt)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  eventFilter === evt
                    ? "bg-[#e5ff00] text-black shadow-lg shadow-[#e5ff00]/10 border border-[#e5ff00]"
                    : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)]"
                }`}
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Award size={13} />
                {evt} ({count})
              </button>
            );
          })}
        </div>
        </div>
      

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
          {/* Card 1: Total Registrations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-black text-[var(--db-text)]">
                {totalRegistrations}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest mt-1">
                Total Registrations
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Users size={20} />
            </div>
          </motion.div>

          {/* Card 2: Confirmed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-black text-green-400">
                {confirmedCount}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest mt-1">
                Confirmed
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle size={20} />
            </div>
          </motion.div>

          {/* Card 3: Awaiting Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-black text-yellow-400">
                {awaitingConfirmationCount}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest mt-1">
                Awaiting Confirmation
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Clock size={20} />
            </div>
          </motion.div>

          {/* Card 4: Follow-up Pending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-black text-orange-400">
                {followUpCount}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest mt-1">
                Follow-up Pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Phone size={20} />
            </div>
          </motion.div>

          {/* Card 5: Not Coming */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-black text-red-400">
                {notComingCount}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest mt-1">
                Not Coming
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <XCircle size={20} />
            </div>
          </motion.div>
        </div>

        {/* Main List Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 md:p-8 shadow-2xl transition-colors"
        >
          {/* List Header controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2 text-left">
              <Users size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                Participant Directory ({filteredBookings.reduce((sum, b) => sum + (b.status === "payment successfully" || b.status === "confirmed" ? b.seats : 0), 0)} Confirmed Seats)
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search name, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 sm:w-56 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-gray-500 rounded-full pl-9 pr-4 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                />
              </div>


              {/* Status/Type Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)]">
                <Filter size={12} className="mr-1.5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-[var(--db-text)] outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="confirmed" className="bg-[var(--db-card)] text-[var(--db-text)]">Confirmed Participants</option>
                  <option value="paid" className="bg-[var(--db-card)] text-[var(--db-text)]">Paid Tickets</option>
                  <option value="free" className="bg-[var(--db-card)] text-[var(--db-text)]">Free Entries</option>
                  <option value="pending" className="bg-[var(--db-card)] text-[var(--db-text)]">Pending Payments</option>
                  <option value="failed" className="bg-[var(--db-card)] text-[var(--db-text)]">Failed Checkout</option>
                  <option value="all" className="bg-[var(--db-card)] text-[var(--db-text)]">All Registrations</option>
                </select>
              </div>

              {/* Export to Excel Button */}
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-1.5 px-4 h-9 bg-[#e5ff00] hover:bg-[#d4eb00] active:scale-95 text-black font-black uppercase tracking-wider text-[10px] rounded-full shadow-lg shadow-[#e5ff00]/10 transition-all cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Download size={12} />
                Export List
              </button>
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
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto w-full custom-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-4 rounded-l-xl border-r border-[var(--db-card-border)]/40">Participant Details</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Event Attending</th>
                    <th className="py-4 px-4 min-w-[180px] whitespace-nowrap border-r border-[var(--db-card-border)]/40">Date & Time Slot</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40 text-center">Seats Booked</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Ticket Type</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Registered On</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Status</th>
                    <th className="py-4 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-[var(--db-table-hover)] transition-colors">
                      {/* Name, Email, Phone */}
                      <td className="py-4 px-4 text-left border-r border-[var(--db-card-border)]/30">
                        <div className="font-bold text-[var(--db-text)] text-sm whitespace-nowrap">{booking.name}</div>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--db-text-muted)]">
                          <Mail size={11} className="text-gray-500" />
                          <span>{booking.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[var(--db-text-muted)]">
                          <Phone size={11} className="text-gray-500" />
                          <span className="font-mono">{booking.phone}</span>
                        </div>
                      </td>

                      {/* Event Title */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-bold border-r border-[var(--db-card-border)]/30 max-w-[220px] truncate">
                        {booking.event?.title || "Deleted Event"}
                      </td>

                      {/* Event Date / Slot */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] min-w-[180px] whitespace-nowrap border-r border-[var(--db-card-border)]/30">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[var(--db-accent-highlight)]" />
                          <span className="font-bold text-[var(--db-accent-highlight)] uppercase">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[var(--db-text-muted)]">
                          <Clock size={11} className="text-gray-500" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </td>

                      {/* Seats Booked */}
                      <td className="py-4 px-4 text-center text-sm text-[var(--db-text)] font-extrabold font-mono border-r border-[var(--db-card-border)]/30">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--db-accent-glow)]/10 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/20">
                          {booking.seats}
                        </span>
                      </td>

                      {/* Ticket Type */}
                      <td className="py-4 px-4 text-xs border-r border-[var(--db-card-border)]/30 font-bold">
                        {Number(booking.totalAmount) === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#e5ff00] bg-[#e5ff00]/10 px-2 py-0.5 rounded border border-[#e5ff00]/20 text-[10px] uppercase tracking-wider font-black">
                            Free Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 text-[10px] uppercase tracking-wider font-black">
                            Paid (₹{booking.totalAmount.toLocaleString()})
                          </span>
                        )}
                      </td>

                      {/* Date Registered */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] border-r border-[var(--db-card-border)]/30">
                        {booking.createdAt 
                          ? new Date(booking.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"
                        }
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 border-r border-[var(--db-card-border)]/30">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black ${
                          booking.status === 'payment successfully' || booking.status === 'confirmed'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : booking.status === 'not payment'
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {booking.status === 'payment successfully' ? 'Confirmed' : booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          disabled={deletingId === booking._id}
                          className="p-2 bg-transparent hover:bg-red-500/10 text-[var(--db-text-muted)] hover:text-red-400 rounded-lg transition-all cursor-pointer"
                          title="Remove Participant Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              No matching participant records found.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEventParticipants;
