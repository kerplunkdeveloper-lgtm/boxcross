import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  CheckCircle2,
  Calendar,
  User,
} from "lucide-react";
import {
  getPerformanceBoxings,
  createPerformanceBoxing,
  updatePerformanceBoxing,
  deletePerformanceBoxing,
  getAthletes,
} from "../api/api";
import { toast } from "react-hot-toast";

const INITIAL_FORM = {
  athlete: "",
  athleteName: "",
  date: new Date().toISOString().split("T")[0],
  coach: "",
  level: "Elite",
  walkAroundWeight: "",
  competitionWeight: "",
  weightClass: "",
  stance: "Orthodox",
  boutsToDate: "",
  recordW: "",
  recordL: "",
  lastBoutDate: "",
  nextTargetCompetition: "",
  stanceAndGuardFresh: "",
  stanceAndGuardFreshNote: "",
  stanceAndGuardRound3: "",
  stanceAndGuardRound3Note: "",
  jabCrossMechanics: "",
  jabCrossMechanicsNote: "",
  footworkDrill: "",
  footworkDrillNote: "",
  defensiveMovement: "",
  defensiveMovementNote: "",
  ringCraft: "",
  ringCraftNote: "",
  r1PunchCount: "",
  r1HR: "",
  r2PunchCount: "",
  r2HR: "",
  r3PunchCount: "",
  r3HR: "",
  outputDecay: "",
  padAccuracy: "",
  reactionDrill: "",
  defensiveSuccess: "",
  skipping: false,
  sparringClearance: false,
  sparringClearanceDate: "",
  headlineOutputDecay: "",
  disciplineGrade: "",
  nextBenchmarkDate: "",
  coachNotes: "",
};

