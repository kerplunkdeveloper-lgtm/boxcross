import React, { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  getAthleteProfiles,
  createAthleteProfile,
  updateAthleteProfile,
  deleteAthleteProfile,
  getAthletes,
} from "../api/api";
import { toast } from "react-hot-toast";

const INITIAL_PROGRESS = { baseline: "", retest: "", change: "" };

const INITIAL_FORM = {
  athlete: "",
  athleteName: "",
  memberId: "",
  date: new Date().toISOString().split("T")[0],
  coach: "",
  programme: "",
  category: "Foundation",
  gripStrength: "",
  estimatedVO2Max: "",
  recoveryHeartRate: "",
  pushUps: "",
  broadJump: "",
  disciplineGrade: "",
  yourStrength: "",
  yourPriority: "",
  whatWereProtecting: "",
  prescriptionProgramme: "",
  sessionsPerWeek: "",
  zone: "",
  prescriptionCoach: "",
  trainingPriority: "",
  restrictions: "",
  goalAtBaseline: "",
  stillTheGoal: "",
  newGoal: "",
  nextBlockTarget: "",
  benchmarkCycle: "",
  bookedForDate: "",
  progress: {
    gripStrength: { ...INITIAL_PROGRESS },
    vo2Max: { ...INITIAL_PROGRESS },
    heartRate: { ...INITIAL_PROGRESS },
    pushUps: { ...INITIAL_PROGRESS },
    broadJump: { ...INITIAL_PROGRESS },
    discipline: { ...INITIAL_PROGRESS },
  }
};

