import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Search, DollarSign, CheckCircle, AlertTriangle, Calendar, Filter, Trash2, Users, ArrowUpDown, Download
} from "lucide-react";
import { getEventBookings, deleteEventBooking } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardEventPayments = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (!window.confirm("Are you sure you want to delete this event booking record? This will also revert the booked seat slots.")) {
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
        toast.success(data.message || "Record deleted successfully", { id: toastId });
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
      toast.error("An error occurred while deleting the booking record.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  // Compute stats
  const totalVolume = bookings
    .filter(b => b.status === "payment successfully" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const successfulTxns = bookings.filter(b => b.status === "payment successfully" || b.status === "confirmed").length;
  const pendingTxns = bookings.filter(b => b.status === "not payment").length;
  const failedTxns = bookings.filter(b => b.status === "failed").length;

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.toLowerCase().includes(query) ||
      (booking.event?.title || "").toLowerCase().includes(query) ||
      (booking.razorpayOrderId || "").toLowerCase().includes(query) ||
      (booking.razorpayPaymentId || "").toLowerCase().includes(query);

    const matchesStatus = 
      statusFilter === "all" || 
      booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      { name: "Razorpay Order ID", width: 220 },
      { name: "Razorpay Payment ID", width: 220 },
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
      Number(booking.totalAmount) === 0 ? "Free Plan" : `₹${booking.totalAmount}`,
      booking.razorpayOrderId || "N/A",
      booking.razorpayPaymentId || "N/A",
      booking.status || ""
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

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Event_Bookings_${new Date().toISOString().split('T')[0]}.xls`);
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
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
            Event Payments & Bookings
          </h1>
          <p className="text-[var(--db-text-muted)] text-xs md:text-sm mt-1">
            View details of users who registered for fitness events, track transaction status, and manage reservations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {/* Card 1: Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Event Collection
              </p>
              <h3 className="text-2xl font-black text-[var(--db-text)] mt-1">
                ₹{totalVolume.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/30 flex items-center justify-center text-[var(--db-accent-highlight)]">
              <DollarSign size={20} />
            </div>
          </motion.div>

          {/* Card 2: Success Payments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Successful Bookings
              </p>
              <h3 className="text-2xl font-black text-[var(--db-accent-highlight)] mt-1">
                {successfulTxns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <CheckCircle size={20} />
            </div>
          </motion.div>

          {/* Card 3: Pending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Pending Checkout
              </p>
              <h3 className="text-2xl font-black text-yellow-500 mt-1">
                {pendingTxns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={20} />
            </div>
          </motion.div>

          {/* Card 4: Failed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Failed Payments
              </p>
              <h3 className="text-2xl font-black text-red-500 mt-1">
                {failedTxns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle size={20} />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2 text-left">
              <CreditCard size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                Event Booking Records
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search user, event, order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 sm:w-56 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-gray-500 rounded-full pl-9 pr-4 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)]">
                <Filter size={12} className="mr-1.5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-[var(--db-text)] outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="all" className="bg-[var(--db-card)] text-[var(--db-text)]">All Status</option>
                  <option value="payment successfully" className="bg-[var(--db-card)] text-[var(--db-text)]">Payment Successfully</option>
                  <option value="not payment" className="bg-[var(--db-card)] text-[var(--db-text)]">Not Payment</option>
                  <option value="failed" className="bg-[var(--db-card)] text-[var(--db-text)]">Failed</option>
                </select>
              </div>

              {/* Export to Excel Button */}
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-1.5 px-4 h-9 bg-[#e5ff00] hover:bg-[#d4eb00] active:scale-95 text-black font-black uppercase tracking-wider text-[10px] rounded-full shadow-lg shadow-[#e5ff00]/10 transition-all cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                <Download size={12} />
                Export to Excel
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
              <span>Loading event bookings...</span>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto w-full custom-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-4 rounded-l-xl border-r border-[var(--db-card-border)]/40">Name</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Email</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Phone</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Event Details</th>
                    <th className="py-4 px-4 min-w-[180px] whitespace-nowrap border-r border-[var(--db-card-border)]/40">Schedule Date/Time</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Seats</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Total Amount</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Razorpay Order ID</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Razorpay Payment ID</th>
                    <th className="py-4 px-4 border-r border-[var(--db-card-border)]/40">Status</th>
                    <th className="py-4 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-[var(--db-table-hover)] transition-colors">
                      {/* Name */}
                      <td className="py-4 px-4 text-left font-bold text-[var(--db-text)] text-sm whitespace-nowrap border-r border-[var(--db-card-border)]/30">
                        {booking.name}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-left text-xs text-[var(--db-text-muted)] font-medium border-r border-[var(--db-card-border)]/30">
                        {booking.email}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-left text-xs text-[var(--db-text-muted)] font-mono whitespace-nowrap border-r border-[var(--db-card-border)]/30">
                        {booking.phone}
                      </td>

                      {/* Event Details */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-semibold max-w-[200px] truncate border-r border-[var(--db-card-border)]/30">
                        {booking.event?.title || "Deleted Event"}
                      </td>

                      {/* Schedule Date/Time */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] min-w-[180px] whitespace-nowrap border-r border-[var(--db-card-border)]/30">
                        <span className="font-bold text-[var(--db-accent-highlight)] uppercase block">{booking.date}</span>
                        <span className="text-[10px] text-[var(--db-text-muted)] block mt-0.5">{booking.timeSlot}</span>
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-bold font-mono border-r border-[var(--db-card-border)]/30">
                        {booking.seats}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-4 text-sm text-[var(--db-accent-highlight)] font-extrabold font-mono border-r border-[var(--db-card-border)]/30">
                        {Number(booking.totalAmount) === 0 ? (
                          <span className="text-xs font-black uppercase tracking-wider text-[#e5ff00]">Free Plan</span>
                        ) : (
                          `₹${booking.totalAmount.toLocaleString()}`
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
                        {Number(booking.totalAmount) === 0 && (booking.status === 'payment successfully' || booking.status === 'confirmed') ? (
                          <span className="inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black bg-[#e5ff00]/10 border border-[#e5ff00]/20 text-[#e5ff00]">
                            Free Entry Successful
                          </span>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black ${
                            booking.status === 'payment successfully' || booking.status === 'confirmed'
                              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                              : booking.status === 'not payment'
                              ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/10 border border-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
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
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              No matching booking records found.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEventPayments;
