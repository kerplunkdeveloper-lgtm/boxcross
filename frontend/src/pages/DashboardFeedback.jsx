import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  Search,
  QrCode,
  ExternalLink,
  Download,
  RotateCcw,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getFeedbackList,
  getFeedbackStats,
  updateFeedback,
  deleteFeedback,
} from "../api/api";
import {
  CONNECTIONS,
  PROGRAMMES,
  AREA_RATINGS,
  IMPROVEMENT_AREAS,
  WRITTEN_QUESTIONS,
  FEEDBACK_STATUSES,
} from "./feedback/feedbackOptions";

const STATUS_STYLES = {
  Open: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  "In Progress": "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Resolved: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
};

const PAGE_SIZE = 15;

const formatDate = (d, withTime = false) =>
  d
    ? new Date(d).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "-";

const firstWritten = (f) => {
  for (const q of WRITTEN_QUESTIONS) if (f[q.key]) return f[q.key];
  return "";
};

const Stars = ({ value, size = 13 }) =>
  value ? (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.8}
          className={n <= value ? "text-[#ccf141]" : "text-[var(--db-text-muted)]/40"}
          fill={n <= value ? "#ccf141" : "transparent"}
        />
      ))}
    </span>
  ) : (
    <span className="text-[var(--db-text-muted)] text-xs">—</span>
  );

