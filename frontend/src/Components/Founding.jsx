import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Crown, Star, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createFounder, getFoundingOffer, updateFounder } from "../api/api";
import { toast } from "react-hot-toast";

const Founding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [offerData, setOfferData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [currentFounderId, setCurrentFounderId] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const { data } = await getFoundingOffer();
        setOfferData(data);
      } catch (err) {
        console.error("Failed to fetch founding offer");
      }
    };

    // Initial fetch
    fetchOffer();

    // 1. Cross-tab communication: Listen for instant updates from the Admin dashboard
    const channel = new BroadcastChannel("founding_offer_updates");
    channel.onmessage = (event) => {
      if (event.data === "OFFER_UPDATED") {
        fetchOffer(); // Refetch immediately when admin saves
      }
    };

    // 2. Refresh data when user returns to this tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOffer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Fallback background polling (every 60 seconds) to ensure it's always up-to-date
    const intervalId = setInterval(fetchOffer, 60000);

    return () => {
      channel.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!offerData || !offerData.col3_offerEndDate) return;

    const targetDate = new Date(offerData.col3_offerEndDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days < 10 ? "0" + days : days.toString(),
          hours: hours < 10 ? "0" + hours : hours.toString(),
          minutes: minutes < 10 ? "0" + minutes : minutes.toString(),
          seconds: seconds < 10 ? "0" + seconds : seconds.toString(),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [offerData]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await createFounder({
        ...formData,
        paymentStatus: "Pending",
        price: offerData ? offerData.col2_price : "12,000",
        duration: offerData ? offerData.col2_duration : "FOR 1 YEAR",
      });
      setCurrentFounderId(data._id);

      // Notify admin dashboard immediately about the pending lead
      const channel = new BroadcastChannel("founding_members_updates");
      channel.postMessage("NEW_FOUNDER_ADDED");
      channel.close();

      setPaymentStep(true);
    } catch (error) {
      console.error(error);
      toast.error("Error saving your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSimulation = async () => {
    setLoading(true);
    // Simulate Razorpay / Payment Gateway delay
    setTimeout(async () => {
      try {
        if (currentFounderId) {
          await updateFounder(currentFounderId, {
            paymentStatus: "Completed",
            paymentId: "demo_pay_" + Math.random().toString(36).substr(2, 9),
          });
        }

        toast.success("Payment Successful! Welcome Founder.");
        setIsModalOpen(false);
        setPaymentStep(false);
        setFormData({ name: "", email: "", phone: "" });
        setCurrentFounderId(null);

        // Notify admin dashboard immediately
        const channel = new BroadcastChannel("founding_members_updates");
        channel.postMessage("NEW_FOUNDER_ADDED");
        channel.close();
      } catch (error) {
        console.error(error);
        toast.error("Error processing your request");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div id="founders" className=" md:py-9">
      <div className="flex flex-col items-start md:items-center justify-center mt-10 mb-5 w-full max-w-7xl mx-auto px-4 md:px-0">
        <h2
          className="mt-2 md:mt-4 mb-0 text-[32px] md:text-[48px] leading-[40px] md:leading-[55px]"
          style={{
            fontFamily: '"BrutalTypeBold", sans-serif',
            fontWeight: "700",
          }}
        >
          Founders<span className="text-[#e5ff00]"> Offers</span>
        </h2>
      </div>
     
      {/* Countdown Promo Banner */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-0 mb-20">
        <div className="relative w-full rounded-[24px] md:rounded-[32px] border border-[#e5ff00] bg-black overflow-hidden flex flex-col lg:flex-row p-6 md:p-8 lg:p-12 gap-8 lg:gap-0 shadow-[0_0_50px_rgba(229,255,0,0.15)]">
          {/* Subtle X background pattern on the right */}
          <div
            className="absolute top-0 right-0 w-full lg:w-1/3 h-full opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l5.373 5.373-24.627 24.627 24.627 24.627-5.373 5.373-24.627-24.627-24.627 24.627-5.373-5.373 24.627-24.627-24.627-24.627 5.373-5.373 24.627 24.627z\\' fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
              backgroundSize: "60px 60px",
            }}
          ></div>

          {/* Column 1: Huge Text */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10 pr-0 lg:pr-6">
            <div className="inline-block rounded-md bg-[#e5ff00] px-4 py-1.5 mb-6">
              <span className="inline-block text-black  uppercase tracking-wider text-[12px] md:text-[14px]"
               style={{
                fontFamily: "Brutal Font Bold",
                fontWeight: "700",
               }}>
                {offerData ? offerData.col1_badge : "Founding Member Offer"}
              </span>
            </div>

            <h2
              className="flex flex-col uppercase m-0 leading-[0.8] tracking-[-0.03em]"
              style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
            >
              <span className="text-white text-[30px] md:text-[40px] font-black">
                {offerData ? offerData.col1_heading1 : "THE FIRST 100."}
              </span>
              <span
                className="text-[#e5ff00] text-[30px] md:text-[40px] font-black  mt-2"
                style={{ textShadow: "0 0 20px rgba(229,255,0,0.2)" }}
              >
                {offerData ? offerData.col1_heading2 : "THE FOUNDERS."}
              </span>
            </h2>

            <div className="flex items-start justify-center lg:justify-start gap-3 md:gap-5 mt-10 w-full">
              {/* Icon 1 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <Crown size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  FOUNDING MEMBER
                </span>
                <span className="text-[#e5ff00] font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  PRIVILEGES FOREVER
                </span>
              </div>

              <div className="w-px h-14 bg-zinc-800 mt-2"></div>

              {/* Icon 2 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <Star size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  BE PART OF BXC
                </span>
                <span className="text-[#e5ff00] font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  FROM DAY ONE
                </span>
              </div>

              <div className="w-px h-14 bg-zinc-800 mt-2"></div>

              {/* Icon 3 */}
              <div className="flex flex-col items-center text-center flex-1 max-w-[130px]">
                <div className="w-14 h-14 rounded-full border border-[#e5ff00] flex items-center justify-center mb-3">
                  <User size={24} className="text-[#e5ff00]" />
                </div>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  FIRST 100 MEMBERS
                </span>
                <span className="text-white font-bold text-[10px] md:text-[11px] leading-[1.2] uppercase tracking-wider">
                  ONLY
                </span>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px h-[85%] self-center bg-zinc-800 mx-4 z-10"></div>
          <div className="lg:hidden w-full h-px bg-zinc-800 my-4 z-10"></div>

          {/* Column 2: Price */}
          <div className="flex-1 w-full flex flex-col items-center justify-center z-10 px-0 lg:px-6">
            <div className="flex items-center gap-4 w-full justify-center mb-5">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[40px]"></div>
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">
                EXCLUSIVE PRICE
              </span>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[40px]"></div>
            </div>

            <div className="text-center mb-5 leading-[1.1]">
              <span className="block text-white font-black text-[18px] md:text-[20px] tracking-wide uppercase">
                ANY PLAN
              </span>
              <span className="block text-[#e5ff00] font-black text-[18px] md:text-[20px] tracking-wide uppercase">
                ONE PRICE
              </span>
            </div>

            <div className="relative w-full max-w-[280px] border border-[#e5ff00] rounded-[24px] flex flex-col items-center justify-center py-7 mb-10">
              <div className="flex items-start">
                <span className="text-[#e5ff00] font-black text-3xl md:text-4xl mt-1.5 mr-1.5">
                  ₹
                </span>
                <span
                  className="text-white font-black text-[60px] md:text-[76px] leading-none tracking-tighter"
                  style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                >
                  {offerData ? offerData.col2_price : "12,000"}
                </span>
              </div>
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#e5ff00] px-8 py-1.5 rounded-md whitespace-nowrap">
                <span className="text-black font-black text-[13px] tracking-widest uppercase">
                  {offerData ? offerData.col2_duration : "FOR 1 YEAR"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full justify-center">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[50px]"></div>
              <div className="text-center leading-[1.2]">
                <span className="block text-white font-bold text-[12px] md:text-[13px] tracking-widest uppercase">
                  YOU SAVE
                </span>
                <span className="block text-[#e5ff00] font-bold text-[12px] md:text-[13px] tracking-widest uppercase">
                  {offerData ? offerData.col2_saveAmount : "UP TO ₹6,000"}
                </span>
              </div>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[50px]"></div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px h-[85%] self-center bg-zinc-800 mx-4 z-10"></div>
          <div className="lg:hidden w-full h-px bg-zinc-800 my-4 z-10"></div>

          {/* Column 3: Countdown */}
          <div className="flex-1 w-full flex flex-col items-center justify-center z-10 pl-0 lg:pl-6">
            <div className="flex items-center gap-4 w-full justify-center mb-6">
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[30px]"></div>
              <span className="text-white font-bold text-[11px] tracking-widest uppercase">
                OFFER ENDS IN
              </span>
              <div className="h-[1px] bg-zinc-700 flex-1 max-w-[30px]"></div>
            </div>

            <div className="flex items-start justify-center gap-2 md:gap-3 mb-10">
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">
                  {timeLeft.days}
                </span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">
                  DAYS
                </span>
              </div>
              <span className="text-[#e5ff00] font-black text-[40px] leading-none mt-1.5">
                :
              </span>
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">
                  {timeLeft.hours}
                </span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">
                  HRS
                </span>
              </div>
              <span className="text-[#e5ff00] font-black text-[40px] leading-none mt-1.5">
                :
              </span>
              <div className="flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">
                  {timeLeft.minutes}
                </span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">
                  MINS
                </span>
              </div>
              <span className="text-[#e5ff00] font-black text-[40px] leading-none mt-1.5 hidden md:block">
                :
              </span>
              <div className="hidden md:flex flex-col items-center w-[70px]">
                <span className="text-[#e5ff00] font-black text-[52px] leading-none tracking-tight font-mono">
                  {timeLeft.seconds}
                </span>
                <span className="text-white/80 text-[11px] tracking-widest font-bold mt-3 uppercase">
                  SECS
                </span>
              </div>
            </div>

            <div className="border-[1.5px] border-[#e5ff00] rounded-[14px] px-6 py-3 flex items-center justify-center gap-2.5 mb-5 w-full max-w-[260px] cursor-pointer hover:bg-[#e5ff00]/10 transition-colors">
              <Clock size={18} className="text-[#e5ff00]" />
              <span className="text-[#e5ff00] font-bold uppercase tracking-wider text-[13px] md:text-[14px]">
                LIMITED TIME ONLY
              </span>
            </div>

            <span className="text-white/90 text-[14px] font-medium tracking-wide">
              Once it's gone, it's gone.
            </span>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-3 bg-[#e5ff00] text-black font-bold uppercase tracking-widest text-[14px] rounded-md hover:bg-[#e5ff00]/90 transition-colors cursor-pointer"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Popup for Data Collection & Payment */}
      {typeof window === "object" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[90vh] rounded-[24px] p-[2px] shadow-2xl overflow-hidden"
            >
              {/* Spinning animated border */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#e5ff00_100%)] animate-[spin_3s_linear_infinite]" />
              
              <div className="relative w-full h-full bg-black rounded-[22px] p-6 md:p-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 4px)" }}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPaymentStep(false);
                }}
                className="absolute top-4 right-4 p-2 bg-[#111] hover:bg-[#222] rounded-full text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {!paymentStep ? (
                <div>
                  <div className="text-center mb-6 mt-2">
                    <img src="https://framerusercontent.com/images/JI0NtmPcO2urtdJXDxdoDB0.jpeg?width=2124&height=1416" alt="" className="w-1/2 h-auto mx-auto mb-4 rounded-3xl" />
                    <h3 className="text-[#e5ff00]   uppercase tracking-wider mb-2"
                      style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontSize: "16px",
                fontWeight: "600",
              }}>
                      Claim Founder Offer
                    </h3>
                    <p className="text-gray-400 text-sm px-2"
                      style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontSize: "16px",
                fontWeight: "600",
              }}>
                      Enter your details to lock in the ₹
                      {offerData ? offerData.col2_price : "12,000"} /{" "}
                      {offerData ? offerData.col2_duration : "Year"} pricing.
                    </p>
                  </div>
                  <form onSubmit={handleInitialSubmit} className="space-y-4">
                    <div>
                     
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#e5ff00] transition-colors"
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                     
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#e5ff00] transition-colors"
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                     
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#e5ff00] transition-colors"
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-[#e5ff00] text-black font-black uppercase tracking-wider py-3.5 rounded-lg hover:bg-[#cce600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                       style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontSize: "16px",
                fontWeight: "600",
              }}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-black"
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
                          Saving Details...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#0055FF]/10 text-[#0055FF] rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Razorpay Demo Secure Checkout
                  </h3>
                  <p className="text-gray-400 text-sm mb-8">
                    Total Amount:{" "}
                    <strong className="text-white">
                      ₹{offerData ? offerData.col2_price : "12,000"}
                    </strong>
                  </p>

                  <button
                    onClick={handlePaymentSimulation}
                    disabled={loading}
                    className="w-full bg-[#0055FF] text-white font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-[#0044CC] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                       <>
                         <svg
                           className="animate-spin h-5 w-5 text-white"
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
                         Processing...
                       </>
                    ) : (
                      "Pay with Razorpay"
                    )}
                  </button>
                  <button
                    onClick={() => setPaymentStep(false)}
                    disabled={loading}
                    className="w-full mt-4 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Back to details
                  </button>
                </div>
              )}
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Founding;
