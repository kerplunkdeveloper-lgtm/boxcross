import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  Flame,
  Dumbbell,
  Trash2,
} from "lucide-react";
import { getBookings, deleteBooking } from "../api/api";

const DashboardBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const { data } = await getBookings();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings", error);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    const originalBookings = bookings;
    setBookings((prev) => prev.filter((b) => b._id !== id));
    try {
      const { data } = await deleteBooking(id);
      if (!data.success) {
        setBookings(originalBookings);
        alert("Failed to delete booking.");
      } else {
        fetchBookings(false);
      }
    } catch (error) {
      console.error("Error deleting booking", error);
      setBookings(originalBookings);
      alert(error.response?.data?.message || "Failed to delete booking.");
    }
  };

  return (
    <div className="p-3.5 sm:p-5 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-2xl transition-colors"
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)]">
                Visitors Members list
              </span>
            </div>
            <span className="text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text-muted)] px-2.5 py-1 rounded-full font-bold">
              {bookings.length} Total
            </span>
          </div>

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
              <span>Loading bookings from server...</span>
            </div>
          ) : bookings.length > 0 ? (
            <>
              {/* Mobile Cards View (< md) */}
              <div className="block md:hidden space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-3.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 hover:bg-[var(--db-table-hover)] transition-all space-y-2.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/25 flex items-center justify-center text-[var(--db-accent-highlight)] font-black text-xs shrink-0">
                          {booking.name?.charAt(0)?.toUpperCase() || "V"}
                        </div>
                        <span className="text-sm font-black text-[var(--db-text)] truncate">
                          {booking.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-1.5 text-[var(--db-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[var(--db-text-muted)] block">
                          Phone
                        </span>
                        <a
                          href={`tel:${booking.phone}`}
                          className="font-medium text-[var(--db-text)] hover:text-[var(--db-accent-highlight)] truncate block"
                        >
                          {booking.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[var(--db-text-muted)] block">
                          Schedule
                        </span>
                        <span className="font-medium text-[var(--db-text-muted)] truncate block">
                          {booking.day} {booking.month} • {booking.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--db-card-border)]/50 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Dumbbell
                          size={12}
                          className="text-[var(--db-accent-highlight)] shrink-0"
                        />
                        <span className="text-xs font-semibold text-[var(--db-text)] truncate">
                          {booking.goal}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle size={9} />
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                      <th className="py-4 px-4 rounded-l-xl">Visitor</th>
                      <th className="py-4 px-4">Phone</th>
                      <th className="py-4 px-4">Goal</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Time</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right rounded-r-xl">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)]">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-[var(--db-table-hover)] transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-bold text-[var(--db-text)]">
                          {booking.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-[var(--db-text-muted)]">
                          {booking.phone}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--db-accent-glow)] border border-[var(--db-accent-highlight)]/20 flex items-center justify-center text-[var(--db-accent-highlight)]">
                              <Dumbbell size={14} />
                            </div>
                            <span className="text-sm font-medium text-[var(--db-text)]">
                              {booking.goal}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-[var(--db-text-muted)]">
                          {booking.day} {booking.month}
                        </td>
                        <td className="py-4 px-4 text-sm text-[var(--db-text-muted)]">
                          {booking.time}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-sm">
                            <CheckCircle size={10} />
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="p-2 text-[var(--db-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center border border-dashed border-[var(--db-card-border)] rounded-xl">
              <p className="text-[var(--db-text-muted)] text-xs md:text-sm mb-4">
                No gym tour visits scheduled yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all cursor-pointer"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                Book a Visit Now
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardBookings;
