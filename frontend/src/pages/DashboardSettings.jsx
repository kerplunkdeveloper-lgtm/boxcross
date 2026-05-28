import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, ShieldCheck } from "lucide-react";

const DashboardSettings = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 md:p-8 shadow-2xl transition-colors"
        >
          <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--db-accent-highlight)] mb-6 pb-2 border-b border-[var(--db-card-border)]">
            Account Settings
          </h3>
          <p className="text-sm text-[var(--db-text-muted)] leading-relaxed mb-4">
            Manage your account options, details update, and credentials security.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
              <span className="text-[10px] text-[var(--db-text-muted)] uppercase font-black tracking-widest block mb-1">
                Account Status
              </span>
              <span className="text-sm text-green-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} /> Fully Verified Account
              </span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--db-card-border)] bg-[var(--db-input-bg)]">
              <span className="text-[10px] text-[var(--db-text-muted)] uppercase font-black tracking-widest block mb-1">
                Settings Modification
              </span>
              <span className="text-xs text-[var(--db-text-muted)]">
                Modification of sensitive fields is locked to administrator level. Contact backend developer for manual overrides.
              </span>
            </div>
          </div>
        </motion.div>

        {/* FAQ Support */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-[24px] p-6 md:p-8 shadow-2xl flex flex-col justify-between transition-colors"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle size={18} className="text-[var(--db-accent-highlight)]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[var(--db-accent-highlight)]">
                Support & Help
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[var(--db-text)] mb-1">How do I access the gym?</h4>
                <p className="text-[var(--db-text-muted)] leading-relaxed">Present your active membership details at the front desk when arriving.</p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--db-text)] mb-1">Can I freeze my plan?</h4>
                <p className="text-[var(--db-text-muted)] leading-relaxed">Yes, contact support to freeze membership for up to 30 days once per plan.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--db-card-border)] text-[10px] text-[var(--db-text-muted)] leading-relaxed mt-6">
            Need assistance? Email us at <a href="mailto:support@boxandcross.com" className="text-[var(--db-accent-highlight)] font-semibold hover:underline">support@boxandcross.com</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSettings;
