import React from "react";
import { Signal, TrendingUp } from "lucide-react";

const PostureScoreCard = ({
  score = 86,
  status = "Good Posture",
  improvement = "+14",
}) => {
  // Circular gauge calculations
  const size = 130;
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
        pillBg: "bg-emerald-500/15 border-emerald-500/30",
        pillText: "text-emerald-400",
        glow: "rgba(34, 197, 94, 0.4)",
      };
    }
    if (score >= 60) {
      return {
        label: "Moderate Posture",
        stroke: "#eab308",
        pillBg: "bg-yellow-500/15 border-yellow-500/30",
        pillText: "text-yellow-400",
        glow: "rgba(234, 179, 8, 0.4)",
      };
    }
    return {
      label: "Needs Improvement",
      stroke: "#ef4444",
      pillBg: "bg-red-500/15 border-red-500/30",
      pillText: "text-red-400",
      glow: "rgba(239, 68, 68, 0.4)",
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className="p-5 rounded-2xl border shadow-xl flex flex-col justify-between relative overflow-hidden"
      style={{
        background: "var(--db-card, #131d27)",
        borderColor: "var(--db-card-border, #1f2d3d)",
      }}
    >
      {/* Card Title */}
      <h3 className="text-sm font-bold text-white tracking-wide mb-3">
        Overall Posture Score
      </h3>

      {/* Main Content: Ring Gauge + Spine Profile Silhouette */}
      <div className="flex items-center justify-between gap-4 py-1">
        {/* Left: Circular Animated Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
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
            <span className="text-3xl font-black text-white font-mono leading-none tracking-tight">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-gray-400 mt-1">
              /100
            </span>
          </div>
        </div>

        {/* Right: Human Spine Wireframe Vector Silhouette */}
        <div className="flex-1 flex justify-center items-center relative h-32">
          <svg
            viewBox="0 0 80 160"
            className="h-full w-auto text-emerald-400"
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
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Human Side Profile Outline (Subtle Grey) */}
            <path
              d="M 37 14 C 40 10 46 12 47 18 C 47 22 45 25 43 28 C 47 34 50 44 49 56 C 47 70 41 84 43 96 C 45 106 48 118 47 132 C 46 142 42 152 40 154"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Head node */}
            <circle cx="43" cy="18" r="4.5" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
            <circle cx="43" cy="18" r="1.5" fill="#22c55e" />

            {/* Glowing S-Curve Vertebral Spine Column */}
            <path
              d="M 40 28 Q 42 38 41 48 Q 38 64 39 80 Q 42 96 41 112 Q 39 126 40 142"
              stroke="#22c55e"
              strokeWidth="2"
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

            {/* Subtle Alignment Chevron / Arrows */}
            <path d="M 28 72 L 32 72" stroke="#22c55e" strokeWidth="1" />
            <path d="M 46 72 L 50 72" stroke="#22c55e" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Bottom Status Pill Badge */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center">
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
