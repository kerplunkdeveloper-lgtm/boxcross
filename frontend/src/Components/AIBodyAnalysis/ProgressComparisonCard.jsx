import React from "react";
import { TrendingUp, ArrowUpRight, History, Calendar, CheckCircle } from "lucide-react";

const ProgressComparisonCard = ({
  previousScore = 72,
  currentScore = 86,
  metrics = {},
}) => {
  const diffOverall = currentScore - previousScore;

  const comparisonRows = [
    {
      name: "Shoulder Alignment",
      prev: 78,
      curr: metrics.shoulderAlignment || 86,
      change: (metrics.shoulderAlignment || 86) - 78,
    },
    {
      name: "Spine Alignment",
      prev: 62,
      curr: metrics.spineAlignment || 74,
      change: (metrics.spineAlignment || 74) - 62,
    },
    {
      name: "Hip Alignment",
      prev: 80,
      curr: metrics.hipAlignment || 89,
      change: (metrics.hipAlignment || 89) - 80,
    },
    {
      name: "Symmetry",
      prev: 76,
      curr: metrics.bodySymmetry || 82,
      change: (metrics.bodySymmetry || 82) - 76,
    },
    {
      name: "Overall Posture",
      prev: previousScore,
      curr: currentScore,
      change: diffOverall,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--db-card-border)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
            <History size={12} className="text-[#e5ff00]" />
            Longitudinal Tracking
          </span>
          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)] mt-0.5">
            Progress Comparison (Before vs After)
          </h3>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ArrowUpRight size={14} />
          <span>+{diffOverall} Points Improvement</span>
        </div>
      </div>

      {/* Main Score Comparison Badges */}
      <div className="grid grid-cols-3 gap-2.5 my-2">
        <div className="p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
            Previous Analysis
          </span>
          <p className="text-xl font-black font-mono text-gray-300 mt-1">
            {previousScore} <span className="text-[10px] text-gray-500">/ 100</span>
          </p>
          <span className="text-[8.5px] text-gray-500 font-bold">14 Days Ago</span>
        </div>

        <div className="p-3 rounded-xl bg-[#e5ff00]/10 border border-[#e5ff00]/30 text-center shadow-[0_0_15px_rgba(229,255,0,0.1)]">
          <span className="text-[9px] font-black uppercase text-[#e5ff00] tracking-wider">
            Current Analysis
          </span>
          <p className="text-xl font-black font-mono text-white mt-1">
            {currentScore} <span className="text-[10px] text-gray-400">/ 100</span>
          </p>
          <span className="text-[8.5px] text-[#e5ff00] font-bold">Today</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
            Total Gain
          </span>
          <p className="text-xl font-black font-mono text-emerald-400 mt-1">
            +{diffOverall} <span className="text-[10px] text-emerald-500/80">PTS</span>
          </p>
          <span className="text-[8.5px] text-emerald-400 font-bold">+{( (diffOverall / previousScore) * 100 ).toFixed(0)}% Growth</span>
        </div>
      </div>

      {/* Metrics Delta Breakdown Table */}
      <div className="mt-3 space-y-2">
        {comparisonRows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between p-2 rounded-lg bg-[var(--db-input-bg)] border border-white/5 text-xs"
          >
            <span className="font-bold text-[var(--db-text)]">{row.name}</span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-gray-400">{row.prev}%</span>
              <span className="text-gray-600">→</span>
              <span className="text-white font-bold">{row.curr}%</span>
              <span
                className={`text-[11px] font-black px-1.5 py-0.5 rounded ${
                  row.change >= 0
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                }`}
              >
                {row.change >= 0 ? `+${row.change}%` : `${row.change}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressComparisonCard;
