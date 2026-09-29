import React, { useEffect, useRef } from "react";

// Standard 33 MediaPipe pose landmark indices
const LM = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

const SkeletonOverlay = ({
  landmarks,
  width,
  height,
  mirrored = true,
  showGuides = true,
  showAngles = true,
  jointAngles = {},
  visualState = "GREEN",
  currentMode = "Squat Analysis",
  exerciseStats = {},
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    // Helper: Map normalized landmark to canvas coordinates
    const mapPoint = (lm) => {
      if (!lm) return null;
      let x = lm.x * w;
      if (mirrored) {
        x = w - x;
      }
      const y = lm.y * h;
      return { x, y, z: lm.z ?? 0, visibility: lm.visibility ?? 1 };
    };

    // Extract mapped landmarks
    const pNose = mapPoint(landmarks[LM.NOSE]);
    const pLeftEar = mapPoint(landmarks[LM.LEFT_EAR]);
    const pRightEar = mapPoint(landmarks[LM.RIGHT_EAR]);
    const pLeftShoulder = mapPoint(landmarks[LM.LEFT_SHOULDER]);
    const pRightShoulder = mapPoint(landmarks[LM.RIGHT_SHOULDER]);
    const pLeftElbow = mapPoint(landmarks[LM.LEFT_ELBOW]);
    const pRightElbow = mapPoint(landmarks[LM.RIGHT_ELBOW]);
    const pLeftWrist = mapPoint(landmarks[LM.LEFT_WRIST]);
    const pRightWrist = mapPoint(landmarks[LM.RIGHT_WRIST]);
    const pLeftHip = mapPoint(landmarks[LM.LEFT_HIP]);
    const pRightHip = mapPoint(landmarks[LM.RIGHT_HIP]);
    const pLeftKnee = mapPoint(landmarks[LM.LEFT_KNEE]);
    const pRightKnee = mapPoint(landmarks[LM.RIGHT_KNEE]);
    const pLeftAnkle = mapPoint(landmarks[LM.LEFT_ANKLE]);
    const pRightAnkle = mapPoint(landmarks[LM.RIGHT_ANKLE]);
    const pLeftFoot = mapPoint(landmarks[LM.LEFT_FOOT_INDEX]);
    const pRightFoot = mapPoint(landmarks[LM.RIGHT_FOOT_INDEX]);

    if (!pLeftShoulder || !pRightShoulder || !pLeftHip || !pRightHip) return;

    // Computed midpoints & anatomical nodes
    const pMidShoulder = {
      x: (pLeftShoulder.x + pRightShoulder.x) / 2,
      y: (pLeftShoulder.y + pRightShoulder.y) / 2,
      visibility: Math.min(pLeftShoulder.visibility, pRightShoulder.visibility),
    };
    const pMidHip = {
      x: (pLeftHip.x + pRightHip.x) / 2,
      y: (pLeftHip.y + pRightHip.y) / 2,
      visibility: Math.min(pLeftHip.visibility, pRightHip.visibility),
    };
    const pSternum = {
      x: pMidShoulder.x * 0.7 + pMidHip.x * 0.3,
      y: pMidShoulder.y * 0.7 + pMidHip.y * 0.3,
      visibility: pMidShoulder.visibility,
    };
    const pSacrum = {
      x: (pLeftHip.x + pRightHip.x) / 2,
      y: (pLeftHip.y + pRightHip.y) / 2 + 10,
      visibility: pMidHip.visibility,
    };

    // Calculate dynamic angles in radians and degrees
    const getAngleDegrees = (A, B, C) => {
      if (!A || !B || !C) return 0;
      const vBAx = A.x - B.x;
      const vBAy = A.y - B.y;
      const vBCx = C.x - B.x;
      const vBCy = C.y - B.y;
      const dot = vBAx * vBCx + vBAy * vBCy;
      const magBA = Math.sqrt(vBAx * vBAx + vBAy * vBAy);
      const magBC = Math.sqrt(vBCx * vBCx + vBCy * vBCy);
      if (magBA === 0 || magBC === 0) return 0;
      let cosVal = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
      return Math.round((Math.acos(cosVal) * 180) / Math.PI);
    };

    const leftKneeDeg = getAngleDegrees(pLeftHip, pLeftKnee, pLeftAnkle);
    const rightKneeDeg = getAngleDegrees(pRightHip, pRightKnee, pRightAnkle);
    const avgKneeDeg = Math.round((leftKneeDeg + rightKneeDeg) / 2);

    const leftElbowDeg = getAngleDegrees(pLeftShoulder, pLeftElbow, pLeftWrist);
    const rightElbowDeg = getAngleDegrees(pRightShoulder, pRightElbow, pRightWrist);
    const avgElbowDeg = Math.round((leftElbowDeg + rightElbowDeg) / 2);

    const leftHipDeg = getAngleDegrees(pLeftShoulder, pLeftHip, pLeftKnee);
    const rightHipDeg = getAngleDegrees(pRightShoulder, pRightHip, pRightKnee);
    const avgHipDeg = Math.round((leftHipDeg + rightHipDeg) / 2);

    // Dynamic exercise state detection for bone coloring
    const isSquat = currentMode.includes("Squat");
    const isPushup = currentMode.includes("Push-Up");
    const isPlank = currentMode.includes("Plank");

    // Squat parallel depth check: hip y reaches knee y level
    const avgHipY = (pLeftHip.y + pRightHip.y) / 2;
    const avgKneeY = (pLeftKnee ? pLeftKnee.y : h) * 0.5 + (pRightKnee ? pRightKnee.y : h) * 0.5;
    const isParallelDepth = isSquat && avgHipY >= avgKneeY - 14;

    // Knee valgus check: knees closer together than ankles during squat descent
    const kneeSpacing = pLeftKnee && pRightKnee ? Math.abs(pLeftKnee.x - pRightKnee.x) : 100;
    const ankleSpacing = pLeftAnkle && pRightAnkle ? Math.abs(pLeftAnkle.x - pRightAnkle.x) : 100;
    const isKneeValgus = isSquat && avgKneeDeg < 135 && kneeSpacing < ankleSpacing * 0.88;

    // Helper: Draw dynamic anatomical bone with glow & inner core
    const drawBone = (p1, p2, color = "#10b981", lineWidth = 4.5, isDashed = false) => {
      if (!p1 || !p2 || p1.visibility < 0.3 || p2.visibility < 0.3) return;
      ctx.save();
      ctx.beginPath();
      if (isDashed) ctx.setLineDash([5, 5]);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      // Outer glow
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Inner crisp core
      ctx.lineWidth = Math.max(1.5, lineWidth * 0.38);
      ctx.strokeStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    };

    // Helper: Draw anatomical joint node
    const drawJoint = (p, label = "", color = "#e5ff00", radius = 5.5) => {
      if (!p || p.visibility < 0.3) return;
      ctx.save();
      // Outer glow circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fill();

      // Inner white core
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.fill();

      if (label && showAngles) {
        ctx.fillStyle = "rgba(10, 10, 10, 0.85)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.font = "bold 9px monospace";
        const txtW = ctx.measureText(label).width;
        ctx.fillRect(p.x + 8, p.y - 7, txtW + 8, 14);
        ctx.strokeRect(p.x + 8, p.y - 7, txtW + 8, 14);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, p.x + 12, p.y + 4);
      }
      ctx.restore();
    };

    // Helper: Draw curved angle arc directly at joint vertex
    const drawAngleArc = (A, B, C, deg, color = "#e5ff00", label = "") => {
      if (!A || !B || !C || !deg || deg <= 0) return;
      const vBAx = A.x - B.x;
      const vBAy = A.y - B.y;
      const vBCx = C.x - B.x;
      const vBCy = C.y - B.y;

      let startAngle = Math.atan2(vBAy, vBAx);
      let endAngle = Math.atan2(vBCy, vBCx);

      // Arc radius
      const arcRadius = 24;

      ctx.save();
      ctx.beginPath();
      ctx.arc(B.x, B.y, arcRadius, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Text Badge
      const midAngle = (startAngle + endAngle) / 2;
      const tx = B.x + Math.cos(midAngle) * (arcRadius + 14);
      const ty = B.y + Math.sin(midAngle) * (arcRadius + 14);

      const text = `${label ? label + " " : ""}${deg}°`;
      ctx.font = "bold 10px monospace";
      const tw = ctx.measureText(text).width;

      ctx.fillStyle = "rgba(10, 10, 10, 0.9)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      if (ctx.roundRect) {
        ctx.roundRect(tx - tw / 2 - 4, ty - 8, tw + 8, 16, 4);
      } else {
        ctx.rect(tx - tw / 2 - 4, ty - 8, tw + 8, 16);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, tx, ty);
      ctx.restore();
    };

    // ── 1. DRAW VERTEBRAL SPINE COLUMN ──
    const spineColor = visualState === "RED" ? "#ef4444" : "#10b981";
    ctx.save();
    ctx.strokeStyle = spineColor;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.shadowColor = spineColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(pMidShoulder.x, pMidShoulder.y);
    ctx.quadraticCurveTo(pSternum.x, pSternum.y, pMidHip.x, pMidHip.y);
    ctx.stroke();

    // 5 Vertebral segment nodes along spine
    for (let i = 1; i <= 4; i++) {
      const t = i / 5;
      const sx = (1 - t) * (1 - t) * pMidShoulder.x + 2 * (1 - t) * t * pSternum.x + t * t * pMidHip.x;
      const sy = (1 - t) * (1 - t) * pMidShoulder.y + 2 * (1 - t) * t * pSternum.y + t * t * pMidHip.y;
      ctx.fillStyle = "#e5ff00";
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── 2. DRAW ANATOMICAL SKELETON BONES ──
    // Clavicle & Shoulder Girdle
    drawBone(pLeftShoulder, pRightShoulder, "#06b6d4", 5);
    drawBone(pMidShoulder, pNose, "#06b6d4", 4);

    // Arms (Left & Right)
    const leftArmColor = isPushup && leftElbowDeg < 100 ? "#10b981" : "#3b82f6";
    const rightArmColor = isPushup && rightElbowDeg < 100 ? "#10b981" : "#3b82f6";
    drawBone(pLeftShoulder, pLeftElbow, leftArmColor, 4.5);
    drawBone(pLeftElbow, pLeftWrist, leftArmColor, 4);
    drawBone(pRightShoulder, pRightElbow, rightArmColor, 4.5);
    drawBone(pRightElbow, pRightWrist, rightArmColor, 4);

    // Pelvic Basin Girdle
    drawBone(pLeftHip, pRightHip, "#8b5cf6", 5);
    drawBone(pLeftShoulder, pLeftHip, "#10b981", 3.5);
    drawBone(pRightShoulder, pRightHip, "#10b981", 3.5);

    // Legs (Thigh / Femur & Shin / Tibia)
    let legColor = "#10b981";
    if (isSquat) {
      if (isKneeValgus) legColor = "#ef4444"; // Red on valgus cave
      else if (isParallelDepth) legColor = "#e5ff00"; // Neon yellow at depth
      else legColor = "#10b981";
    }

    drawBone(pLeftHip, pLeftKnee, legColor, 5);
    drawBone(pLeftKnee, pLeftAnkle, legColor, 4.5);
    drawBone(pRightHip, pRightKnee, legColor, 5);
    drawBone(pRightKnee, pRightAnkle, legColor, 4.5);

    // Feet base
    if (pLeftFoot) drawBone(pLeftAnkle, pLeftFoot, "#10b981", 3.5);
    if (pRightFoot) drawBone(pRightAnkle, pRightFoot, "#10b981", 3.5);

    // ── 3. DRAW JOINTS WITH ANGLE ARCS ──
    // Head Halo
    if (pNose) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pNose.x, pNose.y - 10, 20, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(229, 255, 0, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      drawJoint(pNose, "", "#e5ff00", 4.5);
    }

    // Shoulder & Elbow Joints
    drawJoint(pLeftShoulder, "", "#06b6d4");
    drawJoint(pRightShoulder, "", "#06b6d4");
    drawJoint(pLeftElbow, "", leftArmColor);
    drawJoint(pRightElbow, "", rightArmColor);
    drawJoint(pLeftWrist, "", "#38bdf8", 4);
    drawJoint(pRightWrist, "", "#38bdf8", 4);

    // Hip, Knee & Ankle Joints
    drawJoint(pLeftHip, "", "#8b5cf6");
    drawJoint(pRightHip, "", "#8b5cf6");
    drawJoint(pLeftKnee, "", isKneeValgus ? "#ef4444" : legColor, 6.5);
    drawJoint(pRightKnee, "", isKneeValgus ? "#ef4444" : legColor, 6.5);
    drawJoint(pLeftAnkle, "", "#10b981", 4.5);
    drawJoint(pRightAnkle, "", "#10b981", 4.5);

    // ── 4. REAL-TIME EXERCISE ANGLE ARCS ──
    if (showAngles) {
      // Knee Angle Arc (Left & Right)
      if (pLeftKnee && leftKneeDeg > 0) {
        const kColor = isKneeValgus ? "#ef4444" : isParallelDepth ? "#10b981" : "#e5ff00";
        drawAngleArc(pLeftHip, pLeftKnee, pLeftAnkle, leftKneeDeg, kColor, "Knee");
      }
      if (pRightKnee && rightKneeDeg > 0 && Math.abs(leftKneeDeg - rightKneeDeg) > 8) {
        drawAngleArc(pRightHip, pRightKnee, pRightAnkle, rightKneeDeg, "#e5ff00", "R-Knee");
      }

      // Elbow Angle Arc (for Pushups / Bench)
      if (isPushup && pLeftElbow && leftElbowDeg > 0) {
        const eColor = leftElbowDeg <= 95 ? "#10b981" : "#3b82f6";
        drawAngleArc(pLeftShoulder, pLeftElbow, pLeftWrist, leftElbowDeg, eColor, "Elbow");
      }

      // Hip Hinge Angle Arc (for Squats / Deadlifts)
      if (pLeftHip && leftHipDeg > 0 && !isPushup) {
        drawAngleArc(pLeftShoulder, pLeftHip, pLeftKnee, leftHipDeg, "#a78bfa", "Hip");
      }
    }

    // ── 5. EXERCISE DEPTH TARGET & WARNING OVERLAYS ──
    if (isSquat && showGuides) {
      // Parallel Depth Plane Guide through knees
      const kneeY = (pLeftKnee?.y || avgKneeY);
      ctx.save();
      ctx.lineWidth = isParallelDepth ? 2.5 : 1.5;
      ctx.setLineDash(isParallelDepth ? [] : [6, 4]);
      ctx.strokeStyle = isParallelDepth ? "#10b981" : "rgba(229, 255, 0, 0.45)";
      ctx.beginPath();
      ctx.moveTo(w * 0.15, kneeY);
      ctx.lineTo(w * 0.85, kneeY);
      ctx.stroke();

      // Parallel Depth Status Label
      ctx.font = "black 11px sans-serif";
      const labelText = isParallelDepth ? "✓ PARALLEL DEPTH REACHED" : "— SQUAT PARALLEL PLANE —";
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillStyle = isParallelDepth ? "rgba(16, 185, 129, 0.9)" : "rgba(0, 0, 0, 0.75)";
      ctx.strokeStyle = isParallelDepth ? "#10b981" : "rgba(229, 255, 0, 0.4)";
      if (ctx.roundRect) {
        ctx.roundRect(w / 2 - textWidth / 2 - 8, kneeY - 22, textWidth + 16, 20, 6);
      } else {
        ctx.rect(w / 2 - textWidth / 2 - 8, kneeY - 22, textWidth + 16, 20);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isParallelDepth ? "#ffffff" : "#e5ff00";
      ctx.textAlign = "center";
      ctx.fillText(labelText, w / 2, kneeY - 8);
      ctx.restore();

      // Knee Valgus Inward Warning Arrows
      if (isKneeValgus && pLeftKnee && pRightKnee) {
        ctx.save();
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;

        // Warning banner above knees
        const warnText = "⚠ KNEES CAVING IN — PUSH OUT";
        const ww = ctx.measureText(warnText).width;
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.fillRect(w / 2 - ww / 2 - 8, pLeftKnee.y - 36, ww + 16, 20);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(warnText, w / 2, pLeftKnee.y - 22);

        // Arrows pushing outward from knees
        ctx.beginPath();
        ctx.moveTo(pLeftKnee.x, pLeftKnee.y);
        ctx.lineTo(pLeftKnee.x - 20, pLeftKnee.y);
        ctx.moveTo(pRightKnee.x, pRightKnee.y);
        ctx.lineTo(pRightKnee.x + 20, pRightKnee.y);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ── 6. CENTER OF GRAVITY & BALANCE PLUMB LINE ──
    if (showGuides && pSternum && pLeftAnkle && pRightAnkle) {
      const baseOfSupportX = (pLeftAnkle.x + pRightAnkle.x) / 2;
      const groundY = Math.max(pLeftAnkle.y, pRightAnkle.y) + 10;

      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.beginPath();
      ctx.moveTo(pSternum.x, pSternum.y);
      ctx.lineTo(pSternum.x, groundY);
      ctx.stroke();

      // Center of gravity point on ground
      ctx.setLineDash([]);
      ctx.fillStyle = Math.abs(pSternum.x - baseOfSupportX) < 18 ? "#10b981" : "#f59e0b";
      ctx.beginPath();
      ctx.arc(pSternum.x, groundY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [
    landmarks,
    width,
    height,
    mirrored,
    showGuides,
    showAngles,
    jointAngles,
    visualState,
    currentMode,
    exerciseStats,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width || 640}
      height={height || 480}
      className="absolute inset-0 pointer-events-none w-full h-full object-contain z-10"
    />
  );
};

export default SkeletonOverlay;
