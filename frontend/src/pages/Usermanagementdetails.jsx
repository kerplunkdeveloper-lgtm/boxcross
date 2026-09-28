import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Dumbbell,
  CheckCircle2,
  Copy,
  Check,
  Download,
  RefreshCw,
  X,
  User,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  Phone,
  Mail,
  QrCode,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getAthletes,
  getNextMemberId,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getAthleteStats,
  impersonateAthlete,
} from "../api/api";
import { useAuth } from "../context/AuthContext";

const PRESET_COACHES = [
  "Vivek",
  "Coach Prabha",
  "Marcus Wright",
  "Jenkins",
  "Alex Carter",
  "Jessica Pearson",
  "David Chen",
  "Emily Davis",
  "Michael Scott",
  "Chloe Adams",
  "James Wilson",
];

const generateRandomPassword = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `bxc${rand}`;
};

const Usermanagementdetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
    others: 0,
    coachesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [coachFilter, setCoachFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  // View Member Details Card Modal
  const [viewingAthlete, setViewingAthlete] = useState(null);

  // Reveal password map for table rows
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    athleteName: "",
    memberId: "BOXCROSS-001",
    password: generateRandomPassword(),
    age: "",
    gender: "Male",
    dateOfJoining: new Date().toISOString().split("T")[0],
    coach: "Vivek",
    customCoach: "",
    phone: "",
    email: "",
    status: "Active",
    notes: "",
  });
  const [isCustomCoach, setIsCustomCoach] = useState(false);

  // Fetch Athletes list
  const fetchAthletesList = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      setRefreshing(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (genderFilter !== "All") params.gender = genderFilter;
      if (coachFilter !== "All") params.coach = coachFilter;
      if (statusFilter !== "All") params.status = statusFilter;

      const { data } = await getAthletes(params);
      if (data && data.success) {
        setAthletes(data.data || []);
      }
    } catch (err) {
      console.error("Error loading athletes:", err);
      if (err.response?.status !== 401 && err.code !== "ERR_NETWORK") {
        toast.error("Failed to load athlete list");
      }
    } finally {
      if (showSpinner) setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Stats
  const fetchStatsData = async () => {
    try {
      const { data } = await getAthleteStats();
      if (data && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading athlete stats:", err);
    }
  };

  // Load next Member ID for the create form
  const fetchNextId = async () => {
    try {
      const { data } = await getNextMemberId();
      if (data && data.success && data.nextMemberId) {
        setFormData((prev) => ({
          ...prev,
          memberId: data.nextMemberId,
        }));
      }
    } catch (err) {
      console.error("Error generating next member ID:", err);
    }
  };

  useEffect(() => {
    fetchAthletesList(true);
    fetchStatsData();
  }, [genderFilter, coachFilter, statusFilter]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAthletesList(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open Add Modal
  const handleOpenAddModal = async () => {
    setIsEditing(false);
    setSelectedAthleteId(null);
    setIsCustomCoach(false);
    setShowPasswordInModal(false);

    let nextId = "BOXCROSS-001";
    try {
      const { data } = await getNextMemberId();
      if (data && data.success && data.nextMemberId) {
        nextId = data.nextMemberId;
      }
    } catch (e) {
      console.warn("Could not fetch next ID, using fallback", e);
    }

    setFormData({
      athleteName: "",
      memberId: nextId,
      password: generateRandomPassword(),
      age: "",
      gender: "Male",
      dateOfJoining: new Date().toISOString().split("T")[0],
      coach: PRESET_COACHES[0],
      customCoach: "",
      phone: "",
      email: "",
      status: "Active",
      notes: "",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (athlete) => {
    setIsEditing(true);
    setSelectedAthleteId(athlete._id);
    setShowPasswordInModal(false);

    const isPreset = PRESET_COACHES.includes(athlete.coach);
    setIsCustomCoach(!isPreset);

    const formattedDate = athlete.dateOfJoining
      ? new Date(athlete.dateOfJoining).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setFormData({
      athleteName: athlete.athleteName || "",
      memberId: athlete.memberId || "",
      password: athlete.initialPassword || "",
      age: athlete.age || "",
      gender: athlete.gender || "Male",
      dateOfJoining: formattedDate,
      coach: isPreset ? athlete.coach : "Custom",
      customCoach: isPreset ? "" : athlete.coach,
      phone: athlete.phone || "",
      email: athlete.email || "",
      status: athlete.status || "Active",
      notes: athlete.notes || "",
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.athleteName.trim()) {
      toast.error("Athlete Name is required");
      return;
    }
    if (!formData.age || Number(formData.age) <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    if (!formData.memberId.trim()) {
      toast.error("Member ID is required");
      return;
    }
    if (!formData.password || formData.password.trim().length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }

    const assignedCoach = isCustomCoach
      ? formData.customCoach.trim()
      : formData.coach.trim();

    if (!assignedCoach) {
      toast.error("Please select or specify a Coach");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        athleteName: formData.athleteName.trim(),
        memberId: formData.memberId.trim().toUpperCase(),
        password: formData.password.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        dateOfJoining: formData.dateOfJoining,
        coach: assignedCoach,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: formData.status,
        notes: formData.notes.trim(),
      };

      if (isEditing) {
        const { data } = await updateAthlete(selectedAthleteId, payload);
        if (data && data.success) {
          toast.success("Athlete profile updated successfully!");
          setIsModalOpen(false);
          fetchAthletesList(false);
          fetchStatsData();
        }
      } else {
        const { data } = await createAthlete(payload);
        if (data && data.success) {
          toast.success(
            `Athlete registered as ${data.data.memberId} with password!`,
            { duration: 5000 }
          );
          setIsModalOpen(false);
          fetchAthletesList(false);
          fetchStatsData();
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        err.response?.data?.message || "Failed to save athlete details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, memberId, name) => {
    if (
      !window.confirm(
        `Are you sure you want to remove athlete ${name} (${memberId})?`
      )
    ) {
      return;
    }

    try {
      const { data } = await deleteAthlete(id);
      if (data && data.success) {
        toast.success(`Removed ${name} from user list.`);
        setAthletes((prev) => prev.filter((a) => a._id !== id));
        fetchStatsData();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete athlete.");
    }
  };

  // Copy Full Login Credentials (ID + Password)
  const handleCopyCredentials = (athlete) => {
    const credText = `🏋️ Box & Cross Member Portal Login\nMember ID: ${athlete.memberId}\nPassword: ${athlete.initialPassword || "bxc12345"}\nLogin Link: ${window.location.origin}/login?tab=athlete`;
    navigator.clipboard.writeText(credText);
    toast.success(`Copied login credentials for ${athlete.athleteName}!`);
  };

  // Impersonate / Switch User to Athlete Portal
  const handleImpersonateAthlete = async (athlete) => {
    try {
      toast.loading(`Switching to ${athlete.athleteName}...`, { id: "impersonate-toast" });
      const { data } = await impersonateAthlete(athlete._id);
      if (data && data.success) {
        localStorage.setItem(
          "boxcross_impersonator_admin",
          JSON.stringify({
            id: user?._id,
            name: user?.name || "Admin",
            email: user?.email,
            role: user?.role || "admin",
            returnUrl: window.location.pathname,
          })
        );
        localStorage.setItem("boxcross_athlete_token", data.token);
        localStorage.setItem("boxcross_athlete", JSON.stringify(data.athlete));
        toast.success(`Logged in as ${data.athlete.athleteName}!`, { id: "impersonate-toast" });
        navigate("/athlete-dashboard");
      } else {
        toast.error(data?.message || "Failed to switch user", { id: "impersonate-toast" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Impersonation login failed", { id: "impersonate-toast" });
    }
  };

  // Toggle reveal password
  const toggleRevealPassword = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (athletes.length === 0) {
      toast.error("No athlete data to export.");
      return;
    }

    const headers = [
      "Member ID",
      "Athlete Name",
      "Password",
      "Age",
      "Gender",
      "Date of Joining",
      "Coach",
      "Phone",
      "Email",
      "Status",
    ];

    const rows = athletes.map((a) => [
      `"${a.memberId || ""}"`,
      `"${a.athleteName || ""}"`,
      `"${a.initialPassword || "bxc12345"}"`,
      a.age || "",
      `"${a.gender || ""}"`,
      `"${a.dateOfJoining ? new Date(a.dateOfJoining).toLocaleDateString() : ""}"`,
      `"${a.coach || ""}"`,
      `"${a.phone || ""}"`,
      `"${a.email || ""}"`,
      `"${a.status || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `BoxCross_Athletes_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-[var(--db-accent-highlight)]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)]">
                <Users size={20} />
              </span>
              <h1
                className="text-xl sm:text-xl font-black uppercase tracking-wider text-[var(--db-text)]"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                USER MANAGEMENT
              </h1>
            </div>
           
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchAthletesList(true);
                fetchStatsData();
              }}
              title="Refresh Records"
              className="p-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-text)] hover:text-[var(--db-accent-highlight)] hover:border-[var(--db-accent-highlight)]/30 transition-all cursor-pointer"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin text-[var(--db-accent-highlight)]" : ""}
              />
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-xs font-bold text-[var(--db-text)] hover:text-[var(--db-accent-highlight)] hover:border-[var(--db-accent-highlight)]/30 transition-all cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Plus size={16} />
              <span>Add Athlete / User</span>
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-text-muted)]">
                Total Athletes
              </p>
              <h3 className="text-2xl font-black mt-1 text-[var(--db-text)]">
                {stats.total || athletes.length}
              </h3>
              <p className="text-[11px] text-[var(--db-accent-highlight)] mt-1 font-semibold">
                Starting BOXCROSS-001
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--db-accent-highlight)]/10 border border-[var(--db-accent-highlight)]/20 flex items-center justify-center text-[var(--db-accent-highlight)]">
              <Users size={22} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-text-muted)]">
                Active Status
              </p>
              <h3 className="text-2xl font-black mt-1 text-emerald-400">
                {stats.active || athletes.filter((a) => a.status === "Active").length}
              </h3>
              <p className="text-[11px] text-[var(--db-text-muted)] mt-1">
                Active in training programs
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={22} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-text-muted)]">
                Gender Ratio
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-md">
                  M: {stats.male || athletes.filter((a) => a.gender === "Male").length}
                </span>
                <span className="text-xs font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded-md">
                  F: {stats.female || athletes.filter((a) => a.gender === "Female").length}
                </span>
                <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-md">
                  O: {stats.others || athletes.filter((a) => a.gender === "Others").length}
                </span>
              </div>
              <p className="text-[11px] text-[var(--db-text-muted)] mt-1.5">
                Male / Female / Others
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <UserCheck size={22} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-5 shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-text-muted)]">
                Portal Ready
              </p>
              <h3 className="text-2xl font-black mt-1 text-[#e5ff00]">
                {athletes.length}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                ID + Password Enabled
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Key size={22} />
            </div>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
              />
              <input
                type="text"
                placeholder="Search by Athlete name, MemberID (e.g. BOXCROSS-001), Coach, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
              {/* Gender Filter */}
              <div className="flex items-center gap-1.5 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] uppercase font-bold text-[var(--db-text-muted)]">
                  Gender:
                </span>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[var(--db-text)] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    All
                  </option>
                  <option value="Male" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    Male
                  </option>
                  <option value="Female" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    Female
                  </option>
                  <option value="Others" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    Others
                  </option>
                </select>
              </div>

              {/* Coach Filter */}
              <div className="flex items-center gap-1.5 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] uppercase font-bold text-[var(--db-text-muted)]">
                  Coach:
                </span>
                <select
                  value={coachFilter}
                  onChange={(e) => setCoachFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[var(--db-text)] focus:outline-none cursor-pointer max-w-[130px]"
                >
                  <option value="All" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    All Coaches
                  </option>
                  {PRESET_COACHES.map((c) => (
                    <option key={c} value={c} className="bg-[var(--db-card)] text-[var(--db-text)]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] uppercase font-bold text-[var(--db-text-muted)]">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[var(--db-text)] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    All
                  </option>
                  <option value="Active" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    Active
                  </option>
                  <option value="Inactive" className="bg-[var(--db-card)] text-[var(--db-text)]">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Clear Filters */}
              {(genderFilter !== "All" || coachFilter !== "All" || statusFilter !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setGenderFilter("All");
                    setCoachFilter("All");
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                  className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 font-bold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Athletes Table */}
        <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--db-accent-highlight)] animate-pulse" />
              <h2
                className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--db-text)]"
                style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
              >
                Athletes Directory ({athletes.length})
              </h2>
            </div>
            <span className="text-[10px] text-[var(--db-text-muted)] font-medium">
              Click any athlete to view their Digital Pass & Credentials
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--db-text-muted)] gap-3">
              <div className="w-9 h-9 border-2 border-[var(--db-accent-highlight)]/20 border-t-[var(--db-accent-highlight)] rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading athletes database...</p>
            </div>
          ) : athletes.length === 0 ? (
            <div className="py-16 text-center px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] mx-auto flex items-center justify-center border border-[var(--db-accent-highlight)]/20">
                <Users size={28} />
              </div>
              <h3 className="text-base font-bold text-[var(--db-text)]">
                No Athletes Found
              </h3>
              <p className="text-xs text-[var(--db-text-muted)] max-w-md mx-auto">
                No athletes matched your query. Click below to add the first athlete with auto-generated ID (BOXCROSS-001) and password.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <Plus size={14} /> Add Athlete
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1260px]">
                <thead>
                  <tr className="bg-[var(--db-input-bg)]/80 text-[var(--db-text-muted)] text-[11px] uppercase font-black tracking-widest border-b border-[var(--db-card-border)] select-none">
                    <th className="py-4 px-5 whitespace-nowrap min-w-[140px] text-left">Member ID</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[260px] text-left">Athlete / User Name</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[170px] text-left">Portal Password</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[95px] text-center">Age</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[110px] text-center">Gender</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[150px] text-left">Date of Joining</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[160px] text-left">Assigned Coach</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[120px] text-center">Status</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[200px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)] text-xs">
                  {athletes.map((athlete) => {
                    const isRevealed = revealedPasswords[athlete._id];
                    return (
                      <tr
                        key={athlete._id}
                        className="hover:bg-[var(--db-sidebar-link-hover)]/70 transition-colors group/row"
                      >
                        {/* Member ID */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(athlete.memberId);
                              toast.success(`Copied ${athlete.memberId}`);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/30 hover:bg-[var(--db-accent-highlight)]/20 hover:border-[var(--db-accent-highlight)] font-mono font-bold text-xs tracking-wider transition-all cursor-pointer group shadow-sm"
                            title="Click to copy Member ID"
                          >
                            <span className="whitespace-nowrap">{athlete.memberId}</span>
                            <Copy
                              size={12}
                              className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                            />
                          </button>
                        </td>

                        {/* Athlete Name + Quick Contact */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <div
                            onClick={() => setViewingAthlete(athlete)}
                            className="flex items-center gap-3.5 cursor-pointer group/name"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-[var(--db-card-border)] flex items-center justify-center font-black text-sm text-[var(--db-accent-highlight)] shrink-0 group-hover/name:border-[var(--db-accent-highlight)] group-hover/name:scale-105 transition-all shadow-md">
                              {athlete.athleteName
                                ? athlete.athleteName.charAt(0).toUpperCase()
                                : "A"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--db-text)] text-sm group-hover/name:text-[var(--db-accent-highlight)] transition-colors whitespace-nowrap">
                                {athlete.athleteName}
                              </p>
                              {(athlete.phone || athlete.email) && (
                                <div className="flex items-center gap-3 text-[11px] text-[var(--db-text-muted)] mt-0.5 whitespace-nowrap">
                                  {athlete.phone && (
                                    <span className="inline-flex items-center gap-1 font-medium">
                                      <Phone size={11} className="text-[var(--db-accent-highlight)]/70 shrink-0" />
                                      <span>{athlete.phone}</span>
                                    </span>
                                  )}
                                  {athlete.email && (
                                    <span className="inline-flex items-center gap-1 font-medium text-[var(--db-text-muted)] truncate max-w-[180px]" title={athlete.email}>
                                      <Mail size={11} className="text-sky-400/70 shrink-0" />
                                      <span>{athlete.email}</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Portal Password Column */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle">
                          <div className="inline-flex items-center gap-2 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] px-3 py-1.5 rounded-xl shadow-inner">
                            <span className="font-mono text-xs font-bold text-[var(--db-text)] tracking-wider">
                              {isRevealed
                                ? athlete.initialPassword || "bxc12345"
                                : "••••••••"}
                            </span>
                            <div className="flex items-center gap-1 pl-1.5 border-l border-[var(--db-card-border)]">
                              <button
                                type="button"
                                onClick={() => toggleRevealPassword(athlete._id)}
                                className="p-1 rounded-md text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-white/5 transition-colors cursor-pointer"
                                title={isRevealed ? "Hide Password" : "Show Password"}
                              >
                                {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyCredentials(athlete)}
                                className="p-1 rounded-md text-[var(--db-accent-highlight)] hover:text-white hover:bg-[var(--db-accent-highlight)]/15 transition-colors cursor-pointer"
                                title="Copy Full Login Credentials (ID + Password)"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Age */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-center font-semibold text-[var(--db-text)]">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                            {athlete.age ? `${athlete.age} yrs` : "—"}
                          </span>
                        </td>

                        {/* Gender */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-center font-semibold">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm ${
                              athlete.gender === "Male"
                                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                : athlete.gender === "Female"
                                ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                                : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {athlete.gender || "N/A"}
                          </span>
                        </td>

                        {/* Date of Joining */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-[var(--db-text-muted)]">
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--db-text)] whitespace-nowrap">
                            <Calendar size={13} className="text-[var(--db-accent-highlight)] shrink-0" />
                            <span className="whitespace-nowrap">
                              {athlete.dateOfJoining
                                ? new Date(athlete.dateOfJoining).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Coach */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle font-semibold">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] text-xs font-bold shadow-sm whitespace-nowrap">
                            <Dumbbell size={13} className="text-amber-400 shrink-0" />
                            <span className="whitespace-nowrap">{athlete.coach || "Unassigned"}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                              athlete.status === "Active"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                athlete.status === "Active"
                                  ? "bg-emerald-400 animate-pulse"
                                  : "bg-neutral-400"
                              }`}
                            />
                            <span>{athlete.status || "Active"}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 whitespace-nowrap align-middle text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {/* Impersonate / Switch User */}
                            <button
                              onClick={() => handleImpersonateAthlete(athlete)}
                              title={`Login as ${athlete.athleteName} (Impersonate)`}
                              className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                            >
                              <UserCheck size={13} className="shrink-0" />
                              <span className="whitespace-nowrap">Login As</span>
                            </button>

                            {/* View QR Pass */}
                            <button
                              onClick={() => setViewingAthlete(athlete)}
                              title="View Full Pass & Details"
                              className="p-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent-highlight)]/15 hover:border-[var(--db-accent-highlight)]/40 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <QrCode size={14} />
                            </button>

                            {/* Edit Athlete */}
                            <button
                              onClick={() => handleOpenEditModal(athlete)}
                              title="Edit Athlete"
                              className="p-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-sm hover:scale-105"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Delete Athlete */}
                            <button
                              onClick={() =>
                                handleDelete(
                                  athlete._id,
                                  athlete.memberId,
                                  athlete.athleteName
                                )
                              }
                              title="Delete Athlete"
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
          )}
        </div>
      </div>

      {/* Modal for Add / Edit Athlete */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 sm:p-7 relative text-[var(--db-text)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--db-card-border)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--db-accent-highlight)]/10 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/25 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-black uppercase tracking-wider"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {isEditing ? "Edit Athlete Details" : "Register New Athlete / User"}
                  </h3>
                  <p className="text-xs text-[var(--db-text-muted)]">
                    {isEditing
                      ? "Update athlete profile and credentials"
                      : "Create athlete record with auto-generated Member ID & password"}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 2-Column: Member ID & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Member ID Field (Auto-generated) */}
                  <div className="bg-[var(--db-input-bg)] border border-[var(--db-accent-highlight)]/30 rounded-xl p-3 space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)] flex items-center gap-1">
                        <Sparkles size={11} />
                        Member ID
                      </label>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={fetchNextId}
                          title="Generate Next ID"
                          className="text-[9px] font-bold text-[var(--db-accent-highlight)] hover:underline cursor-pointer"
                        >
                          Auto-Gen
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={formData.memberId}
                      onChange={(e) =>
                        setFormData({ ...formData, memberId: e.target.value })
                      }
                      placeholder="BOXCROSS-001"
                      required
                      className="w-full font-mono font-bold tracking-wider text-sm bg-transparent border-0 text-[var(--db-text)] focus:outline-none"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl p-3 space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--db-text-muted)] flex items-center gap-1">
                        <Key size={11} className="text-[var(--db-accent-highlight)]" />
                        Portal Password <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            password: generateRandomPassword(),
                          })
                        }
                        className="text-[9px] font-bold text-[var(--db-accent-highlight)] hover:underline cursor-pointer"
                      >
                        Randomize
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type={showPasswordInModal ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter password"
                        required
                        className="w-full font-mono font-bold text-sm bg-transparent border-0 text-[var(--db-text)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                        className="text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                      >
                        {showPasswordInModal ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Athlete Name */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                    Athlete Name / User Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.athleteName}
                    onChange={(e) =>
                      setFormData({ ...formData, athleteName: e.target.value })
                    }
                    placeholder="e.g. John Doe / Rohit Verma"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] text-xs"
                  />
                </div>

                {/* Age & Gender (Row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      placeholder="e.g. 26"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Male", "Female", "Others"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            formData.gender === g
                              ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] border-[var(--db-accent)] shadow-md"
                              : "bg-[var(--db-input-bg)] border-[var(--db-input-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)]"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                    Date of Joining <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfJoining: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] text-xs"
                  />
                </div>

                {/* Coach Selection */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                    Assigned Coach <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={isCustomCoach ? "Custom" : formData.coach}
                    onChange={(e) => {
                      if (e.target.value === "Custom") {
                        setIsCustomCoach(true);
                      } else {
                        setIsCustomCoach(false);
                        setFormData({ ...formData, coach: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] text-xs cursor-pointer mb-2"
                  >
                    {PRESET_COACHES.map((coach) => (
                      <option
                        key={coach}
                        value={coach}
                        className="bg-[var(--db-card)] text-[var(--db-text)]"
                      >
                        {coach}
                      </option>
                    ))}
                    <option
                      value="Custom"
                      className="bg-[var(--db-card)] text-[var(--db-accent-highlight)] font-bold"
                    >
                      + Other / Custom Coach
                    </option>
                  </select>

                  {isCustomCoach && (
                    <input
                      type="text"
                      placeholder="Type custom coach name..."
                      value={formData.customCoach}
                      onChange={(e) =>
                        setFormData({ ...formData, customCoach: e.target.value })
                      }
                      required={isCustomCoach}
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-accent-highlight)]/40 text-[var(--db-text)] focus:outline-none text-xs"
                    />
                  )}
                </div>

                {/* Optional Contact Fields (Phone & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="athlete@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] focus:outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="pt-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1">
                    Membership Status
                  </label>
                  <div className="flex items-center gap-3">
                    {["Active", "Inactive"].map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={formData.status === s}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="accent-[var(--db-accent-highlight)]"
                        />
                        <span
                          className={
                            s === "Active"
                              ? "text-emerald-400 font-bold"
                              : "text-[var(--db-text-muted)]"
                          }
                        >
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--db-card-border)]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-sidebar-link-hover)] text-xs font-bold text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {submitting
                      ? "Saving..."
                      : isEditing
                      ? "Update Athlete"
                      : "Save Athlete & Credentials"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Full Details / Digital Pass Modal */}
      <AnimatePresence>
        {viewingAthlete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/20 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 text-white shadow-2xl relative"
            >
              <button
                onClick={() => setViewingAthlete(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>

              {/* Pass Card Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#e5ff00]">
                      BOX & CROSS ATHLETE PASS
                    </span>
                    <h2
                      className="text-xl font-black uppercase tracking-wider text-white"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {viewingAthlete.athleteName}
                    </h2>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                    {viewingAthlete.status || "Active"}
                  </span>
                </div>

                {/* ID & Password Display */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/60 border border-[#e5ff00]/40 p-3.5 rounded-2xl">
                    <p className="text-[9px] uppercase font-bold text-[#e5ff00]">
                      Member ID
                    </p>
                    <p className="font-mono text-base font-black text-white mt-0.5">
                      {viewingAthlete.memberId}
                    </p>
                  </div>

                  <div className="bg-black/60 border border-white/15 p-3.5 rounded-2xl">
                    <p className="text-[9px] uppercase font-bold text-zinc-400">
                      Login Password
                    </p>
                    <p className="font-mono text-base font-black text-white mt-0.5">
                      {viewingAthlete.initialPassword || "bxc12345"}
                    </p>
                  </div>
                </div>

                {/* Detailed Attributes */}
                <div className="space-y-2 text-xs bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Assigned Coach</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Dumbbell size={12} className="text-amber-400" />
                      Coach {viewingAthlete.coach}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Age & Gender</span>
                    <span className="font-bold text-white">
                      {viewingAthlete.age} yrs • {viewingAthlete.gender}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Date of Joining</span>
                    <span className="font-bold text-white">
                      {viewingAthlete.dateOfJoining
                        ? new Date(viewingAthlete.dateOfJoining).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "N/A"}
                    </span>
                  </div>

                  {viewingAthlete.phone && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Phone</span>
                      <span className="font-bold text-white">{viewingAthlete.phone}</span>
                    </div>
                  )}

                  {viewingAthlete.email && (
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Email</span>
                      <span className="font-bold text-white">{viewingAthlete.email}</span>
                    </div>
                  )}
                </div>

                {/* Quick Share & Impersonate Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleImpersonateAthlete(viewingAthlete)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <UserCheck size={16} />
                    <span>Login / Switch to Athlete Portal</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyCredentials(viewingAthlete)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#e5ff00] text-black font-extrabold uppercase text-[11px] tracking-wider flex items-center justify-center gap-1.5 hover:bg-white transition-all cursor-pointer shadow-md"
                    >
                      <Copy size={13} />
                      <span>Copy Credentials</span>
                    </button>

                    {viewingAthlete.phone && (
                      <a
                        href={`https://wa.me/${viewingAthlete.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${viewingAthlete.athleteName}, Welcome to Box & Cross! Here are your Athlete Portal credentials:\nMember ID: ${viewingAthlete.memberId}\nPassword: ${viewingAthlete.initialPassword || "bxc12345"}\nLogin: ${window.location.origin}/login?tab=athlete`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-emerald-500/30 transition-all cursor-pointer"
                      >
                        <Share2 size={13} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Usermanagementdetails;
