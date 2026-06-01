import React, { useState, useEffect } from "react";
import { getLeadsAdmin } from "../api/api";
import { Users, Phone, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const DashboardLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchLeads(true);
    const interval = setInterval(() => {
      fetchLeads(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const { data } = await getLeadsAdmin();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      toast.error("Failed to load user information.");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [leads.length, totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[var(--db-accent-highlight)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">User Information</h1>
          <p className="text-[var(--db-text-muted)] text-sm">View all verified leads captured from the website pop-up.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--db-card-bg)] border border-[var(--db-card-border)] px-4 py-2 rounded-xl">
          <Users size={18} className="text-[var(--db-accent-highlight)]" />
          <span className="text-white font-bold">{leads.length} Users</span>
        </div>
      </div>

      <div className="bg-[var(--db-card-bg)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 p-4">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/40 border-b border-[var(--db-card-border)]">
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">User Details</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">Contact Info</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">Captured On</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-[var(--db-text-muted)]">
                    No user information captured yet.
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead) => (
                  <tr key={lead._id} className="border-b border-[var(--db-card-border)]/50 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--db-accent-highlight)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-black uppercase">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-white tracking-wider uppercase">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone size={14} className="text-[var(--db-text-muted)]" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Control */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-[var(--db-card-border)]">
            <div className="text-xs text-[var(--db-text-muted)] font-medium">
              Showing <span className="font-bold text-[var(--db-text)]">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-bold text-[var(--db-text)]">
                {Math.min(indexOfLastItem, leads.length)}
              </span>{" "}
              of <span className="font-bold text-[var(--db-text)]">{leads.length}</span> entries
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  totalPages > 5 &&
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) > 1
                ) {
                  if (page === 2 && currentPage > 3) {
                    return <span key="dots-1" className="px-2 text-[var(--db-text-muted)] text-xs">...</span>;
                  }
                  if (page === totalPages - 1 && currentPage < totalPages - 2) {
                    return <span key="dots-2" className="px-2 text-[var(--db-text-muted)] text-xs">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-[36px] px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] border border-[var(--db-accent)] shadow-md"
                        : "border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLeads;
