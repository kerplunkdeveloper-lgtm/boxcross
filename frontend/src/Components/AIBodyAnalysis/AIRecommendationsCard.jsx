import React from "react";
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AIRecommendationsCard = ({ recommendations = [], insights = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mockup exact 5 items with theme-friendly icons
  const items = [
    {
      icon: <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />,
      text: "Keep your back straight and maintain a neutral spine.",
    },
    {
      icon: <AlertTriangle size={15} className="text-amber-500 shrink-0" />,
      text: "Improve shoulder posture with upper back exercises.",
    },
    {
      icon: <Zap size={15} className="text-rose-500 shrink-0" />,
      text: "Strengthen your core for better stability.",
    },
    {
      icon: <ShieldAlert size={15} className="text-red-500 shrink-0" />,
      text: "Avoid forward head posture.",
    },
    {
      icon: <Activity size={15} className="text-emerald-500 shrink-0" />,
      text: "Practice mobility exercises for better flexibility.",
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between h-full flex-1 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500 fill-amber-500/20 shrink-0" />
          <span>AI Recommendations</span>
        </h3>
        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--db-text-muted)] uppercase tracking-wider">
          Action Plan
        </span>
      </div>

      {/* 5 Recommendation Items */}
      <div className="space-y-2 sm:space-y-2.5 my-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-xs text-[var(--db-text)] p-1 rounded-lg hover:bg-[var(--db-input-bg)] transition-colors"
          >
            {item.icon}
            <span className="font-medium tracking-normal text-[var(--db-text)]">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsCard;
