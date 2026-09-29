import React from "react";
import { Scale, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const BodySymmetryCard = ({ symmetry = {} }) => {
  const items = [
    {
      name: "Shoulder Symmetry",
      leftLabel: "Left Shoulder",
      rightLabel: "Right Shoulder",
      score: symmetry.shoulderSymmetry ?? 92,
    },
    {
      name: "Hip Symmetry",
      leftLabel: "Left Hip",
      rightLabel: "Right Hip",
      score: symmetry.hipSymmetry ?? 88,
    },
    {
      name: "Knee Symmetry",
      leftLabel: "Left Knee",
      rightLabel: "Right Knee",
      score: symmetry.kneeSymmetry ?? 94,
    },
    {
      name: "Ankle Symmetry",
      leftLabel: "Left Ankle",
      rightLabel: "Right Ankle",
      score: symmetry.ankleSymmetry ?? 90,
    },
  ];

  const avgSym = Math.round(
    items.reduce((acc, curr) => acc + curr.score, 0) / items.length,
  );

  return (
    <div className="p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--db-card-border)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
            <Scale size={12} className="text-[#ccf141]" />
            Bilateral Balance Matrix
          </span>
          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)] mt-0.5">
            Body Symmetry Analysis
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/25 text-[#ccf141] text-xs font-mono font-bold">
          <span>{avgSym}% Overall</span>
        </div>
      </div>

      {/* Symmetry Rows */}
      <div className="space-y-4 my-2">
        {items.map((item) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--db-text)]">
                {item.name}
              </span>
              <span className="font-mono font-black text-[#ccf141]">
                {item.score}%
              </span>
            </div>

            {/* Split Bilateral Dual Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] font-bold text-gray-400 w-16 text-right">
                Left
              </span>
              <div className="flex-grow h-2.5 bg-white/5 rounded-full overflow-hidden flex border border-white/5 p-0.5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className="text-[9.5px] font-bold text-gray-400 w-16">
                Right
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[var(--db-card-border)] flex items-center justify-between text-[10px] text-[var(--db-text-muted)]">
        <span>Evaluates coronal plane weight distribution</span>
        <span className="text-emerald-400 font-bold">
          High Bilateral Harmony
        </span>
      </div>
    </div>
  );
};

export default BodySymmetryCard;
