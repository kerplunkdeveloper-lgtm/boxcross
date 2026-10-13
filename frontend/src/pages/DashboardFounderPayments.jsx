import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Crown,
  Search,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { getFounderPayments, deleteFounderPayment } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardFounderPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPayments = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const { data } = await getFounderPayments();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error("Error fetching founder payment transactions", error);
      toast.error("Failed to load founder payments");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this founder payment record?")) {
      return;
    }

    const originalPayments = payments;
    setPayments((prev) => prev.filter((p) => p._id !== id));

    try {
      const { data } = await deleteFounderPayment(id);
      if (data.success) {
        toast.success("Founder payment record deleted successfully");
        fetchPayments(false);
      } else {
        setPayments(originalPayments);
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting founder payment record", error);
      setPayments(originalPayments);
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments(true);
      const interval = setInterval(() => {
        fetchPayments(false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Compute stats
  const totalVolume = payments
    .filter((p) => p.paymentStatus === "success")
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const successfulTxns = payments.filter((p) => p.paymentStatus === "success").length;
  const pendingTxns = payments.filter((p) => p.paymentStatus === "pending").length;

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (payment.name || "").toLowerCase().includes(query) ||
      (payment.email || "").toLowerCase().includes(query) ||
      (payment.phone || "").toLowerCase().includes(query) ||
      (payment.transactionId || "").toLowerCase().includes(query) ||
      (payment.planName || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || payment.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ccf141]/20 text-[#ccf141] font-mono">
                FOUNDERS CLUB
              </span>
              <span className="text-xs text-[var(--db-text-muted)] font-mono">
                {payments.length} Transactions Recorded
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--db-text)] flex items-center gap-2.5 font-['BrutalTypeBold',sans-serif]">
              <Crown className="text-[#ccf141] shrink-0" size={26} />
              <span>Founder Payment History</span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--db-text-muted)] mt-1">
              Review and manage incoming payments from Founding Member passes and subscription tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPayments(true)}
              className="px-3 py-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-card)] hover:bg-[var(--db-input-bg)] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {/* Card 1: Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-2 sm:col-span-1 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Founder Revenue
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--db-text)] mt-1">
                ₹{totalVolume.toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Verified Collections</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center text-[#ccf141] shrink-0">
              <DollarSign size={20} />
            </div>
          </motion.div>

          {/* Card 2: Successful Payments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Active Passes
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {successfulTxns}
              </h3>
              <p className="text-[10px] text-[var(--db-text-muted)] font-mono mt-0.5">Confirmed Members</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle size={20} />
            </div>
          </motion.div>

          {/* Card 3: Pending/Failed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[9.5px] sm:text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Pending Verification
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-yellow-500 mt-1">
                {pendingTxns}
              </h3>
              <p className="text-[10px] text-yellow-400 font-mono mt-0.5">In Checkout Pipeline</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
          </motion.div>
        </div>

        {/* Main List Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-2xl transition-colors"
        >
          {/* List Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 pb-4 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2 text-left">
              <Crown size={18} className="text-[#ccf141]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#ccf141]">
                Founding Member Transactions
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search athlete, txn, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full sm:w-60 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-[var(--db-text-muted)] rounded-full pl-9 pr-4 text-xs outline-none focus:border-[#ccf141] transition-colors"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)]">
                <Filter size={12} className="mr-1.5 text-[var(--db-text-muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-[var(--db-text)] outline-none cursor-pointer pr-1 text-xs w-full sm:w-auto"
                >
                  <option value="all" className="bg-[var(--db-card)] text-[var(--db-text)]">All Status</option>
                  <option value="success" className="bg-[var(--db-card)] text-[var(--db-text)]">Success</option>
                  <option value="pending" className="bg-[var(--db-card)] text-[var(--db-text)]">Pending</option>
                  <option value="failed" className="bg-[var(--db-card)] text-[var(--db-text)]">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / Mobile Cards */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[var(--db-text-muted)] text-xs gap-2">
              <RefreshCw className="animate-spin text-[#ccf141]" size={24} />
              <span>Loading founder transactions...</span>
            </div>
          ) : filteredPayments.length > 0 ? (
            <>
              {/* Mobile Cards View (< md) */}
              <div className="block md:hidden space-y-3">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 hover:bg-[var(--db-table-hover)] transition-all space-y-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-[var(--db-text)] text-sm truncate flex items-center gap-1.5">
                          <Crown size={12} className="text-[#ccf141] shrink-0" />
                          <span>{payment.name}</span>
                        </h4>
                        <div className="text-[10.5px] text-[var(--db-text-muted)] truncate">
                          {payment.phone} {payment.email ? `• ${payment.email}` : ""}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#ccf141] font-mono">
                          ₹{payment.price.toLocaleString()}
                        </span>
                        <div className="text-[9px] uppercase font-bold text-[var(--db-text-muted)]">
                          {payment.durationMonths} {payment.durationMonths === 1 ? "Month" : "Months"}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-card-border)] space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--db-text-muted)]">Plan:</span>
                        <span className="font-semibold text-[var(--db-text)] truncate">{payment.planName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--db-text-muted)]">Txn ID:</span>
                        <span className="font-mono text-[10px] text-[var(--db-text-muted)] truncate">{payment.transactionId}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--db-text-muted)]">Date:</span>
                        <span className="text-[10px] text-[var(--db-text-muted)]">
                          {new Date(payment.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--db-card-border)]/50">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black ${
                          payment.paymentStatus === "success"
                            ? "bg-green-500/15 text-green-400 border border-green-500/30"
                            : payment.paymentStatus === "pending"
                            ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--db-input-bg)] text-[var(--db-text-muted)] font-mono uppercase text-[10px] border-b border-[var(--db-card-border)]">
                    <tr>
                      <th className="py-3 px-4">Founding Athlete</th>
                      <th className="py-3 px-4">Pass &amp; Tier</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Transaction Reference</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)] text-[var(--db-text)]">
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-[var(--db-input-bg)]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-[var(--db-text)] flex items-center gap-1.5">
                            <Crown size={13} className="text-[#ccf141] shrink-0" />
                            <span>{payment.name}</span>
                          </div>
                          <div className="text-[11px] text-[var(--db-text-muted)] font-mono">
                            {payment.phone} • {payment.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white">{payment.planName}</span>
                          <div className="text-[10px] text-[#ccf141] font-mono">LOCKED TIER</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-sm text-[#ccf141]">
                          ₹{payment.price.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-300">
                          {payment.durationMonths} {payment.durationMonths === 1 ? "Mo" : "Mos"}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {payment.transactionId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black ${
                              payment.paymentStatus === "success"
                                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                                : payment.paymentStatus === "pending"
                                ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {payment.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          {new Date(payment.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-[var(--db-text-muted)] space-y-1">
              <Crown className="mx-auto text-neutral-600 mb-2" size={28} />
              <p className="font-bold text-sm text-[var(--db-text)]">No founder payments found</p>
              <p>Transactions will appear here in real-time when users purchase on /foundersoffers.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardFounderPayments;
