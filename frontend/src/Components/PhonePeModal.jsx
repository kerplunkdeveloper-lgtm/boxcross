import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Info,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PhonePeModal = ({ isOpen, onClose, planDetails }) => {
  const [paymentState, setPaymentState] = useState("initial"); // initial, processing, success
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPaymentState("initial");
      setUpiId("");
      setUpiError("");
    }
  }, [isOpen]);

  const handleVerifyAndPay = () => {
    if (!upiId || !upiId.includes("@")) {
      setUpiError("Please enter a valid UPI ID (e.g., name@ybl)");
      return;
    }
    setUpiError("");
    setPaymentState("processing");

    setTimeout(() => {
      setPaymentState("success");
      setTimeout(() => {
        onClose();
      }, 4000);
    }, 4500);
  };

  const handleAppPay = () => {
    setPaymentState("processing");
    setTimeout(() => {
      setPaymentState("success");
      setTimeout(() => {
        onClose();
      }, 4000);
    }, 3000);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? "100%" : 30,
      scale: isMobile ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      y: isMobile ? "100%" : 30,
      scale: isMobile ? 1 : 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm"
            onClick={paymentState !== "processing" ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full bg-white md:rounded-2xl rounded-t-2xl md:rounded-b-2xl shadow-2xl overflow-hidden z-10 flex flex-col transition-all duration-300 ${
              paymentState === "initial"
                ? "md:max-w-[700px]"
                : "md:max-w-[400px]"
            } max-h-[85vh]`}
          >
            {/* Header */}
            <div className="bg-[#5f259f] px-5 py-3 md:py-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#5f259f] font-bold text-xl leading-none pt-1 pe-0.5">
                    पे
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] md:text-[12px] tracking-wide leading-tight">
                    PhonePe
                  </span>
                  <span className="text-white/80 text-[10px] uppercase tracking-widest font-medium">
                    Secure Checkout
                  </span>
                </div>
              </div>
              {paymentState !== "processing" && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
              <AnimatePresence mode="wait">
                {paymentState === "initial" && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full"
                  >
                    {/* Amount Header */}
                    <div className="bg-white px-5 py-4 md:py-3 border-b border-gray-100 flex items-center justify-between shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] sticky top-0 z-10">
                      <div className="flex-1 pr-4">
                        <p className="text-gray-500 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mb-0.5">
                          Paying to Boxcross
                        </p>
                        <h3 className="text-gray-900 font-extrabold text-[10px] md:text-[10px] line-clamp-1">
                          {planDetails?.name || "Membership"}
                        </h3>
                      </div>
                      <div className="text-xl md:text-2xl font-black text-gray-900 shrink-0 tracking-tight">
                        ₹{planDetails?.price || "0"}
                      </div>
                    </div>

                    {/* Split View for Desktop, Stacked for Mobile */}
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Left Side: UPI Options */}
                      <div className="flex-1 p-5 md:p-6 md:border-r border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#5f259f] shrink-0">
                            <Smartphone size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">
                              Pay using UPI
                            </h4>
                            <p className="text-[12px] text-gray-500">
                              PhonePe App or UPI ID
                            </p>
                          </div>
                        </div>

                        {/* Direct App Intent */}
                        <div className="mb-5">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                            Open PhonePe App
                          </p>
                          <button
                            onClick={handleAppPay}
                            className="w-full group bg-white border border-purple-200 py-3 rounded-xl flex items-center justify-center gap-3 hover:border-purple-400 hover:shadow-md hover:bg-purple-50/30 transition-all"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[11px] font-bold group-hover:scale-110 transition-transform shadow-sm">
                              पे
                            </div>
                            <span className="text-[13px] font-bold text-[#5f259f]">
                              Pay with PhonePe
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3 my-4">
                          <div className="h-[1px] bg-gray-200 flex-1"></div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            OR
                          </span>
                          <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>

                        {/* UPI ID Input */}
                        <div className="mb-2">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                            Pay using UPI ID
                          </p>
                          <div className="relative">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setUpiError("");
                              }}
                              placeholder="e.g. 9876543210@ybl"
                              className={`w-full bg-white border ${upiError ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-[#5f259f] focus:ring-purple-100"} rounded-xl px-4 py-3 text-[13px] outline-none transition-all focus:ring-4 text-gray-800 font-semibold shadow-sm`}
                            />
                            {upiError && (
                              <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] text-red-500 font-medium">
                                <Info size={10} /> {upiError}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={handleVerifyAndPay}
                            className="w-full mt-6 bg-[#5f259f] hover:bg-[#4a1c7c] active:bg-[#3b1563] text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(95,37,159,0.39)] hover:shadow-[0_6px_20px_rgba(95,37,159,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-[13px] tracking-wide"
                          >
                            VERIFY & PAY ₹{planDetails?.price || "0"}
                          </button>
                        </div>
                      </div>

                      {/* Right Side: QR Code */}
                      <div className="flex-1 bg-[#f8f9fa] p-5 md:p-6 flex flex-col items-center justify-center relative">
                        {/* Mobile separator if needed */}
                        <div className="md:hidden w-full flex items-center gap-3 mb-6">
                          <div className="h-[1px] bg-gray-200 flex-1"></div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            SCAN QR CODE
                          </span>
                          <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 mb-4 text-gray-800">
                          <QrCode size={18} className="text-[#5f259f]" />
                          <h4 className="font-bold text-[14px]">Scan to Pay</h4>
                        </div>

                        <div className="bg-white p-3 border border-gray-200 rounded-2xl shadow-lg relative group">
                          {/* Animated Corners */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-[4px] border-l-[4px] border-[#5f259f] rounded-tl-2xl -translate-x-2 -translate-y-2 transition-transform group-hover:-translate-x-3 group-hover:-translate-y-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-[4px] border-r-[4px] border-[#5f259f] rounded-tr-2xl translate-x-2 -translate-y-2 transition-transform group-hover:translate-x-3 group-hover:-translate-y-3"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[4px] border-l-[4px] border-[#5f259f] rounded-bl-2xl -translate-x-2 translate-y-2 transition-transform group-hover:-translate-x-3 group-hover:translate-y-3"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[4px] border-r-[4px] border-[#5f259f] rounded-br-2xl translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>

                          <div className="relative overflow-hidden rounded-xl">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=5&data=upi://pay?pa=9600290814@ybl&pn=Boxcross&am=${planDetails?.price?.replace(/,/g, "") || 0}`}
                              alt="Payment QR Code"
                              className="w-[150px] h-[150px] md:w-[160px] md:h-[160px] mix-blend-multiply"
                            />
                            {/* Scanning line animation */}
                            <motion.div
                              animate={{ y: [0, 160, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="absolute top-0 left-0 w-full h-1 bg-[#5f259f] shadow-[0_0_10px_#5f259f] opacity-70"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5f259f]/5 to-transparent h-1/2 w-full animate-pulse"></div>
                          </div>
                        </div>

                        <p className="text-gray-500 font-medium text-[12px] mt-5 mb-6 text-center max-w-[180px] leading-snug">
                          Scan with PhonePe or any UPI app to pay{" "}
                          <span className="font-bold text-gray-900">
                            ₹{planDetails?.price}
                          </span>
                        </p>

                        <button
                          onClick={handleAppPay}
                          className="w-full max-w-[200px] bg-white border-2 border-purple-200 text-[#5f259f] hover:bg-purple-50 hover:border-purple-300 font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-[11px] tracking-wide"
                        >
                          I HAVE SCANNED THE QR
                        </button>
                      </div>
                    </div>

                    {/* Bottom Security Banner */}
                    <div className="bg-gray-50 border-t border-gray-100 py-3 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold tracking-wide">
                      <ShieldCheck size={14} className="text-green-500" />
                      <span>100% SECURE PAYMENTS BY PHONEPE</span>
                    </div>
                  </motion.div>
                )}

                {/* Processing State */}
                {paymentState === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-20 md:py-32 px-6 flex flex-col items-center justify-center text-center bg-white h-full"
                  >
                    <div className="relative mb-10">
                      <div className="w-24 h-24 border-[3px] border-gray-100 rounded-full"></div>
                      <div className="w-24 h-24 border-[3px] border-[#5f259f] rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Smartphone
                          size={28}
                          className="text-[#5f259f] animate-pulse"
                        />
                      </div>
                    </div>

                    <h3 className="text-gray-900 font-extrabold text-[20px] md:text-[24px] mb-3 tracking-tight">
                      Awaiting Approval
                    </h3>
                    <p className="text-gray-500 text-[14px] md:text-[15px] mb-10 max-w-[320px] leading-relaxed">
                      {upiId
                        ? `Please open your UPI app for ${upiId} to approve the payment of ₹${planDetails?.price}`
                        : `Please complete the payment of ₹${planDetails?.price} on your UPI app.`}
                    </p>

                    <div className="w-full max-w-[240px] bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.5, ease: "linear" }}
                        className="h-full bg-[#5f259f] rounded-full"
                      />
                    </div>

                    <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">
                      Do not close or refresh this window
                    </p>
                  </motion.div>
                )}

                {/* Success State */}
                {paymentState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 md:py-24 px-6 flex flex-col items-center justify-center text-center bg-white h-full"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, delay: 0.1 }}
                      className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 relative"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="absolute inset-0 border-[4px] border-green-400 rounded-full opacity-20 animate-ping"
                      />
                      <CheckCircle2
                        size={56}
                        className="text-green-500 relative z-10"
                      />
                    </motion.div>

                    <h3 className="text-gray-900 font-extrabold text-[26px] md:text-[30px] mb-2 tracking-tight">
                      Payment Successful
                    </h3>
                    <p className="text-gray-500 text-[15px] font-medium mb-10">
                      ₹{planDetails?.price} paid securely to Boxcross
                    </p>

                    <div className="bg-[#f8f9fa] w-full max-w-sm p-5 md:p-6 rounded-2xl border border-gray-100 text-left shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                          Transaction ID
                        </span>
                        <span className="text-gray-900 font-bold text-[14px]">
                          TID{Math.floor(Math.random() * 10000000000)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                          Paid To
                        </span>
                        <span className="text-gray-900 font-bold text-[14px]">
                          Boxcross Fitness
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 border-dashed">
                        <span className="text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                          Item
                        </span>
                        <span className="text-[#5f259f] font-extrabold text-[15px] truncate ml-4">
                          {planDetails?.name}
                        </span>
                      </div>
                    </div>

                    <div className="mt-10 flex flex-col items-center justify-center">
                      <Loader2
                        size={24}
                        className="text-[#5f259f] animate-spin mb-3"
                      />
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">
                        Redirecting to application...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PhonePeModal;
