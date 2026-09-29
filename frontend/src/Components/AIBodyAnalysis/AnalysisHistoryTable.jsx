import React, { useState } from "react";
import { FileText, Search, Eye, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AnalysisHistoryTable = ({
  history = [],
  onViewReport,
  onDeleteRecord,
  selectedMemberId,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("All");
  const [minScoreFilter, setMinScoreFilter] = useState("All");
  const [selectedTrainer, setSelectedTrainer] = useState("All");

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "29 Sep 2026";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format duration helper (seconds to MM:SS)
  const formatDuration = (seconds) => {
    if (!seconds) return "01:24";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Extract unique trainers & exercises for filters
  const uniqueTrainers = Array.from(
    new Set(history.map((h) => h.trainerName).filter(Boolean)),
  );

  // Filter records
  const filteredRecords = history.filter((item) => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        item.memberName?.toLowerCase().includes(q) ||
        item.memberId?.toLowerCase().includes(q) ||
        item.analysisType?.toLowerCase().includes(q) ||
        item.trainerName?.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Exercise type
    if (selectedExercise !== "All" && item.analysisType !== selectedExercise) {
      return false;
    }

    // Min Score
    if (minScoreFilter !== "All") {
      const min = Number(minScoreFilter);
      if (item.overallScore < min) return false;
    }

    // Trainer
    if (selectedTrainer !== "All" && item.trainerName !== selectedTrainer) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--db-card-border)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
            <FileText
              size={13}
              className="text-emerald-500 dark:text-[#ccf141]"
            />
            Session Archives
          </span>
          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)] mt-0.5">
            Member Analysis History
          </h3>
        </div>

        <div className="text-xs font-semibold text-[var(--db-text-muted)]">
          Total Logs:{" "}
          <span className="font-mono font-bold text-[var(--db-text-title)]">
            {filteredRecords.length}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search member, ID, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-emerald-500/60 dark:focus:border-[#ccf141]/60 transition-all"
          />
        </div>

        {/* Exercise Filter */}
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-emerald-500/60 dark:focus:border-[#ccf141]/60 cursor-pointer"
        >
          <option
            value="All"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            All Analysis Types
          </option>
          <option
            value="Posture Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Posture Analysis
          </option>
          <option
            value="Squat Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Squat Analysis
          </option>
          <option
            value="Push-Up Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Push-Up Analysis
          </option>
          <option
            value="Deadlift Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Deadlift Analysis
          </option>
          <option
            value="Plank Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Plank Analysis
          </option>
          <option
            value="Lunge Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Lunge Analysis
          </option>
          <option
            value="Movement Tracking"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Movement Tracking
          </option>
          <option
            value="Body Symmetry"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Body Symmetry
          </option>
          <option
            value="Mobility Analysis"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Mobility Analysis
          </option>
          <option
            value="Body Composition"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Body Composition
          </option>
        </select>

        {/* Score Filter */}
        <select
          value={minScoreFilter}
          onChange={(e) => setMinScoreFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-emerald-500/60 dark:focus:border-[#ccf141]/60 cursor-pointer"
        >
          <option
            value="All"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            All Scores
          </option>
          <option
            value="85"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Score &ge; 85 (Excellent)
          </option>
          <option
            value="75"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Score &ge; 75 (Good)
          </option>
          <option
            value="60"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            Score &ge; 60 (Moderate)
          </option>
        </select>

        {/* Trainer Filter */}
        <select
          value={selectedTrainer}
          onChange={(e) => setSelectedTrainer(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-emerald-500/60 dark:focus:border-[#ccf141]/60 cursor-pointer"
        >
          <option
            value="All"
            className={
              isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
            }
          >
            All Trainers
          </option>
          {uniqueTrainers.map((tr) => (
            <option
              key={tr}
              value={tr}
              className={
                isDark ? "bg-[#111] text-white" : "bg-white text-slate-800"
              }
            >
              {tr}
            </option>
          ))}
        </select>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto custom-scrollbar rounded-xl border border-[var(--db-card-border)]">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[var(--db-input-bg)] text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] border-b border-[var(--db-card-border)]">
            <tr>
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5">Member</th>
              <th className="py-3 px-3.5">Analysis Type</th>
              <th className="py-3 px-3.5 text-center">Overall</th>
              <th className="py-3 px-3.5 text-center">Posture</th>
              <th className="py-3 px-3.5 text-center">Form</th>
              <th className="py-3 px-3.5">Issues Detected</th>
              <th className="py-3 px-3.5 text-center">Duration</th>
              <th className="py-3 px-3.5">Trainer</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--db-card-border)]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="py-8 text-center text-[var(--db-text-muted)] font-medium"
                >
                  No analysis records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const issuesCount = item.detectedIssues?.length || 0;
                return (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-[var(--db-input-bg)]/50 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3 px-3.5 font-mono text-[var(--db-text-muted)]">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Member */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 dark:bg-[#ccf141] text-emerald-700 dark:text-black font-black text-[10px] flex items-center justify-center">
                          {item.memberName?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--db-text-title)] leading-tight">
                            {item.memberName}
                          </p>
                          <span className="text-[9px] font-mono text-emerald-600 dark:text-[#ccf141]">
                            #{item.memberId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Analysis Type */}
                    <td className="py-3 px-3.5 font-bold text-[var(--db-text)]">
                      {item.analysisType}
                    </td>

                    {/* Overall Score */}
                    <td className="py-3 px-3.5 text-center font-mono font-black text-emerald-600 dark:text-[#ccf141]">
                      {item.overallScore}
                    </td>

                    {/* Posture Score */}
                    <td className="py-3 px-3.5 text-center font-mono text-[var(--db-text-muted)]">
                      {item.postureScore || "—"}
                    </td>

                    {/* Form Score */}
                    <td className="py-3 px-3.5 text-center font-mono text-[var(--db-text-muted)]">
                      {item.formScore ? `${item.formScore}%` : "—"}
                    </td>

                    {/* Issues Detected */}
                    <td className="py-3 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          issuesCount > 0
                            ? isDark
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                            : isDark
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {issuesCount > 0
                          ? `${issuesCount} Issues`
                          : "Optimal Form"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3.5 text-center font-mono text-[var(--db-text-muted)]">
                      {formatDuration(item.duration)}
                    </td>

                    {/* Trainer */}
                    <td className="py-3 px-3.5 text-[var(--db-text)] font-medium">
                      {item.trainerName || "Trainer"}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9.5px] font-bold">
                        {item.status || "Completed"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer shadow-sm ${
                            isDark
                              ? "bg-[#ccf141]/15 hover:bg-[#ccf141] text-[#ccf141] hover:text-black"
                              : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200"
                          }`}
                          title="View detailed report"
                        >
                          <Eye size={12} />
                          <span>View Report</span>
                        </button>

                        {onDeleteRecord && (
                          <button
                            onClick={() => onDeleteRecord(item._id || item.id)}
                            className="p-1.5 rounded-lg text-[var(--db-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete log"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisHistoryTable;
