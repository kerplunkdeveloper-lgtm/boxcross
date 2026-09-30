import React, { useState, useEffect, useMemo } from "react";
import {
  Swords,
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
  getFightClubs,
  createFightClub,
  updateFightClub,
  deleteFightClub,
  getAthletes,
} from "../api/api";
import { toast } from "react-hot-toast";

const INITIAL_FORM = {
  athlete: "",
  athleteName: "",
  date: new Date().toISOString().split("T")[0],
  coach: "",
  level: "Performance",
  stanceAndGuard: "",
  stanceAndGuardNote: "",
  jabCrossMechanics: "",
  jabCrossMechanicsNote: "",
  footworkDrill: "",
  footworkDrillNote: "",
  defensiveMovement: "",
  defensiveMovementNote: "",
  threeMinBagRound: "",
  paceConsistency: "",
  skipping: "",
  roundsCompleted: "",
  handWrapAndGuard: false,
  disciplineGrade: "",
  nextBenchmarkDate: "",
  coachNotes: "",
};

const FightClub = () => {
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
      const res = await getFightClubs();
      if (res?.data?.success) {
        setRecords(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading Fight Club records:", err);
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

  // Auto-calculate discipline grade
  useEffect(() => {
    const s1 = parseFloat(formData.stanceAndGuard) || 0;
    const s2 = parseFloat(formData.jabCrossMechanics) || 0;
    const s3 = parseFloat(formData.footworkDrill) || 0;
    const s4 = parseFloat(formData.defensiveMovement) || 0;
    let count = 0;
    let sum = 0;
    if (s1 > 0) { count++; sum += s1; }
    if (s2 > 0) { count++; sum += s2; }
    if (s3 > 0) { count++; sum += s3; }
    if (s4 > 0) { count++; sum += s4; }
    
    if (count > 0) {
      setFormData(prev => ({ ...prev, disciplineGrade: (sum / count).toFixed(1) }));
    } else {
      setFormData(prev => ({ ...prev, disciplineGrade: "" }));
    }
  }, [formData.stanceAndGuard, formData.jabCrossMechanics, formData.footworkDrill, formData.defensiveMovement]);

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
        const res = await updateFightClub(currentId, payload);
        if (res?.data?.success) {
          toast.success("Record updated successfully");
          setIsModalOpen(false);
          fetchRecords();
        }
      } else {
        const res = await createFightClub(payload);
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
      const res = await deleteFightClub(id);
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/15 text-red-500 border border-red-500/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(239,68,68,0.15)] shrink-0">
              <Swords size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--db-text)] uppercase font-['Brutal_Font',sans-serif]">
                  Fight Club
                </h1>
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded bg-red-500 text-white">
                  PERFORMANCE ARENA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--db-text-muted)] font-medium uppercase tracking-widest">
                Fitness Boxing • Community • Anyone Can Fight
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:border-red-500/40 transition-all cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-red-500" : ""} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer"
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
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-red-500 transition-colors"
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
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Athlete</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Date</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Coach</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Punch Count</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Avg Grade</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm text-[var(--db-text-muted)]">
                    <RefreshCw size={24} className="mx-auto animate-spin mb-2 opacity-50" />
                    Loading records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm text-[var(--db-text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--db-input-bg)] flex items-center justify-center mb-3">
                        <Swords size={20} className="text-[var(--db-text-muted)]" />
                      </div>
                      <p className="font-semibold text-[var(--db-text)] mb-1">No assessments found</p>
                      <p className="text-xs">Create a new Fight Club assessment to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id} className="border-b border-[var(--db-card-border)] hover:bg-[var(--db-input-bg)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--db-accent)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-bold text-xs uppercase">
                          {rec.athleteName?.substring(0, 2) || "FC"}
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
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-neutral-500/20 text-neutral-300 rounded text-[11px] font-bold font-mono">
                        {rec.threeMinBagRound || "—"}
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
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--db-card-border)] bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ccf141] flex items-center justify-center text-black shadow-[0_0_10px_rgba(204,241,65,0.4)]">
                  <Swords size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  {isEditing ? "Edit Assessment" : "New Fight Club Assessment"}
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
              <form id="fightClubForm" onSubmit={handleSubmit} className="space-y-6">
                
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
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
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
                                className="px-3 py-2 border-b border-[var(--db-card-border)] last:border-0 hover:bg-[#ccf141]/10 cursor-pointer flex items-center justify-between"
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
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
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
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
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
                      className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
                    >
                      <option value="Foundation">Foundation</option>
                      <option value="Performance">Performance</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* D1 Boxing Technique */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D1</span>
                      Boxing Technique
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80">Coach Graded 1-5</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4 space-y-4">
                    {[
                      { key: 'stanceAndGuard', label: 'Stance & guard', desc: 'position, balance, hand position' },
                      { key: 'jabCrossMechanics', label: 'Jab / cross mechanics', desc: 'rotation, return to guard, extension' },
                      { key: 'footworkDrill', label: 'Footwork drill', desc: 'balance, direction change, no crossing feet' },
                      { key: 'defensiveMovement', label: 'Defensive movement', desc: 'slip, roll, guard discipline' },
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
                            className="w-full px-3 py-1.5 rounded-md bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D2 Boxing Output */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2 flex items-center justify-between">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] px-1.5 py-0.5 rounded text-[10px]">D2</span>
                      Boxing Output
                    </h4>
                    <span className="text-black text-[10px] font-bold uppercase tracking-wider opacity-80">Measured</span>
                  </div>
                  <div className="bg-[var(--db-input-bg)] p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">3 min bag round</p>
                          <p className="text-[10px] text-neutral-500">total punch count</p>
                        </div>
                        <input
                          type="number"
                          value={formData.threeMinBagRound}
                          onChange={(e) => setFormData({ ...formData, threeMinBagRound: e.target.value })}
                          className="w-20 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white font-mono focus:outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Pace consistency</p>
                          <p className="text-[10px] text-neutral-500">punches minute 1 vs minute 3</p>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. 50 vs 45"
                          value={formData.paceConsistency}
                          onChange={(e) => setFormData({ ...formData, paceConsistency: e.target.value })}
                          className="w-24 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white focus:outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Skipping</p>
                          <p className="text-[10px] text-neutral-500">longest unbroken duration, min:sec</p>
                        </div>
                        <input
                          type="text"
                          placeholder="00:00"
                          value={formData.skipping}
                          onChange={(e) => setFormData({ ...formData, skipping: e.target.value })}
                          className="w-20 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white font-mono focus:outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Rounds completed</p>
                          <p className="text-[10px] text-neutral-500">at prescribed work rate</p>
                        </div>
                        <input
                          type="number"
                          value={formData.roundsCompleted}
                          onChange={(e) => setFormData({ ...formData, roundsCompleted: e.target.value })}
                          className="w-20 px-2 py-1.5 text-center rounded bg-black border border-[var(--db-input-border)] text-xs text-white font-mono focus:outline-none focus:border-[#ccf141]"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border border-[var(--db-card-border)] rounded-lg bg-black/50 col-span-1 md:col-span-2">
                        <div>
                          <p className="text-[12px] font-bold text-[var(--db-text)]">Hand wrap & guard discipline</p>
                          <p className="text-[10px] text-neutral-500">self-managed?</p>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="handWrap"
                              checked={formData.handWrapAndGuard === true}
                              onChange={() => setFormData({ ...formData, handWrapAndGuard: true })}
                              className="w-3.5 h-3.5 accent-[#ccf141]"
                            />
                            <span className="text-xs text-white font-bold">Y</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="handWrap"
                              checked={formData.handWrapAndGuard === false}
                              onChange={() => setFormData({ ...formData, handWrapAndGuard: false })}
                              className="w-3.5 h-3.5 accent-red-500"
                            />
                            <span className="text-xs text-white font-bold">N</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Headline Benchmark */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden">
                  <div className="bg-[#ccf141] px-4 py-2">
                    <h4 className="text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                      <span className="bg-black text-[#ccf141] p-1 rounded-sm"><CheckCircle2 size={10} strokeWidth={4} /></span>
                      Headline Benchmark
                    </h4>
                  </div>
                  <div className="bg-black p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full p-4 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30">
                        <label className="block text-[11px] font-black uppercase text-[#ccf141] mb-2">
                          3 Min Bag Round - Punch Count
                        </label>
                        <input
                          type="number"
                          value={formData.threeMinBagRound}
                          onChange={(e) => setFormData({ ...formData, threeMinBagRound: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-[var(--db-input-border)] text-sm text-white font-mono focus:outline-none focus:border-[#ccf141]"
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
                          className="w-full px-3 py-2.5 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-sm text-white focus:outline-none focus:border-[#ccf141]"
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
                      className="w-full px-4 py-3 rounded-xl bg-black border border-[var(--db-input-border)] text-sm text-white focus:outline-none focus:border-[#ccf141] min-h-[80px] resize-none"
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
                form="fightClubForm"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#ccf141] text-black font-black text-[11px] uppercase tracking-wider hover:bg-[#d4ee00] transition-all shadow-[0_0_15px_rgba(229,255,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              This action cannot be undone. Are you sure you want to delete this Fight Club assessment?
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

export default FightClub;
