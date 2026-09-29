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
} from "lucide-react";
import SkeletonOverlay from "./SkeletonOverlay";
import { poseDetectionService } from "../../services/poseDetectionService";
import { toast } from "react-hot-toast";

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
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const prevRepsRef = useRef(exerciseStats?.reps || 0);

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

  const lastFpsTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Initialize MediaPipe model
  useEffect(() => {
    let mounted = true;
    poseDetectionService.initPoseLandmarker().then((success) => {
      if (mounted) {
        if (!success) {
          console.log("Using browser kinematic simulator if camera unavailable");
        }
      }
    });
    return () => {
      mounted = false;
      stopCameraStream();
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

  // Start Camera
  const handleStartCamera = async () => {
    try {
      setIsDemoMode(false);
      poseDetectionService.isSimulatedMode = false;
      const res = await poseDetectionService.startCamera(videoRef.current, {
        facingMode,
      });

      if (res.success) {
        setHasPermission(true);
        setIsAnalyzing(true);
        setIsPaused(false);
        setAnalysisDuration(0);
        startDetectionLoop();
        toast.success("Camera connected. AI Pose tracking active.");
      } else {
        setHasPermission(false);
        toast.error("Camera access denied. Launching AI simulator.");
        handleStartDemo();
      }
    } catch (err) {
      setHasPermission(false);
      handleStartDemo();
    }
  };

  // Start Kinematic Simulator
  const handleStartDemo = () => {
    setIsDemoMode(true);
    poseDetectionService.isSimulatedMode = true;
    setIsAnalyzing(true);
    setIsPaused(false);
    setAnalysisDuration(0);
    startDetectionLoop();
    toast.success("AI Kinematic Motion Simulator active.");
  };

  // Stop Camera
  const stopCameraStream = () => {
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
  };

  // Pause / Resume
  const handleTogglePause = () => {
    if (!isAnalyzing) return;
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
      className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl flex flex-col justify-between select-none ${
        isFullscreen ? "h-screen rounded-none" : "min-h-[440px] lg:min-h-[480px]"
      }`}
      style={{
        background: "var(--db-card, #131d27)",
        borderColor: "var(--db-card-border, #1f2d3d)",
      }}
    >
      {/* ── CENTRAL VIDEO & CANVAS VIEWPORT ── */}
      <div className="relative flex-grow flex items-center justify-center bg-[#070b0f] overflow-hidden min-h-[360px]">
        {/* Top Left: LIVE RED PILL BADGE (matching mockup) */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="tracking-wider text-[11px]">LIVE</span>
        </div>

        {/* Top Right: Fullscreen Toggle (matching mockup) */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-xl bg-black/60 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-md"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Right Floating Vertical Control Strip (matching mockup) */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
          {/* Camera Button */}
          <button
            onClick={isAnalyzing ? stopCameraStream : handleStartCamera}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all cursor-pointer shadow-lg ${
              isAnalyzing && !isDemoMode
                ? "bg-[#4ade80] text-black font-bold shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                : "bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10"
            }`}
            title="Toggle Device Camera"
          >
            <Camera size={18} className={isAnalyzing && !isDemoMode ? "text-black" : "text-gray-300"} />
            <span className="text-[10px] mt-1 font-semibold">Camera</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10 transition-all cursor-pointer shadow-lg"
            title="Upload pre-recorded clip or photo"
          >
            <Upload size={18} />
            <span className="text-[10px] mt-1 font-semibold">Upload</span>
          </button>

          {/* Mirror Button */}
          <button
            onClick={() => setMirrored(!mirrored)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all cursor-pointer shadow-lg ${
              mirrored
                ? "bg-neutral-900/90 text-[#4ade80] border border-[#4ade80]/40"
                : "bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10"
            }`}
            title="Mirror Video Feed"
          >
            <RefreshCw size={17} className={mirrored ? "text-[#4ade80]" : "text-gray-300"} />
            <span className="text-[10px] mt-1 font-semibold">Mirror</span>
          </button>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-gray-300 border border-white/10 transition-all cursor-pointer shadow-lg"
              title="Camera Settings"
            >
              <Settings size={18} />
              <span className="text-[10px] mt-1 font-semibold">Settings</span>
            </button>

            {/* Settings Popover */}
            {showSettings && (
              <div className="absolute right-16 top-0 w-52 p-3 rounded-2xl bg-[#0f1722] border border-white/15 shadow-2xl z-30 space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-1">
                  AI Overlay Guides
                </p>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Plumb Line Guides</span>
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="accent-emerald-400"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Joint Angle Arcs</span>
                  <input
                    type="checkbox"
                    checked={showAngles}
                    onChange={(e) => setShowAngles(e.target.checked)}
                    className="accent-emerald-400"
                  />
                </label>
                <label className="flex items-center justify-between text-gray-300 cursor-pointer">
                  <span>Skeleton Overlay</span>
                  <input
                    type="checkbox"
                    checked={showSkeleton}
                    onChange={(e) => setShowSkeleton(e.target.checked)}
                    className="accent-emerald-400"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
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

        {/* Standby / Initial State Overlay */}
        {!isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/70 backdrop-blur-[2px] z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(74,222,128,0.2)]">
              <Camera size={30} />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide mb-1">
              AI Body &amp; Posture Camera
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed">
              Open your camera or launch the simulator for real-time 33-landmark AI posture and form analysis.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleStartCamera}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4ade80] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera size={14} className="fill-black" />
                <span>Open Device Camera</span>
              </button>

              <button
                onClick={handleStartDemo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-[#4ade80]" />
                <span>Test Live Simulation</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* ── BOTTOM CONTROL BAR (matching mockup) ── */}
      <div className="p-3.5 md:p-4 bg-[#0a1017] border-t border-[var(--db-card-border,#1f2d3d)] flex items-center justify-between gap-3 z-20">
        {/* Left: Pulsing Audio/Pulse Button + "Analyzing..." + "00:12" */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePause}
            className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(74,222,128,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPaused ? "Resume Analysis" : "Pause Analysis"}
          >
            {isPaused ? <Play size={14} className="fill-emerald-400" /> : <Pause size={14} className="fill-emerald-400" />}
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide">
              {isAnalyzing ? (isPaused ? "Paused" : "Analyzing...") : "Ready"}
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              {formatTimer(analysisDuration)}
            </span>
          </div>
        </div>

        {/* Right: Stop Analysis Button (matching mockup) */}
        <div>
          <button
            onClick={isAnalyzing ? stopCameraStream : handleStartCamera}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700/80 text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Square size={12} className="fill-white" />
            <span>{isAnalyzing ? "Stop Analysis" : "Start Analysis"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraAnalyzer;
