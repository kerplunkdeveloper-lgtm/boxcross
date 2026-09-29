import React from "react";
import { motion } from "framer-motion";

const AlignmentPanel = ({ metrics = {} }) => {
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
    <div
      className="p-5 rounded-2xl border shadow-xl flex flex-col justify-between"
      style={{
        background: "var(--db-card, #131d27)",
        borderColor: "var(--db-card-border, #1f2d3d)",
      }}
    >
      {/* Header */}
      <h3 className="text-sm font-bold text-white tracking-wide mb-3">
        Body Alignment
      </h3>

      {/* 7 Alignment Bars List */}
      <div className="space-y-2.5 my-1">
        {items.map((item) => {
          const isWarning = item.score < 80;
          const barColor = isWarning ? "bg-amber-400" : "bg-emerald-400";
          const textColor = isWarning ? "text-amber-400" : "text-emerald-400";

          return (
            <div key={item.key} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-gray-300 font-medium text-[11.5px] w-36 truncate">
                {item.label}
              </span>

              {/* Progress Track */}
              <div className="flex-1 h-2 bg-neutral-800/80 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>

              {/* Percentage */}
              <span className={`font-mono font-bold text-xs w-9 text-right ${textColor}`}>
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
