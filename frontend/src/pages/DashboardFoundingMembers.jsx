import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Crown,
  Edit,
  Trash,
  Plus,
  CheckCircle,
  Save,
  X,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getFounders, deleteFounder, updateFounder } from "../api/api";

// Box & Cross - Founding Members Management (Mobile Optimized)
const DashboardFoundingMembers = () => {
  const { user } = useAuth();
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch founders from API
  const fetchFounders = async () => {
    try {
      const { data } = await getFounders();
      setFounders(data);
    } catch (error) {
      console.error("Error fetching founders", error);
      toast.error("Failed to load founders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchFounders();

      // 1. Cross-tab communication: Listen for instant updates when a new founder joins
      const channel = new BroadcastChannel("founding_members_updates");
      channel.onmessage = (event) => {
        if (event.data === "NEW_FOUNDER_ADDED") {
          // Play a simple notification sound (optional, assuming browser allows)
          try {
            const audio = new Audio("/notification.mp3"); // Optional sound
            audio.play().catch((e) => {});
          } catch (e) {}

          toast.success("🎉 Alert: A new Founding Member just joined!", {
            duration: 6000,
            icon: "👑",
            style: {
              background: "#000",
              color: "#ccf141",
              border: "1px solid #ccf141",
            },
          });
          fetchFounders(); // Refetch immediately
        }
      };

      // 2. Refresh data when user returns to this tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchFounders();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // 3. Fallback background polling (every 60 seconds)
      const intervalId = setInterval(fetchFounders, 60000);

      return () => {
        channel.close();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        clearInterval(intervalId);
      };
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this founder?"))
      return;
    try {
      await deleteFounder(id);
      toast.success("Founder deleted successfully");
      fetchFounders();
    } catch (error) {
      console.error("Error deleting founder", error);
      toast.error("Failed to delete founder");
    }
  };

  return (
    <div className="p-3.5 sm:p-5 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-2 sm:col-span-1 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--db-accent-highlight)]/10 flex items-center justify-center border border-[var(--db-accent-highlight)]/20 shrink-0">
              <Users size={22} className="text-[var(--db-accent-highlight)]" />
            </div>
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Total Founders
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--db-text)]">
                {founders.length}
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
              <DollarSign size={22} className="text-green-500" />
            </div>
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Total Revenue
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--db-text)]">
                ₹
                {founders
                  .filter((f) => f.paymentStatus === "Completed")
                  .reduce(
                    (acc, curr) =>
                      acc + parseInt((curr.price || "12000").replace(/,/g, "")),
                    0,
                  )
                  .toLocaleString()}
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
              <Clock size={22} className="text-yellow-500" />
            </div>
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Pending
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--db-text)]">
                {founders.filter((f) => f.paymentStatus === "Pending").length}
              </h3>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-2xl transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)]">
                Founding Members
              </span>
            </div>
            <span className="text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text-muted)] px-2.5 py-1 rounded-full font-bold">
              {founders.length} Members
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
              <span>Loading founders...</span>
            </div>
          ) : founders.length > 0 ? (
            <>
              {/* Mobile Cards View (< md) */}
              <div className="block md:hidden space-y-3">
                {founders.map((founder) => (
                  <div
                    key={founder._id}
                    className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 hover:bg-[var(--db-table-hover)] transition-all space-y-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Crown size={12} className="text-[var(--db-accent-highlight)]" />
                          <span className="text-[9px] font-mono text-[var(--db-text-muted)]">
                            {new Date(founder.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-[var(--db-text)] text-sm truncate">
                          {founder.name}
                        </h4>
                        <div className="text-[10.5px] text-[var(--db-text-muted)] truncate">
                          {founder.phone} {founder.email ? `• ${founder.email}` : ""}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[var(--db-accent-highlight)] font-mono">
                          ₹{founder.price || "12,000"}
                        </span>
                        <div className="text-[9px] uppercase font-bold text-[var(--db-text-muted)]">
                          {founder.duration || "1 Year"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--db-card-border)]/50">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          founder.paymentStatus === "Completed"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}
                      >
                        {founder.paymentStatus}
                      </span>

                      <button
                        onClick={() => handleDelete(founder._id)}
                        className="p-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Delete Founder"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                      <th className="py-4 px-4 rounded-l-xl">Date</th>
                      <th className="py-4 px-4">Name</th>
                      <th className="py-4 px-4">Email / Phone</th>
                      <th className="py-4 px-4">Plan (Dur.)</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right rounded-r-xl">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)]">
                    {founders.map((founder) => (
                      <tr
                        key={founder._id}
                        className="hover:bg-[var(--db-table-hover)] transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-mono text-[var(--db-text-muted)]">
                          {new Date(founder.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-[var(--db-text)]">
                          {founder.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-[var(--db-text-muted)]">
                          <div>{founder.email}</div>
                          <div className="text-xs">{founder.phone}</div>
                        </td>
                        <td className="py-4 px-4 text-sm text-[var(--db-text)]">
                          {founder.duration || "1 Year"}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-[var(--db-accent-highlight)]">
                          ₹{founder.price || "12,000"}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              founder.paymentStatus === "Completed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {founder.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDelete(founder._id)}
                            className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[var(--db-text-muted)] text-xs">
              No founding members yet.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardFoundingMembers;
