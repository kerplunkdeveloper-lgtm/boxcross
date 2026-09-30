import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Activity,
  Calendar,
  User,
  Phone,
  ShieldAlert,
  Printer,
  ChevronRight,
  TrendingUp,
  Dumbbell,
  RefreshCw,
  Sliders,
  Scale,
  Sparkles,
} from "lucide-react";
import {
  getGoalsReadiness,
  getGoalsReadinessStats,
  createGoalsReadiness,
  updateGoalsReadiness,
  deleteGoalsReadiness,
  getAthletes,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const REASONS_LIST = [
  "Lose weight / body fat",
  "Build strength",
  "Stamina & fitness",
  "Learn to box",
  "Self-defence & confidence",
  "Stress & headspace",
  "Sleep & energy",
  "Look better for an occasion",
  "Doctor's advice",
  "Compete — bout or race",
  "Came with a friend / family",
  "Back to training after a break",
];

const HEALTH_QUESTIONS = [
  { key: "chestPain", label: "1- Any chest pain or pressure, at rest or during exertion?" },
  { key: "dizziness", label: "2- Any dizziness, blackouts or fainting?" },
  { key: "breathlessness", label: "3- Breathlessness beyond what the effort explains?" },
  { key: "heartCondition", label: "4- Ever been told you have a heart condition?" },
  { key: "previousInjury", label: "5- Any previous injury still affecting you?" },
  { key: "surgeryLast3Months", label: "6- Any surgery in the last 3 months?" },
  { key: "jointOrBackPain", label: "7- Any joint or back pain that limits movement?" },
  { key: "regularMedication", label: "8- On any regular medication?" },
  { key: "pregnant", label: "9- Pregnant, or possibly pregnant?" },
];

const INITIAL_FORM = {
  athleteName: "",
  memberId: "",
  athleteId: null,
  age: "",
  gender: "Male",
  date: new Date().toISOString().split("T")[0],
  coach: "Vivek",
  emergencyContactName: "",
  relationship: "",
  emergencyContactNumber: "",
  dominantHand: "Right",
  reasons: [],
  inYourOwnWords: "",
  whyNow: "",
  deadline: "",
  triedBefore: "",
  nonNegotiables: "",
  confidence: 8,
  theNumberWeWillUse: "",
  whereItIsToday: "",
  nextBlockTarget: "",
  athleteAgrees: true,
  healthScreen: {
    chestPain: false,
    dizziness: false,
    breathlessness: false,
    heartCondition: false,
    previousInjury: false,
    surgeryLast3Months: false,
    jointOrBackPain: false,
    regularMedication: false,
    pregnant: false,
  },
  detailYesAnswer: "",
  restingHeartRate: "",
  bloodPressure: "",
  bpRetest: "",
  clearedToTest: "Cleared",
  status: "Completed",
  notes: "",
};

const GoalsReadiness = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    cleared: 0,
    referred: 0,
    retentionFlags: 0,
  });

  // Filter States
  const [search, setSearch] = useState("");
  const [clearedFilter, setClearedFilter] = useState("All");
  const [coachFilter, setCoachFilter] = useState("All");
  const [retentionOnly, setRetentionOnly] = useState(false);

  // Athletes list for autocomplete
  const [athletes, setAthletes] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [activeTab, setActiveTab] = useState("general"); // 'general', 'reasons', 'coach', 'health'
  const [submitting, setSubmitting] = useState(false);

  // View Sheet Modal
  const [viewingRecord, setViewingRecord] = useState(null);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Assessments
  const fetchAssessments = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      setRefreshing(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (clearedFilter !== "All") params.clearedToTest = clearedFilter;
      if (coachFilter !== "All") params.coach = coachFilter;
      if (retentionOnly) params.retentionFlag = true;

      const { data } = await getGoalsReadiness(params);
      if (data && data.success) {
        setAssessments(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
      toast.error("Failed to load assessments list");
    } finally {
      if (showSpinner) setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const { data } = await getGoalsReadinessStats();
      if (data && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch Athletes for autocomplete
  const fetchAthletesDropdown = async () => {
    try {
      const { data } = await getAthletes();
      if (data && data.success && Array.isArray(data.data)) {
        setAthletes(data.data);
      }
    } catch (err) {
      console.error("Error fetching athletes:", err);
    }
  };

  useEffect(() => {
    fetchAssessments(true);
    fetchStats();
    fetchAthletesDropdown();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssessments();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, clearedFilter, coachFilter, retentionOnly]);

  // Handle athlete auto-populate when selected
  const handleSelectAthlete = (athleteId) => {
    if (!athleteId) return;
    const selected = athletes.find((a) => a._id === athleteId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        athleteId: selected._id,
        athleteName: selected.athleteName || "",
        memberId: selected.memberId || "",
        age: selected.age || "",
        gender: selected.gender || "Male",
        coach: selected.coach || prev.coach,
        emergencyContactNumber: selected.phone || prev.emergencyContactNumber,
      }));
      toast.success(`Loaded details for ${selected.athleteName}`);
    }
  };

  // Reason checkbox toggle
  const handleToggleReason = (reason) => {
    setFormData((prev) => {
      const exists = prev.reasons.includes(reason);
      const updated = exists
        ? prev.reasons.filter((r) => r !== reason)
        : [...prev.reasons, reason];
      return { ...prev, reasons: updated };
    });
  };

  // Health screen question toggle
  const handleToggleHealth = (key, val) => {
    setFormData((prev) => {
      const updated = { ...prev.healthScreen, [key]: val };
      // Check if any is Yes; if chest pain or heart condition, suggest referral
      const hasSevere = updated.chestPain || updated.heartCondition || updated.dizziness;
      return {
        ...prev,
        healthScreen: updated,
        clearedToTest: hasSevere ? "Referred" : prev.clearedToTest,
      };
    });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      ...INITIAL_FORM,
      date: new Date().toISOString().split("T")[0],
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setFormData({
      athleteName: item.athleteName || "",
      memberId: item.memberId || "",
      athleteId: item.athleteId?._id || item.athleteId || null,
      age: item.age || "",
      gender: item.gender || "Male",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      coach: item.coach || "Vivek",
      emergencyContactName: item.emergencyContactName || "",
      relationship: item.relationship || "",
      emergencyContactNumber: item.emergencyContactNumber || "",
      dominantHand: item.dominantHand || "Right",
      reasons: item.reasons || [],
      inYourOwnWords: item.inYourOwnWords || "",
      whyNow: item.whyNow || "",
      deadline: item.deadline || "",
      triedBefore: item.triedBefore || "",
      nonNegotiables: item.nonNegotiables || "",
      confidence: item.confidence !== undefined ? item.confidence : 8,
      theNumberWeWillUse: item.theNumberWeWillUse || "",
      whereItIsToday: item.whereItIsToday || "",
      nextBlockTarget: item.nextBlockTarget || "",
      athleteAgrees: item.athleteAgrees !== undefined ? item.athleteAgrees : true,
      healthScreen: item.healthScreen || INITIAL_FORM.healthScreen,
      detailYesAnswer: item.detailYesAnswer || "",
      restingHeartRate: item.restingHeartRate || "",
      bloodPressure: item.bloodPressure || "",
      bpRetest: item.bpRetest || "",
      clearedToTest: item.clearedToTest || "Cleared",
      status: item.status || "Completed",
      notes: item.notes || "",
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.athleteName.trim()) {
      toast.error("Athlete Name is required");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        const { data } = await updateGoalsReadiness(currentId, formData);
        if (data && data.success) {
          toast.success("Goals & Readiness record updated!");
          setIsModalOpen(false);
          fetchAssessments();
          fetchStats();
        }
      } else {
        const { data } = await createGoalsReadiness(formData);
        if (data && data.success) {
          toast.success("Goals & Readiness record saved!");
          setIsModalOpen(false);
          fetchAssessments();
          fetchStats();
        }
      }
    } catch (err) {
      console.error("Error saving assessment:", err);
      toast.error(err.response?.data?.message || "Failed to save assessment");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action
  const handleDelete = async (id) => {
    try {
      const { data } = await deleteGoalsReadiness(id);
      if (data && data.success) {
        toast.success("Assessment record deleted");
        setDeletingId(null);
        fetchAssessments();
        fetchStats();
      }
    } catch (err) {
      console.error("Error deleting assessment:", err);
      toast.error(err.response?.data?.message || "Failed to delete record");
    }
  };

  // Trigger print
  const handlePrintSheet = () => {
    window.print();
  };

  const hasAnyHealthIssue = formData.healthScreen && Object.values(formData.healthScreen).some((v) => v === true);

  return (
    <div className="p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6 max-w-8xl mx-auto text-[var(--db-text)]">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Yellow Box & Cross Brand accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--db-accent)] via-yellow-300 to-[var(--db-accent)]" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-[var(--db-accent)] text-black font-mono">
              01 READINESS
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
              Measure • Train • Retest
            </span>
          </div>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wide text-[var(--db-text-title)]"
            style={{ fontFamily: '"BrutalType Bold", sans-serif' }}
          >
            Goals & Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[var(--db-text-muted)]">
            Athlete intake assessment, verbatim goals, performance targets & 9-point health screen.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 w-full sm:w-auto">
          <button
            onClick={() => {
              fetchAssessments(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] hover:border-[var(--db-accent-highlight)] transition-all cursor-pointer shadow-sm"
            title="Refresh database"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Assessments */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-3.5 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] uppercase font-black tracking-wider text-[var(--db-text-muted)] truncate">
              Total Screened
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <ClipboardCheck size={15} />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-3xl font-black text-[var(--db-text)] font-mono">
              {stats.total}
            </span>
            <span className="text-[10px] text-[var(--db-text-muted)] font-semibold truncate">Records</span>
          </div>
        </div>

        {/* Cleared to Test */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-black tracking-wider text-[var(--db-text-muted)]">
              Cleared to Test
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {stats.cleared}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-bold">
              {stats.total > 0 ? `${Math.round((stats.cleared / stats.total) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        {/* Referred / Health Hold */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-black tracking-wider text-[var(--db-text-muted)]">
              Doctor Referral
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {stats.referred}
            </span>
            <span className="text-[10px] text-rose-400/80 font-bold">Needs Clearance</span>
          </div>
        </div>

        {/* Retention Flags (Score <= 5) */}
        <div
          onClick={() => setRetentionOnly(!retentionOnly)}
          className={`bg-[var(--db-card)] border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01] ${
            retentionOnly
              ? "border-amber-400 ring-2 ring-amber-400/20"
              : "border-[var(--db-card-border)] hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-black tracking-wider text-[var(--db-text-muted)]">
              Retention Risk (≤5)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {stats.retentionFlags}
            </span>
            <span className="text-[10px] text-amber-400/80 font-bold">90-Day Flags</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
          <input
            type="text"
            placeholder="Search athlete, Member ID, coach..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] placeholder:text-[var(--db-text-muted)]/60 focus:outline-none focus:border-[var(--db-accent-highlight)] transition-all font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Clearance Filter */}
          <select
            value={clearedFilter}
            onChange={(e) => setClearedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-semibold cursor-pointer focus:outline-none focus:border-[var(--db-accent-highlight)]"
          >
            <option value="All">All Clearance</option>
            <option value="Cleared">Cleared Only</option>
            <option value="Referred">Doctor Referral</option>
          </select>

          {/* Retention Flag Quick Toggle */}
          <button
            onClick={() => setRetentionOnly(!retentionOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              retentionOnly
                ? "bg-amber-500/20 text-amber-400 border-amber-500"
                : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)] border-[var(--db-input-border)] hover:text-white"
            }`}
          >
            ⚠️ Retention Flags
          </button>

          {(search || clearedFilter !== "All" || coachFilter !== "All" || retentionOnly) && (
            <button
              onClick={() => {
                setSearch("");
                setClearedFilter("All");
                setCoachFilter("All");
                setRetentionOnly(false);
              }}
              className="text-xs font-bold text-red-400 hover:text-red-300 px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--db-accent-highlight)] animate-pulse" />
            <h2
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--db-text)]"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              Goals & Readiness Directory ({assessments.length})
            </h2>
          </div>
          <span className="text-[11px] text-[var(--db-text-muted)] font-medium hidden sm:inline">
            Click 'View Sheet' to review or print official Box & Cross intake form
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[var(--db-text-muted)] gap-3">
            <div className="w-9 h-9 border-2 border-[var(--db-accent-highlight)]/20 border-t-[var(--db-accent-highlight)] rounded-full animate-spin" />
            <p className="text-xs font-semibold">Loading assessments database...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-16 text-center px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] mx-auto flex items-center justify-center border border-[var(--db-accent-highlight)]/20">
              <ClipboardCheck size={28} />
            </div>
            <h3 className="text-base font-bold text-[var(--db-text)]">
              No Goals & Readiness Records Found
            </h3>
            <p className="text-xs text-[var(--db-text-muted)] max-w-md mx-auto">
              Create the first 45-60 min athlete intake assessment with verbatim goals, performance targets and health screen.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus size={14} /> Add Assessment
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Assessment Cards View (Visible on Mobile Only) */}
            <div className="block md:hidden divide-y divide-[var(--db-card-border)]">
              {assessments.map((item) => {
                const isRetentionFlag =
                  item.confidence !== undefined && item.confidence <= 5;
                const isReferred = item.clearedToTest === "Referred";

                return (
                  <div
                    key={item._id}
                    className="p-3.5 space-y-2.5 hover:bg-[var(--db-sidebar-link-hover)]/40 transition-colors"
                  >
                    {/* Top: Athlete Name & Clearance pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => setViewingRecord(item)}
                        className="flex items-center gap-2.5 cursor-pointer min-w-0"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-[var(--db-card-border)] flex items-center justify-center font-black text-xs text-[var(--db-accent-highlight)] shrink-0 shadow-sm">
                          {item.athleteName
                            ? item.athleteName.charAt(0).toUpperCase()
                            : "A"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--db-text)] text-xs truncate hover:text-[var(--db-accent-highlight)] transition-colors">
                            {item.athleteName}
                          </p>
                          <div className="text-[10px] text-[var(--db-text-muted)] flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span>
                              {item.date
                                ? new Date(item.date).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[var(--db-accent-highlight)] font-bold">
                              #{item.memberId || "NEW"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                          isReferred
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isReferred
                              ? "bg-rose-400"
                              : "bg-emerald-400 animate-pulse"
                          }`}
                        />
                        <span>{item.clearedToTest || "Cleared"}</span>
                      </span>
                    </div>

                    {/* Badges: Coach, 90d Confidence, Vitals */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] font-semibold">
                        <Dumbbell size={10} className="text-amber-400" />
                        <span>{item.coach || "Unassigned"}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-black ${
                          isRetentionFlag
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : item.confidence >= 8
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {isRetentionFlag && "⚠️ "}
                        Conf: {item.confidence}/10
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] font-mono">
                        BP: {item.bloodPressure || "—"}{" "}
                        {item.restingHeartRate
                          ? `• ${item.restingHeartRate}bpm`
                          : ""}
                      </span>
                    </div>

                    {/* Reasons & Goals tags */}
                    {item.reasons && item.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.reasons.slice(0, 2).map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--db-input-bg)] text-[var(--db-text-muted)] border border-[var(--db-card-border)] truncate max-w-[140px]"
                          >
                            {r}
                          </span>
                        ))}
                        {item.reasons.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--db-accent-highlight)]/15 text-[var(--db-accent-highlight)]">
                            +{item.reasons.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center justify-between pt-1 border-t border-[var(--db-card-border)]/60">
                      <button
                        onClick={() => setViewingRecord(item)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] text-[10px] font-bold inline-flex items-center gap-1 hover:bg-[var(--db-accent-highlight)]/20 cursor-pointer"
                      >
                        <Eye size={12} /> View Sheet
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-white transition-all cursor-pointer"
                          title="Edit Assessment"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingId(item._id)}
                          className="p-1.5 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1260px]">
                <thead>
                  <tr className="bg-[var(--db-input-bg)]/80 text-[var(--db-text-muted)] text-[11px] uppercase font-black tracking-widest border-b border-[var(--db-card-border)] select-none">
                    <th className="py-4 px-5 whitespace-nowrap min-w-[130px] text-left">
                      Date
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[140px] text-left">
                      Member ID
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[240px] text-left">
                      Athlete Name
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[140px] text-left">
                      Coach
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[200px] text-left">
                      Top Goals
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[120px] text-center">
                      90d Confidence
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[130px] text-left">
                      Vitals (BP/HR)
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[130px] text-center">
                      Cleared?
                    </th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[190px] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)] text-xs">
                  {assessments.map((item) => {
                    const isRetentionFlag =
                      item.confidence !== undefined && item.confidence <= 5;
                    const isReferred = item.clearedToTest === "Referred";

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-[var(--db-sidebar-link-hover)]/70 transition-colors group/row"
                      >
                        {/* Date */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-[var(--db-text-muted)] font-mono text-xs">
                          <div className="inline-flex items-center gap-1.5">
                            <Calendar
                              size={13}
                              className="text-[var(--db-accent-highlight)] shrink-0"
                            />
                            <span>
                              {item.date
                                ? new Date(item.date).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </span>
                          </div>
                        </td>

                        {/* Member ID */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/20 font-mono font-bold text-xs">
                            {item.memberId || "NEW-MEMBER"}
                          </span>
                        </td>

                        {/* Athlete Name */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <div
                            onClick={() => setViewingRecord(item)}
                            className="flex items-center gap-3 cursor-pointer group/name"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-[var(--db-card-border)] flex items-center justify-center font-black text-xs text-[var(--db-accent-highlight)] shrink-0 group-hover/name:border-[var(--db-accent-highlight)] transition-all shadow-md">
                              {item.athleteName
                                ? item.athleteName.charAt(0).toUpperCase()
                                : "A"}
                            </div>
                            <div>
                              <p className="font-bold text-[var(--db-text)] text-sm group-hover/name:text-[var(--db-accent-highlight)] transition-colors whitespace-nowrap">
                                {item.athleteName}
                              </p>
                              <span className="text-[11px] text-[var(--db-text-muted)]">
                                {item.age ? `${item.age} yrs` : "Age N/A"} •{" "}
                                {item.gender || "Athlete"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Coach */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle font-semibold">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)]">
                            <Dumbbell
                              size={12}
                              className="text-amber-400 shrink-0"
                            />
                            <span>{item.coach || "Unassigned"}</span>
                          </div>
                        </td>

                        {/* Top Goals */}
                        <td className="py-4 px-5 align-middle">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {item.reasons && item.reasons.length > 0 ? (
                              <>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--db-input-bg)] text-[var(--db-text)] border border-[var(--db-card-border)] whitespace-nowrap truncate max-w-[150px]">
                                  {item.reasons[0]}
                                </span>
                                {item.reasons.length > 1 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[var(--db-accent-highlight)]/15 text-[var(--db-accent-highlight)]">
                                    +{item.reasons.length - 1}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[11px] text-[var(--db-text-muted)]">
                                No reasons ticked
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 90d Confidence */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-mono shadow-sm ${
                              isRetentionFlag
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                                : item.confidence >= 8
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                            title={
                              isRetentionFlag
                                ? "Retention Alert: Score is 5 or below!"
                                : "Confidence in 90 days"
                            }
                          >
                            {isRetentionFlag && "⚠️ "}
                            {item.confidence}/10
                          </span>
                        </td>

                        {/* Vitals */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <div className="text-[11px] space-y-0.5 font-mono">
                            <p className="font-bold text-[var(--db-text)]">
                              BP:{" "}
                              <span className="text-[var(--db-accent-highlight)]">
                                {item.bloodPressure || "—"}
                              </span>
                            </p>
                            <p className="text-[var(--db-text-muted)]">
                              HR:{" "}
                              <span>
                                {item.restingHeartRate
                                  ? `${item.restingHeartRate} bpm`
                                  : "—"}
                              </span>
                            </p>
                          </div>
                        </td>

                        {/* Cleared to Test? */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm ${
                              isReferred
                                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isReferred
                                  ? "bg-rose-400"
                                  : "bg-emerald-400 animate-pulse"
                              }`}
                            />
                            <span>{item.clearedToTest || "Cleared"}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* View Sheet */}
                            <button
                              onClick={() => setViewingRecord(item)}
                              title="View Full Goals & Readiness Sheet"
                              className="p-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent-highlight)]/15 hover:border-[var(--db-accent-highlight)]/40 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit Assessment */}
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit Assessment"
                              className="p-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Delete Assessment */}
                            <button
                              onClick={() => setDeletingId(item._id)}
                              title="Delete Record"
                              className="p-2 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODAL: CREATE / EDIT GOALS & READINESS ASSESSMENT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Top Accent Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--db-accent)] text-black font-black flex items-center justify-center text-sm shadow-md">
                    01
                  </div>
                  <div>
                    <h3
                      className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--db-text)]"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {isEditing ? "Edit Goals & Readiness Form" : "New Goals & Readiness Intake"}
                    </h3>
                    <p className="text-[11px] text-[var(--db-text-muted)] font-medium">
                      Box & Cross Performance Arena • 45-60 Min Measure • Train • Retest
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-[var(--db-text-muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Tabs for Form Sections */}
              <div className="flex items-center border-b border-[var(--db-card-border)] bg-[var(--db-card)] px-4 sm:px-6 gap-2 overflow-x-auto custom-scrollbar">
                {[
                  { id: "general", label: "📋 Athlete Info", num: "00" },
                  { id: "reasons", label: "🎯 01 What Brought You Here", num: "01" },
                  { id: "coach", label: "🧭 02 Coach Translation", num: "02" },
                  { id: "health", label: "🩺 03 Health Screen", num: "03" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-[var(--db-accent-highlight)] text-[var(--db-accent-highlight)]"
                        : "border-transparent text-[var(--db-text-muted)] hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content Area */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
                {/* TAB 00: GENERAL ATHLETE INFO */}
                {activeTab === "general" && (
                  <div className="space-y-4">
                    {/* Autocomplete from existing Athletes */}
                    {athletes.length > 0 && (
                      <div className="p-3 bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-[var(--db-accent-highlight)]">
                          ⚡ Quick Fill from Existing Athlete:
                        </span>
                        <select
                          onChange={(e) => handleSelectAthlete(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] font-semibold cursor-pointer max-w-xs focus:outline-none"
                        >
                          <option value="">Select Athlete to Auto-fill...</option>
                          {athletes.map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.athleteName} ({a.memberId || "No ID"})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Athlete Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.athleteName}
                          onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Member ID
                        </label>
                        <input
                          type="text"
                          value={formData.memberId}
                          onChange={(e) => setFormData({ ...formData, memberId: e.target.value.toUpperCase() })}
                          placeholder="BOXCROSS-001"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Assessment Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="e.g. 29"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Gender (M / F / Other)
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-semibold cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Coach
                        </label>
                        <input
                          type="text"
                          value={formData.coach}
                          onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                          placeholder="e.g. Vivek"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          placeholder="Full Name"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={formData.relationship}
                          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                          placeholder="e.g. Spouse, Parent, Friend"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Emergency Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContactNumber}
                          onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Dominant Hand
                        </label>
                        <select
                          value={formData.dominantHand}
                          onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-semibold cursor-pointer"
                        >
                          <option value="Right">Right</option>
                          <option value="Left">Left</option>
                          <option value="Ambidextrous">Ambidextrous</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 01: WHAT BROUGHT YOU HERE */}
                {activeTab === "reasons" && (
                  <div className="space-y-5">
                    {/* Checklist of Reasons */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs uppercase font-black tracking-wider text-[var(--db-text)]">
                          Tick One or Two Reasons — Then Ask The Open Question
                        </label>
                        <span className="text-[10px] text-[var(--db-accent-highlight)] font-bold">
                          Selected: {formData.reasons.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {REASONS_LIST.map((r) => {
                          const isSelected = formData.reasons.includes(r);
                          return (
                            <button
                              type="button"
                              key={r}
                              onClick={() => handleToggleReason(r)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                isSelected
                                  ? "bg-[var(--db-accent-highlight)]/15 border-[var(--db-accent-highlight)] text-[var(--db-text)] shadow-sm"
                                  : "bg-[var(--db-input-bg)] border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-white"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                                  isSelected
                                    ? "bg-[var(--db-accent)] text-black border-[var(--db-accent)] font-black"
                                    : "border-neutral-600 bg-black/40"
                                }`}
                              >
                                {isSelected ? "✓" : ""}
                              </div>
                              <span className="truncate">{r}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Open Qualitative Questions */}
                    <div className="space-y-3 pt-3 border-t border-[var(--db-card-border)]">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          In Your Own Words (Athlete Speaks, Coach Writes It Verbatim)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.inYourOwnWords}
                          onChange={(e) => setFormData({ ...formData, inYourOwnWords: e.target.value })}
                          placeholder="Type verbatim what the athlete said..."
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Why Now? (What Changed?)
                          </label>
                          <input
                            type="text"
                            value={formData.whyNow}
                            onChange={(e) => setFormData({ ...formData, whyNow: e.target.value })}
                            placeholder="e.g. Doctor recommendation, wedding, renewed motivation"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Deadline (A Date That Actually Matters)
                          </label>
                          <input
                            type="text"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            placeholder="e.g. Bout, Race, Wedding, or 'None'"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Tried Before (What did you try, and what stopped it?)
                          </label>
                          <input
                            type="text"
                            value={formData.triedBefore}
                            onChange={(e) => setFormData({ ...formData, triedBefore: e.target.value })}
                            placeholder="e.g. Gym membership for 2 months, stopped due to shoulder pain"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Non-Negotiables (What you won't / can't do — times, travel, etc.)
                          </label>
                          <input
                            type="text"
                            value={formData.nonNegotiables}
                            onChange={(e) => setFormData({ ...formData, nonNegotiables: e.target.value })}
                            placeholder="e.g. No early 6 AM sessions, travels on Wednesdays"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none"
                          />
                        </div>
                      </div>

                      {/* 90 Days Confidence Scale */}
                      <div className="p-4 rounded-xl bg-[var(--db-input-bg)]/80 border border-[var(--db-card-border)] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs uppercase font-black tracking-wider text-[var(--db-text)]">
                            Confidence: Still training here in 90 days? (1 - 10)
                          </label>
                          <span
                            className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg ${
                              formData.confidence <= 5
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            }`}
                          >
                            Score: {formData.confidence} / 10
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 justify-between">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              type="button"
                              key={num}
                              onClick={() => setFormData({ ...formData, confidence: num })}
                              className={`flex-1 py-2 rounded-lg font-black text-xs transition-all cursor-pointer ${
                                formData.confidence === num
                                  ? num <= 5
                                    ? "bg-rose-500 text-white shadow-md scale-105"
                                    : "bg-[var(--db-accent)] text-black shadow-md scale-105"
                                  : "bg-[var(--db-card)] text-[var(--db-text-muted)] hover:text-white border border-[var(--db-card-border)]"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        {formData.confidence <= 5 && (
                          <div className="flex items-center gap-2 text-rose-400 text-[11px] font-semibold pt-1">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>5 or below is a retention flag from day one — tell the head coach.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 02: COACH TRANSLATION */}
                {activeTab === "coach" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <p className="font-bold uppercase tracking-wider">
                        🗣️ Say It Out Loud • The Athlete Has To Agree It Is Fair
                      </p>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        "Bodyweight is not our primary performance target. Translate 'Lose weight' into waist, recovery heart rate, and strength. Nobody leaves this page without one measurable number and a next-block target."
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          The Number We Will Use (Primary Metric)
                        </label>
                        <input
                          type="text"
                          value={formData.theNumberWeWillUse}
                          onChange={(e) => setFormData({ ...formData, theNumberWeWillUse: e.target.value })}
                          placeholder="e.g. Waist Circumference (inches) / Resting HR"
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Where It Is Today (Current Baseline)
                        </label>
                        <input
                          type="text"
                          value={formData.whereItIsToday}
                          onChange={(e) => setFormData({ ...formData, whereItIsToday: e.target.value })}
                          placeholder="e.g. 36 inches / 78 bpm"
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-bold font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--db-accent-highlight)]/10 border border-[var(--db-accent-highlight)]/20 space-y-2">
                      <label className="block text-[11px] uppercase font-black text-[var(--db-accent-highlight)]">
                        Next Block Target: 90 Days — 6 Wks in a Competition Build
                      </label>
                      <input
                        type="text"
                        value={formData.nextBlockTarget}
                        onChange={(e) => setFormData({ ...formData, nextBlockTarget: e.target.value })}
                        placeholder="e.g. 33 inches waist / Sub-65 bpm recovery HR"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:border-[var(--db-accent-highlight)] outline-none font-black font-mono"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase text-[var(--db-text)]">
                          Athlete Agrees This is a Fair Translation
                        </p>
                        <p className="text-[11px] text-[var(--db-text-muted)]">
                          If no, rewrite it until they do.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, athleteAgrees: true })}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            formData.athleteAgrees
                              ? "bg-emerald-500 text-black shadow-md font-black"
                              : "bg-[var(--db-card)] text-[var(--db-text-muted)] border border-[var(--db-card-border)]"
                          }`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, athleteAgrees: false })}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !formData.athleteAgrees
                              ? "bg-rose-500 text-white shadow-md font-black"
                              : "bg-[var(--db-card)] text-[var(--db-text-muted)] border border-[var(--db-card-border)]"
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 03: HEALTH SCREEN */}
                {activeTab === "health" && (
                  <div className="space-y-5">
                    {/* Guidance Banner */}
                    <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-black uppercase tracking-wider text-[var(--db-accent-highlight)]">
                        SEATED • 5 MIN REST BEFORE BP — DO NOT SKIP IT
                      </span>
                      <span className="text-[11px] text-neutral-400">9-Point Protocol</span>
                    </div>

                    {/* 9 Health Questions Table */}
                    <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden divide-y divide-[var(--db-card-border)] text-xs">
                      {HEALTH_QUESTIONS.map((q) => {
                        const val = formData.healthScreen[q.key];
                        return (
                          <div
                            key={q.key}
                            className={`p-3 flex items-center justify-between gap-4 transition-colors ${
                              val ? "bg-rose-500/10" : "bg-[var(--db-card)]"
                            }`}
                          >
                            <span className={`font-medium ${val ? "text-rose-300 font-bold" : "text-[var(--db-text)]"}`}>
                              {q.label}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleHealth(q.key, false)}
                                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                                  !val
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                                }`}
                              >
                                NO
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleHealth(q.key, true)}
                                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                                  val
                                    ? "bg-rose-500 text-white font-black shadow-md"
                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                                }`}
                              >
                                YES
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Detail any YES answer */}
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Detail Any YES Answer (Required if any health flag is ticked)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.detailYesAnswer}
                        onChange={(e) => setFormData({ ...formData, detailYesAnswer: e.target.value })}
                        placeholder="Provide details on injuries, pain, surgery or medical conditions..."
                        className={`w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border text-xs text-[var(--db-text)] outline-none ${
                          hasAnyHealthIssue && !formData.detailYesAnswer
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]"
                        }`}
                      />
                    </div>

                    {/* Vitals & Retest */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Resting Heart Rate (BPM)
                        </label>
                        <input
                          type="number"
                          value={formData.restingHeartRate}
                          onChange={(e) => setFormData({ ...formData, restingHeartRate: e.target.value })}
                          placeholder="e.g. 72"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono font-bold focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Blood Pressure (MMHG)
                        </label>
                        <input
                          type="text"
                          value={formData.bloodPressure}
                          onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                          placeholder="e.g. 120/80"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono font-bold focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          BP Retest (If 140/90+)
                        </label>
                        <input
                          type="text"
                          value={formData.bpRetest}
                          onChange={(e) => setFormData({ ...formData, bpRetest: e.target.value })}
                          placeholder="e.g. 138/86"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono focus:border-[var(--db-accent-highlight)] outline-none"
                        />
                      </div>
                    </div>

                    {/* Cleared to Test Radio / Buttons */}
                    <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs uppercase font-black tracking-wider text-[var(--db-text)]">
                          Cleared to Test?
                        </span>
                        <p className="text-[11px] text-[var(--db-text-muted)]">
                          Safety sign-off before physical testing
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, clearedToTest: "Cleared" })}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                            formData.clearedToTest === "Cleared"
                              ? "bg-emerald-500 text-black shadow-lg"
                              : "bg-[var(--db-card)] text-neutral-400 border border-[var(--db-card-border)]"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          YES — CLEARED
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, clearedToTest: "Referred" })}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                            formData.clearedToTest === "Referred"
                              ? "bg-rose-500 text-white shadow-lg"
                              : "bg-[var(--db-card)] text-neutral-400 border border-[var(--db-card-border)]"
                          }`}
                        >
                          <ShieldAlert size={14} />
                          NO — REFER
                        </button>
                      </div>
                    </div>

                    {/* STOP AND REFER WARNING NOTICE (Exact Box from sheet) */}
                    <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-1.5 text-xs text-rose-300">
                      <p className="font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                        <AlertTriangle size={15} />
                        STOP AND REFER IF ANY OF THESE APPEAR:
                      </p>
                      <p className="text-[11px] leading-relaxed text-rose-200/90 font-medium">
                        BP 160/100 or above • BP 140/90 or above on a second reading • chest pain or pressure • dizziness or fainting • breathlessness out of proportion to effort • resting HR above 100 • any acute or undiagnosed pain • surgery within 3 months • pregnancy • any known cardiac condition or medication for one.
                      </p>
                      <p className="text-[11px] italic text-rose-200/70 pt-1">
                        Say: "I'm going to stop the testing here. Nothing to worry about, but I'm not the right person to clear this — get a doctor's sign-off and come straight back." Then book the follow-up.
                      </p>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-[var(--db-card-border)] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[var(--db-text-muted)]">
                    Step: {activeTab === "general" ? "1 of 4" : activeTab === "reasons" ? "2 of 4" : activeTab === "coach" ? "3 of 4" : "4 of 4"}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--db-text-muted)] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : isEditing ? "Update Assessment" : "Save Assessment"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW PRINTABLE DIGITAL SHEET (Matching Reference Image) */}
      <AnimatePresence>
        {viewingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-black rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Header with Print button */}
              <div className="p-3 bg-neutral-900 text-white flex items-center justify-between print:hidden">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-yellow-400" />
                  Official Goals & Readiness Document
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintSheet}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-400 text-black text-xs font-black uppercase hover:bg-yellow-300 transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    onClick={() => setViewingRecord(null)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Printable Body - Exact Replica of Reference Image */}
              <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
                {/* Reference Header Banner */}
                <div className="border-4 border-black flex items-stretch">
                  <div className="bg-black text-white p-3 sm:p-4 w-1/3 flex flex-col justify-center">
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">BOX & CROSS</h2>
                    <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">
                      PERFORMANCE ARENA
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
                    <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide">
                      GOALS & READINESS
                    </h1>
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                      45-60 MIN • MEASURE • TRAIN • RETEST
                    </p>
                  </div>
                  <div className="bg-yellow-400 text-black p-2 font-mono font-black text-xs [writing-mode:vertical-rl] rotate-180 flex items-center justify-center uppercase tracking-widest">
                    01 READINESS
                  </div>
                </div>

                {/* Athlete General Info Table Grid */}
                <div className="border border-black divide-y divide-black text-[11px]">
                  <div className="grid grid-cols-6 divide-x divide-black p-1.5 font-bold uppercase">
                    <div className="col-span-2">
                      <span className="text-[9px] text-neutral-500 block">ATHLETE NAME</span>
                      <span className="font-black text-xs">{viewingRecord.athleteName || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">MEMBER ID</span>
                      <span className="font-mono font-black">{viewingRecord.memberId || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">AGE</span>
                      <span>{viewingRecord.age || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">M / F</span>
                      <span>{viewingRecord.gender?.charAt(0) || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">COACH</span>
                      <span>{viewingRecord.coach || "Vivek"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 divide-x divide-black p-1.5 font-bold uppercase">
                    <div className="col-span-2">
                      <span className="text-[9px] text-neutral-500 block">EMERGENCY CONTACT - NAME</span>
                      <span>{viewingRecord.emergencyContactName || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">RELATIONSHIP</span>
                      <span>{viewingRecord.relationship || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">DOMINANT HAND</span>
                      <span>{viewingRecord.dominantHand || "Right"}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 01: WHAT BROUGHT YOU HERE */}
                <div className="border border-black">
                  <div className="bg-black text-white p-1.5 flex items-center justify-between font-black uppercase text-[10px]">
                    <span>01 WHAT BROUGHT YOU HERE</span>
                    <span className="text-yellow-400">TICK ONE OR TWO — THEN ASK THE OPEN QUESTION</span>
                  </div>

                  {/* Checklist Grid */}
                  <div className="p-3 grid grid-cols-3 gap-2 border-b border-black text-[11px]">
                    {REASONS_LIST.map((r) => {
                      const isChecked = viewingRecord.reasons?.includes(r);
                      return (
                        <div key={r} className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 border border-black flex items-center justify-center font-bold text-[10px] ${isChecked ? "bg-black text-white" : ""}`}>
                            {isChecked ? "✓" : ""}
                          </span>
                          <span className={isChecked ? "font-black" : "text-neutral-700"}>{r}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Verbatim Questions */}
                  <div className="divide-y divide-black text-[11px]">
                    <div className="p-2">
                      <span className="text-[9px] font-black uppercase text-neutral-500 block">
                        IN YOUR OWN WORDS: ATHLETE SPEAKS, COACH WRITES IT VERBATIM
                      </span>
                      <p className="font-semibold italic text-neutral-900 mt-0.5">
                        {viewingRecord.inYourOwnWords ? `"${viewingRecord.inYourOwnWords}"` : "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-black p-2">
                      <div>
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">
                          WHY NOW: WHAT CHANGED?
                        </span>
                        <p className="font-semibold">{viewingRecord.whyNow || "—"}</p>
                      </div>
                      <div className="pl-2">
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">
                          DEADLINE: A DATE THAT ACTUALLY MATTERS
                        </span>
                        <p className="font-semibold">{viewingRecord.deadline || "—"}</p>
                      </div>
                    </div>

                    <div className="p-2 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-neutral-500">
                        CONFIDENCE: STILL TRAINING HERE IN 90 DAYS? 1-10
                      </span>
                      <span className="font-black text-sm font-mono px-2 py-0.5 bg-neutral-200 border border-black">
                        {viewingRecord.confidence || "—"} / 10
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 02: COACH TRANSLATION */}
                <div className="border border-black">
                  <div className="bg-black text-white p-1.5 flex items-center justify-between font-black uppercase text-[10px]">
                    <span>02 COACH TRANSLATION</span>
                    <span className="text-yellow-400">SAY IT OUT LOUD • THE ATHLETE HAS TO AGREE IT IS FAIR</span>
                  </div>

                  <div className="divide-y divide-black text-[11px]">
                    <div className="grid grid-cols-3 divide-x divide-black p-2">
                      <div>
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">THE NUMBER WE WILL USE</span>
                        <span className="font-black">{viewingRecord.theNumberWeWillUse || "—"}</span>
                      </div>
                      <div className="pl-2">
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">WHERE IT IS TODAY</span>
                        <span className="font-black font-mono">{viewingRecord.whereItIsToday || "—"}</span>
                      </div>
                      <div className="pl-2 bg-yellow-100">
                        <span className="text-[9px] font-black uppercase text-black block">NEXT BLOCK TARGET (90 DAYS)</span>
                        <span className="font-black font-mono">{viewingRecord.nextBlockTarget || "—"}</span>
                      </div>
                    </div>

                    <div className="p-2 flex items-center justify-between bg-neutral-50 text-[10px]">
                      <span>ATHLETE AGREES THIS IS A FAIR TRANSLATION:</span>
                      <span className="font-black border border-black px-2 py-0.5 bg-white">
                        {viewingRecord.athleteAgrees ? "YES [✓]" : "NO [ ]"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 03: HEALTH SCREEN */}
                <div className="border border-black">
                  <div className="bg-black text-white p-1.5 flex items-center justify-between font-black uppercase text-[10px]">
                    <span>03 HEALTH SCREEN</span>
                    <span className="text-yellow-400">SEATED • 5 MIN REST BEFORE BP — DO NOT SKIP IT</span>
                  </div>

                  <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] divide-y divide-neutral-200">
                    {HEALTH_QUESTIONS.map((q) => {
                      const val = viewingRecord.healthScreen?.[q.key];
                      return (
                        <div key={q.key} className="flex items-center justify-between pt-1">
                          <span className={val ? "font-black text-red-600" : "text-neutral-800"}>
                            {q.label}
                          </span>
                          <span className={`font-mono font-bold px-1.5 py-0.2 border ${val ? "bg-red-600 text-white border-red-700" : "bg-neutral-100 border-neutral-300"}`}>
                            {val ? "YES" : "NO"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {viewingRecord.detailYesAnswer && (
                    <div className="p-2 bg-yellow-50 border-t border-black text-[10px]">
                      <span className="font-black uppercase text-neutral-600 block">DETAIL ANY YES ANSWER:</span>
                      <p className="font-medium text-neutral-900">{viewingRecord.detailYesAnswer}</p>
                    </div>
                  )}

                  {/* Vitals Footer */}
                  <div className="border-t border-black grid grid-cols-4 divide-x divide-black p-2 bg-neutral-100 text-[10px] font-bold">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">RESTING HR</span>
                      <span className="font-mono text-xs">{viewingRecord.restingHeartRate ? `${viewingRecord.restingHeartRate} BPM` : "—"}</span>
                    </div>
                    <div className="pl-2">
                      <span className="text-[9px] text-neutral-500 block uppercase">BLOOD PRESSURE</span>
                      <span className="font-mono text-xs">{viewingRecord.bloodPressure || "—"}</span>
                    </div>
                    <div className="pl-2">
                      <span className="text-[9px] text-neutral-500 block uppercase">BP RETEST</span>
                      <span className="font-mono text-xs">{viewingRecord.bpRetest || "—"}</span>
                    </div>
                    <div className="pl-2 flex items-center justify-between">
                      <span className="text-[9px] text-neutral-500 block uppercase">CLEARED?</span>
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] ${viewingRecord.clearedToTest === "Cleared" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                        {viewingRecord.clearedToTest || "Cleared"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stop & Refer box on print */}
                <div className="border-2 border-black p-2 text-[9.5px] leading-tight text-neutral-700">
                  <span className="font-black text-black uppercase block mb-0.5">STOP AND REFER IF ANY OF THESE APPEAR:</span>
                  BP 160/100 or above • BP 140/90 or above on a second reading • chest pain or pressure • dizziness or fainting • breathlessness out of proportion to effort • resting HR above 100 • any acute or undiagnosed pain • surgery within 3 months • pregnancy • any known cardiac condition or medication for one.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--db-text)]">
                  Delete Assessment?
                </h4>
                <p className="text-xs text-[var(--db-text-muted)] mt-1">
                  Are you sure you want to permanently delete this Goals & Readiness record? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[var(--db-input-bg)] text-[var(--db-text-muted)] hover:text-white border border-[var(--db-card-border)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoalsReadiness;
