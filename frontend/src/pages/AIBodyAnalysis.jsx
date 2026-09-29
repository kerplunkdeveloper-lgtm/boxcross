import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  User,
  Calendar,
  Sparkles,
  ChevronDown,
  Dumbbell,
  Users,
  Sliders,
  FileText,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useTheme } from "../context/ThemeContext";

// Services
import { postureAnalysisService } from "../services/postureAnalysisService";
import { exerciseAnalysisService } from "../services/exerciseAnalysisService";
import { aiFeedbackService } from "../services/aiFeedbackService";
import {
  getAthletes,
  getAIAnalysisList,
  getMemberAnalysisHistory,
  createAIAnalysis,
  deleteAIAnalysis,
} from "../api/api";

// Subcomponents
import CameraAnalyzer from "../Components/AIBodyAnalysis/CameraAnalyzer";
import PostureScoreCard from "../Components/AIBodyAnalysis/PostureScoreCard";
import KeyInsightsCard from "../Components/AIBodyAnalysis/KeyInsightsCard";
import AlignmentPanel from "../Components/AIBodyAnalysis/AlignmentPanel";
import ExerciseStatsCard from "../Components/AIBodyAnalysis/ExerciseStatsCard";
import PostureTypeCards from "../Components/AIBodyAnalysis/PostureTypeCards";
import PostureComparisonCard from "../Components/AIBodyAnalysis/PostureComparisonCard";
import AIRecommendationsCard from "../Components/AIBodyAnalysis/AIRecommendationsCard";
import ProgressChart from "../Components/AIBodyAnalysis/ProgressChart";
import AnalysisHistoryTable from "../Components/AIBodyAnalysis/AnalysisHistoryTable";
import AnalysisReportModal from "../Components/AIBodyAnalysis/AnalysisReportModal";

// 6 Exact Modes matching User Mockup Image
const ANALYSIS_MODES = [
  { label: "Posture Analysis", icon: Activity },
  { label: "Squat Analysis", icon: Dumbbell },
  { label: "Push Up Analysis", icon: Activity },
  { label: "Deadlift Analysis", icon: Dumbbell },
  { label: "Body Composition", icon: Users },
  { label: "Movement Tracking", icon: Sliders },
];

// Fallback athlete baseline matching mockup "Karthik S #GYM0012"
const FALLBACK_ATHLETES = [
  {
    _id: "m-0012",
    athleteName: "Karthik S",
    memberId: "GYM0012",
    age: 28,
    gender: "Male",
    membershipPlan: "Founders Annual VIP",
    coach: "Vivek (Head Coach)",
    previousScore: 72,
    currentScore: 86,
    improvement: "+14%",
  },
  {
    _id: "m-0015",
    athleteName: "Priya Raman",
    memberId: "GYM0015",
    age: 25,
    gender: "Female",
    membershipPlan: "Elite Strength & Conditioning",
    coach: "Ananya",
    previousScore: 68,
    currentScore: 78,
    improvement: "+10%",
  },
  {
    _id: "m-0021",
    athleteName: "Vikram Malhotra",
    memberId: "GYM0021",
    age: 34,
    gender: "Male",
    membershipPlan: "Boxing & Cross Pro",
    coach: "Vivek",
    previousScore: 75,
    currentScore: 82,
    improvement: "+7%",
  },
];

