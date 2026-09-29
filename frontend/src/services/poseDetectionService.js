/**
 * Real-time MediaPipe Pose Detection Service
 * Dynamically loads official @mediapipe/tasks-vision PoseLandmarker
 * Extracts 33 standard body landmarks with fallbacks for testing/simulation
 */

let poseLandmarker = null;
let isInitializing = false;
let initError = null;

// Official Google MediaPipe WASM and Model asset paths
const VISION_CDN_ESM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm";
const WASM_LOADER_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const POSE_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

export class PoseDetectionService {
  constructor() {
    this.videoStream = null;
    this.isModelLoaded = false;
    this.isCameraActive = false;
    this.isSimulatedMode = false;
    this.simulationPhase = 0;
  }

  /**
   * Initializes MediaPipe Pose Landmarker using browser WASM
   */
  async initPoseLandmarker() {
    if (poseLandmarker) {
      this.isModelLoaded = true;
      return true;
    }

    if (isInitializing) {
      // Wait for existing initialization
      while (isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return !!poseLandmarker;
    }

    isInitializing = true;
    try {
      // Dynamically import ESM from CDN
      const vision = await import(/* @vite-ignore */ VISION_CDN_ESM);
      const { FilesetResolver, PoseLandmarker } = vision;

      const visionWasm = await FilesetResolver.forVisionTasks(WASM_LOADER_PATH);

      poseLandmarker = await PoseLandmarker.createFromOptions(visionWasm, {
        baseOptions: {
          modelAssetPath: POSE_MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.isModelLoaded = true;
      isInitializing = false;
      return true;
    } catch (err) {
      console.warn("MediaPipe Pose Landmarker GPU init warning, falling back to CPU or local engine:", err);
      try {
        // Fallback attempt with CPU delegate
        const vision = await import(/* @vite-ignore */ VISION_CDN_ESM);
        const { FilesetResolver, PoseLandmarker } = vision;
        const visionWasm = await FilesetResolver.forVisionTasks(WASM_LOADER_PATH);

        poseLandmarker = await PoseLandmarker.createFromOptions(visionWasm, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.45,
          minPosePresenceConfidence: 0.45,
          minTrackingConfidence: 0.45,
        });

        this.isModelLoaded = true;
        isInitializing = false;
        return true;
      } catch (cpuErr) {
        console.warn("Could not load MediaPipe remote WASM directly (e.g. offline). Kinematic simulator active:", cpuErr);
        initError = cpuErr;
        isInitializing = false;
        this.isModelLoaded = false;
        return false;
      }
    }
  }

  /**
   * Request webcam stream from user
   */
  async startCamera(videoElement, options = {}) {
    try {
      if (this.videoStream) {
        this.stopCamera(videoElement);
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: options.facingMode || "user",
          deviceId: options.deviceId ? { exact: options.deviceId } : undefined,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoStream = stream;
      if (videoElement) {
        videoElement.srcObject = stream;
        await videoElement.play();
      }
      this.isCameraActive = true;
      return { success: true, stream };
    } catch (error) {
      console.error("Camera access error:", error);
      this.isCameraActive = false;
      return {
        success: false,
        error: error.message || "Camera access denied or device not found",
      };
    }
  }

  /**
   * Stop camera tracks cleanly
   */
  stopCamera(videoElement) {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    this.isCameraActive = false;
  }

  /**
   * Detect pose from current video frame
   */
  detectPose(videoElement, timestamp = performance.now()) {
    if (poseLandmarker && videoElement && videoElement.readyState >= 2) {
      try {
        const result = poseLandmarker.detectForVideo(videoElement, timestamp);
        if (result && result.landmarks && result.landmarks.length > 0) {
          return {
            detected: true,
            landmarks: result.landmarks[0],
            worldLandmarks: result.worldLandmarks ? result.worldLandmarks[0] : null,
            isSimulated: false,
          };
        }
      } catch (err) {
        // detection frame error
      }
    }

    // If simulation active or no pose detected yet
    if (this.isSimulatedMode) {
      const simulated = this.generateKinematicLandmarks(this.currentMode || "Posture Analysis");
      return {
        detected: true,
        landmarks: simulated,
        worldLandmarks: null,
        isSimulated: true,
      };
    }

    return {
      detected: false,
      landmarks: null,
      worldLandmarks: null,
      isSimulated: false,
    };
  }

  /**
   * Kinematic Landmark Generator:
   * Generates anatomically accurate 33-point coordinates for testing exercises
   * or when webcam is unavailable / preview mode.
   */
  generateKinematicLandmarks(mode = "Posture Analysis") {
    this.simulationPhase += 0.04;
    const t = this.simulationPhase;

    // Base body center
    let headY = 0.22;
    let shoulderY = 0.32;
    let hipY = 0.54;
    let kneeY = 0.72;
    let ankleY = 0.90;

    let hipShiftX = 0;
    let kneeSpread = 0.12;

    if (mode.includes("Squat")) {
      // Periodic squat depth cycle
      const cycle = (Math.sin(t) + 1) / 2; // 0 to 1
      hipY = 0.48 + cycle * 0.24;
      kneeY = 0.68 + cycle * 0.06;
      kneeSpread = 0.12 + cycle * 0.05;
      shoulderY = 0.28 + cycle * 0.22;
      headY = 0.18 + cycle * 0.22;
      ankleY = 0.88;
    } else if (mode.includes("Push-Up")) {
      // Horizontal pushup motion
      const cycle = (Math.sin(t) + 1) / 2;
      shoulderY = 0.46 + cycle * 0.18;
      headY = 0.42 + cycle * 0.18;
      hipY = 0.48 + cycle * 0.12;
      kneeY = 0.52 + cycle * 0.08;
      ankleY = 0.56 + cycle * 0.04;
    } else if (mode.includes("Plank")) {
      // Isometric core hold with subtle breathing
      const cycle = 0.015 * Math.sin(t);
      shoulderY = 0.46 + cycle;
      headY = 0.42 + cycle;
      hipY = 0.48 + cycle * 0.5;
      kneeY = 0.52;
      ankleY = 0.56;
    } else if (mode.includes("Lunge")) {
      // Dynamic lunge depth
      const cycle = (Math.sin(t) + 1) / 2;
      hipY = 0.52 + cycle * 0.16;
      kneeY = 0.70 + cycle * 0.10;
      shoulderY = 0.32 + cycle * 0.14;
      headY = 0.22 + cycle * 0.14;
      ankleY = 0.88;
    } else if (mode.includes("Deadlift")) {
      // Hip hinge motion
      const cycle = (Math.sin(t) + 1) / 2;
      hipY = 0.52 + cycle * 0.08;
      kneeY = 0.72 + cycle * 0.04;
      shoulderY = 0.30 + cycle * 0.24;
      headY = 0.20 + cycle * 0.24;
      ankleY = 0.88;
    }

    // 33 Landmarks normalized (0.0 to 1.0)
    const points = [];
    for (let i = 0; i < 33; i++) {
      points.push({ x: 0.5, y: 0.5, z: 0, visibility: 0.95 });
    }

    // Head
    points[0] = { x: 0.50 + 0.01 * Math.sin(t * 0.5), y: headY, z: 0, visibility: 0.98 }; // nose
    points[1] = { x: 0.49, y: headY - 0.02, z: 0, visibility: 0.95 }; // left eye inner
    points[2] = { x: 0.48, y: headY - 0.02, z: 0, visibility: 0.95 }; // left eye
    points[3] = { x: 0.47, y: headY - 0.02, z: 0, visibility: 0.95 }; // left eye outer
    points[4] = { x: 0.51, y: headY - 0.02, z: 0, visibility: 0.95 }; // right eye inner
    points[5] = { x: 0.52, y: headY - 0.02, z: 0, visibility: 0.95 }; // right eye
    points[6] = { x: 0.53, y: headY - 0.02, z: 0, visibility: 0.95 }; // right eye outer
    points[7] = { x: 0.46, y: headY - 0.01, z: 0, visibility: 0.95 }; // left ear
    points[8] = { x: 0.54, y: headY - 0.01, z: 0, visibility: 0.95 }; // right ear
    points[9] = { x: 0.49, y: headY + 0.02, z: 0, visibility: 0.95 }; // mouth left
    points[10] = { x: 0.51, y: headY + 0.02, z: 0, visibility: 0.95 }; // mouth right

    // Shoulders
    const shoulderWidth = 0.14;
    points[11] = { x: 0.50 - shoulderWidth, y: shoulderY, z: -0.05, visibility: 0.98 }; // left shoulder
    points[12] = { x: 0.50 + shoulderWidth, y: shoulderY, z: -0.05, visibility: 0.98 }; // right shoulder

    // Elbows
    const elbowOffset = mode.includes("Push-Up") ? 0.08 : 0.04;
    points[13] = { x: 0.50 - shoulderWidth - elbowOffset, y: shoulderY + 0.14, z: 0, visibility: 0.95 }; // left elbow
    points[14] = { x: 0.50 + shoulderWidth + elbowOffset, y: shoulderY + 0.14, z: 0, visibility: 0.95 }; // right elbow

    // Wrists
    points[15] = { x: 0.50 - shoulderWidth - 0.02, y: shoulderY + 0.26, z: 0.05, visibility: 0.95 }; // left wrist
    points[16] = { x: 0.50 + shoulderWidth + 0.02, y: shoulderY + 0.26, z: 0.05, visibility: 0.95 }; // right wrist

    // Hands
    points[17] = { x: points[15].x - 0.01, y: points[15].y + 0.03, z: 0, visibility: 0.9 };
    points[18] = { x: points[16].x + 0.01, y: points[16].y + 0.03, z: 0, visibility: 0.9 };
    points[19] = { x: points[15].x, y: points[15].y + 0.04, z: 0, visibility: 0.9 };
    points[20] = { x: points[16].x, y: points[16].y + 0.04, z: 0, visibility: 0.9 };
    points[21] = { x: points[15].x + 0.01, y: points[15].y + 0.02, z: 0, visibility: 0.9 };
    points[22] = { x: points[16].x - 0.01, y: points[16].y + 0.02, z: 0, visibility: 0.9 };

    // Hips
    const hipWidth = 0.09;
    points[23] = { x: 0.50 - hipWidth + hipShiftX, y: hipY, z: 0, visibility: 0.98 }; // left hip
    points[24] = { x: 0.50 + hipWidth + hipShiftX, y: hipY, z: 0, visibility: 0.98 }; // right hip

    // Knees
    points[25] = { x: 0.50 - kneeSpread, y: kneeY, z: 0.05, visibility: 0.98 }; // left knee
    points[26] = { x: 0.50 + kneeSpread, y: kneeY, z: 0.05, visibility: 0.98 }; // right knee

    // Ankles
    points[27] = { x: 0.50 - 0.11, y: ankleY, z: 0.08, visibility: 0.98 }; // left ankle
    points[28] = { x: 0.50 + 0.11, y: ankleY, z: 0.08, visibility: 0.98 }; // right ankle

    // Feet
    points[29] = { x: points[27].x - 0.01, y: ankleY + 0.02, z: 0.1, visibility: 0.95 }; // left heel
    points[30] = { x: points[28].x + 0.01, y: ankleY + 0.02, z: 0.1, visibility: 0.95 }; // right heel
    points[31] = { x: points[27].x + 0.02, y: ankleY + 0.03, z: -0.05, visibility: 0.95 }; // left foot index
    points[32] = { x: points[28].x - 0.02, y: ankleY + 0.03, z: -0.05, visibility: 0.95 }; // right foot index

    return points;
  }
}

export const poseDetectionService = new PoseDetectionService();
