import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AICoachPanel = ({ feedback = {} }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const quote =
    feedback.quote ||
    "Your squat depth is good. Keep your chest slightly higher and maintain knee alignment.";
  const level = feedback.level || "positive"; // "positive" | "warning" | "error" | "info"
  const tag = feedback.tag || "Live Form Cue";

  // Speech synthesis for AI Coach Voice Cues
  useEffect(() => {
    if (voiceEnabled && quote && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(quote);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [quote, voiceEnabled]);

  const getLevelConfig = () => {
    switch (level) {
      case "warning":
        return {
          icon: AlertTriangle,
          borderColor: "border-amber-500/40",
          bgColor: "bg-amber-500/10",
          textColor: "text-amber-300",
          accentColor: "text-amber-400",
          badge: "⚠ Form Alert",
        };
      case "error":
        return {
          icon: XCircle,
          borderColor: "border-red-500/40",
          bgColor: "bg-red-500/10",
          textColor: "text-red-300",
          accentColor: "text-red-400",
          badge: "✕ Incorrect Movement",
        };
      case "positive":
      default:
        return {
          icon: CheckCircle2,
          borderColor: "border-emerald-500/40",
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-300",
          accentColor: "text-emerald-400",
          badge: "✓ Positive Form",
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`p-4 md:p-5 rounded-2xl border ${config.borderColor} ${config.bgColor} shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300`}
    >
      {/* Background soft ambient radial pulse */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 bg-[#ccf141]/15 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center text-[#ccf141] shadow-[0_0_12px_rgba(229,255,0,0.25)]">
            <Bot size={17} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>AI Coach</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccf141] animate-pulse" />
            </h4>
            <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">
              {tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge */}
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.borderColor} ${config.textColor}`}
          >
            {config.badge}
          </span>

          {/* Voice Coach Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              voiceEnabled
                ? "bg-[#ccf141] text-black border-[#ccf141]"
                : "bg-black/40 text-gray-400 border-white/10 hover:text-white"
            }`}
            title={
              voiceEnabled ? "Mute AI Voice Coach" : "Enable AI Voice Coach"
            }
          >
            {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="flex items-start gap-2.5 pt-1">
        <IconComponent
          size={18}
          className={`shrink-0 mt-0.5 ${config.accentColor}`}
        />
        <AnimatePresence mode="wait">
          <motion.p
            key={quote}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-xs md:text-sm font-semibold leading-relaxed tracking-wide ${config.textColor}`}
          >
            “{quote}”
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICoachPanel;
