import React from "react";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const KeyInsightsCard = ({ metrics = {}, insights = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Compute real-time insight items based on live alignment data
  const headOk = (metrics.headPosition ?? 92) >= 80;
  const shoulderOk = (metrics.shoulderAlignment ?? 86) >= 80;
  const spineOk = (metrics.spineAlignment ?? 74) >= 80;
  const hipOk = (metrics.hipAlignment ?? 89) >= 80;
  const kneeOk = (metrics.kneeAlignment ?? 91) >= 80;

  const items = [
    {
      type: shoulderOk ? "positive" : "warning",
      text: shoulderOk ? "Good shoulder alignment" : "Level your shoulders horizontally",
    },
    {
      type: spineOk ? "positive" : "warning",
      text: spineOk ? "Spine curvature is optimal" : "Keep your spine straight",
    },
    {
      type: hipOk ? "positive" : "warning",
      text: hipOk ? "Hip position looks good" : "Correct pelvis and hip alignment",
    },
    {
      type: kneeOk ? "positive" : "warning",
      text: kneeOk ? "Knee alignment is correct" : "Keep knees aligned with toes",
    },
    {
      type: headOk ? "positive" : "warning",
      text: headOk ? "Maintain neutral head position" : "Avoid forward head tilt",
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between h-full flex-1 transition-colors duration-200">
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide mb-2 sm:mb-3 flex items-center gap-1.5">
        <Sparkles size={15} className="text-emerald-500 shrink-0" />
        <span>Key Insights</span>
      </h3>

      {/* Insights List */}
      <div className="space-y-2 sm:space-y-2.5 my-1">
        {items.map((item, idx) => {
          const isPos = item.type === "positive";
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs text-[var(--db-text)] p-1 rounded-lg hover:bg-[var(--db-input-bg)] transition-colors"
            >
              {isPos ? (
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              ) : (
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <AlertTriangle size={11} />
                </div>
              )}
              <span className="font-medium tracking-normal text-[var(--db-text)]">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyInsightsCard;
