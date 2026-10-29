import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Edit,
  CheckCircle,
  Save,
  X,
  Plus,
  Trash,
  HelpCircle,
  RefreshCw,
  Check,
  Tag,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";
import {
  getMembershipPlans,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "../api/api";
import { toast } from "react-hot-toast";

const DashboardMemberships = () => {
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
    setTogglingId(plan._id);

    // Optimistic UI update
    setPlans((prev) =>
      prev.map((p) => (p._id === plan._id ? { ...p, isComingSoon: newStatus } : p))
    );

    try {
      const { data } = await updateMembershipPlan(plan._id, {
        isComingSoon: newStatus,
      });
      if (data.success) {
        toast.success(
          `${plan.title} is now ${newStatus ? "marked as COMING SOON" : "ACTIVE"}!`
        );
        notifyPlanUpdate();
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

  const notifyPlanUpdate = () => {
    try {
      localStorage.setItem("boxcross_membership_plans_updated", Date.now().toString());
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("membership_plan_updates");
        channel.postMessage("PLAN_UPDATED");
        setTimeout(() => channel.close(), 500);
      }
    } catch (e) {
      console.error("Broadcast update error:", e);
    }
  };

  const sortPlansOrder = (planList) => {
    if (!Array.isArray(planList)) return [];
    const sortOrder = [
      "core",
      "athlete",
      "arena",
      "duo",
      "duo_core",
      "duo_athlete",
      "duo_arena",
      "family",
      "junior",
    ];
    return [...planList].sort((a, b) => {
      const idxA = sortOrder.indexOf(a.key?.toLowerCase());
      const idxB = sortOrder.indexOf(b.key?.toLowerCase());
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  };

  const fetchPlans = async () => {
    try {
      const { data } = await getMembershipPlans();
      if (data.success) {
        setPlans(sortPlansOrder(data.data));
      }
    } catch (error) {
      console.error("Error fetching membership plans", error);
      toast.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  // Open Full Edit Modal
  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormId(plan._id);
    setFormKey(plan.key);
    setFormTitle(plan.title || "");
    setFormSubtitle(plan.subtitle || "");
    setFormStarterPrice(plan.starterPrice || "");
    setFormDailyRate(plan.dailyRate || "");
    setFormDailyRateLabel(plan.dailyRateLabel || "A DAY ON THE 12-MONTH PLAN");
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
          buttonText: p.buttonText || "CHOOSE PLAN",
          isPopular: !!p.isPopular,
        }))
        : []
    );
    setFormIsComingSoon(!!plan.isComingSoon);
    setIsModalOpen(true);
  };

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
        subtitle: "STANDARD",
        price: "",
        perMonth: "",
        originalPrice: "",
        totalPrice: "",
        highlights: ["Coached sessions", "Gym access"],
        tag: "STANDARD",
        buttonText: "CHOOSE PLAN",
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

  // Save from Modal
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedData = {
      title: formTitle,
      subtitle: formSubtitle,
      isComingSoon: formIsComingSoon,
      starterPrice: formStarterPrice,
      dailyRate: formDailyRate,
      dailyRateLabel: formDailyRateLabel,
      dailyComparison: formDailyComparison,
      sessionInfo: formSessionInfo,
      desc: formSessionInfo,
      features: formFeatures
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      benefits: formBenefits,
      plans: formPlans.map((p) => ({
        ...p,
        price: p.price || p.totalPrice || "",
        totalPrice: p.price || p.totalPrice || "",
      })),
    };

    try {
      const { data } = await updateMembershipPlan(formId, updatedData);
      if (data.success) {
        toast.success("Membership plan updated successfully!");
        setIsModalOpen(false);
        fetchPlans(); // Reload list
        notifyPlanUpdate();
      }
    } catch (error) {
      console.error("Error updating membership plan", error);
      toast.error(
        error.response?.data?.message || "Failed to update membership plan."
      );
    } finally {
      setSaving(false);
    }
  };

  // Inline Row Edit Handlers
  const startInlineEdit = (plan) => {
    setInlineEditId(plan._id);
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
      const updatedData = {
        title: inlineData.title,
        subtitle: inlineData.subtitle,
        starterPrice: inlineData.starterPrice,
        dailyRate: inlineData.dailyRate,
        dailyComparison: inlineData.dailyComparison,
        sessionInfo: inlineData.sessionInfo,
        desc: inlineData.sessionInfo,
      };
      const { data } = await updateMembershipPlan(plan._id, updatedData);
      if (data.success) {
        toast.success(
          `${inlineData.title || plan.title} updated successfully!`
        );
        setInlineEditId(null);
        fetchPlans();
        notifyPlanUpdate();
      }
    } catch (error) {
      console.error("Error inline updating plan", error);
      toast.error("Failed to update plan");
    } finally {
      setInlineSaving(false);
    }
  };

  const handleDeleteClick = async (planId, planTitle) => {
    if (window.confirm(`Are you sure you want to delete ${planTitle}?`)) {
      try {
        const { data } = await deleteMembershipPlan(planId);
        if (data.success) {
          toast.success("Membership plan deleted successfully!");
          fetchPlans();
        }
      } catch (error) {
        console.error("Error deleting membership plan", error);
        toast.error("Failed to delete membership plan");
      }
    }
  };

  return (
    <div className="min-h-screen text-[var(--db-text)] transition-colors">
      <div className="max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className=" p-5 transition-colors"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[var(--db-card-border)]">
            <div className="flex items-center gap-2">
              <CreditCard
                size={18}
                className="text-[var(--db-accent-highlight)]"
              />
              <div>
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--db-accent-highlight)] block">
                  Membership Plans &amp; Pricing Management
                </span>
                <span className="text-[10px] text-[var(--db-text-muted)] font-medium">
                  Directly edit starter prices, durations, daily rates, and features
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  fetchPlans();
                  toast.success("Plans refreshed from server!");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] hover:border-[var(--db-accent-highlight)] font-bold transition-all cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Sync / Refresh</span>
              </button>
              <span className="text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text-muted)] px-2.5 py-1 rounded-full font-bold">
                {plans.length} Categories
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[var(--db-text-muted)] text-xs gap-2">
              <svg
                className="animate-spin h-6 w-6 text-[var(--db-accent-highlight)]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Loading membership details...</span>
            </div>
          ) : plans.length > 0 ? (
            <>
              {/* Mobile Card View (< md) */}
              <div className="block md:hidden space-y-3.5">
                {plans.map((plan) => {
                  const isInline = inlineEditId === plan._id;
                  return (
                    <div
                      key={plan._id}
                      className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]/40 hover:bg-[var(--db-table-hover)] transition-all space-y-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--db-accent-highlight)] bg-[var(--db-accent-highlight)]/10 rounded-md border border-[var(--db-accent-highlight)]/25">
                              {plan.key}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={plan.isComingSoon}
                                disabled={togglingId === plan._id}
                                onClick={() => handleToggleComingSoon(plan)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                  plan.isComingSoon ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-zinc-700"
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
                                onChange={(e) =>
                                  handleInlineChange("title", e.target.value)
                                }
                                placeholder="Program Title"
                                className="w-full h-8 px-2.5 bg-[var(--db-card)] border border-[var(--db-accent-highlight)] text-xs font-bold text-[var(--db-text)] rounded-lg outline-none"
                              />
                              <input
                                type="text"
                                value={inlineData.subtitle}
                                onChange={(e) =>
                                  handleInlineChange("subtitle", e.target.value)
                                }
                                placeholder="Subtitle (e.g. ONE PATHWAY)"
                                className="w-full h-7 px-2.5 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[10px] text-[var(--db-text-muted)] rounded-lg outline-none"
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
                            Starter Price
                          </span>
                          {isInline ? (
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <span className="text-xs text-[var(--db-accent-highlight)] font-mono">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={inlineData.starterPrice}
                                onChange={(e) =>
                                  handleInlineChange(
                                    "starterPrice",
                                    e.target.value
                                  )
                                }
                                placeholder="Price"
                                className="w-20 h-8 px-2 bg-[var(--db-card)] border border-[var(--db-accent-highlight)] text-xs font-mono font-bold text-[var(--db-accent-highlight)] rounded-lg text-right outline-none"
                              />
                            </div>
                          ) : (
                            <span className="text-base font-black text-[var(--db-accent-highlight)] font-mono">
                              ₹{plan.starterPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Daily Rate & Comparison */}
                      {isInline ? (
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--db-card-border)]/50">
                          <div>
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold block">
                              Daily Rate (₹)
                            </span>
                            <input
                              type="text"
                              value={inlineData.dailyRate}
                              onChange={(e) =>
                                handleInlineChange("dailyRate", e.target.value)
                              }
                              placeholder="e.g. ₹92"
                              className="w-full h-7 px-2 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[10px] text-[var(--db-text)] rounded-lg outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold block">
                              Comparison
                            </span>
                            <input
                              type="text"
                              value={inlineData.dailyComparison}
                              onChange={(e) =>
                                handleInlineChange(
                                  "dailyComparison",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Two coffees"
                              className="w-full h-7 px-2 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[10px] text-[var(--db-text)] rounded-lg outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        (plan.dailyRate || plan.dailyComparison) && (
                          <div className="text-[11px] flex items-center justify-between pt-1 border-t border-[var(--db-card-border)]/50">
                            <span className="text-[var(--db-text-muted)] font-medium">
                              Daily Rate:
                            </span>
                            <span className="font-semibold text-[var(--db-text)]">
                              {plan.dailyRate}{" "}
                              {plan.dailyComparison && (
                                <span className="text-[10px] text-[var(--db-text-muted)]">
                                  ({plan.dailyComparison})
                                </span>
                              )}
                            </span>
                          </div>
                        )
                      )}

                      {/* Durations */}
                      <div className="text-xs space-y-1.5 pt-1 border-t border-[var(--db-card-border)]/50">
                        <div className="text-[11px]">
                          <span className="text-[var(--db-text-muted)] font-medium block mb-1">
                            Durations &amp; Pricing:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {plan.plans?.map((p, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] bg-[var(--db-card)] border border-[var(--db-card-border)] px-2 py-0.5 rounded font-mono"
                              >
                                <span className="text-[var(--db-text-muted)]">
                                  {p.months}:
                                </span>
                                <span className="text-[var(--db-accent-highlight)] font-bold">
                                  ₹{p.price}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[var(--db-text-muted)] font-medium">
                            Features:
                          </span>
                          <span className="text-[var(--db-text-muted)] font-semibold">
                            {plan.features?.length || 0} listed features
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[var(--db-card-border)]/50">
                        {isInline ? (
                          <>
                            <button
                              disabled={inlineSaving}
                              onClick={() => saveInlineEdit(plan)}
                              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Check size={14} />
                              <span>{inlineSaving ? "Saving..." : "Save"}</span>
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="py-2 px-3 bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-xl font-bold text-xs uppercase transition-all cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startInlineEdit(plan)}
                              className="py-2 px-3 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] hover:border-[var(--db-accent-highlight)] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                              title="Quick Edit Row"
                            >
                              <Edit size={12} />
                              <span>Quick</span>
                            </button>
                            <button
                              onClick={() => handleEditClick(plan)}
                              className="flex-1 py-2 px-3 bg-[var(--db-accent)] text-[var(--db-accent-text)] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                              style={{
                                fontFamily: '"BrutalTypeBold", sans-serif',
                              }}
                            >
                              <SlidersHorizontal size={13} />
                              <span>Full Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(plan._id, plan.title)
                              }
                              className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Plan"
                            >
                              <Trash size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest">
                      <th className="py-4 px-4 rounded-l-xl">Program</th>
                      <th className="py-4 px-4">Status / Coming Soon</th>
                      <th className="py-4 px-4">Starter Price</th>
                      <th className="py-4 px-4">Daily Rate &amp; Comparison</th>
                      <th className="py-4 px-4">Session Info</th>
                      <th className="py-4 px-4">Durations &amp; Rates</th>
                      <th className="py-4 px-4">Features</th>
                      <th className="py-4 px-4 text-right rounded-r-xl">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--db-card-border)]">
                    {plans.map((plan) => {
                      const isInline = inlineEditId === plan._id;
                      return (
                        <tr
                          key={plan._id}
                          className="hover:bg-[var(--db-table-hover)] transition-colors align-middle"
                        >
                          {/* Program Key & Title */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2 py-0.5 mb-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--db-accent-highlight)] bg-[var(--db-accent-highlight)]/10 rounded-md border border-[var(--db-accent-highlight)]/25">
                              {plan.key}
                            </span>
                            {isInline ? (
                              <div className="space-y-1 mt-1">
                                <input
                                  type="text"
                                  value={inlineData.title}
                                  onChange={(e) =>
                                    handleInlineChange("title", e.target.value)
                                  }
                                  placeholder="Title"
                                  className="w-full h-8 px-2.5 bg-[var(--db-card)] border border-[var(--db-accent-highlight)] text-xs font-bold text-[var(--db-text)] rounded-lg outline-none"
                                />
                                <input
                                  type="text"
                                  value={inlineData.subtitle}
                                  onChange={(e) =>
                                    handleInlineChange(
                                      "subtitle",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Subtitle"
                                  className="w-full h-7 px-2.5 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[10px] text-[var(--db-text-muted)] rounded-lg outline-none"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm font-bold text-[var(--db-text)]">
                                  {plan.title}
                                </div>
                                {plan.subtitle && (
                                  <div className="text-[10px] text-[var(--db-text-muted)] font-semibold uppercase tracking-wider">
                                    {plan.subtitle}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Status / Coming Soon Toggle */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={plan.isComingSoon}
                                disabled={togglingId === plan._id}
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

                          {/* Starter Price */}
                          <td className="py-4 px-4">
                            {isInline ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-[var(--db-accent-highlight)] font-mono font-bold">
                                  ₹
                                </span>
                                <input
                                  type="text"
                                  value={inlineData.starterPrice}
                                  onChange={(e) =>
                                    handleInlineChange(
                                      "starterPrice",
                                      e.target.value
                                    )
                                  }
                                  className="w-24 h-8 px-2 bg-[var(--db-card)] border border-[var(--db-accent-highlight)] text-xs font-mono font-bold text-[var(--db-accent-highlight)] rounded-lg outline-none"
                                  placeholder="e.g. 2,800"
                                />
                              </div>
                            ) : (
                              <span className="text-sm font-black text-[var(--db-accent-highlight)] font-mono">
                                ₹{plan.starterPrice}
                              </span>
                            )}
                          </td>

                          {/* Daily Rate & Comparison */}
                          <td className="py-4 px-4">
                            {isInline ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={inlineData.dailyRate}
                                  onChange={(e) =>
                                    handleInlineChange(
                                      "dailyRate",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Rate (e.g. ₹92)"
                                  className="w-24 h-7 px-2 bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text)] rounded-lg outline-none"
                                />
                                <input
                                  type="text"
                                  value={inlineData.dailyComparison}
                                  onChange={(e) =>
                                    handleInlineChange(
                                      "dailyComparison",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Comparison (e.g. Two coffees)"
                                  className="w-36 h-7 px-2 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[10px] text-[var(--db-text-muted)] rounded-lg outline-none"
                                />
                              </div>
                            ) : (
                              <div>
                                <span className="text-xs font-bold text-[var(--db-text)] font-mono">
                                  {plan.dailyRate || "—"}
                                </span>
                                {plan.dailyComparison && (
                                  <div className="text-[10px] text-[var(--db-text-muted)] truncate max-w-[140px]">
                                    {plan.dailyComparison}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Session Info */}
                          <td className="py-4 px-4 max-w-[200px]">
                            {isInline ? (
                              <textarea
                                value={inlineData.sessionInfo}
                                onChange={(e) =>
                                  handleInlineChange(
                                    "sessionInfo",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                placeholder="Session info..."
                                className="w-full bg-[var(--db-card)] border border-[var(--db-input-border)] text-[11px] text-[var(--db-text)] rounded-lg p-1.5 outline-none resize-none"
                              />
                            ) : (
                              <div
                                className="text-xs text-[var(--db-text-muted)] line-clamp-2"
                                title={plan.sessionInfo || plan.desc}
                              >
                                {plan.sessionInfo || plan.desc || "—"}
                              </div>
                            )}
                          </td>

                          {/* Durations */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[260px]">
                              {plan.plans?.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-card-border)] px-2 py-0.5 rounded font-mono"
                                  title={`${p.months}: ₹${p.price} (₹${p.perMonth}/mo) ${p.tag ? `[${p.tag}]` : ""}`}
                                >
                                  <span className="text-[var(--db-text-muted)]">
                                    {p.months}:
                                  </span>
                                  <span className="text-[var(--db-accent-highlight)] font-bold">
                                    ₹{p.price}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Features */}
                          <td className="py-4 px-4 text-xs text-[var(--db-text-muted)] whitespace-nowrap">
                            <span className="inline-block px-2 py-1 rounded bg-[var(--db-input-bg)] border border-[var(--db-card-border)] font-semibold text-[11px]">
                              {plan.features?.length || 0} features
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isInline ? (
                                <>
                                  <button
                                    disabled={inlineSaving}
                                    onClick={() => saveInlineEdit(plan)}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                                    title="Save changes"
                                  >
                                    <Check size={14} />
                                    <span>
                                      {inlineSaving ? "Saving" : "Save"}
                                    </span>
                                  </button>
                                  <button
                                    onClick={cancelInlineEdit}
                                    className="p-1.5 hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg transition-colors cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startInlineEdit(plan)}
                                    className="p-2 hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                                    title="Quick inline edit"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleEditClick(plan)}
                                    className="p-2 hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-accent-highlight)] hover:opacity-80 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                                    style={{
                                      fontFamily:
                                        '"BrutalTypeBold", sans-serif',
                                    }}
                                    title="Edit all fields & durations"
                                  >
                                    <SlidersHorizontal size={13} />
                                    <span>Full Edit</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(plan._id, plan.title)
                                    }
                                    className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                                    title="Delete Plan"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[var(--db-text-muted)] text-xs">
              No membership plans seeded in the database. Run `node seeder.js`
              in the backend.
            </div>
          )}
        </motion.div>
      </div>

      {/* Comprehensive Edit Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6 md:p-8 shadow-2xl text-left custom-scrollbar"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--db-card-border)] to-transparent" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--db-card-border)] mb-6">
                <div>
                  <h3 className="text-[var(--db-text)] text-lg font-black uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal
                      size={18}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    Modify Plan Data &amp; Pricing
                  </h3>
                  <p className="text-[var(--db-text-muted)] text-xs mt-0.5">
                    Editing complete configuration for{" "}
                    <span className="font-mono text-[var(--db-accent-highlight)] font-bold uppercase">
                      {formKey}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Basic Plan Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--db-card-border)] pb-1.5">
                    <Sparkles
                      size={14}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--db-text)]">
                      1. General Details &amp; Display Rates
                    </span>
                  </div>

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
                        Turn this ON to mark this program as &quot;Coming Soon&quot; on the website. Users will see a Coming Soon badge and cannot purchase it.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                        Program Title
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors font-semibold"
                        required
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                        Program Subtitle
                      </label>
                      <input
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="e.g. ONE PATHWAY, TWO PATHWAYS"
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors font-semibold"
                      />
                    </div>

                    {/* Starter Price */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-accent-highlight)] font-extrabold uppercase tracking-widest flex items-center justify-between">
                        <span>Starter Price (₹)</span>
                        <span className="text-[9px] text-[var(--db-text-muted)] normal-case">
                          (Shown on cards)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formStarterPrice}
                        onChange={(e) => setFormStarterPrice(e.target.value)}
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-accent-highlight)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors font-mono font-bold"
                        placeholder="e.g. 2,800"
                        required
                      />
                    </div>

                    {/* Daily Rate */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                        Daily Rate
                      </label>
                      <input
                        type="text"
                        value={formDailyRate}
                        onChange={(e) => setFormDailyRate(e.target.value)}
                        placeholder="e.g. ₹92"
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors font-mono"
                      />
                    </div>

                    {/* Daily Rate Label */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                        Daily Rate Label
                      </label>
                      <input
                        type="text"
                        value={formDailyRateLabel}
                        onChange={(e) => setFormDailyRateLabel(e.target.value)}
                        placeholder="A DAY ON THE 12-MONTH PLAN"
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                      />
                    </div>

                    {/* Daily Comparison */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                        Daily Comparison
                      </label>
                      <input
                        type="text"
                        value={formDailyComparison}
                        onChange={(e) => setFormDailyComparison(e.target.value)}
                        placeholder="e.g. Two coffees and a vada."
                        className="w-full h-11 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Session Info / Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest">
                      Session Info / Description
                    </label>
                    <textarea
                      value={formSessionInfo}
                      onChange={(e) => setFormSessionInfo(e.target.value)}
                      rows={2}
                      className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl p-3.5 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors resize-none"
                      placeholder="Five Coached sessions a week — Fight, HYROX or Strength"
                    />
                  </div>
                </div>

                {/* 2. Features list */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-[var(--db-card-border)] pb-1.5">
                    <CheckCircle
                      size={14}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--db-text)]">
                      2. Program Features (comma separated)
                    </span>
                  </div>
                  <textarea
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    rows={2}
                    className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl p-3.5 text-sm outline-none focus:border-[var(--db-accent-highlight)] transition-colors resize-none"
                    placeholder="Five Coached sessions a week, One pathway (Fight, HYROX or Strength), Open gym access, Community Access"
                    required
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formFeatures
                      .split(",")
                      .map((f) => f.trim())
                      .filter(Boolean)
                      .map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[var(--db-text-muted)] px-2 py-0.5 rounded-full"
                        >
                          <Check size={10} className="text-emerald-400" />
                          {feat}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 3. What It Actually Gives You (Benefits displayed on website) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--db-card-border)] pb-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={14}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-[var(--db-text)]">
                        3. What It Actually Gives You (Benefits Shown on Website)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--db-accent-highlight)]/10 border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent-highlight)]/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Benefit</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formBenefits.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl"
                      >
                        <span className="text-[10px] font-mono text-[var(--db-accent-highlight)] font-bold px-1.5 py-0.5 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded">
                          #{bIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={b.boldText}
                          onChange={(e) =>
                            handleBenefitChange(bIdx, "boldText", e.target.value)
                          }
                          placeholder="Bold title (e.g. You can defend yourself.)"
                          className="w-full sm:w-1/3 h-9 px-3 bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs font-bold text-[var(--db-text)] rounded-lg outline-none focus:border-[var(--db-accent-highlight)]"
                        />
                        <input
                          type="text"
                          value={b.normalText}
                          onChange={(e) =>
                            handleBenefitChange(bIdx, "normalText", e.target.value)
                          }
                          placeholder="Description (e.g. Quietly knowing that changes how you walk down a street at night.)"
                          className="w-full sm:flex-1 h-9 px-3 bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs text-[var(--db-text-muted)] rounded-lg outline-none focus:border-[var(--db-accent-highlight)]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(bIdx)}
                          className="p-2 text-[var(--db-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                          title="Remove benefit"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                    {formBenefits.length === 0 && (
                      <p className="text-xs text-[var(--db-text-muted)] italic py-1">
                        No benefits added yet. Click &quot;Add Benefit&quot; above to add bullet points to the &quot;What It Actually Gives You&quot; section on the website.
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Duration Plans & Rates (Full editor) */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[var(--db-card-border)] pb-1.5">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className="text-[var(--db-accent-highlight)]"
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-[var(--db-text)]">
                        4. Membership Duration Rates &amp; Pricing Options
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSubPlan}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--db-accent-highlight)]/10 border border-[var(--db-accent-highlight)]/30 text-[var(--db-accent-highlight)] hover:bg-[var(--db-accent-highlight)]/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Duration Option</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formPlans.map((subPlan, index) => (
                      <div
                        key={index}
                        className="bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-2xl p-4 space-y-3 relative group"
                      >
                        {/* Header of Duration Card */}
                        <div className="flex items-center justify-between gap-2 border-b border-[var(--db-card-border)] pb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[10px] bg-[var(--db-card)] border border-[var(--db-card-border)] text-[var(--db-accent-highlight)] font-mono font-bold px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            <input
                              type="text"
                              value={subPlan.months}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "months",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. 1 MONTH, 3 MONTHS"
                              className="h-8 px-2.5 bg-[var(--db-card)] border border-[var(--db-input-border)] text-xs font-black uppercase text-[var(--db-text)] rounded-lg outline-none focus:border-[var(--db-accent-highlight)] font-mono w-32"
                              required
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[10px] text-[var(--db-text-muted)] cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!subPlan.isPopular}
                                onChange={(e) =>
                                  handleSubPlanChange(
                                    index,
                                    "isPopular",
                                    e.target.checked
                                  )
                                }
                                className="accent-[var(--db-accent-highlight)] cursor-pointer"
                              />
                              <span className="font-bold">Popular</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubPlan(index)}
                              className="p-1 hover:bg-red-500/10 text-[var(--db-text-muted)] hover:text-red-400 rounded transition-colors cursor-pointer"
                              title="Delete this duration"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Pricing Inputs Grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {/* Price */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block">
                              Total Price (₹)
                            </span>
                            <input
                              type="text"
                              value={subPlan.price}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="3,500"
                              className="w-full h-8 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-accent-highlight)] font-mono font-bold rounded-lg px-2.5 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                              required
                            />
                          </div>

                          {/* perMonth Price */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block">
                              Per Month (₹)
                            </span>
                            <input
                              type="text"
                              value={subPlan.perMonth}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "perMonth",
                                  e.target.value
                                )
                              }
                              placeholder="3,500"
                              className="w-full h-8 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] font-mono font-bold rounded-lg px-2.5 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                              required
                            />
                          </div>

                          {/* originalPrice */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block truncate">
                              Original (₹)
                            </span>
                            <input
                              type="text"
                              value={subPlan.originalPrice}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "originalPrice",
                                  e.target.value
                                )
                              }
                              placeholder="Strikethrough"
                              className="w-full h-8 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text-muted)] font-mono rounded-lg px-2.5 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Tag & Subtitle */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block">
                              Badge / Tag
                            </span>
                            <input
                              type="text"
                              value={subPlan.tag}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "tag",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. SAVE ₹500, POPULAR"
                              className="w-full h-8 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-lg px-2.5 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block">
                              Plan Subtitle
                            </span>
                            <input
                              type="text"
                              value={subPlan.subtitle}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  index,
                                  "subtitle",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. STANDARD, SAVE ₹2,100"
                              className="w-full h-8 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-lg px-2.5 text-xs outline-none focus:border-[var(--db-accent-highlight)] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-[var(--db-text-muted)] uppercase font-bold tracking-wider block">
                            Highlights (comma separated)
                          </span>
                          <textarea
                            value={
                              subPlan.highlights
                                ? subPlan.highlights.join(", ")
                                : ""
                            }
                            onChange={(e) =>
                              handleSubPlanHighlightsChange(
                                index,
                                e.target.value
                              )
                            }
                            rows={2}
                            placeholder="3 coached sessions a week, One pathway focus, Arena access"
                            className="w-full bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl p-2.5 text-[11px] outline-none focus:border-[var(--db-accent-highlight)] transition-colors resize-none leading-snug"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit row */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--db-card-border)]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-[var(--db-input-border)] hover:bg-[var(--db-sidebar-link-hover)] text-xs text-[var(--db-text)] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative overflow-hidden px-8 py-2.5 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold uppercase tracking-wider text-xs rounded-full transition-all duration-500 cursor-pointer shadow-lg inline-flex items-center gap-1.5 disabled:opacity-50"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></span>
                    <Save size={14} className="relative z-10" />
                    <span className="relative z-10">
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </span>
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

export default DashboardMemberships;
