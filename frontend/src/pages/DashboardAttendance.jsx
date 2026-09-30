import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Fingerprint,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Activity,
  UserCheck,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Check,
  Save,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Scan,
  Maximize2,
  SlidersHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  getAttendance,
  markManualAttendance,
  updateAttendance,
  resetAttendance,
  punchBiometric,
  deleteAttendance,
  getAthletes,
} from "../api/api";
import { useTheme } from "../context/ThemeContext";

// Web Audio API sound synthesizer for Biometric Terminal feedback
const playTerminalSound = (type = "success") => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "success") {
      // Pleasant futuristic high-tech chime (two-tone ascending)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.08); // D6
      osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.22); // A6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start(ctx.currentTime + 0.08);
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (type === "error") {
      // Low dual warning buzzer
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(120, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors if browser blocks autoplay
  }
};

// Format Date YYYY-MM-DD
const formatDateStr = (d = new Date()) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format current time HH:MM AM/PM
const formatCurrentTime = () => {
  const date = new Date();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

const BATCH_OPTIONS = [
  "All",
  "Morning (06:00 - 08:00 AM)",
  "Hyrox Endurance (08:30 - 10:30 AM)",
  "Evening CrossFit (05:00 - 07:00 PM)",
  "Night Conditioning (07:30 - 09:30 PM)",
];

const METHOD_OPTIONS = ["Biometric", "Manual", "RFID", "FaceID", "QR"];

const DashboardAttendance = () => {
  const { theme } = useTheme();

  // Active top tab: "biometric" | "sheet" | "logs"
  const [activeTab, setActiveTab] = useState("biometric");

  // Filter & date states
  const [selectedDate, setSelectedDate] = useState(formatDateStr());
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Core Data
  const [loading, setLoading] = useState(true);
  const [savingBulk, setSavingBulk] = useState(false);
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [stats, setStats] = useState({
    totalAthletes: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    unmarkedCount: 0,
    biometricCount: 0,
    manualCount: 0,
    attendanceRate: 0,
  });
  const [allAthletes, setAllAthletes] = useState([]);

  // Biometric Terminal Simulator States
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [punchMode, setPunchMode] = useState("auto"); // "auto" | "check_in" | "check_out"
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedAthleteIdForScan, setSelectedAthleteIdForScan] = useState("");
  const [manualBarcodeScanInput, setManualBarcodeScanInput] = useState("");
  const [lastScanResult, setLastScanResult] = useState(null);
  const [recentTerminalPunches, setRecentTerminalPunches] = useState([]);

  // ──────────────── EDIT & DELETE MODALS STATES ────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [isResetTodayModalOpen, setIsResetTodayModalOpen] = useState(false);
  const [resettingTodayLoading, setResettingTodayLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingRecord, setCreatingRecord] = useState({
    athleteId: "",
    date: formatDateStr(),
    status: "Present",
    checkInTime: formatCurrentTime(),
    checkOutTime: "",
    method: "Manual",
    batch: "General",
    notes: "",
  });
  const [creatingLoading, setCreatingLoading] = useState(false);

  // Live Clock
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeDisplay(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Attendance Data
  const fetchAttendanceData = async (date = selectedDate, batch = selectedBatch) => {
    try {
      setLoading(true);
      const { data } = await getAttendance({
        date,
        batch: batch === "All" ? undefined : batch,
        search: searchQuery,
      });

      if (data && data.success) {
        setAttendanceSheet(data.sheet || []);
        if (data.stats) setStats(data.stats);

        // Update recent terminal punches if on today
        if (data.records && data.records.length > 0) {
          const biometricOnly = data.records.filter(
            (r) => r.method === "Biometric" || r.method === "RFID"
          );
          setRecentTerminalPunches(biometricOnly.slice(0, 15));
        } else {
          setRecentTerminalPunches([]);
        }
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
      toast.error(err.response?.data?.message || "Failed to load attendance sheet");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all athletes once for quick scan simulator dropdown
  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const { data } = await getAthletes({ limit: 150 });
        if (data && data.athletes) {
          setAllAthletes(data.athletes);
          if (data.athletes.length > 0 && !selectedAthleteIdForScan) {
            setSelectedAthleteIdForScan(data.athletes[0]._id);
          }
        }
      } catch (err) {
        console.warn("Could not load athletes dropdown:", err);
      }
    };
    loadAthletes();
  }, []);

  // Refresh attendance whenever date or batch changes
  useEffect(() => {
    fetchAttendanceData(selectedDate, selectedBatch);
  }, [selectedDate, selectedBatch]);

  // Handle Quick Date Buttons (Yesterday, Today, Tomorrow)
  const handleDateShift = (direction) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + direction);
    setSelectedDate(formatDateStr(d));
  };

  // ──────────────── BIOMETRIC SCAN TRIGGER ────────────────
  const handleSimulateBiometricScan = async (overrideAthleteId = null, overrideMemberId = null) => {
    const athleteToScan = overrideAthleteId || selectedAthleteIdForScan;
    const memberIdToScan = overrideMemberId || manualBarcodeScanInput.trim();

    if (!athleteToScan && !memberIdToScan) {
      toast.error("Please choose an athlete or enter a Member ID to scan.");
      return;
    }

    setScannerActive(true);

    try {
      const payload = {
        punchType: punchMode,
        terminalId: "BXC-TERMINAL-01",
        deviceName: "BioSync-X1 Biometric Reader",
        location: "Main Gym Entrance Gate",
      };

      if (memberIdToScan) {
        payload.memberId = memberIdToScan;
      } else {
        payload.athleteId = athleteToScan;
      }

      // Simulate a small realistic 450ms biometric scanning laser delay
      await new Promise((resolve) => setTimeout(resolve, 550));

      const { data } = await punchBiometric(payload);

      if (data && data.success) {
        if (soundEnabled) playTerminalSound("success");
        setLastScanResult({
          type: "success",
          action: data.action,
          actionText: data.actionText,
          athlete: data.athlete,
          record: data.record,
          meta: data.biometricMeta,
          welcomeText: data.welcomeText,
          timestamp: new Date().toLocaleTimeString(),
        });

        toast.success(
          `${data.action === "CHECK_IN" ? "✅ Check-In" : "👋 Check-Out"}: ${data.athlete.athleteName} (${data.athlete.memberId})`
        );

        // Prepend to recent punches stream
        setRecentTerminalPunches((prev) => [data.record, ...prev.filter((p) => p._id !== data.record._id).slice(0, 14)]);

        // Refresh table silently in background
        fetchAttendanceData(selectedDate, selectedBatch);
        setManualBarcodeScanInput("");
      } else {
        if (soundEnabled) playTerminalSound("error");
        setLastScanResult({
          type: "error",
          message: data?.message || "Biometric validation failed",
          timestamp: new Date().toLocaleTimeString(),
        });
        toast.error(data?.message || "Biometric verification failed");
      }
    } catch (err) {
      if (soundEnabled) playTerminalSound("error");
      const errMsg = err.response?.data?.message || "Biometric Terminal Error";
      setLastScanResult({
        type: "error",
        message: errMsg,
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.error(errMsg);
    } finally {
      setScannerActive(false);
    }
  };

  // ──────────────── MANUAL ATTENDANCE ROW UPDATE ────────────────
  const handleRowStatusChange = (athleteId, newStatus) => {
    setAttendanceSheet((prev) =>
      prev.map((row) => {
        if (row.athlete === athleteId) {
          const isPresent = newStatus === "Present" || newStatus === "Late";
          return {
            ...row,
            status: newStatus,
            checkInTime:
              isPresent && !row.checkInTime ? formatCurrentTime() : row.checkInTime,
            isMarked: true,
            _hasUnsavedChanges: true,
          };
        }
        return row;
      })
    );
  };

  const handleRowFieldChange = (athleteId, field, value) => {
    setAttendanceSheet((prev) =>
      prev.map((row) => {
        if (row.athlete === athleteId) {
          return {
            ...row,
            [field]: value,
            _hasUnsavedChanges: true,
          };
        }
        return row;
      })
    );
  };

  // Quick single row save
  const handleSaveSingleRow = async (row) => {
    try {
      const payload = {
        athleteId: row.athlete,
        date: selectedDate,
        status: row.status === "Unmarked" ? "Present" : row.status,
        checkInTime: row.checkInTime,
        checkOutTime: row.checkOutTime,
        batch: selectedBatch === "All" ? "General" : selectedBatch,
        notes: row.notes || "",
        method: row.method || "Manual",
      };

      const { data } = await markManualAttendance({ single: payload });
      if (data && data.success) {
        toast.success(`Updated attendance for ${row.athleteName}`);
        fetchAttendanceData(selectedDate, selectedBatch);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update row");
    }
  };

  // ──────────────── MODAL EDIT HANDLERS ────────────────
  const handleOpenEditModal = (recordOrRow) => {
    if (!recordOrRow) return;

    const athleteId = recordOrRow.athlete?._id || recordOrRow.athlete || recordOrRow.athleteId;
    const athleteName = recordOrRow.athleteName || recordOrRow.athlete?.athleteName || "";
    const memberId = recordOrRow.memberId || recordOrRow.athlete?.memberId || "";
    const coach = recordOrRow.coach || recordOrRow.athlete?.coach || "";

    setEditingRecord({
      _id: recordOrRow._id || null,
      athleteId,
      athleteName,
      memberId,
      coach,
      date: recordOrRow.date || selectedDate,
      status: recordOrRow.status === "Unmarked" ? "Present" : recordOrRow.status || "Present",
      checkInTime: recordOrRow.checkInTime || "",
      checkOutTime: recordOrRow.checkOutTime || "",
      method: recordOrRow.method || "Manual",
      batch: recordOrRow.batch && recordOrRow.batch !== "All" ? recordOrRow.batch : "General",
      notes: recordOrRow.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditModal = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      setSavingEdit(true);

      if (editingRecord._id) {
        // Direct update by record ID
        const { data } = await updateAttendance(editingRecord._id, {
          status: editingRecord.status,
          checkInTime: editingRecord.checkInTime,
          checkOutTime: editingRecord.checkOutTime,
          method: editingRecord.method,
          batch: editingRecord.batch,
          notes: editingRecord.notes,
          date: editingRecord.date,
        });

        if (data && data.success) {
          toast.success(data.message || "Attendance record updated successfully!");
          setIsEditModalOpen(false);
          setEditingRecord(null);
          fetchAttendanceData(selectedDate, selectedBatch);
        }
      } else {
        // Upsert by athleteId + date
        const payload = {
          athleteId: editingRecord.athleteId,
          date: editingRecord.date || selectedDate,
          status: editingRecord.status,
          checkInTime: editingRecord.checkInTime,
          checkOutTime: editingRecord.checkOutTime,
          method: editingRecord.method,
          batch: editingRecord.batch,
          notes: editingRecord.notes,
        };

        const { data } = await markManualAttendance({ single: payload });
        if (data && data.success) {
          toast.success(data.message || "Attendance marked successfully!");
          setIsEditModalOpen(false);
          setEditingRecord(null);
          fetchAttendanceData(selectedDate, selectedBatch);
        }
      }
    } catch (err) {
      console.error("Save edit error:", err);
      toast.error(err.response?.data?.message || "Failed to save attendance updates");
    } finally {
      setSavingEdit(false);
    }
  };

  // ──────────────── MODAL DELETE HANDLERS ────────────────
  const handleOpenDeleteModal = (recordOrRow) => {
    if (!recordOrRow) return;
    const athleteId = recordOrRow.athlete?._id || recordOrRow.athlete || recordOrRow.athleteId;
    const athleteName = recordOrRow.athleteName || recordOrRow.athlete?.athleteName || "Athlete";
    const memberId = recordOrRow.memberId || recordOrRow.athlete?.memberId || "";
    const date = recordOrRow.date || selectedDate;

    setDeletingRecord({
      _id: recordOrRow._id || null,
      athleteId,
      athleteName,
      memberId,
      date,
      status: recordOrRow.status || "Present",
      checkInTime: recordOrRow.checkInTime || "",
      checkOutTime: recordOrRow.checkOutTime || "",
      method: recordOrRow.method || "Manual",
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;

    try {
      setDeletingLoading(true);

      if (deletingRecord._id) {
        // Delete by ID
        const { data } = await deleteAttendance(deletingRecord._id);
        if (data && data.success) {
          toast.success(`Removed attendance record for ${deletingRecord.athleteName}`);
        }
      } else if (deletingRecord.athleteId && deletingRecord.date) {
        // Reset by athleteId and date
        const { data } = await resetAttendance({
          athleteId: deletingRecord.athleteId,
          date: deletingRecord.date,
        });
        if (data && data.success) {
          toast.success(`Reset attendance for ${deletingRecord.athleteName}`);
        }
      }

      // Close modal and refresh data
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
      if (isEditModalOpen) setIsEditModalOpen(false);

      // If deleted from lastScanResult, reset readout
      if (lastScanResult && lastScanResult.record?._id === deletingRecord._id) {
        setLastScanResult(null);
      }

      fetchAttendanceData(selectedDate, selectedBatch);
    } catch (err) {
      console.error("Delete record error:", err);
      toast.error(err.response?.data?.message || "Failed to remove attendance record");
    } finally {
      setDeletingLoading(false);
    }
  };

  // ──────────────── BULK RESET TODAY SHEET ────────────────
  const handleConfirmResetToday = async () => {
    try {
      setResettingTodayLoading(true);
      const markedRows = attendanceSheet.filter((r) => r._id || r.isMarked);

      if (markedRows.length === 0) {
        toast.error("No marked records to reset for this date.");
        setIsResetTodayModalOpen(false);
        return;
      }

      // Delete each marked record on this date
      for (const row of markedRows) {
        if (row._id) {
          await deleteAttendance(row._id).catch(() => {});
        } else if (row.athlete) {
          await resetAttendance({ athleteId: row.athlete, date: selectedDate }).catch(() => {});
        }
      }

      toast.success(`Reset all attendance records for ${selectedDate}`);
      setIsResetTodayModalOpen(false);
      setLastScanResult(null);
      fetchAttendanceData(selectedDate, selectedBatch);
    } catch (err) {
      console.error("Reset today error:", err);
      toast.error("Failed to reset attendance for today");
    } finally {
      setResettingTodayLoading(false);
    }
  };

  // ──────────────── CREATE MANUAL RECORD MODAL ────────────────
  const handleCreateNewRecord = async (e) => {
    e.preventDefault();
    if (!creatingRecord.athleteId) {
      toast.error("Please select an athlete");
      return;
    }

    try {
      setCreatingLoading(true);
      const athlete = allAthletes.find((a) => a._id === creatingRecord.athleteId);

      const payload = {
        athleteId: creatingRecord.athleteId,
        athleteName: athlete?.athleteName,
        memberId: athlete?.memberId,
        coach: athlete?.coach,
        date: creatingRecord.date || selectedDate,
        status: creatingRecord.status,
        checkInTime: creatingRecord.checkInTime,
        checkOutTime: creatingRecord.checkOutTime,
        method: creatingRecord.method,
        batch: creatingRecord.batch,
        notes: creatingRecord.notes,
        markedBy: "Admin (Manual Add)",
      };

      const { data } = await markManualAttendance({ single: payload });
      if (data && data.success) {
        toast.success(`Recorded attendance for ${athlete?.athleteName || "Athlete"}`);
        setIsCreateModalOpen(false);
        setCreatingRecord({
          athleteId: allAthletes[0]?._id || "",
          date: formatDateStr(),
          status: "Present",
          checkInTime: formatCurrentTime(),
          checkOutTime: "",
          method: "Manual",
          batch: "General",
          notes: "",
        });
        fetchAttendanceData(selectedDate, selectedBatch);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create attendance record");
    } finally {
      setCreatingLoading(false);
    }
  };

  // ──────────────── BULK ACTIONS ────────────────
  const handleMarkAllPresent = () => {
    const updated = attendanceSheet.map((row) => ({
      ...row,
      status: "Present",
      checkInTime: row.checkInTime || formatCurrentTime(),
      isMarked: true,
      _hasUnsavedChanges: true,
    }));
    setAttendanceSheet(updated);
    toast.success("All athletes marked Present locally. Click 'Save All' to sync!");
  };

  const handleMarkUnmarkedAbsent = () => {
    const updated = attendanceSheet.map((row) => {
      if (row.status === "Unmarked") {
        return {
          ...row,
          status: "Absent",
          checkInTime: "",
          checkOutTime: "",
          isMarked: true,
          _hasUnsavedChanges: true,
        };
      }
      return row;
    });
    setAttendanceSheet(updated);
    toast.success("Unmarked athletes set to Absent. Click 'Save All' to sync!");
  };

  const handleSaveAllChanges = async () => {
    try {
      setSavingBulk(true);
      const itemsToSave = attendanceSheet
        .filter((row) => row.status !== "Unmarked" || row._hasUnsavedChanges)
        .map((row) => ({
          athleteId: row.athlete,
          athleteName: row.athleteName,
          memberId: row.memberId,
          coach: row.coach,
          date: selectedDate,
          status: row.status === "Unmarked" ? "Absent" : row.status,
          checkInTime: row.checkInTime,
          checkOutTime: row.checkOutTime,
          batch: selectedBatch === "All" ? "General" : selectedBatch,
          notes: row.notes || "",
          method: row.method || "Manual",
        }));

      if (itemsToSave.length === 0) {
        toast.error("No marked attendance changes to save.");
        return;
      }

      const { data } = await markManualAttendance({ items: itemsToSave });
      if (data && data.success) {
        toast.success(data.message || "Attendance saved successfully!");
        fetchAttendanceData(selectedDate, selectedBatch);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSavingBulk(false);
    }
  };

  // ──────────────── CSV EXPORT ────────────────
  const handleExportCSV = () => {
    if (attendanceSheet.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Date",
      "Member ID",
      "Athlete Name",
      "Coach",
      "Status",
      "Check-In",
      "Check-Out",
      "Method",
      "Batch",
      "Notes",
    ];

    const rows = attendanceSheet.map((r) => [
      selectedDate,
      `"${r.memberId || ""}"`,
      `"${r.athleteName || ""}"`,
      `"${r.coach || ""}"`,
      r.status,
      r.checkInTime || "",
      r.checkOutTime || "",
      r.method || "Manual",
      selectedBatch,
      `"${r.notes || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `BoxCross_Attendance_${selectedDate}_${selectedBatch.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance sheet exported to CSV!");
  };

  // Filtered Sheet for Table
  const filteredSheet = useMemo(() => {
    return attendanceSheet.filter((row) => {
      // Status filter
      if (statusFilter !== "All" && row.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = row.athleteName?.toLowerCase().includes(q);
        const matchId = row.memberId?.toLowerCase().includes(q);
        const matchCoach = row.coach?.toLowerCase().includes(q);
        return matchName || matchId || matchCoach;
      }
      return true;
    });
  }, [attendanceSheet, statusFilter, searchQuery]);

  // Count unsaved changes
  const unsavedCount = attendanceSheet.filter((r) => r._hasUnsavedChanges).length;

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-5 max-w-8xl mx-auto select-none">
      {/* ──────────────── TOP HEADER & LIVE STATUS ──────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[var(--db-card-border)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)] flex items-center justify-center border border-[var(--db-accent-highlight)]/30 shadow-[0_0_12px_rgba(229,255,0,0.15)]">
              <Fingerprint size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--db-text)] flex items-center gap-2">
                Athlete Attendance &amp; Biometrics
                <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  LIVE TERMINAL
                </span>
              </h1>
              <p className="text-xs text-[var(--db-text-muted)] font-medium">
                Biometric punch simulator &amp; manual attendance management engine
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock, Action Buttons & Sound Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Quick Manual Record Button */}
          <button
            onClick={() => {
              setCreatingRecord({
                athleteId: allAthletes[0]?._id || "",
                date: selectedDate,
                status: "Present",
                checkInTime: formatCurrentTime(),
                checkOutTime: "",
                method: "Manual",
                batch: selectedBatch === "All" ? "General" : selectedBatch,
                notes: "",
              });
              setIsCreateModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Record</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{currentTimeDisplay}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? "bg-[var(--db-accent)]/15 border-[var(--db-accent-highlight)]/40 text-[var(--db-accent-highlight)]"
                : "bg-[var(--db-card)] border-[var(--db-card-border)] text-[var(--db-text-muted)]"
            }`}
            title={soundEnabled ? "Mute Biometric Terminal Sounds" : "Enable Terminal Sound FX"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => fetchAttendanceData(selectedDate, selectedBatch)}
            className="p-2 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text)] hover:border-[var(--db-accent-highlight)]/40 transition-colors cursor-pointer"
            title="Refresh Attendance Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ──────────────── KPI STATS CARDS ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* Total Athletes */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--db-text-muted)] mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Total Athletes</span>
            <Users size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[var(--db-text)]">
            {stats.totalAthletes}
          </p>
          <span className="text-[10px] text-zinc-400 font-medium">Registered Active</span>
        </div>

        {/* Present Today */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Present</span>
            <CheckCircle2 size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            {stats.presentCount}
          </p>
          <span className="text-[10px] text-emerald-500/80 font-medium">Checked-in on deck</span>
        </div>

        {/* Late Today */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-amber-500/30 bg-amber-500/5 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Late</span>
            <Clock size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.lateCount}</p>
          <span className="text-[10px] text-amber-500/80 font-medium">Delayed Punch</span>
        </div>

        {/* Absent */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-rose-500/30 bg-rose-500/5 shadow-sm">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Absent</span>
            <XCircle size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-400">{stats.absentCount}</p>
          <span className="text-[10px] text-rose-500/80 font-medium">No check-in</span>
        </div>

        {/* Attendance Rate */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-[var(--db-accent-highlight)]/30 bg-[var(--db-accent-glow)]/5 shadow-sm">
          <div className="flex items-center justify-between text-[var(--db-accent-highlight)] mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Turnout Rate</span>
            <Activity size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[var(--db-accent-highlight)]">
            {stats.attendanceRate}%
          </p>
          <span className="text-[10px] text-zinc-400 font-medium">Today's Attendance</span>
        </div>

        {/* Biometric Punches */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--db-card)] border border-cyan-500/30 bg-cyan-500/5 shadow-sm">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Biometric Scans</span>
            <Fingerprint size={14} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-cyan-400">
            {stats.biometricCount}
          </p>
          <span className="text-[10px] text-cyan-500/80 font-medium">Auto-synced</span>
        </div>
      </div>

      {/* ──────────────── NAVIGATION TABS ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("biometric")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "biometric"
                ? "bg-[var(--db-accent)] text-black shadow-md shadow-[var(--db-accent)]/20"
                : "text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)]/50"
            }`}
          >
            <Fingerprint size={16} />
            <span>Virtual Biometric Terminal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab("sheet")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sheet"
                ? "bg-[var(--db-accent)] text-black shadow-md shadow-[var(--db-accent)]/20"
                : "text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)]/50"
            }`}
          >
            <UserCheck size={16} />
            <span>Manual Attendance Sheet</span>
            {unsavedCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-amber-500 text-black">
                {unsavedCount} unsaved
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-[var(--db-accent)] text-black shadow-md shadow-[var(--db-accent)]/20"
                : "text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)]/50"
            }`}
          >
            <Radio size={16} />
            <span>Terminal Logs &amp; Report</span>
          </button>
        </div>

        {/* Global Date & Batch Switcher in Navigation Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Date Shift */}
          <div className="flex items-center bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl p-0.5">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft size={14} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[var(--db-text)] px-1 py-1 focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => handleDateShift(1)}
              className="p-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(formatDateStr())}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === formatDateStr()
                ? "bg-[var(--db-card-border)] text-[var(--db-text)] border border-[var(--db-card-border)]"
                : "text-[var(--db-accent-highlight)] hover:underline"
            }`}
          >
            Today
          </button>

          {/* Batch Selector */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-medium text-[var(--db-text)] focus:outline-none cursor-pointer"
          >
            {BATCH_OPTIONS.map((b) => (
              <option key={b} value={b} className="bg-zinc-900 text-white">
                {b === "All" ? "All Sessions" : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ──────────────── TAB 1: VIRTUAL BIOMETRIC TERMINAL ──────────────── */}
      {activeTab === "biometric" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Biometric Device Simulation Station (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Terminal Main Unit */}
            <div className="relative overflow-hidden rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] p-5 sm:p-6 shadow-xl">
              {/* Terminal Header & Diagnostics */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--db-card-border)] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <div>
                    <h2 className="text-sm font-black text-[var(--db-text)] uppercase tracking-wider flex items-center gap-2">
                      BioSync-X1 Terminal #01
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        ONLINE
                      </span>
                    </h2>
                    <p className="text-[11px] text-[var(--db-text-muted)]">
                      Turnstile Gate • Main Fitness Arena • Firmware v3.4.12
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Punch Mode Selection */}
                  <div className="flex items-center p-1 bg-[var(--db-input-bg)] rounded-xl border border-[var(--db-card-border)] text-[11px] font-bold">
                    <button
                      onClick={() => setPunchMode("auto")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        punchMode === "auto"
                          ? "bg-[var(--db-accent)] text-black"
                          : "text-[var(--db-text-muted)]"
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => setPunchMode("check_in")}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        punchMode === "check_in"
                          ? "bg-emerald-500 text-black"
                          : "text-[var(--db-text-muted)]"
                      }`}
                    >
                      Check-In
                    </button>
                    <button
                      onClick={() => setPunchMode("check_out")}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        punchMode === "check_out"
                          ? "bg-cyan-500 text-black"
                          : "text-[var(--db-text-muted)]"
                      }`}
                    >
                      Check-Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Big Interactive Fingerprint Scanner Sensor */}
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 relative">
                {/* Ambient Glow Radar Ring */}
                <div
                  className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center transition-all duration-500 ${
                    scannerActive
                      ? "shadow-[0_0_60px_rgba(204,241,65,0.45)] border-2 border-[var(--db-accent-highlight)]"
                      : "border border-white/10 hover:border-[var(--db-accent-highlight)]/40 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(204,241,65,0.06) 0%, rgba(0,0,0,0.8) 75%)",
                  }}
                >
                  {/* Outer Concentric Animated Ring */}
                  <div
                    className={`absolute inset-2 rounded-full border border-dashed border-[var(--db-accent-highlight)]/20 ${
                      scannerActive ? "animate-spin" : ""
                    }`}
                  />

                  {/* Laser Scan Beam */}
                  {scannerActive && (
                    <motion.div
                      initial={{ top: "10%" }}
                      animate={{ top: "85%" }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.65,
                        ease: "easeInOut",
                      }}
                      className="absolute left-6 right-6 h-1 bg-[var(--db-accent-highlight)] shadow-[0_0_12px_#ccf141] z-20 pointer-events-none rounded-full"
                    />
                  )}

                  {/* Fingerprint Touch Target Button */}
                  <button
                    onClick={() => handleSimulateBiometricScan()}
                    disabled={scannerActive}
                    className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-transform transform active:scale-95 cursor-pointer ${
                      scannerActive
                        ? "text-[var(--db-accent-highlight)] scale-105"
                        : "text-zinc-300 hover:text-[var(--db-accent-highlight)] hover:scale-105"
                    }`}
                  >
                    <Fingerprint
                      size={64}
                      className={`transition-all duration-300 ${
                        scannerActive ? "scale-110 drop-shadow-[0_0_15px_#ccf141]" : ""
                      }`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                      {scannerActive ? "Verifying..." : "Touch to Scan"}
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-xs font-semibold text-[var(--db-text-muted)] text-center">
                  Touch the biometric sensor to simulate instant fingerprint verification
                </p>
              </div>

              {/* Quick Select Athlete Bar & Barcode Scanner */}
              <div className="space-y-3 pt-4 border-t border-[var(--db-card-border)]">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Select Registered Athlete */}
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] mb-1 uppercase tracking-wider">
                      Select Athlete to Punch
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedAthleteIdForScan}
                        onChange={(e) => setSelectedAthleteIdForScan(e.target.value)}
                        className="flex-grow px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
                      >
                        {allAthletes.map((a) => (
                          <option key={a._id} value={a._id} className="bg-zinc-900 text-white">
                            {a.memberId} — {a.athleteName} ({a.coach || "No Coach"})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSimulateBiometricScan()}
                        disabled={scannerActive}
                        className="px-3.5 py-2 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[var(--db-accent)]/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Scan size={14} />
                        <span>Scan</span>
                      </button>
                    </div>
                  </div>

                  {/* Member ID / RFID Barcode Wedge Input */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] mb-1 uppercase tracking-wider">
                      Barcode / Member ID Input
                    </label>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (manualBarcodeScanInput.trim()) {
                          handleSimulateBiometricScan(null, manualBarcodeScanInput.trim());
                        }
                      }}
                      className="flex gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder="e.g. BOXCROSS-001"
                        value={manualBarcodeScanInput}
                        onChange={(e) => setManualBarcodeScanInput(e.target.value.toUpperCase())}
                        className="flex-grow px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
                      />
                      <button
                        type="submit"
                        disabled={!manualBarcodeScanInput.trim() || scannerActive}
                        className="px-3 py-2 rounded-xl bg-[var(--db-card-border)] text-[var(--db-text)] font-bold text-xs hover:bg-[var(--db-accent)] hover:text-black transition-all cursor-pointer disabled:opacity-40"
                      >
                        Enter
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Simulation Help Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] text-[var(--db-text-muted)] font-bold uppercase">
                    Quick Actions:
                  </span>
                  {allAthletes.slice(0, 3).map((ath) => (
                    <button
                      key={ath._id}
                      onClick={() => {
                        setSelectedAthleteIdForScan(ath._id);
                        handleSimulateBiometricScan(ath._id);
                      }}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[var(--db-input-bg)] hover:bg-[var(--db-accent)]/15 hover:text-[var(--db-accent-highlight)] border border-[var(--db-card-border)] transition-colors cursor-pointer text-[var(--db-text)]"
                    >
                      Punch {ath.athleteName.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Integration Notice Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/20 flex items-start gap-3">
              <ShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-blue-200">
                  Ready for Physical Biometric Hardware Integration
                </p>
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  This virtual simulator hooks directly into the{" "}
                  <code className="text-blue-200 bg-blue-900/40 px-1 py-0.5 rounded font-mono">
                    POST /api/attendance/biometric-punch
                  </code>{" "}
                  endpoint. Once your physical ZKTeco, eSSL, or RFID scanner machine arrives,
                  point its webhook or serial bridge to this URL for automatic real-time punches.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Punch Readout & Activity Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Scan Result Card */}
            <div className="rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--db-card-border)] mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                  <Activity size={14} className="text-[var(--db-accent-highlight)]" />
                  Terminal Verification Readout
                </span>
                <span className="text-[10px] font-mono text-[var(--db-text-muted)]">
                  {lastScanResult ? lastScanResult.timestamp : "Awaiting scan"}
                </span>
              </div>

              {lastScanResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {lastScanResult.type === "success" ? (
                    <>
                      {/* Action Pill & Verified Score */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-wider flex items-center gap-1.5 ${
                            lastScanResult.action === "CHECK_IN"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          {lastScanResult.actionText}
                        </span>

                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          {lastScanResult.meta?.verifiedScore}% Match
                        </span>
                      </div>

                      {/* Athlete Details Card */}
                      <div className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--db-accent)] to-emerald-400 text-black font-black text-lg flex items-center justify-center shadow-md">
                          {lastScanResult.athlete?.athleteName?.charAt(0) || "A"}
                        </div>
                        <div className="min-w-0 flex-grow">
                          <h3 className="text-sm font-black text-[var(--db-text)] truncate">
                            {lastScanResult.athlete?.athleteName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono font-bold text-[var(--db-accent-highlight)]">
                              {lastScanResult.athlete?.memberId}
                            </span>
                            <span className="text-[10px] text-[var(--db-text-muted)]">
                              Coach: {lastScanResult.athlete?.coach || "Vivek"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Welcome Greeting */}
                      <div className="p-2.5 rounded-lg bg-[var(--db-card-border)]/40 text-xs font-medium text-[var(--db-text)] italic">
                        "{lastScanResult.welcomeText}"
                      </div>

                      {/* Time & Terminal Details */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[var(--db-text-muted)]">
                        <div>
                          Punch Time:{" "}
                          <span className="font-bold text-[var(--db-text)]">
                            {lastScanResult.meta?.timestamp || formatCurrentTime()}
                          </span>
                        </div>
                        <div>
                          Method:{" "}
                          <span className="font-bold text-cyan-400">Fingerprint Sensor</span>
                        </div>
                      </div>

                      {/* Readout Quick Edit & Delete Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--db-card-border)]/60">
                        <button
                          onClick={() => handleOpenEditModal(lastScanResult.record || lastScanResult)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] hover:bg-[var(--db-accent)] hover:text-black text-[11px] font-bold text-[var(--db-text)] border border-[var(--db-card-border)] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit Details</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(lastScanResult.record || lastScanResult)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Undo Punch</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertCircle size={16} />
                        <span>Biometric Recognition Failed</span>
                      </div>
                      <p className="text-xs text-rose-300">{lastScanResult.message}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--db-card-border)]/50 mx-auto flex items-center justify-center text-[var(--db-text-muted)]">
                    <Fingerprint size={24} />
                  </div>
                  <p className="text-xs font-bold text-[var(--db-text-muted)]">
                    Terminal Ready &amp; Listening
                  </p>
                  <p className="text-[11px] text-[var(--db-text-muted)]/70">
                    Punches will display here live with instant biometric score
                  </p>
                </div>
              )}
            </div>

            {/* Live Terminal Stream Feed with Edit/Delete Actions */}
            <div className="rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--db-card-border)]">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--db-text-muted)] flex items-center gap-1.5">
                  <Radio size={14} className="text-emerald-400 animate-pulse" />
                  Today's Live Punch Feed
                </span>
                <span className="text-[10px] font-bold text-[var(--db-accent-highlight)]">
                  {recentTerminalPunches.length} punches
                </span>
              </div>

              {recentTerminalPunches.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {recentTerminalPunches.map((punch, idx) => (
                    <div
                      key={punch._id || idx}
                      className="p-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] flex items-center justify-between text-xs group hover:border-[var(--db-accent-highlight)]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                            punch.checkOutTime
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          <Fingerprint size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--db-text)] truncate text-[11.5px]">
                            {punch.athleteName}
                          </p>
                          <p className="text-[10px] text-[var(--db-text-muted)] font-mono">
                            {punch.memberId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] font-mono font-bold text-emerald-400">
                            {punch.checkInTime || "--"}
                          </div>
                          {punch.checkOutTime && (
                            <div className="text-[9.5px] font-mono text-cyan-400">
                              Out: {punch.checkOutTime}
                            </div>
                          )}
                        </div>

                        {/* Quick Hover Edit / Delete Icons */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(punch)}
                            className="p-1 rounded-md text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)] cursor-pointer"
                            title="Edit punch record"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(punch)}
                            className="p-1 rounded-md text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                            title="Delete punch"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[var(--db-text-muted)]">
                  No biometric punches recorded yet today.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: MANUAL ATTENDANCE SHEET ──────────────── */}
      {activeTab === "sheet" && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Status Filter & Bulk Action Buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)]">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--db-text-muted)]"
              />
              <input
                type="text"
                placeholder="Search athlete by name, Member ID, or coach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] placeholder-[var(--db-text-muted)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {["All", "Present", "Late", "Absent", "Unmarked"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-[var(--db-accent)] text-black"
                      : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] border border-[var(--db-card-border)]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold transition-all cursor-pointer"
                title="Mark all listed athletes as Present"
              >
                Mark All Present
              </button>

              <button
                onClick={handleMarkUnmarkedAbsent}
                className="px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 text-xs font-bold transition-all cursor-pointer"
                title="Mark unmarked athletes as Absent"
              >
                Mark Absent
              </button>

              <button
                onClick={() => setIsResetTodayModalOpen(true)}
                className="px-2.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold transition-all cursor-pointer"
                title="Reset all marked records for this date"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={handleSaveAllChanges}
                disabled={savingBulk}
                className="px-4 py-2 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[var(--db-accent)]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>{savingBulk ? "Saving..." : "Save All"}</span>
                {unsavedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-black text-[#ccf141] text-[9px] flex items-center justify-center font-bold">
                    {unsavedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-sidebar)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)] select-none">
                    <th className="py-3 px-4">Athlete / Member</th>
                    <th className="py-3 px-3">Coach</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Check-In Time</th>
                    <th className="py-3 px-3">Check-Out Time</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Remarks / Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]/50">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[var(--db-text-muted)]">
                        <div className="w-7 h-7 border-2 border-[var(--db-accent-highlight)]/20 border-t-[var(--db-accent-highlight)] rounded-full animate-spin mx-auto mb-2" />
                        <span>Loading attendance records...</span>
                      </td>
                    </tr>
                  ) : filteredSheet.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[var(--db-text-muted)]">
                        No athletes matched the filter criteria for {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    filteredSheet.map((row) => (
                      <tr
                        key={row.athlete}
                        className={`hover:bg-[var(--db-sidebar-link-hover)] transition-colors ${
                          row._hasUnsavedChanges ? "bg-[var(--db-accent)]/5" : ""
                        }`}
                      >
                        {/* Athlete Name & ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] font-black text-xs flex items-center justify-center shrink-0">
                              {row.athleteName?.charAt(0) || "A"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--db-text)] truncate text-[12.5px]">
                                {row.athleteName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[10px] font-bold text-[var(--db-accent-highlight)]">
                                  {row.memberId}
                                </span>
                                {row._hasUnsavedChanges && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Coach */}
                        <td className="py-3 px-3 font-medium text-[var(--db-text-muted)] text-[11.5px]">
                          {row.coach || "Unassigned"}
                        </td>

                        {/* Quick 1-Click Status Segmented Control */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center p-0.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] w-max mx-auto">
                            {/* Present */}
                            <button
                              onClick={() => handleRowStatusChange(row.athlete, "Present")}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                row.status === "Present"
                                  ? "bg-emerald-500 text-black shadow-sm"
                                  : "text-[var(--db-text-muted)] hover:text-emerald-400"
                              }`}
                              title="Mark Present"
                            >
                              P
                            </button>

                            {/* Late */}
                            <button
                              onClick={() => handleRowStatusChange(row.athlete, "Late")}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                row.status === "Late"
                                  ? "bg-amber-500 text-black shadow-sm"
                                  : "text-[var(--db-text-muted)] hover:text-amber-400"
                              }`}
                              title="Mark Late"
                            >
                              L
                            </button>

                            {/* Absent */}
                            <button
                              onClick={() => handleRowStatusChange(row.athlete, "Absent")}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                row.status === "Absent"
                                  ? "bg-rose-500 text-white shadow-sm"
                                  : "text-[var(--db-text-muted)] hover:text-rose-400"
                              }`}
                              title="Mark Absent"
                            >
                              A
                            </button>

                            {/* Excused */}
                            <button
                              onClick={() => handleRowStatusChange(row.athlete, "Excused")}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                row.status === "Excused"
                                  ? "bg-blue-500 text-white shadow-sm"
                                  : "text-[var(--db-text-muted)] hover:text-blue-400"
                              }`}
                              title="Mark Excused / Leave"
                            >
                              E
                            </button>
                          </div>
                        </td>

                        {/* Check-In Time */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="--:-- --"
                              value={row.checkInTime || ""}
                              onChange={(e) =>
                                handleRowFieldChange(row.athlete, "checkInTime", e.target.value)
                              }
                              className="w-24 px-2 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono text-[var(--db-text)] focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                handleRowFieldChange(row.athlete, "checkInTime", formatCurrentTime())
                              }
                              className="px-1.5 py-1 text-[9px] font-bold rounded bg-[var(--db-card-border)] hover:bg-[var(--db-accent)] hover:text-black transition-colors cursor-pointer text-[var(--db-text-muted)]"
                              title="Set current time"
                            >
                              Now
                            </button>
                          </div>
                        </td>

                        {/* Check-Out Time */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="--:-- --"
                              value={row.checkOutTime || ""}
                              onChange={(e) =>
                                handleRowFieldChange(row.athlete, "checkOutTime", e.target.value)
                              }
                              className="w-24 px-2 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono text-[var(--db-text)] focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                handleRowFieldChange(
                                  row.athlete,
                                  "checkOutTime",
                                  formatCurrentTime()
                                )
                              }
                              className="px-1.5 py-1 text-[9px] font-bold rounded bg-[var(--db-card-border)] hover:bg-[var(--db-accent)] hover:text-black transition-colors cursor-pointer text-[var(--db-text-muted)]"
                              title="Set current time"
                            >
                              Now
                            </button>
                          </div>
                        </td>

                        {/* Method */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              row.method === "Biometric" || row.method === "RFID"
                                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {row.method === "Biometric" ? (
                              <Fingerprint size={11} />
                            ) : (
                              <UserCheck size={11} />
                            )}
                            {row.method || "Manual"}
                          </span>
                        </td>

                        {/* Notes */}
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="Add remark..."
                            value={row.notes || ""}
                            onChange={(e) =>
                              handleRowFieldChange(row.athlete, "notes", e.target.value)
                            }
                            className="w-full px-2 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[11px] text-[var(--db-text)] focus:outline-none"
                          />
                        </td>

                        {/* Actions: Save, Edit Modal & Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Save Row button */}
                            {row._hasUnsavedChanges && (
                              <button
                                onClick={() => handleSaveSingleRow(row)}
                                className="p-1.5 rounded-lg bg-[var(--db-accent)] text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                                title="Save this row"
                              >
                                <Save size={13} />
                              </button>
                            )}

                            {/* Full Edit Modal button */}
                            <button
                              onClick={() => handleOpenEditModal(row)}
                              className="p-1.5 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-text)] hover:bg-[var(--db-accent)] hover:text-black border border-[var(--db-card-border)] transition-colors cursor-pointer"
                              title="Edit all attendance fields"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Delete / Reset button */}
                            {(row._id || row.isMarked || row.status !== "Unmarked") && (
                              <button
                                onClick={() => handleOpenDeleteModal(row)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                                title="Delete / Reset this attendance record"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-3 border-t border-[var(--db-card-border)] bg-[var(--db-sidebar)]/30 flex items-center justify-between text-xs text-[var(--db-text-muted)]">
              <span>
                Showing {filteredSheet.length} of {attendanceSheet.length} athletes
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {stats.presentCount} Present
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  {stats.absentCount} Absent
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {stats.unmarkedCount} Unmarked
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: LOGS & REPORTS ──────────────── */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[var(--db-text)] flex items-center gap-2">
                <span>Attendance Audit Trail &amp; Reports</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)] font-bold">
                  {attendanceSheet.filter((r) => r.isMarked).length} Marked Records
                </span>
              </h3>
              <p className="text-xs text-[var(--db-text-muted)]">
                Complete log of check-ins with individual Update &amp; Delete controls
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setCreatingRecord({
                    athleteId: allAthletes[0]?._id || "",
                    date: selectedDate,
                    status: "Present",
                    checkInTime: formatCurrentTime(),
                    checkOutTime: "",
                    method: "Manual",
                    batch: selectedBatch === "All" ? "General" : selectedBatch,
                    notes: "",
                  });
                  setIsCreateModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>New Punch</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] hover:border-[var(--db-accent-highlight)] font-black text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text)] font-bold text-xs hover:bg-[var(--db-card-border)] transition-colors cursor-pointer"
              >
                Print Sheet
              </button>
            </div>
          </div>

          {/* Audit Logs Table with Edit and Delete Columns */}
          <div className="rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--db-card-border)] bg-[var(--db-sidebar)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--db-text-muted)]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Athlete</th>
                    <th className="py-3 px-3">Member ID</th>
                    <th className="py-3 px-3">Check-In</th>
                    <th className="py-3 px-3">Check-Out</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Method / Terminal</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--db-card-border)]/50">
                  {attendanceSheet.filter((r) => r.isMarked).length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[var(--db-text-muted)]">
                        No attendance punch logs recorded for {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    attendanceSheet
                      .filter((r) => r.isMarked)
                      .map((log) => (
                        <tr
                          key={log._id || log.athlete}
                          className="hover:bg-[var(--db-sidebar-link-hover)] transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-[var(--db-text)] font-bold">
                            {log.date || selectedDate}
                          </td>
                          <td className="py-3 px-4 font-bold text-[var(--db-text)]">
                            {log.athleteName}
                          </td>
                          <td className="py-3 px-3 font-mono text-[var(--db-accent-highlight)] font-bold">
                            {log.memberId}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                            {log.checkInTime || "--"}
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-400">
                            {log.checkOutTime || "--"}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                log.status === "Present"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : log.status === "Late"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] text-[var(--db-text-muted)] flex items-center gap-1.5">
                              {log.method === "Biometric" ? (
                                <Fingerprint size={12} className="text-cyan-400" />
                              ) : (
                                <UserCheck size={12} className="text-zinc-400" />
                              )}
                              <span>
                                {log.method === "Biometric"
                                  ? "BioSync-X1"
                                  : log.method || "Manual"}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[var(--db-text-muted)] text-[11px] max-w-[150px] truncate">
                            {log.notes || "--"}
                          </td>
                          {/* Actions: Edit & Delete */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(log)}
                                className="p-1.5 rounded-lg bg-[var(--db-input-bg)] text-[var(--db-text)] hover:bg-[var(--db-accent)] hover:text-black border border-[var(--db-card-border)] transition-colors cursor-pointer"
                                title="Edit this attendance log"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleOpenDeleteModal(log)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                                title="Delete this attendance log"
                              >
                                <Trash2 size={13} />
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
        </div>
      )}

      {/* ──────────────── MODAL 1: EDIT ATTENDANCE MODAL ──────────────── */}
      <AnimatePresence>
        {isEditModalOpen && editingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl overflow-hidden text-[var(--db-text)]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between bg-[var(--db-sidebar)]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)] flex items-center justify-center border border-[var(--db-accent-highlight)]/30 font-black text-sm">
                    {editingRecord.athleteName?.charAt(0) || "A"}
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                      <span>Edit Attendance</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)]">
                        {editingRecord.memberId}
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--db-text-muted)] font-medium">
                      {editingRecord.athleteName} • Coach: {editingRecord.coach || "Assigned"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveEditModal} className="p-4 sm:p-6 space-y-4">
                {/* Date & Batch */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Attendance Date
                    </label>
                    <input
                      type="date"
                      value={editingRecord.date || selectedDate}
                      onChange={(e) =>
                        setEditingRecord({ ...editingRecord, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Session / Batch
                    </label>
                    <select
                      value={editingRecord.batch || "General"}
                      onChange={(e) =>
                        setEditingRecord({ ...editingRecord, batch: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] cursor-pointer"
                    >
                      {BATCH_OPTIONS.filter((b) => b !== "All").map((b) => (
                        <option key={b} value={b} className="bg-zinc-900 text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1.5">
                    Attendance Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "Present", color: "bg-emerald-500", border: "border-emerald-500/40" },
                      { id: "Late", color: "bg-amber-500", border: "border-amber-500/40" },
                      { id: "Absent", color: "bg-rose-500", border: "border-rose-500/40" },
                      { id: "Excused", color: "bg-blue-500", border: "border-blue-500/40" },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() =>
                          setEditingRecord({
                            ...editingRecord,
                            status: s.id,
                            checkInTime:
                              (s.id === "Present" || s.id === "Late") && !editingRecord.checkInTime
                                ? formatCurrentTime()
                                : editingRecord.checkInTime,
                          })
                        }
                        className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border ${
                          editingRecord.status === s.id
                            ? `${s.color} text-black font-black shadow-md ${s.border}`
                            : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] border-[var(--db-card-border)]"
                        }`}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check-In and Check-Out Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
                        Check-In Time
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecord({ ...editingRecord, checkInTime: formatCurrentTime() })
                        }
                        className="text-[10px] text-[var(--db-accent-highlight)] hover:underline font-bold"
                      >
                        Now
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. 07:15 AM"
                        value={editingRecord.checkInTime || ""}
                        onChange={(e) =>
                          setEditingRecord({ ...editingRecord, checkInTime: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
                      />
                      {editingRecord.checkInTime && (
                        <button
                          type="button"
                          onClick={() => setEditingRecord({ ...editingRecord, checkInTime: "" })}
                          className="p-1.5 text-[var(--db-text-muted)] hover:text-rose-400 rounded"
                          title="Clear Check-In"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider">
                        Check-Out Time
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecord({ ...editingRecord, checkOutTime: formatCurrentTime() })
                        }
                        className="text-[10px] text-[var(--db-accent-highlight)] hover:underline font-bold"
                      >
                        Now
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. 08:45 AM"
                        value={editingRecord.checkOutTime || ""}
                        onChange={(e) =>
                          setEditingRecord({ ...editingRecord, checkOutTime: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)]"
                      />
                      {editingRecord.checkOutTime && (
                        <button
                          type="button"
                          onClick={() => setEditingRecord({ ...editingRecord, checkOutTime: "" })}
                          className="p-1.5 text-[var(--db-text-muted)] hover:text-rose-400 rounded"
                          title="Clear Check-Out"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Method Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                    Punch Method / Source
                  </label>
                  <select
                    value={editingRecord.method || "Manual"}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, method: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] cursor-pointer"
                  >
                    {METHOD_OPTIONS.map((m) => (
                      <option key={m} value={m} className="bg-zinc-900 text-white">
                        {m} Entry
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remarks / Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                    Remarks / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Left early for meeting, completed full Hyrox circuit..."
                    value={editingRecord.notes || ""}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] custom-scrollbar"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--db-card-border)]">
                  {/* Delete button inside edit modal */}
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenDeleteModal(editingRecord);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Record</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-5 py-2 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[var(--db-accent)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MODAL 2: DELETE CONFIRMATION MODAL ──────────────── */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--db-card)] border border-rose-500/30 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 text-[var(--db-text)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
                <AlertTriangle size={24} />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-base font-black uppercase tracking-wide">
                  Delete Attendance Record?
                </h3>
                <p className="text-xs text-[var(--db-text-muted)]">
                  Are you sure you want to remove the attendance punch for:
                </p>
                <div className="p-3 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-medium space-y-0.5 mt-2">
                  <p className="font-black text-sm text-[var(--db-text)]">
                    {deletingRecord.athleteName} ({deletingRecord.memberId})
                  </p>
                  <p className="text-[11px] text-[var(--db-text-muted)] font-mono">
                    Date: {deletingRecord.date} • In: {deletingRecord.checkInTime || "--"} • Out:{" "}
                    {deletingRecord.checkOutTime || "--"}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                    Status: {deletingRecord.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 pt-1">
                  This will revert the athlete's status to <strong>Unmarked</strong> and update today's turnout rate.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deletingLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] hover:bg-[var(--db-card-border)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deletingLoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
                >
                  {deletingLoading ? "Deleting..." : "Yes, Delete Record"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MODAL 3: RESET TODAY'S ATTENDANCE MODAL ──────────────── */}
      <AnimatePresence>
        {isResetTodayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--db-card)] border border-amber-500/30 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 text-[var(--db-text)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
                <RotateCcw size={24} />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-base font-black uppercase tracking-wide">
                  Reset Attendance for {selectedDate}?
                </h3>
                <p className="text-xs text-[var(--db-text-muted)]">
                  This will clear all marked check-ins and punches for <strong>{selectedDate}</strong> and reset everyone to <strong>Unmarked</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetTodayModalOpen(false)}
                  disabled={resettingTodayLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] hover:bg-[var(--db-card-border)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetToday}
                  disabled={resettingTodayLoading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {resettingTodayLoading ? "Resetting..." : "Yes, Reset All"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────── MODAL 4: CREATE MANUAL ATTENDANCE PUNCH ──────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl overflow-hidden text-[var(--db-text)]"
            >
              <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between bg-[var(--db-sidebar)]/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--db-accent)]/15 text-[var(--db-accent-highlight)] flex items-center justify-center border border-[var(--db-accent-highlight)]/30">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight">Record Attendance Punch</h3>
                    <p className="text-xs text-[var(--db-text-muted)] font-medium">
                      Manually add or backfill an athlete's gym attendance
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-card-border)] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateNewRecord} className="p-4 sm:p-6 space-y-4">
                {/* Choose Athlete */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                    Select Athlete *
                  </label>
                  <select
                    value={creatingRecord.athleteId}
                    onChange={(e) =>
                      setCreatingRecord({ ...creatingRecord, athleteId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none focus:border-[var(--db-accent-highlight)] cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Athlete --</option>
                    {allAthletes.map((a) => (
                      <option key={a._id} value={a._id} className="bg-zinc-900 text-white">
                        {a.memberId} — {a.athleteName} ({a.coach || "No Coach"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Batch */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={creatingRecord.date}
                      onChange={(e) =>
                        setCreatingRecord({ ...creatingRecord, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Session / Batch
                    </label>
                    <select
                      value={creatingRecord.batch}
                      onChange={(e) =>
                        setCreatingRecord({ ...creatingRecord, batch: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none cursor-pointer"
                    >
                      {BATCH_OPTIONS.filter((b) => b !== "All").map((b) => (
                        <option key={b} value={b} className="bg-zinc-900 text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Present", "Late", "Absent", "Excused"].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setCreatingRecord({ ...creatingRecord, status: st })}
                        className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border ${
                          creatingRecord.status === st
                            ? "bg-[var(--db-accent)] text-black border-transparent shadow-md"
                            : "bg-[var(--db-input-bg)] text-[var(--db-text-muted)] border-[var(--db-card-border)]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check In & Check Out */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Check-In Time
                    </label>
                    <input
                      type="text"
                      placeholder="07:00 AM"
                      value={creatingRecord.checkInTime}
                      onChange={(e) =>
                        setCreatingRecord({ ...creatingRecord, checkInTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                      Check-Out Time
                    </label>
                    <input
                      type="text"
                      placeholder="08:30 AM"
                      value={creatingRecord.checkOutTime}
                      onChange={(e) =>
                        setCreatingRecord({ ...creatingRecord, checkOutTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[var(--db-text)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Method */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                    Entry Method
                  </label>
                  <select
                    value={creatingRecord.method}
                    onChange={(e) =>
                      setCreatingRecord({ ...creatingRecord, method: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-semibold text-[var(--db-text)] focus:outline-none cursor-pointer"
                  >
                    {METHOD_OPTIONS.map((m) => (
                      <option key={m} value={m} className="bg-zinc-900 text-white">
                        {m} Entry
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--db-text-muted)] uppercase tracking-wider mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Remarks or reason for manual entry..."
                    value={creatingRecord.notes}
                    onChange={(e) =>
                      setCreatingRecord({ ...creatingRecord, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--db-card-border)]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text-muted)] hover:text-[var(--db-text)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingLoading}
                    className="px-5 py-2 rounded-xl bg-[var(--db-accent)] text-black font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[var(--db-accent)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>{creatingLoading ? "Saving..." : "Create Record"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardAttendance;
