import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const SkillCard = ({ element, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const proficiency = element.proficiency || 80; // fallback value

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
        transition: `opacity 0.5s ease ${(index % 5) * 70}ms, transform 0.5s ease ${(index % 5) * 70}ms`,
      }}
    >
      <Card className="h-fit p-5 flex flex-col items-center gap-3 group hover:border-blue-500/60 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-200 cursor-default relative overflow-hidden">
        {/* Subtle gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />

        <img
          src={element.svg?.url}
          alt={element.title}
          className="h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-110 relative z-10"
        />
        <p className="text-sm text-center font-medium text-slate-700 dark:text-muted-foreground relative z-10">
          {element.title}
        </p>

        {/* Proficiency bar */}
        <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden relative z-10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
            style={{ width: visible ? `${proficiency}%` : "0%" }}
          />
        </div>
        <span className="text-[10px] text-slate-400 tracking-wide relative z-10">{proficiency}%</span>
      </Card>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/skill/getall`, { withCredentials: true })
      .then(({ data }) => setSkills(data.skills || []))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit">
        SKILLS
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((element, i) => (
          <SkillCard key={element._id} element={element} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Skills;