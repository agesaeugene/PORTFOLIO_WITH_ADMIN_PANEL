import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const TimelineItem = ({ item, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="relative pl-10 md:pl-14 group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
    >
      {/* Dot */}
      <span className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors duration-200 ring-4 ring-transparent group-hover:ring-blue-500/20 z-10" />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 hover:border-blue-500/50 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {item.title}
          </h3>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 w-fit uppercase tracking-wide">
            {item.timeline.from} {item.timeline.to ? `→ ${item.timeline.to}` : "→ Present"}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {item.description}
        </p>
      </div>
    </li>
  );
};

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/timeline/getall`, { withCredentials: true })
      .then(({ data }) => setTimeline(data.timelines || []))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-extrabold tracking-tight text-slate-900 dark:text-white">
        Timeline<span className="text-blue-500">.</span>
      </h1>

      <ol className="relative border-l-2 border-slate-200 dark:border-white/10 ml-2 md:ml-6 space-y-6">
        {timeline.map((item, i) => (
          <TimelineItem key={item._id} item={item} index={i} />
        ))}
      </ol>
    </div>
  );
};

export default Timeline;