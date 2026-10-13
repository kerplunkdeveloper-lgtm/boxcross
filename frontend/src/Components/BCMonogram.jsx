import React from "react";
import logoSrc from "../assets/eventlogo.png";

/**
 * BCMonogram - Box & Cross neon lime "BC" brand emblem.
 * Accurately isolates the top BC monogram from eventlogo.png,
 * matching the user's reference logo image with a neon glow.
 */
const BCMonogram = ({ className = "w-16 h-10", imgClassName = "" }) => {
  return (
    <div
      className={`relative overflow-hidden flex items-start justify-center select-none pointer-events-none ${className}`}
    >
      <img
        src={logoSrc}
        alt="BC Logo"
        className={`w-full max-w-none h-auto object-contain object-top -translate-y-[2%] scale-[1.32] filter drop-shadow-[0_0_12px_rgba(204,241,65,0.75)] ${imgClassName}`}
      />
    </div>
  );
};

export default BCMonogram;
