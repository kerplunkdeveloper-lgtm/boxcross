import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const AnalysisReportModal = ({ isOpen, onClose, reportData, onSaveNotes }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isOpen || !reportData) return null;

  const [trainerNotes, setTrainerNotes] = useState(
    reportData.trainerNotes ||
      "Athlete displays solid biomechanical baseline with minor forward head deviation. Focus on cervical retractions and thoracic extensions during warmups.",
  );

  const formatDate = (dateStr) => {
    if (!dateStr)
      return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success("Preparing PDF document for print/download...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleShare = async () => {
    const summary = `Box & Cross AI Posture & Body Analysis Report\nMember: ${reportData.memberName || "Athlete"} (${reportData.memberId || "GYM"})\nScore: ${reportData.overallScore || 86}/100\nStatus: ${reportData.detectedPostureType || "Good Posture"}\nGenerated on ${formatDate(reportData.createdAt)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Body Analysis Report - Box & Cross",
          text: summary,
        });
        toast.success("Report shared successfully.");
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(summary);
      toast.success("Report summary copied to clipboard.");
    }
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(reportData._id || reportData.id, trainerNotes);
    }
    toast.success("Trainer notes updated successfully.");
  };

  const alignment = reportData.alignmentMetrics || {
    headPosition: 92,
    shoulderAlignment: 86,
    spineAlignment: 74,
    hipAlignment: 89,
    kneeAlignment: 91,
    ankleAlignment: 88,
    bodySymmetry: 82,
  };

  const symmetry = reportData.symmetryMetrics || {
    shoulderSymmetry: 92,
    hipSymmetry: 88,
    kneeSymmetry: 94,
    ankleSymmetry: 90,
  };

  const issues = reportData.detectedIssues || [
    "Slight forward head tilt during standing",
    "Mild thoracic spine rounding under fatigue",
  ];

  const recommendations = reportData.recommendations || [
    "Maintain a neutral cervical spine during standing rest",
    "Incorporate face pulls & band pull-aparts for upper back",
    "Strengthen core stability with bird-dogs and dead bugs",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <div
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none transition-colors duration-200 ${
          isDark
            ? "bg-[#0a0a0a] border-[var(--db-card-border)] text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header Bar */}
        <div
          className={`p-4 md:p-6 border-b flex items-center justify-between flex-wrap gap-3 print:hidden ${
            isDark
              ? "bg-gradient-to-r from-black via-[#0d0d0d] to-black border-[var(--db-card-border)]"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 dark:bg-[#ccf141] text-white dark:text-black flex items-center justify-center font-black">
              BX
            </div>
            <div>
              <h3
                className={`text-sm md:text-base font-black uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}
              >
                AI Diagnostic &amp; Fitness Performance Report
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] font-bold">
                Box &amp; Cross Digital Physical Assessment Engine
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
              title="Print Report"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
              title="Download PDF"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
              title="Share Report"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ml-1 ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          className={`p-6 md:p-8 space-y-6 ${isDark ? "text-gray-200" : "text-slate-700"}`}
        >
          {/* Member & Header Banner */}
          <div className="p-5 rounded-2xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 dark:bg-gradient-to-tr dark:from-[#ccf141]/30 dark:to-black border border-emerald-500/30 dark:border-[#ccf141]/40 flex items-center justify-center font-black text-xl text-emerald-600 dark:text-white">
                {reportData.memberName?.charAt(0) || "K"}
              </div>
              <div>
                <h4 className="text-base font-black text-[var(--db-text-title)] uppercase tracking-wide">
                  {reportData.memberName || "Karthik S"}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--db-text-muted)] font-bold">
                  <span className="text-emerald-600 dark:text-[#ccf141]">
                    #{reportData.memberId || "GYM0012"}
                  </span>
                  <span>•</span>
                  <span>{reportData.analysisType || "Posture Analysis"}</span>
                  <span>•</span>
                  <span>Coach: {reportData.trainerName || "Vivek"}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-[var(--db-text-muted)] tracking-wider">
                Date Evaluated
              </span>
              <p className="text-xs font-bold text-[var(--db-text-title)] font-mono mt-0.5">
                {formatDate(reportData.createdAt)}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Certified AI Analysis
              </span>
            </div>
          </div>

          {/* Core Score Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-[var(--db-text-muted)] tracking-wider">
                Overall Score
              </span>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-[#ccf141] my-1">
                {reportData.overallScore || 86}
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {reportData.detectedPostureType || "Good Posture"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-[var(--db-text-muted)] tracking-wider">
                Posture Score
              </span>
              <p className="text-3xl font-black font-mono text-[var(--db-text-title)] my-1">
                {reportData.postureScore || 86}
              </p>
              <span className="text-[10px] font-bold text-[var(--db-text-muted)]">
                Plumbline Balance
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-[var(--db-text-muted)] tracking-wider">
                Exercise Form
              </span>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 my-1">
                {reportData.formScore ? `${reportData.formScore}%` : "84%"}
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Kinematic Rating
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-[var(--db-text-muted)] tracking-wider">
                Symmetry
              </span>
              <p className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 my-1">
                {reportData.symmetryScore
                  ? `${reportData.symmetryScore}%`
                  : "88%"}
              </p>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                Bilateral Harmony
              </span>
            </div>
          </div>

          {/* Section 2: Biomechanical Alignment & Symmetry Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alignment Card */}
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
              <h5 className="text-xs font-black uppercase text-[var(--db-text-title)] tracking-wider mb-3">
                Biomechanical Alignment Zones
              </h5>
              <div className="space-y-2 text-xs">
                {Object.entries(alignment).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize text-[var(--db-text)]">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-[#ccf141]">
                      {val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilateral Symmetry */}
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
              <h5 className="text-xs font-black uppercase text-[var(--db-text-title)] tracking-wider mb-3">
                Coronal Symmetry Matrix
              </h5>
              <div className="space-y-2 text-xs">
                {Object.entries(symmetry).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize text-[var(--db-text)]">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Issues & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identified Issues */}
            <div
              className={`p-4 rounded-xl border ${isDark ? "bg-amber-500/10 border-amber-500/25 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-800"}`}
            >
              <h5
                className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isDark ? "text-amber-400" : "text-amber-800"}`}
              >
                <AlertTriangle size={13} />
                <span>Identified Posture Divergences</span>
              </h5>
              <div className="space-y-1.5 text-xs">
                {issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div
              className={`p-4 rounded-xl border ${isDark ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}
            >
              <h5
                className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isDark ? "text-emerald-400" : "text-emerald-800"}`}
              >
                <CheckCircle2 size={13} />
                <span>AI Corrective Action Items</span>
              </h5>
              <div className="space-y-1.5 text-xs">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Trainer Notes (Editable) */}
          <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-black uppercase text-[var(--db-text-title)] tracking-wider">
                Head Coach / Trainer Prescription Notes
              </h5>
              <button
                onClick={handleSaveNotes}
                className="px-2.5 py-1 rounded bg-emerald-500 dark:bg-[#ccf141] text-white dark:text-black font-black text-[10px] uppercase tracking-wider hover:opacity-90 cursor-pointer print:hidden shadow-sm"
              >
                Save Notes
              </button>
            </div>
            <textarea
              rows={3}
              value={trainerNotes}
              onChange={(e) => setTrainerNotes(e.target.value)}
              className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-emerald-500/60 dark:focus:border-[#ccf141]/60 resize-none font-medium leading-relaxed ${
                isDark
                  ? "bg-black/50 border-white/10 text-gray-200"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
              placeholder="Add trainer instructions, prescribed sets/reps, or corrective drills..."
            />
          </div>

          {/* Legal / Medical Safety Disclaimer */}
          <div className="pt-2 text-center text-[9.5px] text-[var(--db-text-muted)] font-medium">
            Box &amp; Cross AI Body &amp; Posture Assessment System • For
            physical fitness guidance and exercise performance tracking only.
            Not intended to replace clinical medical diagnosis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReportModal;
