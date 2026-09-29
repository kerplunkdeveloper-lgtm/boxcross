import React from "react";
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Activity,
} from "lucide-react";

const AIRecommendationsCard = ({ recommendations = [], insights = [] }) => {
  // Mockup exact 5 items
  const items = [
    {
      icon: <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />,
      text: "Keep your back straight and maintain a neutral spine.",
    },
    {
      icon: <AlertTriangle size={15} className="text-amber-400 shrink-0" />,
      text: "Improve shoulder posture with upper back exercises.",
    },
    {
      icon: <Zap size={15} className="text-rose-400 shrink-0" />,
      text: "Strengthen your core for better stability.",
    },
    {
      icon: <ShieldAlert size={15} className="text-red-400 shrink-0" />,
      text: "Avoid forward head posture.",
    },
    {
      icon: <Activity size={15} className="text-emerald-400 shrink-0" />,
      text: "Practice mobility exercises for better flexibility.",
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
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-amber-400 fill-amber-400/20" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          AI Recommendations
        </h3>
      </div>

      {/* 5 Recommendation Items */}
      <div className="space-y-2.5 my-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-200">
            {item.icon}
            <span className="font-medium tracking-normal">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsCard;
