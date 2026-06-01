import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRealTime } from "../context/RealTimeContext";
import { motion } from "framer-motion";
import { 
  CreditCard, Search, DollarSign, CheckCircle, AlertTriangle, Calendar, Filter
} from "lucide-react";
import { getPayments } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardPayments = () => {
  const { user } = useAuth();
  const { subscribe } = useRealTime();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPayments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await getPayments();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error("Error fetching payment transactions", error);
      toast.error("Failed to load payment transactions");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Real-time payments update
    const unsubscribe = subscribe("payments", () => {
      fetchPayments(false);
    });

    return unsubscribe;
  }, [user, subscribe]);

  // Compute stats
  const totalVolume = payments
    .filter(p => p.paymentStatus === "success")
    .reduce((sum, p) => sum + p.price, 0);

  const successfulTxns = payments.filter(p => p.paymentStatus === "success").length;
  const pendingTxns = payments.filter(p => p.paymentStatus === "pending").length;

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      payment.name.toLowerCase().includes(query) ||
      payment.email.toLowerCase().includes(query) ||
      payment.phone.toLowerCase().includes(query) ||
      payment.transactionId.toLowerCase().includes(query);

    const matchesStatus = 
      statusFilter === "all" || 
      payment.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Total Collection
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
                Successful Payments
              </p>
              <h3 className="text-2xl font-black text-[var(--db-accent-highlight)] mt-1">
                {successfulTxns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <CheckCircle size={20} />
            </div>
          </motion.div>

          {/* Card 3: Pending/Failed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 flex items-center justify-between shadow-lg transition-colors"
          >
            <div className="text-left">
              <p className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                Pending Transactions
              </p>
              <h3 className="text-2xl font-black text-yellow-500 mt-1">
                {pendingTxns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <AlertTriangle size={20} />
            </div>
          </motion.div>
        </div>

        {/* Main list container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 md:p-8 shadow-2xl transition-colors"
        >
          {/* List Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2 text-left">
              <CreditCard size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                Payment Log History
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search name, txn, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 sm:w-56 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-[var(--db-text-muted)] rounded-full pl-9 pr-4 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative flex items-center bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-full px-3 h-9 text-xs text-[var(--db-text-muted)]">
                <Filter size={12} className="mr-1.5 text-[var(--db-text-muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-[var(--db-text)] outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="all" className="bg-[var(--db-card)] text-[var(--db-text)]">All Status</option>
                  <option value="success" className="bg-[var(--db-card)] text-[var(--db-text)]">Success</option>
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
              <span>Loading transaction records...</span>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-4 rounded-l-xl">User Details</th>
                    <th className="py-4 px-4">Plan Name</th>
                    <th className="py-4 px-4">Amount Paid</th>
                    <th className="py-4 px-4">Duration</th>
                    <th className="py-4 px-4">Transaction ID</th>
                    <th className="py-4 px-4">Method</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4 text-right rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-[var(--db-table-hover)] transition-colors">
                      {/* Name / Email / Phone info block */}
                      <td className="py-4 px-4 text-left">
                        <div className="font-bold text-[var(--db-text)] text-sm">{payment.name}</div>
                        <div className="text-[10px] text-[var(--db-text-muted)] mt-0.5">{payment.email}</div>
                        <div className="text-[10px] text-[var(--db-text-muted)]">{payment.phone}</div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4 text-sm text-[var(--db-text)] font-medium">
                        {payment.planName}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 text-sm text-[var(--db-accent-highlight)] font-extrabold font-mono">
                        ₹{payment.price.toLocaleString()}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-bold uppercase">
                        {payment.durationMonths} {payment.durationMonths === 1 ? 'Month' : 'Months'}
                      </td>

                      {/* Transaction ID */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] font-mono">
                        {payment.transactionId}
                      </td>

                      {/* Method */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)]">
                        {payment.paymentMethod}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-[var(--db-text-muted)]">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-black ${
                          payment.paymentStatus === 'success' 
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : payment.paymentStatus === 'pending'
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-[var(--db-text-muted)] text-xs">
              No matching transaction records found.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPayments;
