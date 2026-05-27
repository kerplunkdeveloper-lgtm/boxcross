import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, ShieldCheck, Award, Clock, ArrowRight, Sparkles, Users 
} from "lucide-react";
import { getBookings } from "../api/api";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const { data } = await getBookings();
        if (data.success) {
          setVisitorCount(data.count || data.data.length);
        }
      } catch (error) {
        console.error("Error fetching bookings count", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchVisitorCount();
    }
  }, [user]);

  if (!user) return null;

  // Calculate days remaining for membership
  let daysRemaining = 0;
  let expiryStr = "N/A";
  if (user.membership?.status === "active" && user.membership?.endDate) {
    const expiry = new Date(user.membership.endDate);
    const diffTime = expiry - new Date();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    expiryStr = expiry.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const joinDateStr = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 md:p-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#defb02]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#defb02]/20 to-transparent border border-[#defb02]/50 flex items-center justify-center shadow-lg shadow-[#defb02]/10">
              <User size={30} className="text-[#defb02]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide" style={{ fontFamily: '"Brutal Font", sans-serif' }}>
                  Hi, {user.name}!
                </h1>
                <Sparkles size={16} className="text-[#defb02] animate-pulse" />
              </div>
              <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                Welcome back to your Box & Cross Athlete Portal. Ready to crush it?
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



  {/* VISITOR COUNT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl"
          >
            {/* Background Graphic elements */}
            <div className="absolute top-0 right-0 bg-[#defb02]/5 w-24 h-24 rounded-bl-[100px] pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[18px] font-extrabold uppercase tracking-widest text-[#defb02]">
               No.of.Visitors
                </span>
              </div>

              <div className="py-2">
                {loading ? (
                  <div className="h-12 flex items-center">
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p 
                    className="text-5xl font-black text-[#defb02] tracking-wide" 
                    style={{ fontFamily: '"Brutal Font", sans-serif' }}
                  >
                    {visitorCount}
                  </p>
                )}
               
              </div>
            </div>
          </motion.div>



     <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl"
          >
            {/* Background Graphic elements */}
            <div className="absolute top-0 right-0 bg-[#defb02]/5 w-24 h-24 rounded-bl-[100px] pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[18px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  total payment
                </span>
              </div>

              <div className="py-2">
                {loading ? (
                  <div className="h-12 flex items-center">
                    <span className="text-sm text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <p 
                    className="text-5xl font-black text-[#defb02] tracking-wide" 
                    style={{ fontFamily: '"Brutal Font", sans-serif' }}
                  >
                     -
                  </p>
                )}
               
              </div>
            </div>
          </motion.div>





        
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