const AthletePerformanceProfile = () => {
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
      const res = await getAthleteProfiles();
      if (res?.data?.success) {
        setRecords(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading Athlete Profiles:", err);
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
      bookedForDate: rec.bookedForDate ? new Date(rec.bookedForDate).toISOString().split("T")[0] : "",
    });
    setAthleteSearchTerm(rec.athleteName || rec.athlete?.athleteName || "");
    setIsModalOpen(true);
  };

  const handleSelectAthlete = (ath) => {
    setFormData((prev) => ({
      ...prev,
      athlete: ath._id,
      athleteName: ath.athleteName || ath.name,
      memberId: ath.memberId || prev.memberId,
      coach: ath.coach || prev.coach,
    }));
    setAthleteSearchTerm(ath.athleteName || ath.name);
    setShowAthleteDropdown(false);
    toast.success(`Selected athlete ${ath.athleteName || ath.name}`);
  };

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
        const res = await updateAthleteProfile(currentId, payload);
        if (res?.data?.success) {
          toast.success("Profile updated successfully");
          setIsModalOpen(false);
          fetchRecords();
        }
      } else {
        const res = await createAthleteProfile(payload);
        if (res?.data?.success) {
          toast.success("Profile created successfully!");
          setIsModalOpen(false);
          fetchRecords();
        }
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAthleteProfile(id);
      if (res?.data?.success) {
        toast.success("Profile deleted successfully");
        setDeletingId(null);
        fetchRecords();
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      toast.error("Failed to delete profile");
    }
  };

  const handleProgressChange = (metric, field, value) => {
    setFormData((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [metric]: {
          ...prev.progress[metric],
          [field]: value,
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--db-card-border)] pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(204,241,65,0.15)] shrink-0">
              <ClipboardList size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--db-text)] uppercase font-['Brutal_Font',sans-serif]">
                  Athlete Performance Profile
                </h1>
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded bg-[#ccf141] text-black">
                  PERFORMANCE ARENA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--db-text-muted)] font-medium uppercase tracking-widest">
                Your Baseline - Your Programme - Your Next Standard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:border-[#ccf141]/40 transition-all cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-[#ccf141]" : ""} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b0d136] transition-all shadow-[0_0_20px_rgba(204,241,65,0.25)] cursor-pointer"
          >
            <Plus size={15} strokeWidth={3} />
            <span>New Profile</span>
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
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="bg-[var(--db-card)] rounded-2xl border border-[var(--db-card-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Athlete</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Date</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Category</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Programme</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-[var(--db-text-muted)] font-bold">Next Benchmark</th>
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
                        <ClipboardList size={20} className="text-[var(--db-text-muted)]" />
                      </div>
                      <p className="font-semibold text-[var(--db-text)] mb-1">No profiles found</p>
                      <p className="text-xs">Create a new Athlete Profile to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id} className="border-b border-[var(--db-card-border)] hover:bg-[var(--db-input-bg)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--db-accent)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-bold text-xs uppercase">
                          {rec.athleteName?.substring(0, 2) || "AP"}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[var(--db-text)]">{rec.athleteName}</p>
                          <p className="text-[10px] text-[var(--db-text-muted)]">{rec.memberId || "No ID"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text)] font-medium">
                      {new Date(rec.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rec.category === 'Foundation' ? 'bg-neutral-800 text-neutral-300' :
                        rec.category === 'Development' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-[#ccf141]/20 text-[#ccf141]'
                      }`}>
                        {rec.category || "Foundation"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text-muted)]">
                      {rec.programme || "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--db-text-muted)]">
                      {rec.bookedForDate ? new Date(rec.bookedForDate).toLocaleDateString() : "—"}
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
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--db-card-border)] bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ccf141] flex items-center justify-center text-black shadow-[0_0_10px_rgba(204,241,65,0.4)]">
                  <ClipboardList size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  {isEditing ? "Edit Profile" : "New Athlete Performance Profile"}
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
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-[var(--db-bg)]">
              <form id="athleteProfileForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Athlete Search & Basic Info */}
                <div className="border border-[var(--db-card-border)] rounded-xl overflow-hidden bg-black p-4">
                  <h4 className="text-[10px] font-black uppercase text-[var(--db-text-muted)] mb-3 tracking-widest">Baseline Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="col-span-1 md:col-span-5 lg:col-span-2 relative">
                      <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                        Athlete Name *
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
                          className="w-full pl-8 pr-3 py-2 border-b-2 border-neutral-700 bg-transparent text-sm text-white focus:outline-none focus:border-[#ccf141] rounded-none"
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
                        className="w-full px-3 py-2 border-b-2 border-neutral-700 bg-transparent text-sm text-white focus:outline-none focus:border-[#ccf141] rounded-none"
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
                        className="w-full px-3 py-2 border-b-2 border-neutral-700 bg-transparent text-sm text-white focus:outline-none focus:border-[#ccf141] rounded-none"
                        required
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold uppercase text-[var(--db-text-muted)] mb-1">
                        Programme
                      </label>
                      <input
                        type="text"
                        value={formData.programme}
                        onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                        className="w-full px-3 py-2 border-b-2 border-neutral-700 bg-transparent text-sm text-white focus:outline-none focus:border-[#ccf141] rounded-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Category Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { val: 'Foundation', title: 'Foundation', desc: 'Building the base - Technique before load' },
                    { val: 'Development', title: 'Development', desc: 'Base is set - Now we build capacity' },
                    { val: 'Performance', title: 'Performance', desc: 'Trained and tested - Competing against standards' },
                  ].map(cat => (
                    <label key={cat.val} className={`border ${formData.category === cat.val ? 'border-[#ccf141] bg-[#ccf141]/5' : 'border-[var(--db-card-border)] bg-[var(--db-input-bg)]'} rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors`}>
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat.val} 
                        checked={formData.category === cat.val} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        className="mt-1 w-5 h-5 accent-[#ccf141]"
                      />
                      <div>
                        <h4 className="font-black text-white text-sm tracking-wide uppercase">{cat.title}</h4>
                        <p className="text-[10px] text-[var(--db-text-muted)] mt-1">{cat.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* 3. Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'gripStrength', label: 'Grip Strength', desc: 'KG - STRONGER HAND', ph: 'e.g. 45' },
                    { key: 'estimatedVO2Max', label: 'Estimated VO2 Max', desc: 'ML/KG/MIN - AEROBIC ENGINE', ph: 'e.g. 40' },
                    { key: 'recoveryHeartRate', label: 'Recovery Heart Rate', desc: 'BPM DROP IN 60 SECONDS', ph: 'e.g. 30' },
                    { key: 'pushUps', label: 'Push-Ups', desc: 'MAX CLEAN REPS', ph: 'e.g. 25' },
                    { key: 'broadJump', label: 'Broad Jump', desc: 'CM - POWER OUTPUT', ph: 'e.g. 210' },
                    { key: 'disciplineGrade', label: 'Discipline Grade', desc: 'FROM YOUR DISCIPLINE PAGE', ph: 'e.g. 4.5' },
                  ].map(metric => (
                    <div key={metric.key} className="border border-[var(--db-card-border)] bg-[var(--db-input-bg)] p-3 flex flex-col justify-between h-24 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-2 bg-[#ccf141]"></div>
                      <label className="text-[11px] font-black uppercase text-white tracking-widest">{metric.label}</label>
                      <input 
                        type="text" 
                        placeholder={metric.ph}
                        value={formData[metric.key]} 
                        onChange={(e) => setFormData({...formData, [metric.key]: e.target.value})} 
                        className="w-full bg-transparent border-b border-dashed border-neutral-600 text-lg font-bold text-[#ccf141] text-center focus:outline-none focus:border-[#ccf141] py-1"
                      />
                      <span className="text-[9px] text-[var(--db-text-muted)] uppercase tracking-wider">{metric.desc}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Text Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'yourStrength', label: 'Your Strength' },
                    { key: 'yourPriority', label: 'Your Priority' },
                    { key: 'whatWereProtecting', label: 'What We\'re Protecting' },
                  ].map(area => (
                    <div key={area.key} className="border border-[var(--db-card-border)] bg-black">
                      <div className="bg-white text-black p-2">
                        <h4 className="font-black uppercase text-[11px] tracking-widest">{area.label}</h4>
                      </div>
                      <textarea
                        value={formData[area.key]}
                        onChange={(e) => setFormData({...formData, [area.key]: e.target.value})}
                        className="w-full h-24 bg-transparent p-3 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#ccf141] custom-dashed-bg"
                        style={{
                          backgroundImage: 'linear-gradient(transparent, transparent 27px, #333 27px, #333 28px)',
                          backgroundSize: '100% 28px',
                          lineHeight: '28px',
                          paddingTop: '2px'
                        }}
                      ></textarea>
                    </div>
                  ))}
                </div>

                {/* 5. Performance Prescription */}
                <div className="border border-[var(--db-card-border)] bg-[var(--db-input-bg)] overflow-hidden">
                  <div className="bg-black border-b border-[var(--db-card-border)] flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ccf141] text-black w-4 h-4 flex items-center justify-center text-[10px] font-black">▶</span>
                      <h4 className="font-black uppercase text-[12px] tracking-widest text-white">Performance Prescription</h4>
                    </div>
                    <span className="text-[#ccf141] text-[9px] font-bold uppercase tracking-widest hidden sm:block">Assigned on your numbers, not on a guess</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--db-card-border)]">
                    <div className="md:col-span-6 border-b md:border-b-0 md:border-r border-[var(--db-card-border)] p-2">
                      <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Programme</label>
                      <input type="text" value={formData.prescriptionProgramme} onChange={(e) => setFormData({...formData, prescriptionProgramme: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                    </div>
                    <div className="md:col-span-6 p-2">
                      <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Sessions per week</label>
                      <input type="text" value={formData.sessionsPerWeek} onChange={(e) => setFormData({...formData, sessionsPerWeek: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--db-card-border)]">
                    <div className="md:col-span-6 border-b md:border-b-0 md:border-r border-[var(--db-card-border)] p-2">
                      <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Zone</label>
                      <input type="text" value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                    </div>
                    <div className="md:col-span-6 p-2">
                      <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Coach</label>
                      <input type="text" value={formData.prescriptionCoach} onChange={(e) => setFormData({...formData, prescriptionCoach: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                    </div>
                  </div>
                  <div className="p-2 border-b border-[var(--db-card-border)]">
                    <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Training Priority <span className="opacity-50">NEXT BLOCK - ONE ONLY</span></label>
                    <input type="text" value={formData.trainingPriority} onChange={(e) => setFormData({...formData, trainingPriority: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                  </div>
                  <div className="p-2">
                    <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Restrictions <span className="opacity-50">FROM MOVEMENT SCREEN</span></label>
                    <input type="text" value={formData.restrictions} onChange={(e) => setFormData({...formData, restrictions: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                  </div>
                </div>

                {/* 6. Goal */}
                <div className="border border-[var(--db-card-border)] bg-[var(--db-input-bg)] overflow-hidden">
                  <div className="bg-black border-b border-[var(--db-card-border)] flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ccf141] text-black w-4 h-4 flex items-center justify-center text-[10px] font-black">▶</span>
                      <h4 className="font-black uppercase text-[12px] tracking-widest text-white">Is this still your goal?</h4>
                    </div>
                    <span className="text-[#ccf141] text-[9px] font-bold uppercase tracking-widest hidden sm:block">Asked at every retest - Goals change once you can do more</span>
                  </div>
                  <div className="p-2 border-b border-[var(--db-card-border)]">
                    <label className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] block mb-1">Goal set at baseline</label>
                    <input type="text" value={formData.goalAtBaseline} onChange={(e) => setFormData({...formData, goalAtBaseline: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--db-card-border)]">
                    <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[var(--db-card-border)] p-2 flex items-center gap-4">
                      <span className="text-[9px] font-bold uppercase text-[var(--db-text-muted)]">Still the goal?</span>
                      <label className="flex items-center gap-1 text-xs cursor-pointer"><input type="radio" name="stillGoal" value="Yes" checked={formData.stillTheGoal === 'Yes'} onChange={(e) => setFormData({...formData, stillTheGoal: e.target.value})} className="accent-[#ccf141]" /> Yes</label>
                      <label className="flex items-center gap-1 text-xs cursor-pointer"><input type="radio" name="stillGoal" value="No" checked={formData.stillTheGoal === 'No'} onChange={(e) => setFormData({...formData, stillTheGoal: e.target.value})} className="accent-[#ccf141]" /> No</label>
                    </div>
                    <div className="md:col-span-9 p-2 flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase text-[var(--db-text-muted)] shrink-0">If no - the new one</span>
                      <input type="text" value={formData.newGoal} onChange={(e) => setFormData({...formData, newGoal: e.target.value})} className="w-full bg-transparent text-sm text-white focus:outline-none border-b border-dashed border-neutral-700" />
                    </div>
                  </div>
                  <div className="flex bg-black">
                    <div className="bg-[#ccf141] text-black font-black uppercase text-[10px] tracking-widest px-4 py-2">
                      Next Block Target
                    </div>
                    <input type="text" value={formData.nextBlockTarget} onChange={(e) => setFormData({...formData, nextBlockTarget: e.target.value})} className="flex-1 bg-transparent px-3 text-sm text-white focus:outline-none" />
                  </div>
                </div>

                {/* 7. Your Next Benchmark */}
                <div className="bg-[#ccf141] border border-[#ccf141] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-black font-black uppercase text-lg tracking-widest">Your Next Benchmark</h3>
                    <p className="text-black/80 text-[10px] font-bold uppercase tracking-widest mt-1">Same tests - Same coach - Same conditions - on your programme cycle</p>
                  </div>
                  <div className="space-y-3 w-full md:w-auto">
                    <div className="flex items-center gap-4 text-black text-[10px] font-black uppercase tracking-widest">
                      <span>Cycle</span>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cycle" value="90 days" checked={formData.benchmarkCycle === '90 days'} onChange={(e) => setFormData({...formData, benchmarkCycle: e.target.value})} className="accent-black w-4 h-4" /> 90 days</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="cycle" value="8 weeks" checked={formData.benchmarkCycle === '8 weeks'} onChange={(e) => setFormData({...formData, benchmarkCycle: e.target.value})} className="accent-black w-4 h-4" /> 8 weeks - Competition build</label>
                    </div>
                    <div className="flex items-center gap-2 text-black text-[10px] font-black uppercase tracking-widest">
                      <span>Booked for</span>
                      <input type="date" value={formData.bookedForDate} onChange={(e) => setFormData({...formData, bookedForDate: e.target.value})} className="bg-transparent border-b-2 border-black focus:outline-none pb-1 w-48" />
                    </div>
                  </div>
                </div>

                {/* 8. Your Progress */}
                <div className="border border-[var(--db-card-border)] bg-black overflow-hidden">
                  <div className="border-b border-[var(--db-card-border)] flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ccf141] text-black w-4 h-4 flex items-center justify-center text-[10px] font-black">▶</span>
                      <h4 className="font-black uppercase text-[12px] tracking-widest text-white">Your Progress</h4>
                    </div>
                    <span className="text-[#ccf141] text-[9px] font-bold uppercase tracking-widest hidden sm:block">Filled in at your next benchmark</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                          <th className="p-2 text-[9px] font-bold text-[var(--db-text-muted)] uppercase tracking-widest w-1/4">Measure</th>
                          <th className="p-2 text-[9px] font-bold text-[var(--db-text-muted)] uppercase tracking-widest text-center">Baseline - Today</th>
                          <th className="p-2 text-[9px] font-bold text-[var(--db-text-muted)] uppercase tracking-widest text-center">Retest</th>
                          <th className="p-2 text-[9px] font-bold text-[var(--db-text-muted)] uppercase tracking-widest text-center">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'gripStrength', label: 'Grip strength', unit: 'kg' },
                          { key: 'vo2Max', label: 'Estimated VO2 max', unit: 'ml/kg/min' },
                          { key: 'heartRate', label: 'Recovery heart rate', unit: 'bpm drop' },
                          { key: 'pushUps', label: 'Push-ups', unit: 'max clean reps' },
                          { key: 'broadJump', label: 'Broad jump', unit: 'cm' },
                          { key: 'discipline', label: 'Discipline benchmark', unit: 'headline number' },
                        ].map((item, idx) => (
                          <tr key={item.key} className="border-b border-[var(--db-card-border)] hover:bg-neutral-900">
                            <td className="p-2 text-[11px] font-bold text-white border-r border-[var(--db-card-border)]">
                              {item.label} <span className="text-neutral-500 font-normal">{item.unit}</span>
                            </td>
                            <td className="p-1 border-r border-[var(--db-card-border)]">
                              <input type="text" value={formData.progress[item.key].baseline} onChange={(e) => handleProgressChange(item.key, 'baseline', e.target.value)} className="w-full bg-transparent text-center text-xs text-white focus:outline-none h-8" />
                            </td>
                            <td className="p-1 border-r border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
                              <input type="text" value={formData.progress[item.key].retest} onChange={(e) => handleProgressChange(item.key, 'retest', e.target.value)} className="w-full bg-transparent text-center text-xs text-white focus:outline-none h-8" />
                            </td>
                            <td className="p-1">
                              <input type="text" value={formData.progress[item.key].change} onChange={(e) => handleProgressChange(item.key, 'change', e.target.value)} className="w-full bg-transparent text-center text-xs text-[#ccf141] font-black focus:outline-none h-8" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-[#ccf141] p-2 text-black text-[9px] font-black uppercase tracking-wider">
                    THE SCORECARD RULE — every profile must clearly show what changed. If no key benchmark improved, your coach explains why and records what changes in the next training block — before you ask.
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="space-y-1 pt-4 border-t border-[var(--db-card-border)]">
                  <div className="bg-black border border-[var(--db-card-border)] flex">
                    <div className="bg-white text-black p-2 flex items-center justify-center shrink-0">
                      <span className="w-4 h-4 bg-[#ccf141] flex items-center justify-center text-[10px] font-black">▶</span>
                    </div>
                    <div className="p-2 w-full">
                      <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-1">What we don't do here</h4>
                      <p className="text-[9px] text-[var(--db-text-muted)] leading-tight">
                        Box & Cross measures <strong>performance</strong>. We do not carry out blood or hormone panels, ECG, echocardiogram, ultrasound, or any form of medical diagnosis - and we will never interpret one. Where a medical assessment is the right next step, we refer you to our partner clinic and build your training around what they find.
                      </p>
                    </div>
                  </div>
                  <p className="text-[8px] text-neutral-600 uppercase text-center mt-2">
                    <strong>NOT A MEDICAL ASSESSMENT.</strong> The measures on this profile describe physical performance only. They are not a diagnosis, a screening for disease, or a substitute for medical advice.
                  </p>
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
                form="athleteProfileForm"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#ccf141] text-black font-black text-[11px] uppercase tracking-wider hover:bg-[#b0d136] transition-all shadow-[0_0_15px_rgba(204,241,65,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Profile"
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
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Delete Profile?</h3>
            <p className="text-[13px] text-[var(--db-text-muted)] mb-6">
              This action cannot be undone. Are you sure you want to delete this Athlete Performance Profile?
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

export default AthletePerformanceProfile;
