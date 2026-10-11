import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  MessageCircle,
  Check,
  Flame,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { createMemfound, checkMemfoundPhone } from "../api/api";

const Memfound = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    boxcrossConnection: "", // "I'm a current member" | "I've trained here before" | "I'm new to Box & Cross"
    trainedBefore: "",
    whoIsThisFor: "", // "MYSELF" | "MY CHILD" | "BOTH"
    mainGoal: "", // "Boxing skills" | "Strength and conditioning" | "General fitness" | "Competition preparation" | "Not sure yet"
    plan: "", // "3 MONTHS" | "6 MONTHS" | "12 MONTHS" | "NOT SURE YET"
    bestTimeToCall: "", // "MORNING" | "AFTERNOON" | "EVENING"
  });

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isFormInView, setIsFormInView] = useState(false);
  const [phoneExistsWarning, setPhoneExistsWarning] = useState(null);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  // URL & Navigation Restriction: once inside /memfound, user cannot navigate away to other paths
  useEffect(() => {
    sessionStorage.setItem("lock_to_memfound", "true");

    // Push state and trap browser back/forward buttons on /memfound
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Monitor when the form is visible to show/hide the floating mobile CTA
  useEffect(() => {
    const handleScroll = () => {
      const formEl = document.getElementById("register-form");
      if (!formEl) return;
      const rect = formEl.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.75) {
        setIsFormInView(true);
      } else {
        setIsFormInView(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time WhatsApp number uniqueness check when 10 digits are filled
  useEffect(() => {
    const cleanPhone = formData.whatsappNumber.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      let isMounted = true;
      setIsCheckingPhone(true);
      checkMemfoundPhone(cleanPhone)
        .then((res) => {
          if (!isMounted) return;
          if (res.data?.exists) {
            setPhoneExistsWarning(res.data);
            toast.error(
              `This WhatsApp number is already registered (${res.data.memberId || "#001"})!`
            );
          } else {
            setPhoneExistsWarning(null);
          }
        })
        .catch(() => {
          if (isMounted) setPhoneExistsWarning(null);
        })
        .finally(() => {
          if (isMounted) setIsCheckingPhone(false);
        });
      return () => {
        isMounted = false;
      };
    } else {
      setPhoneExistsWarning(null);
    }
  }, [formData.whatsappNumber]);

  // Smooth scroll to form on mobile or desktop
  const scrollToForm = () => {
    const formEl = document.getElementById("register-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const input = document.getElementById("memfound-name");
        if (input) input.focus();
      }, 500);
    }
  };

  // Field change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle selection for choice buttons
  const handleChoiceSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const cleanPhone = formData.whatsappNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    if (phoneExistsWarning) {
      toast.error(
        `This WhatsApp number is already registered under Member ID ${
          phoneExistsWarning.memberId || "#001"
        }! We already have your interest on file.`
      );
      return;
    }

    if (!formData.boxcrossConnection) {
      toast.error("Please select your connection with Box & Cross");
      return;
    }

    if (!formData.whoIsThisFor) {
      toast.error("Please select who this is for");
      return;
    }

    if (!formData.plan) {
      toast.error("Please select a plan that interests you");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to be contacted on WhatsApp and phone");
      return;
    }

    setIsSubmitting(true);

    try {
      const isPriorMember =
        formData.boxcrossConnection === "I'm a current member" ||
        formData.boxcrossConnection === "I've trained here before";

      const payload = {
        name: formData.name.trim(),
        whatsappNumber: cleanPhone.slice(-10),
        boxcrossConnection: formData.boxcrossConnection,
        trainedBefore: isPriorMember ? "YES" : "NO",
        whoIsThisFor: formData.whoIsThisFor,
        mainGoal: formData.mainGoal,
        plan: formData.plan,
        bestTimeToCall: formData.bestTimeToCall,
        agreedToContact: agreed,
      };

      const res = await createMemfound(payload);

      if (res.data?.success) {
        toast.success("Interest registered successfully!");
        setSubmittedData({
          ...payload,
          id: res.data?.data?._id,
          memberId: res.data?.data?.memberId || "#001",
          memberNumber: res.data?.data?.memberNumber || 1,
          assignedNumber: res.data?.data?.assignedNumber,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.data?.message || "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      if (error.response?.data?.alreadyRegistered) {
        setPhoneExistsWarning({
          exists: true,
          message: error.response?.data?.message,
          memberId: error.response?.data?.memberId,
        });
      }
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to submit another request (stays on /memfound)
  const handleReset = () => {
    setFormData({
      name: "",
      whatsappNumber: "",
      boxcrossConnection: "",
      trainedBefore: "",
      whoIsThisFor: "",
      mainGoal: "",
      plan: "",
      bestTimeToCall: "",
    });
    setAgreed(false);
    setPhoneExistsWarning(null);
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-start py-8 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#ccf141] selection:text-black">
      <Helmet>
        <title>Founding Member | Box &amp; Cross Performance Arena</title>
        <meta
          name="description"
          content="100 Founding Memberships. The gym you trained in closed on 10 October. What opens next is ten thousand square feet of it."
        />
        <meta
          property="og:title"
          content="Founding Member | Box &amp; Cross Performance Arena"
        />
        <meta
          property="og:description"
          content="100 Founding Memberships. Numbered in the order they are claimed. Register your interest now."
        />
      </Helmet>

      {/* ============================================================ */}
      {/* ATMOSPHERIC BACKGROUND SPOTLIGHTS & TEXTURES */}
      {/* ============================================================ */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(204,241,65,0.16),transparent)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(204,241,65,0.035)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(204,241,65,0.04)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_60%,transparent_100%)] opacity-80"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {!submittedData ? (
          <div className="space-y-14 sm:space-y-20">
            {/* ============================================================ */}
            {/* SECTION 1: HERO & FOUNDING MEMBER INTRO */}
            {/* ============================================================ */}
            <div className="max-w-3xl mx-auto space-y-7 sm:space-y-8">
              {/* Tactical Status Pill */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccf141] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccf141]"></span>
                  </span>
                  <span
                    className="text-[#ccf141] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] select-none"
                    style={{ fontFamily: '"BrutalTypeBold", monospace' }}
                  >
                    BOX &amp; CROSS PERFORMANCE ARENA
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ccf141]/10 border border-[#ccf141]/30 text-[10px] font-mono font-bold tracking-widest text-[#ccf141] uppercase">
                  EXCLUSIVE RELEASE
                </span>
              </div>

              {/* Massive Bold Headline */}
              <div className="relative">
                <h1
                  className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.88] select-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily:
                      '"BrutalTypeBold", "Brutal Font Bold", Inter, sans-serif',
                  }}
                >
                  FOUNDING
                  <br />
                  <span className="text-[#ccf141] drop-shadow-[0_0_35px_rgba(204,241,65,0.45)]">
                    MEMBER
                  </span>
                </h1>
              </div>

              {/* Intro Narrative Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950/90 via-zinc-900/40 to-zinc-950/90 border border-zinc-800/80 border-l-4 border-l-[#ccf141] p-5 sm:p-6 backdrop-blur-md shadow-2xl">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(204,241,65,0.04)_1px,transparent_1px)] [background-size:16px_16px]"
                  aria-hidden="true"
                />
                <div className="relative z-10 space-y-2.5 text-sm sm:text-[15px] leading-relaxed">
                  <p className="text-zinc-200">
                    The gym you trained in closed on 10 October.{" "}
                    <strong className="text-white font-extrabold underline decoration-[#ccf141]/50 underline-offset-4">
                      What opens next is ten thousand square feet of it.
                    </strong>
                  </p>
                  <p className="text-zinc-400">
                    Our existing members get first access, and whatever time is
                    left on your current membership comes with you.
                  </p>
                </div>
              </div>

              {/* 100 Memberships Neon Highlight Box */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#ccf141] bg-gradient-to-br from-[#0c0c0c] via-[#070707] to-[#020202] p-5 sm:p-7 shadow-[0_0_40px_rgba(204,241,65,0.18)] transition-all hover:shadow-[0_0_55px_rgba(204,241,65,0.3)] group">
                <div
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(204,241,65,0.03),rgba(204,241,65,0.03)_1px,transparent_1px,transparent_14px)]"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className="text-5xl sm:text-6xl md:text-7xl font-black text-[#ccf141] tracking-tighter leading-none select-none drop-shadow-[0_0_20px_rgba(204,241,65,0.5)]"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      100
                    </span>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ccf141]/15 text-[#ccf141] text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                        <Flame size={11} />
                        LIMITED RELEASE
                      </div>
                      <div
                        className="text-white font-black text-xs sm:text-sm uppercase tracking-wider leading-tight"
                        style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                      >
                        FOUNDING MEMBERSHIPS
                      </div>
                      <div className="text-zinc-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-0.5">
                        REGISTRATION CLOSES 31 OCTOBER
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ccf141] hover:bg-[#d8fa4f] active:scale-[0.98] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(204,241,65,0.4)] hover:shadow-[0_0_30px_rgba(204,241,65,0.6)]"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    <span>CLAIM SPOT</span>
                    <ArrowDown size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 2: WHAT YOU ARE WALKING INTO (Pixel-Perfect Match Image 2) */}
            {/* ============================================================ */}
            <div className="space-y-6 sm:space-y-8">
              {/* Eyebrow: — BUILT FOR REAL WORK — */}
              <div className="flex items-center justify-center gap-3 sm:gap-5">
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#ccf141]/60" />
                <span
                  className="text-[#ccf141] text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] uppercase select-none"
                  style={{ fontFamily: '"BrutalTypeBold", monospace' }}
                >
                  BUILT FOR REAL WORK
                </span>
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#ccf141]/60" />
              </div>

              {/* Big Centered Headline: WHAT YOU ARE WALKING INTO */}
              <h2
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-center select-none text-white leading-tight"
                style={{
                  fontFamily:
                    '"BrutalTypeBold", "Brutal Font Bold", Inter, sans-serif',
                }}
              >
                WHAT YOU ARE <span className="text-[#ccf141]">WALKING INTO</span>
              </h2>

              {/* 2x2 Responsive Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-2">
                {/* 01: PRO RING */}
                <div className="relative overflow-hidden rounded-md sm:rounded-lg border border-zinc-800/90 hover:border-[#ccf141]/70 bg-black min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center p-6 sm:p-8 md:p-10 transition-all duration-300 group">
                  <img
                    src="/bxc_pro_ring.jpg"
                    alt="Pro Ring"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                    loading="lazy"
                  />
                  {/* Dark Left Gradient for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/80 to-black/35" />

                  {/* Left Content */}
                  <div className="relative z-10 max-w-sm">
                    {/* Outlined Number 01 — */}
                    <div className="flex items-center">
                      <span
                        className="text-4xl sm:text-5xl md:text-6xl font-black font-mono leading-none select-none text-transparent"
                        style={{
                          WebkitTextStroke: "1.5px #ccf141",
                          fontFamily: '"BrutalTypeBold", monospace',
                        }}
                      >
                        01
                      </span>
                      <span className="inline-block w-8 sm:w-12 h-[2px] bg-[#ccf141] ml-3" />
                    </div>

                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-3.5 mb-2 leading-tight"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      PRO <span className="text-[#ccf141]">RING</span>
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      A full international competition ring, not a mat with ropes around it.
                    </p>
                  </div>
                </div>

                {/* 02: THE BAG FLOOR */}
                <div className="relative overflow-hidden rounded-md sm:rounded-lg border border-zinc-800/90 hover:border-[#ccf141]/70 bg-black min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center p-6 sm:p-8 md:p-10 transition-all duration-300 group">
                  <img
                    src="/bxc_bag_floor.jpg"
                    alt="The Bag Floor"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/80 to-black/35" />

                  <div className="relative z-10 max-w-sm">
                    <div className="flex items-center">
                      <span
                        className="text-4xl sm:text-5xl md:text-6xl font-black font-mono leading-none select-none text-transparent"
                        style={{
                          WebkitTextStroke: "1.5px #ccf141",
                          fontFamily: '"BrutalTypeBold", monospace',
                        }}
                      >
                        02
                      </span>
                      <span className="inline-block w-8 sm:w-12 h-[2px] bg-[#ccf141] ml-3" />
                    </div>

                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-3.5 mb-2 leading-tight"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      THE <span className="text-[#ccf141]">BAG FLOOR</span>
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      Heavy, speed, uppercut and giant bags. Every bag a boxer needs.
                    </p>
                  </div>
                </div>

                {/* 03: 10,000 SQ FT */}
                <div className="relative overflow-hidden rounded-md sm:rounded-lg border border-zinc-800/90 hover:border-[#ccf141]/70 bg-black min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center p-6 sm:p-8 md:p-10 transition-all duration-300 group">
                  <img
                    src="/bxc_10000_sqft.jpg"
                    alt="10,000 Sq Ft"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/80 to-black/35" />

                  <div className="relative z-10 max-w-sm">
                    <div className="flex items-center">
                      <span
                        className="text-4xl sm:text-5xl md:text-6xl font-black font-mono leading-none select-none text-transparent"
                        style={{
                          WebkitTextStroke: "1.5px #ccf141",
                          fontFamily: '"BrutalTypeBold", monospace',
                        }}
                      >
                        03
                      </span>
                      <span className="inline-block w-8 sm:w-12 h-[2px] bg-[#ccf141] ml-3" />
                    </div>

                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-[#ccf141] mt-3.5 mb-2 leading-tight"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      10,000 SQ FT
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      Boxing floor, strength floor and conditioning space, under one roof.
                    </p>
                  </div>
                </div>

                {/* 04: REAL COACHES */}
                <div className="relative overflow-hidden rounded-md sm:rounded-lg border border-zinc-800/90 hover:border-[#ccf141]/70 bg-black min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center p-6 sm:p-8 md:p-10 transition-all duration-300 group">
                  <img
                    src="/bxc_real_coaches.jpg"
                    alt="Real Coaches"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/80 to-black/35" />

                  <div className="relative z-10 max-w-sm">
                    <div className="flex items-center">
                      <span
                        className="text-4xl sm:text-5xl md:text-6xl font-black font-mono leading-none select-none text-transparent"
                        style={{
                          WebkitTextStroke: "1.5px #ccf141",
                          fontFamily: '"BrutalTypeBold", monospace',
                        }}
                      >
                        04
                      </span>
                      <span className="inline-block w-8 sm:w-12 h-[2px] bg-[#ccf141] ml-3" />
                    </div>

                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-3.5 mb-2 leading-tight"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      REAL <span className="text-[#ccf141]">COACHES</span>
                    </h3>
                    <p className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      Coached sessions under Coach Prabagaran. Not a room you let yourself into.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 3: WHAT A FOUNDING MEMBER GETS */}
            {/* ============================================================ */}
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#ccf141] tracking-widest uppercase font-bold block">
                    // UNRESTRICTED FOUNDER PRIVILEGES
                  </span>
                  <h2
                    className="text-base sm:text-lg font-black uppercase tracking-[0.16em] text-white"
                    style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                  >
                    WHAT A FOUNDING MEMBER GETS
                  </h2>
                </div>
                <Zap size={16} className="text-[#ccf141] opacity-70" />
              </div>

              {/* VIP Card Container */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e0e0e] to-[#050505] border border-zinc-800/90 p-5 sm:p-8 shadow-2xl">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:18px_18px]"
                  aria-hidden="true"
                />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800/80">
                    <div className="w-5 h-5 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#ccf141] shadow-[0_0_10px_rgba(204,241,65,0.2)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      <strong className="text-white font-extrabold">
                        Your remaining membership carried over in full
                      </strong>{" "}
                      — whatever months you have left come with you, free.
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800/80">
                    <div className="w-5 h-5 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#ccf141] shadow-[0_0_10px_rgba(204,241,65,0.2)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      <strong className="text-white font-extrabold">The founding rate</strong>,
                      held for your whole term. Choose three, six or twelve months.
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800/80">
                    <div className="w-5 h-5 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#ccf141] shadow-[0_0_10px_rgba(204,241,65,0.2)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      <strong className="text-white font-extrabold">Two sessions with Coach Prabagaran</strong>,
                      one to one.
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800/80">
                    <div className="w-5 h-5 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#ccf141] shadow-[0_0_10px_rgba(204,241,65,0.2)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      <strong className="text-white font-extrabold">Four guest passes</strong>{" "}
                      for friends and family.
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800/80">
                    <div className="w-5 h-5 rounded-md bg-[#ccf141]/10 border border-[#ccf141]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#ccf141] shadow-[0_0_10px_rgba(204,241,65,0.2)]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-zinc-300 text-xs sm:text-[13.5px] leading-relaxed">
                      <strong className="text-white font-extrabold">Joining fee waived</strong>,
                      and your name and number on the Founding Wall.
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-[#ccf141]/10 border border-[#ccf141]/30 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[#ccf141] shrink-0" />
                  <p className="text-zinc-300 text-[11px] sm:text-xs leading-relaxed font-medium">
                    One hundred founding memberships, numbered in the order they are claimed. We will not run this offer again.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full py-4.5 bg-[#ccf141] hover:bg-[#d8fa4f] active:scale-[0.99] text-black font-black uppercase tracking-[0.18em] text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(204,241,65,0.3)] hover:shadow-[0_0_40px_rgba(204,241,65,0.5)] flex items-center justify-center gap-2"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <span>REGISTER YOUR INTEREST BELOW</span>
                  <ArrowDown size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 4: FORM VIEW */}
            {/* ============================================================ */}
            <div
              id="register-form"
              className="max-w-6xl mx-auto scroll-mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0c0c0c] via-[#070707] to-[#020202] border border-zinc-800/90 p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >

              <div className="mb-8">
                <h2
                  className="text-2xl sm:text-3xl font-black uppercase text-white tracking-[0.06em] select-none"
                  style={{
                    fontFamily:
                      '"BrutalTypeBold", "Brutal Font Bold", Inter, sans-serif',
                  }}
                >
                  REGISTER YOUR INTEREST
                </h2>
                <div className="w-full h-[1px] bg-zinc-800/80 mt-3 mb-3.5" />
                <p className="text-zinc-400 text-sm sm:text-[14.5px] leading-relaxed font-normal">
                  Seven questions. We call you back within 24 hours with your number and your rate — nothing is charged here.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Q1: YOUR NAME */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="memfound-name"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      1. YOUR NAME
                    </label>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q1</span>
                  </div>
                  <input
                    id="memfound-name"
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800/90 hover:border-zinc-700 focus:border-[#ccf141] focus:ring-1 focus:ring-[#ccf141]/30 text-white placeholder-zinc-600 px-4 py-3.5 text-sm rounded-xl outline-none transition-all shadow-inner"
                    autoComplete="name"
                  />
                </div>

                {/* Q2: WHATSAPP NUMBER */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="memfound-whatsapp"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      2. WHATSAPP NUMBER
                    </label>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q2</span>
                  </div>
                  <div
                    className={`flex items-center w-full bg-[#121212] border rounded-xl overflow-hidden transition-all shadow-inner group ${
                      phoneExistsWarning
                        ? "border-amber-500/80 ring-1 ring-amber-500/30"
                        : "border-zinc-800/90 hover:border-zinc-700 focus-within:border-[#ccf141] focus-within:ring-1 focus-within:ring-[#ccf141]/30"
                    }`}
                  >
                    {/* Country Code Prefix */}
                    <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-zinc-900/90 border-r border-zinc-800 text-zinc-300 font-mono text-xs sm:text-sm font-bold select-none shrink-0 group-focus-within:border-[#ccf141]/40">
                      <span className="text-sm leading-none" role="img" aria-label="India flag">🇮🇳</span>
                      <span className="text-white font-bold tracking-wider font-mono">+91</span>
                    </div>

                    {/* Phone Number Input */}
                    <input
                      id="memfound-whatsapp"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={formData.whatsappNumber}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        // If pasted with country code 91 (e.g. 919876543210), strip the leading 91
                        const finalDigits =
                          raw.length > 10 && raw.startsWith("91")
                            ? raw.slice(2, 12)
                            : raw.slice(0, 10);
                        handleInputChange("whatsappNumber", finalDigits);
                      }}
                      className="w-full bg-transparent text-white placeholder-zinc-600 px-3.5 py-3.5 text-sm sm:text-base outline-none font-mono tracking-wider"
                      autoComplete="tel"
                    />

                    {/* Live Digit Counter / Indicator */}
                    <div className="pr-3.5 flex items-center shrink-0">
                      {isCheckingPhone ? (
                        <Loader2 size={14} className="animate-spin text-zinc-400" />
                      ) : phoneExistsWarning ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold tracking-wider border border-amber-500/40">
                          ⚠ ALREADY REGISTERED
                        </span>
                      ) : formData.whatsappNumber.length === 10 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ccf141]/15 text-[#ccf141] text-[10px] font-mono font-bold tracking-wider border border-[#ccf141]/30">
                          ✓ 10 DIGITS
                        </span>
                      ) : formData.whatsappNumber.length > 0 ? (
                        <span className="text-[10px] font-mono text-zinc-500 font-bold">
                          {formData.whatsappNumber.length}/10
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Warning Message Box if Already Registered */}
                  {phoneExistsWarning && (
                    <div className="mt-2.5 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/40 flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-200 shadow-lg">
                      <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div
                          className="text-amber-300 font-black uppercase tracking-wider flex items-center gap-2"
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span>ALREADY REGISTERED NUMBER</span>
                          {phoneExistsWarning.memberId && (
                            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] border border-amber-400/30 font-bold">
                              {phoneExistsWarning.memberId}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-300 text-[11.5px] leading-relaxed">
                          This WhatsApp number is already registered in our Founding Member queue. We already have your interest on file and our team will contact you within 24 hours.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Q3: YOUR CONNECTION WITH BOX & CROSS* */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      3. YOUR CONNECTION WITH BOX &amp; CROSS<span className="text-[#ccf141] ml-0.5">*</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q3</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "I'm a current member",
                      "I've trained here before",
                      "I'm new to Box & Cross",
                    ].map((option) => {
                      const isSelected = formData.boxcrossConnection === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleChoiceSelect("boxcrossConnection", option)
                          }
                          className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-start gap-3.5 text-left ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                              : "bg-[#121212] text-zinc-300 border-zinc-800/90 hover:border-zinc-600 hover:bg-[#181818]"
                          }`}
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "border-black bg-black"
                                : "border-zinc-500 bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white block" />
                            )}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q4: WHO IS THIS FOR? */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      4. WHO IS THIS FOR?
                    </span>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q4</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["MYSELF", "MY CHILD", "BOTH"].map((option) => {
                      const isSelected = formData.whoIsThisFor === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleChoiceSelect("whoIsThisFor", option)
                          }
                          className={`py-3 px-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]"
                              : "bg-[#121212] text-zinc-300 border-zinc-800/90 hover:border-zinc-600 hover:bg-[#181818]"
                          }`}
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q5: YOUR MAIN TRAINING GOAL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      5. YOUR MAIN TRAINING GOAL
                    </span>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q5</span>
                  </div>
                  <p className="text-zinc-500 text-xs mb-2.5">
                    Optional
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "Boxing skills",
                      "Strength and conditioning",
                      "General fitness",
                      "Competition preparation",
                      "Not sure yet",
                    ].map((option) => {
                      const isSelected = formData.mainGoal === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleChoiceSelect("mainGoal", option)}
                          className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-start gap-3.5 text-left ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                              : "bg-[#121212] text-zinc-300 border-zinc-800/90 hover:border-zinc-600 hover:bg-[#181818]"
                          }`}
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "border-black bg-black"
                                : "border-zinc-500 bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white block" />
                            )}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q6: WHICH PLAN ARE YOU INTERESTED IN? */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      6. WHICH PLAN ARE YOU INTERESTED IN?
                    </span>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q6</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "3 MONTHS",
                      "6 MONTHS",
                      "12 MONTHS",
                      "NOT SURE YET",
                    ].map((option) => {
                      const isSelected = formData.plan === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleChoiceSelect("plan", option)}
                          className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-2 ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]"
                              : "bg-[#121212] text-zinc-300 border-zinc-800/90 hover:border-zinc-600 hover:bg-[#181818]"
                          }`}
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q7: BEST TIME TO CALL (OPTIONAL) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      7. BEST TIME TO CALL{" "}
                      <span className="text-zinc-500 font-normal text-[11px]">
                        (OPTIONAL)
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-[#ccf141]">Q7</span>
                  </div>
                  <p className="text-zinc-500 text-xs mb-3">
                    We will call once to confirm your number and rate.
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["MORNING", "AFTERNOON", "EVENING"].map((option) => {
                      const isSelected = formData.bestTimeToCall === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleChoiceSelect("bestTimeToCall", option)
                          }
                          className={`py-3 px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]"
                              : "bg-[#121212] text-zinc-300 border-zinc-800/90 hover:border-zinc-600 hover:bg-[#181818]"
                          }`}
                          style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="memfound-agree"
                    className="flex items-start gap-3 cursor-pointer select-none group p-3 rounded-xl bg-[#121212]/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    <input
                      id="memfound-agree"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#ccf141] cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed">
                      I agree to be contacted on WhatsApp and phone regarding
                      the Box &amp; Cross Founding Membership.
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-[#ccf141] hover:bg-[#d8fa4f] active:scale-[0.99] text-black font-black uppercase tracking-[0.18em] text-sm sm:text-base rounded-xl transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(204,241,65,0.35)] hover:shadow-[0_0_50px_rgba(204,241,65,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                    style={{
                      fontFamily: '"BrutalTypeBold", "Brutal Font Bold", sans-serif',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-black" />
                        <span>REGISTERING ALLOCATION...</span>
                      </>
                    ) : (
                      <>
                        <span>CLAIM MY FOUNDING NUMBER</span>
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SUCCESS CONFIRMATION VIEW (No External Navigation Routes) */
          /* ============================================================ */
          <div className="max-w-2xl mx-auto relative overflow-hidden rounded-3xl border-2 border-[#ccf141] bg-gradient-to-b from-[#0c0c0c] via-[#050505] to-[#000000] p-8 sm:p-12 md:p-14 shadow-[0_0_70px_rgba(204,241,65,0.25)] text-left animate-in fade-in duration-300">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ccf14112_1px,transparent_1px)] [background-size:18px_18px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-[#ccf141]/20 rounded-full blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <span
                className="text-[#ccf141] text-xs sm:text-sm font-black uppercase tracking-[0.3em] block select-none"
                style={{ fontFamily: '"BrutalTypeBold", monospace' }}
              >
                YOU ARE IN
              </span>

              {/* GIANT MEMBER NUMBER: #001 */}
              <div
                className="text-7xl sm:text-8xl md:text-9xl font-black text-[#ccf141] tracking-tight leading-none my-6 sm:my-8 select-all drop-shadow-[0_0_40px_rgba(204,241,65,0.5)]"
                style={{
                  fontFamily: '"BrutalTypeBold", "Brutal Font Bold", sans-serif',
                }}
              >
                {submittedData.memberId ||
                  (submittedData.memberNumber
                    ? `#${String(submittedData.memberNumber).padStart(3, "0")}`
                    : submittedData.assignedNumber || "#001")}
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4"
                style={{
                  fontFamily: '"BrutalTypeBold", "Brutal Font Bold", sans-serif',
                }}
              >
                THANK YOU, {submittedData.name}.
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base md:text-[17px] leading-relaxed mb-6 font-normal">
                Your enquiry is logged. Someone from the arena calls you on{" "}
                <strong className="text-white font-bold font-mono">
                  {submittedData.whatsappNumber}
                </strong>{" "}
                within 24 hours with your founding number and your rate.
              </p>

              <p className="text-zinc-500 text-xs sm:text-[13px] leading-relaxed mb-8 pt-4 border-t border-zinc-800/80">
                If you trained with us before, bring nothing — we already have your
                remaining months on file.
              </p>

              {/* Digital Member Allocation Pass Card */}
              <div className="bg-[#101010]/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-8 text-xs font-mono space-y-3 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-zinc-400">
                  <span className="uppercase text-[11px] tracking-wider text-zinc-500 font-bold">
                    OFFICIAL ALLOCATION TICKET
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30 font-bold">
                    <CheckCircle2 size={12} />
                    VERIFIED #001-100
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500 uppercase">Allocated ID</span>
                  <span className="text-[#ccf141] font-bold text-sm">
                    {submittedData.memberId ||
                      (submittedData.memberNumber
                        ? `#${String(submittedData.memberNumber).padStart(3, "0")}`
                        : "#001")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500 uppercase">Member Name</span>
                  <span className="text-white font-bold font-sans uppercase">
                    {submittedData.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500 uppercase">WhatsApp</span>
                  <span className="text-white font-bold">
                    +91 {submittedData.whatsappNumber}
                  </span>
                </div>
                {submittedData.boxcrossConnection ? (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500 uppercase">Connection</span>
                    <span className="text-white font-bold">
                      {submittedData.boxcrossConnection}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500 uppercase">Trained Before</span>
                    <span className="text-white font-bold">
                      {submittedData.trainedBefore}
                    </span>
                  </div>
                )}
                {submittedData.mainGoal && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500 uppercase">Main Goal</span>
                    <span className="text-[#ccf141] font-bold">
                      {submittedData.mainGoal}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500 uppercase">Plan Interest</span>
                  <span className="text-[#ccf141] font-bold">
                    {submittedData.plan}
                  </span>
                </div>
                {submittedData.bestTimeToCall && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500 uppercase">Best Time To Call</span>
                    <span className="text-white font-bold">
                      {submittedData.bestTimeToCall}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions - Kept exclusively inside /memfound */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-zinc-700/80 transition-colors cursor-pointer text-center"
                >
                  Register Another Member
                </button>
                <a
                  href={`https://wa.me/918925556900?text=Hi%20Box%20%26%20Cross!%20I%20just%20registered%20for%20the%20Founding%20Membership%20with%20ID%20${encodeURIComponent(
                    submittedData.memberId || "#001"
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#ccf141] hover:bg-[#d8fa4f] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer text-center shadow-[0_0_20px_rgba(204,241,65,0.4)]"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Pill for Mobile */}
      {!submittedData && !isFormInView && (
        <div className="fixed bottom-5 left-4 right-4 z-50 sm:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#ccf141]/50 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                100 FOUNDING SPOTS
              </span>
              <span className="text-xs font-black text-[#ccf141] font-mono">
                #001 - #100 ALLOCATION
              </span>
            </div>
            <button
              onClick={scrollToForm}
              className="px-4 py-2.5 bg-[#ccf141] active:bg-[#d8fa4f] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(204,241,65,0.4)] cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <span>CLAIM SPOT</span>
              <ArrowDown size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memfound;
