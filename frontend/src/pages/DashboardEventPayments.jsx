import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Search, DollarSign, CheckCircle, AlertTriangle, Calendar, Filter, Trash2, Users, ArrowUpDown
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

  const fetchBookings = async () => {
    try {
      const { data } = await getEventBookings();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching event bookings", error);
      toast.error("Failed to load event bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Handle Delete
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event booking record? This will also revert the booked seat slots.")) {
      return;
    }

    setDeletingId(id);
    const toastId = toast.loading("Deleting booking record...");
    try {
      const { data } = await deleteEventBooking(id);
      if (data.success) {
        toast.success(data.message || "Record deleted successfully", { id: toastId });
        fetchBookings();
      } else {
        toast.error("Failed to delete record", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the booking record.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  // Compute stats
  const totalVolume = bookings
    .filter(b => b.status === "successful" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const successfulTxns = bookings.filter(b => b.status === "successful" || b.status === "confirmed").length;
  const pendingTxns = bookings.filter(b => b.status === "pending").length;
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

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[var(--db-bg)] min-h-screen text-[var(--db-text)] relative transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--db-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
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
                  <option value="successful" className="bg-[var(--db-card)] text-[var(--db-text)]">Successful</option>
                  <option value="pending" className="bg-[var(--db-card)] text-[var(--db-text)]">Pending</option>
                  <option value="failed" className="bg-[var(--db-card)] text-[var(--db-text)]">Failed</option>
                </select>
              </div>
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
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-4 rounded-l-xl">User Info</th>
                    <th className="py-4 px-4">Event Details</th>
                    <th className="py-4 px-4">Schedule Date/Time</th>
                    <th className="py-4 px-4">Seats</th>
                    <th className="py-4 px-4">Total Amount</th>
                    <th className="py-4 px-4">Razorpay Order ID</th>
                    <th className="py-4 px-4">Razorpay Payment ID</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-[var(--db-table-hover)] transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-4 text-left">
                        <div className="font-bold text-[var(--db-text)] text-sm">{booking.name}</div>
                        <div className="text-[10px] text-[var(--db-text-muted)] mt-0.5">{booking.email}</div>
                        <div className="text-[10px] text-[var(--db-text-muted)]">{booking.phone}</div>
                      </td>

                      {/* Event Details */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-semibold max-w-[200px] truncate">
                        {booking.event?.title || "Deleted Event"}
                      </td>

                      {/* Schedule Date/Time */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)]">
                        <span className="font-bold text-[var(--db-accent-highlight)] uppercase block">{booking.date}</span>
                        <span className="text-[10px] text-[var(--db-text-muted)] block mt-0.5">{booking.timeSlot}</span>
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-bold font-mono">
                        {booking.seats}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-4 text-sm text-[var(--db-accent-highlight)] font-extrabold font-mono">
                        ₹{booking.totalAmount.toLocaleString()}
                      </td>

                      {/* Razorpay Order ID */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-mono">
                        {booking.razorpayOrderId || "N/A"}
                      </td>

                      {/* Razorpay Payment ID */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-mono">
                        {booking.razorpayPaymentId || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black ${
                          booking.status === 'successful' || booking.status === 'confirmed'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : booking.status === 'pending'
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {booking.status}
                        </span>
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