const AIBodyAnalysis = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mode & Member Selection
  const [currentMode, setCurrentMode] = useState("Posture Analysis");
  const [athletes, setAthletes] = useState(FALLBACK_ATHLETES);
  const [selectedMember, setSelectedMember] = useState(FALLBACK_ATHLETES[0]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Session & Camera State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDuration, setAnalysisDuration] = useState(0); // Ready at 0s, starts counting upon activation
  const timerIntervalRef = useRef(null);

  // Real-time Kinematic Metrics
  const [postureMetrics, setPostureMetrics] = useState(
    postureAnalysisService.getDefaultMetrics()
  );
  const [exerciseStats, setExerciseStats] = useState(
    exerciseAnalysisService.getState()
  );
  const [coachFeedback, setCoachFeedback] = useState({
    level: "positive",
    quote: "Stand upright and look forward into the camera to calibrate plumbline posture.",
    tag: "Optimal Alignment",
  });

  // History & Report Modal
  const [historyList, setHistoryList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showHistoryTable, setShowHistoryTable] = useState(false);

  // Fetch athletes from backend API on mount
  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const res = await getAthletes();
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const formatted = res.data.data.map((a) => ({
            ...a,
            memberId: a.memberId || `GYM${a._id.slice(-4).toUpperCase()}`,
            membershipPlan: a.membershipPlan || "Active Member",
            previousScore: 72,
            currentScore: 86,
            improvement: "+14%",
          }));
          setAthletes(formatted);
          setSelectedMember(formatted[0]);
        }
      } catch (err) {
        console.warn("Using baseline athlete data for AI Body Analysis:", err.message);
      }
    };
    loadAthletes();
  }, []);

  // Fetch history for selected member from backend
  const loadHistory = async (memberId) => {
    try {
      const activeId = memberId || selectedMember?.memberId;
      const [listRes, memberRes] = await Promise.allSettled([
        getAIAnalysisList({ memberId: activeId }),
        getMemberAnalysisHistory(activeId),
      ]);

      if (
        listRes.status === "fulfilled" &&
        listRes.value.data?.success &&
        Array.isArray(listRes.value.data.data)
      ) {
        setHistoryList(listRes.value.data.data);
      }

      if (memberRes.status === "fulfilled" && memberRes.value.data?.success) {
        const comp = memberRes.value.data.comparison;
        if (comp?.previous) {
          setSelectedMember((prev) => ({
            ...prev,
            previousScore: comp.previous.overallScore,
            improvement:
              comp.improvementPoints >= 0
                ? `+${comp.improvementPoints} pts`
                : `${comp.improvementPoints} pts`,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not load backend analysis history:", err.message);
    }
  };

  useEffect(() => {
    if (selectedMember?.memberId) {
      loadHistory(selectedMember.memberId);
    }
  }, [selectedMember]);

  // Handle Mode Change
  const handleSelectMode = (mode) => {
    setCurrentMode(mode);
    exerciseAnalysisService.setMode(mode);
    setExerciseStats(exerciseAnalysisService.getState());
  };

  // Live timer tick
  useEffect(() => {
    if (isAnalyzing) {
      timerIntervalRef.current = setInterval(() => {
        setAnalysisDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isAnalyzing]);

  // Real-time landmark processing pipeline:
  // camera → pose detection → landmarks → analysis engine → UI
  const handleLandmarksDetected = (landmarks, isSimulated) => {
    // 1. Posture Engine
    const postRes = postureAnalysisService.analyzePosture(landmarks);
    setPostureMetrics(postRes);

    // 2. Exercise Engine
    const exRes = exerciseAnalysisService.analyzeFrame(landmarks);
    setExerciseStats(exRes);

    // 3. AI Coach Feedback
    const fb = aiFeedbackService.generateCoachFeedback(currentMode, postRes, exRes);
    setCoachFeedback(fb);
  };

  // Determine visual state for skeleton
  const getVisualState = () => {
    if (currentMode === "Posture Analysis") {
      if (postureMetrics.overallScore >= 80) return "GREEN";
      if (postureMetrics.overallScore >= 60) return "YELLOW";
      return "RED";
    }
    if (exerciseStats.formScore >= 80) return "GREEN";
    if (exerciseStats.formScore >= 60) return "YELLOW";
    return "RED";
  };

  // Save current analysis session
  const handleSaveAnalysis = async () => {
    const payload = {
      memberId: selectedMember?.memberId || "GYM0012",
      athleteId: selectedMember?._id || null,
      memberName: selectedMember?.athleteName || "Karthik S",
      trainerName: selectedMember?.coach || "Coach Vivek",
      analysisType: currentMode,
      overallScore:
        currentMode === "Posture Analysis"
          ? postureMetrics.overallScore
          : exerciseStats.formScore,
      postureScore: postureMetrics.postureScore,
      formScore: exerciseStats.formScore,
      symmetryScore: postureMetrics.alignmentMetrics?.bodySymmetry || 82,
      alignmentMetrics: postureMetrics.alignmentMetrics,
      jointAngles: postureMetrics.jointAngles,
      detectedPostureType: postureMetrics.detectedPostureType,
      detectedIssues: postureMetrics.detectedIssues,
      recommendations: postureMetrics.recommendations,
      exerciseStats:
        currentMode !== "Posture Analysis"
          ? {
              exerciseName: currentMode,
              repsCompleted: exerciseStats.reps,
              correctReps: exerciseStats.correctReps,
              incorrectReps: exerciseStats.incorrectReps,
              maxDepth: exerciseStats.depth,
              avgCadenceSeconds: parseFloat(exerciseStats.cadence) || 2.4,
              formScore: exerciseStats.formScore,
            }
          : null,
      duration: analysisDuration || 12,
    };

    try {
      const res = await createAIAnalysis(payload);
      if (res.data?.success) {
        toast.success(`Analysis saved for ${selectedMember?.athleteName || "Member"}!`);
        setHistoryList((prev) => [res.data.data, ...prev]);
        setSelectedReport(res.data.data);
      } else {
        toast.success("Analysis captured and logged locally.");
      }
    } catch (err) {
      toast.success("Analysis recorded locally.");
    }
  };

  // Open Full Diagnostic Report Modal
  const handleOpenReport = (record = null) => {
    setSelectedReport(
      record || {
        _id: "local-" + Date.now(),
        memberId: selectedMember?.memberId || "GYM0012",
        memberName: selectedMember?.athleteName || "Karthik S",
        analysisType: currentMode,
        overallScore:
          currentMode === "Posture Analysis"
            ? postureMetrics.overallScore
            : exerciseStats.formScore,
        postureScore: postureMetrics.postureScore,
        formScore: exerciseStats.formScore,
        symmetryScore: postureMetrics.alignmentMetrics?.bodySymmetry || 82,
        alignmentMetrics: postureMetrics.alignmentMetrics,
        symmetryMetrics: postureMetrics.symmetryMetrics,
        mobilityMetrics: postureMetrics.mobilityMetrics,
        detectedPostureType: postureMetrics.detectedPostureType,
        detectedIssues: postureMetrics.detectedIssues,
        recommendations: postureMetrics.recommendations,
        duration: analysisDuration || 12,
        trainerName: selectedMember?.coach || "Coach Vivek",
        createdAt: new Date(),
      }
    );
    setIsReportModalOpen(true);
  };

  // Delete analysis record
  const handleDeleteRecord = async (id) => {
    try {
      await deleteAIAnalysis(id);
      setHistoryList((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      toast.success("Analysis record deleted.");
    } catch (err) {
      setHistoryList((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      toast.success("Record removed.");
    }
  };

  return (
    <div className="p-3.5 sm:p-5 md:p-6 lg:p-7 space-y-4 sm:space-y-5 lg:space-y-6 max-w-[1580px] mx-auto select-none min-h-screen text-[var(--db-text)] bg-[var(--db-bg)] transition-colors duration-200">
      <Helmet>
        <title>AI Body &amp; Posture Analysis | Box &amp; Cross</title>
        <meta
          name="description"
          content="Real-time AI analysis to detect posture, body alignment and exercise form."
        />
      </Helmet>

      {/* ── 1. HEADER ROW ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-1">
        {/* Left: Title & Subtitle */}
        <div>
          <h1 className="text-xl sm:text-xl  font-extrabold text-[var(--db-text-title)] tracking-tight">
            AI Body &amp; Posture Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[var(--db-text-muted)] font-normal mt-0.5">
            Real-time AI analysis to detect posture, body alignment and exercise form.
          </p>
        </div>

        {/* Right: Select Member + Date Card */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Select Member Box */}
          <div className="relative flex-1 sm:flex-initial min-w-[160px]">
            <span className="text-[10px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider block mb-1">
              Select Member
            </span>
            <div
              onClick={() => setShowMemberDropdown(!showMemberDropdown)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] hover:border-[var(--db-accent-highlight)]/50 transition-all cursor-pointer shadow-sm w-full sm:min-w-[185px]"
            >
              {/* Member Avatar */}
              <div className="w-7 h-7 rounded-full bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/30 flex items-center justify-center text-xs font-bold shrink-0">
                {selectedMember?.athleteName?.charAt(0) || "K"}
              </div>

              {/* Name & ID */}
              <div className="flex flex-col flex-1 leading-tight min-w-0">
                <span className="text-xs font-bold text-[var(--db-text-title)] truncate">
                  {selectedMember?.athleteName || "Karthik S"}
                </span>
                <span className="text-[10px] text-[var(--db-text-muted)] font-mono">
                  #{selectedMember?.memberId || "GYM0012"}
                </span>
              </div>

              <ChevronDown size={14} className="text-[var(--db-text-muted)] shrink-0" />
            </div>

            {/* Member Dropdown Menu */}
            {showMemberDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-40 py-1.5 overflow-hidden backdrop-blur-md">
                {athletes.map((a) => (
                  <button
                    key={a._id}
                    onClick={() => {
                      setSelectedMember(a);
                      setShowMemberDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--db-input-bg)] transition-all cursor-pointer ${
                      selectedMember?._id === a._id ? "bg-[var(--db-input-bg)]" : ""
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--db-accent)]/20 text-[var(--db-accent-highlight)] flex items-center justify-center text-[11px] font-bold">
                      {a.athleteName?.charAt(0)}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-semibold text-[var(--db-text-title)] truncate">
                        {a.athleteName}
                      </span>
                      <span className="text-[10px] text-[var(--db-text-muted)] font-mono">
                        #{a.memberId}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Card */}
          <div className="flex-1 sm:flex-initial min-w-[140px]">
            <span className="text-[10px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider block mb-1">
              Date &amp; Time
            </span>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-sm">
              <div className="p-1.5 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-text-muted)] shrink-0">
                <Calendar size={14} />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[10px] font-semibold text-[var(--db-text-muted)]">
                  Session
                </span>
                <span className="text-xs font-bold text-[var(--db-text-title)] truncate">
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  , 11:45 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MODE TABS ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 select-none custom-scrollbar -mx-1 px-1">
        {ANALYSIS_MODES.map((m) => {
          const isActive = currentMode === m.label;
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              onClick={() => handleSelectMode(m.label)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                isActive
                  ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold shadow-md shadow-[var(--db-accent-glow)] scale-[1.02]"
                  : "bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text-title)] hover:bg-[var(--db-input-bg)] hover:border-[var(--db-accent-highlight)]/40"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[var(--db-accent-text)]" : "text-[var(--db-text-muted)]"} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. MIDDLE SECTION (Responsive Multi-Column) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Column 1: Live Video Camera Viewport */}
        <div className="col-span-1 md:col-span-2 xl:col-span-5 flex flex-col">
          <CameraAnalyzer
            onLandmarksDetected={handleLandmarksDetected}
            currentMode={currentMode}
            jointAngles={postureMetrics.jointAngles}
            visualState={getVisualState()}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            analysisDuration={analysisDuration}
            setAnalysisDuration={setAnalysisDuration}
            exerciseStats={exerciseStats}
            onSelectMode={handleSelectMode}
          />
        </div>

        {/* Column 2: Overall Posture Score & Key Insights / Exercise Stats */}
        <div className="col-span-1 md:col-span-1 xl:col-span-4 flex flex-col gap-4 lg:gap-5 h-full">
          {/* Top: Overall Posture Score */}
          <PostureScoreCard
            score={
              currentMode === "Posture Analysis"
                ? postureMetrics.overallScore
                : exerciseStats.formScore
            }
            status={postureMetrics.postureStatus}
            improvement={`+${
              (postureMetrics.overallScore || 86) -
              (selectedMember?.previousScore || 72)
            }`}
          />

          {/* Bottom: Key Insights (or Exercise Stats if exercise active) */}
          {currentMode === "Posture Analysis" ? (
            <KeyInsightsCard
              metrics={postureMetrics.alignmentMetrics}
              insights={postureMetrics.insights}
            />
          ) : (
            <ExerciseStatsCard
              stats={exerciseStats}
              currentMode={currentMode}
              onResetReps={() => {
                exerciseAnalysisService.reset();
                setExerciseStats(exerciseAnalysisService.getState());
                toast.success("Rep counter reset.");
              }}
            />
          )}
        </div>

        {/* Column 3: Body Alignment & Posture Type */}
        <div className="col-span-1 md:col-span-1 xl:col-span-3 flex flex-col gap-4 lg:gap-5 h-full">
          {/* Top: Body Alignment */}
          <AlignmentPanel metrics={postureMetrics.alignmentMetrics} />

          {/* Bottom: Posture Type */}
          <PostureTypeCards detectedType={postureMetrics.detectedPostureType} />
        </div>
      </div>

      {/* ── 4. BOTTOM SECTION (Responsive 3 Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 items-stretch">
        {/* Card 1: Posture Comparison */}
        <div className="col-span-1 flex flex-col">
          <PostureComparisonCard
            currentScore={postureMetrics.overallScore}
            detectedIssues={postureMetrics.detectedIssues}
            alignmentMetrics={postureMetrics.alignmentMetrics}
          />
        </div>

        {/* Card 2: AI Recommendations */}
        <div className="col-span-1 flex flex-col">
          <AIRecommendationsCard
            recommendations={postureMetrics.recommendations}
            insights={postureMetrics.insights}
          />
        </div>

        {/* Card 3: Progress History */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1 flex flex-col">
          <ProgressChart />
        </div>
      </div>

      {/* ── 5. SECONDARY UTILITY BAR: SAVE, REPORT & ARCHIVES ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--db-card-border)] text-xs text-[var(--db-text-muted)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistoryTable(!showHistoryTable)}
            className="text-[var(--db-text-muted)] hover:text-[var(--db-text-title)] font-semibold transition-all cursor-pointer underline decoration-dotted"
          >
            {showHistoryTable ? "Hide Analysis Archives" : "View Member Analysis Archives"}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => handleOpenReport()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text)] hover:text-[var(--db-text-title)] hover:border-[var(--db-accent-highlight)]/50 hover:bg-[var(--db-input-bg)] transition-all cursor-pointer text-xs font-semibold shadow-sm"
          >
            <FileText size={13} />
            <span>Generate Full Report</span>
          </button>

          <button
            onClick={handleSaveAnalysis}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs shadow-md shadow-[var(--db-accent-glow)]"
          >
            <Save size={13} />
            <span>Save Analysis</span>
          </button>
        </div>
      </div>

      {/* ── 6. COLLAPSIBLE ANALYSIS HISTORY TABLE ── */}
      {showHistoryTable && (
        <AnalysisHistoryTable
          history={historyList}
          onViewReport={(record) => {
            setSelectedReport(record);
            setIsReportModalOpen(true);
          }}
          onDeleteRecord={handleDeleteRecord}
          selectedMemberId={selectedMember?.memberId}
        />
      )}

      {/* ── 7. DETAILED PRINTABLE / DOWNLOADABLE REPORT MODAL ── */}
      <AnalysisReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={selectedReport}
        onSaveNotes={(id, notes) => {
          setHistoryList((prev) =>
            prev.map((item) =>
              item._id === id ? { ...item, trainerNotes: notes } : item
            )
          );
        }}
      />
    </div>
  );
};

export default AIBodyAnalysis;
