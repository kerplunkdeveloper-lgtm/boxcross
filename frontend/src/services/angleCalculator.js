/**
 * 3-Point Angle Calculator and Biomechanical Geometry Engine
 * Computes angles between body landmarks (0 - 180 degrees)
 */

export const calculateAngle = (pointA, pointB, pointC) => {
  if (!pointA || !pointB || !pointC) return 180;
  if (
    typeof pointA.x !== "number" ||
    typeof pointB.x !== "number" ||
    typeof pointC.x !== "number"
  ) {
    return 180;
  }

  // Vector BA and BC
  const vBAx = pointA.x - pointB.x;
  const vBAy = pointA.y - pointB.y;
  const vBCx = pointC.x - pointB.x;
  const vBCy = pointC.y - pointB.y;

  const dot = vBAx * vBCx + vBAy * vBCy;
  const magBA = Math.sqrt(vBAx * vBAx + vBAy * vBAy);
  const magBC = Math.sqrt(vBCx * vBCx + vBCy * vBCy);

  if (magBA === 0 || magBC === 0) return 180;

  let cosine = dot / (magBA * magBC);
  // Clamp between -1 and 1 to prevent floating-point NaN in Math.acos
  cosine = Math.max(-1, Math.min(1, cosine));

  const radians = Math.acos(cosine);
  const degrees = Math.round((radians * 180) / Math.PI);
  return degrees;
};

/**
 * Calculates horizontal tilt angle (in degrees, 0 = perfectly level horizontal line)
 */
export const calculateHorizontalTilt = (pointA, pointB) => {
  if (!pointA || !pointB) return 0;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const rad = Math.atan2(dy, dx);
  const deg = Math.abs(Math.round((rad * 180) / Math.PI));
  return deg > 90 ? Math.abs(180 - deg) : deg;
};

/**
 * Calculates vertical plumbline alignment angle (in degrees, 0 = vertical)
 */
export const calculateVerticalTilt = (pointA, pointB) => {
  if (!pointA || !pointB) return 0;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const rad = Math.atan2(dx, dy); // Note: dx/dy relative to vertical
  const deg = Math.abs(Math.round((rad * 180) / Math.PI));
  return deg;
};

/**
 * Calculate Euclidean 2D distance between two landmarks
 */
export const calculateDistance = (pointA, pointB) => {
  if (!pointA || !pointB) return 0;
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
};
