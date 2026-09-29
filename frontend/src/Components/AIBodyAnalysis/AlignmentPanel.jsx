import React from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AlignmentPanel = ({ metrics = {} }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const items = [
    { label: "Head Position", score: metrics.headPosition ?? 92, key: "headPosition" },
    { label: "Shoulder Alignment", score: metrics.shoulderAlignment ?? 86, key: "shoulderAlignment" },
    { label: "Spine Alignment", score: metrics.spineAlignment ?? 74, key: "spineAlignment" },
    { label: "Hip Alignment", score: metrics.hipAlignment ?? 89, key: "hipAlignment" },
    { label: "Knee Alignment", score: metrics.kneeAlignment ?? 91, key: "kneeAlignment" },
    { label: "Ankle Alignment", score: metrics.ankleAlignment ?? 88, key: "ankleAlignment" },
    { label: "Body Symmetry", score: metrics.bodySymmetry ?? 82, key: "bodySymmetry" },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between h-full flex-1 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-1.5">
          <Sliders size={15} className="text-emerald-500 shrink-0" />
          <span>Body Alignment</span>
        </h3>
        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--db-text-muted)] uppercase tracking-wider">
          Kinematic Precision
        </span>
      </div>

      {/* 7 Alignment Bars List */}
      <div className="space-y-2 sm:space-y-2.5 my-1">
        {items.map((item) => {
          const isWarning = item.score < 80;
          const barColor = isWarning
            ? "bg-amber-500 dark:bg-amber-400"
            : "bg-emerald-500 dark:bg-emerald-400";
          const textColor = isWarning
            ? "text-amber-600 dark:text-amber-400"
            : "text-emerald-600 dark:text-emerald-400";

          return (
            <div key={item.key} className="flex items-center justify-between gap-2 sm:gap-3 text-xs">
              <span className="text-[var(--db-text)] font-semibold text-[11px] sm:text-[11.5px] w-28 sm:w-32 md:w-36 truncate shrink-0">
                {item.label}
              </span>

              {/* Progress Track */}
              <div className="flex-1 h-2 bg-slate-100 dark:bg-neutral-800/80 border border-slate-200/50 dark:border-neutral-700/40 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>

              {/* Percentage */}
              <span className={`font-mono font-bold text-[11px] sm:text-xs w-9 sm:w-10 text-right shrink-0 ${textColor}`}>
                {item.score}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlignmentPanel;