const PerformanceBoxing = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const [athletes, setAthletes] = useState([]);
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false);
  const [athleteSearchTerm, setAthleteSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRecords = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      setRefreshing(true);
      const res = await getPerformanceBoxings();
      if (res?.data?.success) {
        setRecords(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading Performance Boxing records:", err);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
    fetchRecords(true);
    fetchAthletesList();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(
      (r) =>
        r.athleteName?.toLowerCase().includes(search.toLowerCase()) ||
        r.coach?.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(INITIAL_FORM);
    setAthleteSearchTerm("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setIsEditing(true);
    setCurrentId(rec._id);
    setFormData({
      ...INITIAL_FORM,
      ...rec,
      athlete: rec.athlete?._id || rec.athlete,
      athleteName: rec.athleteName || rec.athlete?.athleteName || "",
      date: rec.date ? new Date(rec.date).toISOString().split("T")[0] : "",
      lastBoutDate: rec.lastBoutDate ? new Date(rec.lastBoutDate).toISOString().split("T")[0] : "",
      sparringClearanceDate: rec.sparringClearanceDate ? new Date(rec.sparringClearanceDate).toISOString().split("T")[0] : "",
      nextBenchmarkDate: rec.nextBenchmarkDate
        ? new Date(rec.nextBenchmarkDate).toISOString().split("T")[0]
        : "",
    });
    setAthleteSearchTerm(rec.athleteName || rec.athlete?.athleteName || "");
    setIsModalOpen(true);
  };

  const handleSelectAthlete = (ath) => {
    setFormData((prev) => ({
      ...prev,
      athlete: ath._id,
      athleteName: ath.athleteName || ath.name,
      coach: ath.coach || prev.coach,
    }));
    setAthleteSearchTerm(ath.athleteName || ath.name);
    setShowAthleteDropdown(false);
    toast.success(`Selected athlete ${ath.athleteName || ath.name}`);
  };

  // Auto-calculate Output Decay & Discipline Grade
  useEffect(() => {
    const r1 = parseFloat(formData.r1PunchCount) || 0;
    const r3 = parseFloat(formData.r3PunchCount) || 0;
    if (r1 > 0 && r3 > 0) {
      const decay = ((r3 / r1) * 100).toFixed(1);
      setFormData((prev) => ({ ...prev, outputDecay: decay, headlineOutputDecay: decay }));
    } else {
      setFormData((prev) => ({ ...prev, outputDecay: "", headlineOutputDecay: "" }));
    }

    const s1 = parseFloat(formData.stanceAndGuardFresh) || 0;
    const s2 = parseFloat(formData.stanceAndGuardRound3) || 0;
    const s3 = parseFloat(formData.jabCrossMechanics) || 0;
    const s4 = parseFloat(formData.footworkDrill) || 0;
    const s5 = parseFloat(formData.defensiveMovement) || 0;
    const s6 = parseFloat(formData.ringCraft) || 0;
    let count = 0;
    let sum = 0;
    if (s1 > 0) { count++; sum += s1; }
    if (s2 > 0) { count++; sum += s2; }
    if (s3 > 0) { count++; sum += s3; }
    if (s4 > 0) { count++; sum += s4; }
    if (s5 > 0) { count++; sum += s5; }
    if (s6 > 0) { count++; sum += s6; }
    
    if (count > 0) {
      setFormData(prev => ({ ...prev, disciplineGrade: (sum / count).toFixed(1) }));
    } else {
      setFormData(prev => ({ ...prev, disciplineGrade: "" }));
    }
  }, [
    formData.r1PunchCount, formData.r3PunchCount, 
    formData.stanceAndGuardFresh, formData.stanceAndGuardRound3, 
    formData.jabCrossMechanics, formData.footworkDrill, 
    formData.defensiveMovement, formData.ringCraft
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.athlete || !formData.athleteName) {
      toast.error("Please select an athlete");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };
      
      if (isEditing) {
        const res = await updatePerformanceBoxing(currentId, payload);
        if (res?.data?.success) {
          toast.success("Record updated successfully");
          setIsModalOpen(false);
          fetchRecords();
        }
      } else {
        const res = await createPerformanceBoxing(payload);
        if (res?.data?.success) {
          toast.success("Record created successfully!");
          setIsModalOpen(false);
          fetchRecords();
        }
      }
    } catch (err) {
      console.error("Error saving record:", err);
      toast.error(err.response?.data?.message || "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deletePerformanceBoxing(id);
      if (res?.data?.success) {
        toast.success("Record deleted successfully");
        setDeletingId(null);
        fetchRecords();
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--db-card-border)] pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0">
              <Trophy size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--db-text)] uppercase font-['Brutal_Font',sans-serif]">
                  Performance Boxing
                </h1>
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded bg-amber-500 text-black">
                  COMPETITIVE PATHWAY
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--db-text-muted)] font-medium uppercase tracking-widest">
                Amateur to Elite
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:border-amber-500/40 transition-all cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-amber-500" : ""} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer"
          >
            <Plus size={15} strokeWidth={3} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="p-3 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by athlete name or coach..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-amber-500 transition-colors"
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
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Athlete</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Date</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Coach</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Weight Class</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Decay (R3/R1)</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Avg Grade</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-[var(--db-text-muted)]">
                    <RefreshCw size={24} className="mx-auto animate-spin mb-2 opacity-50" />
                    Loading records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-[var(--db-text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--db-input-bg)] flex items-center justify-center mb-3">
                        <Trophy size={20} className="text-[var(--db-text-muted)]" />
                      </div>
                      <p className="font-semibold text-[var(--db-text)] mb-1">No assessments found</p>
                      <p className="text-xs">Create a new Performance Boxing assessment to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id} className="border-b border-[var(--db-card-border)] hover:bg-[var(--db-input-bg)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--db-accent)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-bold text-xs uppercase">
                          {rec.athleteName?.substring(0, 2) || "PB"}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[var(--db-text)]">{rec.athleteName}</p>
                          <p className="text-[10px] text-[var(--db-text-muted)]">{rec.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text)] font-medium">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text-muted)]">
                      {rec.coach || "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text-muted)] font-mono">
                      {rec.weightClass || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-[11px] font-bold font-mono border border-amber-500/30">
                        {rec.outputDecay ? `${rec.outputDecay}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#ccf141]/20 text-[#ccf141] rounded text-[11px] font-bold font-mono border border-[#ccf141]/30">
                        {rec.disciplineGrade || "—"} / 5
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-400/10 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingId(rec._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODALS ── */}
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--db-card-border)] bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                  <Trophy size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  {isEditing ? "Edit Assessment" : "New Performance Boxing Assessment"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="performanceBoxingForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Athlete Search & Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                  <div className="col-span-1 md:col-span-4 lg:col-span-1 relative">
                    <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                      Search Athlete *
                    </label>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        value={athleteSearchTerm}
                        onChange={(e) => {
                          setAthleteSearchTerm(e.target.value);
                          setShowAthleteDropdown(true);
                          setFormData((p) => ({ ...p, athleteName: e.target.value }));
                        }}
                        onFocus={() => setShowAthleteDropdown(true)}
                        placeholder="Type name..."
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                      {showAthleteDropdown && athleteSearchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {athletes
                            .filter(
                              (a) =>
                                a.athleteName?.toLowerCase().includes(athleteSearchTerm.toLowerCase()) ||
                                a.memberId?.toLowerCase().includes(athleteSearchTerm.toLowerCase())
                            )
                            .map((ath) => (
                              <div
                                key={ath._id}
                                onClick={() => handleSelectAthlete(ath)}
                                className="px-3 py-2 border-b border-[var(--db-card-border)] last:border-0 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between"
                              >
                                <div className="text-xs font-semibold text-white">{ath.athleteName}</div>
                                <div className="text-[10px] text-neutral-400">{ath.memberId}</div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                      Coach
                    </label>
                    <input
                      type="text"
                      value={formData.coach}
                      onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                      placeholder="e.g. Jason"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Elite">Elite</option>
                      <option value="Amateur">Amateur</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>
                </div>

                {/* D1 Competition Status */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D1</span>
                      Competition Status
                    </h4>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Walk-around weight KG</label>
                      <input type="number" value={formData.walkAroundWeight} onChange={(e) => setFormData({...formData, walkAroundWeight: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Competition weight KG</label>
                      <input type="number" value={formData.competitionWeight} onChange={(e) => setFormData({...formData, competitionWeight: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Weight Class</label>
                      <input type="text" value={formData.weightClass} onChange={(e) => setFormData({...formData, weightClass: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Stance</label>
                      <select value={formData.stance} onChange={(e) => setFormData({...formData, stance: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none">
                        <option value="Orthodox">Orthodox</option>
                        <option value="Southpaw">Southpaw</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Bouts to date</label>
                      <input type="number" value={formData.boutsToDate} onChange={(e) => setFormData({...formData, boutsToDate: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Record W - L</label>
                      <div className="w-2/3 flex gap-2">
                        <input type="number" placeholder="W" value={formData.recordW} onChange={(e) => setFormData({...formData, recordW: e.target.value})} className="w-1/2 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white text-center focus:border-amber-500 focus:outline-none" />
                        <input type="number" placeholder="L" value={formData.recordL} onChange={(e) => setFormData({...formData, recordL: e.target.value})} className="w-1/2 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white text-center focus:border-amber-500 focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Last bout date</label>
                      <input type="date" value={formData.lastBoutDate} onChange={(e) => setFormData({...formData, lastBoutDate: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-1/3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase">Next target comp</label>
                      <input type="text" value={formData.nextTargetCompetition} onChange={(e) => setFormData({...formData, nextTargetCompetition: e.target.value})} className="w-2/3 px-3 py-1.5 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* D2 Technical Grades */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D2</span>
                      Technical Grades
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80 text-right">Coach Graded 1-5<br/>Graded again under fatigue</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4 space-y-4">
                    {[
                      { key: 'stanceAndGuardFresh', label: 'Stance & guard - fresh', desc: 'position, balance, hand position' },
                      { key: 'stanceAndGuardRound3', label: 'Stance & guard - round 3', desc: 'does the guard drop under fatigue?' },
                      { key: 'jabCrossMechanics', label: 'Jab / cross mechanics', desc: 'rotation, return to guard, extension' },
                      { key: 'footworkDrill', label: 'Footwork drill', desc: 'balance, direction change, no crossing feet' },
                      { key: 'defensiveMovement', label: 'Defensive movement', desc: 'slip, roll, guard discipline' },
                      { key: 'ringCraft', label: 'Ring craft', desc: 'distance management, angles, feinting' },
                    ].map((item) => (
                      <div key={item.key} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-b border-[var(--db-card-border)] pb-3 last:border-0 last:pb-0">
                        <div className="md:col-span-5">
                          <p className="text-[12px] font-bold text-[var(--db-text)]">{item.label}</p>
                          <p className="text-[10px] text-neutral-500">{item.desc}</p>
                        </div>
                        <div className="md:col-span-3 flex justify-between px-4">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <label key={num} className="flex flex-col items-center gap-1 cursor-pointer">
                              <span className="text-[10px] text-neutral-500">{num}</span>
                              <input
                                type="radio"
                                name={item.key}
                                value={num}
                                checked={parseInt(formData[item.key]) === num}
                                onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                                className="w-3.5 h-3.5 accent-[#ccf141]"
                              />
                            </label>
                          ))}
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Note..."
                            value={formData[`${item.key}Note`]}
                            onChange={(e) => setFormData({ ...formData, [`${item.key}Note`]: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-md bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D3 Output & Decay */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D3</span>
                      Output & Decay
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80">3 x 3 min - 1 min rest - Core Performance Test</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--db-card-border)]">
                          <th className="p-3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase border-r border-[var(--db-card-border)]">Bag Round</th>
                          <th className="p-3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase text-center border-r border-[var(--db-card-border)]">Round 1</th>
                          <th className="p-3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase text-center border-r border-[var(--db-card-border)]">Round 2</th>
                          <th className="p-3 text-[11px] font-bold text-[var(--db-text-muted)] uppercase text-center">Round 3</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--db-card-border)]">
                          <td className="p-3 text-[12px] font-bold text-white border-r border-[var(--db-card-border)]">Punch count</td>
                          <td className="p-2 border-r border-[var(--db-card-border)]">
                            <input type="number" value={formData.r1PunchCount} onChange={(e) => setFormData({...formData, r1PunchCount: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                          <td className="p-2 border-r border-[var(--db-card-border)]">
                            <input type="number" value={formData.r2PunchCount} onChange={(e) => setFormData({...formData, r2PunchCount: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                          <td className="p-2">
                            <input type="number" value={formData.r3PunchCount} onChange={(e) => setFormData({...formData, r3PunchCount: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--db-card-border)]">
                          <td className="p-3 text-[12px] font-bold text-white border-r border-[var(--db-card-border)]">HR at round end bpm</td>
                          <td className="p-2 border-r border-[var(--db-card-border)]">
                            <input type="number" value={formData.r1HR} onChange={(e) => setFormData({...formData, r1HR: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                          <td className="p-2 border-r border-[var(--db-card-border)]">
                            <input type="number" value={formData.r2HR} onChange={(e) => setFormData({...formData, r2HR: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                          <td className="p-2">
                            <input type="number" value={formData.r3HR} onChange={(e) => setFormData({...formData, r3HR: e.target.value})} className="w-full px-2 py-1.5 text-center bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[12px] font-black text-black bg-[#ccf141] uppercase tracking-wider" colSpan="2">
                            Output Decay R3 as % of R1
                          </td>
                          <td colSpan="2" className="p-2 bg-black">
                             <input type="text" readOnly value={formData.outputDecay ? `${formData.outputDecay}%` : ""} className="w-full px-3 py-1.5 text-center bg-[var(--db-input-bg)] rounded border border-[var(--db-input-border)] text-sm font-black text-amber-500 focus:outline-none" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* D4 Skill under pressure */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D4</span>
                      Skill Under Pressure
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80">Measured</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 gap-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Pad accuracy</p>
                          <p className="text-[10px] text-neutral-500">hits / attempts on coach-fed comb.</p>
                        </div>
                        <input
                          type="text"
                          value={formData.padAccuracy}
                          onChange={(e) => setFormData({ ...formData, padAccuracy: e.target.value })}
                          className="w-full sm:w-24 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 gap-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Reaction drill</p>
                          <p className="text-[10px] text-neutral-500">cue to response - grade or time</p>
                        </div>
                        <input
                          type="text"
                          value={formData.reactionDrill}
                          onChange={(e) => setFormData({ ...formData, reactionDrill: e.target.value })}
                          className="w-full sm:w-24 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 gap-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Defensive success</p>
                          <p className="text-[10px] text-neutral-500">clean slips / attempts under press.</p>
                        </div>
                        <input
                          type="text"
                          value={formData.defensiveSuccess}
                          onChange={(e) => setFormData({ ...formData, defensiveSuccess: e.target.value })}
                          className="w-full sm:w-24 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 gap-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Skipping</p>
                          <p className="text-[10px] text-neutral-500">3 min continuous unbroken</p>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="skipping"
                              checked={formData.skipping === true}
                              onChange={() => setFormData({ ...formData, skipping: true })}
                              className="w-3.5 h-3.5 accent-[#ccf141]"
                            />
                            <span className="text-xs text-white font-bold">Y</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="skipping"
                              checked={formData.skipping === false}
                              onChange={() => setFormData({ ...formData, skipping: false })}
                              className="w-3.5 h-3.5 accent-red-500"
                            />
                            <span className="text-xs text-white font-bold">N</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 gap-2 col-span-1 md:col-span-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Sparring clearance</p>
                          <p className="text-[10px] text-neutral-500">cleared by head coach? Date</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="sparringClearance"
                                checked={formData.sparringClearance === true}
                                onChange={() => setFormData({ ...formData, sparringClearance: true })}
                                className="w-3.5 h-3.5 accent-[#ccf141]"
                              />
                              <span className="text-xs text-white font-bold">Y</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="sparringClearance"
                                checked={formData.sparringClearance === false}
                                onChange={() => setFormData({ ...formData, sparringClearance: false })}
                                className="w-3.5 h-3.5 accent-red-500"
                              />
                              <span className="text-xs text-white font-bold">N</span>
                            </label>
                          </div>
                          {formData.sparringClearance && (
                            <input type="date" value={formData.sparringClearanceDate} onChange={(e) => setFormData({...formData, sparringClearanceDate: e.target.value})} className="px-2 py-1 bg-black rounded border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-amber-500 flex-1 sm:w-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Headline Benchmark */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] p-1 rounded-sm"><CheckCircle2 size={10} strokeWidth={4} /></span>
                      Headline Benchmark
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80">CARRY THIS NUMBER TO THE ATHLETE PROFILE</span>
                  </div>
                  <div className="bg-black p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full p-4 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30">
                        <label className="block text-[11px] font-black uppercase text-[#ccf141] mb-2">
                          Output Decay - R3 AS % OF R1
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formData.headlineOutputDecay ? `${formData.headlineOutputDecay}%` : ""}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-sm text-[#ccf141] font-black focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                          Discipline Grade (Avg)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formData.disciplineGrade}
                          className="w-full px-3 py-2.5 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-sm text-[#ccf141] font-black focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                          Next Benchmark Date
                        </label>
                        <input
                          type="date"
                          value={formData.nextBenchmarkDate}
                          onChange={(e) => setFormData({ ...formData, nextBenchmarkDate: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coach Notes */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-black border-b border-[var(--db-card-border)] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-white font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-[#ccf141] text-black p-1 rounded-sm"><CheckCircle2 size={10} strokeWidth={4} /></span>
                      Coach Notes
                    </h4>
                    <span className="text-[var(--db-text-muted)] text-[10px] font-bold uppercase tracking-wider">Two Lines Maximum</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4">
                    <textarea
                      value={formData.coachNotes}
                      onChange={(e) => setFormData({ ...formData, coachNotes: e.target.value })}
                      placeholder="Enter specific areas to focus on..."
                      className="w-full px-4 py-3 rounded-xl bg-black border border-[var(--db-input-border)] text-sm text-white focus:outline-none focus:border-amber-500 min-h-[80px] resize-none"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--db-card-border)] flex items-center justify-end gap-3 bg-[var(--db-card)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="performanceBoxingForm"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-[11px] uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Assessment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Delete Record?</h3>
            <p className="text-[13px] text-[var(--db-text-muted)] mb-6">
              This action cannot be undone. Are you sure you want to delete this Performance Boxing assessment?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--db-input-bg)] text-white hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceBoxing;
