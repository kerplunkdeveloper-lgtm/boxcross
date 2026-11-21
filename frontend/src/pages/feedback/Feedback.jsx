import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Lock,
  Clock,
  Send,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logo-new.png";
import { submitFeedback } from "../../api/api";
import {
  CONNECTIONS,
  PROGRAMMES,
  AREA_RATINGS,
  IMPROVEMENT_AREAS,
  WRITTEN_QUESTIONS,
  SAFETY_ANSWERS,
  MANAGEMENT_WHATSAPP,
} from "./feedbackOptions";

const LIME = "#ccf141";
const headingFont = { fontFamily: '"BrutalTypeBold", sans-serif' };
const bodyFont = { fontFamily: '"Brutal Font Light", sans-serif' };

const RATING_WORDS = ["", "Poor", "Below average", "Okay", "Good", "Excellent"];
const AUTO_ADVANCE_MS = 350;

const emptyForm = {
  connection: "",
  programme: "",
  ratings: { overall: null, coaching: null, equipment: null, cleanliness: null, timings: null },
  improvementArea: "",
  lovedMost: "",
  changeOne: "",
  newIdeas: "",
  anythingElse: "",
  safetyConcern: "",
  safetyDetails: "",
  website: "", // honeypot
};

// The questionnaire, one screen per step
const STEPS = [
  { id: "overall", section: "Your experience" },
  { id: "connection", section: "About you" },
  { id: "programme", section: "About you" },
  { id: "areas", section: "Rate the arena" },
  { id: "improve", section: "Rate the arena" },
  { id: "written1", section: "In your words" },
  { id: "written2", section: "In your words" },
  { id: "safety", section: "Safety & comfort" },
];

/* ---------- Building blocks ---------- */

const Option = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`w-full flex items-center justify-between gap-3 px-4 py-4 rounded-2xl border text-[15px] font-semibold text-left transition-all active:scale-[0.99] cursor-pointer ${
      selected
        ? "bg-[#ccf141] border-[#ccf141] text-black shadow-[0_6px_24px_rgba(204,241,65,0.25)]"
        : "bg-white/[0.03] border-white/10 text-gray-100 hover:border-white/30 hover:bg-white/[0.05]"
    }`}
  >
    <span>{children}</span>
    <span
      className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        selected ? "border-black bg-black" : "border-white/25"
      }`}
    >
      {selected && <Check size={12} strokeWidth={4} color={LIME} />}
    </span>
  </button>
);

const ScaleRow = ({ label, value, onChange }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center justify-between gap-3 mb-3">
      <span className="text-[15px] text-white font-semibold leading-snug">{label}</span>
      <span className={`text-[12px] shrink-0 font-semibold ${value ? "text-[#ccf141]" : "text-gray-500"}`}>
        {value ? RATING_WORDS[value] : "Not rated"}
      </span>
    </div>
    <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} – ${RATING_WORDS[n]}`}
          onClick={() => onChange(value === n ? null : n)}
          className={`h-12 rounded-xl border text-[16px] font-black transition-all cursor-pointer active:scale-95 ${
            value === n
              ? "bg-[#ccf141] border-[#ccf141] text-black"
              : value && n < value
                ? "bg-[#ccf141]/15 border-[#ccf141]/30 text-[#ccf141]"
                : "bg-black/30 border-white/10 text-gray-400 hover:border-white/30"
          }`}
          style={headingFont}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

const TextAnswer = ({ number, label, value, onChange, autoFocus }) => (
  <label className="block">
    <span className="flex items-start gap-2 text-[16px] sm:text-[17px] font-bold text-white leading-snug mb-3">
      <span className="text-[#ccf141] shrink-0" style={headingFont}>
        {number}.
      </span>
      {label}
    </span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      maxLength={5000}
      autoFocus={autoFocus}
      placeholder="Type here… (optional)"
      className="w-full bg-white/[0.03] border border-white/10 focus:border-[#ccf141]/60 focus:bg-white/[0.05] rounded-2xl px-4 py-3.5 text-[15px] text-white placeholder:text-gray-600 outline-none resize-y min-h-[120px] transition-colors"
    />
  </label>
);

