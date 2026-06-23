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
import { updateMembership, createPayment, verifyMembershipPayment } from "../api/api";
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
      toast.error("Order details are missing. Please go back and submit details.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Initiating secure payment...");

    try {
      // Sandbox/Mock simulation
      if (createdOrder.razorpayOrderId.startsWith("order_mock_")) {
        toast.success("Running sandbox mock payment simulation...", { id: toastId });

        setTimeout(async () => {
          const verifyToastId = toast.loading("Verifying simulator transaction...");
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
                const priceNum = parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
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
        toast.error("Razorpay SDK failed to load. Are you online?", { id: toastId });
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
          const verifyToastId = toast.loading("Verifying payment transaction...");
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
              toast.success("Payment Verified & Subscription Activated!", { id: verifyToastId });

              // Update logged in user membership details if authenticated
              if (authUser && planDetails) {
                const priceNum = parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
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
          color: "#e5ff00",
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={!busy ? onClose : undefined}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", damping: 26, stiffness: 300 },
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.96,
              transition: { duration: 0.2 },
            }}
            className="relative w-full max-w-[1000px] max-h-[90vh] rounded-[24px] p-[2px] shadow-2xl overflow-hidden z-10"
          >
            {/* Spinning animated border */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_75%,#e5ff00_100%)] animate-[spin_3s_linear_infinite]" />

            {/* Content Container (protecting card boundary) */}
            <div className="relative w-full h-full bg-[#070708] rounded-[22px] flex flex-col md:flex-row overflow-hidden z-10" style={{ maxHeight: "calc(90vh - 4px)" }}>
              
              {/* ═══ LEFT DARK PANEL ═══ */}
              <div className="hidden md:flex flex-col justify-between w-[350px] shrink-0 bg-[#0f0f13] text-white p-8 relative overflow-hidden border-r border-white/5">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e5ff00]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-10 w-56 h-56 bg-[#e5ff00]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Logo / Badge */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#e5ff00] rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-black font-black text-lg leading-none pt-0.5">
                        ⚡
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-wide text-white uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>BoxCross</p>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">
                        Razorpay Checkout
                      </p>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  <div className="space-y-4 mb-8">
                    {[
                      { n: 1, label: "Your Details", sub: "Name, phone & email" },
                      { n: 2, label: "Secure Payment", sub: "Verify details & pay" },
                    ].map((s) => (
                      <div key={s.n} className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0 transition-all duration-300 ${
                            step > s.n
                              ? "bg-[#e5ff00] border-[#e5ff00] text-black"
                              : step === s.n
                                ? "bg-[#e5ff00]/10 border-[#e5ff00] text-[#e5ff00]"
                                : "bg-transparent border-white/20 text-white/30"
                          }`}
                        >
                          {step > s.n ? <Check size={16} /> : s.n}
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
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
                        Selected Plan
                      </p>
                      <p className="text-white font-bold text-sm line-clamp-2 mb-3 uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        {planDetails.name}
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-[#e5ff00] font-black text-3xl" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                          ₹{planDetails.price}
                        </span>
                        <span className="text-white/40 text-[11px] mb-1">
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
                        <div className="w-4.5 h-4.5 rounded-full bg-[#e5ff00]/10 border border-[#e5ff00]/30 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-[#e5ff00]" />
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

              {/* ═══ RIGHT WHITE PANEL ═══ */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#0c0c0d]">
                {/* Mobile header */}
                <div className="md:hidden bg-gradient-to-r from-[#111] to-[#222] px-5 py-4 flex items-center justify-between text-white shrink-0 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#e5ff00] rounded-full flex items-center justify-center text-black font-black text-base">
                      ⚡
                    </div>
                    <div>
                      <p className="font-black text-sm">BoxCross Checkout</p>
                      <p className="text-white/70 text-[10px] uppercase tracking-widest">
                        Step {step} of 2
                      </p>
                    </div>
                  </div>
                  {!busy && (
                    <button
                      onClick={onClose}
                      className="p-1.5 hover:bg-white/20 rounded-full"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Desktop close + heading */}
                {!busy && (
                  <div className="hidden md:flex items-center justify-between px-8 pt-7 pb-2 shrink-0">
                    <div>
                      <p className="text-[#e5ff00] text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        Step {step} of 2
                      </p>
                      <h2 className="text-white font-black text-xl uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                        {step === 1 ? "Your Details" : "Secure Checkout"}
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                      <X size={18} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                )}

                {/* Mobile plan summary */}
                {!busy && (
                  <div className="md:hidden bg-[#111] border-b border-white/5 px-5 py-3 flex items-center justify-between shrink-0">
                    <p className="text-gray-300 text-[12px] font-semibold line-clamp-1 flex-1 mr-3 uppercase">
                      {planDetails?.name}
                    </p>
                    <p className="text-[#e5ff00] font-black text-lg shrink-0">
                      ₹{planDetails?.price}
                    </p>
                  </div>
                )}

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* ── STEP 1: USER DETAILS ── */}
                    {step === 1 && payState === "idle" && (
                      <motion.form
                        key="s1"
                        onSubmit={handleContinue}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 md:px-8 py-5 md:py-6 space-y-5"
                      >
                        {/* Name */}
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                            <User size={11} className="text-[#e5ff00]" /> Full Name
                          </label>
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) => {
                              setUser((p) => ({ ...p, name: e.target.value }));
                              setErrors((p) => ({ ...p, name: "" }));
                            }}
                            placeholder="Enter your full name"
                            className={`w-full border-2 ${errors.name ? "border-red-500/50 bg-red-950/20" : "border-white/10 bg-[#111] focus:border-[#e5ff00]"} rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-semibold text-white`}
                            required
                          />
                          {errors.name && (
                            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                              <Info size={10} />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                            <Phone size={11} className="text-[#e5ff00]" /> Phone Number
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm border-r border-white/10 pr-3">
                              +91
                            </span>
                            <input
                              type="tel"
                              value={user.phone}
                              maxLength={10}
                              onChange={(e) => {
                                setUser((p) => ({
                                  ...p,
                                  phone: e.target.value.replace(/\D/g, ""),
                                }));
                                setErrors((p) => ({ ...p, phone: "" }));
                              }}
                              placeholder="Enter your phone number"
                              className={`w-full border-2 pl-16 ${errors.phone ? "border-red-500/50 bg-red-950/20" : "border-white/10 bg-[#111] focus:border-[#e5ff00]"} rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-semibold text-white`}
                              required
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                              <Info size={10} />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                            <Mail size={11} className="text-[#e5ff00]" /> Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) => {
                              setUser((p) => ({ ...p, email: e.target.value }));
                              setErrors((p) => ({ ...p, email: "" }));
                            }}
                            placeholder="Enter your email address"
                            className={`w-full border-2 ${errors.email ? "border-red-500/50 bg-red-950/20" : "border-white/10 bg-[#111] focus:border-[#e5ff00]"} rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-semibold text-white`}
                            required
                          />
                          {errors.email && (
                            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                              <Info size={10} />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#e5ff00] hover:bg-[#d8f000] text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm tracking-widest disabled:opacity-50 uppercase"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Creating Order...
                            </>
                          ) : (
                            <>
                              Continue to Payment <ChevronRight size={16} />
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}

                    {/* ── STEP 2: SECURE CHECKOUT ── */}
                    {step === 2 && payState === "idle" && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 md:px-8 py-8 flex flex-col items-center justify-center text-center h-full"
                      >
                        <div className="w-16 h-16 bg-[#e5ff00]/10 text-[#e5ff00] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#e5ff00]/5">
                          ⚡
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2 uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                          Secure Payment Checkout
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                          Clicking below will launch the secure Razorpay Payment Gateway.
                        </p>
                        
                        <div className="bg-white/[0.02] border border-white/5 w-full max-w-sm p-5 rounded-2xl text-left mb-8 space-y-3 text-xs">
                          <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-wider">
                            <span>Name</span>
                            <span className="text-white font-semibold truncate max-w-[200px]">{user.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-wider">
                            <span>Phone</span>
                            <span className="text-white font-semibold">{user.phone}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-wider">
                            <span>Plan</span>
                            <span className="text-white font-semibold truncate max-w-[200px]">{planDetails?.name}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/10 font-bold text-sm">
                            <span className="text-white uppercase">Total Amount</span>
                            <span className="text-[#e5ff00]">₹{planDetails?.price}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleProceedToPay}
                          disabled={loading}
                          className="w-full max-w-sm bg-[#e5ff00] hover:bg-[#d8f000] text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm tracking-widest disabled:opacity-50 uppercase"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Initiating...
                            </>
                          ) : (
                            <>
                              Pay with Razorpay
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setStep(1)}
                          disabled={loading}
                          className="mt-4 text-[11px] text-gray-400 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                        >
                          ← Edit details
                        </button>
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
                          <div className="w-24 h-24 border-4 border-[#e5ff00] rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Smartphone
                              size={28}
                              className="text-[#e5ff00] animate-pulse"
                            />
                          </div>
                        </div>
                        <h3 className="text-white font-black text-2xl mb-2 uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                          Verifying Payment
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
                          Checking transaction details and finalizing your subscription. Do not close this window.
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
                          transition={{ type: "spring", damping: 12, delay: 0.1 }}
                          className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative border border-green-500/20"
                        >
                          <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-20 animate-ping" />
                          <CheckCircle2
                            size={48}
                            className="text-green-400 z-10"
                          />
                        </motion.div>
                        <h3 className="text-white font-black text-2xl md:text-3xl mb-1 uppercase" style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}>
                          Subscription Active!
                        </h3>
                        <p className="text-gray-400 text-sm mb-7">
                          ₹{planDetails?.price} paid successfully. Welcome to BoxCross.
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
                            className="text-[#e5ff00] animate-spin mb-2"
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
                    <ShieldCheck size={12} className="text-green-500" /> 100% Secure Payments Powered By Razorpay
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
