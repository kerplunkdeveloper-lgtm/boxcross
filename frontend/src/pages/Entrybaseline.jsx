import React, { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
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
  Zap,
  Flame,
  Award,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import {
  getEntryBaselines,
  getEntryBaselineStats,
  createEntryBaseline,
  updateEntryBaseline,
  deleteEntryBaseline,
  getAthletes,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// 12 Goals from Reference Image
const GOALS_LIST = [
  "Lose weight / body fat",
  "Build strength",
  "Stamina & fitness",
  "Learn to box",
  "Self-defence",
  "Stress & headspace",
  "Sleep & energy",
  "An occasion coming up",
  "Doctor's advice",
  "Compete – bout or race",
  "Came with someone",
  "Back after a break",
];

// 9 Health Screen Questions
const HEALTH_QUESTIONS = [
  {
    key: "chestPain",
    label: "1. Chest pain or pressure, at rest or on exertion?",
  },
  { key: "dizziness", label: "2. Dizziness, blackouts or fainting?" },
  {
    key: "breathlessness",
    label: "3. Breathlessness beyond what the effort explains?",
  },
  {
    key: "heartCondition",
    label: "4. Ever been told you have a heart condition?",
  },
  { key: "previousInjury", label: "5. Previous injury still affecting you?" },
  { key: "surgeryLast3Months", label: "6. Surgery in the last 3 months?" },
  {
    key: "jointOrBackPain",
    label: "7. Joint or back pain that limits movement?",
  },
  { key: "regularMedication", label: "8. On any regular medication?" },
  { key: "pregnant", label: "9. Pregnant, or possibly pregnant?" },
];

// 6 Movement Screen Tests
const MOVEMENT_TESTS = [
  { key: "overheadSquat", label: "1 Overhead squat", hasTime: false },
  { key: "singleLegStepDown", label: "2 Single-leg step-down", hasTime: false },
  { key: "shoulderMobility", label: "3 Shoulder mobility", hasTime: false },
  { key: "hipHinge", label: "4 Hip hinge", hasTime: false },
  { key: "trunkControl", label: "5 Trunk control (plank, sec)", hasTime: true },
  { key: "balance", label: "6 Balance (single leg, sec)", hasTime: true },
];

const INITIAL_FORM = {
  name: "",
  memberId: "",
  athleteId: null,
  age: "",
  gender: "M",
  phone: "",
  date: new Date().toISOString().split("T")[0],
  coach: "",
  goals: [],
  inTheirOwnWords: "",
  whyNow: "",
  triedBefore: "",
  wontDoCantDo: "",
  theNumberWeWillUse: "",
  whereItIsToday: "",
  nextBlockTarget: "",
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
  detailAnyYes: "",
  restingHR: "",
  bloodPressure: "",
  clearedToTest: "YES",
  movementScreen: {
    overheadSquat: { result: "PASS", note: "" },
    singleLegStepDown: { result: "PASS", note: "" },
    shoulderMobility: { result: "PASS", note: "" },
    hipHinge: { result: "PASS", note: "" },
    trunkControl: { result: "PASS", note: "", seconds: "" },
    balance: { result: "PASS", note: "", seconds: "" },
  },
  gripLeft: "",
  gripRight: "",
  gripStrongerHand: "",
  pushUps: "",
  waist: "",
  stepTest: {
    pulse15Sec: "",
    hrAtFinish: "",
    hrAfter60Sec: "",
    recoveryHR: "",
    estVo2Max: "",
  },
  level: "FOUND",
  programmeSuggested: "",
  oneThingGoodAt: "",
  oneThingWorkOnFirst: "",
  fullAssessmentBooked: "",
  cardHandedOver: true,
  joinedToday: false,
  followUpDate: "",
  enteredToTracker: true,
  cardNotes: {
    youAreAlreadyGoodAt: "",
    weStartHere: "",
    wereProtecting: "",
    whatYouToldUs: "",
  },
  notes: "",
};

const Entrybaseline = () => {
  const [baselines, setBaselines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    cleared: 0,
    referred: 0,
    joinedToday: 0,
    avgVo2Max: 0,
    avgRecoveryHR: 0,
    avgGrip: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [clearedFilter, setClearedFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [joinedFilter, setJoinedFilter] = useState("All");
  const [coachFilter, setCoachFilter] = useState("All");

  // Athlete Autocomplete & Linking
  const [athletes, setAthletes] = useState([]);
  const [athleteSearchTerm, setAthleteSearchTerm] = useState("");
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formStep, setFormStep] = useState("01"); // '01', '02', '03', '04', '05', '06'
  const [submitting, setSubmitting] = useState(false);

  // View / Print Modal
  const [viewingRecord, setViewingRecord] = useState(null);
  const [pdfSheetMode, setPdfSheetMode] = useState("both"); // 'page1', 'page2', 'both'

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Baselines
  const fetchBaselines = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      setRefreshing(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (clearedFilter !== "All") params.clearedToTest = clearedFilter;
      if (levelFilter !== "All") params.level = levelFilter;
      if (joinedFilter !== "All") params.joinedToday = joinedFilter;
      if (coachFilter !== "All") params.coach = coachFilter;

      const res = await getEntryBaselines(params);
      if (res?.data?.success) {
        setBaselines(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading Entry Baselines:", err);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await getEntryBaselineStats();
      if (res?.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // Fetch Athletes for quick autofill
  const fetchAthletesList = async () => {
    try {
      const res = await getAthletes({ limit: 100 });
      if (res?.data?.success) {
        setAthletes(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading athletes:", err);
    }
  };

  useEffect(() => {
    fetchBaselines(true);
    fetchStats();
    fetchAthletesList();
  }, []);

  // Filter Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBaselines(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, clearedFilter, levelFilter, joinedFilter, coachFilter]);

  // Unique coaches list
  const uniqueCoaches = useMemo(() => {
    const s = new Set();
    baselines.forEach((b) => {
      if (b.coach) s.add(b.coach);
    });
    return Array.from(s);
  }, [baselines]);

  // Handle Goal Toggle
  const toggleGoal = (goalText) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalText);
      const updated = exists
        ? prev.goals.filter((g) => g !== goalText)
        : [...prev.goals, goalText];
      return { ...prev, goals: updated };
    });
  };

  // Handle Health Screen Toggle
  const toggleHealth = (key, val) => {
    setFormData((prev) => {
      const updatedHealth = { ...prev.healthScreen, [key]: val };
      // Check if any is true
      const hasAnyIssue = Object.values(updatedHealth).some((v) => v === true);
      return {
        ...prev,
        healthScreen: updatedHealth,
        clearedToTest: hasAnyIssue ? "NO - REFER" : prev.clearedToTest,
      };
    });
  };

  // Auto-calculations for Step test & Grip
  const handleGripChange = (side, val) => {
    setFormData((prev) => {
      const left =
        side === "left" ? parseFloat(val) || 0 : parseFloat(prev.gripLeft) || 0;
      const right =
        side === "right"
          ? parseFloat(val) || 0
          : parseFloat(prev.gripRight) || 0;
      const stronger = Math.max(left, right);
      return {
        ...prev,
        [side === "left" ? "gripLeft" : "gripRight"]: val,
        gripStrongerHand: stronger > 0 ? stronger : "",
      };
    });
  };

  const handleStepTestChange = (field, val) => {
    setFormData((prev) => {
      const step = { ...prev.stepTest, [field]: val };

      const pulse15 = parseFloat(
        field === "pulse15Sec" ? val : step.pulse15Sec,
      );
      const finish = parseFloat(field === "hrAtFinish" ? val : step.hrAtFinish);
      const after60 = parseFloat(
        field === "hrAfter60Sec" ? val : step.hrAfter60Sec,
      );

      // Recovery HR drop
      if (!isNaN(finish) && !isNaN(after60)) {
        step.recoveryHR = Math.max(0, Math.round(finish - after60));
      }

      // Est VO2 Max Formula
      const bpm = !isNaN(pulse15)
        ? pulse15 * 4
        : !isNaN(finish)
          ? finish
          : null;
      if (bpm) {
        const isFemale = (prev.gender || "").toUpperCase().startsWith("F");
        if (isFemale) {
          step.estVo2Max = Math.round((65.81 - 0.1847 * bpm) * 10) / 10;
        } else {
          step.estVo2Max = Math.round((111.33 - 0.42 * bpm) * 10) / 10;
        }
      }

      return { ...prev, stepTest: step };
    });
  };

  // Movement test change
  const handleMovementChange = (testKey, field, val) => {
    setFormData((prev) => ({
      ...prev,
      movementScreen: {
        ...prev.movementScreen,
        [testKey]: {
          ...prev.movementScreen[testKey],
          [field]: val,
        },
      },
    }));
  };

  // Movement Summary Counts
  const movementCounts = useMemo(() => {
    let pass = 0;
    let modify = 0;
    let refer = 0;
    Object.values(formData.movementScreen || {}).forEach((item) => {
      if (item?.result === "PASS") pass++;
      else if (item?.result === "MODIFY") modify++;
      else if (item?.result === "REFER") refer++;
    });
    return { pass, modify, refer };
  }, [formData.movementScreen]);

  // Check health warning
  const hasHealthFlag = useMemo(() => {
    const qFlags = Object.values(formData.healthScreen || {}).some(Boolean);
    const rHr = parseFloat(formData.restingHR);
    const bp = formData.bloodPressure || "";
    let highBp = false;
    if (bp.includes("/")) {
      const [sys, dia] = bp.split("/").map((v) => parseFloat(v));
      if (sys >= 140 || dia >= 90) highBp = true;
    }
    return qFlags || (rHr && rHr > 100) || highBp;
  }, [formData.healthScreen, formData.restingHR, formData.bloodPressure]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(INITIAL_FORM);
    setFormStep("01");
    setAthleteSearchTerm("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (rec) => {
    setIsEditing(true);
    setCurrentId(rec._id);
    setFormData({
      ...INITIAL_FORM,
      ...rec,
      date: rec.date ? new Date(rec.date).toISOString().split("T")[0] : "",
      healthScreen: {
        ...INITIAL_FORM.healthScreen,
        ...(rec.healthScreen || {}),
      },
      movementScreen: {
        overheadSquat: {
          ...INITIAL_FORM.movementScreen.overheadSquat,
          ...(rec.movementScreen?.overheadSquat || {}),
        },
        singleLegStepDown: {
          ...INITIAL_FORM.movementScreen.singleLegStepDown,
          ...(rec.movementScreen?.singleLegStepDown || {}),
        },
        shoulderMobility: {
          ...INITIAL_FORM.movementScreen.shoulderMobility,
          ...(rec.movementScreen?.shoulderMobility || {}),
        },
        hipHinge: {
          ...INITIAL_FORM.movementScreen.hipHinge,
          ...(rec.movementScreen?.hipHinge || {}),
        },
        trunkControl: {
          ...INITIAL_FORM.movementScreen.trunkControl,
          ...(rec.movementScreen?.trunkControl || {}),
        },
        balance: {
          ...INITIAL_FORM.movementScreen.balance,
          ...(rec.movementScreen?.balance || {}),
        },
      },
      stepTest: { ...INITIAL_FORM.stepTest, ...(rec.stepTest || {}) },
      cardNotes: { ...INITIAL_FORM.cardNotes, ...(rec.cardNotes || {}) },
    });
    setFormStep("01");
    setIsModalOpen(true);
  };

  // Auto-fill from Athlete select
  const handleSelectAthlete = (ath) => {
    setFormData((prev) => ({
      ...prev,
      athleteId: ath._id,
      name: ath.athleteName || ath.name || prev.name,
      phone: ath.phone || prev.phone,
      age: ath.age || prev.age,
      gender: ath.gender?.startsWith("F") ? "F" : "M",
      memberId: ath.memberId || prev.memberId,
      coach: ath.coach || prev.coach,
    }));
    setShowAthleteDropdown(false);
    setAthleteSearchTerm("");
    toast.success(`Selected athlete ${ath.athleteName || ath.name}`);
  };

  // Save / Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Athlete / Client Name is required");
      setFormStep("01");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };

      // Ensure cardNotes fallback
      if (!payload.cardNotes?.youAreAlreadyGoodAt && payload.oneThingGoodAt) {
        payload.cardNotes = {
          ...payload.cardNotes,
          youAreAlreadyGoodAt: payload.oneThingGoodAt,
        };
      }
      if (!payload.cardNotes?.weStartHere && payload.oneThingWorkOnFirst) {
        payload.cardNotes = {
          ...payload.cardNotes,
          weStartHere: payload.oneThingWorkOnFirst,
        };
      }
      if (!payload.cardNotes?.whatYouToldUs && payload.inTheirOwnWords) {
        payload.cardNotes = {
          ...payload.cardNotes,
          whatYouToldUs: payload.inTheirOwnWords,
        };
      }

      if (isEditing) {
        const res = await updateEntryBaseline(currentId, payload);
        if (res?.data?.success) {
          toast.success("Entry Baseline updated successfully");
          setIsModalOpen(false);
          fetchBaselines();
          fetchStats();
        }
      } else {
        const res = await createEntryBaseline(payload);
        if (res?.data?.success) {
          toast.success("Entry Baseline created successfully!");
          setIsModalOpen(false);
          fetchBaselines();
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

  // Delete
  const handleDelete = async (id) => {
    try {
      const res = await deleteEntryBaseline(id);
      if (res?.data?.success) {
        toast.success("Assessment deleted successfully");
        setDeletingId(null);
        fetchBaselines();
        fetchStats();
      }
    } catch (err) {
      console.error("Error deleting assessment:", err);
      toast.error("Failed to delete assessment");
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
      {/* ── PRINT-SPECIFIC CSS INJECTION ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-assessment-card,
          #printable-assessment-card * {
            visibility: visible;
          }
          #printable-assessment-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      {/* ── HEADER & TITLE BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--db-card-border)] pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(229,255,0,0.15)] shrink-0">
              <ClipboardList size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--db-text)] uppercase font-['Brutal_Font',sans-serif]">
                  Entry Baseline
                </h1>
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded bg-[#ccf141] text-black">
                  DAY ONE • 20 MIN
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--db-text-muted)] font-medium">
                Mandatory for every enquiry, walk-in and trial. Nobody trains at
                Box & Cross without one.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              fetchBaselines(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:border-[#ccf141]/40 transition-all cursor-pointer"
            title="Refresh Assessments"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin text-[#ccf141]" : ""}
            />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d4ee00] transition-all shadow-[0_0_20px_rgba(229,255,0,0.25)] cursor-pointer"
          >
            <Plus size={15} strokeWidth={3} />
            <span>New Entry Baseline</span>
          </button>
        </div>
      </div>

      {/* ── STATS CARDS BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* Total Baselines */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] truncate">
            Total Baselines
          </span>
          <div className="flex items-baseline justify-between mt-1 sm:mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-[var(--db-text)]">
              {stats.total || 0}
            </span>
            <Activity size={16} className="text-[#ccf141]" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 truncate">
            Enquiries & Trials
          </span>
        </div>

        {/* Cleared to Test */}
        <div className="p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Cleared to Test
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {stats.cleared || 0}
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-400/80 mt-1">
            {stats.total > 0
              ? `${Math.round((stats.cleared / stats.total) * 100)}% clearance`
              : "0%"}
          </span>
        </div>

        {/* Referred / Stop Flags */}
        <div className="p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Stop & Refer
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black font-mono text-rose-400">
              {stats.referred || 0}
            </span>
            <ShieldAlert size={16} className="text-rose-400" />
          </div>
          <span className="text-[10px] text-rose-400/80 mt-1">
            Medical clearance needed
          </span>
        </div>

        {/* Joined Today */}
        <div className="p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Joined Today
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black font-mono text-[#ccf141]">
              {stats.joinedToday || 0}
            </span>
            <Flame size={16} className="text-[#ccf141]" />
          </div>
          <span className="text-[10px] text-[#ccf141]/80 mt-1">
            {stats.total > 0
              ? `${Math.round((stats.joinedToday / stats.total) * 100)}% conversion`
              : "0%"}
          </span>
        </div>

        {/* Average VO2 Max */}
        <div className="p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Avg Est. VO2 Max
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black font-mono text-sky-400">
              {stats.avgVo2Max || "—"}
            </span>
            <TrendingUp size={16} className="text-sky-400" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1">
            ml/kg/min Aerobic
          </span>
        </div>

        {/* Average Stronger Hand Grip */}
        <div className="p-3.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
            Avg Grip Power
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black font-mono text-amber-400">
              {stats.avgGrip || "—"}{" "}
              <span className="text-xs font-normal">KG</span>
            </span>
            <Dumbbell size={16} className="text-amber-400" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1">
            Stronger Hand Best
          </span>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="p-3 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, phone, coach, member ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-[#ccf141] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cleared Filter */}
          <select
            value={clearedFilter}
            onChange={(e) => setClearedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
          >
            <option value="All">All Health Status</option>
            <option value="YES">Cleared Only</option>
            <option value="NO - REFER">Stop & Refer Only</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
          >
            <option value="All">All Levels</option>
            <option value="FOUND">Foundation</option>
            <option value="DEVEL">Development</option>
            <option value="PERF">Performance</option>
          </select>

          {/* Joined Today */}
          <select
            value={joinedFilter}
            onChange={(e) => setJoinedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
          >
            <option value="All">All Joined Status</option>
            <option value="true">Joined Today [YES]</option>
            <option value="false">Not Joined Yet</option>
          </select>

          {/* Coach Filter */}
          {uniqueCoaches.length > 0 && (
            <select
              value={coachFilter}
              onChange={(e) => setCoachFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
            >
              <option value="All">All Coaches</option>
              {uniqueCoaches.map((c) => (
                <option key={c} value={c}>
                  Coach: {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── RECORDS TABLE / LIST ── */}
      <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#ccf141]/20 border-t-[#ccf141] rounded-full animate-spin" />
            <span className="text-xs uppercase font-bold tracking-wider">
              Loading Entry Baselines...
            </span>
          </div>
        ) : baselines.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-neutral-500 mx-auto flex items-center justify-center">
              <ClipboardList size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--db-text)]">
                No Entry Baselines Found
              </h3>
              <p className="text-xs text-[var(--db-text-muted)] max-w-sm mx-auto mt-1">
                {search || clearedFilter !== "All" || levelFilter !== "All"
                  ? "No records match your active filters. Try clearing them."
                  : "Begin  by recording the first 20-minute assessment for an enquiry, walk-in or new trial."}
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d4ee00] transition-all cursor-pointer"
            >
              <Plus size={15} strokeWidth={3} />
              <span>Record First Baseline</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Baseline Cards View (Visible on Mobile Only) */}
            <div className="block md:hidden divide-y divide-[var(--db-card-border)]">
              {baselines.map((rec) => {
                const isCleared = rec.clearedToTest === "YES";

                return (
                  <div
                    key={rec._id}
                    className="p-3.5 space-y-2.5 hover:bg-[var(--db-table-hover)] transition-colors"
                  >
                    {/* Top: Name, Clearance pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-[var(--db-text)]">
                            {rec.name}
                          </span>
                          {rec.gender && (
                            <span className="text-[9px] font-mono px-1 rounded bg-neutral-800 text-neutral-300">
                              {rec.gender}
                            </span>
                          )}
                          {rec.memberId && (
                            <span className="text-[10px] font-mono text-[#ccf141] font-bold">
                              #{rec.memberId}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--db-text-muted)] flex items-center gap-2 mt-0.5 flex-wrap">
                          <span>
                            {rec.date
                              ? new Date(rec.date).toLocaleDateString()
                              : "—"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User size={10} /> {rec.coach || "Vivek"}
                          </span>
                          {rec.phone && (
                            <>
                              <span>•</span>
                              <a
                                href={`tel:${rec.phone}`}
                                className="hover:text-[var(--db-accent-highlight)] flex items-center gap-1 font-mono"
                              >
                                <Phone size={10} /> {rec.phone}
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                          isCleared
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {isCleared ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <AlertTriangle size={10} />
                        )}
                        {isCleared ? "CLEARED" : "STOP & REFER"}
                      </span>
                    </div>

                    {/* Goal & Metric info */}
                    {(rec.theNumberWeWillUse || rec.goals?.[0]) && (
                      <div className="bg-[var(--db-input-bg)]/60 border border-[var(--db-card-border)] rounded-xl p-2 text-[10px]">
                        <span className="text-[var(--db-text-muted)] block text-[9px] uppercase font-bold">
                          Primary Goal & Target
                        </span>
                        <span className="font-semibold text-[var(--db-text)] block">
                          {rec.theNumberWeWillUse || rec.goals?.[0]}
                        </span>
                        {rec.nextBlockTarget && (
                          <span className="text-[#ccf141] font-mono font-bold block mt-0.5">
                            Target: {rec.nextBlockTarget}
                          </span>
                        )}
                      </div>
                    )}

                    {/* The 4 Numbers Grid */}
                    <div className="grid grid-cols-3 gap-1.5 text-center bg-[var(--db-input-bg)]/40 border border-[var(--db-card-border)] rounded-xl p-2 font-mono text-[10px]">
                      <div>
                        <span className="text-[8px] text-[var(--db-text-muted)] block uppercase font-bold">
                          Grip
                        </span>
                        <span className="font-bold text-amber-400">
                          {rec.gripStrongerHand || "—"} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[var(--db-text-muted)] block uppercase font-bold">
                          Push-ups
                        </span>
                        <span className="font-bold text-sky-400">
                          {rec.pushUps || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[var(--db-text-muted)] block uppercase font-bold">
                          Recov HR
                        </span>
                        <span className="font-bold text-rose-400">
                          -{rec.stepTest?.recoveryHR || 0}
                        </span>
                      </div>
                    </div>

                    {/* Bottom row: Level badge, Joined status, Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {rec.level || "FOUND"}
                        </span>
                        {rec.joinedToday && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#ccf141]">
                            <Sparkles size={11} /> Joined
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setViewingRecord(rec);
                            setPdfSheetMode("both");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] text-[#ccf141] border border-[var(--db-card-border)] text-[10px] font-bold inline-flex items-center gap-1 hover:bg-[#ccf141]/20 cursor-pointer"
                        >
                          <Eye size={12} /> View Sheet
                        </button>
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1 rounded-lg bg-[var(--db-input-bg)] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-[var(--db-card-border)] cursor-pointer"
                          title="Edit Assessment"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => setDeletingId(rec._id)}
                          className="p-1 rounded-lg bg-[var(--db-input-bg)] hover:bg-rose-500/15 text-neutral-300 hover:text-rose-400 border border-[var(--db-card-border)] cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)] text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] select-none">
                    <th className="py-3 px-4">Client / Athlete</th>
                    <th className="py-3 px-3">Date & Coach</th>
                    <th className="py-3 px-3">Primary Goal & Metric</th>
                    <th className="py-3 px-3">Health Clearance</th>
                    <th className="py-3 px-3">The Four Numbers</th>
                    <th className="py-3 px-3">Level</th>
                    <th className="py-3 px-3">Joined?</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)] text-[var(--db-text)]">
                  {baselines.map((rec) => {
                    const isCleared = rec.clearedToTest === "YES";
                    const passCount = Object.values(
                      rec.movementScreen || {},
                    ).filter((m) => m?.result === "PASS").length;
                    const modifyCount = Object.values(
                      rec.movementScreen || {},
                    ).filter((m) => m?.result === "MODIFY").length;

                    return (
                      <tr
                        key={rec._id}
                        className="hover:bg-[var(--db-table-hover)] transition-colors group"
                      >
                        {/* Athlete info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[13px] text-[var(--db-text)] flex items-center gap-1.5">
                            <span>{rec.name}</span>
                            {rec.gender && (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-neutral-300">
                                {rec.gender}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--db-text-muted)] flex items-center gap-2 mt-0.5">
                            {rec.age && <span>{rec.age} yrs</span>}
                            {rec.phone && (
                              <span className="font-mono flex items-center gap-1">
                                <Phone size={10} /> {rec.phone}
                              </span>
                            )}
                            {rec.memberId && (
                              <span className="font-mono text-[#ccf141] font-bold">
                                #{rec.memberId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date & Coach */}
                        <td className="py-3.5 px-3">
                          <div className="font-mono text-[11px] text-neutral-300">
                            {rec.date
                              ? new Date(rec.date).toLocaleDateString()
                              : "—"}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                            <User size={10} /> {rec.coach || "Vivek"}
                          </div>
                        </td>

                        {/* Goal & Metric */}
                        <td className="py-3.5 px-3 max-w-[190px]">
                          <div className="truncate font-semibold text-neutral-200">
                            {rec.theNumberWeWillUse ||
                              (rec.goals?.[0] ? rec.goals[0] : "—")}
                          </div>
                          {rec.nextBlockTarget && (
                            <div className="text-[10px] text-[#ccf141] font-mono font-bold truncate mt-0.5">
                              Target: {rec.nextBlockTarget}
                            </div>
                          )}
                        </td>

                        {/* Health clearance */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCleared
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {isCleared ? (
                              <CheckCircle2 size={11} />
                            ) : (
                              <AlertTriangle size={11} />
                            )}
                            {isCleared ? "CLEARED" : "STOP & REFER"}
                          </span>
                          {rec.bloodPressure && (
                            <div className="text-[10px] font-mono text-neutral-400 mt-1">
                              BP: {rec.bloodPressure}{" "}
                              {rec.restingHR ? `• ${rec.restingHR} bpm` : ""}
                            </div>
                          )}
                        </td>

                        {/* The Four Numbers */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span title="Grip (Stronger Hand)">
                              ✊{" "}
                              <strong className="text-amber-400">
                                {rec.gripStrongerHand || "—"}
                              </strong>{" "}
                              kg
                            </span>
                            <span className="text-neutral-600">|</span>
                            <span title="Push-ups max clean reps">
                              💪{" "}
                              <strong className="text-sky-400">
                                {rec.pushUps || "—"}
                              </strong>
                            </span>
                            <span className="text-neutral-600">|</span>
                            <span title="Recovery HR drop">
                              ❤️{" "}
                              <strong className="text-rose-400">
                                -{rec.stepTest?.recoveryHR || 0}
                              </strong>
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                            VO2: {rec.stepTest?.estVo2Max || "—"} • Move:{" "}
                            {passCount}P/{modifyCount}M
                          </div>
                        </td>

                        {/* Level */}
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {rec.level || "FOUND"}
                          </span>
                        </td>

                        {/* Joined Today */}
                        <td className="py-3.5 px-3">
                          {rec.joinedToday ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#ccf141]">
                              <Sparkles size={12} /> YES
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-500">
                              {rec.followUpDate
                                ? `F/U: ${rec.followUpDate}`
                                : "No"}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setViewingRecord(rec);
                                setPdfSheetMode("both");
                              }}
                              className="p-1.5 rounded-lg bg-[var(--db-input-bg)] hover:bg-[#ccf141]/15 text-neutral-300 hover:text-[#ccf141] border border-[var(--db-card-border)] transition-colors cursor-pointer"
                              title="View Official Sheet & Print PDF"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleOpenEdit(rec)}
                              className="p-1.5 rounded-lg bg-[var(--db-input-bg)] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-[var(--db-card-border)] transition-colors cursor-pointer"
                              title="Edit Assessment"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => setDeletingId(rec._id)}
                              className="p-1.5 rounded-lg bg-[var(--db-input-bg)] hover:bg-rose-500/15 text-neutral-300 hover:text-rose-400 border border-[var(--db-card-border)] transition-colors cursor-pointer"
                              title="Delete"
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

      {/* ── CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between shrink-0 bg-[var(--db-input-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30 flex items-center justify-center font-black">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--db-text)] uppercase font-['Brutal_Font',sans-serif]">
                      {isEditing
                        ? "Edit Entry Baseline"
                        : "New Entry Baseline Assessment"}
                    </h2>
                    <p className="text-[11px] text-[var(--db-text-muted)] font-mono">
                      FORM BXC-AA-01 • 20 MINUTES - DAY ONE, NO EXCEPTIONS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="px-4 py-2 border-b border-[var(--db-card-border)] flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0 bg-[var(--db-bg)]">
                {[
                  { id: "01", label: "01 Goal & Intake" },
                  { id: "02", label: "02 Coach Translation" },
                  { id: "03", label: "03 Health Screen" },
                  { id: "04", label: "04 Movement Screen" },
                  { id: "05", label: "05 The Four Numbers" },
                  { id: "06", label: "06 Close & Card" },
                ].map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setFormStep(step.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                      formStep === step.id
                        ? "bg-[#ccf141] text-black shadow-md font-black"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar"
              >
                {/* ── CLIENT & SESSION HEADER (ALWAYS VISIBLE) ── */}
                <div className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                      <User size={13} /> Client & Session Details
                    </span>
                    {/* Athlete Quick Select Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowAthleteDropdown(!showAthleteDropdown)
                        }
                        className="text-[11px] font-bold text-[#ccf141] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles size={12} /> Auto-fill from Existing Member
                      </button>

                      {showAthleteDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-2xl p-2 z-50 space-y-1">
                          <input
                            type="text"
                            value={athleteSearchTerm}
                            onChange={(e) =>
                              setAthleteSearchTerm(e.target.value)
                            }
                            placeholder="Type member name..."
                            className="w-full px-2.5 py-1.5 text-xs bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-lg text-white outline-none mb-1"
                          />
                          <div className="max-h-40 overflow-y-auto divide-y divide-neutral-800">
                            {athletes
                              .filter((a) =>
                                (a.athleteName || a.name || "")
                                  .toLowerCase()
                                  .includes(athleteSearchTerm.toLowerCase()),
                              )
                              .slice(0, 10)
                              .map((ath) => (
                                <button
                                  key={ath._id}
                                  type="button"
                                  onClick={() => handleSelectAthlete(ath)}
                                  className="w-full text-left p-1.5 hover:bg-neutral-800 rounded text-xs text-neutral-200 truncate cursor-pointer"
                                >
                                  <div className="font-bold">
                                    {ath.athleteName || ath.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-400 font-mono">
                                    {ath.phone || "No phone"} • #
                                    {ath.memberId || "NEW"}
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Full Name"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-bold outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        placeholder="e.g. 28"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Gender (M / F)
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-bold outline-none focus:border-[#ccf141]"
                      >
                        <option value="M">Male (M)</option>
                        <option value="F">Female (F)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Date & Coach
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-1/2 px-2 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-[11px] text-[var(--db-text)] font-mono outline-none"
                        />
                        <input
                          type="text"
                          value={formData.coach}
                          onChange={(e) =>
                            setFormData({ ...formData, coach: e.target.value })
                          }
                          placeholder="Coach"
                          className="w-1/2 px-2 py-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-input-border)] text-[11px] text-[var(--db-text)] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── STEP 01: GOAL ── */}
                {formStep === "01" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          01
                        </span>
                        GOAL
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        0-5 MIN • SEATED — THIS IS ALSO THE REST BEFORE THE BP
                        READING
                      </span>
                    </div>

                    {/* 12 Goals Checkbox Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GOALS_LIST.map((g) => {
                        const isChecked = formData.goals.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGoal(g)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                              isChecked
                                ? "bg-[#ccf141]/15 border-[#ccf141] text-[#ccf141] font-bold shadow-sm"
                                : "bg-[var(--db-input-bg)] border-[var(--db-card-border)] text-neutral-300 hover:text-white"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded shrink-0 flex items-center justify-center text-[10px] font-black border ${
                                isChecked
                                  ? "bg-[#ccf141] text-black border-[#ccf141]"
                                  : "border-neutral-600 bg-neutral-800"
                              }`}
                            >
                              {isChecked ? "✓" : ""}
                            </span>
                            <span className="leading-tight">{g}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Verbatim Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          In Their Own Words (Verbatim)
                        </label>
                        <input
                          type="text"
                          value={formData.inTheirOwnWords}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inTheirOwnWords: e.target.value,
                            })
                          }
                          placeholder="Client speaks, coach writes exactly what they say..."
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Why Now? (What Changed?)
                          </label>
                          <input
                            type="text"
                            value={formData.whyNow}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                whyNow: e.target.value,
                              })
                            }
                            placeholder="e.g. Wedding in 3 months, doctor warning..."
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none focus:border-[#ccf141]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Tried Before - What Stopped It
                          </label>
                          <input
                            type="text"
                            value={formData.triedBefore}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                triedBefore: e.target.value,
                              })
                            }
                            placeholder="e.g. Boredom, injury, no coach guidance..."
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none focus:border-[#ccf141]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            Won't Do / Can't Do
                          </label>
                          <input
                            type="text"
                            value={formData.wontDoCantDo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                wontDoCantDo: e.target.value,
                              })
                            }
                            placeholder="e.g. Heavy deadlifts, early mornings..."
                            className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none focus:border-[#ccf141]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 02: COACH TRANSLATION ── */}
                {formStep === "02" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          02
                        </span>
                        COACH TRANSLATION
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        SAY IT OUT LOUD • THEY HAVE TO AGREE IT IS FAIR
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 text-xs text-[#ccf141] leading-relaxed">
                      <strong>BODYWEIGHT IS NOT OUR PRIMARY TARGET.</strong>{" "}
                      Translate &ldquo;lose weight&rdquo; into waist, recovery
                      heart rate or strength — those move because of what we do
                      here. Most people arrive with a reason, not a goal; the
                      tick-list starts it, you finish it. Nobody leaves this
                      page without one number.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          The Number We Will Use
                        </label>
                        <input
                          type="text"
                          value={formData.theNumberWeWillUse}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              theNumberWeWillUse: e.target.value,
                            })
                          }
                          placeholder="e.g. Waist (cm), Resting HR, Push-ups..."
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-bold outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Where It Is Today
                        </label>
                        <input
                          type="text"
                          value={formData.whereItIsToday}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whereItIsToday: e.target.value,
                            })
                          }
                          placeholder="e.g. 96 cm, 82 bpm, 4 push-ups"
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] font-mono outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-[#ccf141]/15 border border-[#ccf141]/40">
                        <label className="block text-[11px] uppercase font-black text-black dark:text-[#ccf141] mb-1">
                          Next Block Target (Highlighted)
                        </label>
                        <input
                          type="text"
                          value={formData.nextBlockTarget}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nextBlockTarget: e.target.value,
                            })
                          }
                          placeholder="e.g. 90 cm waist in 12 weeks"
                          className="w-full px-3 py-2 rounded-lg bg-[var(--db-card)] border border-[#ccf141] text-xs text-[#ccf141] font-black font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 03: HEALTH SCREEN ── */}
                {formStep === "03" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          03
                        </span>
                        HEALTH SCREEN
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        5-7 MIN • BP ONLY AFTER 5 MINUTES SEATED
                      </span>
                    </div>

                    {/* STOP AND REFER WARNING NOTICE */}
                    {hasHealthFlag && (
                      <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/10 text-xs text-rose-300 space-y-1">
                        <div className="font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle size={15} /> STOP AND REFER PROTOCOL
                          TRIGGERED
                        </div>
                        <p className="text-[11px] text-rose-200">
                          BP 160/100 or above • BP 140/90 or above on a second
                          reading • chest pain • dizziness or fainting • resting
                          HR &gt; 100 • surgery within 3 months • pregnancy.
                        </p>
                        <div className="font-semibold italic text-white bg-black/40 p-2 rounded-lg border border-rose-500/30">
                          Say: &ldquo;I&apos;m going to stop here. Nothing to
                          worry about, but I&apos;m not the right person to
                          clear this – get a doctor&apos;s sign-off and come
                          straight back.&rdquo; Then book the follow-up. Do not
                          carry on and do not soften it.
                        </div>
                      </div>
                    )}

                    {/* 9 Questions */}
                    <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden divide-y divide-[var(--db-card-border)] text-xs">
                      {HEALTH_QUESTIONS.map((q) => {
                        const val = formData.healthScreen[q.key];
                        return (
                          <div
                            key={q.key}
                            className={`p-2.5 flex items-center justify-between gap-4 transition-colors ${
                              val ? "bg-rose-500/10" : "bg-[var(--db-card)]"
                            }`}
                          >
                            <span
                              className={
                                val
                                  ? "text-rose-300 font-bold"
                                  : "text-[var(--db-text)]"
                              }
                            >
                              {q.label}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleHealth(q.key, false)}
                                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                                  !val
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                                }`}
                              >
                                NO
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleHealth(q.key, true)}
                                className={`px-3 py-1 rounded text-xs font-black cursor-pointer transition-all ${
                                  val
                                    ? "bg-rose-500 text-white shadow-md"
                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                                }`}
                              >
                                YES
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                        Detail Any YES Answer
                      </label>
                      <input
                        type="text"
                        value={formData.detailAnyYes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            detailAnyYes: e.target.value,
                          })
                        }
                        placeholder="Note specifics on surgery, medication, injury..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none"
                      />
                    </div>

                    {/* Vitals row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Resting HR (BPM)
                        </label>
                        <input
                          type="number"
                          value={formData.restingHR}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              restingHR: e.target.value,
                            })
                          }
                          placeholder="e.g. 72"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Blood Pressure (e.g. 120/80)
                        </label>
                        <input
                          type="text"
                          value={formData.bloodPressure}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bloodPressure: e.target.value,
                            })
                          }
                          placeholder="120/80"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Cleared to Test?
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, clearedToTest: "YES" })
                            }
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                              formData.clearedToTest === "YES"
                                ? "bg-emerald-500 text-black shadow-lg"
                                : "bg-[var(--db-card)] text-neutral-400 border border-[var(--db-card-border)]"
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                clearedToTest: "NO - REFER",
                              })
                            }
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                              formData.clearedToTest === "NO - REFER"
                                ? "bg-rose-500 text-white shadow-lg"
                                : "bg-[var(--db-card)] text-neutral-400 border border-[var(--db-card-border)]"
                            }`}
                          >
                            NO — REFER
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 04: MOVEMENT SCREEN ── */}
                {formStep === "04" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          04
                        </span>
                        MOVEMENT SCREEN
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        7-11 MIN
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
                      <div className="text-xs text-neutral-300">
                        <strong className="text-white">Rule:</strong> ANY MODIFY
                        &rarr; FOUNDATION, and pattern is not loaded. ANY REFER
                        &rarr; stop pattern, refer out.
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {movementCounts.pass} PASS
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                          {movementCounts.modify} MODIFY
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                          {movementCounts.refer} REFER
                        </span>
                      </div>
                    </div>

                    {/* Table of 6 Tests */}
                    <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[var(--db-card)] border-b border-[var(--db-card-border)] text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
                            <th className="py-2.5 px-3">Test</th>
                            <th className="py-2.5 px-3 text-center">Score</th>
                            <th className="py-2.5 px-3">Notes / Timed Secs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--db-card-border)]">
                          {MOVEMENT_TESTS.map((test) => {
                            const current = formData.movementScreen[
                              test.key
                            ] || { result: "PASS", note: "", seconds: "" };
                            return (
                              <tr
                                key={test.key}
                                className="hover:bg-[var(--db-table-hover)]"
                              >
                                <td className="py-2.5 px-3 font-semibold text-[var(--db-text)]">
                                  {test.label}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="inline-flex rounded-lg border border-[var(--db-card-border)] p-0.5 bg-[var(--db-card)]">
                                    {["PASS", "MODIFY", "REFER"].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() =>
                                          handleMovementChange(
                                            test.key,
                                            "result",
                                            opt,
                                          )
                                        }
                                        className={`px-2.5 py-1 text-[10px] font-black uppercase rounded cursor-pointer transition-all ${
                                          current.result === opt
                                            ? opt === "PASS"
                                              ? "bg-emerald-500 text-black font-black"
                                              : opt === "MODIFY"
                                                ? "bg-amber-400 text-black font-black"
                                                : "bg-rose-500 text-white font-black"
                                            : "text-neutral-400 hover:text-white"
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex gap-2">
                                    {test.hasTime && (
                                      <input
                                        type="number"
                                        value={current.seconds || ""}
                                        onChange={(e) =>
                                          handleMovementChange(
                                            test.key,
                                            "seconds",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Secs"
                                        className="w-16 px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono outline-none"
                                      />
                                    )}
                                    <input
                                      type="text"
                                      value={current.note || ""}
                                      onChange={(e) =>
                                        handleMovementChange(
                                          test.key,
                                          "note",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Note observation..."
                                      className="flex-1 px-2.5 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs outline-none"
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── STEP 05: THE FOUR NUMBERS ── */}
                {formStep === "05" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          05
                        </span>
                        THE FOUR NUMBERS
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        11-16 MIN
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Grip Left */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Grip – Left (KG, Best of 2)
                        </label>
                        <input
                          type="number"
                          value={formData.gripLeft}
                          onChange={(e) =>
                            handleGripChange("left", e.target.value)
                          }
                          placeholder="e.g. 42"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      {/* Grip Right */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Grip – Right (KG, Best of 2)
                        </label>
                        <input
                          type="number"
                          value={formData.gripRight}
                          onChange={(e) =>
                            handleGripChange("right", e.target.value)
                          }
                          placeholder="e.g. 45"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      {/* Push-ups */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Push-Ups (Max Clean Reps)
                        </label>
                        <input
                          type="number"
                          value={formData.pushUps}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pushUps: e.target.value,
                            })
                          }
                          placeholder="e.g. 18"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      {/* Waist */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          Waist (CM)
                        </label>
                        <input
                          type="number"
                          value={formData.waist}
                          onChange={(e) =>
                            setFormData({ ...formData, waist: e.target.value })
                          }
                          placeholder="e.g. 84"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold outline-none"
                        />
                      </div>
                    </div>

                    {/* Step Test Sub-block */}
                    <div className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--db-card-border)] pb-2">
                        <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                          <Activity size={14} className="text-[#ccf141]" /> Step
                          Test – 3 Min
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          12&quot; box • metronome 96 BPM • wait 5s, count 15s
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            15 Sec Pulse
                          </label>
                          <input
                            type="number"
                            value={formData.stepTest.pulse15Sec || ""}
                            onChange={(e) =>
                              handleStepTestChange("pulse15Sec", e.target.value)
                            }
                            placeholder="x 4 = BPM"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            HR At Finish
                          </label>
                          <input
                            type="number"
                            value={formData.stepTest.hrAtFinish || ""}
                            onChange={(e) =>
                              handleStepTestChange("hrAtFinish", e.target.value)
                            }
                            placeholder="BPM"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                            HR After 60 Sec
                          </label>
                          <input
                            type="number"
                            value={formData.stepTest.hrAfter60Sec || ""}
                            onChange={(e) =>
                              handleStepTestChange(
                                "hrAfter60Sec",
                                e.target.value,
                              )
                            }
                            placeholder="BPM"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs font-mono outline-none"
                          />
                        </div>

                        {/* Recovery HR Drop (Highlighted lime) */}
                        <div className="p-2 rounded-lg bg-[#ccf141]/15 border border-[#ccf141]/40">
                          <label className="block text-[10px] uppercase font-black text-[#ccf141] mb-0.5">
                            Recovery Drop
                          </label>
                          <div className="text-base font-black font-mono text-[#ccf141]">
                            {formData.stepTest.recoveryHR
                              ? `${formData.stepTest.recoveryHR} BPM`
                              : "—"}
                          </div>
                        </div>

                        {/* Est VO2 Max (Formula auto) */}
                        <div className="p-2 rounded-lg bg-sky-500/15 border border-sky-500/40">
                          <label className="block text-[10px] uppercase font-black text-sky-400 mb-0.5">
                            Est. VO2 Max
                          </label>
                          <div className="text-base font-black font-mono text-sky-400">
                            {formData.stepTest.estVo2Max
                              ? `${formData.stepTest.estVo2Max}`
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 06: CLOSE & MEMBER CARD ── */}
                {formStep === "06" && (
                  <div className="space-y-4">
                    <div className="bg-black text-white p-2 rounded-lg flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ccf141] text-black">
                          06
                        </span>
                        CLOSE
                      </span>
                      <span className="text-[#ccf141] text-[11px]">
                        16-20 MIN • NOBODY LEAVES WITHOUT A DATE IN THE DIARY
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Level selection */}
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1.5">
                          Assessed Level
                        </label>
                        <div className="flex gap-2">
                          {[
                            { id: "FOUND", label: "FOUND." },
                            { id: "DEVEL", label: "DEVEL." },
                            { id: "PERF", label: "PERF." },
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, level: lvl.id })
                              }
                              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${
                                formData.level === lvl.id
                                  ? "bg-[#ccf141] text-black shadow-md"
                                  : "bg-[var(--db-input-bg)] text-neutral-400 border border-[var(--db-card-border)]"
                              }`}
                            >
                              {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Programme Suggested */}
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1.5">
                          Programme Suggested
                        </label>
                        <input
                          type="text"
                          value={formData.programmeSuggested}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              programmeSuggested: e.target.value,
                            })
                          }
                          placeholder="e.g. Strength & Conditioning + Boxing Foundation"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          One Thing They&apos;re Good At
                        </label>
                        <input
                          type="text"
                          value={formData.oneThingGoodAt}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              oneThingGoodAt: e.target.value,
                            })
                          }
                          placeholder="e.g. Overhead mobility, upper body grip..."
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-[var(--db-text-muted)] mb-1">
                          One Thing We Work On First
                        </label>
                        <input
                          type="text"
                          value={formData.oneThingWorkOnFirst}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              oneThingWorkOnFirst: e.target.value,
                            })
                          }
                          placeholder="e.g. Single-leg stability & core trunk control..."
                          className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-[#ccf141]/15 border border-[#ccf141]/30">
                        <label className="block text-[10px] uppercase font-black text-[#ccf141] mb-1">
                          Full Assessment Booked
                        </label>
                        <input
                          type="text"
                          value={formData.fullAssessmentBooked}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullAssessmentBooked: e.target.value,
                            })
                          }
                          placeholder="Date / Slot (e.g. Oct 5th 10am)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--db-card)] border border-[#ccf141] text-xs text-white font-bold outline-none"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
                        <label className="block text-[10px] uppercase font-black text-neutral-300 mb-1">
                          Joined Today?
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, joinedToday: true })
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              formData.joinedToday
                                ? "bg-[#ccf141] text-black font-black"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, joinedToday: false })
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              !formData.joinedToday
                                ? "bg-neutral-700 text-white font-black"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            NO
                          </button>
                        </div>
                        {!formData.joinedToday && (
                          <input
                            type="text"
                            value={formData.followUpDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                followUpDate: e.target.value,
                              })
                            }
                            placeholder="Follow-up date..."
                            className="w-full mt-2 px-2 py-1 text-[11px] rounded bg-[var(--db-card)] border border-neutral-700 text-neutral-200 outline-none"
                          />
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                          <input
                            type="checkbox"
                            checked={formData.cardHandedOver}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cardHandedOver: e.target.checked,
                              })
                            }
                            className="rounded accent-[#ccf141]"
                          />
                          Card Handed Over
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                          <input
                            type="checkbox"
                            checked={formData.enteredToTracker}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                enteredToTracker: e.target.checked,
                              })
                            }
                            className="rounded accent-[#ccf141]"
                          />
                          Entered to Tracker
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Footer Buttons */}
                <div className="pt-4 border-t border-[var(--db-card-border)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {["01", "02", "03", "04", "05", "06"].map((st) => (
                      <span
                        key={st}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          formStep === st
                            ? "bg-[#ccf141] w-6"
                            : "bg-neutral-700"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--db-input-bg)] text-neutral-400 hover:text-white border border-[var(--db-card-border)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#ccf141] text-black hover:bg-[#d4ee00] transition-all shadow-[0_0_20px_rgba(229,255,0,0.3)] flex items-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={14} strokeWidth={3} />{" "}
                          {isEditing ? "Update Baseline" : "Save Baseline"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OFFICIAL SHEET & MEMBER CARD PDF VIEWER MODAL ── */}
      <AnimatePresence>
        {viewingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Top View Bar */}
              <div className="p-4 border-b border-[var(--db-card-border)] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-[var(--db-input-bg)] no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30 flex items-center justify-center font-black">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase text-[var(--db-text)] font-['Brutal_Font',sans-serif]">
                      Official Assessment Document
                    </h3>
                    <p className="text-[10px] text-[var(--db-text-muted)] font-mono">
                      {viewingRecord.name} • {viewingRecord.phone || "No phone"}{" "}
                      • Coach: {viewingRecord.coach}
                    </p>
                  </div>
                </div>

                {/* Tab switch & Actions */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 text-xs">
                    <button
                      onClick={() => setPdfSheetMode("page1")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        pdfSheetMode === "page1"
                          ? "bg-[#ccf141] text-black font-black"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Page 1 (Intake)
                    </button>
                    <button
                      onClick={() => setPdfSheetMode("page2")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        pdfSheetMode === "page2"
                          ? "bg-[#ccf141] text-black font-black"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Page 2 (Handout)
                    </button>
                    <button
                      onClick={() => setPdfSheetMode("both")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        pdfSheetMode === "both"
                          ? "bg-[#ccf141] text-black font-black"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Both Pages
                    </button>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#d4ee00] transition-all cursor-pointer"
                  >
                    <Printer size={14} /> Print / Save PDF
                  </button>

                  <button
                    onClick={() => setViewingRecord(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Printable Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-100 text-black custom-scrollbar">
                <div
                  id="printable-assessment-card"
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {/* ──────────────── PAGE 1: COACH ASSESSMENT SHEET (FORM BXC-AA-01) ──────────────── */}
                  {(pdfSheetMode === "page1" || pdfSheetMode === "both") && (
                    <div className="bg-white p-6 border-2 border-black space-y-4 page-break">
                      {/* Document Top Header */}
                      <div className="flex items-start justify-between border-b-2 border-black pb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <h2 className="text-xl font-black uppercase tracking-tight leading-none font-['Brutal_Font',sans-serif]">
                              BOX &amp; CROSS
                            </h2>
                            <p className="text-[10px] font-black tracking-widest text-neutral-700">
                              PERFORMANCE ARENA
                            </p>
                          </div>
                          <div className="h-9 w-[2px] bg-black" />
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight leading-none font-['Brutal_Font',sans-serif]">
                              ENTRY BASELINE
                            </h3>
                            <p className="text-[10px] font-bold text-neutral-600 uppercase">
                              20 MINUTES - EVERY PERSON, DAY ONE, NO EXCEPTIONS
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-[#c4f000] text-black font-black text-xs uppercase tracking-wider border border-black">
                          ENTRY
                        </span>
                      </div>

                      {/* WHEN TO USE THIS NOTICE BOX */}
                      <div className="border border-black p-2 text-[10px] bg-neutral-50 leading-tight">
                        <strong className="uppercase">WHEN TO USE THIS:</strong>{" "}
                        Every enquiry, walk-in and trial. Nobody trains at Box
                        &amp; Cross without one. The full battery (
                        <strong>FORM BXC-AA-01</strong>) is booked separately,
                        once they join.
                      </div>

                      {/* CLIENT INFO TABLE BAR */}
                      <div className="border border-black grid grid-cols-6 divide-x divide-black text-[11px]">
                        <div className="col-span-2 p-1.5">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            NAME
                          </span>
                          <span className="font-bold text-xs uppercase">
                            {viewingRecord.name || "—"}
                          </span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            AGE
                          </span>
                          <span className="font-bold text-xs font-mono">
                            {viewingRecord.age || "—"}
                          </span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            M / F
                          </span>
                          <span className="font-bold text-xs font-mono">
                            {viewingRecord.gender || "M"}
                          </span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            PHONE
                          </span>
                          <span className="font-bold text-xs font-mono">
                            {viewingRecord.phone || "—"}
                          </span>
                        </div>
                        <div className="p-1.5">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            COACH
                          </span>
                          <span className="font-bold text-xs">
                            {viewingRecord.coach || "Vivek"}
                          </span>
                        </div>
                      </div>

                      {/* 01 GOAL SECTION */}
                      <div className="border border-black">
                        <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                          <span>01 GOAL</span>
                          <span className="text-[#c4f000]">
                            0-5 MIN • SEATED — THIS IS ALSO THE REST BEFORE THE
                            BP READING
                          </span>
                        </div>

                        <div className="p-2 grid grid-cols-4 gap-1.5 text-[10px] border-b border-black">
                          {GOALS_LIST.map((g) => {
                            const isChecked = viewingRecord.goals?.includes(g);
                            return (
                              <div
                                key={g}
                                className="flex items-center gap-1.5"
                              >
                                <span
                                  className={`w-3.5 h-3.5 border border-black flex items-center justify-center font-bold text-[9px] ${isChecked ? "bg-black text-white" : ""}`}
                                >
                                  {isChecked ? "✓" : ""}
                                </span>
                                <span
                                  className={
                                    isChecked
                                      ? "font-black"
                                      : "text-neutral-700"
                                  }
                                >
                                  {g}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="divide-y divide-black text-[10.5px]">
                          <div className="p-1.5">
                            <span className="text-[9px] font-black uppercase text-neutral-500 block">
                              IN THEIR OWN WORDS (VERBATIM):
                            </span>
                            <p className="font-semibold italic text-neutral-900">
                              {viewingRecord.inTheirOwnWords
                                ? `"${viewingRecord.inTheirOwnWords}"`
                                : "—"}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 divide-x divide-black p-1.5">
                            <div>
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                WHY NOW (WHAT CHANGED?):
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.whyNow || "—"}
                              </span>
                            </div>
                            <div className="pl-2">
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                TRIED BEFORE - WHAT STOPPED IT:
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.triedBefore || "—"}
                              </span>
                            </div>
                            <div className="pl-2">
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                WON&apos;T DO / CAN&apos;T DO:
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.wontDoCantDo || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 02 COACH TRANSLATION SECTION */}
                      <div className="border border-black">
                        <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                          <span>02 COACH TRANSLATION</span>
                          <span className="text-[#c4f000]">
                            SAY IT OUT LOUD • THEY HAVE TO AGREE IT IS FAIR
                          </span>
                        </div>

                        <div className="p-2 grid grid-cols-3 divide-x divide-black text-[11px] border-b border-black">
                          <div>
                            <span className="text-[9px] font-black uppercase text-neutral-500 block">
                              THE NUMBER WE WILL USE
                            </span>
                            <span className="font-bold">
                              {viewingRecord.theNumberWeWillUse || "—"}
                            </span>
                          </div>
                          <div className="pl-2">
                            <span className="text-[9px] font-black uppercase text-neutral-500 block">
                              WHERE IT IS TODAY
                            </span>
                            <span className="font-bold font-mono">
                              {viewingRecord.whereItIsToday || "—"}
                            </span>
                          </div>
                          <div className="pl-2 bg-[#c4f000]/30">
                            <span className="text-[9px] font-black uppercase text-black block">
                              NEXT BLOCK TARGET
                            </span>
                            <span className="font-black font-mono text-black">
                              {viewingRecord.nextBlockTarget || "—"}
                            </span>
                          </div>
                        </div>

                        <div className="p-1.5 text-[9.5px] leading-tight text-neutral-700 bg-neutral-50">
                          <strong>BODYWEIGHT IS NOT OUR PRIMARY TARGET.</strong>{" "}
                          Translate &ldquo;lose weight&rdquo; into waist,
                          recovery heart rate or strength — those move because
                          of what we do here. Most people arrive with a reason,
                          not a goal; the tick-list starts it, you finish it.
                          Nobody leaves this page without one number.
                        </div>
                      </div>

                      {/* 03 HEALTH SCREEN SECTION */}
                      <div className="border border-black">
                        <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                          <span>03 HEALTH SCREEN</span>
                          <span className="text-[#c4f000]">
                            5-7 MIN • BP ONLY AFTER 5 MINUTES SEATED
                          </span>
                        </div>

                        <div className="p-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] divide-y divide-neutral-200">
                          {HEALTH_QUESTIONS.map((q) => {
                            const val = viewingRecord.healthScreen?.[q.key];
                            return (
                              <div
                                key={q.key}
                                className="flex items-center justify-between pt-1"
                              >
                                <span
                                  className={
                                    val
                                      ? "font-black text-red-600"
                                      : "text-neutral-800"
                                  }
                                >
                                  {q.label}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 border text-[9px] font-mono font-bold ${val ? "bg-red-600 text-white border-red-700" : "bg-neutral-100 border-neutral-300"}`}
                                >
                                  {val ? "YES" : "NO"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {viewingRecord.detailAnyYes && (
                          <div className="p-1.5 bg-yellow-50 border-t border-black text-[10px]">
                            <span className="font-black uppercase text-neutral-600">
                              DETAIL ANY YES:{" "}
                            </span>
                            <span className="font-semibold text-neutral-900">
                              {viewingRecord.detailAnyYes}
                            </span>
                          </div>
                        )}

                        <div className="border-t border-black grid grid-cols-3 divide-x divide-black p-2 bg-neutral-100 text-[10px] font-bold">
                          <div>
                            <span className="text-[9px] text-neutral-500 uppercase block">
                              RESTING HR
                            </span>
                            <span className="font-mono text-xs">
                              {viewingRecord.restingHR
                                ? `${viewingRecord.restingHR} BPM`
                                : "—"}
                            </span>
                          </div>
                          <div className="pl-2">
                            <span className="text-[9px] text-neutral-500 uppercase block">
                              BLOOD PRESSURE
                            </span>
                            <span className="font-mono text-xs">
                              {viewingRecord.bloodPressure || "—"}
                            </span>
                          </div>
                          <div className="pl-2 flex items-center justify-between">
                            <span className="text-[9px] text-neutral-500 uppercase block">
                              CLEARED TO TEST?
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black ${viewingRecord.clearedToTest === "YES" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
                            >
                              {viewingRecord.clearedToTest || "YES"}
                            </span>
                          </div>
                        </div>

                        {/* Stop & Refer callout */}
                        <div className="border-t border-black p-1.5 text-[9px] leading-tight text-neutral-700 bg-neutral-50">
                          <strong>STOP AND REFER:</strong> BP 160/100 or above •
                          BP 140/90 or above on second reading • chest pain •
                          dizziness or fainting • breathlessness out of
                          proportion to effort • resting HR above 100 • any
                          acute pain • surgery within 3 months • pregnancy.
                        </div>
                      </div>

                      {/* 04 MOVEMENT SCREEN & 05 FOUR NUMBERS IN 2 COLUMNS */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* 04 MOVEMENT SCREEN */}
                        <div className="border border-black flex flex-col justify-between">
                          <div>
                            <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                              <span>04 MOVEMENT SCREEN</span>
                              <span className="text-[#c4f000]">7-11 MIN</span>
                            </div>

                            <table className="w-full text-[9.5px]">
                              <thead>
                                <tr className="border-b border-black text-[9px] font-black uppercase bg-neutral-100">
                                  <th className="p-1 text-left">TEST</th>
                                  <th className="p-1 text-center">PASS</th>
                                  <th className="p-1 text-center">MODIFY</th>
                                  <th className="p-1 text-center">REFER</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-300">
                                {MOVEMENT_TESTS.map((test) => {
                                  const res =
                                    viewingRecord.movementScreen?.[test.key]
                                      ?.result || "PASS";
                                  return (
                                    <tr key={test.key}>
                                      <td className="p-1 font-semibold">
                                        {test.label}
                                      </td>
                                      <td className="p-1 text-center font-bold">
                                        {res === "PASS" ? "✓" : ""}
                                      </td>
                                      <td className="p-1 text-center font-bold">
                                        {res === "MODIFY" ? "✓" : ""}
                                      </td>
                                      <td className="p-1 text-center font-bold">
                                        {res === "REFER" ? "✓" : ""}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-1.5 border-t border-black text-[8.5px] leading-tight text-neutral-600 bg-neutral-50">
                            ANY MODIFY &rarr; FOUNDATION, pattern not loaded.
                            ANY REFER &rarr; stop pattern, refer out.
                          </div>
                        </div>

                        {/* 05 THE FOUR NUMBERS */}
                        <div className="border border-black">
                          <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                            <span>05 THE FOUR NUMBERS</span>
                            <span className="text-[#c4f000]">11-16 MIN</span>
                          </div>

                          <div className="divide-y divide-black text-[10px]">
                            <div className="p-1 flex items-center justify-between">
                              <span className="font-semibold">
                                GRIP – LEFT (KG, BEST OF 2)
                              </span>
                              <span className="font-bold font-mono">
                                {viewingRecord.gripLeft || "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span className="font-semibold">
                                GRIP – RIGHT (KG, BEST OF 2)
                              </span>
                              <span className="font-bold font-mono">
                                {viewingRecord.gripRight || "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span className="font-semibold">
                                PUSH-UPS (MAX CLEAN REPS)
                              </span>
                              <span className="font-bold font-mono">
                                {viewingRecord.pushUps || "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span className="font-semibold">WAIST (CM)</span>
                              <span className="font-bold font-mono">
                                {viewingRecord.waist || "—"}
                              </span>
                            </div>

                            {/* Step test */}
                            <div className="bg-neutral-100 p-1 font-black text-[9.5px] uppercase">
                              STEP TEST – 3 MIN
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span>15 SEC PULSE (x 4 = BPM)</span>
                              <span className="font-mono">
                                {viewingRecord.stepTest?.pulse15Sec
                                  ? `${viewingRecord.stepTest.pulse15Sec * 4} BPM`
                                  : "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span>HR AT FINISH (BPM)</span>
                              <span className="font-mono">
                                {viewingRecord.stepTest?.hrAtFinish || "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between">
                              <span>HR AFTER 60 SEC (BPM)</span>
                              <span className="font-mono">
                                {viewingRecord.stepTest?.hrAfter60Sec || "—"}
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between bg-[#c4f000]/40 font-black">
                              <span>RECOVERY HR (DROP)</span>
                              <span className="font-mono font-black">
                                {viewingRecord.stepTest?.recoveryHR || "—"} BPM
                              </span>
                            </div>
                            <div className="p-1 flex items-center justify-between bg-[#c4f000]/20 font-black">
                              <span>EST. VO2 MAX</span>
                              <span className="font-mono font-black">
                                {viewingRecord.stepTest?.estVo2Max || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 06 CLOSE SECTION */}
                      <div className="border border-black">
                        <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase">
                          <span>06 CLOSE</span>
                          <span className="text-[#c4f000]">
                            16-20 MIN • NOBODY LEAVES WITHOUT A DATE IN THE
                            DIARY
                          </span>
                        </div>

                        <div className="p-2 grid grid-cols-2 divide-x divide-black text-[10.5px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase text-neutral-500">
                                LEVEL:
                              </span>
                              <span className="font-black px-2 py-0.5 bg-neutral-200 border border-black">
                                {viewingRecord.level || "FOUND"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                PROGRAMME SUGGESTED:
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.programmeSuggested || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                ONE THING THEY&apos;RE GOOD AT:
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.oneThingGoodAt || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase text-neutral-500 block">
                                ONE THING WE WORK ON FIRST:
                              </span>
                              <span className="font-semibold">
                                {viewingRecord.oneThingWorkOnFirst || "—"}
                              </span>
                            </div>
                          </div>

                          <div className="pl-3 space-y-1.5">
                            <div className="p-1.5 bg-[#c4f000]/40 border border-black">
                              <span className="text-[9px] font-black uppercase text-black block">
                                FULL ASSESSMENT BOOKED:
                              </span>
                              <span className="font-black text-xs">
                                {viewingRecord.fullAssessmentBooked || "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span>CARD HANDED OVER:</span>
                              <span className="font-bold">
                                {viewingRecord.cardHandedOver
                                  ? "YES [✓]"
                                  : "NO [ ]"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span>JOINED TODAY?:</span>
                              <span className="font-bold">
                                {viewingRecord.joinedToday
                                  ? "YES [✓]"
                                  : `NO (F/U: ${viewingRecord.followUpDate || "—"})`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span>ENTERED TO TRACKER:</span>
                              <span className="font-bold">
                                {viewingRecord.enteredToTracker
                                  ? "YES [✓]"
                                  : "NO [ ]"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────── PAGE 2: MEMBER HANDOUT CARD (FORM BXC-AA-02) ──────────────── */}
                  {(pdfSheetMode === "page2" || pdfSheetMode === "both") && (
                    <div className="bg-white p-6 border-2 border-black space-y-5">
                      {/* Top 6 Metric Cards with Lime Accent Top Border */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Grip Strength */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            GRIP STRENGTH
                          </span>
                          <div className="text-2xl font-black font-mono mt-1">
                            {viewingRecord.gripStrongerHand || "—"}{" "}
                            <span className="text-xs font-normal">KG</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            KG - STRONGER HAND
                          </span>
                        </div>

                        {/* Recovery Heart Rate */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            RECOVERY HEART RATE
                          </span>
                          <div className="text-2xl font-black font-mono mt-1 text-emerald-600">
                            {viewingRecord.stepTest?.recoveryHR || "—"}{" "}
                            <span className="text-xs font-normal">BPM</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            BPM DROP IN 60 SECONDS
                          </span>
                        </div>

                        {/* Push-ups */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            PUSH-UPS
                          </span>
                          <div className="text-2xl font-black font-mono mt-1">
                            {viewingRecord.pushUps || "—"}{" "}
                            <span className="text-xs font-normal">REPS</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            MAX CLEAN REPS
                          </span>
                        </div>

                        {/* Estimated VO2 Max */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            ESTIMATED VO2 MAX
                          </span>
                          <div className="text-2xl font-black font-mono mt-1 text-sky-600">
                            {viewingRecord.stepTest?.estVo2Max || "—"}
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            ML/KG/MIN - AEROBIC ENGINE
                          </span>
                        </div>

                        {/* Waist */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            WAIST
                          </span>
                          <div className="text-2xl font-black font-mono mt-1">
                            {viewingRecord.waist || "—"}{" "}
                            <span className="text-xs font-normal">CM</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            CM (RELIABLE BIOMARKER)
                          </span>
                        </div>

                        {/* Movement Screen */}
                        <div className="border border-black p-3 relative pt-4">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c4f000]" />
                          <span className="text-[10px] font-black uppercase tracking-wider block text-neutral-700">
                            MOVEMENT SCREEN
                          </span>
                          <div className="text-2xl font-black font-mono mt-1">
                            {
                              Object.values(
                                viewingRecord.movementScreen || {},
                              ).filter((m) => m?.result === "PASS").length
                            }
                            P /{" "}
                            {
                              Object.values(
                                viewingRecord.movementScreen || {},
                              ).filter((m) => m?.result === "MODIFY").length
                            }
                            M
                          </div>
                          <span className="text-[9px] text-neutral-500 uppercase mt-0.5 block">
                            PASS / MODIFY COUNT
                          </span>
                        </div>
                      </div>

                      {/* YOUR GOAL, AS A NUMBER */}
                      <div className="border border-black">
                        <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between text-xs font-black uppercase">
                          <span className="flex items-center gap-2">
                            <span className="text-[#c4f000]">▶</span> YOUR GOAL,
                            AS A NUMBER
                          </span>
                          <span className="text-[#c4f000] text-[10px]">
                            IN YOUR WORDS, THEN IN OURS
                          </span>
                        </div>

                        <div className="p-3 space-y-2 text-xs">
                          <div>
                            <span className="text-[9.5px] font-black uppercase text-neutral-500 block">
                              WHAT YOU TOLD US:
                            </span>
                            <p className="font-bold italic text-neutral-900">
                              {viewingRecord.inTheirOwnWords
                                ? `"${viewingRecord.inTheirOwnWords}"`
                                : "—"}
                            </p>
                          </div>

                          <div className="border-t border-black pt-2 flex items-center justify-between">
                            <div>
                              <span className="text-[9.5px] font-black uppercase text-neutral-500 block">
                                THE NUMBER WE&apos;LL USE:
                              </span>
                              <span className="font-black text-sm">
                                {viewingRecord.theNumberWeWillUse || "—"}
                              </span>
                            </div>

                            <div className="p-2 bg-[#c4f000] border border-black min-w-[200px] text-right">
                              <span className="text-[9px] font-black uppercase text-black block">
                                YOUR TARGET
                              </span>
                              <span className="font-black text-sm font-mono text-black">
                                {viewingRecord.nextBlockTarget || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3 Strategy Columns */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border border-black">
                          <div className="bg-black text-white p-1.5 text-[10px] font-black uppercase text-center">
                            YOU&apos;RE ALREADY GOOD AT
                          </div>
                          <div className="p-3 text-xs font-semibold min-h-[60px]">
                            {viewingRecord.oneThingGoodAt ||
                              viewingRecord.cardNotes?.youAreAlreadyGoodAt ||
                              "—"}
                          </div>
                        </div>

                        <div className="border border-black">
                          <div className="bg-black text-white p-1.5 text-[10px] font-black uppercase text-center">
                            WE START HERE
                          </div>
                          <div className="p-3 text-xs font-semibold min-h-[60px]">
                            {viewingRecord.oneThingWorkOnFirst ||
                              viewingRecord.cardNotes?.weStartHere ||
                              "—"}
                          </div>
                        </div>

                        <div className="border border-black">
                          <div className="bg-black text-white p-1.5 text-[10px] font-black uppercase text-center">
                            WE&apos;RE PROTECTING
                          </div>
                          <div className="p-3 text-xs font-semibold min-h-[60px]">
                            {viewingRecord.cardNotes?.wereProtecting ||
                              "Joint health, clean movement patterns, zero ego loading."}
                          </div>
                        </div>
                      </div>

                      {/* WHAT HAPPENS NEXT BANNER */}
                      <div className="border-2 border-black bg-[#c4f000] p-3 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="font-black uppercase text-sm block tracking-tight text-black">
                            WHAT HAPPENS NEXT
                          </span>
                          <p className="text-[11px] text-black font-medium leading-tight">
                            Your full assessment goes deeper — strength,
                            conditioning and your discipline benchmark. Then we
                            retest every block and prove it moved.
                          </p>
                        </div>

                        <div className="bg-white border-2 border-black p-2 min-w-[220px] text-center shrink-0">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">
                            FULL ASSESSMENT BOOKED FOR
                          </span>
                          <span className="font-black text-xs text-black">
                            {viewingRecord.fullAssessmentBooked ||
                              "To be scheduled"}
                          </span>
                        </div>
                      </div>

                      {/* WHAT WE DON'T DO HERE DISCLAIMER */}
                      <div className="border border-black p-3 text-[10px] leading-relaxed text-neutral-800 bg-neutral-50">
                        <div className="font-black uppercase text-black mb-1 flex items-center gap-1.5">
                          <span>▶</span> WHAT WE DON&apos;T DO HERE
                        </div>
                        Box &amp; Cross measures <strong>performance</strong>.
                        We do not carry out blood or hormone panels, ECG,
                        echocardiogram, ultrasound, or any form of medical
                        diagnosis — and we will never interpret one. Where a
                        medical assessment is the right next step, we refer you
                        to our partner clinic and build your training around
                        what they find.
                      </div>

                      {/* FOOTER SIGN-OFF */}
                      <div className="border-t border-black pt-2 text-[9px] text-neutral-600 leading-tight space-y-0.5">
                        <p>
                          <strong>NOT A MEDICAL ASSESSMENT.</strong> The
                          measures on this card describe physical performance
                          only. They are not a diagnosis, a screening for
                          disease, or a substitute for medical advice.
                        </p>
                        <p className="font-black text-black">
                          MEASURE. TRAIN. RETEST. • IT&apos;S NEVER ENOUGH.
                        </p>
                        <p className="font-mono text-[8.5px]">
                          BOX &amp; CROSS PERFORMANCE ARENA • No. 68, Church
                          Street, Krishna Nagar, Lawspet, Pondicherry 605008 •
                          +91 89255 56800 • admin@boxandcross.com • FORM
                          BXC-AA-02 - v1.0
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--db-text)]">
                  Delete Entry Baseline?
                </h4>
                <p className="text-xs text-[var(--db-text-muted)] mt-1">
                  Are you sure you want to permanently delete this
                  Baseline record? This action cannot be undone.
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
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all cursor-pointer shadow-md"
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

export default Entrybaseline;
