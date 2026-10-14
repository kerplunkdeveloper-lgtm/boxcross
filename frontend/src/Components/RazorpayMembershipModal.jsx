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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  updateMembership,
  createPayment,
  verifyMembershipPayment,
} from "../api/api";
import { toast } from "react-hot-toast";

const RazorpayMembershipModal = ({ isOpen, onClose, planDetails }) => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
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
  }, [isOpen, authUser]);

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
    const toastId = toast.loading("Saving details and creating order...");

    try {
      const priceNum = parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
      const monthsVal = planDetails?.monthsVal || 1;

      const { data } = await createPayment({
        name: user.name,
        phone: user.phone,
        email: user.email,
        planName: planDetails?.name || "Membership Plan",
        price: priceNum,
        durationMonths: monthsVal,
      });

      if (data.success) {
        toast.success("Details saved!", { id: toastId });
        setCreatedOrder(data);
        setStep(2);
      } else {
        toast.error("Failed to create payment order.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating payment order.", { id: toastId });
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
      // Sandbox/Mock simulation
      if (createdOrder.razorpayOrderId.startsWith("order_mock_")) {
        toast.success("Running sandbox mock payment simulation...", {
          id: toastId,
        });

        setTimeout(async () => {
          const verifyToastId = toast.loading(
            "Verifying simulator transaction...",
          );
          try {
            const { data: verifyData } = await verifyMembershipPayment({
              paymentId: createdOrder.paymentId,
              razorpayOrderId: createdOrder.razorpayOrderId,
              status: "success",
            });

            if (verifyData.success) {
              setPayState("success");
              toast.success("Payment Successful!", { id: verifyToastId });

              // Update user state if authenticated
              if (authUser && planDetails) {
                const priceNum =
                  parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
                const monthsVal = planDetails?.monthsVal || 1;
                const { data: updateData } = await updateMembership({
                  planName: planDetails.name,
                  price: priceNum,
                  durationMonths: monthsVal,
                });
                if (updateData.success) {
                  setAuthUser(updateData.user);
                }
              }

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
        name: "BoxCross Gym",
        description: `Subscription: ${planDetails?.name}`,
        order_id: createdOrder.razorpayOrderId,
        handler: async function (response) {
          setPayState("processing");
          const verifyToastId = toast.loading(
            "Verifying payment transaction...",
          );
          try {
            const { data: verifyData } = await verifyMembershipPayment({
              paymentId: createdOrder.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              status: "success",
            });

            if (verifyData.success) {
              setPayState("success");
              toast.success("Payment Verified & Subscription Activated!", {
                id: verifyToastId,
              });

              // Update logged in user membership details if authenticated
              if (authUser && planDetails) {
                const priceNum =
                  parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
                const monthsVal = planDetails?.monthsVal || 1;
                const { data: updateData } = await updateMembership({
                  planName: planDetails.name,
                  price: priceNum,
                  durationMonths: monthsVal,
                });
                if (updateData.success) {
                  setAuthUser(updateData.user);
                }
              }

              setTimeout(() => {
                onClose();
              }, 4000);
            } else {
              toast.error("Payment verification failed", { id: verifyToastId });
              setPayState("idle");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error", { id: verifyToastId });
            setPayState("idle");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#ccf141",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", async function (response) {
        toast.error("Payment failed!");
        try {
          await verifyMembershipPayment({
            paymentId: createdOrder.paymentId,
            status: "failed",
          });
        } catch (err) {
          console.error("Failed to update status", err);
        } finally {
          setLoading(false);
        }
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Error processing payment", { id: toastId });
      setLoading(false);
    }
  };

  const busy = loading || payState === "processing" || payState === "success";

  const features = [
    "Unlimited group classes",
    "Open gym access",
    "BXC community access",
    "Progress tracking & support",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={!busy ? onClose : undefined}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", damping: 26, stiffness: 300 },
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.98,
              transition: { duration: 0.2 },
            }}
            className="relative w-full max-w-[980px] max-h-[92vh] sm:max-h-[88vh] rounded-t-[32px] sm:rounded-[26px] p-[1.5px] sm:p-[2px] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col"
          >
            {/* Ambient Spinning Conic Gradient Border */}
            <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#ccf141_100%)] animate-[spin_4s_linear_infinite] pointer-events-none" />

            {/* Content Container */}
            <div
              className="relative w-full h-full bg-[#08080a] rounded-t-[30px] sm:rounded-[24px] flex flex-col md:flex-row overflow-hidden z-10 max-h-[92vh] sm:max-h-[calc(88vh-4px)]"
            >
              {/* Mobile Grabber Handle */}
              <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

              {/* ═══ LEFT DARK PANEL (Desktop & Tablet) ═══ */}
              <div className="hidden md:flex flex-col justify-between w-[350px] shrink-0 bg-[#0c0c10] text-white p-8 relative overflow-hidden border-r border-white/5">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-10 w-56 h-56 bg-[#ccf141]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Logo / Badge */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#ccf141] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ccf141]/20">
                      <span className="text-black font-black text-lg leading-none pt-0.5">
                        ⚡
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-black text-sm tracking-wide text-white uppercase"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        BoxCross
                      </p>
                      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                        <ShieldCheck size={11} className="text-[#ccf141]" /> Razorpay Checkout
                      </p>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  <div className="space-y-4 mb-8">
                    {[
                      {
                        n: 1,
                        label: "Your Details",
                        sub: "Name, phone & email",
                      },
                      {
                        n: 2,
                        label: "Secure Payment",
                        sub: "Verify details & pay",
                      },
                    ].map((s) => (
                      <div key={s.n} className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0 transition-all duration-300 ${
                            step > s.n
                              ? "bg-[#ccf141] border-[#ccf141] text-black"
                              : step === s.n
                                ? "bg-[#ccf141]/15 border-[#ccf141] text-[#ccf141]"
                                : "bg-transparent border-white/20 text-white/30"
                          }`}
                        >
                          {step > s.n ? <Check size={16} strokeWidth={3} /> : s.n}
                        </div>
                        <div>
                          <p
                            className={`font-bold text-sm ${step >= s.n ? "text-white" : "text-white/30"}`}
                          >
                            {s.label}
                          </p>
                          <p
                            className={`text-[11px] ${step >= s.n ? "text-white/50" : "text-white/20"}`}
                          >
                            {s.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Plan Card */}
                  {planDetails && (
                    <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm shadow-inner">
                      <p className="text-[#ccf141] text-[10px] uppercase tracking-widest font-black mb-1 font-mono">
                        Selected Plan
                      </p>
                      <p
                        className="text-white font-bold text-sm line-clamp-2 mb-3 uppercase"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {planDetails.name}
                      </p>
                      <div className="flex items-end gap-1.5">
                        <span
                          className="text-[#ccf141] font-black text-3xl leading-none"
                          style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}
                        >
                          ₹{planDetails.price}
                        </span>
                        <span className="text-zinc-400 text-[11px] mb-0.5">
                          one-time
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="relative z-10 mt-6">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">
                    What's included
                  </p>
                  <div className="space-y-2">
                    {features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-white/60"
                      >
                        <div className="w-4.5 h-4.5 rounded-full bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-[#ccf141]" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-5 text-[11px] text-white/30 font-bold">
                    <ShieldCheck size={13} className="text-green-400" /> 256-bit
                    encrypted & secure
                  </div>
                </div>
              </div>

              {/* ═══ RIGHT PANEL (Main Content on Mobile & Desktop) ═══ */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#08080a]">

                {/* ── MOBILE HEADER (Modern Glass Top Bar) ── */}
                <div className="md:hidden bg-gradient-to-r from-[#0c0c10] to-[#121217] px-4 sm:px-5 py-3.5 flex items-center justify-between text-white shrink-0 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#ccf141] rounded-xl flex items-center justify-center text-black font-black text-sm shadow-[0_0_12px_rgba(204,241,65,0.3)]">
                      ⚡
                    </div>
                    <div>
                      <p className="font-black text-xs tracking-wider uppercase text-white" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        BoxCross Checkout
                      </p>
                      <div className="flex items-center gap-1.5 text-[9.5px] text-zinc-400 font-mono">
                        <ShieldCheck size={11} className="text-[#ccf141]" />
                        <span>256-Bit SSL Encrypted</span>
                      </div>
                    </div>
                  </div>
                  {!busy && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* ── MOBILE 2-STEP PROGRESS SEGMENT + PLAN SNAPSHOT ── */}
                {!busy && (
                  <div className="md:hidden px-4 pt-3 pb-2.5 bg-[#0b0b0e] border-b border-white/5 shrink-0 space-y-2.5">
                    {/* Stepper Buttons */}
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
                          1. Details
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
                          2. Payment
                        </span>
                      </div>
                    </div>

                    {/* Plan Snapshot Badge */}
                    {planDetails && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-between shadow-inner">
                        <div className="min-w-0 pr-2">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#ccf141] font-bold block">
                            MEMBERSHIP PLAN
                          </span>
                          <h4 className="text-xs font-black text-white uppercase truncate" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                            {planDetails.name}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-[#ccf141] leading-none block" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>
                            ₹{planDetails.price}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-mono">Total Payable</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── DESKTOP HEADER (Close + Step Heading) ── */}
                {!busy && (
                  <div className="hidden md:flex items-center justify-between px-8 pt-7 pb-2 shrink-0">
                    <div>
                      <p
                        className="text-[#ccf141] text-[11px] font-bold uppercase tracking-widest mb-0.5"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        Step {step} of 2
                      </p>
                      <h2
                        className="text-white font-black text-xl uppercase"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        {step === 1 ? "Your Contact Details" : "Order Review & Pay"}
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                    >
                      <X size={18} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                )}

                {/* ── SCROLLABLE CONTENT BODY ── */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {/* ── STEP 1: USER DETAILS ── */}
                    {step === 1 && payState === "idle" && (
                      <motion.form
                        key="s1"
                        onSubmit={handleContinue}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 sm:space-y-5 max-w-md mx-auto md:max-w-none"
                      >
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label
                            className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            <User size={13} className="text-[#ccf141]" /> Full Name *
                          </label>
                          <input
                            type="text"
                            value={user.name}
                            autoComplete="name"
                            onChange={(e) => {
                              setUser((p) => ({ ...p, name: e.target.value }));
                              setErrors((p) => ({ ...p, name: "" }));
                            }}
                            placeholder="e.g. Rahul Sharma"
                            className={`w-full bg-[#111115] border ${
                              errors.name ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                            } rounded-xl px-4 py-3 text-sm outline-none transition-all font-semibold text-white placeholder-zinc-500`}
                            required
                          />
                          {errors.name && (
                            <p className="text-red-400 text-[11px] flex items-center gap-1 font-medium pl-1">
                              <Info size={11} /> {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <label
                            className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            <Phone size={13} className="text-[#ccf141]" /> WhatsApp / Phone Number *
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3.5 flex items-center gap-1.5 text-zinc-400 font-bold text-xs pointer-events-none border-r border-zinc-700/80 pr-2.5">
                              <span className="text-[14px]">🇮🇳</span>
                              <span>+91</span>
                            </div>
                            <input
                              type="tel"
                              value={user.phone}
                              maxLength={10}
                              autoComplete="tel"
                              onChange={(e) => {
                                setUser((p) => ({
                                  ...p,
                                  phone: e.target.value.replace(/\D/g, ""),
                                }));
                                setErrors((p) => ({ ...p, phone: "" }));
                              }}
                              placeholder="98765 43210"
                              className={`w-full bg-[#111115] border pl-[82px] pr-4 py-3 ${
                                errors.phone ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                              } rounded-xl text-sm outline-none transition-all font-semibold text-white placeholder-zinc-500 font-mono`}
                              required
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-400 text-[11px] flex items-center gap-1 font-medium pl-1">
                              <Info size={11} /> {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label
                            className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            <Mail size={13} className="text-[#ccf141]" /> Email Address *
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            autoComplete="email"
                            onChange={(e) => {
                              setUser((p) => ({ ...p, email: e.target.value }));
                              setErrors((p) => ({ ...p, email: "" }));
                            }}
                            placeholder="name@example.com"
                            className={`w-full bg-[#111115] border px-4 py-3 ${
                              errors.email ? "border-red-500/80 bg-red-950/20" : "border-zinc-800 focus:border-[#ccf141] focus:ring-2 focus:ring-[#ccf141]/20"
                            } rounded-xl text-sm outline-none transition-all font-semibold text-white placeholder-zinc-500`}
                            required
                          />
                          {errors.email && (
                            <p className="text-red-400 text-[11px] flex items-center gap-1 font-medium pl-1">
                              <Info size={11} /> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#ccf141] hover:bg-white text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest disabled:opacity-50 uppercase cursor-pointer shadow-[0_0_25px_rgba(204,241,65,0.35)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-[0.98]"
                            style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="animate-spin" size={16} /> Generating Order...
                              </>
                            ) : (
                              <>
                                Continue to Payment <ChevronRight size={16} />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* ── STEP 2: SECURE CHECKOUT (DIGITAL RECEIPT TICKET) ── */}
                    {step === 2 && payState === "idle" && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-md mx-auto space-y-4"
                      >
                        {/* Digital Ticket Container */}
                        <div className="relative rounded-2xl bg-[#111115] border border-zinc-800/90 overflow-hidden shadow-xl">
                          {/* Ticket Header */}
                          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-zinc-900 to-black border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-[#ccf141] text-black font-black flex items-center justify-center text-xs">
                                ⚡
                              </div>
                              <span className="text-xs font-black uppercase tracking-wider text-white" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                                Payment Summary
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccf141]/15 text-[#ccf141] border border-[#ccf141]/40 font-bold">
                              ORDER READY
                            </span>
                          </div>

                          {/* Ticket Body */}
                          <div className="p-4 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center text-zinc-400">
                              <span className="font-medium">Member Name</span>
                              <span className="text-white font-bold truncate max-w-[190px]">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                              <span className="font-medium">Phone</span>
                              <span className="text-white font-mono font-semibold">+91 {user.phone}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                              <span className="font-medium">Email</span>
                              <span className="text-white font-medium truncate max-w-[190px]">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                              <span className="font-medium">Selected Plan</span>
                              <span className="text-[#ccf141] font-bold uppercase truncate max-w-[190px]">{planDetails?.name}</span>
                            </div>

                            {/* Perforated Divider */}
                            <div className="pt-2.5 border-t border-dashed border-zinc-700/80 flex justify-between items-baseline">
                              <span className="text-xs sm:text-sm font-black uppercase text-white tracking-wider" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                                Total Amount
                              </span>
                              <span className="text-2xl font-black text-[#ccf141]" style={{ fontFamily: '"BrutalTypeBold", Impact, sans-serif' }}>
                                ₹{planDetails?.price}
                              </span>
                            </div>
                          </div>

                          {/* Supported Payment Gateways row */}
                          <div className="px-4 py-2.5 bg-black/60 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                            <span>Supported:</span>
                            <span className="text-zinc-300 font-semibold truncate ml-2">UPI · GPay · PhonePe · Cards · EMI</span>
                          </div>
                        </div>

                        {/* Proceed to Pay CTA */}
                        <button
                          onClick={handleProceedToPay}
                          disabled={loading}
                          className="w-full bg-[#ccf141] hover:bg-white text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest disabled:opacity-50 uppercase cursor-pointer shadow-[0_0_30px_rgba(204,241,65,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] active:scale-[0.98]"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Connecting Gateway...
                            </>
                          ) : (
                            <>
                              <Smartphone size={16} /> Pay ₹{planDetails?.price} via Razorpay
                            </>
                          )}
                        </button>

                        {/* Back / Edit Button */}
                        <div className="flex justify-center pt-1">
                          <button
                            onClick={() => setStep(1)}
                            disabled={loading}
                            className="text-xs text-zinc-400 hover:text-white font-semibold transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-white/5"
                          >
                            ← Edit my contact details
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ── PROCESSING ── */}
                    {payState === "processing" && (
                      <motion.div
                        key="proc"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-24 md:py-32 px-8 flex flex-col items-center justify-center text-center bg-transparent"
                      >
                        <div className="relative mb-8">
                          <div className="w-24 h-24 border-4 border-white/5 rounded-full" />
                          <div className="w-24 h-24 border-4 border-[#ccf141] rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Smartphone
                              size={28}
                              className="text-[#ccf141] animate-pulse"
                            />
                          </div>
                        </div>
                        <h3
                          className="text-white font-black text-2xl mb-2 uppercase"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          Verifying Payment
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
                          Checking transaction details and finalizing your
                          subscription. Do not close this window.
                        </p>
                      </motion.div>
                    )}

                    {/* ── SUCCESS ── */}
                    {payState === "success" && (
                      <motion.div
                        key="succ"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 md:py-20 px-8 flex flex-col items-center justify-center text-center bg-transparent"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            damping: 12,
                            delay: 0.1,
                          }}
                          className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative border border-green-500/20"
                        >
                          <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-20 animate-ping" />
                          <CheckCircle2
                            size={48}
                            className="text-green-400 z-10"
                          />
                        </motion.div>
                        <h3
                          className="text-white font-black text-2xl md:text-3xl mb-1 uppercase"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          Subscription Active!
                        </h3>
                        <p className="text-gray-400 text-sm mb-7">
                          ₹{planDetails?.price} paid successfully. Welcome to
                          BoxCross.
                        </p>
                        <div className="bg-white/[0.02] border border-white/5 w-full max-w-sm p-5 rounded-2xl text-left shadow-sm space-y-3 text-[12px]">
                          {[
                            ["Name", user.name],
                            ["Phone", `+91 ${user.phone}`],
                            ["Email", user.email],
                            ["Plan", planDetails?.name],
                          ].map(([k, v]) => (
                            <div
                              key={k}
                              className="flex justify-between items-center"
                            >
                              <span className="text-gray-400 font-bold uppercase tracking-wider">
                                {k}
                              </span>
                              <span className="font-bold text-white truncate ml-4 max-w-[180px]">
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-7 flex flex-col items-center">
                          <Loader2
                            size={20}
                            className="text-[#ccf141] animate-spin mb-2"
                          />
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                            Redirecting...
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {!busy && (
                  <div className="border-t border-white/5 py-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase shrink-0 bg-black/40">
                    <ShieldCheck size={12} className="text-green-500" /> 100%
                    Secure Payments Powered By Razorpay
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RazorpayMembershipModal;
