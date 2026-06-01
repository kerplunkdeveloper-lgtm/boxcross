import React, { useState, useEffect } from "react";
import { getHomec2, deleteHomec2 } from "../api/api";
import { Users, Phone, Calendar, Loader2, Trash2, Mail, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const DashboardHomec2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoader = false) => {
    const shouldShow = showLoader === true;
    try {
      if (shouldShow) setLoading(true);
      const res = await getHomec2();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load contacts.");
    } finally {
      if (shouldShow) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact submission?")) {
      return;
    }

    // Optimistically update the UI by removing the deleted item
    const originalData = data;
    setData((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await deleteHomec2(id);
      if (res.data.success) {
        toast.success("Contact deleted successfully.");
        fetchData(false);
        setCurrentPage(1);
      } else {
        // Rollback if request fails
        setData(originalData);
        toast.error("Failed to delete contact.");
      }
    } catch (error) {
      // Rollback if exception is thrown
      setData(originalData);
      toast.error("Failed to delete contact.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phoneNumber.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
          <h1 className="text-2xl font-black text-[var(--db-text)] uppercase tracking-wider mb-2">Consult us form - Details</h1>
          <p className="text-[var(--db-text-muted)] text-sm">View and manage contact form submissions from the Consult us form.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--db-card)] border border-[var(--db-card-border)] px-4 py-2 rounded-xl">
          <Users size={18} className="text-[var(--db-accent-highlight)]" />
          <span className="text-[var(--db-text)] font-bold">{filteredData.length} Contacts</span>
        </div>
      </div>

      <div className="flex items-center relative max-w-md w-full">
        <span className="absolute left-4 text-[var(--db-text-muted)]">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl pl-12 pr-4 text-sm text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-[var(--db-accent-highlight)]/50 transition-colors"
        />
      </div>

      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                <th className="p-4 rounded-l-xl whitespace-nowrap">Contact Name</th>
                <th className="p-4 whitespace-nowrap">Email Address</th>
                <th className="p-4 whitespace-nowrap">Phone Number</th>
                <th className="p-4 whitespace-nowrap">Submitted On</th>
                <th className="p-4 text-center rounded-r-xl whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[var(--db-text-muted)]">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item._id} className="border-b border-[var(--db-card-border)]/50 hover:bg-[var(--db-table-hover)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--db-accent-highlight)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-black uppercase">
                          {item.fullName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[var(--db-text)] tracking-wider uppercase">{item.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[var(--db-text)]/80">
                        <Mail size={14} className="text-[var(--db-text-muted)]" />
                        <span>{item.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[var(--db-text)]/80">
                        <Phone size={14} className="text-[var(--db-text-muted)]" />
                        <span>{item.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[var(--db-text-muted)]">
                        <Calendar size={14} />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Contact"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Control */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 pb-6 px-6 border-t border-[var(--db-card-border)] bg-black/5">
            <div className="text-xs text-[var(--db-text-muted)] font-medium">
              Showing <span className="font-bold text-[var(--db-text)]">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-[var(--db-text)]">
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-bold text-[var(--db-text)]">{filteredData.length}</span> entries
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer bg-[var(--db-card)]"
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
                        : "border border-[var(--db-card-border)] bg-[var(--db-card)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer bg-[var(--db-card)]"
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

export default DashboardHomec2;
