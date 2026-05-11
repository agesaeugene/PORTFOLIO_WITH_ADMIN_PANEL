import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";

/* ── Magnetic effect hook ── */
function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}

const NAV_LINKS = [
  { label: "Home",      href: "#home" },
  { label: "Timeline",  href: "#timeline" },
  { label: "About",     href: "#about" },
  { label: "Skills",    href: "#skills" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Apps",      href: "#apps" },
  { label: "Contact",   href: "#contact" },
];

/* ── Theme Toggle Button ── */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const mag = useMagnetic(0.3);

  return (
    <button
      {...mag}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="
        relative w-9 h-9 rounded-full flex items-center justify-center
        border border-slate-200 dark:border-white/10
        bg-white/60 dark:bg-white/5 backdrop-blur-sm
        text-slate-500 dark:text-slate-400
        hover:border-blue-500 hover:text-blue-500
        transition-all duration-200
      "
      style={{ transition: "transform 0.2s cubic-bezier(0.2,0.8,0.2,1)" }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.6)" : "rotate(0deg) scale(1)" }}
      >
        <Sun className="w-4 h-4" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.6)" }}
      >
        <Moon className="w-4 h-4" />
      </span>
    </button>
  );
};

/* ── NavLink with active state + magnetic ── */
const NavLink = ({ href, label, onClick }) => {
  const mag = useMagnetic(0.2);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [href]);

  return (
    <a
      href={href}
      onClick={onClick}
      {...mag}
      className={`
        relative text-sm font-semibold tracking-wide transition-colors duration-200
        ${active
          ? "text-blue-500"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }
      `}
      style={{ transition: "transform 0.2s cubic-bezier(0.2,0.8,0.2,1), color 0.2s" }}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
      )}
    </a>
  );
};

/* ── Main Navbar ── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const logoMag = useMagnetic(0.15);
  const hireMag = useMagnetic(0.2);

  return (
    <>
      {/* ─── Desktop / Tablet Navbar ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 transition-all duration-300"
        style={{ paddingTop: scrolled ? "12px" : "20px" }}
      >
        <nav
          className={`
            w-full max-w-5xl flex items-center justify-between
            px-5 py-2.5 rounded-full
            border border-slate-200 dark:border-white/10
            backdrop-blur-xl
            transition-all duration-500
            ${scrolled
              ? "bg-white/80 dark:bg-slate-950/80 shadow-lg shadow-slate-900/5 dark:shadow-black/30"
              : "bg-white/60 dark:bg-slate-950/60"
            }
          `}
        >
          {/* Logo / Brand */}
          <a
            href="#home"
            {...logoMag}
            className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white focus:outline-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "transform 0.2s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            eugene<span className="text-blue-500">.</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Hire Me CTA — hidden on very small screens */}
            <a
              href="#contact"
              {...hireMag}
              className="
                hidden sm:inline-flex items-center
                px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase
                bg-slate-900 dark:bg-white
                text-white dark:text-black
                hover:scale-105 active:scale-95
                shadow-md transition-transform duration-200
              "
              style={{ transition: "transform 0.2s cubic-bezier(0.2,0.8,0.2,1)" }}
            >
              Hire Me
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="
                md:hidden w-9 h-9 rounded-full flex items-center justify-center
                border border-slate-200 dark:border-white/10
                bg-white/60 dark:bg-white/5
                text-slate-700 dark:text-white
                hover:border-blue-500 transition-colors
              "
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Menu Overlay ─── */}
      <div
        className={`
          fixed inset-0 z-[60] flex flex-col items-center justify-center
          bg-white/95 dark:bg-slate-950/97 backdrop-blur-xl
          transition-all duration-400
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ transition: "opacity 0.35s cubic-bezier(0.2,0.8,0.2,1)" }}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="
            absolute top-6 right-6
            w-10 h-10 rounded-full flex items-center justify-center
            border border-slate-200 dark:border-white/10
            text-slate-500 dark:text-slate-400
            hover:bg-red-500 hover:text-white hover:border-red-500
            transition-all duration-200
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand in mobile menu */}
        <p
          className="text-4xl font-extrabold text-slate-900 dark:text-white mb-10"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          eugene<span className="text-blue-500">.</span>
        </p>

        {/* Links */}
        <nav className="flex flex-col items-center gap-6">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="
                text-2xl font-bold tracking-tight
                text-slate-700 dark:text-slate-300
                hover:text-blue-500 dark:hover:text-blue-400
                transition-colors duration-200
              "
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ease ${i * 50 + 100}ms, transform 0.4s ease ${i * 50 + 100}ms, color 0.2s`,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile CTA */}
        <a
          href="#contact"
          onClick={() => setMobileOpen(false)}
          className="
            mt-10 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider
            bg-slate-900 dark:bg-white text-white dark:text-black
            hover:scale-105 transition-transform shadow-lg
          "
          style={{
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease 500ms, transform 0.4s ease 500ms",
          }}
        >
          Hire Me
        </a>

        {/* Theme toggle in mobile */}
        <div
          className="mt-6"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transition: "opacity 0.4s ease 580ms",
          }}
        >
          <ThemeToggle />
        </div>
      </div>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;