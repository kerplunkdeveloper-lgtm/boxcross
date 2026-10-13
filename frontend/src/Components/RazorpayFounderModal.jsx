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
import { useAuth } from "../context/AuthContext";
import {
  createFounderPayment,
  verifyFounderPayment,
} from "../api/api";
import { toast } from "react-hot-toast";

const RazorpayFounderModal = ({ isOpen, onClose, planDetails }) => {
  const { user: authUser } = useAuth();
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
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone: authUser?.phone || "",
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-[#0e0e11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-[#ccf141]/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center justify-center text-[#ccf141]">
                <Crown size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ccf141] font-bold">
                    Founders Club Exclusive
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#ccf141]/20 text-[#ccf141] font-mono">
                    LOCKED RATE
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white font-['BrutalTypeBold',sans-serif]">
                  {planDetails?.name || "Founding Member Offer"}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            {payState === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#ccf141]/20 border border-[#ccf141] flex items-center justify-center mx-auto text-[#ccf141]">
                  <Crown size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase text-white font-['BrutalTypeBold',sans-serif]">
                    Founding Member Activated!
                  </h4>
                  <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
                    Welcome to the Box &amp; Cross Founding Circle. Your locked rate and founding privileges have been registered successfully.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-[#ccf141]/30 inline-block text-left text-xs font-mono space-y-1">
                  <div className="text-neutral-400">Plan: <span className="text-white font-bold">{planDetails?.name}</span></div>
                  <div className="text-neutral-400">Amount Paid: <span className="text-[#ccf141] font-bold">₹{planDetails?.price}</span></div>
                  <div className="text-neutral-400">Status: <span className="text-emerald-400 font-bold uppercase">FOUNDING MEMBER</span></div>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <form onSubmit={handleContinue} className="space-y-4">
                {/* Plan Summary Badge */}
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Selected Tier</div>
                    <div className="text-sm font-bold text-white uppercase mt-0.5">{planDetails?.name}</div>
                    <div className="text-xs text-[#ccf141] mt-0.5 flex items-center gap-1 font-mono">
                      <Sparkles size={11} /> Permanent Founding Rate
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Total Price</div>
                    <div className="text-xl font-black text-[#ccf141]">₹{planDetails?.price}</div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                          errors.name ? "border-red-500" : "border-white/10 focus:border-[#ccf141]"
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="9876543210"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value.replace(/\D/g, "") })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                          errors.phone ? "border-red-500" : "border-white/10 focus:border-[#ccf141]"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-neutral-900 border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                          errors.email ? "border-red-500" : "border-white/10 focus:border-[#ccf141]"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Founding Perks bullet */}
                <div className="p-3.5 rounded-xl bg-[#ccf141]/5 border border-[#ccf141]/20 space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-[#ccf141] font-bold text-[11px] font-mono">
                    <ShieldCheck size={14} /> FOUNDING PRIVILEGES GUARANTEED
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Includes permanent rate lock on future renewals, Box &amp; Cross Founding Wall inscription, and founding welcome gear.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#ccf141] text-black font-black uppercase tracking-wider text-sm hover:bg-[#b8da3a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(204,241,65,0.2)] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>PROCEED TO FOUNDER CHECKOUT</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                {/* Review Details */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="text-neutral-400">Athlete Name</span>
                    <span className="text-white font-bold">{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="text-neutral-400">Phone</span>
                    <span className="text-white font-mono">{user.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="text-neutral-400">Email</span>
                    <span className="text-white font-mono">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="text-neutral-400">Founding Tier</span>
                    <span className="text-[#ccf141] font-bold uppercase">{planDetails?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-white font-bold">Total Amount Payable</span>
                    <span className="text-[#ccf141] font-black text-lg">₹{planDetails?.price}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-300 font-bold text-xs uppercase hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPay}
                    disabled={loading}
                    className="flex-2 py-3 rounded-xl bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b8da3a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(204,241,65,0.25)] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
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
