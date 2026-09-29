import React from "react";
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Gauge,
  Flame,
  Clock,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

const ExerciseStatsCard = ({
  stats = {},
  currentMode = "Squat Analysis",
  onResetReps,
}) => {
  const reps = stats.reps ?? 18;
  const correctReps = stats.correctReps ?? 15;
  const incorrectReps = stats.incorrectReps ?? 3;
  const accuracy = stats.accuracy ?? (reps > 0 ? Math.round((correctReps / reps) * 100) : 83);
  const formScore = stats.formScore ?? 84;
  const depth = stats.depth ?? 92;
  const kneeAngle = stats.kneeAngle ?? 94;
  const hipAngle = stats.hipAngle ?? 82;
  const backAngle = stats.backAngle ?? 86;
  const tempo = stats.tempo ?? 2.4;
  const stability = stats.stability ?? 88;
  const liveFeedback = stats.liveFeedback || [
    { type: "positive", text: "Good squat depth" },
    { type: "warning", text: "Keep knees aligned with toes" },
    { type: "positive", text: "Maintain neutral spine" },
  ];

  return (
    <div className="p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Glow behind counter */}
      <div className="pointer-events-none absolute top-4 right-4 w-32 h-32 bg-[#e5ff00]/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--db-card-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#e5ff00]/15 text-[#e5ff00] flex items-center justify-center">
            <Dumbbell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[var(--db-text-title)]">
              {currentMode}
            </h3>
            <span className="text-[10px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
              Real-Time Repetition & Form Engine
            </span>
          </div>
        </div>

        {onResetReps && (
          <button
            onClick={onResetReps}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition-all cursor-pointer"
            title="Reset repetition counter"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Primary Counter Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Reps Counter */}
        <div className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-center items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            TOTAL REPS
          </span>
          <motion.span
            key={reps}
            initial={{ scale: 1.2, color: "#e5ff00" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-black font-mono leading-none my-1"
          >
            {reps}
          </motion.span>
          <span className="text-[9px] font-bold text-[#e5ff00] uppercase tracking-wider">
            {stats.state ? `Phase: ${stats.state}` : "In Motion"}
          </span>
        </div>

        {/* Correct vs Incorrect */}
        <div className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-center">
          <span className="text-[9.5px] font-black uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
            REP QUALITY
          </span>
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Correct:</span>
            <span className="font-mono font-black">{correctReps}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-red-400 mt-0.5">
            <span>Incorrect:</span>
            <span className="font-mono font-black">{incorrectReps}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400">
            <span>Accuracy:</span>
            <span className="font-mono font-bold text-white">{accuracy}%</span>
          </div>
        </div>

        {/* Form Score */}
        <div className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-center items-center text-center">
          <span className="text-[9.5px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            FORM SCORE
          </span>
          <span className="text-3xl font-black font-mono text-[#e5ff00] my-0.5">
            {formScore}%
          </span>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-[#e5ff00] h-full rounded-full transition-all duration-300"
              style={{ width: `${formScore}%` }}
            />
          </div>
        </div>

        {/* Kinematic Rhythm (Tempo & Stability) */}
        <div className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-center space-y-1">
          <span className="text-[9.5px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            CADENCE & CONTROL
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock size={11} className="text-[#e5ff00]" /> Tempo:
            </span>
            <span className="font-mono font-bold text-white">{tempo}s</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Compass size={11} className="text-emerald-400" /> Stability:
            </span>
            <span className="font-mono font-bold text-emerald-400">{stability}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Gauge size={11} className="text-blue-400" /> Depth:
            </span>
            <span className="font-mono font-bold text-blue-400">{depth}%</span>
          </div>
        </div>
      </div>

      {/* Real-time Angle Badges */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 mb-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
          Live Angles:
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
          Knee: <span className="text-[#e5ff00]">{kneeAngle}°</span>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
          Hip: <span className="text-[#e5ff00]">{hipAngle}°</span>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
          Back: <span className="text-[#e5ff00]">{backAngle}°</span>
        </span>
      </div>

      {/* Live Form Cues */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
          Live Form Cues:
        </span>
        <div className="space-y-1">
          {liveFeedback.map((fb, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                fb.type === "positive"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                  : fb.type === "warning"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
                  : "bg-blue-500/10 border-blue-500/25 text-blue-300"
              }`}
            >
              {fb.type === "positive" ? (
                <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle size={13} className="shrink-0 text-amber-400" />
              )}
              <span className="truncate">{fb.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseStatsCard;
