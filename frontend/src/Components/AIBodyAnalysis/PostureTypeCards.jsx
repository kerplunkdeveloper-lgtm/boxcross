import React from "react";
import { CheckCircle2 } from "lucide-react";

const PostureTypeCards = ({ detectedType = "Good Posture" }) => {
  // Determine active posture type
  const isGood = !detectedType || detectedType.toLowerCase().includes("good");
  const isForwardHead = detectedType?.toLowerCase().includes("forward");
  const isRounded = detectedType?.toLowerCase().includes("round") || detectedType?.toLowerCase().includes("kyphosis");

  const cards = [
    {
      id: "good",
      title: "Good",
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
    <div
      className="p-5 rounded-2xl border shadow-xl flex flex-col justify-between"
      style={{
        background: "var(--db-card, #131d27)",
        borderColor: "var(--db-card-border, #1f2d3d)",
      }}
    >
      {/* Header */}
      <h3 className="text-sm font-bold text-white tracking-wide mb-3">
        Posture Type
      </h3>

      {/* 3 Silhouette Cards Row */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        {cards.map((c) => {
          const isAct = c.active;
          const isEmerald = c.color === "emerald" || isAct;

          return (
            <div
              key={c.id}
              className={`relative rounded-xl p-2.5 flex flex-col items-center justify-between transition-all duration-300 ${
                isAct
                  ? "bg-emerald-950/20 border-2 border-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                  : "bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700"
              }`}
            >
              {/* Checkmark icon for active good posture */}
              {isAct && isEmerald && (
                <div className="absolute top-1.5 right-1.5 text-emerald-400">
                  <CheckCircle2 size={13} className="fill-emerald-500/20" />
                </div>
              )}

              {/* Silhouette Vector */}
              <div
                className={`my-1 ${
                  isAct
                    ? isEmerald
                      ? "text-emerald-400"
                      : "text-red-400"
                    : c.color === "red"
                    ? "text-red-500/60"
                    : "text-gray-500"
                }`}
              >
                {c.svg}
              </div>

              {/* Title */}
              <span
                className={`text-[10.5px] font-bold text-center tracking-tight truncate w-full ${
                  isAct && isEmerald
                    ? "text-emerald-400 font-black"
                    : isAct && !isEmerald
                    ? "text-red-400 font-black"
                    : "text-gray-400"
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
