import React, { useState, useEffect } from "react";
import {
  getMemfounds,
  deleteMemfound,
  updateMemfound,
} from "../api/api";
import {
  Users,
  Phone,
  Calendar,
  Loader2,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  MessageCircle,
  Filter,
  RefreshCw,
  ExternalLink,
  Edit2,
  X,
  FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";

const DashboardMemfound = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editItem, setEditItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const res = await getMemfounds();
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Memfound Error:", error);
      toast.error("Failed to load Memfound submissions.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    const originalData = [...data];
    setData((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await deleteMemfound(id);
      if (res.data?.success) {
        toast.success("Registration deleted successfully.");
      } else {
        setData(originalData);
        toast.error("Failed to delete record.");
      }
    } catch (error) {
      setData(originalData);
      toast.error("Failed to delete record.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateMemfound(id, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Status updated to ${newStatus}`);
        setData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    setIsUpdating(true);
    try {
      const res = await updateMemfound(editItem._id, {
        status: editItem.status,
        notes: editItem.notes,
        assignedNumber: editItem.assignedNumber,
        memberId: editItem.memberId || editItem.assignedNumber,
        quotedRate: editItem.quotedRate,
        boxcrossConnection: editItem.boxcrossConnection,
        mainGoal: editItem.mainGoal,
      });

      if (res.data?.success) {
        toast.success("Record updated successfully");
        setData((prev) =>
          prev.map((item) => (item._id === editItem._id ? res.data.data : item))
        );
        setEditItem(null);
      }
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtered List
  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase();
    const itemMemberId = (item.memberId || (item.memberNumber ? `#${String(item.memberNumber).padStart(3, "0")}` : (item.assignedNumber || ""))).toLowerCase();
    const matchesSearch =
      (item.name || "").toLowerCase().includes(search) ||
      (item.whatsappNumber || "").includes(search) ||
      itemMemberId.includes(search) ||
      (item.boxcrossConnection || "").toLowerCase().includes(search) ||
      (item.mainGoal || "").toLowerCase().includes(search) ||
      (item.plan || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalCount = data.length;
  const pendingCount = data.filter((d) => d.status === "Pending").length;
  const contactedCount = data.filter((d) => d.status === "Contacted").length;
  const convertedCount = data.filter((d) => d.status === "Converted").length;

  // Export CSV
  const exportCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = [
      "Member ID",
      "Name",
      "WhatsApp Number",
      "Connection",
      "Main Goal",
      "Who Is This For",
      "Plan",
      "Best Time",
      "Status",
      "Assigned Number",
      "Quoted Rate",
      "Notes",
      "Registered At",
    ];
    const rows = filteredData.map((d) => [
      `"${d.memberId || (d.memberNumber ? `#${String(d.memberNumber).padStart(3, "0")}` : d.assignedNumber || "")}"`,
      `"${d.name || ""}"`,
      `"${d.whatsappNumber || ""}"`,
      `"${d.boxcrossConnection || d.trainedBefore || ""}"`,
      `"${d.mainGoal || ""}"`,
      `"${d.whoIsThisFor || ""}"`,
      `"${d.plan || ""}"`,
      `"${d.bestTimeToCall || ""}"`,
      `"${d.status || ""}"`,
      `"${d.assignedNumber || ""}"`,
      `"${d.quotedRate || ""}"`,
      `"${(d.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(d.createdAt).toLocaleString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Memfound_Interests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--db-card-border)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-black uppercase tracking-tight text-[var(--db-text-title)]"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Memfound Registrations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ccf141]/20 text-[#ccf141]">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-[var(--db-text-muted)] mt-1">
            Incoming interest registrations from the{" "}
            <a
              href="/memfound"
              target="_blank"
              rel="noreferrer"
              className="text-[#ccf141] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              /memfound page <ExternalLink size={12} />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            className="p-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-card)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] transition-colors cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-card)] hover:bg-[var(--db-sidebar-link-hover)] text-xs font-bold text-[var(--db-text)] transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={16} className="text-[#ccf141]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5">
          <span className="text-xs uppercase font-bold text-[var(--db-text-muted)] block">
            Total Leads
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {totalCount}
          </div>
        </div>

        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5">
          <span className="text-xs uppercase font-bold text-amber-400 block">
            Pending Follow-up
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            {pendingCount}
          </div>
        </div>

        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5">
          <span className="text-xs uppercase font-bold text-blue-400 block">
            Contacted
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">
            {contactedCount}
          </div>
        </div>

        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5">
          <span className="text-xs uppercase font-bold text-[#ccf141] block">
            Converted / Members
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#ccf141] mt-1">
            {convertedCount}
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search by name, phone or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl outline-none focus:border-[#ccf141]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--db-text-muted)] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)]">
          <Loader2 className="animate-spin text-[#ccf141]" size={36} />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] text-[var(--db-text-muted)]">
          <Users size={44} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-semibold">No registrations found</p>
          <p className="text-xs text-[var(--db-text-muted)] mt-1">
            Registrations from the /memfound page will show up here.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--db-sidebar-link-hover)] border-b border-[var(--db-card-border)] text-[var(--db-text-muted)] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-mono">Member ID</th>
                  <th className="py-3.5 px-4">Registrant</th>
                  <th className="py-3.5 px-4">WhatsApp</th>
                  <th className="py-3.5 px-4">Connection</th>
                  <th className="py-3.5 px-4">Main Goal</th>
                  <th className="py-3.5 px-4">Who Is This For</th>
                  <th className="py-3.5 px-4">Plan Interested</th>
                  <th className="py-3.5 px-4">Call Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--db-card-border)] text-[var(--db-text)]">
                {filteredData.map((item) => {
                  const displayId =
                    item.memberId ||
                    (item.memberNumber
                      ? `#${String(item.memberNumber).padStart(3, "0")}`
                      : item.assignedNumber || "#001");
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-[var(--db-table-hover)] transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] font-mono font-black text-xs tracking-wider">
                          {displayId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#ccf141]/20 text-[#ccf141] flex items-center justify-center font-black text-xs shrink-0">
                            {item.name ? item.name.charAt(0).toUpperCase() : "M"}
                          </div>
                          <div>
                            <div className="text-white font-bold">{item.name}</div>
                            {item.quotedRate && (
                              <span className="text-[10px] text-zinc-400">
                                Quoted: {item.quotedRate}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-300">
                          {item.whatsappNumber}
                        </span>
                        <a
                          href={`https://wa.me/91${item.whatsappNumber}?text=Hi%20${encodeURIComponent(
                            item.name
                          )},%20thank%20you%20for%20registering%20your%20interest%20at%20Box%20%26%20Cross!`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-md bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle size={13} />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.boxcrossConnection === "I'm a current member"
                            ? "bg-[#ccf141]/20 text-[#ccf141] border border-[#ccf141]/40"
                            : item.boxcrossConnection === "I've trained here before"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : item.boxcrossConnection === "I'm new to Box & Cross"
                            ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            : item.trainedBefore === "YES"
                            ? "bg-[#ccf141]/20 text-[#ccf141]"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {item.boxcrossConnection ||
                          (item.trainedBefore === "YES"
                            ? "Trained Before"
                            : "New Member")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium">
                      {item.mainGoal ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-200 text-[11px] border border-zinc-700/60 font-medium whitespace-nowrap">
                          {item.mainGoal}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-zinc-300">
                      {item.whoIsThisFor || "MYSELF"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#ccf141]">
                        {item.plan || "NOT SURE YET"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">
                      {item.bestTimeToCall || "ANYTIME"}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${
                          item.status === "Pending"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : item.status === "Contacted"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : item.status === "Converted"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[var(--db-sidebar-link-hover)] transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete submission"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[var(--db-card-border)] pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Lead Details: {editItem.name}
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  +91 {editItem.whatsappNumber}
                </span>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                  Status
                </label>
                <select
                  value={editItem.status}
                  onChange={(e) =>
                    setEditItem({ ...editItem, status: e.target.value })
                  }
                  className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-white p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                    Member ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #001"
                    value={editItem.memberId || editItem.assignedNumber || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        memberId: e.target.value,
                        assignedNumber: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[#ccf141] font-mono font-bold p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                    Quoted Rate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12,000"
                    value={editItem.quotedRate || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, quotedRate: e.target.value })
                    }
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-white p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                    Connection
                  </label>
                  <select
                    value={editItem.boxcrossConnection || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        boxcrossConnection: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-white p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                  >
                    <option value="">Select Connection</option>
                    <option value="I'm a current member">
                      I'm a current member
                    </option>
                    <option value="I've trained here before">
                      I've trained here before
                    </option>
                    <option value="I'm new to Box & Cross">
                      I'm new to Box & Cross
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                    Main Goal
                  </label>
                  <select
                    value={editItem.mainGoal || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, mainGoal: e.target.value })
                    }
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-white p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                  >
                    <option value="">Select Goal (Optional)</option>
                    <option value="Boxing skills">Boxing skills</option>
                    <option value="Strength and conditioning">
                      Strength and conditioning
                    </option>
                    <option value="General fitness">General fitness</option>
                    <option value="Competition preparation">
                      Competition preparation
                    </option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold uppercase">
                  Internal Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes from call / WhatsApp follow-up..."
                  value={editItem.notes || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, notes: e.target.value })
                  }
                  className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-white p-2.5 rounded-xl outline-none focus:border-[#ccf141]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--db-card-border)]">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--db-card-border)] text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-[#ccf141] text-black font-bold hover:bg-[#d8fa4f] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMemfound;
