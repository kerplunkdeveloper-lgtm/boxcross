import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Info,
  QrCode,
  User,
  Phone,
  Mail,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { updateMembership, createPayment } from "../api/api";

const PhonePeModal = ({ isOpen, onClose, planDetails }) => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [step, setStep] = useState(1);
  const [payState, setPayState] = useState("idle");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [user, setUser] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPayState("idle");
      setUpiId("");
      setUpiError("");

      // Pre-fill user data if logged in
      if (authUser) {
        setUser({
          name: authUser.name || "",
          phone: authUser.phone || "",
          email: authUser.email || "",
        });
      } else {
        setUser({ name: "", phone: "", email: "" });
      }

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

  const handleContinue = () => {
    if (validate()) setStep(2);
  };

  const handleSuccessPayment = async () => {
    try {
      const monthsVal = planDetails?.monthsVal || 1;
      const priceNum = parseFloat(planDetails?.price.replace(/,/g, "")) || 0;
      const txnId = `TXN-${Date.now()}`;

      // Store Payment details in Payments collection
      await createPayment({
        name: user.name,
        phone: user.phone,
        email: user.email,
        planName: planDetails?.name || "Membership Plan",
        price: priceNum,
        durationMonths: monthsVal,
        transactionId: txnId,
        paymentStatus: "success",
        paymentMethod: upiId ? "UPI" : "PhonePe App",
      });

      // Update logged in user membership details if authenticated
      if (authUser && planDetails) {
        const { data } = await updateMembership({
          planName: planDetails.name,
          price: priceNum,
          durationMonths: monthsVal,
        });
        if (data.success) {
          setAuthUser(data.user);
        }
      }
    } catch (err) {
      console.error("Error storing payment record in DB", err);
    }
  };

  const handleVerify = () => {
    if (!upiId || !upiId.includes("@")) {
      setUpiError("Enter a valid UPI ID (e.g., name@ybl)");
      return;
    }
    setUpiError("");
    setPayState("processing");
    setTimeout(async () => {
      setPayState("success");
      await handleSuccessPayment();
      setTimeout(onClose, 4500);
    }, 4500);
  };

  const handleAppPay = () => {
    setPayState("processing");
    setTimeout(async () => {
      setPayState("success");
      await handleSuccessPayment();
      setTimeout(onClose, 4500);
    }, 3000);
  };

  const busy = payState === "processing" || payState === "success";

  const features = [
    "Unlimited group classes",
    "Open gym access",
    "BXC community access",
    "Progress tracking",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center md:p-6 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
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
            className="relative w-full md:max-w-4xl bg-white md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
            style={{ maxHeight: "92vh" }}
          >
            {/* ═══ LEFT DARK PANEL ═══ */}
            <div className="hidden md:flex flex-col justify-between w-[340px] shrink-0 bg-[#0f0f13] text-white p-8 relative overflow-hidden">
              {/* BG decoration */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#5f259f]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-10 w-56 h-56 bg-[#e5ff00]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#5f259f] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg leading-none pt-0.5">
                      पे
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm tracking-wide">PhonePe</p>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest">
                      Secure Checkout
                    </p>
                  </div>
                </div>

                {/* Step Indicator */}
                <div className="space-y-4 mb-8">
                  {[
                    { n: 1, label: "Your Details", sub: "Name, phone & email" },
                    { n: 2, label: "Payment", sub: "UPI / QR Code" },
                  ].map((s) => (
                    <div key={s.n} className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 shrink-0 transition-all duration-300 ${
                          step > s.n
                            ? "bg-[#e5ff00] border-[#e5ff00] text-black"
                            : step === s.n
                              ? "bg-[#5f259f] border-[#5f259f] text-white"
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
                  <div
                    className="ml-4 w-px h-8 bg-white/10 -mt-2"
                    style={{ marginLeft: "17px" }}
                  />
                </div>

                {/* Plan Card */}
                {planDetails && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
                      Selected Plan
                    </p>
                    <p className="text-white font-bold text-sm line-clamp-2 mb-3">
                      {planDetails.name}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-[#e5ff00] font-black text-3xl">
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
                      className="flex items-center gap-2 text-[10px] text-white/60"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#e5ff00]/10 border border-[#e5ff00]/30 flex items-center justify-center shrink-0">
                        <Check size={9} className="text-[#e5ff00]" />
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
            <div className="flex-1 flex flex-col min-h-0">
              {/* Mobile header */}
              <div className="md:hidden bg-gradient-to-r from-[#5f259f] to-[#8b3fcf] px-5 py-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#5f259f] font-black text-base pt-0.5">
                      पे
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm">PhonePe</p>
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
                    <p className="text-[#5f259f] text-[11px] font-bold uppercase tracking-widest mb-0.5">
                      Step {step} of 2
                    </p>
                    <h2 className="text-gray-900 font-black text-xl">
                      {step === 1 ? "Your Details" : "Choose Payment"}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
              )}

              {/* Mobile plan summary */}
              {!busy && (
                <div className="md:hidden bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
                  <p className="text-gray-600 text-[12px] font-semibold line-clamp-1 flex-1 mr-3">
                    {planDetails?.name}
                  </p>
                  <p className="text-gray-900 font-black text-lg shrink-0">
                    ₹{planDetails?.price}
                  </p>
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* ── STEP 1: USER DETAILS ── */}
                  {step === 1 && payState === "idle" && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 md:px-8 py-5 md:py-6 space-y-5"
                    >
                      {/* Name */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <User size={11} /> Full Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => {
                            setUser((p) => ({ ...p, name: e.target.value }));
                            setErrors((p) => ({ ...p, name: "" }));
                          }}
                          placeholder="Enter your full name"
                          className={`w-full border-2 ${errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#5f259f]"} rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-purple-100 transition-all font-semibold text-gray-800`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                            <Info size={10} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Phone size={11} /> Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm border-r border-gray-200 pr-3">
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
                            className={`w-full border-2 pl-16 ${errors.phone ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#5f259f]"} rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-purple-100 transition-all font-semibold text-gray-800`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                            <Info size={10} />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Mail size={11} /> Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => {
                            setUser((p) => ({ ...p, email: e.target.value }));
                            setErrors((p) => ({ ...p, email: "" }));
                          }}
                          placeholder="Enter your email address"
                          className={`w-full border-2 ${errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-[#5f259f]"} rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-purple-100 transition-all font-semibold text-gray-800`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                            <Info size={10} />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleContinue}
                        className="w-full bg-[#5f259f] hover:bg-[#4a1c7c] active:scale-[0.98] text-white font-black py-4 rounded-2xl transition-all shadow-[0_6px_20px_rgba(95,37,159,0.3)] hover:shadow-[0_8px_28px_rgba(95,37,159,0.4)] flex items-center justify-center gap-2 text-sm tracking-wide"
                      >
                        CONTINUE TO PAYMENT <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* ── STEP 2: PAYMENT ── */}
                  {step === 2 && payState === "idle" && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col md:flex-row h-full"
                    >
                      {/* UPI Section */}
                      <div className="flex-1 px-5 md:px-8 py-5 md:py-6 flex flex-col md:border-r border-gray-100">
                        <button
                          onClick={handleAppPay}
                          className="w-full group bg-white border-2 border-purple-200 hover:border-[#5f259f] py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:bg-purple-50/20 transition-all mb-5"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform shadow-md">
                            पे
                          </div>
                          <span className="text-sm font-bold text-[#5f259f]">
                            Open PhonePe App
                          </span>
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                          <div className="h-px bg-gray-200 flex-1" />
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            OR ENTER UPI ID
                          </span>
                          <div className="h-px bg-gray-200 flex-1" />
                        </div>

                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setUpiError("");
                          }}
                          placeholder="e.g. 9876543210@ybl"
                          className={`w-full border-2 ${upiError ? "border-red-400" : "border-gray-200 focus:border-[#5f259f]"} rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-purple-100 transition-all font-semibold text-gray-800`}
                        />
                        {upiError && (
                          <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1">
                            <Info size={10} />
                            {upiError}
                          </p>
                        )}

                        <button
                          onClick={handleVerify}
                          className="w-full mt-4 bg-[#5f259f] hover:bg-[#4a1c7c] active:scale-[0.98] text-white font-black py-4 rounded-2xl transition-all shadow-[0_4px_14px_rgba(95,37,159,0.3)] flex items-center justify-center gap-2 text-sm tracking-wide"
                        >
                          VERIFY & PAY ₹{planDetails?.price}
                        </button>

                        <button
                          onClick={() => setStep(1)}
                          className="mt-4 text-[11px] text-gray-400 hover:text-[#5f259f] font-semibold flex items-center gap-1 transition-colors"
                        >
                          ← Edit details ({user.name})
                        </button>
                      </div>

                      {/* QR Section */}
                      <div className="flex-1 bg-gray-50/50 px-5 md:px-8 py-5 md:py-6 flex flex-col items-center justify-center border-t md:border-t-0 border-gray-100">
                        <div className="flex items-center gap-2 mb-5 text-gray-700">
                          <QrCode size={16} className="text-[#5f259f]" />
                          <h4 className="font-bold text-sm">Scan & Pay</h4>
                        </div>

                        <div className="bg-white p-4 border-2 border-gray-200 rounded-3xl shadow-xl relative group cursor-pointer hover:border-[#5f259f]/40 transition-colors">
                          {[
                            "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-2xl -translate-x-2 -translate-y-2 group-hover:-translate-x-3 group-hover:-translate-y-3",
                            "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-2xl translate-x-2 -translate-y-2 group-hover:translate-x-3 group-hover:-translate-y-3",
                            "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-2xl -translate-x-2 translate-y-2 group-hover:-translate-x-3 group-hover:translate-y-3",
                            "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3",
                          ].map((cls, i) => (
                            <div
                              key={i}
                              className={`absolute w-5 h-5 border-[#5f259f] ${cls} transition-transform duration-300`}
                            />
                          ))}
                          <div className="relative overflow-hidden rounded-2xl">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=6&data=upi://pay?pa=9600290814@ybl&pn=Boxcross&am=${planDetails?.price?.replace(/,/g, "") || 0}`}
                              alt="Scan to Pay"
                              className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] mix-blend-multiply"
                            />
                            <motion.div
                              animate={{ y: [0, 180, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="absolute top-0 left-0 w-full h-0.5 bg-[#5f259f] shadow-[0_0_10px_#5f259f] opacity-70"
                            />
                          </div>
                        </div>

                        <p className="text-gray-400 text-[11px] mt-4 mb-4 text-center leading-relaxed">
                          Scan with any UPI app to pay{" "}
                          <span className="font-black text-gray-800">
                            ₹{planDetails?.price}
                          </span>
                        </p>

                        <button
                          onClick={handleAppPay}
                          className="w-full max-w-[210px] bg-white border-2 border-purple-200 text-[#5f259f] hover:bg-purple-50 hover:border-[#5f259f] font-bold py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 text-[12px] tracking-wide"
                        >
                          <Check size={14} /> I HAVE SCANNED THE QR
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
                      className="py-24 md:py-32 px-8 flex flex-col items-center justify-center text-center bg-white"
                    >
                      <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-gray-100 rounded-full" />
                        <div className="w-24 h-24 border-4 border-[#5f259f] rounded-full border-t-transparent animate-spin absolute top-0 left-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Smartphone
                            size={28}
                            className="text-[#5f259f] animate-pulse"
                          />
                        </div>
                      </div>
                      <h3 className="text-gray-900 font-black text-2xl mb-2">
                        Awaiting Approval
                      </h3>
                      <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
                        {upiId
                          ? `Approve the request in your UPI app for ${upiId}`
                          : "Complete the payment in your UPI app"}
                      </p>
                      <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 4.5, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-[#5f259f] to-[#8b3fcf] rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-5">
                        Do not close this window
                      </p>
                    </motion.div>
                  )}

                  {/* ── SUCCESS ── */}
                  {payState === "success" && (
                    <motion.div
                      key="succ"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-16 md:py-20 px-8 flex flex-col items-center justify-center text-center bg-white"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.1 }}
                        className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-6 relative"
                      >
                        <div className="absolute inset-0 border-4 border-green-400 rounded-full opacity-20 animate-ping" />
                        <CheckCircle2
                          size={54}
                          className="text-green-500 z-10"
                        />
                      </motion.div>
                      <h3 className="text-gray-900 font-black text-2xl md:text-3xl mb-1">
                        Payment Successful!
                      </h3>
                      <p className="text-gray-400 text-sm mb-7">
                        ₹{planDetails?.price} paid to Boxcross Fitness
                      </p>
                      <div className="bg-gray-50 w-full max-w-sm p-5 rounded-2xl border border-gray-200 text-left shadow-sm space-y-3 text-[12px]">
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
                            <span className="font-bold text-gray-900 truncate ml-4 max-w-[180px]">
                              {v}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                          <span className="text-gray-400 font-bold uppercase tracking-wider">
                            Txn ID
                          </span>
                          <span className="font-black text-[#5f259f]">
                            TXN{Math.floor(Math.random() * 1e10)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-7 flex flex-col items-center">
                        <Loader2
                          size={20}
                          className="text-[#5f259f] animate-spin mb-2"
                        />
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                          Redirecting...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {!busy && (
                <div className="border-t border-gray-100 py-3 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold tracking-wide shrink-0 bg-gray-50/50">
                  <ShieldCheck size={12} className="text-green-500" /> 100%
                  SECURE PAYMENTS BY PHONEPE
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PhonePeModal;
