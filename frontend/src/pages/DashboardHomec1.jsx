import React, { useState, useEffect } from "react";
import { getHomec1, deleteHomec1 } from "../api/api";
import { Users, Phone, Calendar, Loader2, Trash2, Mail, Search } from "lucide-react";
import toast from "react-hot-toast";

const DashboardHomec1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHomec1();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load trial submissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trial submission?")) {
      return;
    }

    try {
      const res = await deleteHomec1(id);
      if (res.data.success) {
        toast.success("Submission deleted successfully.");
        fetchData();
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error("Failed to delete submission.");
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
      item.phoneNumber.toLowerCase().includes(search) ||
      (item.program && item.program.toLowerCase().includes(search))
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
          <h1 className="text-2xl font-black text-[var(--db-text)] uppercase tracking-wider mb-2">Home page - Trial Bookings</h1>
          <p className="text-[var(--db-text-muted)] text-sm">View and manage free trial bookings submitted from the website form.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--db-card)] border border-[var(--db-card-border)] px-4 py-2 rounded-xl">
          <Users size={18} className="text-[var(--db-accent-highlight)]" />
          <span className="text-[var(--db-text)] font-bold">{filteredData.length} Submissions</span>
        </div>
      </div>

      <div className="flex items-center relative max-w-md w-full">
        <span className="absolute left-4 text-[var(--db-text-muted)]">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by name, email, phone, program..."
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                <th className="p-4 rounded-l-xl whitespace-nowrap">User Name</th>
                <th className="p-4 whitespace-nowrap">Contact Info</th>
                <th className="p-4 whitespace-nowrap">Program</th>
                <th className="p-4 whitespace-nowrap">Message</th>
                <th className="p-4 whitespace-nowrap">Submitted On</th>
                <th className="p-4 text-center rounded-r-xl whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--db-text-muted)]">
                    No submissions found.
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
                      <div className="flex flex-col gap-1 text-sm text-[var(--db-text)]/80">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-[var(--db-text-muted)]" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-[var(--db-text-muted)]" />
                          <span>{item.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block text-xs bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                        {item.program}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-sm text-[var(--db-text-muted)] truncate hover:text-[var(--db-text)] transition-colors cursor-pointer" title={item.message}>
                        {item.message || "-"}
                      </p>
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
                        title="Delete Submission"
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-black/5 border-t border-[var(--db-card-border)]">
            <span className="text-xs text-[var(--db-text-muted)]">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-[var(--db-text)] px-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHomec1;
