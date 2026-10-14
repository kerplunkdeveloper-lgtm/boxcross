import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Info,
  User,
  Phone,
  Mail,
  ChevronRight,
  Check,
  Crown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createFounderPayment,
  verifyFounderPayment,
} from "../api/api";
import { toast } from "react-hot-toast";

const RazorpayFounderModal = ({ isOpen, onClose, planDetails }) => {
  const [step, setStep] = useState(1);
  const [payState, setPayState] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [user, setUser] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPayState("idle");
      setCreatedOrder(null);
      setLoading(false);
      setUser({
        name: "",
        email: "",
        phone: "",
      });
      setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!user.name.trim()) e.name = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(user.phone))
      e.phone = "Enter a valid 10-digit number";
    if (!/\S+@\S+\.\S+/.test(user.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Reserving founder tier & generating order...");

    try {
      const priceNum = parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
      const monthsVal = planDetails?.monthsVal || 1;

      const { data } = await createFounderPayment({
        name: user.name,
        phone: user.phone,
        email: user.email,
        planName: planDetails?.name || "Founder Plan",
        price: priceNum,
        durationMonths: monthsVal,
        founderTier: "Founding Member",
      });

      if (data.success) {
        toast.success("Founder pass reserved!", { id: toastId });
        setCreatedOrder(data);
        setStep(2);
      } else {
        toast.error("Failed to reserve founder offer.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating founder order.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedToPay = async () => {
    if (!createdOrder) {
      toast.error(
        "Order details are missing. Please go back and submit details.",
      );
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Initiating secure payment...");

    try {
      // Sandbox/Mock simulation fallback
      if (createdOrder.razorpayOrderId.startsWith("order_founder_mock_") || createdOrder.razorpayOrderId.startsWith("order_mock_")) {
        toast.success("Simulating sandbox payment verification...", {
          id: toastId,
        });

        setTimeout(async () => {
          const verifyToastId = toast.loading(
            "Confirming Founder Member status...",
          );
          try {
            const { data: verifyData } = await verifyFounderPayment({
              paymentId: createdOrder.paymentId,
              razorpayOrderId: createdOrder.razorpayOrderId,
              status: "success",
            });

            if (verifyData.success) {
              setPayState("success");
              toast.success("Welcome to Box & Cross Founders Club!", { id: verifyToastId });

              setTimeout(() => {
                onClose();
              }, 4000);
            } else {
              toast.error("Mock verification failed", { id: verifyToastId });
            }
          } catch (err) {
            console.error(err);
            toast.error("Simulator verification error", { id: verifyToastId });
          } finally {
            setLoading(false);
          }
        }, 1500);
        return;
      }

      // Real Razorpay Integration
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?", {
          id: toastId,
        });
        setLoading(false);
        return;
      }

      toast.dismiss(toastId);

      const options = {
        key: createdOrder.keyId,
        amount: createdOrder.amount,
        currency: createdOrder.currency,
        name: "Box & Cross — Founders Club",
        description: `Founding Member Pass: ${planDetails?.name}`,
        order_id: createdOrder.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#ccf141",
        },
        handler: async function (response) {
          setPayState("processing");
          const verifyToastId = toast.loading(
            "Verifying founder payment...",
          );
          try {
            const { data: verifyData } = await verifyFounderPayment({
              paymentId: createdOrder.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              status: "success",
            });

            if (verifyData.success) {
              setPayState("success");
              toast.success("Welcome to Founders Club! Payment Verified.", {
                id: verifyToastId,
              });

              setTimeout(() => {
                onClose();
              }, 4000);
            } else {
              toast.error("Payment verification failed", { id: verifyToastId });
              setPayState("idle");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error confirming payment verification", {
              id: verifyToastId,
            });
            setPayState("idle");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast("Payment window closed", { icon: "ℹ️" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        await verifyFounderPayment({
          paymentId: createdOrder.paymentId,
          status: "failed",
        });
        toast.error(response.error.description || "Payment failed");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Error opening payment window.", { id: toastId });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0e0e11] border border-white/10 rounded-t-[32px] sm:rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Mobile Grabber Handle */}
          <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

          {/* Header */}
          <div className="relative px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-[#ccf141]/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center text-[#ccf141] shadow-[0_0_15px_rgba(204,241,65,0.2)]">
                <Crown size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                 
                 
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-black tracking-wide uppercase text-white" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                  {planDetails?.name || "Founding Member Offer"}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stepper Progress Bar (Mobile & Desktop) */}
          {payState !== "success" && (
            <div className="px-5 sm:px-6 pt-3 pb-2.5 bg-[#0b0b0e] border-b border-white/5 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  step === 1
                    ? "bg-[#ccf141]/10 border-[#ccf141] text-[#ccf141]"
                    : "bg-white/[0.02] border-white/10 text-zinc-400"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    step > 1 ? "bg-[#ccf141] text-black" : step === 1 ? "bg-[#ccf141] text-black" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {step > 1 ? <Check size={11} strokeWidth={3} /> : "1"}
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider truncate" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                    1. Athlete Details
                  </span>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  step === 2
                    ? "bg-[#ccf141]/10 border-[#ccf141] text-[#ccf141]"
                    : "bg-white/[0.02] border-white/10 text-zinc-500"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    step === 2 ? "bg-[#ccf141] text-black" : "bg-zinc-800 text-zinc-500"
                  }`}>
                    2
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider truncate" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                    2. Checkout
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6">
            {payState === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#ccf141]/20 border border-[#ccf141] flex items-center justify-center mx-auto text-[#ccf141] shadow-[0_0_20px_rgba(204,241,65,0.3)]">
                  <Crown size={32} />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black uppercase text-white" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                    Founding Member Activated!
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
                    Welcome to the Box &amp; Cross Founding Circle. Your locked rate and founding privileges have been registered successfully.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-[#ccf141]/30 inline-block text-left text-xs font-mono space-y-1 shadow-inner">
                  <div className="text-neutral-400">Plan: <span className="text-white font-bold">{planDetails?.name}</span></div>
                  <div className="text-neutral-400">Amount Paid: <span className="text-[#ccf141] font-bold">₹{planDetails?.price}</span></div>
                  <div className="text-neutral-400">Status: <span className="text-emerald-400 font-bold uppercase">FOUNDING MEMBER</span></div>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <form onSubmit={handleContinue} className="space-y-4" autoComplete="off">
                {/* Plan Summary Badge */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-between shadow-inner">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Selected Tier</div>
                    <div className="text-xs sm:text-sm font-bold text-white uppercase mt-0.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                      {planDetails?.name}
                    </div>
                   
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Total Price</div>
                    <div className="text-lg sm:text-xl font-black text-[#ccf141]" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>
                      ₹{planDetails?.price}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-neutral-300 tracking-wider flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                      <User size={13} className="text-[#ccf141]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Rahul Sharma"
                      value={user.name}
                      onChange={(e) => {
                        setUser({ ...user, name: e.target.value });
                        setErrors({ ...errors, name: "" });
                      }}
                      className={`w-full px-4 py-3 bg-[#111115] border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
                        errors.name ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 flex items-center gap-1 pl-1 font-medium"><Info size={11} /> {errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-neutral-300 tracking-wider flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                      <Phone size={13} className="text-[#ccf141]" /> Phone Number (WhatsApp) *
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 text-zinc-400 font-bold text-xs pointer-events-none border-r border-zinc-700/80 pr-2.5">
                        <span className="text-[14px]">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        autoComplete="tel"
                        maxLength="10"
                        placeholder="98765 43210"
                        value={user.phone}
                        onChange={(e) => {
                          setUser({ ...user, phone: e.target.value.replace(/\D/g, "") });
                          setErrors({ ...errors, phone: "" });
                        }}
                        className={`w-full pl-[82px] pr-4 py-3 bg-[#111115] border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-all font-mono ${
                          errors.phone ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-400 flex items-center gap-1 pl-1 font-medium"><Info size={11} /> {errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-neutral-300 tracking-wider flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                      <Mail size={13} className="text-[#ccf141]" /> Email Address *
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={user.email}
                      onChange={(e) => {
                        setUser({ ...user, email: e.target.value });
                        setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full px-4 py-3 bg-[#111115] border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
                        errors.email ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-400 flex items-center gap-1 pl-1 font-medium"><Info size={11} /> {errors.email}</p>}
                  </div>
                </div>

                {/* Founding Perks bullet */}
                <div className="p-3.5 rounded-xl bg-[#ccf141]/5 border border-[#ccf141]/20 space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-[#ccf141] font-bold text-[11px] font-mono">
                    <ShieldCheck size={14} /> FOUNDING PRIVILEGES GUARANTEED
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Includes permanent rate lock on renewals, Box &amp; Cross Founding Wall inscription, and founding priority desk access.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(204,241,65,0.35)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-[0.98] disabled:opacity-50"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>RESERVING FOUNDER TIER...</span>
                      </>
                    ) : (
                      <>
                        <span>PROCEED TO FOUNDER CHECKOUT</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Digital Receipt Review Details */}
                <div className="rounded-2xl bg-[#111115] border border-zinc-800 overflow-hidden shadow-xl">
                  {/* Header */}
                  <div className="p-3.5 sm:p-4 bg-gradient-to-r from-zinc-900 to-black border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#ccf141] text-black font-black flex items-center justify-center text-xs">
                        <Crown size={14} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-white" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        Founders Pass Summary
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/40 font-bold">
                      VERIFIED
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-neutral-400">
                      <span>Athlete Name</span>
                      <span className="text-white font-bold truncate max-w-[190px]">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-400">
                      <span>Phone</span>
                      <span className="text-white font-mono font-semibold">+91 {user.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-400">
                      <span>Email</span>
                      <span className="text-white font-medium truncate max-w-[190px]">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-400">
                      <span>Founding Tier</span>
                      <span className="text-[#ccf141] font-bold uppercase truncate max-w-[190px]">{planDetails?.name}</span>
                    </div>

                    {/* Perforated divider */}
                    <div className="pt-2.5 border-t border-dashed border-zinc-700/80 flex justify-between items-baseline">
                      <span className="text-xs sm:text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        Total Amount Payable
                      </span>
                      <span className="text-2xl font-black text-[#ccf141]" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>
                        ₹{planDetails?.price}
                      </span>
                    </div>
                  </div>

                  {/* Supported Methods */}
                  <div className="px-4 py-2.5 bg-black/60 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                    <span>Payment Methods:</span>
                    <span className="text-zinc-300 font-semibold truncate ml-2">UPI · GPay · PhonePe · Cards · NetBanking</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-28 py-3.5 rounded-xl border border-white/10 text-neutral-300 font-bold text-xs uppercase hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    ← Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPay}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-[#ccf141] hover:bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(204,241,65,0.35)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] disabled:opacity-50"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>CONNECTING...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone size={15} />
                        <span>PAY ₹{planDetails?.price} VIA RAZORPAY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RazorpayFounderModal;
