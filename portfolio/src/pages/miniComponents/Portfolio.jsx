import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

/* ─── Tiny hook: scroll-reveal via IntersectionObserver ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── 3-D tilt card wrapper ─── */
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    ref.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`transition-transform duration-200 ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
};

/* ─── Modal ─── */
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative bg-white dark:bg-slate-950 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 z-10 modal-enter">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
          ✕
        </button>
        {/* Banner */}
        <div className="h-56 sm:h-72 overflow-hidden rounded-t-3xl">
          <img
            src={project.projectBanner?.url || "/avatarHolder.jpg"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Body */}
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <span className="text-blue-500 text-xs font-bold tracking-widest uppercase block mb-1">{project.stack}</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h2>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {project.gitRepoLink && (
                <a href={project.gitRepoLink} target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 border border-slate-200 dark:border-white/20 rounded-full text-sm font-semibold hover:border-blue-500 hover:text-blue-500 transition-all">
                  GitHub
                </a>
              )}
              {project.projectLink && (
                <a href={project.projectLink} target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="sm:col-span-2">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">About the Project</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {project.description?.split(". ").filter(Boolean).map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.split(", ").map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">Deployed</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{project.deployed === "Yes" ? "✅ Live" : "🔧 In Progress"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        .modal-enter { animation: modalIn 0.3s cubic-bezier(0.2,0.8,0.2,1) both; }
      `}</style>
    </div>
  );
};

/* ─── Main Portfolio ─── */
const Portfolio = () => {
  const [viewAll, setViewAll] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useReveal();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/project/getall`, { withCredentials: true })
      .then(({ data }) => setProjects(data.projects || []))
      .catch(console.error);
  }, []);

  const displayed = viewAll ? projects : projects.slice(0, 9);

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="relative mb-14">
        <h1
          className="hidden sm:flex gap-4 items-center text-[2rem] sm:text-[2.75rem] md:text-[3rem]
          lg:text-[3.8rem] leading-[56px] md:leading-[67px] lg:leading-[90px] tracking-[15px]
          mx-auto w-fit font-extrabold about-h1"
          style={{ background: "hsl(222.2 84% 4.9%)" }}
        >
          MY <span className="text-tubeLight-effect font-extrabold">PORTFOLIO</span>
        </h1>
        <h1
          className="flex sm:hidden gap-4 items-center text-[2rem] leading-[56px] tracking-[15px]
          mx-auto w-fit font-extrabold about-h1"
          style={{ background: "hsl(222.2 84% 4.9%)" }}
        >
          MY <span className="text-tubeLight-effect font-extrabold">WORK</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((project, idx) => (
          <div
            key={project._id}
            className={`reveal group cursor-pointer`}
            style={{ transitionDelay: `${(idx % 3) * 80}ms` }}
            onClick={() => setSelected(project)}
          >
            <TiltCard>
              {/* Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                <img
                  src={project.projectBanner?.url || "/avatarHolder.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {/* Quick-view badge */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                    View Details
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-start justify-between px-1 pb-1 border-b border-slate-200 dark:border-white/10">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{project.stack}</p>
                </div>
                <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/20 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all ml-3 mt-0.5 text-sm">
                  +
                </span>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {projects.length > 9 && (
        <div className="w-full text-center mt-12">
          <Button
            onClick={() => setViewAll(!viewAll)}
            variant="outline"
            className="rounded-full px-10 py-3 text-sm font-semibold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            {viewAll ? "Show Less" : "View All Projects"}
          </Button>
        </div>
      )}

      {/* Modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(6px);
          transition: opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      `}</style>
    </div>
  );
};

export default Portfolio;