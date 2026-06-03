import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

/* ─── Color palette per category index ─── */
const CATEGORY_COLORS = [
  {
    bg: "#3b82f6",
    path: "rgba(59,130,246,0.35)",
    dot: "rgba(59,130,246,0.9)",
    deco: "#93c5fd",
    label: "#3b82f6",
    labelDark: "#60a5fa",
    glow: "rgba(59,130,246,0.25)",
    ring: "rgba(59,130,246,0.15)",
  },
  {
    bg: "#facc15",
    path: "rgba(250,204,21,0.35)",
    dot: "rgba(250,204,21,0.9)",
    deco: "#fde68a",
    label: "#ca8a04",
    labelDark: "#facc15",
    glow: "rgba(250,204,21,0.2)",
    ring: "rgba(250,204,21,0.12)",
  },
  {
    bg: "#fb923c",
    path: "rgba(251,146,60,0.35)",
    dot: "rgba(251,146,60,0.9)",
    deco: "#fdba74",
    label: "#ea580c",
    labelDark: "#fb923c",
    glow: "rgba(251,146,60,0.22)",
    ring: "rgba(251,146,60,0.12)",
  },
  {
    bg: "#4ade80",
    path: "rgba(74,222,128,0.35)",
    dot: "rgba(74,222,128,0.9)",
    deco: "#86efac",
    label: "#16a34a",
    labelDark: "#4ade80",
    glow: "rgba(74,222,128,0.2)",
    ring: "rgba(74,222,128,0.12)",
  },
];

const CATEGORY_NAMES = ["Frontend", "Tools", "Backend", "Databases"];

function categoryFor(skill, index) {
  if (skill.category) {
    const cats = ["Frontend", "Tools", "Backend", "Database"];
    const found = cats.findIndex((c) =>
      skill.category.toLowerCase().includes(c.toLowerCase())
    );
    if (found !== -1) return found;
  }
  return index % CATEGORY_COLORS.length;
}

function getOrganisedPos(catIndex, posInCat, totalInCat, W, H) {
  const cx = W / 2;
  const cy = H / 2;
  const radiusX = W * 0.38;
  const radiusY = H * 0.4;

  if (catIndex === 1) {
    const startX = W * 0.12;
    const startY = H * 0.22;
    const endY = H * 0.78;
    const gapY = totalInCat > 1 ? (endY - startY) / (totalInCat - 1) : 0;
    return { x: startX, y: startY + posInCat * gapY };
  }
  if (catIndex === 2) {
    const startX = W * 0.88;
    const startY = H * 0.22;
    const endY = H * 0.78;
    const gapY = totalInCat > 1 ? (endY - startY) / (totalInCat - 1) : 0;
    return { x: startX, y: startY + posInCat * gapY };
  }
  if (catIndex === 0) {
    const baseAngle = 270;
    const spread = Math.min(80, (totalInCat - 1) * 24);
    const start = baseAngle - spread / 2;
    const step = totalInCat > 1 ? spread / (totalInCat - 1) : 0;
    const angle = ((start + posInCat * step) * Math.PI) / 180;
    return { x: cx + radiusX * Math.cos(angle), y: cy + radiusY * Math.sin(angle) };
  }
  const baseAngle = 90;
  const spread = Math.min(80, (totalInCat - 1) * 24);
  const start = baseAngle - spread / 2;
  const step = totalInCat > 1 ? spread / (totalInCat - 1) : 0;
  const angle = ((start + posInCat * step) * Math.PI) / 180;
  return { x: cx + radiusX * Math.cos(angle), y: cy + radiusY * Math.sin(angle) };
}

function getCurveDirection(catIndex) {
  switch (catIndex) {
    case 0: return "up";
    case 1: return "left";
    case 2: return "right";
    case 3: return "down";
    default: return "up";
  }
}

