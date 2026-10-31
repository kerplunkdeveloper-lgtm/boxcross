import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { markEventAttendance, createEventWalkIn, getEventsList } from "../api/api";
import toast from "react-hot-toast";
import { CheckCircle, Phone, User, UserPlus, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const EventCheckIn = () => {
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get("event") || "";

  // View mode: 'checkin' (registered) or 'walkin' (new walk-in)
  const [mode, setMode] = useState("checkin");

  // Event details (including image)
  const [eventData, setEventData] = useState(null);

  // Registered Check-in state
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Walk-in state
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInLoading, setWalkInLoading] = useState(false);

  // Success state
  const [successData, setSuccessData] = useState(null);

  // Fetch event details to retrieve event banner/image
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventName) return;
      try {
        const res = await getEventsList();
        if (res.data?.success && Array.isArray(res.data.data)) {
          const clean = eventName.trim().toLowerCase();
          const matched = res.data.data.find(
            (e) => e.title && e.title.trim().toLowerCase() === clean
          );
          if (matched) {
            setEventData(matched);
          }
        }
      } catch (err) {
        console.error("Failed to load event details", err);
      }
    };
    fetchEvent();
  }, [eventName]);

  // Handle Registered Check-in
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your registered mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await markEventAttendance({ phone, eventName });
      if (response.data?.success) {
        setSuccessData({
          ...response.data.data,
          isWalkIn: false,
        });
        toast.success(response.data.message || "Attendance marked successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // Handle New Member Walk-in
  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!walkInPhone.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }
    if (!eventName) {
      toast.error("Event name is missing. Please scan the event QR code again.");
      return;
    }

    setWalkInLoading(true);
    try {
      const response = await createEventWalkIn({
        name: walkInName.trim(),
        phone: walkInPhone.trim(),
        eventName: eventName.trim(),
      });
      if (response.data?.success) {
        setSuccessData({
          name: walkInName.trim(),
          phone: walkInPhone.trim(),
          isWalkIn: true,
          eventName: eventName,
          event: { title: eventName, imageUrl: eventData?.imageUrl },
        });
        toast.success("Walk-in registered and attendance marked successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register walk-in");
    } finally {
      setWalkInLoading(false);
    }
  };

  const handleReset = () => {
    setPhone("");
    setWalkInName("");
    setWalkInPhone("");
    setSuccessData(null);
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Card with animated spinning border */}
        <div className="relative p-[2px] rounded-3xl overflow-hidden max-w-md w-full shadow-2xl z-10">
          <div
            className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_290deg,#ccf141_340deg,#ccf141_360deg)] animate-spin pointer-events-none opacity-90"
            style={{ animationDuration: "3.5s" }}
          />
          <div
            className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_290deg,#ccf141_340deg,#ccf141_360deg)] animate-spin pointer-events-none blur-sm opacity-50"
            style={{ animationDuration: "3.5s" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0e0e0e] border border-[var(--db-card-border)] p-8 rounded-3xl w-full text-center relative z-10"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <CheckCircle size={36} />
            </div>

            <h1 className="text-2xl font-black uppercase text-white mb-1">Good morning Guys</h1>
            <h2 className="text-xl font-bold text-[#ccf141] mb-3">Attendance present</h2>

            {successData.isWalkIn && (
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles size={12} /> Walk-in Registration
              </div>
            )}

            {/* Event Image in Success */}
            {eventData?.imageUrl && (
              <div className="relative mx-auto w-20 h-20 rounded-2xl overflow-hidden border border-[#ccf141]/30 mb-4 shadow-lg">
                <img
                  src={eventData.imageUrl}
                  alt={eventName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-[var(--db-input-bg)] rounded-xl p-4 text-left border border-[var(--db-card-border)] mb-6 space-y-3">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Participant</p>
                <p className="text-lg text-white font-bold">{successData.name}</p>
              </div>

              {successData.phone && (
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Mobile Number</p>
                  <p className="text-sm text-gray-200 font-mono font-medium">{successData.phone}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Event</p>
                <p className="text-sm text-[#ccf141] font-bold">{successData.event?.title || successData.eventName || eventName}</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-[var(--db-input-bg)] text-white rounded-xl font-bold border border-[var(--db-card-border)] hover:bg-[var(--db-sidebar-link-hover)] transition-colors cursor-pointer"
            >
              Check in another participant
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ccf141]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= CARD WRAPPER WITH ANIMATED SPINNING BORDER ================= */}
      <div className="relative p-[2px] rounded-3xl overflow-hidden max-w-md w-full shadow-2xl z-10">
        {/* Continuous rotating conic gradient border beam */}
        <div
          className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_290deg,#ccf141_335deg,#ccf141_360deg)] animate-spin pointer-events-none opacity-90"
          style={{ animationDuration: "3.5s" }}
        />
        {/* Subtle blur glow behind the spinning beam */}
        <div
          className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_290deg,#ccf141_335deg,#ccf141_360deg)] animate-spin pointer-events-none blur-sm opacity-50"
          style={{ animationDuration: "3.5s" }}
        />

        {/* Inner Card container */}
        <div className="relative z-10 bg-[#0e0e0e] border border-[var(--db-card-border)] rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            {mode === "checkin" ? (
              /* ================= REGISTERED CHECK-IN CARD ================= */
              <motion.div
                key="checkin-card"
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -35 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Event Image Display with Spinning Neon Ring */}
                <div className="text-center">
                  {eventData?.imageUrl && (
                    <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-4">
                      {/* Spinning border around image */}
                      <div
                        className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_0deg,#ccf141,transparent_45%,#ccf141_100%)] animate-spin blur-[2px] opacity-80"
                        style={{ animationDuration: "3s" }}
                      />
                      <div
                        className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_0deg,#ccf141,transparent_45%,#ccf141_100%)] animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                      <div className="absolute inset-[2px] bg-[#0e0e0e] rounded-2xl z-10" />
                      <img
                        src={eventData.imageUrl}
                        alt={eventName}
                        className="relative z-20 w-full h-full object-cover rounded-2xl p-[2px] shadow-2xl"
                      />
                    </div>
                  )}

                  <h1 className="text-2xl font-black uppercase text-white mb-2 tracking-wide">
                    Event Check-In
                  </h1>
                  {eventName && (
                    <p className="text-sm text-[#ccf141] font-bold px-4 py-1.5 bg-[#ccf141]/10 border border-[#ccf141]/20 rounded-full inline-block line-clamp-2">
                      {eventName}
                    </p>
                  )}
                  {!eventName && (
                    <p className="text-sm text-gray-400">
                      Please scan the correct QR code for your event.
                    </p>
                  )}
                </div>

                <form onSubmit={handleCheckInSubmit} className="space-y-6">
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
                    className={`w-full py-3.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
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

                {/* Swipe to Walk-in section */}
                <div className="pt-4 border-t border-[var(--db-card-border)]/70 text-center space-y-2">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                    Not registered yet?
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode("walkin")}
                    disabled={!eventName}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer group ${
                      !eventName
                        ? "bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-[var(--db-input-bg)] hover:bg-[#ccf141]/10 text-white hover:text-[#ccf141] border-[var(--db-card-border)] hover:border-[#ccf141]/40"
                    }`}
                  >
                    <UserPlus size={16} className="text-[#ccf141] group-hover:scale-110 transition-transform" />
                    <span>New Member Walk-in</span>
                    <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform ml-auto" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ================= NEW MEMBER WALK-IN CARD ================= */
              <motion.div
                key="walkin-card"
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 35 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="p-6 sm:p-8 space-y-5"
              >
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMode("checkin")}
                    className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/30">
                    Walk-in
                  </span>
                </div>

                {/* Event Image Display with Spinning Ring in Walk-in View */}
                {eventData?.imageUrl && (
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    <div
                      className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_0deg,#ccf141,transparent_45%,#ccf141_100%)] animate-spin blur-[2px] opacity-80"
                      style={{ animationDuration: "3s" }}
                    />
                    <div
                      className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_0deg,#ccf141,transparent_45%,#ccf141_100%)] animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                    <div className="absolute inset-[2px] bg-[#0e0e0e] rounded-2xl z-10" />
                    <img
                      src={eventData.imageUrl}
                      alt={eventName}
                      className="relative z-20 w-full h-full object-cover rounded-2xl p-[2px] shadow-2xl"
                    />
                  </div>
                )}

                {/* Heading & Event name display */}
                <div className="text-center space-y-2">
                  <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
                    New Member Walk-in
                  </h1>
                  {eventName ? (
                    <div className="p-3 bg-[var(--db-input-bg)] border border-[var(--db-card-border)] rounded-xl text-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-0.5">
                        Selected Event
                      </span>
                      <p className="text-xs sm:text-sm text-[#ccf141] font-bold line-clamp-2">
                        {eventName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-red-400 font-semibold">
                      Please scan an event QR code to link your walk-in.
                    </p>
                  )}
                </div>

                {/* Walk-in Form */}
                <form onSubmit={handleWalkInSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={walkInName}
                        onChange={(e) => setWalkInName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccf141] transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        value={walkInPhone}
                        onChange={(e) => setWalkInPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccf141] transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={walkInLoading || !eventName}
                    className={`w-full py-3.5 rounded-xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                      walkInLoading || !eventName
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-[#ccf141] text-black hover:bg-[#b5d635] shadow-[0_0_20px_rgba(204,241,65,0.2)]"
                    }`}
                  >
                    {walkInLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Submit Walk-in</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EventCheckIn;
