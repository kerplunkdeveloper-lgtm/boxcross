import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Edit,
  CheckCircle,
  Save,
  X,
  Plus,
  Trash,
  RefreshCw,
  Tag,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  Calendar,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {
  getFounderPlans,
  updateFounderPlan,
  deleteFounderPlan,
  createFounderPlan,
} from "../api/api";
import { toast } from "react-hot-toast";

const DashboardFounderPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for the modal
  const [formId, setFormId] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formStarterPrice, setFormStarterPrice] = useState("");
  const [formDailyRate, setFormDailyRate] = useState("");
  const [formDailyRateLabel, setFormDailyRateLabel] = useState("");
  const [formDailyComparison, setFormDailyComparison] = useState("");
  const [formSessionInfo, setFormSessionInfo] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formBenefits, setFormBenefits] = useState([]);
  const [formPlans, setFormPlans] = useState([]);
  const [formIsComingSoon, setFormIsComingSoon] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Inline table edit states
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineData, setInlineData] = useState({});
  const [inlineSaving, setInlineSaving] = useState(false);

  const handleToggleComingSoon = async (plan) => {
    const newStatus = !plan.isComingSoon;
    const targetId = plan._id || plan.id || plan.key;
    setTogglingId(targetId);

    // Optimistic UI update for instant 0ms response
    const updatedPlans = plans.map((p) =>
      (p._id && p._id === targetId) || (p.key && p.key === targetId)
        ? { ...p, isComingSoon: newStatus }
        : p
    );
    setPlans(updatedPlans);
    broadcastPlansUpdate(updatedPlans);

    try {
      const { data } = await updateFounderPlan(targetId, {
        isComingSoon: newStatus,
      });
      if (data.success) {
        toast.success(
          `${plan.title} is now ${newStatus ? "marked as COMING SOON" : "ACTIVE"}!`
        );
        fetchPlans();
      } else {
        fetchPlans();
      }
    } catch (err) {
      console.error("Error toggling coming soon status:", err);
      toast.error("Failed to update status");
      fetchPlans();
    } finally {
      setTogglingId(null);
    }
  };

  const broadcastPlansUpdate = (updatedPlans) => {
    try {
      if (!Array.isArray(updatedPlans)) return;
      const mapped = {};
      updatedPlans.forEach((p) => {
        if (p.key) mapped[p.key] = p;
      });
      localStorage.setItem("boxcross_founder_plans_cache", JSON.stringify(mapped));
      localStorage.setItem("boxcross_founder_plans_raw", JSON.stringify(updatedPlans));
      localStorage.setItem("boxcross_founder_plans_timestamp", Date.now().toString());

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("boxcross_founder_plans_sync");
        channel.postMessage({
          type: "PLANS_UPDATED",
          plans: updatedPlans,
          timestamp: Date.now(),
        });
        channel.close();
      }
    } catch (e) {
      console.error("Broadcast plans error:", e);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data } = await getFounderPlans();
      if (data.success && Array.isArray(data.data)) {
        setPlans(data.data);
        broadcastPlansUpdate(data.data);
      }
    } catch (error) {
      console.error("Error fetching founder plans", error);
      toast.error("Failed to load founder plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Open Full Edit Modal
  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormId(plan._id || plan.id || plan.key);
    setFormKey(plan.key || "");
    setFormTitle(plan.title || "");
    setFormSubtitle(plan.subtitle || "");
    setFormStarterPrice(plan.starterPrice || "");
    setFormDailyRate(plan.dailyRate || "");
    setFormDailyRateLabel(plan.dailyRateLabel || "A DAY AS A FOUNDING MEMBER");
    setFormDailyComparison(plan.dailyComparison || "");
    setFormSessionInfo(plan.sessionInfo || plan.desc || "");
    setFormFeatures(plan.features ? plan.features.join(", ") : "");
    setFormBenefits(
      plan.benefits && plan.benefits.length > 0
        ? plan.benefits.map((b) => ({
            boldText: b.boldText || "",
            normalText: b.normalText || "",
          }))
        : []
    );
    setFormPlans(
      plan.plans && plan.plans.length > 0
        ? plan.plans.map((p) => ({
            months: p.months || "",
            subtitle: p.subtitle || "",
            price: p.price || p.totalPrice || "",
            perMonth: p.perMonth || "",
            originalPrice: p.originalPrice || "",
            totalPrice: p.totalPrice || p.price || "",
            highlights: p.highlights || [],
            tag: p.tag || "",
            buttonText: p.buttonText || "CLAIM OFFER",
            isPopular: !!p.isPopular,
          }))
        : []
    );
    setFormIsComingSoon(!!plan.isComingSoon);
    setIsModalOpen(true);
  };

  const handleSubPlanChange = (index, field, value) => {
    const updated = [...formPlans];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "price") {
      updated[index].totalPrice = value;
    }
    if (field === "totalPrice" && !updated[index].price) {
      updated[index].price = value;
    }
    setFormPlans(updated);
  };

  const handleSubPlanHighlightsChange = (index, value) => {
    const updated = [...formPlans];
    updated[index] = {
      ...updated[index],
      highlights: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setFormPlans(updated);
  };

  const handleAddSubPlan = () => {
    const count = formPlans.length + 1;
    setFormPlans([
      ...formPlans,
      {
        months: `${count * 3} MONTHS`,
        subtitle: "FOUNDER TIER",
        price: "",
        perMonth: "",
        originalPrice: "",
        totalPrice: "",
        highlights: ["Coached sessions", "Founding rate locked"],
        tag: "FOUNDER TIER",
        buttonText: "CLAIM OFFER",
        isPopular: false,
      },
    ]);
  };

  const handleRemoveSubPlan = (index) => {
    if (formPlans.length <= 1) {
      toast.error("At least one duration option is required");
      return;
    }
    const updated = formPlans.filter((_, i) => i !== index);
    setFormPlans(updated);
  };

  // Benefits handlers
  const handleBenefitChange = (index, field, value) => {
    const updated = [...formBenefits];
    updated[index] = { ...updated[index], [field]: value };
    setFormBenefits(updated);
  };

  const handleAddBenefit = () => {
    setFormBenefits([
      ...formBenefits,
      { boldText: "", normalText: "" },
    ]);
  };

  const handleRemoveBenefit = (index) => {
    const updated = formBenefits.filter((_, i) => i !== index);
    setFormBenefits(updated);
  };

  const handleCreateNewClick = () => {
    setEditingPlan(null);
    setFormId("");
    setFormKey("");
    setFormTitle("");
    setFormSubtitle("");
    setFormStarterPrice("");
    setFormDailyRate("");
    setFormDailyRateLabel("A DAY AS A FOUNDING MEMBER");
    setFormDailyComparison("");
    setFormSessionInfo("");
    setFormFeatures("");
    setFormBenefits([
      { boldText: "", normalText: "" },
      { boldText: "", normalText: "" },
    ]);
    setFormPlans([
      {
        months: "1 MONTH",
        subtitle: "STANDARD",
        price: "",
        perMonth: "",
        originalPrice: "",
        totalPrice: "",
        highlights: ["Coached sessions", "Founding rate locked"],
        tag: "STANDARD",
        buttonText: "STANDARD",
        isPopular: false,
      },
    ]);
    setFormIsComingSoon(false);
    setIsModalOpen(true);
  };

  // Save from Modal
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const targetId = formId || formKey;
    const cleanKey = formKey
      ? formKey.trim().toLowerCase().replace(/\s+/g, "-")
      : `founder-${(formTitle || "tier").trim().toLowerCase().replace(/\s+/g, "-")}`;

    const planPayload = {
      key: cleanKey,
      title: formTitle,
      subtitle: formSubtitle,
      starterPrice: formStarterPrice,
      dailyRate: formDailyRate,
      dailyRateLabel: formDailyRateLabel || "A DAY AS A FOUNDING MEMBER",
      dailyComparison: formDailyComparison,
      sessionInfo: formSessionInfo,
      desc: formSessionInfo,
      isComingSoon: !!formIsComingSoon,
      features: formFeatures
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      benefits: formBenefits.filter(
        (b) => b.boldText?.trim() || b.normalText?.trim()
      ),
      plans: formPlans.map((p) => ({
        ...p,
        price: p.price || p.totalPrice || "",
        totalPrice: p.totalPrice || p.price || "",
      })),
    };

    try {
      if (editingPlan && targetId) {
        // Optimistic instant update in 0ms
        const optimisticList = plans.map((p) =>
          (p._id && p._id === targetId) || (p.key && p.key === targetId)
            ? { ...p, ...planPayload }
            : p
        );
        setPlans(optimisticList);
        broadcastPlansUpdate(optimisticList);
        setIsModalOpen(false);

        const { data } = await updateFounderPlan(targetId, planPayload);
        if (data.success) {
          toast.success(`Plan "${formTitle}" updated successfully!`);
          fetchPlans();
        }
      } else {
        const { data } = await createFounderPlan(planPayload);
        if (data.success) {
          toast.success(`Plan "${formTitle}" created successfully!`);
          setIsModalOpen(false);
          fetchPlans();
        }
      }
    } catch (error) {
      console.error("Error saving founder plan", error);
      toast.error(
        error.response?.data?.message || "Failed to save founder plan."
      );
      fetchPlans(); // Rollback if error
    } finally {
      setSaving(false);
    }
  };

  // Inline Row Edit Handlers
  const startInlineEdit = (plan) => {
    setInlineEditId(plan._id || plan.id || plan.key);
    setInlineData({
      title: plan.title || "",
      subtitle: plan.subtitle || "",
      starterPrice: plan.starterPrice || "",
      dailyRate: plan.dailyRate || "",
      dailyComparison: plan.dailyComparison || "",
      sessionInfo: plan.sessionInfo || plan.desc || "",
    });
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
    setInlineData({});
  };

  const handleInlineChange = (field, value) => {
    setInlineData((prev) => ({ ...prev, [field]: value }));
  };

  const saveInlineEdit = async (plan) => {
    setInlineSaving(true);
    try {
      const targetId = plan._id || plan.id || plan.key;
      const updatedData = {
        title: inlineData.title,
        subtitle: inlineData.subtitle,
        starterPrice: inlineData.starterPrice,
        dailyRate: inlineData.dailyRate,
        dailyComparison: inlineData.dailyComparison,
        sessionInfo: inlineData.sessionInfo,
        desc: inlineData.sessionInfo,
      };

      // Optimistic instant update in 0ms
      const optimisticList = plans.map((p) =>
        (p._id && p._id === targetId) || (p.key && p.key === targetId)
          ? { ...p, ...updatedData }
          : p
      );
      setPlans(optimisticList);
      broadcastPlansUpdate(optimisticList);
      setInlineEditId(null);

      const { data } = await updateFounderPlan(targetId, updatedData);
      if (data.success) {
        toast.success(
          `${inlineData.title || plan.title} updated successfully!`
        );
        fetchPlans();
      }
    } catch (error) {
      console.error("Error inline updating founder plan", error);
      toast.error("Failed to update founder plan");
      fetchPlans(); // Rollback on error
    } finally {
      setInlineSaving(false);
    }
  };

  const handleDeleteClick = async (planId, planTitle) => {
    if (!window.confirm(`Are you sure you want to delete the plan "${planTitle}"?`)) {
      return;
    }

    try {
      const { data } = await deleteFounderPlan(planId);
      if (data.success) {
        toast.success(`Plan "${planTitle}" deleted successfully`);
        fetchPlans();
      }
    } catch (error) {
      console.error("Error deleting plan", error);
      toast.error(error.response?.data?.message || "Failed to delete plan");
    }
  };

  return (
    <div className="p-3.5 sm:p-5 md:p-8 space-y-4 sm:space-y-6 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ccf141]/20 text-[#ccf141] font-mono">
                FOUNDERS CLUB
              </span>
              
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black  tracking-tight text-[var(--db-text)] flex items-center gap-2.5 font-['BrutalTypeBold',sans-serif]">
              <Crown className="text-[#ccf141] shrink-0" size={26} />
              <span>Founder Plans Manage</span>
            </h1>
          
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCreateNewClick()}
              className="px-3.5 py-2 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b8da3a] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} />
              <span>Add Plan</span>
            </button>
            <button
              onClick={() => fetchPlans()}
              className="px-3 py-2 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-card)] hover:bg-[var(--db-input-bg)] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <a
              href="/foundersoffers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl border border-[#ccf141]/40 bg-[#ccf141]/10 text-[#ccf141] hover:bg-[#ccf141] hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>View Live Page</span>
            </a>
          </div>
        </div>

      

        {/* Plans Table Card */}
        <div className="rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--db-card-border)] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--db-text)]">All Founder Plans</h2>
              <p className="text-xs text-[var(--db-text-muted)]">
                Inline editing enabled for instant updates. Toggle Coming Soon status or click edit to modify durations.
              </p>
            </div>
          </div>

          {/* Mobile Card View (< md) */}
          <div className="block md:hidden p-3.5 space-y-3.5">
            {loading ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                Loading founder plans...
              </div>
            ) : plans.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No founder plans found.
              </div>
            ) : (
              plans.map((plan) => {
                const isInline = inlineEditId === plan._id;
                return (
                  <div
                    key={plan._id}
                    className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 hover:bg-[var(--db-table-hover)] transition-all space-y-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#ccf141] bg-[#ccf141]/10 rounded-md border border-[#ccf141]/25">
                            {plan.key}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={plan.isComingSoon}
                              disabled={togglingId === (plan._id || plan.id || plan.key)}
                              onClick={() => handleToggleComingSoon(plan)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                plan.isComingSoon
                                  ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                  : "bg-zinc-700"
                              }`}
                              title={plan.isComingSoon ? "Turn Off Coming Soon" : "Turn On Coming Soon"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  plan.isComingSoon ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                plan.isComingSoon
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                              }`}
                            >
                              {plan.isComingSoon ? "Soon" : "Active"}
                            </span>
                          </div>
                        </div>

                        {isInline ? (
                          <div className="space-y-1.5 mt-1">
                            <input
                              type="text"
                              value={inlineData.title}
                              onChange={(e) => handleInlineChange("title", e.target.value)}
                              placeholder="Title"
                              className="w-full px-2 py-1 bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs font-bold text-[var(--db-text)] rounded-lg outline-none"
                            />
                            <input
                              type="text"
                              value={inlineData.subtitle}
                              onChange={(e) => handleInlineChange("subtitle", e.target.value)}
                              placeholder="Subtitle"
                              className="w-full px-2 py-1 bg-[var(--db-card)] border border-[var(--db-card-border)] text-[10px] text-[var(--db-text-muted)] rounded-lg outline-none"
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-sm font-black text-[var(--db-text)] uppercase tracking-wide">
                              {plan.title}
                            </h3>
                            {plan.subtitle && (
                              <span className="text-[10px] text-[var(--db-text-muted)] font-semibold tracking-wider uppercase block">
                                {plan.subtitle}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold block">
                          Starter Rate
                        </span>
                        {isInline ? (
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <span className="text-xs text-[#ccf141] font-mono">₹</span>
                            <input
                              type="text"
                              value={inlineData.starterPrice}
                              onChange={(e) => handleInlineChange("starterPrice", e.target.value)}
                              className="w-20 px-2 py-0.5 bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs font-mono font-bold text-[#ccf141] rounded-lg text-right outline-none"
                            />
                          </div>
                        ) : (
                          <span className="text-sm font-black font-mono text-[#ccf141]">
                            ₹{plan.starterPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--db-card-border)]/60 text-[11px]">
                      <span className="text-neutral-400">
                        Daily: <strong className="text-neutral-200 font-mono">{plan.dailyRate || "—"}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isInline ? (
                          <>
                            <button
                              onClick={() => saveInlineEdit(plan)}
                              disabled={inlineSaving}
                              className="px-2.5 py-1 rounded bg-emerald-500 text-black font-bold text-xs"
                            >
                              {inlineSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startInlineEdit(plan)}
                              className="p-1.5 rounded-lg border border-[var(--db-card-border)] text-neutral-400 hover:text-white"
                            >
                              <SlidersHorizontal size={13} />
                            </button>
                            <button
                              onClick={() => handleEditClick(plan)}
                              className="px-2.5 py-1 rounded-lg bg-[#ccf141]/10 border border-[#ccf141]/30 text-[#ccf141] text-xs font-bold flex items-center gap-1"
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(plan._id || plan.id || plan.key, plan.title)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400"
                            >
                              <Trash size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--db-input-bg)] text-[var(--db-text-muted)] font-mono uppercase text-[10px] border-b border-[var(--db-card-border)]">
                <tr>
                  <th className="py-3 px-4">Plan Name &amp; Key</th>
                  <th className="py-3 px-4">Subtitle</th>
                  <th className="py-3 px-4">Monthly Rate</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Durations</th>
                  <th className="py-3 px-4">Status / Coming Soon</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--db-card-border)] text-[var(--db-text)]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-400">
                      Loading founder plans...
                    </td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-400">
                      No founder plans found.
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => {
                    const isInline = inlineEditId === plan._id;
                    return (
                      <tr key={plan._id} className="hover:bg-[var(--db-input-bg)]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          {isInline ? (
                            <input
                              type="text"
                              value={inlineData.title}
                              onChange={(e) => handleInlineChange("title", e.target.value)}
                              className="px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] w-full"
                            />
                          ) : (
                            <div>
                              <div className="font-bold text-sm text-[var(--db-text)]">{plan.title}</div>
                              <div className="text-[10px] font-mono text-[var(--db-text-muted)]">{plan.key}</div>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {isInline ? (
                            <input
                              type="text"
                              value={inlineData.subtitle}
                              onChange={(e) => handleInlineChange("subtitle", e.target.value)}
                              className="px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] w-full"
                            />
                          ) : (
                            <span className="text-neutral-400">{plan.subtitle || "—"}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-[#ccf141]">
                          {isInline ? (
                            <input
                              type="text"
                              value={inlineData.starterPrice}
                              onChange={(e) => handleInlineChange("starterPrice", e.target.value)}
                              className="px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[#ccf141] w-24"
                            />
                          ) : (
                            `₹${plan.starterPrice}`
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-300">
                          {isInline ? (
                            <input
                              type="text"
                              value={inlineData.dailyRate}
                              onChange={(e) => handleInlineChange("dailyRate", e.target.value)}
                              className="px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] w-20"
                            />
                          ) : (
                            plan.dailyRate || "—"
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300">
                            {plan.plans?.length || 0} options
                          </span>
                        </td>

                        {/* Status / Coming Soon Toggle */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={plan.isComingSoon}
                              disabled={togglingId === (plan._id || plan.id || plan.key)}
                              onClick={() => handleToggleComingSoon(plan)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                plan.isComingSoon
                                  ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                                  : "bg-zinc-700 hover:bg-zinc-600"
                              }`}
                              title={
                                plan.isComingSoon
                                  ? "Currently Coming Soon (click to activate)"
                                  : "Currently Active (click to set Coming Soon)"
                              }
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  plan.isComingSoon ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <div>
                              {plan.isComingSoon ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-sm whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  Coming Soon
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Active
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isInline ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => saveInlineEdit(plan)}
                                disabled={inlineSaving}
                                className="px-2.5 py-1 rounded bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                              >
                                {inlineSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelInlineEdit}
                                className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startInlineEdit(plan)}
                                title="Quick Edit"
                                className="p-1.5 rounded-lg border border-[var(--db-card-border)] hover:bg-[var(--db-input-bg)] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal size={13} />
                              </button>
                              <button
                                onClick={() => handleEditClick(plan)}
                                title="Full Edit & Plans"
                                className="px-2.5 py-1 rounded-lg bg-[#ccf141]/10 border border-[#ccf141]/30 hover:bg-[#ccf141] hover:text-black text-[#ccf141] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(plan._id || plan.id || plan.key, plan.title)}
                                title="Delete Plan"
                                className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl shadow-2xl z-10 max-h-[90vh] flex flex-col my-8 overflow-hidden text-[var(--db-text)]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[var(--db-card-border)] flex items-center justify-between shrink-0 bg-[var(--db-sidebar)]">
                <div>
                  <h3 className="text-base font-black uppercase text-[var(--db-text)] font-['BrutalTypeBold',sans-serif]">
                    {editingPlan ? `Edit Founder Plan: ${formTitle}` : "Create New Founder Plan"}
                  </h3>
                  <p className="text-xs text-[var(--db-text-muted)] font-mono">
                    {editingPlan ? `Key: ${formKey}` : "New tier will be added to database and live offer page"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* General Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#ccf141] font-bold">
                    1. Main Plan Information
                  </h4>

                  {/* Coming Soon Switch Banner */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[var(--db-text)]">
                          Coming Soon Status:
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            formIsComingSoon
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          {formIsComingSoon ? "Coming Soon (Inactive)" : "Active (Available Live)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--db-text-muted)]">
                        Turn this ON to mark this founder program as &quot;Coming Soon&quot; on the website. Users will see a Coming Soon badge, blur overlay, and cannot purchase it.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formIsComingSoon}
                      onClick={() => setFormIsComingSoon(!formIsComingSoon)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formIsComingSoon
                          ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                          : "bg-zinc-700 hover:bg-zinc-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          formIsComingSoon ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {!editingPlan && (
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Unique Plan Key (e.g. founder-custom) *
                      </label>
                      <input
                        type="text"
                        value={formKey}
                        onChange={(e) => setFormKey(e.target.value)}
                        placeholder="founder-custom"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] font-mono focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Monthly Starter Rate (₹) *
                      </label>
                      <input
                        type="text"
                        value={formStarterPrice}
                        onChange={(e) => setFormStarterPrice(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[#ccf141] font-bold font-mono focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Daily Rate (e.g. ₹82)
                      </label>
                      <input
                        type="text"
                        value={formDailyRate}
                        onChange={(e) => setFormDailyRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Daily Rate Label
                      </label>
                      <input
                        type="text"
                        value={formDailyRateLabel}
                        onChange={(e) => setFormDailyRateLabel(e.target.value)}
                        placeholder="A DAY AS A FOUNDING MEMBER"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Daily Comparison (e.g. A dosa and a filter coffee.)
                      </label>
                      <input
                        type="text"
                        value={formDailyComparison}
                        onChange={(e) => setFormDailyComparison(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Session Info / Description
                      </label>
                      <input
                        type="text"
                        value={formSessionInfo}
                        onChange={(e) => setFormSessionInfo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Features (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-xs text-[var(--db-text)] focus:outline-none focus:border-[#ccf141]"
                    />
                  </div>
                </div>

                {/* Duration Sub-plans */}
                <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#ccf141] font-bold">
                      2. Duration Passes &amp; Pricing Options
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddSubPlan}
                      className="px-2.5 py-1 rounded-lg bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 hover:bg-[#ccf141] hover:text-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Add Duration Option</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formPlans.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono">
                            Option #{idx + 1}: {sub.months || "New Option"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubPlan(idx)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash size={13} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Duration (e.g. 3 MONTHS)
                            </label>
                            <input
                              type="text"
                              value={sub.months}
                              onChange={(e) => handleSubPlanChange(idx, "months", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Per Month (₹)
                            </label>
                            <input
                              type="text"
                              value={sub.perMonth}
                              onChange={(e) => handleSubPlanChange(idx, "perMonth", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[#ccf141] font-bold font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Total Price (₹)
                            </label>
                            <input
                              type="text"
                              value={sub.totalPrice || sub.price}
                              onChange={(e) => {
                                handleSubPlanChange(idx, "totalPrice", e.target.value);
                                handleSubPlanChange(idx, "price", e.target.value);
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-[#ccf141] font-bold font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Original Price (₹)
                            </label>
                            <input
                              type="text"
                              value={sub.originalPrice}
                              onChange={(e) => handleSubPlanChange(idx, "originalPrice", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-neutral-400 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Tag / Badge (e.g. SAVE ₹100)
                            </label>
                            <input
                              type="text"
                              value={sub.tag}
                              onChange={(e) => handleSubPlanChange(idx, "tag", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Button Text (e.g. SAVE ₹100)
                            </label>
                            <input
                              type="text"
                              value={sub.buttonText || ""}
                              onChange={(e) => handleSubPlanChange(idx, "buttonText", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-white"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-4">
                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                              <input
                                type="checkbox"
                                checked={!!sub.isPopular}
                                onChange={(e) => handleSubPlanChange(idx, "isPopular", e.target.checked)}
                                className="w-4 h-4 rounded text-[#ccf141] focus:ring-0 cursor-pointer accent-[#ccf141]"
                              />
                              <span className="font-mono text-[11px]">Most Popular Tier</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                            Highlights (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(sub.highlights || []).join(", ")}
                            onChange={(e) => handleSubPlanHighlightsChange(idx, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: What It Actually Gives You (Benefits) */}
                <div className="space-y-4 pt-4 border-t border-[var(--db-card-border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#ccf141] font-bold">
                        3. What It Actually Gives You (Benefits)
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Shown below the pricing table with green square bullets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-2.5 py-1 rounded-lg bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 hover:bg-[#ccf141] hover:text-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Add Benefit Point</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formBenefits.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3.5 rounded-xl bg-[var(--db-input-bg)] border border-[var(--db-card-border)] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#ccf141]" />
                            Point #{bIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(bIdx)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash size={13} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Bold Headline (e.g. You can defend yourself.)
                            </label>
                            <input
                              type="text"
                              value={b.boldText}
                              onChange={(e) => handleBenefitChange(bIdx, "boldText", e.target.value)}
                              placeholder="Bold key message..."
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                              Description (e.g. Quietly knowing that changes how you walk down a street at night.)
                            </label>
                            <input
                              type="text"
                              value={b.normalText}
                              onChange={(e) => handleBenefitChange(bIdx, "normalText", e.target.value)}
                              placeholder="Supporting explanation..."
                              className="w-full px-2.5 py-1.5 rounded bg-[var(--db-card)] border border-[var(--db-card-border)] text-xs text-neutral-300"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-[var(--db-card-border)] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--db-card-border)] text-xs text-neutral-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b8da3a] transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{saving ? "Saving Changes..." : "Save Plan Changes"}</span>
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

export default DashboardFounderPlans;
