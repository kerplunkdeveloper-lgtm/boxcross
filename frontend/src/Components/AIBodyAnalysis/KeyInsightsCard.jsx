import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const KeyInsightsCard = ({ metrics = {}, insights = [] }) => {
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
    <div
      className="p-5 rounded-2xl border shadow-xl flex flex-col justify-between"
      style={{
        background: "var(--db-card, #131d27)",
        borderColor: "var(--db-card-border, #1f2d3d)",
      }}
    >
      {/* Header */}
      <h3 className="text-sm font-bold text-white tracking-wide mb-3">
        Key Insights
      </h3>

      {/* Insights List matching mockup */}
      <div className="space-y-2.5 my-1">
        {items.map((item, idx) => {
          const isPos = item.type === "positive";
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-200">
              {isPos ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle size={11} className="text-amber-400" />
                </div>
              )}
              <span className="font-medium tracking-normal">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyInsightsCard;
