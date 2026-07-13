import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Award,
  Calendar,
  ExternalLink,
  Search,
  X,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Certifications = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/portfolio/me`,
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getMyProfile();
  }, []);

  // Lock body scroll while the lightbox modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const certificates = user?.certificates || [];

  const categories = useMemo(() => {
    const set = new Set(certificates.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [certificates]);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchesCategory =
        activeCategory === "All" || c.category === activeCategory;
      const matchesQuery =
        !query ||
        c.title?.toLowerCase().includes(query.toLowerCase()) ||
        c.issuer?.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [certificates, activeCategory, query]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <span className="text-xs tracking-widest uppercase text-slate-400 animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 relative">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 mb-10 cert-header">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm w-fit mb-4">
          <Award className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {certificates.length} Certificate{certificates.length !== 1 ? "s" : ""}
          </p>
        </div>

        <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white mb-3">
          Certifications
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          A collection of courses, exams, and programs I've completed —
          spanning development, security, and cloud technologies.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-5xl mx-auto px-4 mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between cert-header" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search certificates..."
            className="w-full pl-9 pr-3 py-2 rounded-full text-sm border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm outline-none focus:border-blue-500 transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center cert-header">
            <Award className="w-10 h-10 text-slate-300 dark:text-white/10 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No certificates match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cert, i) => (
              <button
                key={cert._id || i}
                onClick={() => setSelected(cert)}
                className="group text-left relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cert-card"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-white/5">
                  {cert.image?.url ? (
                    <img
                      src={cert.image.url}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-slate-300 dark:text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-semibold inline-flex items-center gap-1">
                      View certificate <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  {cert.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 block">
                      {cert.category}
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {cert.issuer}
                  </p>
                  {cert.issueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(cert.issueDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cert-modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl cert-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {selected.image?.url && (
              <div className="w-full bg-slate-100 dark:bg-black/40">
                <img
                  src={selected.image.url}
                  alt={selected.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>
            )}

            <div className="p-6">
              {selected.category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2 block">
                  {selected.category}
                </span>
              )}
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                {selected.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {selected.issuer}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-slate-500 dark:text-slate-400">
                {selected.issueDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued{" "}
                    {new Date(selected.issueDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}
                {selected.credentialId && (
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    ID: {selected.credentialId}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {selected.credentialURL && (
                  <Link to={selected.credentialURL} target="_blank">
                    <Button className="rounded-full px-5 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform">
                      <ExternalLink className="w-4 h-4" />
                      Verify credential
                    </Button>
                  </Link>
                )}
                {selected.image?.url && (
                  <Link to={selected.image.url} target="_blank">
                    <Button variant="outline" className="rounded-full px-5">
                      Open full size
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cert-header {
          animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .cert-card {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .cert-modal-overlay {
          animation: fadeIn 0.25s ease both;
        }
        .cert-modal-panel {
          animation: fadeScale 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Certifications;