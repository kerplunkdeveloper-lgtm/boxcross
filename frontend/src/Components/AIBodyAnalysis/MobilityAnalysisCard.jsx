import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

const MobilityAnalysisCard = ({ mobility = {} }) => {
  const items = [
    {
      name: "Shoulder Mobility",
      status: mobility.shoulderMobility || "Good",
      desc: "Thoracic extension & glenohumeral reach",
    },
    {
      name: "Hip Mobility",
      status: mobility.hipMobility || "Moderate",
      desc: "Acetabulofemoral internal/external rotation",
    },
    {
      name: "Knee Mobility",
      status: mobility.kneeMobility || "Good",
      desc: "Tibiofemoral flexion under squat load",
    },
    {
      name: "Ankle Mobility",
      status: mobility.ankleMobility || "Needs Attention",
      desc: "Talocrural dorsiflexion angle depth",
    },
    {
      name: "Trunk Mobility",
      status: mobility.trunkMobility || "Good",
      desc: "Spinal rotation and anti-lateral flexion",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Needs Attention":
        return {
          icon: AlertCircle,
          badge: "bg-red-500/10 text-red-400 border-red-500/25",
        };
      case "Moderate":
        return {
          icon: AlertTriangle,
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/25",
        };
      case "Good":
      default:
        return {
          icon: CheckCircle2,
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
        };
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--db-card-border)]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
            <Activity size={12} className="text-[#ccf141]" />
            Joint Range of Motion
          </span>
          <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)] mt-0.5">
            Mobility Analysis
          </h3>
        </div>
        <span className="text-[10px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
          5 Functional Gates
        </span>
      </div>

      {/* Grid of mobility items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-2">
        {items.map((item) => {
          const cfg = getStatusBadge(item.status);
          const IconComponent = cfg.icon;

          return (
            <div
              key={item.name}
              className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-white">
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div
                className={`mt-3 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg border text-[10.5px] font-black tracking-wide ${cfg.badge}`}
              >
                <IconComponent size={12} />
                <span>{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[var(--db-card-border)] flex items-center justify-between text-[10px] text-[var(--db-text-muted)]">
        <span>Evaluated from multi-angle kinematic joint limits</span>
        <span className="text-[#ccf141] font-bold">Dynamic ROM Rating</span>
      </div>
    </div>
  );
};

export default MobilityAnalysisCard;
