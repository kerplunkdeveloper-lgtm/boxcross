import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  ExternalLink,
  Download,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getHiringApplications,
  getHiringStats,
  updateHiringApplication,
  deleteHiringApplication,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Rejected",
  "Hired",
];

const POSITION_FILTER_OPTIONS = [
  "All Positions",
  "Boxing Coach",
  "Strength & Conditioning Coach",
  "Personal Trainer",
  "Front Desk Executive",
  "Membership / Sales Executive",
  "Housekeeping / Maintenance",
  "Other",
];

const EXPERIENCE_FILTER_OPTIONS = [
  "All Experience",
  "0–1 Years",
  "1–3 Years",
  "3–5 Years",
  "5+ Years",
];

const getStatusBadge = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "Under Review":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Shortlisted":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "Interview Scheduled":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "Hired":
      return "bg-[#ccf141]/20 text-[#ccf141] border-[#ccf141]/40";
    case "Rejected":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    default:
      return "bg-zinc-800 text-zinc-300 border-zinc-700";
  }
};

const DashboardHiring = () => {
  const { user } = useAuth();

  // State
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("All Positions");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");

  // Server/Client Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [interviewDateInput, setInterviewDateInput] = useState("");

  // Fetch Applications
  const fetchApplications = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const params = {
        page,
        limit,
        search: searchTerm.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        position:
          positionFilter !== "All Positions" ? positionFilter : undefined,
        experience:
          experienceFilter !== "All Experience" ? experienceFilter : undefined,
      };

      const [res, statsRes] = await Promise.all([
        getHiringApplications(params),
        getHiringStats().catch(() => null),
      ]);

      if (res.data?.success) {
        setApplications(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || res.data.count || 0);
      }

      if (statsRes?.data?.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error("Fetch Applications Error:", error);
      toast.error("Failed to load career applications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial and reactive fetch
  useEffect(() => {
    fetchApplications(true);
  }, [page, limit, statusFilter, positionFilter, experienceFilter]);

  // Handle Search submit / debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchApplications(false);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle Status Change inline
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateHiringApplication(id, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Application marked as ${newStatus}`);
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id || app.applicationId === id
              ? { ...app, status: newStatus }
              : app
          )
        );
        if (selectedApp && (selectedApp._id === id || selectedApp.applicationId === id)) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }
        // Refresh stats
        getHiringStats().then((res) => {
          if (res?.data?.success) setStats(res.data.stats);
        });
      }
    } catch (error) {
      toast.error("Failed to update application status.");
    }
  };

  // Handle Delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete application for "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteHiringApplication(id);
      if (res.data?.success) {
        toast.success("Application deleted successfully.");
        setApplications((prev) =>
          prev.filter((item) => item._id !== id && item.applicationId !== id)
        );
        setTotalCount((prev) => Math.max(0, prev - 1));
        if (selectedApp && (selectedApp._id === id || selectedApp.applicationId === id)) {
          setSelectedApp(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete application.");
    }
  };

  // Add Note to Selected Application
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedApp || !newNote.trim()) return;

    setIsUpdating(true);
    try {
      const res = await updateHiringApplication(selectedApp._id || selectedApp.applicationId, {
        note: newNote.trim(),
        author: user?.name || "HR Admin",
      });
      if (res.data?.success) {
        toast.success("Note added successfully.");
        setSelectedApp(res.data.data);
        setApplications((prev) =>
          prev.map((app) => (app._id === res.data.data._id ? res.data.data : app))
        );
        setNewNote("");
      }
    } catch (error) {
      toast.error("Failed to add note.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Interview Date
  const handleScheduleInterview = async () => {
    if (!selectedApp || !interviewDateInput) return;

    setIsUpdating(true);
    try {
      const res = await updateHiringApplication(selectedApp._id || selectedApp.applicationId, {
        interviewDate: interviewDateInput,
        status: "Interview Scheduled",
      });
      if (res.data?.success) {
        toast.success("Interview scheduled successfully.");
        setSelectedApp(res.data.data);
        setApplications((prev) =>
          prev.map((app) => (app._id === res.data.data._id ? res.data.data : app))
        );
      }
    } catch (error) {
      toast.error("Failed to schedule interview.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!applications.length) {
      toast.error("No applications to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Full Name",
      "Mobile / WhatsApp",
      "Email",
      "18+ Confirmed",
      "Current Location",
      "Positions Applied",
      "Total Experience",
      "Highest Education",
      "Previous Company",
      "Certifications",
      "Languages Known",
      "Coaching Experience",
      "Current Status",
      "When Can Join",
      "Preferred Shift",
      "Expected Salary",
      "Willing for Puducherry",
      "Resume URL",
      "Portfolio Link",
      "Application Status",
      "Date Applied",
    ];

    const rows = applications.map((app) => [
      `"${app.applicationId || ""}"`,
      `"${(app.fullName || "").replace(/"/g, '""')}"`,
      `"${app.phone || ""}"`,
      `"${app.email || ""}"`,
      app.is18Plus ? "Yes" : "No",
      `"${(app.currentLocation || "").replace(/"/g, '""')}"`,
      `"${(app.positions || []).join(", ")}"`,
      `"${app.totalExperience || ""}"`,
      `"${app.highestEducation || ""}"`,
      `"${(app.previousCompany || "").replace(/"/g, '""')}"`,
      `"${(app.certifications || "").replace(/"/g, '""')}"`,
      `"${(app.languagesKnown || []).join(", ")}"`,
      `"${(app.coachingExperience || []).join(", ")}"`,
      `"${app.currentEmploymentStatus || ""}"`,
      `"${app.whenCanYouJoin || ""}"`,
      `"${app.preferredShift || ""}"`,
      `"${app.expectedSalary || ""}"`,
      app.willingToWorkInPuducherry ? "Yes" : "No",
      `"${app.resume?.url || ""}"`,
      `"${app.portfolioLink || ""}"`,
      `"${app.status || ""}"`,
      `"${new Date(app.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `BXC_Career_Applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Applications exported to CSV.");
  };

  // Clean WhatsApp phone number for link
  const getWhatsAppLink = (phone) => {
    if (!phone) return "#";
    const cleaned = phone.replace(/[^0-9]/g, "");
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}`;
  };

  return (
    <div className="p-3.5 sm:p-5 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--db-card-border)]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ccf141]/25 to-transparent border border-[#ccf141]/40 flex items-center justify-center text-[#ccf141]">
                <Briefcase size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--db-text)] flex items-center gap-2">
                  Hiring & Career Details
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ccf141]/20 text-[#ccf141] border border-[#ccf141]/40">
                    BXC Arena
                  </span>
                </h1>
                <p className="text-xs text-[var(--db-text-muted)] mt-0.5">
                  Review applicant profiles, qualifications, resumes & manage recruitment workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => fetchApplications(false)}
              disabled={refreshing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] hover:border-[#ccf141] transition-all cursor-pointer"
              title="Refresh applications"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-[#ccf141]" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ccf141] text-black text-xs font-black hover:bg-[#bfe636] transition-all cursor-pointer shadow-md"
              title="Export to CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[var(--db-text-muted)] tracking-wider">
                Total Applicants
              </span>
              <Users size={16} className="text-[var(--db-text-muted)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              {stats?.total ?? totalCount}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">
              {stats?.recent7Days || 0} in last 7 days
            </span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-blue-400 tracking-wider">
                New Submissions
              </span>
              <Clock size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1.5">
              {stats?.byStatus?.Submitted ?? 0}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">Awaiting initial review</span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider">
                Shortlisted
              </span>
              <Award size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1.5">
              {stats?.byStatus?.Shortlisted ?? 0}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">Selected for rounds</span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#ccf141] tracking-wider">
                Hired / Joined
              </span>
              <CheckCircle size={16} className="text-[#ccf141]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#ccf141] mt-1.5">
              {stats?.byStatus?.Hired ?? 0}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">Active team additions</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search by candidate name, phone, email, location, or App ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] pl-10 pr-4 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Position Filter */}
          <div className="flex items-center gap-2">
            <select
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] cursor-pointer"
            >
              {POSITION_FILTER_OPTIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Experience Filter */}
            <select
              value={experienceFilter}
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                setPage(1);
              }}
              className="hidden lg:block bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] cursor-pointer"
            >
              {EXPERIENCE_FILTER_OPTIONS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table & Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] text-[var(--db-text-muted)] gap-3">
            <div className="w-8 h-8 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin" />
            <span className="text-xs font-semibold">Loading applications from server...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] text-[var(--db-text-muted)]">
            <Briefcase size={44} className="mx-auto mb-3 opacity-30 text-[#ccf141]" />
            <p className="text-base font-bold text-white">No career applications found</p>
            <p className="text-xs text-[var(--db-text-muted)] mt-1 max-w-sm mx-auto">
              Applications submitted via the BXC hiring form or API endpoint will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-[var(--db-card-border)] text-[var(--db-text-muted)] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-mono">App ID / Date</th>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Roles Applied</th>
                      <th className="py-3.5 px-4">Experience & Edu</th>
                      <th className="py-3.5 px-4">Resume / Portfolio</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)]">
                    {applications.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* App ID & Date */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[11px] font-bold text-[#ccf141]">
                            {app.applicationId || "BXC-APP"}
                          </div>
                          <div className="text-[10px] text-[var(--db-text-muted)] mt-0.5">
                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        {/* Candidate Details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">
                            {app.fullName}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--db-text-muted)] mt-0.5">
                            <MapPin size={11} className="text-[#ccf141]" />
                            <span>{app.currentLocation}</span>
                            {app.is18Plus && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                18+
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={getWhatsAppLink(app.phone)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-400 hover:underline"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={12} />
                              {app.phone}
                            </a>
                          </div>
                          <div className="text-[10px] text-[var(--db-text-muted)] truncate max-w-[150px] mt-0.5">
                            <a
                              href={`mailto:${app.email}`}
                              className="hover:text-white"
                              title={app.email}
                            >
                              {app.email}
                            </a>
                          </div>
                        </td>

                        {/* Roles Applied */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(app.positions || []).map((role, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-zinc-200"
                              >
                                {role}
                              </span>
                            ))}
                            {app.otherPosition && (
                              <span className="text-[9px] italic text-[var(--db-text-muted)] block">
                                Other: {app.otherPosition}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Experience & Edu */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">
                            {app.totalExperience || "Fresher"}
                          </div>
                          <div className="text-[10px] text-[var(--db-text-muted)] truncate max-w-[140px]">
                            {app.highestEducation || "—"}
                          </div>
                          {app.previousCompany && (
                            <div className="text-[9px] text-[#ccf141]/80 truncate max-w-[140px]">
                              Prev: {app.previousCompany}
                            </div>
                          )}
                        </td>

                        {/* Resume / Portfolio */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {app.resume?.url ? (
                              <a
                                href={app.resume.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 hover:bg-[#ccf141]/20 font-bold text-[11px] transition-all"
                                title="Open Resume Document"
                              >
                                <FileText size={12} />
                                <span>Resume</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-[10px] text-[var(--db-text-muted)] italic">
                                No file
                              </span>
                            )}

                            {app.portfolioLink && (
                              <a
                                href={
                                  app.portfolioLink.startsWith("http")
                                    ? app.portfolioLink
                                    : `https://${app.portfolioLink}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded bg-white/[0.06] hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
                                title="View Portfolio / Social"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Status Inline Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status || "Submitted"}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`text-[10.5px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st} className="bg-black text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setInterviewDateInput(
                                  app.interviewDate
                                    ? new Date(app.interviewDate)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                );
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-[#ccf141] transition-all cursor-pointer"
                              title="View full application"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(app._id, app.fullName)}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#ccf141]">
                        {app.applicationId || "BXC-APP"}
                      </span>
                      <h3 className="font-black text-base text-white mt-0.5">
                        {app.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--db-text-muted)] mt-0.5">
                        <MapPin size={11} className="text-[#ccf141]" />
                        <span>{app.currentLocation}</span>
                      </div>
                    </div>

                    <select
                      value={app.status || "Submitted"}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st} className="bg-black text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-1">
                    {(app.positions || []).map((role, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.08] text-zinc-200"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Experience & Contact Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/[0.08]">
                    <div>
                      <span className="text-[10px] text-[var(--db-text-muted)] block">
                        Experience:
                      </span>
                      <span className="font-semibold text-white">
                        {app.totalExperience || "Fresher"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--db-text-muted)] block">
                        Salary Expected:
                      </span>
                      <span className="font-semibold text-white">
                        {app.expectedSalary || "Negotiable"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.08]">
                    <a
                      href={getWhatsAppLink(app.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400"
                    >
                      <MessageCircle size={14} />
                      <span>{app.phone}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      {app.resume?.url && (
                        <a
                          href={app.resume.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#ccf141]/20 text-[#ccf141] font-bold text-xs"
                        >
                          Resume
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setInterviewDateInput(
                            app.interviewDate
                              ? new Date(app.interviewDate).toISOString().slice(0, 16)
                              : ""
                          );
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.08] text-white hover:text-[#ccf141]"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id, app.fullName)}
                        className="p-1.5 rounded-lg bg-white/[0.08] text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 text-xs">
              <div className="text-[var(--db-text-muted)]">
                Showing{" "}
                <span className="font-bold text-white">
                  {applications.length > 0 ? (page - 1) * limit + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-bold text-white">
                  {Math.min(page * limit, totalCount)}
                </span>{" "}
                of <span className="font-bold text-white">{totalCount}</span> applicants
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="text-[var(--db-text-muted)]">Rows:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-2 py-1 rounded-lg outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ccf141] transition-all cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="px-3 py-1 rounded-lg bg-white/[0.08] font-bold text-white">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ccf141] transition-all cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Application Modal */}
        <AnimatePresence>
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl bg-[#0e0e11] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl text-left text-xs max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#ccf141]">
                        {selectedApp.applicationId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          selectedApp.status
                        )}`}
                      >
                        {selectedApp.status}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {selectedApp.fullName}
                    </h2>
                    <p className="text-zinc-400 text-xs">
                      Applied on{" "}
                      {new Date(selectedApp.createdAt).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Section 1: Personal Details */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <Users size={14} /> Section 1 — Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Mobile / WhatsApp:</span>
                      <a
                        href={getWhatsAppLink(selectedApp.phone)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <MessageCircle size={12} />
                        {selectedApp.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Email Address:</span>
                      <a
                        href={`mailto:${selectedApp.email}`}
                        className="font-bold text-white hover:underline mt-0.5 block truncate"
                      >
                        {selectedApp.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Current Location:</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedApp.currentLocation}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Age (18+ confirmed):</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">
                        {selectedApp.is18Plus ? "Yes (Confirmed)" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Positions Applying For */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <Briefcase size={14} /> Section 2 — Positions Applying For
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedApp.positions || []).map((pos, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl bg-[#ccf141]/20 border border-[#ccf141]/40 text-[#ccf141] font-bold text-xs"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                    {selectedApp.otherPosition && (
                      <p className="text-zinc-300 text-xs">
                        <strong className="text-white">Other Role Details:</strong>{" "}
                        {selectedApp.otherPosition}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section 3: Experience & Qualifications */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <Award size={14} /> Section 3 — Experience & Qualifications
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Total Work Experience:</span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.totalExperience || "Fresher"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Highest Education:</span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.highestEducation || "Not Specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Previous Company / Centre:</span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.previousCompany || "None"}
                        </span>
                      </div>
                    </div>

                    {selectedApp.certifications && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] text-zinc-400 block">Relevant Certifications:</span>
                        <p className="font-medium text-zinc-200 mt-0.5">
                          {selectedApp.certifications}
                        </p>
                      </div>
                    )}

                    {selectedApp.skillsDescription && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] text-zinc-400 block">Relevant Skills:</span>
                        <p className="font-medium text-zinc-200 mt-0.5 whitespace-pre-wrap">
                          {selectedApp.skillsDescription}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Languages Known:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(selectedApp.languagesKnown || []).length > 0 ? (
                            selectedApp.languagesKnown.map((lang, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-white/[0.08] text-zinc-200 text-[10px]"
                              >
                                {lang}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 block">Coaching Experience:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(selectedApp.coachingExperience || []).length > 0 ? (
                            selectedApp.coachingExperience.map((coach, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold"
                              >
                                {coach}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Availability & Expectations */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <Clock size={14} /> Section 4 — Availability & Expectations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Current Status:</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedApp.currentEmploymentStatus || "Not Specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">When Can Join:</span>
                      <span className="font-bold text-[#ccf141] mt-0.5 block">
                        {selectedApp.whenCanYouJoin || "Immediately"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Preferred Shift:</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedApp.preferredShift || "Flexible"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Expected Monthly Salary:</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedApp.expectedSalary || "Negotiable"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Willing On-Site in Puducherry:</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">
                        {selectedApp.willingToWorkInPuducherry ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Resume & Portfolio */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <FileText size={14} /> Section 5 — Resume & Portfolio
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {selectedApp.resume?.url ? (
                        <a
                          href={selectedApp.resume.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs hover:bg-[#bfe636] transition-all"
                        >
                          <Download size={14} />
                          <span>View / Download Resume Document</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-zinc-400 italic">No resume attached</span>
                      )}

                      {selectedApp.portfolioLink && (
                        <a
                          href={
                            selectedApp.portfolioLink.startsWith("http")
                              ? selectedApp.portfolioLink
                              : `https://${selectedApp.portfolioLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white font-bold text-xs transition-all"
                        >
                          <span>Portfolio / Social Link</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {selectedApp.additionalInfo && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] text-zinc-400 block">Additional Information:</span>
                        <p className="font-medium text-zinc-200 mt-0.5 whitespace-pre-wrap">
                          {selectedApp.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 6: Declaration Confirmation */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <CheckCircle size={14} /> Section 6 — Final Confirmation
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center gap-2 text-zinc-300">
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                    <span>
                      Applicant confirmed:{" "}
                      <em>
                        &ldquo;I confirm that the information provided is accurate and agree to be
                        contacted by the BXC hiring team regarding my application.&rdquo;
                      </em>
                    </span>
                  </div>
                </div>

                {/* Admin Control Panel inside Modal */}
                <div className="space-y-4 pt-4 border-t border-white/15">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                    <Sparkles size={14} /> HR Actions & Interview Scheduler
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Changer */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Application Status:
                      </label>
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                        className={`w-full text-xs font-bold px-3 py-2 rounded-xl border outline-none cursor-pointer ${getStatusBadge(
                          selectedApp.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-black text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interview Scheduler */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        Schedule Interview:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="datetime-local"
                          value={interviewDateInput}
                          onChange={(e) => setInterviewDateInput(e.target.value)}
                          className="flex-1 bg-white/[0.06] border border-white/15 text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-[#ccf141]"
                        />
                        <button
                          onClick={handleScheduleInterview}
                          disabled={isUpdating || !interviewDateInput}
                          className="px-3 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs hover:bg-[#bfe636] disabled:opacity-40 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes Section */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Internal HR Notes:
                    </label>

                    {/* Existing notes */}
                    {(selectedApp.adminNotes || []).length > 0 && (
                      <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                        {selectedApp.adminNotes.map((n, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-start justify-between"
                          >
                            <div>
                              <p className="text-zinc-200">{n.note}</p>
                              <span className="text-[9px] text-zinc-400 mt-1 block">
                                By {n.author || "Admin"} •{" "}
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add note input */}
                    <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add a private note about candidate..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1 bg-white/[0.06] border border-white/15 text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-[#ccf141]"
                      />
                      <button
                        type="submit"
                        disabled={isUpdating || !newNote.trim()}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/20 text-white font-bold text-xs disabled:opacity-40 cursor-pointer"
                      >
                        <Send size={12} />
                        <span>Post Note</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <a
                    href={getWhatsAppLink(selectedApp.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Candidate</span>
                  </a>

                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/20 text-white font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardHiring;
