import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
} from "lucide-react";

const AnalysisHistoryTable = ({
  history = [],
  onViewReport,
  onDeleteRecord,
  selectedMemberId,
}) => {
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
    new Set(history.map((h) => h.trainerName).filter(Boolean))
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
    <div className="p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--db-card-border)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
            <FileText size={12} className="text-[#e5ff00]" />
            Session Archives
          </span>
          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)] mt-0.5">
            Member Analysis History
          </h3>
        </div>

        <div className="text-xs font-bold text-gray-400">
          Total Logs: <span className="font-mono text-white">{filteredRecords.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search member, ID, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#e5ff00]/60 transition-all"
          />
        </div>

        {/* Exercise Filter */}
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#e5ff00]/60 cursor-pointer"
        >
          <option value="All">All Analysis Types</option>
          <option value="Posture Analysis">Posture Analysis</option>
          <option value="Squat Analysis">Squat Analysis</option>
          <option value="Push-Up Analysis">Push-Up Analysis</option>
          <option value="Deadlift Analysis">Deadlift Analysis</option>
          <option value="Plank Analysis">Plank Analysis</option>
          <option value="Lunge Analysis">Lunge Analysis</option>
          <option value="Movement Tracking">Movement Tracking</option>
          <option value="Body Symmetry">Body Symmetry</option>
          <option value="Mobility Analysis">Mobility Analysis</option>
          <option value="Body Composition">Body Composition</option>
        </select>

        {/* Score Filter */}
        <select
          value={minScoreFilter}
          onChange={(e) => setMinScoreFilter(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#e5ff00]/60 cursor-pointer"
        >
          <option value="All">All Scores</option>
          <option value="85">Score &ge; 85 (Excellent)</option>
          <option value="75">Score &ge; 75 (Good)</option>
          <option value="60">Score &ge; 60 (Moderate)</option>
        </select>

        {/* Trainer Filter */}
        <select
          value={selectedTrainer}
          onChange={(e) => setSelectedTrainer(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#e5ff00]/60 cursor-pointer"
        >
          <option value="All">All Trainers</option>
          {uniqueTrainers.map((tr) => (
            <option key={tr} value={tr}>
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
                <td colSpan="11" className="py-8 text-center text-gray-500 font-medium">
                  No analysis records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const issuesCount = item.detectedIssues?.length || 0;
                return (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3 px-3.5 font-mono text-gray-300">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Member */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#e5ff00] text-black font-black text-[10px] flex items-center justify-center">
                          {item.memberName?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">
                            {item.memberName}
                          </p>
                          <span className="text-[9px] font-mono text-[#e5ff00]">
                            #{item.memberId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Analysis Type */}
                    <td className="py-3 px-3.5 font-bold text-gray-200">
                      {item.analysisType}
                    </td>

                    {/* Overall Score */}
                    <td className="py-3 px-3.5 text-center font-mono font-black text-[#e5ff00]">
                      {item.overallScore}
                    </td>

                    {/* Posture Score */}
                    <td className="py-3 px-3.5 text-center font-mono text-gray-300">
                      {item.postureScore || "—"}
                    </td>

                    {/* Form Score */}
                    <td className="py-3 px-3.5 text-center font-mono text-gray-300">
                      {item.formScore ? `${item.formScore}%` : "—"}
                    </td>

                    {/* Issues Detected */}
                    <td className="py-3 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          issuesCount > 0
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                            : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                        }`}
                      >
                        {issuesCount > 0 ? `${issuesCount} Issues` : "Optimal Form"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3.5 text-center font-mono text-gray-400">
                      {formatDuration(item.duration)}
                    </td>

                    {/* Trainer */}
                    <td className="py-3 px-3.5 text-gray-300 font-medium">
                      {item.trainerName || "Trainer"}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9.5px] font-bold">
                        {item.status || "Completed"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e5ff00]/15 hover:bg-[#e5ff00] text-[#e5ff00] hover:text-black font-bold text-[10.5px] transition-all cursor-pointer"
                          title="View detailed report"
                        >
                          <Eye size={12} />
                          <span>View Report</span>
                        </button>

                        {onDeleteRecord && (
                          <button
                            onClick={() => onDeleteRecord(item._id || item.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
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
