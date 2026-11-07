import React from "react";

const CoinIcon = ({ type = "bronze", className = "w-12 h-12" }) => {
  const configs = {
    bronze: {
      id: "bronze",
      outerRim1: "#e08548",
      outerRim2: "#542407",
      outerRim3: "#b85c22",
      outerRim4: "#2e1102",
      ridge1: "#8f3e10",
      ridge2: "#2d1002",
      face1: "#cf7334",
      face2: "#6b2c09",
      face3: "#3b1503",
      highlight: "#ffbe91",
      shadow: "#1c0701",
      embossText: "#ffc49e",
      embossStroke: "#e27e3d",
      groove: "#2b0f02",
    },
    silver: {
      id: "silver",
      outerRim1: "#ffffff",
      outerRim2: "#4a4a4a",
      outerRim3: "#dcdcdc",
      outerRim4: "#2a2a2a",
      ridge1: "#b5b5b5",
      ridge2: "#2a2a2a",
      face1: "#f2f2f2",
      face2: "#787878",
      face3: "#383838",
      highlight: "#ffffff",
      shadow: "#141414",
      embossText: "#f4f4f4",
      embossStroke: "#c2c2c2",
      groove: "#212121",
    },
    gold: {
      id: "gold",
      outerRim1: "#ffe57f",
      outerRim2: "#543a02",
      outerRim3: "#f5ba18",
      outerRim4: "#2e1e01",
      ridge1: "#d4a413",
      ridge2: "#332201",
      face1: "#ffd642",
      face2: "#8a6204",
      face3: "#473201",
      highlight: "#fff4b8",
      shadow: "#211600",
      embossText: "#fff1ad",
      embossStroke: "#f5ba18",
      groove: "#2e1d01",
    },
  };

  const c = configs[type] || configs.bronze;

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Beveled Rim Gradient */}
        <radialGradient id={`rim-${type}`} cx="36%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c.outerRim1} />
          <stop offset="38%" stopColor={c.outerRim3} />
          <stop offset="80%" stopColor={c.outerRim2} />
          <stop offset="100%" stopColor={c.outerRim4} />
        </radialGradient>

        {/* Outer Machined Ridge Gradient */}
        <linearGradient id={`ridge-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.ridge1} />
          <stop offset="50%" stopColor={c.ridge2} />
          <stop offset="100%" stopColor={c.ridge1} />
        </linearGradient>

        {/* Central Sunburst Faceplate Gradient */}
        <radialGradient id={`face-${type}`} cx="40%" cy="34%" r="62%">
          <stop offset="0%" stopColor={c.face1} />
          <stop offset="55%" stopColor={c.face2} />
          <stop offset="100%" stopColor={c.face3} />
        </radialGradient>

        {/* Emboss Filter for 3D metallic stamped typography */}
        <filter id={`emboss-${type}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.2" dy="1.6" stdDeviation="0.7" floodColor={c.shadow} floodOpacity="0.95" />
          <feDropShadow dx="-1" dy="-1" stdDeviation="0.6" floodColor={c.highlight} floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Layer 1: Outer Raised Rim */}
      <circle cx="50" cy="50" r="48" fill={`url(#rim-${type})`} />

      {/* Layer 2: Beveled Groove & Stepped Ridge */}
      <circle cx="50" cy="50" r="44" stroke={c.groove} strokeWidth="1.2" fill="none" opacity="0.85" />
      <circle cx="50" cy="50" r="42" fill={`url(#ridge-${type})`} />

      {/* Layer 3: Inner Recessed Wall & Polished Faceplate */}
      <circle cx="50" cy="50" r="38.5" stroke={c.highlight} strokeWidth="0.9" strokeOpacity="0.45" fill="none" />
      <circle cx="50" cy="50" r="36.5" fill={`url(#face-${type})`} />

      {/* Concentric Machined Texture Grooves */}
      <circle cx="50" cy="50" r="32.5" stroke={c.groove} strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      <circle cx="50" cy="50" r="28.5" stroke={c.highlight} strokeWidth="0.5" strokeOpacity="0.25" fill="none" />

      {/* EMBOSSED "BC" LOGO WITH DUAL CHEVRONS */}
      <g filter={`url(#emboss-${type})`}>
        {/* Speed Chevrons left of B */}
        <path
          d="M26 38 L30 44 L26 50 M29 38 L33 44 L29 50"
          stroke={c.embossText}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bold Letter "B" */}
        <path
          d="M36 34 L47 34 C50 34 52.5 36 52.5 39 C52.5 41.5 50.8 43.5 48.5 44 C51.5 44.5 53.5 46.8 53.5 49.8 C53.5 53 50.8 55.5 47 55.5 L36 55.5 Z M42 39 L46.5 39 C47.8 39 48.8 40 48.8 41.2 C48.8 42.5 47.8 43.5 46.5 43.5 L42 43.5 Z M42 46.5 L47 46.5 C48.4 46.5 49.5 47.6 49.5 49 C49.5 50.4 48.4 51.5 47 51.5 L42 51.5 Z"
          fill={c.embossText}
        />

        {/* Bold Letter "C" */}
        <path
          d="M69.5 38.5 C68 36 65.5 34 61.5 34 C55.5 34 51 38.5 51 44.8 C51 51 55.5 55.5 61.5 55.5 C65.5 55.5 68.2 53.5 69.8 50.8 L65.5 48.5 C64.5 50 63.2 51 61.5 51 C58.5 51 56.5 48.5 56.5 44.8 C56.5 41 58.5 38.5 61.5 38.5 C63.2 38.5 64.5 39.5 65.5 41 Z"
          fill={c.embossText}
        />
      </g>

      {/* Top Metallic Specular Gleam */}
      <ellipse
        cx="45"
        cy="28"
        rx="22"
        ry="10"
        transform="rotate(-25 45 28)"
        fill={c.highlight}
        opacity="0.18"
      />
    </svg>
  );
};

export default CoinIcon;

