import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";

const ProjectView = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/project/get/${id}`,
        { withCredentials: true }
      )
      .then(({ data }) => setProject(data.project))
      .catch((error) => toast.error(error.response?.data?.message || "Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const descriptionList = project.description?.split(". ").filter(Boolean) || [];
  const technologiesList = project.technologies?.split(", ").filter(Boolean) || [];

  return (
    <div className="flex justify-center items-start min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[900px]">

        {/* Back button */}
        <div className="mb-8">
          <Button
            onClick={() => navigateTo("/")}
            variant="outline"
            className="rounded-full flex items-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            ← Return to Portfolio
          </Button>
        </div>

        {/* Hero Banner */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-2xl border border-slate-200 dark:border-white/10">
          <img
            src={project.projectBanner?.url || "/avatarHolder.jpg"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-8">
            <div>
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase block mb-1">{project.stack}</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{project.title}</h1>
            </div>
          </div>
        </div>

        {/* Action links */}
        <div className="flex flex-wrap gap-3 mb-10">
          {project.gitRepoLink && (
            <Link
              to={project.gitRepoLink}
              target="_blank"
              className="px-6 py-2.5 border border-slate-200 dark:border-white/20 rounded-full text-sm font-semibold hover:border-blue-500 hover:text-blue-500 transition-all"
            >
              GitHub Repository ↗
            </Link>
          )}
          {project.projectLink && (
            <Link
              to={project.projectLink}
              target="_blank"
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Live Project ↗
            </Link>
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Description</h2>
              <ul className="space-y-2">
                {descriptionList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    <span className="text-blue-500 mt-1 flex-shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {technologiesList.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-900/40">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {[
              { label: "Stack", value: project.stack },
              { label: "Deployed", value: project.deployed === "Yes" ? "✅ Yes – Live" : "🔧 Not yet" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <p className="text-slate-900 dark:text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;