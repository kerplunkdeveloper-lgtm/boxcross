import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Search,
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
  UserCheck,
  GraduationCap,
  DollarSign,
  Maximize2,
  EyeOff,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getHiringApplications,
  getHiringStats,
  updateHiringApplication,
  deleteHiringApplication,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const getResumeViewUrl = (app) => {
  if (!app) return "";
  const id = app._id || app.applicationId;
  return `${API_BASE_URL}/api/hiring/${id}/resume`;
};

const getResumeDownloadUrl = (app) => {
  if (!app) return "";
  const id = app._id || app.applicationId;
  return `${API_BASE_URL}/api/hiring/${id}/resume?download=1`;
};

const STATUS_CONFIG = {
  Submitted: {
    label: "Submitted",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
  },
  "Under Review": {
    label: "Under Review",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
  },
  Shortlisted: {
    label: "Shortlisted",
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    dot: "bg-purple-400",
  },
  "Interview Scheduled": {
    label: "Interview Scheduled",
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    dot: "bg-cyan-400",
  },
  Hired: {
    label: "Hired",
    badge: "bg-[#ccf141]/20 text-[#ccf141] border-[#ccf141]/50 shadow-[0_0_12px_rgba(204,241,65,0.2)]",
    dot: "bg-[#ccf141]",
  },
  Rejected: {
    label: "Rejected",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-400",
  },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

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

const cleanWhatsAppPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
};

