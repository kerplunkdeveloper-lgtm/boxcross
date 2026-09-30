import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Play,
  Square,
  Pause,
  Maximize2,
  Minimize2,
  RefreshCw,
  Upload,
  Settings,
  Dumbbell,
  Activity,
  Sliders,
  Sparkles,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MdFlipCameraAndroid } from "react-icons/md";
import SkeletonOverlay from "./SkeletonOverlay";
import { poseDetectionService } from "../../services/poseDetectionService";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const CameraAnalyzer = ({
  onLandmarksDetected,
  currentMode,
  jointAngles,
  visualState = "GREEN",
  isAnalyzing,
  setIsAnalyzing,
  analysisDuration,
  setAnalysisDuration,
  exerciseStats = {},
  onSelectMode,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const prevRepsRef = useRef(exerciseStats?.reps || 0);
  const isAnalyzingRef = useRef(isAnalyzing);

  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing]);

  // Play gym rep completion chime
  const playRepChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // Play countdown audio beeps for 3, 2, 1 and high pitch for GO!
  const playCountdownBeep = (isFinal = false) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isFinal ? "triangle" : "sine";
      const freq = isFinal ? 880 : 540;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (isFinal) {
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.18);
      }
      gain.gain.setValueAtTime(0.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (isFinal ? 0.45 : 0.22));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isFinal ? 0.45 : 0.22));
    } catch (e) {}
  };

  useEffect(() => {
    if (exerciseStats?.reps && exerciseStats.reps > prevRepsRef.current) {
      playRepChime();
    }
    prevRepsRef.current = exerciseStats?.reps || 0;
  }, [exerciseStats?.reps]);

  const [hasPermission, setHasPermission] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [facingMode, setFacingMode] = useState("user");
  const [showGuides, setShowGuides] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fps, setFps] = useState(30);
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
  const [currentLandmarks, setCurrentLandmarks] = useState(null);
  const [uploadedMediaName, setUploadedMediaName] = useState("");

  // 3, 2, 1, GO! Countdown State
  const [countdown, setCountdown] = useState(null); // null | 3 | 2 | 1 | "GO!"
  const countdownTimerRef = useRef([]);

  const lastFpsTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Clear pending countdown timers
  const clearCountdownTimers = () => {
    countdownTimerRef.current.forEach((t) => clearTimeout(t));
    countdownTimerRef.current = [];
    setCountdown(null);
  };

  // Initialize MediaPipe model
  useEffect(() => {
    let mounted = true;
    poseDetectionService.initPoseLandmarker().then((success) => {
      if (mounted) {
        if (!success) {
          console.log(
            "Using browser kinematic simulator if camera unavailable",
          );
        }
      }
    });
    return () => {
      mounted = false;
      clearCountdownTimers();
      stopCameraStream(false);
    };
  }, []);

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (videoRef.current) {
        const w = videoRef.current.clientWidth || 640;
        const h = videoRef.current.clientHeight || 480;
        if (w > 0 && h > 0) {
          setDimensions({ width: w, height: h });
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Launch Workout / Analysis with 3, 2, 1, GO! Countdown
  const triggerStartWithCountdown = async (mode = "camera") => {
    clearCountdownTimers();

    // Pre-activate camera or simulation in background
    if (mode === "camera") {
      try {
        setIsDemoMode(false);
        poseDetectionService.isSimulatedMode = false;
        const res = await poseDetectionService.startCamera(videoRef.current, {
          facingMode,
        });
        if (res.success) {
          setHasPermission(true);
        } else {
          setIsDemoMode(true);
          poseDetectionService.isSimulatedMode = true;
        }
      } catch (err) {
        setIsDemoMode(true);
        poseDetectionService.isSimulatedMode = true;
      }
    } else {
      setIsDemoMode(true);
      poseDetectionService.isSimulatedMode = true;
    }

    // Step 1: 3
    setCountdown(3);
    playCountdownBeep(false);

    // Step 2: 2
    const t1 = setTimeout(() => {
      setCountdown(2);
      playCountdownBeep(false);
    }, 900);

    // Step 3: 1
    const t2 = setTimeout(() => {
      setCountdown(1);
      playCountdownBeep(false);
    }, 1800);

    // Step 4: GO!
    const t3 = setTimeout(() => {
      setCountdown("GO!");
      playCountdownBeep(true);
    }, 2700);

    // Step 5: Start tracking loop
    const t4 = setTimeout(() => {
      setCountdown(null);
      setIsAnalyzing(true);
      setIsPaused(false);
      setAnalysisDuration(0);
      startDetectionLoop();
      toast.success(
        mode === "camera"
          ? "Camera Live. AI Pose Tracking Active!"
          : "AI Kinematic Motion Simulator Active!"
      );
    }, 3400);

    countdownTimerRef.current = [t1, t2, t3, t4];
  };

  // Switch between Front (Selfie) and Back (Rear/Environment) camera
  const handleSwitchCamera = async () => {
    const nextFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextFacing);
    // Automatically mirror for front selfie camera, unmirror for rear environment camera
    setMirrored(nextFacing === "user");

    // If camera is currently streaming, switch media stream on the fly
    if (poseDetectionService.isCameraActive && videoRef.current) {
      const toastId = toast.loading(
        `Turning to ${nextFacing === "user" ? "Front (Selfie)" : "Back (Rear)"} Camera...`,
        { id: "cam-switch" }
      );
      try {
        const res = await poseDetectionService.startCamera(videoRef.current, {
          facingMode: nextFacing,
        });
        if (res.success) {
          setHasPermission(true);
          toast.success(
            `Switched to ${nextFacing === "user" ? "Front (Selfie)" : "Back (Rear)"} Camera`,
            { id: "cam-switch" }
          );
        } else {
          toast.error(
            "Could not switch camera. Check browser permissions or device support.",
            { id: "cam-switch" }
          );
        }
      } catch (err) {
        console.error("Camera switch error:", err);
        toast.error("Failed to switch camera", { id: "cam-switch" });
      }
    } else {
      toast.success(
        `Selected ${nextFacing === "user" ? "Front (Selfie)" : "Back (Rear)"} Camera`,
        { duration: 2000 }
      );
    }
  };

  // Direct Start Camera (calls countdown)
  const handleStartCamera = () => {
    triggerStartWithCountdown("camera");
  };

  // Direct Start Simulator (calls countdown)
  const handleStartDemo = () => {
    triggerStartWithCountdown("demo");
  };

  // Stop Camera & Reset to Ready
  const stopCameraStream = (showToast = true) => {
    const wasActive =
      isAnalyzingRef.current ||
      isAnalyzing ||
      isDemoMode ||
      poseDetectionService.isCameraActive;

    clearCountdownTimers();
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    poseDetectionService.stopCamera(videoRef.current);
    setIsAnalyzing(false);
    setIsPaused(false);
    setIsDemoMode(false);
    poseDetectionService.isSimulatedMode = false;
    setCurrentLandmarks(null);
    setAnalysisDuration(0);

    // Only show toast if user explicitly stopped an active session (silent during unmount/cleanup)
    if (showToast && wasActive) {
      toast("Analysis stopped. Session saved.", {
        icon: "⏹️",
        id: "analysis-stopped",
      });
    }
  };

  // Pause / Resume / Start from Ready
  const handleTogglePause = () => {
    if (countdown !== null) {
      clearCountdownTimers();
      return;
    }
    if (!isAnalyzing) {
      triggerStartWithCountdown("camera");
      return;
    }
    setIsPaused((prev) => {
      const next = !prev;
      if (videoRef.current && !videoRef.current.paused) {
        if (next) videoRef.current.pause();
        else videoRef.current.play();
      }
      return next;
    });
  };

  // Upload video/image file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setUploadedMediaName(file.name);
    setIsDemoMode(false);
    poseDetectionService.isSimulatedMode = false;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = fileUrl;
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setIsAnalyzing(true);
          setIsPaused(false);
          startDetectionLoop();
          toast.success(`Loaded "${file.name}" for AI analysis.`);
        })
        .catch((err) => {
          console.error("Video play error:", err);
        });
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  // Real-time Detection Loop
  const startDetectionLoop = () => {
    const tick = (now) => {
      if (!isPaused && videoRef.current) {
        frameCountRef.current += 1;
        if (now - lastFpsTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsTimeRef.current = now;
        }

        poseDetectionService.currentMode = currentMode;
        const res = poseDetectionService.detectPose(videoRef.current, now);

        if (res.detected && res.landmarks) {
          setCurrentLandmarks(res.landmarks);
          if (onLandmarksDetected) {
            onLandmarksDetected(res.landmarks, res.isSimulated);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    animFrameIdRef.current = requestAnimationFrame(tick);
  };

  // Format timer mm:ss
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-2xl flex flex-col justify-between select-none transition-colors duration-200 ${
        isFullscreen
          ? "h-screen rounded-none"
          : "min-h-[300px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[480px] h-full"
      }`}
    >
      {/* ── CENTRAL VIDEO & CANVAS VIEWPORT ── */}
      <div className="relative flex-grow flex items-center justify-center bg-[#070b0f] overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[360px]">
        {/* Top Left: LIVE RED PILL BADGE (only when analyzing) or READY BADGE */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 flex items-center gap-1.5">
          {isAnalyzing ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[10px] sm:text-xs shadow-md">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />
              <span className="tracking-wider text-[10px] sm:text-[11px]">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-gray-300 font-bold text-[10px] sm:text-xs shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="tracking-wider text-[10px] sm:text-[11px]">Ready</span>
            </div>
          )}
          <div className="hidden xs:flex items-center px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-bold text-gray-200">
            <span>{currentMode}</span>
          </div>
        </div>

        {/* Top Right: Quick Actions (Camera Turn/Flip + Mobile Settings + Fullscreen) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-1 sm:gap-2">
          {/* Turn / Flip Camera Button - Compact & Sleek */}
          <button
            onClick={handleSwitchCamera}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-95 ${
              facingMode === "environment"
                ? "bg-neutral-900/95 text-[var(--db-accent-highlight)] border-[var(--db-accent-highlight)]/60 shadow-[0_0_10px_var(--db-accent-glow)]"
                : "bg-black/70 border-white/15 text-gray-200 hover:text-white hover:border-white/30"
            }`}
            title={
              facingMode === "user"
                ? "Switch to Back Camera"
                : "Switch to Front Camera"
            }
          >
            <MdFlipCameraAndroid
              size={15}
              className={`transition-transform duration-300 ${
                facingMode === "environment"
                  ? "text-[var(--db-accent-highlight)] rotate-180"
                  : "text-gray-300"
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden xs:inline">
              {facingMode === "user" ? "Front" : "Back"}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-xl bg-black/70 border border-white/15 text-gray-300 hover:text-white transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-95"
            title="Camera & AI Overlay Settings"
          >
            <Settings size={15} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-black/70 border border-white/15 text-gray-300 hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-95"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* Right Floating Vertical Control Strip (DESKTOP ONLY: hidden on mobile so it never blocks athlete body) */}
        <div className="hidden md:flex absolute right-2 sm:right-3 md:right-3.5 top-1/2 -translate-y-1/2 z-20 flex-col gap-1.5 sm:gap-2 md:gap-2.5">
          {/* Camera Button */}
          <button
            onClick={isAnalyzing ? () => stopCameraStream(true) : handleStartCamera}
            className={`flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl transition-all cursor-pointer shadow-lg ${
              isAnalyzing && !isDemoMode
                ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold shadow-lg shadow-[var(--db-accent-glow)]"
                : "bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10"
            }`}
            title="Toggle Device Camera"
          >
            <Camera
              size={16}
              className={
                isAnalyzing && !isDemoMode ? "text-[var(--db-accent-text)]" : "text-gray-300"
              }
            />
            <span className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold">Camera</span>
          </button>

          {/* Turn / Flip Camera Button */}
          <button
            onClick={handleSwitchCamera}
            className={`flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl transition-all cursor-pointer shadow-lg ${
              facingMode === "environment"
                ? "bg-neutral-900/95 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/60 shadow-[0_0_12px_var(--db-accent-glow)]"
                : "bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10"
            }`}
            title={
              facingMode === "user"
                ? "Turn to Back / Rear Camera"
                : "Turn to Front / Selfie Camera"
            }
          >
            <MdFlipCameraAndroid
              size={17}
              className={`transition-transform duration-300 ${
                facingMode === "environment" ? "text-[var(--db-accent-highlight)] rotate-180" : "text-gray-300"
              }`}
            />
            <span className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold">
              {facingMode === "user" ? "Flip" : "Back"}
            </span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10 transition-all cursor-pointer shadow-lg"
            title="Upload pre-recorded clip or photo"
          >
            <Upload size={16} />
            <span className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold">Upload</span>
          </button>

          {/* Mirror Button */}
          <button
            onClick={() => setMirrored(!mirrored)}
            className={`flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl transition-all cursor-pointer shadow-lg ${
              mirrored
                ? "bg-neutral-900/90 text-[var(--db-accent-highlight)] border border-[var(--db-accent-highlight)]/40"
                : "bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10"
            }`}
            title="Mirror Video Feed"
          >
            <RefreshCw
              size={15}
              className={mirrored ? "text-[var(--db-accent-highlight)]" : "text-gray-300"}
            />
            <span className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold">Mirror</span>
          </button>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10 transition-all cursor-pointer shadow-lg"
              title="Camera Settings"
            >
              <Settings size={16} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold">Settings</span>
            </button>

            {/* Desktop Settings Popover */}
            {showSettings && (
              <div className="absolute right-12 sm:right-16 top-0 w-48 sm:w-52 p-3 rounded-2xl bg-[#0f1722] border border-white/15 shadow-2xl z-30 space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-1">
                  AI Overlay Guides
                </p>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Plumb Line Guides</span>
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="accent-[var(--db-accent-highlight)]"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Joint Angle Arcs</span>
                  <input
                    type="checkbox"
                    checked={showAngles}
                    onChange={(e) => setShowAngles(e.target.checked)}
                    className="accent-[var(--db-accent-highlight)]"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Skeleton Overlay</span>
                  <input
                    type="checkbox"
                    checked={showSkeleton}
                    onChange={(e) => setShowSkeleton(e.target.checked)}
                    className="accent-[var(--db-accent-highlight)]"
                  />
                </label>

                {/* Camera Source Selector */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Active Lens
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        if (facingMode !== "user") handleSwitchCamera();
                      }}
                      className={`px-2 py-1.5 rounded-lg text-center font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                        facingMode === "user"
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-sm"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      Front (Selfie)
                    </button>
                    <button
                      onClick={() => {
                        if (facingMode !== "environment") handleSwitchCamera();
                      }}
                      className={`px-2 py-1.5 rounded-lg text-center font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                        facingMode === "environment"
                          ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-sm"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      Back (Rear)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Settings Drawer Modal (clean popup on mobile screens) */}
        {showSettings && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fade-in"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="w-full max-w-sm bg-[#0f1722] border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Settings size={14} className="text-[var(--db-accent-highlight)]" />
                  Camera &amp; AI Overlay Options
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <XCircle size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between text-gray-200 py-1 cursor-pointer">
                  <span className="font-semibold text-xs">Plumb Line Guides</span>
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="w-4 h-4 accent-[var(--db-accent-highlight)] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-200 py-1 cursor-pointer">
                  <span className="font-semibold text-xs">Joint Angle Arcs</span>
                  <input
                    type="checkbox"
                    checked={showAngles}
                    onChange={(e) => setShowAngles(e.target.checked)}
                    className="w-4 h-4 accent-[var(--db-accent-highlight)] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-200 py-1 cursor-pointer">
                  <span className="font-semibold text-xs">Skeleton Overlay</span>
                  <input
                    type="checkbox"
                    checked={showSkeleton}
                    onChange={(e) => setShowSkeleton(e.target.checked)}
                    className="w-4 h-4 accent-[var(--db-accent-highlight)] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-200 py-1 cursor-pointer">
                  <span className="font-semibold text-xs">Mirror Video Feed</span>
                  <input
                    type="checkbox"
                    checked={mirrored}
                    onChange={(e) => setMirrored(e.target.checked)}
                    className="w-4 h-4 accent-[var(--db-accent-highlight)] cursor-pointer"
                  />
                </label>
              </div>

              {/* Mobile Lens Switcher */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Active Camera Lens
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (facingMode !== "user") handleSwitchCamera();
                    }}
                    className={`py-2 px-3 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      facingMode === "user"
                        ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    Front (Selfie)
                  </button>
                  <button
                    onClick={() => {
                      if (facingMode !== "environment") handleSwitchCamera();
                    }}
                    className={`py-2 px-3 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                      facingMode === "environment"
                        ? "bg-[var(--db-accent)] text-[var(--db-accent-text)] shadow-md"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    Back (Rear)
                  </button>
                </div>
              </div>

              {/* Upload media file option */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Upload Video or Image File</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          onLoadedMetadata={() => {
            if (videoRef.current) {
              const w = videoRef.current.clientWidth || 640;
              const h = videoRef.current.clientHeight || 480;
              if (w > 0 && h > 0) {
                setDimensions({ width: w, height: h });
              }
            }
          }}
          className={`w-full h-full object-contain ${mirrored ? "-scale-x-100" : ""}`}
        />

        {/* Skeleton & Guides Canvas Layer */}
        {showSkeleton && (
          <SkeletonOverlay
            landmarks={currentLandmarks}
            width={dimensions.width}
            height={dimensions.height}
            mirrored={mirrored}
            showGuides={showGuides}
            showAngles={showAngles}
            jointAngles={jointAngles}
            visualState={visualState}
            currentMode={currentMode}
            exerciseStats={exerciseStats}
          />
        )}

        {/* Mobile Live Kinematic & Form HUD (shown when active on mobile) */}
        {isAnalyzing && (
          <div className="md:hidden absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 shadow-xl text-white">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wide text-emerald-400 truncate">
                {currentMode === "Posture Analysis" ? "Posture Form" : `${exerciseStats?.reps || 0} REPS`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
              <span className="text-[10px] text-gray-400 font-sans font-semibold uppercase">Score</span>
              <span className="text-emerald-400 font-black">{exerciseStats?.formScore || 86}%</span>
              {currentMode !== "Posture Analysis" && (
                <>
                  <span className="text-white/30">|</span>
                  <span className="text-[10px] text-gray-400 font-sans font-semibold uppercase">Acc</span>
                  <span className="text-[#ccf141] font-black">{exerciseStats?.accuracy || 88}%</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Standby / Initial State Viewfinder Overlay */}
        {!isAnalyzing && countdown === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:pr-24 text-center bg-black/80 backdrop-blur-[3px] z-10 select-none">
            {/* Minimalist AI Optical Scanner Ring */}
            <div className="relative mb-3 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--db-accent)]/10 border border-dashed border-[var(--db-accent-highlight)]/40 flex items-center justify-center text-[var(--db-accent-highlight)] animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[var(--db-accent)]/20 border border-[var(--db-accent-highlight)]/60 flex items-center justify-center text-[var(--db-accent-highlight)] shadow-[0_0_20px_var(--db-accent-glow)]">
                <Camera size={20} />
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white tracking-wide uppercase mb-0.5">
              {currentMode}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-300 max-w-xs mb-3.5 leading-relaxed font-medium">
              Position full body in frame for real-time 33-point AI motion tracking.
            </p>

            {/* Single Prominent CTA */}
            <button
              onClick={() => triggerStartWithCountdown("camera")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Camera size={14} className="fill-[var(--db-accent-text)]" />
              <span>Start Camera</span>
            </button>

            {/* Secondary Simulation Link (Unobtrusive & clean) */}
            <button
              onClick={() => triggerStartWithCountdown("demo")}
              className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[var(--db-accent-highlight)]/80 hover:text-[var(--db-accent-highlight)] font-semibold transition-all cursor-pointer underline decoration-dotted"
            >
              <Sparkles size={12} />
              <span>or try live demo simulation</span>
            </button>
          </div>
        )}

        {/* ── 3, 2, 1, GO! ANIMATED FULL-VIEWPORT OVERLAY ── */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none pr-4 sm:pr-0"
            >
              {/* Outer Pulsing Kinetic Ring */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0.3 }}
                animate={{ scale: [0.85, 1.15, 0.95], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[var(--db-accent-highlight)]/50 pointer-events-none"
              />

              {/* Glowing Background Radial Bloom */}
              <div className="absolute w-64 h-64 rounded-full bg-[var(--db-accent)]/20 blur-3xl pointer-events-none" />

              {/* Number / GO! Animation */}
              <motion.div
                key={countdown}
                initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
                animate={{ scale: [0.2, 1.25, 1], opacity: 1, rotate: 0 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-4"
              >
                <span
                  className={`font-black tracking-tight leading-none filter drop-shadow-[0_0_40px_rgba(229,255,0,0.85)] ${
                    countdown === "GO!"
                      ? "text-7xl sm:text-8xl md:text-9xl text-[var(--db-accent-highlight)] italic font-black"
                      : "text-8xl sm:text-9xl md:text-[10rem] text-[var(--db-accent-highlight)] font-mono"
                  }`}
                >
                  {countdown}
                </span>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 sm:mt-5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white shadow-xl"
                >
                  {countdown === 3 && "Stand in front of the camera"}
                  {countdown === 2 && "Calibrating body alignment..."}
                  {countdown === 1 && "Get ready..."}
                  {countdown === "GO!" && "AI Pose Engine Active!"}
                </motion.div>
              </motion.div>

              {/* Cancel Button */}
              <button
                onClick={clearCountdownTimers}
                className="absolute bottom-5 sm:bottom-6 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* ── BOTTOM CONTROL BAR ── */}
      {/* Hidden on mobile when idle (standby CTA is used), visible during active scan or on desktop */}
      <div
        className={`p-2.5 sm:p-3.5 md:p-4 bg-[var(--db-card)] border-t border-[var(--db-card-border)] flex-col gap-2 z-20 ${
          isAnalyzing || countdown !== null ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Pulsing Audio/Pulse Button + Status + Timer */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleTogglePause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--db-accent)]/15 border border-[var(--db-accent-highlight)]/40 text-[var(--db-accent-highlight)] flex items-center justify-center shadow-[0_0_12px_var(--db-accent-glow)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title={
                countdown !== null
                  ? "Cancel Countdown"
                  : isAnalyzing
                  ? isPaused
                    ? "Resume Analysis"
                    : "Pause Analysis"
                  : "Start AI Analysis"
              }
            >
              {isPaused || (!isAnalyzing && countdown === null) ? (
                <Play size={13} className="fill-[var(--db-accent-highlight)] ml-0.5" />
              ) : (
                <Pause size={13} className="fill-[var(--db-accent-highlight)]" />
              )}
            </button>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-1.5">
                {countdown !== null ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[var(--db-accent-highlight)] animate-ping" />
                    <span className="text-[var(--db-accent-highlight)] font-extrabold">Starting in {countdown}...</span>
                  </>
                ) : isAnalyzing ? (
                  isPaused ? (
                    <span className="text-amber-500 font-bold">Paused</span>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Analyzing...</span>
                    </>
                  )
                ) : (
                  <span>Ready</span>
                )}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[var(--db-text-muted)]">
                {countdown !== null || !isAnalyzing
                  ? "00:00"
                  : formatTimer(analysisDuration)}
              </span>
            </div>
          </div>

          {/* Right: Action Button (Start / Stop / Cancel) */}
          <div>
            {countdown !== null ? (
              <button
                onClick={clearCountdownTimers}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-200 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer active:scale-95"
              >
                <XCircle size={13} className="text-gray-400" />
                <span>Cancel</span>
              </button>
            ) : isAnalyzing ? (
              <button
                onClick={() => stopCameraStream(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] sm:text-xs shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Square size={11} className="fill-white" />
                <span>Stop Analysis</span>
              </button>
            ) : (
              <button
                onClick={() => triggerStartWithCountdown("camera")}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[var(--db-accent)] text-[var(--db-accent-text)] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-[var(--db-accent-glow)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play size={12} className="fill-[var(--db-accent-text)]" />
                <span>Start Analysis</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraAnalyzer;
