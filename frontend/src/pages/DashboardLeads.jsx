import React, { useState, useEffect } from "react";
import { getLeadsAdmin } from "../api/api";
import { useRealTime } from "../context/RealTimeContext";
import { Users, Phone, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const DashboardLeads = () => {
  const { subscribe } = useRealTime();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const { data } = await getLeadsAdmin();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      toast.error("Failed to load user information.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(true);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe("leads", () => {
      fetchLeads(false);
    });
    return unsubscribe;
  }, [subscribe]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[var(--db-accent-highlight)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-2">User Information</h1>
          <p className="text-[var(--db-text-muted)] text-sm">View all verified leads captured from the website pop-up.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--db-card-bg)] border border-[var(--db-card-border)] px-4 py-2 rounded-xl">
          <Users size={18} className="text-[var(--db-accent-highlight)]" />
          <span className="text-white font-bold">{leads.length} Users</span>
        </div>
      </div>

      <div className="bg-[var(--db-card-bg)] border border-[var(--db-card-border)] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/40 border-b border-[var(--db-card-border)]">
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">User Details</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">Contact Info</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-black whitespace-nowrap">Captured On</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-[var(--db-text-muted)]">
                    No user information captured yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-[var(--db-card-border)]/50 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--db-accent-highlight)]/10 flex items-center justify-center text-[var(--db-accent-highlight)] font-black uppercase">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-white tracking-wider uppercase">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone size={14} className="text-[var(--db-text-muted)]" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{formatDate(lead.createdAt)}</span>
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
  );
};

export default DashboardLeads;
