import React from "react";
import { Signal, TrendingUp, Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const PostureScoreCard = ({
  score = 86,
  status = "Good Posture",
  improvement = "+14",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Circular gauge calculations
  const size = 120;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Status color config
  const getStatusConfig = () => {
    if (score >= 80) {
      return {
        label: "Good Posture",
        stroke: "#22c55e",
        pillBg: isDark ? "bg-emerald-500/15 border-emerald-500/30" : "bg-emerald-50 border-emerald-200",
        pillText: isDark ? "text-emerald-400" : "text-emerald-700",
        glow: isDark ? "rgba(34, 197, 94, 0.4)" : "rgba(34, 197, 94, 0.15)",
      };
    }
    if (score >= 60) {
      return {
        label: "Moderate Posture",
        stroke: "#eab308",
        pillBg: isDark ? "bg-yellow-500/15 border-yellow-500/30" : "bg-amber-50 border-amber-200",
        pillText: isDark ? "text-yellow-400" : "text-amber-700",
        glow: isDark ? "rgba(234, 179, 8, 0.4)" : "rgba(234, 179, 8, 0.15)",
      };
    }
    return {
      label: "Needs Improvement",
      stroke: "#ef4444",
      pillBg: isDark ? "bg-red-500/15 border-red-500/30" : "bg-rose-50 border-rose-200",
      pillText: isDark ? "text-red-400" : "text-rose-700",
      glow: isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.15)",
    };
  };

  const config = getStatusConfig();

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between relative overflow-hidden h-full flex-1 transition-colors duration-200">
      {/* Card Title */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-1.5">
          <Activity size={15} className="text-emerald-500 shrink-0" />
          <span className="truncate">Overall Posture Score</span>
        </h3>
        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono shrink-0">
          <TrendingUp size={11} />
          {improvement}
        </span>
      </div>

      {/* Main Content: Ring Gauge + Spine Profile Silhouette */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 py-1">
        {/* Left: Circular Animated Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-[102px] h-[102px] sm:w-[114px] sm:h-[114px] md:w-[120px] md:h-[120px] transform -rotate-90"
          >
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Score Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={config.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s",
                filter: `drop-shadow(0 0 8px ${config.glow})`,
              }}
            />
          </svg>

          {/* Center Score Numbers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl font-black text-[var(--db-text-title)] font-mono leading-none tracking-tight">
              {score}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--db-text-muted)] mt-1">
              /100
            </span>
          </div>
        </div>

        {/* Right: Human Spine Wireframe Vector Silhouette */}
        <div className="flex-1 flex justify-center items-center relative h-28 sm:h-32 min-w-0">
          <svg
            viewBox="0 0 80 160"
            className="h-full w-auto max-w-full text-emerald-500"
            fill="none"
            stroke="currentColor"
          >
            {/* Soft background glow */}
            <defs>
              <filter id="spineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dotted Vertical Reference Plumbline */}
            <line
              x1="40"
              y1="8"
              x2="40"
              y2="152"
              stroke={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(15, 23, 42, 0.2)"}
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Human Side Profile Outline */}
            <path
              d="M 37 14 C 40 10 46 12 47 18 C 47 22 45 25 43 28 C 47 34 50 44 49 56 C 47 70 41 84 43 96 C 45 106 48 118 47 132 C 46 142 42 152 40 154"
              stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.3)"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Head node */}
            <circle
              cx="43"
              cy="18"
              r="4.5"
              stroke={isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)"}
              strokeWidth="1"
              fill={isDark ? "rgba(255,255,255,0.05)" : "rgba(15, 23, 42, 0.04)"}
            />
            <circle cx="43" cy="18" r="1.5" fill="#22c55e" />

            {/* Glowing S-Curve Vertebral Spine Column */}
            <path
              d="M 40 28 Q 42 38 41 48 Q 38 64 39 80 Q 42 96 41 112 Q 39 126 40 142"
              stroke="#22c55e"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="url(#spineGlow)"
            />

            {/* Vertebral Alignment Nodes */}
            <circle cx="41" cy="34" r="2.2" fill="#22c55e" />
            <circle cx="40" cy="52" r="2.2" fill="#22c55e" />
            <circle cx="39" cy="72" r="2.2" fill="#22c55e" />
            <circle cx="41" cy="94" r="2.2" fill="#22c55e" />
            <circle cx="40" cy="116" r="2.2" fill="#22c55e" />
            <circle cx="40" cy="138" r="2.2" fill="#22c55e" />

            {/* Alignment Chevrons */}
            <path d="M 28 72 L 32 72" stroke="#22c55e" strokeWidth="1" />
            <path d="M 46 72 L 50 72" stroke="#22c55e" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Bottom Status Pill Badge */}
      <div className="mt-3 pt-2.5 border-t border-[var(--db-card-border)] flex items-center">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.pillBg} ${config.pillText}`}
        >
          <Signal size={13} />
          <span>{status || config.label}</span>
        </div>
      </div>
    </div>
  );
};

export default PostureScoreCard;
