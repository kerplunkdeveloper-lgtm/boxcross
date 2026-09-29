import React, { useState } from "react";
import { ChevronDown, LineChart } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const DATA_RANGES = {
  "Last 30 Days": [
    { label: "Sep 1", score: 50 },
    { label: "Sep 8", score: 65 },
    { label: "Sep 15", score: 72 },
    { label: "Sep 22", score: 64 },
    { label: "Sep 29", score: 86 },
  ],
  "Last 7 Days": [
    { label: "Sep 25", score: 72 },
    { label: "Sep 26", score: 78 },
    { label: "Sep 27", score: 80 },
    { label: "Sep 28", score: 82 },
    { label: "Sep 29", score: 86 },
  ],
  "Last 3 Months": [
    { label: "Jul", score: 52 },
    { label: "Aug", score: 68 },
    { label: "Sep", score: 86 },
  ],
};

const ProgressChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeRange, setActiveRange] = useState("Last 30 Days");
  const [showDropdown, setShowDropdown] = useState(false);

  const data = DATA_RANGES[activeRange] || DATA_RANGES["Last 30 Days"];

  // SVG Chart Dimensions
  const width = 360;
  const height = 150;
  const padLeft = 32;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Map data points
  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1)) * chartW;
    const y = padTop + chartH - (d.score / 100) * chartH;
    return { ...d, x, y };
  });

  // Smooth bezier curve
  const makeSmoothPath = (pts) => {
    if (pts.length < 2) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const linePath = makeSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${padTop + chartH} L ${points[0].x},${padTop + chartH} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--db-card)] border border-[var(--db-card-border)] shadow-xl flex flex-col justify-between relative h-full flex-1 transition-colors duration-200">
      {/* Header with Title & Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--db-text-title)] tracking-wide flex items-center gap-1.5">
          <LineChart size={15} className="text-emerald-500 shrink-0" />
          <span>Progress History</span>
        </h3>

        {/* Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-[var(--db-input-bg)] border border-[var(--db-card-border)] text-[10px] sm:text-[11px] font-semibold text-[var(--db-text)] hover:border-[var(--db-accent-highlight)]/50 transition-all cursor-pointer"
          >
            <span>{activeRange}</span>
            <ChevronDown size={12} className="text-[var(--db-text-muted)]" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-xl shadow-xl z-30 py-1 text-xs">
              {Object.keys(DATA_RANGES).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setActiveRange(range);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[var(--db-input-bg)] text-[11px] transition-colors ${
                    activeRange === range ? "text-[var(--db-accent-highlight)] font-bold" : "text-[var(--db-text)]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Line & Area Chart */}
      <div className="w-full relative my-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* Green Gradient Fill */}
            <linearGradient id="progressAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={isDark ? 0.35 : 0.25} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>

            <filter id="progressLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22c55e" floodOpacity={isDark ? 0.6 : 0.3} />
            </filter>
          </defs>

          {/* Y-Axis Horizontal Grid Lines & Labels */}
          {[100, 75, 50, 25, 0].map((val) => {
            const y = padTop + chartH - (val / 100) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill={isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(15, 23, 42, 0.55)"}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#progressAreaGradient)" />

          {/* Glowing Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter="url(#progressLineGlow)"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? 4 : 2.5}
              fill="#22c55e"
              stroke={isDark ? "#0a0a0a" : "#ffffff"}
              strokeWidth="1.5"
            />
          ))}

          {/* Sep 29 Floating Badge with score */}
          {lastPoint && (
            <g transform={`translate(${lastPoint.x - 12}, ${lastPoint.y - 20})`}>
              <rect
                width="24"
                height="15"
                rx="7.5"
                fill="#22c55e"
                filter="url(#progressLineGlow)"
              />
              <text
                x="12"
                y="11"
                textAnchor="middle"
                fill="#000000"
                fontSize="9"
                fontWeight="900"
                fontFamily="monospace"
              >
                {lastPoint.score}
              </text>
            </g>
          )}

          {/* X-Axis Date Labels */}
          {points.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={height - 6}
              textAnchor="middle"
              fill={isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(15, 23, 42, 0.55)"}
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="500"
            >
              {pt.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ProgressChart;