function getCurvedPath(x1, y1, x2, y2, direction, intensity = 45) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  let cx = mx, cy = my;
  switch (direction) {
    case "up":    cy = my - intensity; break;
    case "down":  cy = my + intensity; break;
    case "left":  cx = mx - intensity; break;
    case "right": cx = mx + intensity; break;
  }
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function scatterPathFallback(x1, y1, x2, y2, bend = 30) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

/* ─── Skill Card (Grid) ─── */
const SkillCard = ({ element, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const proficiency = element.proficiency || 80;
  const cat = categoryFor(element, index);
  const color = CATEGORY_COLORS[cat % CATEGORY_COLORS.length];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
        transition: `opacity 0.5s ease ${(index % 5) * 70}ms, transform 0.5s ease ${(index % 5) * 70}ms`,
      }}
    >
      <Card
        className="h-fit p-6 flex flex-col items-center gap-4 group hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 cursor-default relative overflow-hidden"
        style={{ borderColor: `${color.bg}30` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />

        {/* Icon box - INCREASED SIZE */}
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 relative z-10 overflow-hidden select-none"
          style={{
            background: imgError || !element.svg?.url
              ? `linear-gradient(135deg, ${color.bg}20, ${color.bg}08)`
              : "transparent",
            boxShadow: `0 0 0 1.5px ${color.bg}22, 0 4px 16px ${color.bg}18`,
          }}
        >
          {/* Shimmer while loading */}
          {!imgLoaded && !imgError && element.svg?.url && (
            <div
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{ background: `linear-gradient(135deg, ${color.bg}18, ${color.bg}08)` }}
            />
          )}

          {!imgError && element.svg?.url ? (
            <img
              src={element.svg.url}
              alt={element.title}
              className="w-[80%] h-[80%] object-contain pointer-events-none transition-opacity duration-300"
              style={{
                opacity: imgLoaded ? 1 : 0,
                imageRendering: "crisp-edges",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.10))",
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center rounded-2xl text-base font-black tracking-tight"
              style={{ color: color.label }}
            >
              {element.title?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <p className="text-sm text-center font-bold text-slate-800 dark:text-slate-200 tracking-wide relative z-10">
          {element.title}
        </p>
        <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden relative z-10">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: visible ? `${proficiency}%` : "0%",
              background: `linear-gradient(90deg, ${color.bg}, ${color.label})`,
            }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-medium tracking-wide relative z-10 -mt-2">
          {proficiency}%
        </span>
      </Card>
    </div>
  );
};

/* ─── Animated Dot along path ─── */
const AnimatedDot = ({ path, color, delay, dur = "3s" }) => (
  <circle r={3} fill={color}>
    <animateMotion path={path} dur={dur} begin={`${delay}s`} repeatCount="indefinite" />
  </circle>
);

/* ─── Main Component ─── */
const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const containerRef = useRef(null);
  const [size, setSize] = useState({ W: 800, H: 560 });
  const [hovered, setHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [failedNetworkImages, setFailedNetworkImages] = useState({});

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    axios
      .get(`${apiUrl}/api/v1/skill/getall`, { withCredentials: true })
      .then(({ data }) => setSkills(data.skills || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!containerRef.current || viewMode !== "network") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      const height = Math.min(Math.max(width * 0.65, 380), 580);
      setSize({ W: width, H: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [viewMode]);

  /* Group by category */
  const grouped = skills.reduce((acc, skill, i) => {
    const cat = categoryFor(skill, i);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...skill, _catIdx: cat, _posInCat: acc[cat].length });
    return acc;
  }, {});

  /* Scatter positions */
  const scatterPos = skills.map((_, i) => {
    const seed = i * 137.508;
    const angle = (seed * Math.PI) / 180;
    const r = 0.25 + (((i * 83) % 100) / 100) * 0.55;
    return {
      x: size.W / 2 + (size.W / 2) * r * Math.cos(angle) * 0.85,
      y: size.H / 2 + (size.H / 2) * r * Math.sin(angle) * 0.75,
    };
  });

  /* Organised positions */
  const organisedPos = skills.map((skill, i) => {
    const cat = categoryFor(skill, i);
    const group = grouped[cat] || [];
    const posInCat = group.findIndex((s) => s._id === skill._id);
    return getOrganisedPos(cat, posInCat, group.length, size.W, size.H);
  });

  const currentPos = hovered ? organisedPos : scatterPos;
  const cx = size.W / 2;
  const cy = size.H / 2;
  const bubbleR = Math.max(28, Math.min(30, size.W / 12)); // INCREASED bubble size

  const toggleHover = useCallback(() => setHovered((h) => !h), []);
  const handlers = isTouchDevice
    ? { onClick: toggleHover }
    : { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) };

  /* Category label positions */
  const labelPositions = [
    { label: "FRONTEND",  x: cx,             y: 22,              anchor: "middle", cat: 0 },
    { label: "TOOLS",     x: 18,             y: cy,              anchor: "start",  cat: 1, rotate: -90 },
    { label: "BACKEND",   x: size.W - 18,    y: cy,              anchor: "end",    cat: 2, rotate: 90 },
    { label: "DATABASES", x: cx,             y: size.H - 10,     anchor: "middle", cat: 3 },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Heading */}
      <div className="flex flex-col items-center select-none mx-auto w-fit mb-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.25em] text-slate-800 dark:text-white uppercase transition-colors">
          Skills
        </h1>
        <div className="h-1 w-12 bg-blue-500 rounded-full mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
      </div>

      {/* Toggle */}
      <div className="flex justify-center gap-2">
        {["grid", "network"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
              viewMode === mode
                ? "bg-blue-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {mode === "grid" ? "Grid View" : "Network View"}
          </button>
        ))}
      </div>

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {skills.map((element, i) => (
            <SkillCard key={element._id} element={element} index={i} />
          ))}
        </div>
      )}

      {/* ── Network View ── */}
      {viewMode === "network" && skills.length > 0 && (
        <>
          {/* Instruction text */}
          <p
            className="text-center text-xs text-slate-400 dark:text-slate-500 tracking-widest uppercase transition-opacity duration-500"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            {isTouchDevice ? "Tap to organize" : "Hover to organize by category"}
          </p>

          {/* Network Canvas */}
          <div
            ref={containerRef}
            {...handlers}
            className="relative w-full rounded-3xl overflow-hidden cursor-pointer select-none
              border transition-all duration-500"
            style={{
              height: size.H,
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e8f0fe 100%)",
              borderColor: hovered ? "rgba(59,130,246,0.3)" : "rgba(226,232,240,0.8)",
              boxShadow: hovered
                ? "0 0 40px rgba(59,130,246,0.08), inset 0 0 60px rgba(59,130,246,0.03)"
                : "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            {/* Dark-mode gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none dark:block hidden rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
              }}
            />

            {/* Radial glow at center when hovered */}
            {hovered && (
              <div
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: cx - 80,
                  top: cy - 80,
                  width: 160,
                  height: 160,
                  background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                  transition: "opacity 0.6s",
                }}
              />
            )}

            {/* ── SVG Layer ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${size.W} ${size.H}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Glow filter */}
                <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Hub glow */}
                <filter id="hub-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Gradient for hub */}
                <radialGradient id="hub-gradient" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </radialGradient>
                {/* Arrow markers per category */}
                {CATEGORY_COLORS.map((color, i) => (
                  <marker
                    key={`arrow-${i}`}
                    id={`arrow-${i}`}
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L8,3 z" fill={color.path} />
                  </marker>
                ))}
              </defs>

              {/* ── Organised: curved spokes + animated dots ── */}
              {hovered &&
                skills.map((skill, i) => {
                  const cat = categoryFor(skill, i);
                  const color = CATEGORY_COLORS[cat % CATEGORY_COLORS.length];
                  const pos = organisedPos[i];
                  const dir = getCurveDirection(cat);
                  const pathStr = getCurvedPath(pos.x, pos.y, cx, cy, dir, 50);

                  return (
                    <g key={`spoke-${skill._id}`}>
                      {/* Main spoke */}
                      <path
                        d={pathStr}
                        stroke={color.path}
                        strokeWidth={2}
                        fill="none"
                        strokeDasharray="0"
                        markerEnd={`url(#arrow-${cat})`}
                        style={{
                          transition: "d 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.6s",
                          filter: `drop-shadow(0 0 3px ${color.glow})`,
                        }}
                      />
                      {/* Animated dot along path */}
                      <AnimatedDot
                        path={pathStr}
                        color={color.dot}
                        delay={(i * 0.28) % 3}
                        dur="3s"
                      />
                    </g>
                  );
                })}

              {/* ── Scatter: web of connections ── */}
              {!hovered &&
                skills.map((skill, i) =>
                  skills.slice(i + 1).map((other, j) => {
                    const pi = scatterPos[i];
                    const pj = scatterPos[i + 1 + j];
                    const dx = pi.x - pj.x;
                    const dy = pi.y - pj.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > size.W * 0.42 || dist < 45) return null;
                    const cat1 = categoryFor(skill, i);
                    const cat2 = categoryFor(other, i + 1 + j);
                    const sameColor = cat1 === cat2;
                    const color = CATEGORY_COLORS[cat1 % CATEGORY_COLORS.length];
                    return (
                      <line
                        key={`line-${skill._id}-${other._id}`}
                        x1={pi.x} y1={pi.y}
                        x2={pj.x} y2={pj.y}
                        stroke={sameColor ? color.path : "rgba(148,163,184,0.12)"}
                        strokeWidth={1}
                      />
                    );
                  })
                )}

              {/* ── Category Labels (SVG text, rotated for sides) ── */}
              {hovered &&
                labelPositions.map(({ label, x, y, anchor, cat, rotate }) => {
                  const color = CATEGORY_COLORS[cat % CATEGORY_COLORS.length];
                  const fontSize = Math.max(9, Math.min(11, size.W / 70));
                  const transform = rotate
                    ? `rotate(${rotate}, ${x}, ${y})`
                    : undefined;
                  return (
                    <text
                      key={label}
                      x={x}
                      y={y}
                      textAnchor={anchor}
                      dominantBaseline="middle"
                      fill={color.label}
                      fontSize={fontSize}
                      fontWeight="800"
                      letterSpacing="2.5"
                      transform={transform}
                      style={{
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 0.5s",
                        filter: `drop-shadow(0 0 6px ${color.glow})`,
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </text>
                  );
                })}

              {/* ── Central Hub ── */}
              {hovered && (
                <g filter="url(#hub-glow)">
                  {/* Outer pulse ring */}
                  <circle cx={cx} cy={cy} r={38} fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth={1.5}>
                    <animate attributeName="r" values="34;42;34" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Mid ring */}
                  <circle cx={cx} cy={cy} r={28} fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.3)" strokeWidth={1} />
                  {/* Core */}
                  <circle cx={cx} cy={cy} r={20} fill="url(#hub-gradient)" />
                  <text
                    x={cx} y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={6}
                    fontWeight="900"
                    letterSpacing="0.8"
                  >
                    Skills
                  </text>
                </g>
              )}
            </svg>

            {/* ── Skill Bubbles ── */}
            {skills.map((skill, i) => {
              const cat = categoryFor(skill, i);
              const color = CATEGORY_COLORS[cat % CATEGORY_COLORS.length];
              const pos = currentPos[i] || { x: cx, y: cy };
              const r = bubbleR;

              return (
                <div
                  key={skill._id}
                  title={skill.title}
                  className="absolute group"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)",
                    transition:
                      "left 0.9s cubic-bezier(0.4,0,0.2,1), top 0.9s cubic-bezier(0.4,0,0.2,1)",
                    zIndex: 10,
                  }}
                >
                  {/* Outer glow ring */}
                  <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      inset: -4, // INCREASED glow ring size
                      background: `radial-gradient(circle, ${color.ring} 0%, transparent 70%)`,
                      transition: "opacity 0.3s",
                    }}
                  />

                  {/* Bubble - INCREASED SIZE */}
                  <div
                    className="rounded-full flex items-center justify-center group-hover:scale-125 group-hover:z-20 transition-transform duration-300 relative"
                    style={{
                      width: r * 2,
                      height: r * 2,
                      background: `radial-gradient(circle at 35% 35%, ${color.bg}ee, ${color.bg}99)`,
                      boxShadow: `0 4px 16px ${color.glow}, 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.4)`,
                    }}
                  >
                    {/* White disc — clean backdrop for icon - INCREASED SIZE */}
                    <div
                      className="rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        width: r * 1.5,
                        height: r * 1.5,
                        background: "rgba(255,255,255,0.96)",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      {!failedNetworkImages[skill._id] && skill.svg?.url ? (
                        <img
                          src={skill.svg.url}
                          alt={skill.title}
                          className="pointer-events-none"
                          style={{
                            width: r * 1.05, // INCREASED image size within bubble
                            height: r * 1.05,
                            objectFit: "contain",
                            imageRendering: "crisp-edges",
                            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.12))",
                            display: "block",
                          }}
                          onError={() =>
                            setFailedNetworkImages((prev) => ({ ...prev, [skill._id]: true }))
                          }
                        />
                      ) : (
                        <span
                          className="font-black pointer-events-none leading-none"
                          style={{
                            fontSize: `${Math.max(10, r * 0.6)}px`, // INCREASED text size for fallback
                            color: color.label,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {skill.title?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
                      text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg
                      opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30
                      border"
                    style={{
                      background: color.bg,
                      color: "#fff",
                      borderColor: `${color.bg}80`,
                      boxShadow: `0 4px 14px ${color.glow}`,
                    }}
                  >
                    {skill.title}
                    {skill.proficiency != null && (
                      <span className="ml-1 opacity-70">{skill.proficiency}%</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ── Decoration Dots ── */}
            {Array.from({ length: 18 }).map((_, i) => {
              const cat = i % 4;
              const color = CATEGORY_COLORS[cat];
              const seed = i * 137.5;
              const left = ((seed * 1.3) % 92) + "%";
              const top = ((seed * 0.7) % 88) + "%";
              const sz = 2 + (i % 3);
              return (
                <div
                  key={`deco-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    background: color.deco,
                    width: sz,
                    height: sz,
                    left,
                    top,
                    opacity: 0.35,
                    animation: `floatDeco ${14 + (i % 7)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              );
            })}

            {/* ── Corner accent lines ── */}
            <div className="absolute top-4 left-4 pointer-events-none opacity-20">
              <div className="w-8 h-px bg-blue-400" />
              <div className="w-px h-8 bg-blue-400" />
            </div>
            <div className="absolute top-4 right-4 pointer-events-none opacity-20 flex flex-col items-end">
              <div className="w-8 h-px bg-blue-400" />
              <div className="w-px h-8 bg-blue-400 self-end" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-20 flex flex-col justify-end">
              <div className="w-px h-8 bg-blue-400" />
              <div className="w-8 h-px bg-blue-400" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-20 flex flex-col items-end justify-end">
              <div className="w-px h-8 bg-blue-400 self-end" />
              <div className="w-8 h-px bg-blue-400" />
            </div>

            <style>{`
              @keyframes floatDeco {
                0%, 100% { transform: translate(0, 0); }
                33%       { transform: translate(8px, 6px); }
                66%       { transform: translate(-4px, 10px); }
              }
            `}</style>
          </div>

          {/* ── Legend ── */}
          <div className="flex flex-wrap justify-center gap-5 mt-1">
            {Object.entries(grouped).map(([catIdx, group]) => {
              const color = CATEGORY_COLORS[Number(catIdx) % CATEGORY_COLORS.length];
              return (
                <div key={catIdx} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                    style={{
                      background: color.bg,
                      boxShadow: `0 0 6px ${color.glow}`,
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {CATEGORY_NAMES[Number(catIdx) % 4]}
                    <span className="ml-1 text-slate-400 dark:text-slate-600">
                      ({group.length})
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Skills;