// --------------------------------------------------------------------------
// Sub-Component: Candidate Row (Memoized for high-speed table rendering)
// --------------------------------------------------------------------------
const CandidateRow = memo(
  ({
    app,
    onView,
    onStatusChange,
    onDelete,
    viewResumeUrl,
    downloadResumeUrl,
    whatsAppNumber,
  }) => {
    const initials = (app.fullName || "Candidate")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const currentStatus = app.status || "Submitted";
    const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Submitted;

    return (
      <tr className="hover:bg-white/[0.02] transition-colors border-b border-[var(--db-card-border)] group">
        {/* Candidate Info */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 text-[#ccf141] font-black text-xs flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#ccf141]/40 transition-colors">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm truncate group-hover:text-[#ccf141] transition-colors">
                  {app.fullName}
                </span>
                {app.is18Plus && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    18+
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--db-text-muted)] mt-0.5">
                <span className="font-mono text-[10px] text-[#ccf141]/80">
                  {app.applicationId || "BXC-APP"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} className="text-zinc-500 shrink-0" />
                  <span className="truncate max-w-[100px]">
                    {app.currentLocation || "Puducherry"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* Roles Applied */}
        <td className="py-3 px-4">
          <div className="flex flex-wrap gap-1 max-w-[190px]">
            {(app.positions || []).slice(0, 2).map((role, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-zinc-200"
              >
                {role}
              </span>
            ))}
            {(app.positions || []).length > 2 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/20">
                +{app.positions.length - 2}
              </span>
            )}
            {app.otherPosition && (
              <span className="text-[9px] italic text-[var(--db-text-muted)] block">
                {app.otherPosition}
              </span>
            )}
          </div>
        </td>

        {/* Contact info */}
        <td className="py-3 px-4">
          <div className="flex flex-col gap-0.5">
            <a
              href={`https://wa.me/${whatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={12} className="shrink-0" />
              <span>{app.phone}</span>
            </a>
            <a
              href={`mailto:${app.email}`}
              className="text-[10px] text-[var(--db-text-muted)] hover:text-white truncate max-w-[140px] transition-colors"
              title={app.email}
            >
              {app.email}
            </a>
          </div>
        </td>

        {/* Experience & Previous Co */}
        <td className="py-3 px-4">
          <div className="font-semibold text-white text-xs">
            {app.totalExperience || "Fresher"}
          </div>
          <div className="text-[10px] text-[var(--db-text-muted)] truncate max-w-[130px]">
            {app.highestEducation || "Graduate"}
          </div>
          {app.previousCompany && (
            <div className="text-[9px] text-[#ccf141]/80 truncate max-w-[130px]">
              {app.previousCompany}
            </div>
          )}
        </td>

        {/* Resume & Documents */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-1.5">
            {app.resume?.url || app.resume?.publicId ? (
              <>
                <a
                  href={viewResumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 hover:bg-[#ccf141]/20 font-bold text-[11px] transition-all"
                  title="View Document / Resume in Browser"
                >
                  <Eye size={12} />
                  <span>
                    {app.resume?.fileType?.startsWith("image/") ||
                    /\.(jpe?g|png|webp|gif)$/i.test(app.resume?.originalName || "")
                      ? "Image"
                      : "Resume"}
                  </span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={downloadResumeUrl}
                  className="inline-flex items-center justify-center p-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white hover:text-[#ccf141] border border-white/10 text-[11px] transition-all"
                  title="Direct Download File"
                >
                  <Download size={12} />
                </a>
                {app.resume?.storageProvider === "google_drive" && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                    title="Stored in Google Drive"
                  >
                    Drive
                  </span>
                )}
              </>
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
                className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                title="Portfolio Link"
              >
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </td>

        {/* Status Dropdown (Optimistic) */}
        <td className="py-3 px-4">
          <div className="relative inline-block">
            <select
              value={currentStatus}
              onChange={(e) => onStatusChange(app._id, e.target.value)}
              className={`text-[10.5px] font-bold pl-2.5 pr-6 py-1 rounded-lg border outline-none cursor-pointer transition-all appearance-none ${statusCfg.badge}`}
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="bg-neutral-950 text-white">
                  {st}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current opacity-70 text-[9px]">
              ▼
            </div>
          </div>
        </td>

        {/* Actions */}
        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => onView(app)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-[#ccf141] transition-all cursor-pointer"
              title="View full candidate profile"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onDelete(app._id, app.fullName)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
              title="Delete candidate"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

// --------------------------------------------------------------------------
// Sub-Component: Candidate Mobile Card
// --------------------------------------------------------------------------
const CandidateCard = memo(
  ({
    app,
    onView,
    onStatusChange,
    onDelete,
    viewResumeUrl,
    downloadResumeUrl,
    whatsAppNumber,
  }) => {
    const currentStatus = app.status || "Submitted";
    const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Submitted;

    return (
      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 space-y-3 shadow-sm hover:border-[#ccf141]/30 transition-all">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-[#ccf141]">
                {app.applicationId || "BXC-APP"}
              </span>
              {app.is18Plus && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  18+
                </span>
              )}
            </div>
            <h3 className="font-black text-base text-white mt-0.5">
              {app.fullName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--db-text-muted)] mt-0.5">
              <MapPin size={11} className="text-[#ccf141]" />
              <span>{app.currentLocation || "Puducherry"}</span>
            </div>
          </div>

          <div className="relative">
            <select
              value={currentStatus}
              onChange={(e) => onStatusChange(app._id, e.target.value)}
              className={`text-[10px] font-bold pl-2 pr-5 py-1 rounded-lg border outline-none cursor-pointer appearance-none ${statusCfg.badge}`}
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="bg-neutral-950 text-white">
                  {st}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current opacity-70 text-[8px]">
              ▼
            </div>
          </div>
        </div>

        {/* Roles Tags */}
        <div className="flex flex-wrap gap-1">
          {(app.positions || []).map((role, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.08] text-zinc-200"
            >
              {role}
            </span>
          ))}
          {app.otherPosition && (
            <span className="text-[9px] italic text-[var(--db-text-muted)]">
              {app.otherPosition}
            </span>
          )}
        </div>

        {/* Metrics Overview */}
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

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.08]">
          <a
            href={`https://wa.me/${whatsAppNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400"
          >
            <MessageCircle size={14} />
            <span>{app.phone}</span>
          </a>

          <div className="flex items-center gap-1.5">
            {(app.resume?.url || app.resume?.publicId) && (
              <>
                <a
                  href={viewResumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ccf141]/20 text-[#ccf141] font-bold text-xs"
                >
                  <Eye size={12} />
                  Resume
                </a>
                <a
                  href={downloadResumeUrl}
                  className="p-1 rounded-lg bg-white/10 text-white hover:text-[#ccf141]"
                  title="Download Resume"
                >
                  <Download size={12} />
                </a>
              </>
            )}
            <button
              onClick={() => onView(app)}
              className="p-1.5 rounded-lg bg-white/[0.08] text-white hover:text-[#ccf141]"
              title="View Profile"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onDelete(app._id, app.fullName)}
              className="p-1.5 rounded-lg bg-white/[0.08] text-red-400"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// --------------------------------------------------------------------------
// Main Component: DashboardHiring
// --------------------------------------------------------------------------
const DashboardHiring = () => {
  const { user } = useAuth();

  // Primary Data State
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("All Positions");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Candidate Details Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("overview"); // "overview" | "screening" | "resume" | "interview"
  const [previewResumeOpen, setPreviewResumeOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [interviewDateInput, setInterviewDateInput] = useState("");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Debounce search input (300ms) to ensure 60fps typing without re-fetching on each key
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch applications with query parameters
  const fetchApplications = useCallback(
    async (showFullLoader = false) => {
      try {
        if (showFullLoader) setLoading(true);
        else setRefreshing(true);

        const params = {
          page,
          limit,
          search: debouncedSearch || undefined,
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
    },
    [page, limit, debouncedSearch, statusFilter, positionFilter, experienceFilter]
  );

  // Initial and reactive query fetch
  useEffect(() => {
    fetchApplications(applications.length === 0);
  }, [fetchApplications]);

  // Real-time polling (15s) and BroadcastChannel cross-tab listener
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchApplications(false);
      }
    }, 15000);

    const channel = new BroadcastChannel("bxc_hiring_updates");
    channel.onmessage = (event) => {
      if (
        event.data === "NEW_APPLICATION_SUBMITTED" ||
        event.data?.type === "NEW_APPLICATION_SUBMITTED"
      ) {
        fetchApplications(false);
      }
    };

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [fetchApplications]);

  // Optimistic Status Update: Instant UI update with background sync
  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      // 1. Instant optimistic update
      const previousApplications = [...applications];
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id || app.applicationId === id
            ? { ...app, status: newStatus }
            : app
        )
      );

      setSelectedApp((prev) =>
        prev && (prev._id === id || prev.applicationId === id)
          ? { ...prev, status: newStatus }
          : prev
      );

      try {
        const res = await updateHiringApplication(id, { status: newStatus });
        if (res.data?.success) {
          toast.success(`Application marked as ${newStatus}`);
          // Quietly refresh stats counters
          getHiringStats().then((sRes) => {
            if (sRes?.data?.success) setStats(sRes.data.stats);
          });
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        // Rollback on failure
        setApplications(previousApplications);
        toast.error("Failed to update status. Rolled back changes.");
      }
    },
    [applications]
  );

  // Handle Delete Candidate
  const handleDelete = useCallback(async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete application for "${name}"?`
      )
    ) {
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
        setSelectedApp((prev) =>
          prev && (prev._id === id || prev.applicationId === id) ? null : prev
        );
      }
    } catch (error) {
      toast.error("Failed to delete application.");
    }
  }, []);

  // Open Candidate Detail Modal
  const handleOpenCandidate = useCallback((app) => {
    setSelectedApp(app);
    setActiveModalTab("overview");
    setPreviewResumeOpen(false);
    setInterviewDateInput(
      app.interviewDate
        ? new Date(app.interviewDate).toISOString().slice(0, 16)
        : ""
    );
  }, []);

  // Add Recruiter Note to Application
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedApp || !newNote.trim()) return;

    setIsUpdatingNotes(true);
    try {
      const notePayload = {
        note: newNote.trim(),
        author: user?.name || "Admin",
      };

      const res = await updateHiringApplication(selectedApp._id, {
        adminNote: notePayload,
      });

      if (res.data?.success) {
        toast.success("Note added successfully.");
        const updatedApp = res.data.data;
        setSelectedApp(updatedApp);
        setApplications((prev) =>
          prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
        );
        setNewNote("");
      }
    } catch (error) {
      toast.error("Failed to add note.");
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async () => {
    if (!selectedApp || !interviewDateInput) {
      toast.error("Please pick a valid interview date and time.");
      return;
    }

    try {
      const res = await updateHiringApplication(selectedApp._id, {
        status: "Interview Scheduled",
        interviewDate: new Date(interviewDateInput),
      });

      if (res.data?.success) {
        toast.success("Interview scheduled & status updated!");
        const updated = res.data.data;
        setSelectedApp(updated);
        setApplications((prev) =>
          prev.map((app) => (app._id === updated._id ? updated : app))
        );
      }
    } catch (err) {
      toast.error("Failed to schedule interview.");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error("No applications to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Full Name",
      "Phone",
      "Email",
      "Is 18+",
      "Location",
      "Positions Applied",
      "Total Experience",
      "Highest Education",
      "Previous Company",
      "Certifications",
      "Languages Known",
      "Coaching Targets",
      "Current Status",
      "Joining In",
      "Preferred Shift",
      "Expected Salary",
      "Willing for Puducherry",
      "Resume Link",
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
      `"${getResumeViewUrl(app) || app.resume?.url || ""}"`,
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

  return (
    <div className="p-3.5 sm:p-5 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--db-card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#ccf141] shadow-[0_0_20px_rgba(204,241,65,0.15)]">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--db-text)] flex items-center gap-2">
                Recruitment & Hiring Arena
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ccf141]/20 text-[#ccf141] border border-[#ccf141]/40 shadow-sm">
                  Live
                </span>
              </h1>
              <p className="text-xs text-[var(--db-text-muted)] mt-0.5">
                Manage candidate pipelines, screening responses, resumes, and interview scheduling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => fetchApplications(false)}
              disabled={refreshing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] hover:border-[#ccf141] transition-all cursor-pointer active:scale-95"
              title="Refresh applications"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-[#ccf141]" : ""}
              />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#ccf141] text-black text-xs font-black hover:bg-[#bfe636] transition-all cursor-pointer shadow-[0_0_15px_rgba(204,241,65,0.25)] active:scale-95"
              title="Export to CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[var(--db-text-muted)] tracking-wider">
                Total Applicants
              </span>
              <Users size={16} className="text-neutral-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              {stats?.total ?? totalCount}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">
              {stats?.recent7Days || 0} received in last 7 days
            </span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-blue-400 tracking-wider">
                New Submissions
              </span>
              <Clock size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1.5">
              {stats?.byStatus?.Submitted ?? 0}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">
              Pending initial screening
            </span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-purple-400 tracking-wider">
                In Pipeline
              </span>
              <Award size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1.5">
              {(stats?.byStatus?.Shortlisted || 0) +
                (stats?.byStatus?.["Interview Scheduled"] || 0)}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">
              Shortlisted & Interviews
            </span>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-[#ccf141]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#ccf141] tracking-wider">
                Hired Coaches / Staff
              </span>
              <CheckCircle size={16} className="text-[#ccf141]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#ccf141] mt-1.5">
              {stats?.byStatus?.Hired ?? 0}
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)]">
              Active arena talent
            </span>
          </div>
        </div>

        {/* Quick Filter Status Tabs Bar (1-Click Filtering) */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 select-none">
          <button
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
              statusFilter === "all"
                ? "bg-[#ccf141] text-black font-black shadow-[0_0_12px_rgba(204,241,65,0.3)]"
                : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-zinc-400 hover:text-white"
            }`}
          >
            All Candidates ({stats?.total ?? totalCount})
          </button>

          {STATUS_OPTIONS.map((st) => {
            const count = stats?.byStatus?.[st] ?? 0;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#ccf141] text-black font-black shadow-[0_0_12px_rgba(204,241,65,0.3)]"
                    : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-black/20 text-black font-black"
                      : "bg-white/[0.08] text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Advanced Filters Dock */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
            />
            <input
              type="text"
              placeholder="Instant search by candidate name, phone, email, location, or App ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] pl-10 pr-9 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] transition-all placeholder:text-zinc-500"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                title="Clear search"
              >
                <X size={13} />
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
                <option key={pos} value={pos} className="bg-neutral-950 text-white">
                  {pos}
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
              className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141] cursor-pointer"
            >
              {EXPERIENCE_FILTER_OPTIONS.map((exp) => (
                <option key={exp} value={exp} className="bg-neutral-950 text-white">
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List Area */}
        {loading ? (
          /* Smooth Skeleton Rows to Prevent Layout Shifts */
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin" />
              <span className="text-xs font-semibold text-zinc-400">
                Loading applications at high speed...
              </span>
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-white/[0.02] rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] text-[var(--db-text-muted)]">
            <Briefcase
              size={44}
              className="mx-auto mb-3 opacity-30 text-[#ccf141]"
            />
            <p className="text-base font-bold text-white">
              No matching applications found
            </p>
            <p className="text-xs text-[var(--db-text-muted)] mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or filter options.
            </p>
            {(statusFilter !== "all" ||
              positionFilter !== "All Positions" ||
              experienceFilter !== "All Experience" ||
              searchInput) && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPositionFilter("All Positions");
                  setExperienceFilter("All Experience");
                  setSearchInput("");
                  setPage(1);
                }}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-bold text-[#ccf141] transition-all"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] border-b border-[var(--db-card-border)] text-[var(--db-text-muted)] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Roles Applied</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Documents</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <CandidateRow
                        key={app._id}
                        app={app}
                        onView={handleOpenCandidate}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        viewResumeUrl={getResumeViewUrl(app)}
                        downloadResumeUrl={getResumeDownloadUrl(app)}
                        whatsAppNumber={cleanWhatsAppPhone(app.phone)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {applications.map((app) => (
                <CandidateCard
                  key={app._id}
                  app={app}
                  onView={handleOpenCandidate}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  viewResumeUrl={getResumeViewUrl(app)}
                  downloadResumeUrl={getResumeDownloadUrl(app)}
                  whatsAppNumber={cleanWhatsAppPhone(app.phone)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 text-xs select-none">
              <div className="text-[var(--db-text-muted)] text-[11px]">
                Showing{" "}
                <span className="font-bold text-white">
                  {applications.length > 0 ? (page - 1) * limit + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-bold text-white">
                  {Math.min(page * limit, totalCount)}
                </span>{" "}
                of <span className="font-bold text-white">{totalCount}</span>{" "}
                candidates
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="text-[var(--db-text-muted)]">Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] px-2 py-1 rounded-lg outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
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

        {/* Detailed Candidate Modal */}
        <AnimatePresence>
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl bg-[#0d0d10] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl text-left text-xs max-h-[90vh] overflow-y-auto custom-scrollbar space-y-5"
              >
                {/* Modal Top Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#ccf141] font-black text-base flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(204,241,65,0.25)]">
                      {(selectedApp.fullName || "Candidate")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#ccf141]">
                          {selectedApp.applicationId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            STATUS_CONFIG[selectedApp.status || "Submitted"]?.badge
                          }`}
                        >
                          {selectedApp.status || "Submitted"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        {selectedApp.fullName}
                      </h2>
                      <p className="text-zinc-400 text-xs">
                        Applied on{" "}
                        {new Date(selectedApp.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedApp.status || "Submitted"}
                      onChange={(e) =>
                        handleStatusChange(selectedApp._id, e.target.value)
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                        STATUS_CONFIG[selectedApp.status || "Submitted"]?.badge
                      }`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option
                          key={st}
                          value={st}
                          className="bg-neutral-950 text-white"
                        >
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Action Dock */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <a
                    href={`https://wa.me/${cleanWhatsAppPhone(
                      selectedApp.phone
                    )}?text=${encodeURIComponent(
                      `Hi ${selectedApp.fullName}, this is Box & Cross Arena HR regarding your application for ${
                        selectedApp.positions?.[0] || "position"
                      }.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition-all"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp Candidate</span>
                  </a>

                  {selectedApp.resume?.url || selectedApp.resume?.publicId ? (
                    <>
                      <a
                        href={getResumeViewUrl(selectedApp)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ccf141] text-black font-black hover:bg-[#bfe636] transition-all"
                      >
                        <Eye size={13} />
                        <span>Open Resume</span>
                      </a>
                      <a
                        href={getResumeDownloadUrl(selectedApp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-bold transition-all border border-white/10"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                    </>
                  ) : null}
                </div>

                {/* Modal Tab Navigator */}
                <div className="flex items-center gap-1 border-b border-white/10 pb-2">
                  {[
                    { id: "overview", label: "Overview", icon: Users },
                    { id: "screening", label: "Screening & Q&A", icon: Award },
                    { id: "resume", label: "Resume & Documents", icon: FileText },
                    { id: "interview", label: "Schedule & Notes", icon: Calendar },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeModalTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveModalTab(tab.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#ccf141] text-black shadow-[0_0_12px_rgba(204,241,65,0.3)] font-black"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        <TabIcon size={13} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeModalTab === "overview" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Phone / WhatsApp:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Email Address:
                        </span>
                        <span className="font-bold text-white mt-0.5 block truncate">
                          {selectedApp.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Current Location:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.currentLocation}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Total Experience:
                        </span>
                        <span className="font-bold text-[#ccf141] mt-0.5 block">
                          {selectedApp.totalExperience || "Fresher"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Highest Education:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.highestEducation || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Previous Workplace:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.previousCompany || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          When Can You Join:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.whenCanYouJoin || "Immediate"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Preferred Shift:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.preferredShift || "Flexible"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Expected Monthly Salary:
                        </span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">
                          {selectedApp.expectedSalary || "Negotiable"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Willing On-Site in Puducherry:
                        </span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">
                          {selectedApp.willingToWorkInPuducherry ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Current Employment Status:
                        </span>
                        <span className="font-bold text-white mt-0.5 block">
                          {selectedApp.currentEmploymentStatus || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">
                          Age Confirmation (18+):
                        </span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">
                          {selectedApp.is18Plus ? "Confirmed 18+" : "Under 18"}
                        </span>
                      </div>
                    </div>

                    {/* Roles Applied */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ccf141] block mb-2">
                        Positions Applied For:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(selectedApp.positions || []).map((role, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold"
                          >
                            {role}
                          </span>
                        ))}
                        {selectedApp.otherPosition && (
                          <span className="px-3 py-1.5 rounded-xl bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 font-bold">
                            Other: {selectedApp.otherPosition}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    {selectedApp.certifications && (
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider mb-1">
                          Certifications:
                        </span>
                        <p className="text-white font-medium">
                          {selectedApp.certifications}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: SCREENING & Q&A */}
                {activeModalTab === "screening" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Skills description */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#ccf141] flex items-center gap-1.5">
                        <Sparkles size={13} /> Candidate Skills & Strengths
                      </span>
                      <p className="text-white text-xs leading-relaxed">
                        {selectedApp.skillsDescription || "Not specified."}
                      </p>
                    </div>

                    {/* Coaching Experience Focus */}
                    {(selectedApp.coachingExperience || []).length > 0 && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#ccf141]">
                          Coaching Experience Groups:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.coachingExperience.map((tgt, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold"
                            >
                              ✓ {tgt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages Known */}
                    {(selectedApp.languagesKnown || []).length > 0 && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#ccf141]">
                          Languages Known:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.languagesKnown.map((lang, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Role-Specific Screening Answers */}
                    {selectedApp.roleSpecificAnswers &&
                      Object.keys(selectedApp.roleSpecificAnswers).length > 0 && (
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#ccf141]">
                            Screening Questions & Responses:
                          </span>
                          <div className="space-y-2">
                            {Object.entries(selectedApp.roleSpecificAnswers).map(
                              ([qKey, ans], idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-black/40 border border-white/5"
                                >
                                  <span className="text-[10px] text-zinc-400 block font-semibold mb-1">
                                    Q: {qKey}
                                  </span>
                                  <p className="text-white text-xs">
                                    {String(ans)}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* TAB 3: RESUME & DOCUMENTS */}
                {activeModalTab === "resume" && (() => {
                  const isResumeImage =
                    selectedApp.resume?.fileType?.startsWith("image/") ||
                    /\.(jpe?g|png|webp|gif|svg)$/i.test(
                      selectedApp.resume?.originalName || ""
                    );

                  return (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm block">
                                {isResumeImage
                                  ? "Candidate Image / Document"
                                  : "Resume Attachment"}
                              </span>
                              {selectedApp.resume?.storageProvider ===
                                "google_drive" && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  Google Drive
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs mt-0.5">
                              <span>
                                {selectedApp.resume?.originalName ||
                                  "Document uploaded by candidate"}
                              </span>
                              {selectedApp.resume?.fileSize > 0 && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {(selectedApp.resume.fileSize / 1024).toFixed(0)}{" "}
                                    KB
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {selectedApp.resume?.url ||
                            selectedApp.resume?.publicId ? (
                              <>
                                <button
                                  onClick={() =>
                                    setPreviewResumeOpen((prev) => !prev)
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-bold text-xs transition-all"
                                >
                                  {previewResumeOpen ? (
                                    <>
                                      <EyeOff size={13} />
                                      <span>Hide Preview</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye size={13} />
                                      <span>Live Preview</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={getResumeViewUrl(selectedApp)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ccf141] text-black font-black text-xs hover:bg-[#bfe636] transition-all"
                                >
                                  <ExternalLink size={13} />
                                  <span>Open in Tab</span>
                                </a>

                                <a
                                  href={getResumeDownloadUrl(selectedApp)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-bold text-xs transition-all border border-white/10"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </a>

                                {selectedApp.resume?.webViewLink && (
                                  <a
                                    href={selectedApp.resume.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-emerald-400 font-bold text-xs transition-all border border-emerald-500/30"
                                    title="Open directly in Google Drive"
                                  >
                                    <ExternalLink size={12} />
                                    <span>Drive</span>
                                  </a>
                                )}
                              </>
                            ) : (
                              <span className="text-zinc-400 italic">
                                No file attached
                              </span>
                            )}
                          </div>
                        </div>

                        {/* On-Demand Document / Image Preview */}
                        {previewResumeOpen &&
                          (selectedApp.resume?.url ||
                            selectedApp.resume?.publicId) && (
                            <div className="rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl mt-3 animate-fadeIn">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] text-zinc-300">
                                <span className="font-semibold flex items-center gap-1 text-[#ccf141]">
                                  <FileText size={12} />{" "}
                                  {isResumeImage
                                    ? "Live Image Preview"
                                    : "In-App Live Document Viewer"}
                                </span>
                                <a
                                  href={getResumeDownloadUrl(selectedApp)}
                                  className="text-[#ccf141] hover:underline"
                                >
                                  Download File
                                </a>
                              </div>

                              {isResumeImage ? (
                                <div className="p-4 flex flex-col items-center justify-center bg-black/90 min-h-[350px]">
                                  <img
                                    src={getResumeViewUrl(selectedApp)}
                                    alt={
                                      selectedApp.resume?.originalName ||
                                      "Candidate Document"
                                    }
                                    className="max-h-[500px] w-auto max-w-full object-contain rounded-lg shadow-lg border border-white/5"
                                  />
                                </div>
                              ) : (
                                <iframe
                                  src={getResumeViewUrl(selectedApp)}
                                  title="Resume Viewer"
                                  className="w-full h-[450px] bg-neutral-950 border-0"
                                />
                              )}
                            </div>
                          )}
                      </div>

                      {/* Portfolio / External Link */}
                      {selectedApp.portfolioLink && (
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-400 block">
                              Portfolio / Social Profile:
                            </span>
                            <span className="font-mono text-white text-xs truncate max-w-sm block">
                              {selectedApp.portfolioLink}
                            </span>
                          </div>
                          <a
                            href={
                              selectedApp.portfolioLink.startsWith("http")
                                ? selectedApp.portfolioLink
                                : `https://${selectedApp.portfolioLink}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-[#ccf141] font-bold text-xs flex items-center gap-1"
                          >
                            <span>Visit Link</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}

                      {/* Certifications Link */}
                      {selectedApp.certificatesUrl && (
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-400 block">
                              Coaching Certifications Link:
                            </span>
                            <span className="font-mono text-white text-xs truncate max-w-sm block">
                              {selectedApp.certificatesUrl}
                            </span>
                          </div>
                          <a
                            href={
                              selectedApp.certificatesUrl.startsWith("http")
                                ? selectedApp.certificatesUrl
                                : `https://${selectedApp.certificatesUrl}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-[#ccf141] font-bold text-xs flex items-center gap-1"
                          >
                            <span>Visit Link</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}

                      {/* Extra Attached Files (if any) */}
                      {Array.isArray(selectedApp.attachedFiles) &&
                        selectedApp.attachedFiles.length > 0 && (
                          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-white block">
                              Additional Attached Documents (
                              {selectedApp.attachedFiles.length})
                            </span>
                            <div className="space-y-2">
                              {selectedApp.attachedFiles.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate max-w-xs">
                                    <FileText
                                      size={14}
                                      className="text-[#ccf141] shrink-0"
                                    />
                                    <span className="text-white truncate font-medium">
                                      {file.originalName ||
                                        `Document #${idx + 1}`}
                                    </span>
                                  </div>
                                  {file.url && (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/15 text-[#ccf141] font-bold text-[11px] flex items-center gap-1"
                                    >
                                      <span>View</span>
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })()}

                {/* TAB 4: SCHEDULE & RECRUITER NOTES */}
                {activeModalTab === "interview" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Interview Schedule Card */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                        <Calendar size={14} /> Schedule Candidate Interview
                      </span>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="datetime-local"
                          value={interviewDateInput}
                          onChange={(e) =>
                            setInterviewDateInput(e.target.value)
                          }
                          className="flex-1 bg-black border border-neutral-800 text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-[#ccf141]"
                        />

                        <button
                          onClick={handleScheduleInterview}
                          className="px-4 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs hover:bg-[#bfe636] transition-all cursor-pointer shadow-sm"
                        >
                          Confirm & Schedule
                        </button>
                      </div>

                      {selectedApp.interviewDate && (
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-between text-xs">
                          <span>
                            Scheduled on:{" "}
                            <strong>
                              {new Date(
                                selectedApp.interviewDate
                              ).toLocaleString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>
                          </span>
                          <a
                            href={`https://wa.me/${cleanWhatsAppPhone(
                              selectedApp.phone
                            )}?text=${encodeURIComponent(
                              `Hi ${
                                selectedApp.fullName
                              }, we have scheduled your interview at Box & Cross Arena on ${new Date(
                                selectedApp.interviewDate
                              ).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}. Please confirm your attendance.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold underline text-cyan-200 hover:text-white"
                          >
                            Send WhatsApp Confirmation
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Recruiter Notes Thread */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ccf141] flex items-center gap-1.5">
                        <FileText size={14} /> Recruiter Internal Notes
                      </span>

                      {/* Notes list */}
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {(selectedApp.adminNotes || []).length === 0 ? (
                          <p className="text-zinc-500 italic text-xs">
                            No internal notes added yet.
                          </p>
                        ) : (
                          selectedApp.adminNotes.map((noteItem, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1"
                            >
                              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                <span className="font-bold text-[#ccf141]">
                                  {noteItem.author || "Admin"}
                                </span>
                                <span>
                                  {new Date(
                                    noteItem.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-white text-xs">{noteItem.note}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add note form */}
                      <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Type internal evaluation note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="flex-1 bg-black border border-neutral-800 text-white px-3 py-2 text-xs rounded-xl outline-none focus:border-[#ccf141]"
                        />
                        <button
                          type="submit"
                          disabled={isUpdatingNotes || !newNote.trim()}
                          className="px-3.5 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs hover:bg-[#bfe636] disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Send size={12} />
                          <span>Add</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardHiring;