const StepHeading = ({ eyebrow, title, hint }) => (
  <div className="mb-6">
    {eyebrow && (
      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#ccf141] mb-2" style={headingFont}>
        {eyebrow}
      </p>
    )}
    <h2 className="text-[24px] sm:text-[30px] font-black text-white leading-[1.15] tracking-tight" style={headingFont}>
      {title}
    </h2>
    {hint && <p className="text-[14px] text-gray-400 mt-2 leading-relaxed">{hint}</p>}
  </div>
);

/* ---------- Page ---------- */

const Feedback = () => {
  const [form, setForm] = useState(emptyForm);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const advanceTimer = useRef(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setRating = (key, val) => setForm((f) => ({ ...f, ratings: { ...f.ratings, [key]: val } }));

  const isLast = step === STEPS.length - 1;
  const progress = started ? Math.round(((step + 1) / STEPS.length) * 100) : 0;

  useEffect(() => () => clearTimeout(advanceTimer.current), []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, started, done]);

  const goTo = (next) => {
    clearTimeout(advanceTimer.current);
    if (next < 0 || next >= STEPS.length) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  const next = () => goTo(step + 1);
  const prev = () => (step === 0 ? setStarted(false) : goTo(step - 1));

  // Single-choice questions move on automatically after a tap
  const chooseAndAdvance = (patch, keep) => {
    set(patch);
    clearTimeout(advanceTimer.current);
    if (keep) advanceTimer.current = setTimeout(() => goTo(step + 1), AUTO_ADVANCE_MS);
  };

  const hasAnyAnswer = () => {
    const r = form.ratings;
    return Boolean(
      Object.values(r).some(Boolean) ||
        form.connection ||
        form.programme ||
        form.improvementArea ||
        form.safetyConcern ||
        WRITTEN_QUESTIONS.some((q) => form[q.key].trim()),
    );
  };

  // Whether the current step has an answer (controls "Next" vs "Skip" wording)
  const stepAnswered = () => {
    const r = form.ratings;
    switch (STEPS[step].id) {
      case "overall":
        return !!r.overall;
      case "connection":
        return !!form.connection;
      case "programme":
        return !!form.programme;
      case "areas":
        return AREA_RATINGS.some((a) => r[a.key]);
      case "improve":
        return !!form.improvementArea;
      case "written1":
        return !!(form.lovedMost.trim() || form.changeOne.trim());
      case "written2":
        return !!(form.newIdeas.trim() || form.anythingElse.trim());
      case "safety":
        return !!form.safetyConcern;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!hasAnyAnswer()) {
      toast.error("Please answer at least one question.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await submitFeedback(form);
      if (data.success) {
        setDone(true);
      } else {
        toast.error(data.message || "Could not submit. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const seo = (
    <Helmet>
      <title>Feedback Form | Box &amp; Cross – Performance Arena</title>
      <meta
        name="description"
        content="Your Voice. Our Next Rep. Share your anonymous feedback and help us build a better BXC. No name or phone number needed (takes ~2 mins)."
      />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Box &amp; Cross" />
      <meta property="og:url" content="https://membership.boxandcross.com/feedback" />
      <meta property="og:title" content="Feedback Form | Box &amp; Cross – Performance Arena" />
      <meta
        property="og:description"
        content="Your Voice. Our Next Rep. Share your anonymous feedback and help us build a better BXC. No name or phone number needed (takes ~2 mins)."
      />
      <meta property="og:image" content="https://membership.boxandcross.com/og-feedback.jpg" />
      <meta property="og:image:secure_url" content="https://membership.boxandcross.com/og-feedback.jpg" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="768" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt" content="Box &amp; Cross Feedback - Your Voice. Our Next Rep." />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://membership.boxandcross.com/feedback" />
      <meta name="twitter:title" content="Feedback Form | Box &amp; Cross – Performance Arena" />
      <meta
        name="twitter:description"
        content="Your Voice. Our Next Rep. Share your anonymous feedback and help us build a better BXC. No name or phone number needed (takes ~2 mins)."
      />
      <meta name="twitter:image" content="https://membership.boxandcross.com/og-feedback.jpg" />
    </Helmet>
  );

  const glow = (
    <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-[#ccf141]/[0.06] blur-[130px] pointer-events-none" />
  );

  /* ---------- Thank-you ---------- */
  if (done) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
        {seo}
        {glow}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative flex flex-col items-center"
        >
          <img src={logo} alt="Box & Cross" className="h-10 w-auto mb-10 opacity-90" />
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-[#ccf141] flex items-center justify-center mb-7 shadow-[0_0_50px_rgba(204,241,65,0.35)]"
          >
            <CheckCircle2 size={40} color="#000" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#ccf141] leading-none" style={headingFont}>
            Feedback received.
          </h1>
          <p className="text-gray-300 text-[16px] leading-relaxed max-w-md mt-5" style={bodyFont}>
            Thank you for helping us build a stronger Box &amp; Cross. Your feedback will be reviewed by our management team.
          </p>
          <p className="mt-10 text-[13px] font-black uppercase tracking-[0.25em] text-white/70" style={headingFont}>
            It's just never enough.
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setStep(0);
              setStarted(false);
              setDone(false);
            }}
            className="mt-10 text-[13px] text-gray-500 underline underline-offset-4 hover:text-gray-300 cursor-pointer"
          >
            Submit another response
          </button>
        </motion.div>
      </div>
    );
  }

  /* ---------- Welcome ---------- */
  if (!started) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col relative overflow-hidden">
        {seo}
        {glow}
        <main className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 py-12 max-w-2xl w-full mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <img src={logo} alt="Box & Cross" className="h-9 w-auto mb-10" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ccf141] mb-4" style={headingFont}>
              Box &amp; Cross Performance Arena
            </p>
            <h1 className="text-[46px] leading-[0.92] sm:text-7xl font-black uppercase tracking-tight" style={headingFont}>
              Your voice.
              <br />
              <span className="text-[#ccf141]">Our next rep.</span>
            </h1>
            <p className="text-[#ccf141] text-[17px] leading-relaxed mt-6 max-w-xl" style={bodyFont}>
            YOUR FEEDBACK IS ANONYMOUS. SO BE HONEST.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mt-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-[13px] font-semibold text-gray-200 w-fit">
                <Lock size={14} color={LIME} /> No name or phone number required
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-[13px] font-semibold text-gray-200 w-fit">
                <Clock size={14} color={LIME} /> {STEPS.length} quick steps · about 2 minutes
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setStarted(true);
                setStep(0);
                setDirection(1);
              }}
              className="group mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-10 rounded-2xl bg-[#ccf141] text-black text-[15px] font-black uppercase tracking-wider shadow-[0_10px_40px_rgba(204,241,65,0.3)] active:scale-[0.98] cursor-pointer"
              style={headingFont}
            >
              Start feedback
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ---------- Steps ---------- */
  const current = STEPS[step];
  const starValue = hoverStar || form.ratings.overall || 0;

  const renderStep = () => {
    switch (current.id) {
      case "overall":
        return (
          <>
            <StepHeading eyebrow="Overall" title="How would you rate your overall BXC experience?" />
            <div className="rounded-3xl border border-[#ccf141]/20 bg-[#ccf141]/[0.04] py-8 px-4 text-center">
              <div
                className="flex justify-center gap-1 sm:gap-3"
                role="radiogroup"
                aria-label="Overall rating"
                onMouseLeave={() => setHoverStar(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={form.ratings.overall === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""} – ${RATING_WORDS[n]}`}
                    onMouseEnter={() => setHoverStar(n)}
                    onClick={() => {
                      const val = form.ratings.overall === n ? null : n;
                      setRating("overall", val);
                      clearTimeout(advanceTimer.current);
                      if (val) advanceTimer.current = setTimeout(() => goTo(step + 1), AUTO_ADVANCE_MS + 150);
                    }}
                    className="p-1 transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                  >
                    <Star
                      size={46}
                      strokeWidth={1.5}
                      color={n <= starValue ? LIME : "rgba(255,255,255,0.22)"}
                      fill={n <= starValue ? LIME : "transparent"}
                    />
                  </button>
                ))}
              </div>
              <p className={`mt-4 text-[16px] font-bold h-6 ${starValue ? "text-[#ccf141]" : "text-gray-500"}`}>
                {starValue ? RATING_WORDS[starValue] : "Tap a star"}
              </p>
            </div>
          </>
        );

      case "connection":
        return (
          <>
            <StepHeading eyebrow="Question 1" title="How are you connected to BXC?" />
            <div className="space-y-2.5">
              {CONNECTIONS.map((opt) => (
                <Option
                  key={opt}
                  selected={form.connection === opt}
                  onClick={() => {
                    const val = form.connection === opt ? "" : opt;
                    chooseAndAdvance({ connection: val }, !!val);
                  }}
                >
                  {opt}
                </Option>
              ))}
            </div>
          </>
        );

      case "programme":
        return (
          <>
            <StepHeading eyebrow="Question 2" title="Which programme do you mainly attend?" />
            <div className="space-y-2.5">
              {PROGRAMMES.map((opt) => (
                <Option
                  key={opt}
                  selected={form.programme === opt}
                  onClick={() => {
                    const val = form.programme === opt ? "" : opt;
                    chooseAndAdvance({ programme: val }, !!val);
                  }}
                >
                  {opt}
                </Option>
              ))}
            </div>
          </>
        );

      case "areas":
        return (
          <>
            <StepHeading
              eyebrow="Questions 3 – 6"
              title="How satisfied are you with these areas?"
              hint="1 = poor, 5 = excellent. Skip anything you haven't experienced."
            />
            <div className="space-y-3">
              {AREA_RATINGS.map((a) => (
                <ScaleRow key={a.key} label={a.label} value={form.ratings[a.key]} onChange={(v) => setRating(a.key, v)} />
              ))}
            </div>
          </>
        );

      case "improve":
        return (
          <>
            <StepHeading eyebrow="Question 7" title="Which area needs the most improvement?" />
            <div className="space-y-2.5">
              {IMPROVEMENT_AREAS.map((opt) => (
                <Option
                  key={opt}
                  selected={form.improvementArea === opt}
                  onClick={() => {
                    const val = form.improvementArea === opt ? "" : opt;
                    chooseAndAdvance({ improvementArea: val }, !!val);
                  }}
                >
                  {opt}
                </Option>
              ))}
            </div>
          </>
        );

      case "written1":
        return (
          <>
            <StepHeading
              eyebrow="In your own words"
              title="Tell us what you think"
              hint="Optional. Write as much or as little as you like."
            />
            <div className="space-y-6">
              {WRITTEN_QUESTIONS.slice(0, 2).map((q, i) => (
                <TextAnswer
                  key={q.key}
                  number={8 + i}
                  label={q.label}
                  value={form[q.key]}
                  onChange={(v) => set({ [q.key]: v })}
                />
              ))}
            </div>
          </>
        );

      case "written2":
        return (
          <>
            <StepHeading eyebrow="In your own words" title="Ideas for the future" hint="Optional." />
            <div className="space-y-6">
              {WRITTEN_QUESTIONS.slice(2).map((q, i) => (
                <TextAnswer
                  key={q.key}
                  number={10 + i}
                  label={q.label}
                  value={form[q.key]}
                  onChange={(v) => set({ [q.key]: v })}
                />
              ))}
            </div>
          </>
        );

      case "safety":
        return (
          <>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <ShieldAlert size={22} className="text-gray-200" />
            </div>
            <StepHeading
              eyebrow="Last question"
              title="Have you experienced or noticed anything at BXC that made you feel unsafe, uncomfortable or disrespected?"
              hint="Your answer stays anonymous."
            />
            <div className="space-y-2.5">
              {SAFETY_ANSWERS.map((opt) => (
                <Option
                  key={opt}
                  selected={form.safetyConcern === opt}
                  onClick={() => set({ safetyConcern: form.safetyConcern === opt ? "" : opt })}
                >
                  {opt}
                </Option>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {form.safetyConcern === "Yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 space-y-4">
                    <label className="block">
                      <span className="block text-[15px] text-white font-semibold mb-2">
                        Please describe your concern.
                      </span>
                      <span className="block text-[13px] text-gray-400 mb-3">
                        Don't include your name or details that identify you.
                      </span>
                      <textarea
                        value={form.safetyDetails}
                        onChange={(e) => set({ safetyDetails: e.target.value })}
                        rows={4}
                        maxLength={5000}
                        autoFocus
                        placeholder="What happened?"
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-[#ccf141]/60 rounded-2xl px-4 py-3.5 text-[15px] text-white placeholder:text-gray-600 outline-none resize-y min-h-[120px] transition-colors"
                      />
                    </label>
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-4">
                      <p className="text-[15px] text-amber-200 font-bold">Is this urgent?</p>
                      <p className="text-[13px] text-amber-100/80 mt-1 leading-relaxed">
                        Anonymous feedback may not be read right away. For an urgent safety concern, contact management directly.
                      </p>
                      <a
                        href={`https://wa.me/${MANAGEMENT_WHATSAPP}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-amber-400 text-black text-[13px] font-bold"
                      >
                        Contact management on WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col relative overflow-x-hidden">
      {seo}
      {glow}

      {/* Top bar: logo, step counter, progress */}
      <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <img src={logo} alt="Box & Cross" className="h-6 w-auto" />
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500" style={headingFont}>
              {current.section}
            </div>
            <div className="text-[13px] font-bold text-white">
              Step <span className="text-[#ccf141]">{step + 1}</span> of {STEPS.length}
            </div>
          </div>
        </div>
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-[#ccf141]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </header>

      {/* Honeypot (hidden from people, catches bots) */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set({ website: e.target.value })}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      {/* Step content */}
      <main className="relative flex-1 w-full max-w-2xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-40">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-t from-[#050505] via-[#050505] to-[#050505]/0 pt-8 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          {/* Step dots */}
          <div className="flex justify-center gap-1.5 mb-4" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-[#ccf141]" : i < step ? "w-1.5 bg-[#ccf141]/50" : "w-1.5 bg-white/15"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="inline-flex items-center justify-center gap-2 h-14 px-5 rounded-2xl bg-white/5 border border-white/10 text-white text-[14px] font-bold hover:bg-white/10 cursor-pointer"
              aria-label="Previous"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#ccf141] text-black text-[15px] font-black uppercase tracking-wider shadow-[0_8px_30px_rgba(204,241,65,0.25)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                style={headingFont}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Submit feedback <Send size={17} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className={`group flex-1 inline-flex items-center justify-center gap-2 h-14 rounded-2xl text-[15px] font-black uppercase tracking-wider active:scale-[0.99] cursor-pointer transition-colors ${
                  stepAnswered()
                    ? "bg-[#ccf141] text-black shadow-[0_8px_30px_rgba(204,241,65,0.2)]"
                    : "bg-white/10 text-white border border-white/10 hover:bg-white/15"
                }`}
                style={headingFont}
              >
                {stepAnswered() ? "Next" : "Skip"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Feedback;
