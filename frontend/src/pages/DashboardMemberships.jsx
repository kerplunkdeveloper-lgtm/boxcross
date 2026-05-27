import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Edit, CheckCircle, Save, X, Plus, Trash, HelpCircle
} from "lucide-react";
import { getMembershipPlans, updateMembershipPlan } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardMemberships = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for the modal
  const [formId, setFormId] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formStarterPrice, setFormStarterPrice] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formPlans, setFormPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const { data } = await getMembershipPlans();
      if (data.success) {
        setPlans(data.data);
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

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setFormId(plan._id);
    setFormKey(plan.key);
    setFormTitle(plan.title);
    setFormStarterPrice(plan.starterPrice);
    setFormFeatures(plan.features.join(", "));
    setFormPlans(JSON.parse(JSON.stringify(plan.plans))); // Deep copy
    setIsModalOpen(true);
  };

  const handleSubPlanChange = (index, field, value) => {
    const updated = [...formPlans];
    updated[index] = { ...updated[index], [field]: value };
    setFormPlans(updated);
  };

  const handleSubPlanHighlightsChange = (index, value) => {
    const updated = [...formPlans];
    updated[index] = { 
      ...updated[index], 
      highlights: value.split(",").map(item => item.trim()).filter(Boolean)
    };
    setFormPlans(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = {
      title: formTitle,
      starterPrice: formStarterPrice,
      features: formFeatures.split(",").map(item => item.trim()).filter(Boolean),
      plans: formPlans
    };

    try {
      const { data } = await updateMembershipPlan(formId, updatedData);
      if (data.success) {
        toast.success("Membership plan updated successfully!");
        setIsModalOpen(false);
        fetchPlans(); // Reload list
      }
    } catch (error) {
      console.error("Error updating membership plan", error);
      toast.error(error.response?.data?.message || "Failed to update membership plan.");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#defb02]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                Membership Plans & Pricing
              </span>
            </div>
            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-sm font-bold">
              {plans.length} Categories
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500 text-xs gap-2">
              <svg className="animate-spin h-6 w-6 text-[#defb02]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Loading membership details...</span>
            </div>
          ) : plans.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-[#defb02] border-b border-white/10 text-black text-[10px] uppercase font-extrabold tracking-widest">
                    <th className="py-4 px-4 rounded-l-xl">Program Key</th>
                    <th className="py-4 px-4">Program Title</th>
                    <th className="py-4 px-4">Starter Price</th>
                    <th className="py-4 px-4">Available Durations</th>
                    <th className="py-4 px-4">Total Features</th>
                    <th className="py-4 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {plans.map((plan) => (
                    <tr key={plan._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 text-sm font-mono text-[#defb02] font-semibold">
                        {plan.key}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-white">
                        {plan.title}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 font-semibold">
                        ₹{plan.starterPrice}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-400">
                        {plan.plans.map((p) => p.months).join(" / ")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {plan.features.length} features
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleEditClick(plan)}
                          className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                          style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                        >
                          <Edit size={14} className="text-[#defb02]" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              No membership plans seeded in the database. Run `node seeder.js` in the backend.
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#121415] border border-white/10 rounded-[28px] p-6 md:p-8 shadow-2xl text-left"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div>
                  <h3 className="text-white text-lg font-black uppercase tracking-wider">
                    Modify Plan Data
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Editing program configuration for <span className="font-mono text-[#defb02]">{formKey}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                      Program Title
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full h-11 bg-white/[0.05] border border-white/10 text-white rounded-full px-5 text-sm outline-none focus:border-[#defb02] transition-colors"
                      required
                    />
                  </div>

                  {/* Starter Price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                      Starter Access Price (₹)
                    </label>
                    <input
                      type="text"
                      value={formStarterPrice}
                      onChange={(e) => setFormStarterPrice(e.target.value)}
                      className="w-full h-11 bg-white/[0.05] border border-white/10 text-white rounded-full px-5 text-sm outline-none focus:border-[#defb02] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    Program Features (comma separated)
                  </label>
                  <textarea
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.05] border border-white/10 text-white rounded-xl p-4 text-sm outline-none focus:border-[#defb02] transition-colors resize-none"
                    placeholder="Feature 1, Feature 2, Feature 3..."
                    required
                  />
                </div>

                {/* Sub plans pricing cards */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block border-b border-white/5 pb-1">
                    Membership Duration Rates
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formPlans.map((subPlan, index) => (
                      <div key={index} className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#defb02] font-black tracking-wider uppercase font-mono">
                            {subPlan.months}
                          </span>
                          <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-1.5 py-0.5 rounded-sm font-bold">
                            Plan {index + 1}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Plan Total Price (₹)</span>
                          <input
                            type="text"
                            value={subPlan.price}
                            onChange={(e) => handleSubPlanChange(index, "price", e.target.value)}
                            className="w-full h-9 bg-white/[0.03] border border-white/10 text-white rounded-full px-4 text-xs outline-none focus:border-[#defb02] transition-colors"
                            required
                          />
                        </div>

                        {/* perMonth Price */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Per Month Equal (₹)</span>
                          <input
                            type="text"
                            value={subPlan.perMonth}
                            onChange={(e) => handleSubPlanChange(index, "perMonth", e.target.value)}
                            className="w-full h-9 bg-white/[0.03] border border-white/10 text-white rounded-full px-4 text-xs outline-none focus:border-[#defb02] transition-colors"
                            required
                          />
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Plan Label Subtitle</span>
                          <input
                            type="text"
                            value={subPlan.subtitle}
                            onChange={(e) => handleSubPlanChange(index, "subtitle", e.target.value)}
                            className="w-full h-9 bg-white/[0.03] border border-white/10 text-white rounded-full px-4 text-xs outline-none focus:border-[#defb02] transition-colors"
                            required
                          />
                        </div>

                        {/* Highlights */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Plan Highlights (comma separated)</span>
                          <textarea
                            value={subPlan.highlights.join(", ")}
                            onChange={(e) => handleSubPlanHighlightsChange(index, e.target.value)}
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl p-3 text-[11px] outline-none focus:border-[#defb02] transition-colors resize-none leading-snug"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit row */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group relative overflow-hidden px-8 py-2.5 bg-[#defb02] text-black font-extrabold uppercase tracking-wider text-xs rounded-full transition-all duration-500 cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                    style={{ fontFamily: '"Bai Jamjuree", sans-serif' }}
                  >
                    <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></span>
                    <Save size={14} className="relative z-10" />
                    <span className="relative z-10">Save Changes</span>
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
