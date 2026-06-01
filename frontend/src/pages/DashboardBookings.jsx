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

  const fetchBookings = async () => {
    try {
      const { data } = await getBookings();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const { data } = await deleteBooking(id);
        if (data.success) {
          setBookings((prev) => prev.filter((b) => b._id !== id));
        }
      } catch (error) {
        console.error("Error deleting booking", error);
        alert(error.response?.data?.message || "Failed to delete booking.");
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 md:p-8 shadow-2xl transition-colors"
        >
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                Visitors Members list
              </span>
            </div>
            <span className="text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text-muted)] px-2 py-0.5 rounded-sm font-bold">
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
            <div className="overflow-x-auto w-full">
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
          ) : (
            <div className="py-12 text-center border border-dashed border-[var(--db-card-border)] rounded-xl">
              <p className="text-[var(--db-text-muted)] text-xs md:text-sm mb-4">
                No gym tour visits scheduled yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all"
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
