import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AnalysisReportModal = ({ isOpen, onClose, reportData, onSaveNotes }) => {
  if (!isOpen || !reportData) return null;

  const [trainerNotes, setTrainerNotes] = useState(
    reportData.trainerNotes || "Athlete displays solid biomechanical baseline with minor forward head deviation. Focus on cervical retractions and thoracic extensions during warmups."
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[var(--db-card-border)] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Header Bar */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-black via-[#0d0d0d] to-black border-b border-[var(--db-card-border)] flex items-center justify-between flex-wrap gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e5ff00] text-black flex items-center justify-center font-black">
              BX
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase text-white tracking-wider">
                AI Diagnostic & Fitness Performance Report
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              title="Print Report"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              title="Download PDF"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              title="Share Report"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-8 space-y-6 text-gray-200">
          {/* Member & Header Banner */}
          <div className="p-5 rounded-2xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e5ff00]/30 to-black border border-[#e5ff00]/40 flex items-center justify-center font-black text-xl text-white">
                {reportData.memberName?.charAt(0) || "K"}
              </div>
              <div>
                <h4 className="text-base font-black text-white uppercase tracking-wide">
                  {reportData.memberName || "Karthik S"}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-bold">
                  <span className="text-[#e5ff00]">#{reportData.memberId || "GYM0012"}</span>
                  <span>•</span>
                  <span>{reportData.analysisType || "Posture Analysis"}</span>
                  <span>•</span>
                  <span>Coach: {reportData.trainerName || "Vivek"}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Date Evaluated
              </span>
              <p className="text-xs font-bold text-white font-mono mt-0.5">
                {formatDate(reportData.createdAt)}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Certified AI Analysis
              </span>
            </div>
          </div>

          {/* Core Score Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                Overall Score
              </span>
              <p className="text-3xl font-black font-mono text-[#e5ff00] my-1">
                {reportData.overallScore || 86}
              </p>
              <span className="text-[10px] font-bold text-emerald-400">
                {reportData.detectedPostureType || "Good Posture"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                Posture Score
              </span>
              <p className="text-3xl font-black font-mono text-white my-1">
                {reportData.postureScore || 86}
              </p>
              <span className="text-[10px] font-bold text-gray-400">Plumbline Balance</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                Exercise Form
              </span>
              <p className="text-3xl font-black font-mono text-emerald-400 my-1">
                {reportData.formScore ? `${reportData.formScore}%` : "84%"}
              </p>
              <span className="text-[10px] font-bold text-emerald-400">Kinematic Rating</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-center">
              <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider">
                Symmetry
              </span>
              <p className="text-3xl font-black font-mono text-blue-400 my-1">
                {reportData.symmetryScore ? `${reportData.symmetryScore}%` : "88%"}
              </p>
              <span className="text-[10px] font-bold text-blue-400">Bilateral Harmony</span>
            </div>
          </div>

          {/* Section 2: Biomechanical Alignment & Symmetry Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alignment Card */}
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
              <h5 className="text-xs font-black uppercase text-white tracking-wider mb-3">
                Biomechanical Alignment Zones
              </h5>
              <div className="space-y-2 text-xs">
                {Object.entries(alignment).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize text-gray-300">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-mono font-bold text-[#e5ff00]">{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilateral Symmetry */}
            <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
              <h5 className="text-xs font-black uppercase text-white tracking-wider mb-3">
                Coronal Symmetry Matrix
              </h5>
              <div className="space-y-2 text-xs">
                {Object.entries(symmetry).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize text-gray-300">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Issues & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identified Issues */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle size={13} />
                <span>Identified Posture Divergences</span>
              </h5>
              <div className="space-y-1.5 text-xs text-amber-200">
                {issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h5 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>AI Corrective Action Items</span>
              </h5>
              <div className="space-y-1.5 text-xs text-emerald-200">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Trainer Notes (Editable) */}
          <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-black uppercase text-white tracking-wider">
                Head Coach / Trainer Prescription Notes
              </h5>
              <button
                onClick={handleSaveNotes}
                className="px-2.5 py-1 rounded bg-[#e5ff00] text-black font-black text-[10px] uppercase tracking-wider hover:opacity-90 cursor-pointer print:hidden"
              >
                Save Notes
              </button>
            </div>
            <textarea
              rows={3}
              value={trainerNotes}
              onChange={(e) => setTrainerNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-[#e5ff00]/60 resize-none font-medium leading-relaxed"
              placeholder="Add trainer instructions, prescribed sets/reps, or corrective drills..."
            />
          </div>

          {/* Legal / Medical Safety Disclaimer */}
          <div className="pt-2 text-center text-[9.5px] text-gray-500 font-medium">
            Box &amp; Cross AI Body &amp; Posture Assessment System • For physical fitness guidance and exercise performance tracking only. Not intended to replace clinical medical diagnosis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReportModal;