const StatusSelect = ({ value, onChange, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onClick={(e) => e.stopPropagation()}
    aria-label="Feedback status"
    className={`px-2 py-1 rounded-md text-[11px] uppercase tracking-wider font-extrabold border cursor-pointer focus:outline-none ${STATUS_STYLES[value] || ""} ${className}`}
  >
    {FEEDBACK_STATUSES.map((s) => (
      <option key={s} value={s} className="bg-[#121212] text-white">
        {s}
      </option>
    ))}
  </select>
);

const StatCard = ({ label, value, sub, icon: Icon, tone, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 flex flex-col justify-between min-h-[100px] shadow-lg"
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)]">{label}</span>
      <span className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${tone}`}>
        <Icon size={16} />
      </span>
    </div>
    <div className="mt-2">
      <div className="text-2xl sm:text-3xl font-black font-mono leading-none text-[var(--db-text)]">{value}</div>
      {sub && <div className="text-[11px] text-[var(--db-text-muted)] mt-1">{sub}</div>}
    </div>
  </motion.div>
);

const DashboardFeedback = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [connectionFilter, setConnectionFilter] = useState("all");
  const [safetyOnly, setSafetyOnly] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getFeedbackList({ limit: 2000 }),
        getFeedbackStats(),
      ]);
      if (listRes.data.success) setItems(listRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setNotesDraft(selected?.adminNotes || "");
  }, [selected?._id]);

  // Close the drawer with Escape
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;
    return items.filter((f) => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (areaFilter !== "all" && f.improvementArea !== areaFilter) return false;
      if (connectionFilter !== "all" && f.connection !== connectionFilter) return false;
      if (safetyOnly && f.safetyConcern !== "Yes") return false;
      const created = new Date(f.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      if (q) {
        const hay = [...WRITTEN_QUESTIONS.map((w) => f[w.key]), f.safetyDetails, f.adminNotes, f.improvementArea, f.programme]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, statusFilter, areaFilter, connectionFilter, safetyOnly, fromDate, toDate]);

  useEffect(() => setPage(1), [search, statusFilter, areaFilter, connectionFilter, safetyOnly, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters =
    search || statusFilter !== "all" || areaFilter !== "all" || connectionFilter !== "all" || safetyOnly || fromDate || toDate;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAreaFilter("all");
    setConnectionFilter("all");
    setSafetyOnly(false);
    setFromDate("");
    setToDate("");
  };

  const applyUpdate = (updated) => {
    setItems((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
    setSelected((s) => (s && s._id === updated._id ? updated : s));
  };

  const handleUpdate = async (id, fields, successMsg = "Feedback updated") => {
    try {
      const { data } = await updateFeedback(id, fields);
      if (data.success) {
        applyUpdate(data.data);
        toast.success(successMsg);
        if (fields.status) load(false); // refresh status counts
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback permanently?")) return;
    try {
      const { data } = await deleteFeedback(id);
      if (data.success) {
        setItems((prev) => prev.filter((f) => f._id !== id));
        if (selected?._id === id) setSelected(null);
        toast.success("Feedback deleted");
        load(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const exportCSV = () => {
    if (!filtered.length) {
      toast.error("Nothing to export");
      return;
    }
    const cols = [
      ["Date", (f) => formatDate(f.createdAt, true)],
      ["Connection", (f) => f.connection],
      ["Programme", (f) => f.programme],
      ["Overall", (f) => f.ratings?.overall ?? ""],
      ...AREA_RATINGS.map((a) => [a.label, (f) => f.ratings?.[a.key] ?? ""]),
      ["Needs most improvement", (f) => f.improvementArea],
      ...WRITTEN_QUESTIONS.map((w) => [w.label, (f) => f[w.key]]),
      ["Felt unsafe / uncomfortable", (f) => f.safetyConcern],
      ["Safety details", (f) => f.safetyDetails],
      ["Status", (f) => f.status],
      ["Admin notes", (f) => f.adminNotes],
    ];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.map((c) => esc(c[0])).join(","), ...filtered.map((f) => cols.map((c) => esc(c[1](f))).join(","))].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `BXC_Feedback_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const areaBars = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byArea)
      .filter(([area]) => area !== "Nothing specific")
      .sort((a, b) => b[1] - a[1]);
  }, [stats]);
  const maxArea = Math.max(1, ...areaBars.map(([, n]) => n));

  const inputCls =
    "h-10 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl px-3 text-[13px] text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-[var(--db-text)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
            style={{ fontFamily: '"Brutal Font", sans-serif' }}
          >
            Member Feedback
          </h1>
          <p className="text-[var(--db-text-muted)] text-xs sm:text-sm mt-1">
            Anonymous responses from the /feedback form. Review by topic and track issues to resolution.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/feedback-qr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[12px] font-black uppercase tracking-wider"
          >
            <QrCode size={15} /> QR Poster
          </a>
          <a
            href="/feedback"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[12px] font-bold"
          >
            <ExternalLink size={14} /> Open form
          </a>
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[12px] font-bold cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => load()}
            title="Refresh"
            aria-label="Refresh"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Responses" value={stats?.total ?? "–"} icon={MessageSquare} tone="bg-blue-500/10 border-blue-500/20 text-blue-400" />
        <StatCard
          label="Avg. rating"
          value={stats?.averages?.overall ?? "–"}
          sub="Overall experience, out of 5"
          icon={Star}
          tone="bg-[#ccf141]/10 border-[#ccf141]/30 text-[#ccf141]"
          delay={0.04}
        />
        <StatCard
          label="Suggestions"
          value={stats?.suggestions ?? "–"}
          sub="With written answers"
          icon={Lightbulb}
          tone="bg-purple-500/10 border-purple-500/20 text-purple-400"
          delay={0.08}
        />
        <StatCard
          label="Open"
          value={stats ? stats.byStatus.Open + stats.byStatus["In Progress"] : "–"}
          sub={stats ? `${stats.byStatus["In Progress"]} in progress · ${stats.byStatus.Resolved} resolved` : ""}
          icon={AlertTriangle}
          tone="bg-amber-500/10 border-amber-500/20 text-amber-400"
          delay={0.12}
        />
        <StatCard
          label="Safety flags"
          value={stats?.safetyFlags ?? "–"}
          sub="Felt unsafe or uncomfortable"
          icon={ShieldAlert}
          tone="bg-red-500/10 border-red-500/20 text-red-400"
          delay={0.16}
        />
      </div>

      {/* Insight panels */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[var(--db-text-muted)] mb-4">
              Needs most improvement
            </h2>
            <div className="space-y-2.5">
              {areaBars.map(([area, n]) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setAreaFilter(areaFilter === area ? "all" : area)}
                  className={`w-full text-left group cursor-pointer rounded-lg -mx-1 px-1 py-0.5 ${areaFilter === area ? "bg-white/5" : ""}`}
                  title="Filter the table by this area"
                >
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-[var(--db-text)] group-hover:text-[var(--db-accent-highlight)] truncate pr-3">{area}</span>
                    <span className="font-mono font-bold text-[var(--db-text-muted)]">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-[#ccf141]" style={{ width: `${(n / maxArea) * 100}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[var(--db-text-muted)] mb-4">
              Average rating by area
            </h2>
            <div className="space-y-3.5">
              {[{ key: "overall", label: "Overall experience" }, ...AREA_RATINGS].map((a) => {
                const v = stats.averages[a.key];
                return (
                  <div key={a.key}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-[var(--db-text)]">{a.label}</span>
                      <span className="font-mono font-bold text-[var(--db-text-muted)]">{v ?? "–"} / 5</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${v >= 4 ? "bg-emerald-400" : v >= 3 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${((v || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Table panel */}
      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5">
        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-3 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search written answers and notes…"
              className={`${inputCls} w-full pl-9`}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls} aria-label="Status">
              <option value="all">All statuses</option>
              {FEEDBACK_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className={`${inputCls} sm:max-w-[200px]`} aria-label="Improvement area">
              <option value="all">All areas</option>
              {IMPROVEMENT_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select value={connectionFilter} onChange={(e) => setConnectionFilter(e.target.value)} className={inputCls} aria-label="Connection">
              <option value="all">Everyone</option>
              {CONNECTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputCls} aria-label="From date" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputCls} aria-label="To date" />
            <label className={`${inputCls} inline-flex items-center gap-2 cursor-pointer select-none`}>
              <input type="checkbox" checked={safetyOnly} onChange={(e) => setSafetyOnly(e.target.checked)} className="accent-red-500" />
              Safety only
            </label>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="h-10 px-3 text-[12px] font-bold text-[var(--db-text-muted)] hover:text-[var(--db-text)] cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="text-[12px] text-[var(--db-text-muted)] mb-3">
          Showing {filtered.length} of {items.length} responses
        </div>

        {loading ? (
          <div className="py-16 text-center text-[var(--db-text-muted)] text-sm">Loading feedback…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={28} className="mx-auto text-[var(--db-text-muted)] mb-3" />
            <p className="text-sm font-bold">{items.length ? "No feedback matches these filters" : "No feedback yet"}</p>
            <p className="text-xs text-[var(--db-text-muted)] mt-1">
              {items.length ? "Try clearing the filters." : "Print the QR poster and place it at reception to start collecting responses."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {pageItems.map((f) => (
                <div
                  key={f._id}
                  onClick={() => setSelected(f)}
                  className="rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 p-3.5 space-y-2.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[var(--db-text-muted)] font-mono">{formatDate(f.createdAt)}</span>
                    <StatusSelect value={f.status} onChange={(s) => handleUpdate(f._id, { status: s })} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Stars value={f.ratings?.overall} />
                    {f.safetyConcern === "Yes" && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-400">Safety</span>
                    )}
                    {f.connection && <span className="text-[11px] text-[var(--db-text-muted)]">{f.connection}</span>}
                  </div>
                  {f.improvementArea && <div className="text-[12px] font-semibold">Improve: {f.improvementArea}</div>}
                  {firstWritten(f) && <p className="text-[12px] text-[var(--db-text-muted)] line-clamp-2">"{firstWritten(f)}"</p>}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead>
                  <tr className="bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[11px] uppercase font-extrabold tracking-wider">
                    <th className="py-3 px-3 rounded-l-xl whitespace-nowrap">Date</th>
                    <th className="py-3 px-3">Who</th>
                    <th className="py-3 px-3 whitespace-nowrap">Overall</th>
                    <th className="py-3 px-3">Needs improvement</th>
                    <th className="py-3 px-3">Highlights</th>
                    <th className="py-3 px-3 text-center">Safety</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 rounded-r-xl text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]">
                  {pageItems.map((f) => (
                    <tr
                      key={f._id}
                      onClick={() => setSelected(f)}
                      className={`hover:bg-[var(--db-table-hover)] cursor-pointer transition-colors ${selected?._id === f._id ? "bg-[var(--db-table-hover)]" : ""}`}
                    >
                      <td className="py-3 px-3 text-[12px] font-mono text-[var(--db-text-muted)] whitespace-nowrap">{formatDate(f.createdAt, true)}</td>
                      <td className="py-3 px-3 text-[12px]">
                        <div className="font-semibold">{f.connection || "—"}</div>
                        <div className="text-[11px] text-[var(--db-text-muted)]">{f.programme}</div>
                      </td>
                      <td className="py-3 px-3"><Stars value={f.ratings?.overall} /></td>
                      <td className="py-3 px-3 text-[12px] max-w-[200px]">{f.improvementArea || <span className="text-[var(--db-text-muted)]">—</span>}</td>
                      <td className="py-3 px-3 text-[12px] text-[var(--db-text-muted)] max-w-[300px]">
                        <p className="line-clamp-2">{firstWritten(f) || "—"}</p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {f.safetyConcern === "Yes" ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-400">Flagged</span>
                        ) : (
                          <span className="text-[11px] text-[var(--db-text-muted)]">{f.safetyConcern || "—"}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <StatusSelect value={f.status} onChange={(s) => handleUpdate(f._id, { status: s })} />
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setSelected(f)} title="View" aria-label="View" className="p-1.5 rounded-md hover:bg-white/5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] cursor-pointer">
                            <Eye size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(f._id)} title="Delete" aria-label="Delete" className="p-1.5 rounded-md hover:bg-red-500/10 text-[var(--db-text-muted)] hover:text-red-400 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-[12px] text-[var(--db-text-muted)]">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page" className="w-9 h-9 rounded-lg border border-[var(--db-input-border)] flex items-center justify-center disabled:opacity-40 cursor-pointer">
                    <ChevronLeft size={15} />
                  </button>
                  <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page" className="w-9 h-9 rounded-lg border border-[var(--db-input-border)] flex items-center justify-center disabled:opacity-40 cursor-pointer">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[var(--db-card)] border-l border-[var(--db-card-border)] z-50 flex flex-col shadow-2xl"
              role="dialog"
              aria-label="Feedback details"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--db-card-border)]">
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-black text-[var(--db-text-muted)]">Feedback</div>
                  <div className="text-[13px] font-mono">{formatDate(selected.createdAt, true)}</div>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
                {selected.safetyConcern === "Yes" && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                    <div className="flex items-center gap-2 text-red-400 text-[12px] font-black uppercase tracking-wider">
                      <ShieldAlert size={15} /> Safety / comfort concern
                    </div>
                    <p className="text-[13px] mt-2 whitespace-pre-wrap leading-relaxed">
                      {selected.safetyDetails || "No details given."}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-black text-[var(--db-text-muted)] mb-2">Status</div>
                  <div className="grid grid-cols-3 gap-2">
                    {FEEDBACK_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => selected.status !== s && handleUpdate(selected._id, { status: s })}
                        className={`h-9 rounded-lg border text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                          selected.status === s ? STATUS_STYLES[s] : "border-[var(--db-input-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] p-3">
                    <div className="text-[10px] uppercase tracking-wider font-black text-[var(--db-text-muted)]">Connection</div>
                    <div className="text-[13px] font-semibold mt-0.5">{selected.connection || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] p-3">
                    <div className="text-[10px] uppercase tracking-wider font-black text-[var(--db-text-muted)]">Programme</div>
                    <div className="text-[13px] font-semibold mt-0.5">{selected.programme || "—"}</div>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-black text-[var(--db-text-muted)] mb-2">Ratings</div>
                  <div className="rounded-xl border border-[var(--db-card-border)] divide-y divide-[var(--db-card-border)]">
                    {[{ key: "overall", label: "Overall experience" }, ...AREA_RATINGS].map((a) => (
                      <div key={a.key} className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <span className="text-[12px]">{a.label}</span>
                        <Stars value={selected.ratings?.[a.key]} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-widest font-black text-[var(--db-text-muted)] mb-1">Needs most improvement</div>
                  <div className="text-[14px] font-semibold">{selected.improvementArea || "—"}</div>
                </div>

                {/* Written answers */}
                {WRITTEN_QUESTIONS.map((q) => (
                  <div key={q.key}>
                    <div className="text-[12px] font-bold text-[var(--db-text-muted)] mb-1">{q.label}</div>
                    {selected[q.key] ? (
                      <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{selected[q.key]}</p>
                    ) : (
                      <p className="text-[13px] text-[var(--db-text-muted)] italic">No answer</p>
                    )}
                  </div>
                ))}

                {selected.safetyConcern && selected.safetyConcern !== "Yes" && (
                  <div className="text-[12px] text-[var(--db-text-muted)]">
                    Felt unsafe or uncomfortable: <span className="font-semibold text-[var(--db-text)]">{selected.safetyConcern}</span>
                  </div>
                )}

                {/* Admin notes */}
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-black text-[var(--db-text-muted)] mb-2">Management notes</div>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={4}
                    placeholder="What was done about this? (only visible to management)"
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none resize-y"
                  />
                  <button
                    type="button"
                    disabled={notesDraft === (selected.adminNotes || "")}
                    onClick={() => handleUpdate(selected._id, { adminNotes: notesDraft }, "Notes saved")}
                    className="mt-2 inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--db-accent)] text-[var(--db-accent-text)] text-[12px] font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                  >
                    <Save size={14} /> Save notes
                  </button>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[var(--db-card-border)]">
                <button
                  type="button"
                  onClick={() => handleDelete(selected._id)}
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 size={14} /> Delete feedback
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardFeedback;
