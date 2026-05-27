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
          className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl"
        >
          <h3 className="text-lg font-bold uppercase tracking-wider text-[#defb02] mb-6 pb-2 border-b border-white/5">
            Account Settings
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Manage your account options, details update, and credentials security.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                Account Status
              </span>
              <span className="text-sm text-green-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} /> Fully Verified Account
              </span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                Settings Modification
              </span>
              <span className="text-xs text-gray-400">
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
          className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle size={18} className="text-[#defb02]" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                Support & Help
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-200 mb-1">How do I access the gym?</h4>
                <p className="text-gray-500 leading-relaxed">Present your active membership details at the front desk when arriving.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-200 mb-1">Can I freeze my plan?</h4>
                <p className="text-gray-500 leading-relaxed">Yes, contact support to freeze membership for up to 30 days once per plan.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[10px] text-gray-400 leading-relaxed mt-6">
            Need assistance? Email us at <a href="mailto:support@boxandcross.com" className="text-[#defb02] font-semibold hover:underline">support@boxandcross.com</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSettings;
