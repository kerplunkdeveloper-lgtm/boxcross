import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBooking } from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  User,
  Phone,
  Dumbbell,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

const BookForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    goal: "",
    day: "",
    month: "",
    time: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: (user.name && user.name.toLowerCase() !== "vasanth") ? user.name : "",
        phone: user.phone || prev.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToBookForm");
    const hasHash = window.location.hash === "#book-your-free-gym-tour";
    if (shouldScroll === "true" || hasHash) {
      sessionStorage.removeItem("scrollToBookForm");
      setTimeout(() => {
        const element = document.getElementById("book-your-free-gym-tour");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }
  }, []);

  const goals = [
    "Weight Loss",
    "Muscle Gain",
    "Strength Training",
    "Fat Burn",
    "Athletic Performance",
    "General Fitness",
  ];

  const validateStep = () => {
    if (step === 1 && !formData.name.trim()) {
      setError("Please enter your name to continue.");
      return false;
    }
    if (
      step === 2 &&
      (!formData.phone.trim() || formData.phone.length !== 10)
    ) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (step === 3 && !formData.goal) {
      setError("Please select a fitness goal.");
      return false;
    }
    if (step === 4 && (!formData.day || !formData.month || !formData.time)) {
      setError("Please select day, month and preferred time.");
      return false;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep() && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setError("");
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      const { data } = await createBooking(formData);

      if (data.success) {
        setShowSuccess(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to server. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="book-your-free-gym-tour"
      className="relative w-full flex  justify-center py-10 overflow-hidden"
    >


      <div className="relative z-10 w-full max-w-5xl mx-4 rounded-[35px] border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* GLOW */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#e5ff00]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 p-5 md:p-10">
          {/* HEADER */}
          <div className="md:text-center">
            <h1
              className="text-white uppercase text-[32px] md:text-[40px] md:text-center"
              style={{
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontWeight: 700,
              }}
            >
              BOOK YOUR FREE <br /><span className="text-[#e5ff00]"> GYM TOUR</span>
            </h1>
          </div>

          {/* STEP BAR */}
          <div className="mt-10 flex items-center justify-between gap-1 md:gap-2 w-full pb-2">
            {["Personal", "Contact", "Goal", "Schedule"].map((item, index) => (
              <div
                key={index}
                className="flex items-center flex-grow last:flex-grow-0"
                style={{
                  fontFamily: '"Brutal Type Light", sans-serif',
                  fontWeight: 500,
                }}
              >
                {/* STEP CARD */}
                <div
                  className={`relative flex items-center justify-center gap-1.5 md:gap-3 px-2.5 md:px-5 h-10 md:h-12 rounded-xl md:rounded-2xl border transition-all duration-500 whitespace-nowrap
                  ${
                    step === index + 1
                      ? "bg-[#e5ff00] border-[#e5ff00] text-black shadow-[0_0_25px_rgba(217,255,0,0.35)]"
                      : step > index + 1
                        ? "bg-white/10 border-white/10 text-white"
                        : "bg-[#0a0a0a] border-white/10 text-gray-500"
                  }`}
                >
                  {/* NUMBER */}
                  <div
                    className={`w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-bold
                    ${
                      step === index + 1
                        ? "bg-black text-[#e5ff00]"
                        : step > index + 1
                          ? "bg-[#e5ff00] text-black"
                          : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {step > index + 1 ? <Check size={11} /> : `0${index + 1}`}
                  </div>

                  {/* TITLE */}
                  <span className="text-[11px] md:text-sm font-semibold tracking-wide uppercase">
                    <span className="hidden md:inline">{item}</span>
                    <span className="inline md:hidden">
                      {step === index + 1 && item}
                    </span>
                  </span>
                </div>

                {/* LINE */}
                {index !== 3 && (
                  <div
                    className={`flex-grow h-[2px] mx-1 md:mx-2 rounded-full transition-all duration-500
                    ${step > index + 1 ? "bg-[#e5ff00]" : "bg-white/10"}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* FORM CARD */}
          <div className="mt-8 rounded-[30px] border border-white/10 bg-[#070707] p-5 md:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-7">
                    <p className="text-[#e5ff00] uppercase tracking-[0.25em] text-[11px] font-semibold mb-3"
                      style={{
                        fontFamily: '"BrutalTypeLight", sans-serif',
                        fontWeight: 500,
                      }}>
                      Step 01
                    </p>

                    <h2 className="text-white text-2xl md:text-3xl font-bold"
                      style={{
                        fontFamily: '"BrutalTypeBold", sans-serif',
                        fontWeight: 700,
                      }}>
                      Your Name
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                      Enter your full name to continue.
                    </p>
                  </div>

                  <div className="relative">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className={`w-full h-14 rounded-xl bg-black border ${error ? "border-red-500" : "border-white/10"} pl-14 pr-5 text-white outline-none focus:border-[#e5ff00] transition-all`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
                  )}
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-7">
                    <p className="text-[#e5ff00] uppercase tracking-[0.25em] text-[11px] font-semibold mb-3">
                      Step 02
                    </p>

                    <h2 className="text-white text-2xl md:text-3xl font-bold">
                      Contact Number
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                      We’ll contact you for confirmation.
                    </p>
                  </div>

                  <div className="relative">
                    <Phone
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) {
                          setFormData({
                            ...formData,
                            phone: val,
                          });
                        }
                      }}
                      className={`w-full h-14 rounded-xl bg-black border ${error ? "border-red-500" : "border-white/10"} pl-14 pr-5 text-white outline-none focus:border-[#e5ff00] transition-all`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
                  )}
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-7">
                    <p className="text-[#e5ff00] uppercase tracking-[0.25em] text-[11px] font-semibold mb-3">
                      Step 03
                    </p>

                    <h2 className="text-white text-2xl md:text-3xl font-bold">
                      Select Goal
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                      Choose your fitness transformation goal.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {goals.map((goal, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            goal,
                          })
                        }
                        className={`h-12 md:h-14 rounded-xl border transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-3 px-2 text-center text-xs md:text-sm font-semibold uppercase tracking-wider
                        ${
                          formData.goal === goal
                            ? "bg-[#e5ff00] text-black border-[#e5ff00]"
                            : error
                              ? "bg-black border-red-500/50 text-white hover:border-red-500"
                              : "bg-black border-white/10 text-white hover:border-[#e5ff00]"
                        }`}
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        <Dumbbell size={14} className="hidden sm:inline" />
                        {goal}
                      </button>
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-3 ml-1">{error}</p>
                  )}
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-7">
                    <p className="text-[#e5ff00] uppercase tracking-[0.25em] text-[11px] font-semibold mb-3">
                      Step 04
                    </p>

                    <h2 className="text-white text-2xl md:text-3xl font-bold">
                      Schedule Visit
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                      Pick your preferred date & time.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {/* DAY */}
                    <div className="relative">
                      <select
                        value={formData.day}
                        onChange={(e) =>
                          setFormData({ ...formData, day: e.target.value })
                        }
                        className={`w-full h-12 md:h-14 rounded-xl bg-black border ${error && !formData.day ? "border-red-500" : "border-white/10"} text-center text-white outline-none focus:border-[#e5ff00] appearance-none cursor-pointer transition-all text-xs md:text-sm`}
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MONTH */}
                    <div className="relative">
                      <select
                        value={formData.month}
                        onChange={(e) =>
                          setFormData({ ...formData, month: e.target.value })
                        }
                        className={`w-full h-12 md:h-14 rounded-xl bg-black border ${error && !formData.month ? "border-red-500" : "border-white/10"} text-center text-white outline-none focus:border-[#e5ff00] appearance-none cursor-pointer transition-all text-xs md:text-sm`}
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m, i) => (
                          <option key={i} value={m}>
                            {m.substring(0, 3)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TIME */}
                    <div className="relative">
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className={`w-full h-12 md:h-14 rounded-xl bg-black border ${error && !formData.time ? "border-red-500" : "border-white/10"} text-center text-white outline-none focus:border-[#e5ff00] appearance-none cursor-pointer transition-all text-xs md:text-sm`}
                      >
                        <option value="" disabled>
                          Time
                        </option>
                        {[
                          "6:00 AM",
                          "7:00 AM",
                          "8:00 AM",
                          "9:00 AM",
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "1:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                          "5:00 PM",
                          "6:00 PM",
                          "7:00 PM",
                          "8:00 PM",
                          "9:00 PM",
                        ].map((t, i) => (
                          <option key={i} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
                  )}

                  {/* SUCCESS */}
                  <div className="mt-7 rounded-2xl border border-[#e5ff00]/20 bg-[#e5ff00]/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#e5ff00] flex items-center justify-center">
                        <Check className="text-black" size={18} />
                      </div>

                      <div>
                        <h3 className="text-white font-semibold">
                          Ready To Book
                        </h3>

                        <p className="text-gray-500 text-sm">
                          Confirm your gym experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BUTTONS */}
            <div className="flex items-center justify-between gap-4 mt-10">
              <button
                onClick={prevStep}
                className={`h-12 md:h-14 px-6 rounded-xl border border-white/10 text-white flex items-center gap-2 transition-all
                ${
                  step === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-[#e5ff00]"
                }`}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              {step !== 4 ? (
                <button
                  onClick={nextStep}
                  className="h-12 md:h-14 px-8 rounded-xl bg-[#e5ff00] text-black font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`h-12 md:h-14 px-8 md:px-10 rounded-xl bg-[#e5ff00] text-black font-black tracking-[0.12em] uppercase transition-all shadow-[0_0_30px_rgba(217,255,0,0.35)] flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
                  style={{
                    fontFamily: '"Bebas Neue", sans-serif',
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      Booking...
                    </>
                  ) : (
                    "Book Your Free Gym Tour"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[30px] p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(217,255,0,0.1)]"
            >
              {/* Glow Behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#e5ff00]/20 blur-[80px] rounded-full"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#e5ff00] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(217,255,0,0.4)]">
                  <Check size={40} className="text-black" strokeWidth={3} />
                </div>

                <h2
                  className="text-white text-4xl md:text-5xl uppercase font-black tracking-wide leading-none mb-4"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  Request <span className="text-[#e5ff00]">Sent</span>
                </h2>

                <p
                  className="text-gray-400 text-sm md:text-base leading-relaxed mb-8"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  Thank you,{" "}
                  <span className="text-white font-bold">{formData.name}</span>!
                  Your gym tour has been booked successfully. Our team will
                  contact you shortly to confirm your visit.
                </p>

                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setStep(1);
                    setFormData({
                      name: "",
                      phone: "",
                      goal: "",
                      day: "",
                      month: "",
                      time: "",
                    });
                    setError("");
                  }}
                  className="w-full h-14 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-[#e5ff00] transition-all duration-300 shadow-xl"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BookForm;
