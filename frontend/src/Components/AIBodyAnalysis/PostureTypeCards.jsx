import React from "react";
import { CheckCircle2, Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const PostureTypeCards = ({ detectedType = "Good Posture" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Determine active posture type
  const isGood = !detectedType || detectedType.toLowerCase().includes("good");
  const isForwardHead = detectedType?.toLowerCase().includes("forward");
  const isRounded = detectedType?.toLowerCase().includes("round") || detectedType?.toLowerCase().includes("kyphosis");

  const cards = [
    {
      id: "good",
      title: "Good Posture",
      active: isGood || (!isForwardHead && !isRounded),
      color: "emerald",
      svg: (
        <svg viewBox="0 0 40 80" className="w-9 h-16 mx-auto" fill="none" stroke="currentColor">
          {/* Head & Spine in ideal alignment */}
          <circle cx="20" cy="11" r="5" strokeWidth="1.8" />
          <path d="M 20 16 L 20 46" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 20 22 L 14 36" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20 22 L 26 36" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20 46 L 16 72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 20 46 L 24 72" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "forward_head",
      title: "Forward Head",
      active: isForwardHead,
      color: "red",
      svg: (
        <svg viewBox="0 0 40 80" className="w-9 h-16 mx-auto" fill="none" stroke="currentColor">
          {/* Head forward curve */}
          <circle cx="26" cy="13" r="5" strokeWidth="1.8" />
          <path d="M 23 18 Q 18 24 19 46" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 19 25 L 12 37" strokeWidth="2" strokeLinecap="round" />
          <path d="M 19 25 L 26 37" strokeWidth="2" strokeLinecap="round" />
          <path d="M 19 46 L 15 72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 19 46 L 23 72" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "rounded_shoulder",
      title: "Rounded Shoulder",
      active: isRounded,
      color: "red",
      svg: (
        <svg viewBox="0 0 40 80" className="w-9 h-16 mx-auto" fill="none" stroke="currentColor">
          {/* Hunched thoracic spine */}
          <circle cx="22" cy="12" r="5" strokeWidth="1.8" />
          <path d="M 20 17 Q 13 28 18 46" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 16 26 L 10 38" strokeWidth="2" strokeLinecap="round" />
          <path d="M 16 26 L 24 38" strokeWidth="2" strokeLinecap="round" />
          <path d="M 18 46 L 14 72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 18 46 L 22 72" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between h-full flex-1 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-1.5">
          <Activity size={15} className="text-emerald-500 shrink-0" />
          <span>Posture Type</span>
        </h3>
        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--db-text-muted)] uppercase tracking-wider">
          Classification
        </span>
      </div>

      {/* 3 Silhouette Cards Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 my-1">
        {cards.map((c) => {
          const isAct = c.active;
          const isEmerald = c.color === "emerald" || isAct;

          let cardClasses = "";
          if (isAct && isEmerald) {
            cardClasses = isDark
              ? "bg-emerald-950/25 border-2 border-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.25)]"
              : "bg-emerald-50/90 border-2 border-emerald-500 shadow-sm";
          } else if (isAct && !isEmerald) {
            cardClasses = isDark
              ? "bg-rose-950/25 border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
              : "bg-rose-50/90 border-2 border-rose-500 shadow-sm";
          } else {
            cardClasses = isDark
              ? "bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700"
              : "bg-slate-50 border border-slate-200 hover:border-slate-300";
          }

          return (
            <div
              key={c.id}
              className={`relative rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-between transition-all duration-300 ${cardClasses}`}
            >
              {/* Checkmark icon for active good posture */}
              {isAct && isEmerald && (
                <div className="absolute top-1.5 right-1.5 text-emerald-500">
                  <CheckCircle2 size={13} className="fill-emerald-500/20" />
                </div>
              )}

              {/* Silhouette Vector */}
              <div
                className={`my-1 ${
                  isAct
                    ? isEmerald
                      ? "text-emerald-500"
                      : "text-rose-500"
                    : c.color === "red"
                    ? "text-rose-400/60"
                    : "text-slate-400 dark:text-neutral-500"
                }`}
              >
                {c.svg}
              </div>

              {/* Title */}
              <span
                className={`text-[9.5px] sm:text-[10.5px] text-center tracking-tight truncate w-full ${
                  isAct && isEmerald
                    ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                    : isAct && !isEmerald
                    ? "text-rose-600 dark:text-rose-400 font-extrabold"
                    : "text-[var(--db-text-muted)] font-semibold"
                }`}
              >
                {c.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostureTypeCards;
