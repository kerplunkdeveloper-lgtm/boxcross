import React from "react";
import { CheckCircle2 } from "lucide-react";

const PostureComparisonCard = ({
  currentScore = 86,
  detectedIssues = [],
  alignmentMetrics = {},
}) => {
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
        Posture Comparison
      </h3>

      {/* 3 Visual Cards Row */}
      <div className="grid grid-cols-3 gap-3 my-1">
        {/* Card 1: Current Posture */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden relative flex items-center justify-center group shadow-md">
            {/* Gym Silhouette Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/80 via-neutral-900/90 to-black" />

            {/* Athlete Side Vector with Plumbline */}
            <svg viewBox="0 0 100 140" className="w-full h-full relative z-10 p-2" fill="none">
              {/* Vertical White Dashed Plumbline */}
              <line
                x1="46"
                y1="12"
                x2="46"
                y2="132"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Athlete Side Silhouette */}
              <path
                d="M 44 22 C 48 18 53 19 54 26 C 54 30 51 33 49 36 C 53 42 56 50 55 62 C 54 74 48 84 50 96 C 51 106 54 116 53 126 L 47 126"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Green Joint Circles */}
              <circle cx="48" cy="24" r="3" fill="#22c55e" />
              <circle cx="46" cy="38" r="2.8" fill="#22c55e" />
              <circle cx="49" cy="62" r="2.8" fill="#22c55e" />
              <circle cx="48" cy="94" r="3" fill="#22c55e" />
              <circle cx="47" cy="124" r="2.8" fill="#22c55e" />

              {/* Connecting Bone Line */}
              <path
                d="M 48 24 L 46 38 L 49 62 L 48 94 L 47 124"
                stroke="#22c55e"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-gray-300 mt-2 text-center">
            Current Posture
          </span>
        </div>

        {/* Card 2: Ideal Posture */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-xl bg-neutral-900 border border-emerald-500/30 overflow-hidden relative flex items-center justify-center group shadow-md">
            {/* Ambient subtle green glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/80 via-neutral-900/90 to-black" />

            {/* Green Checkmark Badge in Top-Right */}
            <div className="absolute top-1.5 right-1.5 z-20 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.6)]">
              <CheckCircle2 size={12} className="stroke-[3] text-black" />
            </div>

            {/* Ideal Athlete Side Vector with Plumbline */}
            <svg viewBox="0 0 100 140" className="w-full h-full relative z-10 p-2" fill="none">
              {/* Vertical Reference Plumbline */}
              <line
                x1="50"
                y1="12"
                x2="50"
                y2="132"
                stroke="#22c55e"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Ideal Neutral Standing Silhouette */}
              <path
                d="M 48 22 C 51 18 56 19 57 25 C 57 29 54 32 52 35 C 55 42 57 52 56 64 C 55 76 50 86 52 98 C 53 108 55 118 54 126 L 48 126"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Green Joint Circles */}
              <circle cx="50" cy="24" r="3" fill="#22c55e" />
              <circle cx="50" cy="38" r="2.8" fill="#22c55e" />
              <circle cx="51" cy="64" r="2.8" fill="#22c55e" />
              <circle cx="50" cy="96" r="3" fill="#22c55e" />
              <circle cx="50" cy="124" r="2.8" fill="#22c55e" />

              {/* Connecting Bone Line */}
              <path
                d="M 50 24 L 50 38 L 51 64 L 50 96 L 50 124"
                stroke="#22c55e"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 mt-2 text-center">
            Ideal Posture
          </span>
        </div>

        {/* Card 3: Detected Issues */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden relative flex items-center justify-center group shadow-md">
            {/* Gym Silhouette Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/80 via-neutral-900/90 to-black" />

            {/* Athlete Side Vector with Heatmap Warning Nodes */}
            <svg viewBox="0 0 100 140" className="w-full h-full relative z-10 p-2" fill="none">
              {/* Dashed Plumbline */}
              <line
                x1="46"
                y1="12"
                x2="46"
                y2="132"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Slouched Body Path */}
              <path
                d="M 44 22 C 50 18 56 20 56 28 C 56 32 52 35 48 37 C 50 44 51 54 50 64 C 48 76 43 86 46 98 C 48 108 51 118 49 126"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Highlighted Yellow/Orange/Red Heatmap Issue Nodes */}
              {/* Cervical Forward Head Warning */}
              <circle cx="52" cy="27" r="5" fill="rgba(239, 68, 68, 0.35)" />
              <circle cx="52" cy="27" r="2.8" fill="#ef4444" />

              {/* Thoracic Curvature Warning */}
              <circle cx="48" cy="48" r="5" fill="rgba(245, 158, 11, 0.35)" />
              <circle cx="48" cy="48" r="2.8" fill="#f59e0b" />

              {/* Pelvis Tilt Node */}
              <circle cx="49" cy="68" r="2.8" fill="#22c55e" />

              {/* Knee Offset Warning */}
              <circle cx="46" cy="98" r="5" fill="rgba(245, 158, 11, 0.35)" />
              <circle cx="46" cy="98" r="2.8" fill="#f59e0b" />

              {/* Ankle Node */}
              <circle cx="47" cy="124" r="2.8" fill="#22c55e" />

              {/* Connecting Bone Line with color shifts */}
              <path d="M 52 27 L 48 48" stroke="#ef4444" strokeWidth="1.8" />
              <path d="M 48 48 L 49 68" stroke="#f59e0b" strokeWidth="1.8" />
              <path d="M 49 68 L 46 98" stroke="#f59e0b" strokeWidth="1.8" />
              <path d="M 46 98 L 47 124" stroke="#22c55e" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-amber-400 mt-2 text-center">
            Detected Issues
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostureComparisonCard;
