import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { markEventAttendance } from "../api/api";
import toast from "react-hot-toast";
import { CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

const EventCheckIn = () => {
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get("event") || "";
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your registered mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await markEventAttendance({ phone, eventName });
      if (response.data?.success) {
        setSuccessData(response.data.data); // The booking data
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--db-card)] border border-[var(--db-card-border)] p-8 rounded-2xl max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-black uppercase text-white mb-2">Good morning Guys</h1>
          <h2 className="text-xl font-bold text-[#ccf141] mb-6">Attendance present</h2>
          
          <div className="bg-[var(--db-input-bg)] rounded-xl p-4 text-left border border-[var(--db-card-border)] mb-6">
            <p className="text-sm text-gray-400 mb-1">Participant</p>
            <p className="text-lg text-white font-bold mb-3">{successData.name}</p>
            
            <p className="text-sm text-gray-400 mb-1">Event</p>
            <p className="text-md text-[#ccf141] font-bold">{successData.event?.title || eventName}</p>
          </div>
          
          <button 
            onClick={() => { setPhone(""); setSuccessData(null); }}
            className="w-full py-3 bg-[var(--db-input-bg)] text-white rounded-xl font-bold border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] transition-colors"
          >
            Check in another participant
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--db-card)] border border-[var(--db-card-border)] p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase text-white mb-2">Event Check-In</h1>
          {eventName && (
            <p className="text-sm text-[#ccf141] font-bold px-4 py-1.5 bg-[#ccf141]/10 rounded-full inline-block">
              {eventName}
            </p>
          )}
          {!eventName && (
            <p className="text-sm text-gray-400">Please scan the correct QR code for your event.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">
              Registered Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccf141] transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !eventName}
            className={`w-full py-3.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              loading || !eventName
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#ccf141] text-black hover:bg-[#b5d635] shadow-[0_0_20px_rgba(204,241,65,0.2)]"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Mark Attendance"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EventCheckIn;
