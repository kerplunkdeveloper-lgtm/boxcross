import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Save, Tag, Crown, DollarSign, Clock } from "lucide-react";
import { getFoundingOffer, updateFoundingOffer } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardFoundingOffer = () => {
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    col1_badge: "",
    col1_heading1: "",
    col1_heading2: "",
    col2_price: "",
    col2_duration: "",
    col2_saveAmount: "",
    col3_offerEndDate: "",
  });

  const fetchOffer = async () => {
    try {
      const { data } = await getFoundingOffer();
      setOffer(data);
      setFormData({
        col1_badge: data.col1_badge || "",
        col1_heading1: data.col1_heading1 || "",
        col1_heading2: data.col1_heading2 || "",
        col2_price: data.col2_price || "",
        col2_duration: data.col2_duration || "",
        col2_saveAmount: data.col2_saveAmount || "",
        col3_offerEndDate: data.col3_offerEndDate
          ? new Date(data.col3_offerEndDate).toISOString().slice(0, 16)
          : "",
      });
    } catch (error) {
      console.error("Error fetching offer", error);
      toast.error("Failed to load offer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchOffer();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFoundingOffer(offer._id, formData);
      toast.success("Offer details updated successfully!");
      fetchOffer();
      
      // Notify other tabs to update immediately (e.g. Founding.jsx landing page)
      const channel = new BroadcastChannel('founding_offer_updates');
      channel.postMessage('OFFER_UPDATED');
      channel.close();

    } catch (error) {
      console.error("Error updating offer", error);
      toast.error("Failed to update offer details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 min-h-screen  bg-[var(--db-bg)] text-[var(--db-text)] flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-[var(--db-accent-highlight)] drop-shadow-[0_0_10px_rgba(229,255,0,0.5)]"
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
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
        >
          {/* Subtle Glow Effect in the background */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--db-accent-highlight)]/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-6 border-b border-[var(--db-card-border)]/50 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--db-accent-highlight)]/10 flex items-center justify-center border border-[var(--db-accent-highlight)]/20 shadow-[0_0_15px_rgba(229,255,0,0.1)]">
                <Tag size={20} className="text-[var(--db-accent-highlight)]" />
              </div>
              <div>
                <h1
                  className="text-xl md:text-2xl font-black uppercase tracking-wider text-[var(--db-text)]"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  Dynamic Offer Setup
                </h1>
                <p className="text-[11px] md:text-xs text-[var(--db-text-muted)] mt-1 tracking-wide font-medium">
                  Configure the Founding Members landing page details in
                  real-time.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1 settings */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-[var(--db-input-bg)]/50 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/30 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[var(--db-card-border)]/50">
                  <Crown
                    size={16}
                    className="text-[var(--db-accent-highlight)]"
                  />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text)]">
                    Headings & Badge
                  </h3>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                      Badge Text{" "}
                      <span className="text-[var(--db-accent-highlight)]">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="col1_badge"
                      value={formData.col1_badge}
                      onChange={handleChange}
                      placeholder="e.g. Founding Member Offer"
                      className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                      Main Heading (Line 1){" "}
                      <span className="text-[var(--db-accent-highlight)]">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="col1_heading1"
                      value={formData.col1_heading1}
                      onChange={handleChange}
                      placeholder="e.g. THE FIRST 100."
                      className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                      Sub Heading (Line 2){" "}
                      <span className="text-[var(--db-accent-highlight)]">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="col1_heading2"
                      value={formData.col1_heading2}
                      onChange={handleChange}
                      placeholder="e.g. THE FOUNDERS."
                      className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              <div className="space-y-8">
                {/* Column 2 settings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[var(--db-input-bg)]/50 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/30 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[var(--db-card-border)]/50">
                    <DollarSign
                      size={16}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text)]">
                      Pricing Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                        Price Value{" "}
                        <span className="text-[var(--db-accent-highlight)]">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="col2_price"
                        value={formData.col2_price}
                        onChange={handleChange}
                        placeholder="e.g. 12,000"
                        className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                        Duration{" "}
                        <span className="text-[var(--db-accent-highlight)]">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="col2_duration"
                        value={formData.col2_duration}
                        onChange={handleChange}
                        placeholder="e.g. FOR 1 YEAR"
                        className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                        Save Amount Text{" "}
                        <span className="text-[var(--db-accent-highlight)]">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="col2_saveAmount"
                        value={formData.col2_saveAmount}
                        onChange={handleChange}
                        placeholder="e.g. UP TO ₹6,000"
                        className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all placeholder:text-[var(--db-text-muted)]/50"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Column 3 settings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[var(--db-input-bg)]/50 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/30 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[var(--db-card-border)]/50">
                    <Clock
                      size={16}
                      className="text-[var(--db-accent-highlight)]"
                    />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--db-text)]">
                      Countdown Timer
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-[var(--db-text-muted)] font-extrabold uppercase tracking-widest ml-1">
                      Offer Ends At (Date & Time){" "}
                      <span className="text-[var(--db-accent-highlight)]">
                        *
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      name="col3_offerEndDate"
                      value={formData.col3_offerEndDate}
                      onChange={handleChange}
                      className="w-full h-12 bg-[var(--db-card)] border border-[var(--db-input-border)] text-[var(--db-text)] rounded-xl px-4 text-sm font-medium outline-none focus:border-[var(--db-accent-highlight)] focus:ring-1 focus:ring-[var(--db-accent-highlight)]/50 transition-all custom-datetime"
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end pt-6 border-t border-[var(--db-card-border)]/50 mt-10">
              <button
                type="submit"
                disabled={saving}
                className="group relative overflow-hidden px-10 py-3.5 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold uppercase tracking-widest text-xs rounded-full transition-all duration-500 cursor-pointer shadow-[0_0_20px_rgba(229,255,0,0.2)] hover:shadow-[0_0_30px_rgba(229,255,0,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-3"
              >
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></span>
                <Save
                  size={16}
                  className="relative z-10 group-hover:text-black transition-colors"
                />
                <span className="relative z-10 group-hover:text-black transition-colors">
                  {saving ? "SAVING CHANGES..." : "PUBLISH OFFER DETAILS"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardFoundingOffer;
