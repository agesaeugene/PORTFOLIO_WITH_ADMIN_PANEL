import {
  Award,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import axios from "axios";

const RedditIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.936 1.266 5.577 3.283 7.41l-.708 2.573a.5.5 0 0 0 .686.588l2.784-1.24A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.5 9.6c.552 0 1 .448 1 1a1 1 0 0 1-.516.874c.01.11.016.222.016.336 0 2.21-2.686 4-6 4s-6-1.79-6-4c0-.114.006-.226.016-.336A1 1 0 1 1 6.5 12.6c0-.607.28-1.15.72-1.53a3.1 3.1 0 0 1 1.674-.665l.554-2.492a.4.4 0 0 1 .478-.303l1.86.4a1.15 1.15 0 1 1-.132.618l-1.6-.343-.462 2.076a3.1 3.1 0 0 1 1.876.667c.44.38.72.923.72 1.53zm-7 1.4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-5.5 3.05c-.276 0-.5.196-.5.437 0 .724 1.12 1.313 2.5 1.313s2.5-.589 2.5-1.313c0-.24-.224-.437-.5-.437a.46.46 0 0 0-.317.126c-.213.365-.926.624-1.683.624s-1.47-.26-1.683-.624a.46.46 0 0 0-.317-.126z" />
  </svg>
);

const Hero = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <span className="text-xs tracking-widest uppercase text-slate-400 animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] bg-blue-500 z-0 transition-all duration-700"
        style={{ left: mousePos.x - 300, top: mousePos.y - 300 }}
      />

      {/* Left: Text */}
      <div className="flex-1 flex flex-col gap-6 relative z-10 order-2 lg:order-1">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm w-fit hero-badge">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Online
          </p>
        </div>

        {/* Name */}
        <div className="overflow-hidden hero-heading-line">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            Hey, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600 animate-gradient-x bg-[length:200%_auto]">
              Eugene Agesa
            </span>
          </h1>
        </div>

        {/* Typewriter */}
        <div className="overflow-hidden hero-heading-line" style={{ animationDelay: "0.15s" }}>
          <h2 className="text-[1.1rem] sm:text-[1.4rem] md:text-[1.75rem] tracking-[8px] font-bold text-slate-500 dark:text-slate-400">
            <Typewriter
              words={["FULLSTACK DEVELOPER", "PENETRATION TESTER", "TECH ENTHUSIAST", "FREELANCER", "OPEN SOURCE CONTRIBUTOR"]}
              loop={50}
              cursor
              typeSpeed={65}
              deleteSpeed={40}
              delaySpeed={1200}
            />
          </h2>
        </div>

        {/* About snippet */}
        {user?.aboutMe && (
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed hero-description">
            {user.aboutMe}
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 hero-buttons">
          <Link to={user?.githubURL || "https://github.com/Eugeneagesa734"} target="_blank">
            <Button className="rounded-full px-6 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform shadow-lg">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
          </Link>
          <Link to={user?.resume?.url || "https://drive.google.com/file/d/1JRAIPR8HUKdgszoIqxg7Lu51LpLE-PxU/view?usp=sharing"} target="_blank">
            <Button
              variant="outline"
              className="rounded-full px-6 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Resume</span>
            </Button>
          </Link>
          <Link to="/certifications">
            <Button
              variant="outline"
              className="rounded-full px-6 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Award className="w-4 h-4" />
              <span>Certifications</span>
            </Button>
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 hero-buttons" style={{ animationDelay: "0.9s" }}>
          {[
            { to: user?.youtubeURL || "https://www.youtube.com", icon: <Youtube className="w-5 h-5 text-red-500" /> },
            { to: user?.instagramURL || "https://instagram.com/eugenedevops", icon: <Instagram className="w-5 h-5 text-pink-500" /> },
            { to: user?.facebookURL || "https://www.reddit.com/user/Dizzy_Blacksmith7686/", icon: <Facebook className="w-5 h-5 text-blue-700" /> },
            { to: user?.linkedInURL || "https://www.linkedin.com/in/eugene-agesa-a7062840b/", icon: <Linkedin className="w-5 h-5 text-sky-500" /> },
            { to: user?.twitterURL || "#", icon: <Twitter className="w-5 h-5 text-blue-400" /> },
          ].map((s, i) => (
            <Link
              key={i}
              to={s.to}
              target="_blank"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:border-blue-500 hover:scale-110 transition-all duration-200 bg-white/60 dark:bg-white/5 backdrop-blur-sm"
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Profile image with orbiting rings */}
      <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 order-1 lg:order-2 flex-shrink-0 hero-image-container">
        {/* Ambient blob */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Outer ring */}
        <div className="hero-circle-outer absolute inset-0 border border-slate-200 dark:border-white/10 rounded-full animate-spin-slow" />

        {/* Middle dashed ring */}
        <div className="hero-circle-middle absolute w-[85%] h-[85%] border border-dashed border-slate-300 dark:border-white/20 rounded-full"
          style={{ animation: "spin 20s linear infinite reverse" }}
        />

        {/* Floating skill dots on the ring */}
        {["⚛️", "🟢", "🔷", "🎨"].map((emoji, i) => {
          const angle = (i / 4) * 360;
          const rad = (angle * Math.PI) / 180;
          const r = 48; // % from center
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <span
              key={i}
              className="absolute text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                animation: `spin ${20 + i * 2}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
              }}
            >
              {emoji}
            </span>
          );
        })}

        {/* Profile photo */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl hero-profile-img z-10 group cursor-pointer"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <img
            src={user?.avatar?.url || "/me.jpg"}
            alt={user?.fullName || "Profile"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradient-x 4s ease infinite; }

        /* Hero entrance animations */
        .hero-badge {
          animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.1s;
        }
        .hero-heading-line {
          animation: fadeSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.25s;
        }
        .hero-description {
          animation: fadeSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.45s;
        }
        .hero-buttons {
          animation: fadeSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.6s;
        }
        .hero-image-container {
          animation: fadeScale 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.3s;
        }
        .hero-circle-outer {
          animation: fadeIn 1.2s ease both;
          animation-delay: 0.5s;
        }
        .hero-profile-img {
          animation: fadeScale 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          animation-delay: 0.4s;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.88); filter: blur(10px); }
          to   { opacity: 1; transform: scale(1);    filter: blur(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <hr className="absolute bottom-0 left-0 w-full border-slate-200 dark:border-white/10" />
    </div>
  );
};

export default Hero;