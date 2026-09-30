import React from "react";
import {
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Gauge,
  Clock,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ExerciseStatsCard = ({
  stats = {},
  currentMode = "Squat Analysis",
  onResetReps,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const reps = stats.reps ?? 18;
  const correctReps = stats.correctReps ?? 15;
  const incorrectReps = stats.incorrectReps ?? 3;
  const accuracy =
    stats.accuracy ?? (reps > 0 ? Math.round((correctReps / reps) * 100) : 83);
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
    <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between relative overflow-hidden h-full transition-colors duration-200">
      {/* Glow behind counter */}
      <div className="pointer-events-none absolute top-4 right-4 w-32 h-32 bg-emerald-500/10 dark:bg-[#ccf141]/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[var(--db-card-border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/15 dark:bg-[#ccf141]/15 text-emerald-600 dark:text-[#ccf141] flex items-center justify-center shrink-0">
            <Dumbbell size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-[var(--db-text-title)]">
              {currentMode}
            </h3>
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider block">
              Real-Time Repetition &amp; Form Engine
            </span>
          </div>
        </div>

        {onResetReps && (
          <button
            onClick={onResetReps}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-card-border)] hover:border-slate-300 dark:hover:border-neutral-700 text-[var(--db-text)] text-[10px] font-bold transition-all cursor-pointer shadow-sm shrink-0"
            title="Reset repetition counter"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Primary Counter Banner - Balanced 2x2 Grid with Proper Alignment */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 my-2.5 sm:my-3">
        {/* Card 1: Reps Counter */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-between items-center text-center min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            TOTAL REPS
          </span>
          <motion.span
            key={reps}
            initial={{ scale: 1.15, color: "#10b981" }}
            animate={{ scale: 1, color: isDark ? "#ffffff" : "#0f172a" }}
            transition={{ duration: 0.3 }}
            className="text-3xl sm:text-4xl font-black font-mono leading-none my-1 tracking-tight"
          >
            {reps}
          </motion.span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#ccf141] text-[9px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {stats.state ? `Phase: ${stats.state}` : "In Motion"}
          </span>
        </div>

        {/* Card 2: Form Score */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-between items-center text-center min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            FORM SCORE
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-[#ccf141] leading-none tracking-tight">
              {formScore}%
            </span>
          </div>
          <div className="w-full">
            <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden mb-1">
              <div
                className="bg-emerald-500 dark:bg-[#ccf141] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, formScore))}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
              {formScore >= 80
                ? "Optimal Alignment"
                : formScore >= 60
                  ? "Acceptable Form"
                  : "Needs Correction"}
            </span>
          </div>
        </div>

        {/* Card 3: Rep Quality */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-between min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
            REP QUALITY
          </span>
          <div className="space-y-1 my-auto">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 truncate">
                <CheckCircle2 size={11} className="shrink-0" /> Correct
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                {correctReps}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-rose-600 dark:text-red-400 font-bold flex items-center gap-1 truncate">
                <AlertTriangle size={11} className="shrink-0" /> Incorrect
              </span>
              <span className="font-mono font-black text-rose-600 dark:text-red-400 shrink-0 ml-1">
                {incorrectReps}
              </span>
            </div>
          </div>
          <div className="pt-1.5 mt-1 border-t border-[var(--db-card-border)]/60">
            <div className="flex items-center justify-between text-[10px] text-[var(--db-text-muted)] font-semibold mb-1">
              <span>Accuracy</span>
              <span className="font-mono font-bold text-[var(--db-text-title)]">
                {accuracy}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 dark:bg-[#ccf141] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Cadence & Control */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col justify-between min-w-0 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
            CADENCE &amp; CONTROL
          </span>
          <div className="space-y-1.5 my-auto">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-[var(--db-text-muted)] flex items-center gap-1 truncate">
                <Clock
                  size={11}
                  className="text-emerald-500 dark:text-[#ccf141] shrink-0"
                />{" "}
                Tempo
              </span>
              <span className="font-mono font-bold text-[var(--db-text-title)] shrink-0 ml-1">
                {tempo}s
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-[var(--db-text-muted)] flex items-center gap-1 truncate">
                <Compass size={11} className="text-emerald-500 shrink-0" />{" "}
                Stability
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                {stability}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-[var(--db-text-muted)] flex items-center gap-1 truncate">
                <Gauge size={11} className="text-blue-500 shrink-0" /> Depth
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-1">
                {depth}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Angle Badges */}
      <div
        className={`p-2.5 rounded-xl border mb-3 ${
          isDark
            ? "bg-black/40 border-white/5"
            : "bg-slate-100 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Live Kinematic Angles
          </span>
          <span className="text-[9px] font-bold text-emerald-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div
            className={`px-1.5 py-1 rounded-lg border text-xs font-mono ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <span className="text-[9px] text-[var(--db-text-muted)] block uppercase font-sans font-bold">
              Knee
            </span>
            <span className="font-bold text-emerald-600 dark:text-[#ccf141]">
              {kneeAngle}°
            </span>
          </div>
          <div
            className={`px-1.5 py-1 rounded-lg border text-xs font-mono ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <span className="text-[9px] text-[var(--db-text-muted)] block uppercase font-sans font-bold">
              Hip
            </span>
            <span className="font-bold text-emerald-600 dark:text-[#ccf141]">
              {hipAngle}°
            </span>
          </div>
          <div
            className={`px-1.5 py-1 rounded-lg border text-xs font-mono ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <span className="text-[9px] text-[var(--db-text-muted)] block uppercase font-sans font-bold">
              Back
            </span>
            <span className="font-bold text-emerald-600 dark:text-[#ccf141]">
              {backAngle}°
            </span>
          </div>
        </div>
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
                  ? isDark
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : fb.type === "warning"
                    ? isDark
                      ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                    : isDark
                      ? "bg-blue-500/10 border-blue-500/25 text-blue-300"
                      : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              {fb.type === "positive" ? (
                <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
              ) : (
                <AlertTriangle size={13} className="shrink-0 text-amber-500" />
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
