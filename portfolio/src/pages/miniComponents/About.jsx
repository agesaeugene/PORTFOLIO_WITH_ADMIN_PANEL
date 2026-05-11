import React, { useEffect, useRef } from "react";

const TECH_STACK = "REACT · NEXTJS · TAILWIND · TYPESCRIPT · NODE.JS · EXPRESS · MONGODB · FIREBASE · FIGMA · GSAP · FLUTTER · JAVA · C · HTML · CSS";

const BentoCard = ({ children, className = "", style = {} }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    card.addEventListener("mousemove", handleMove);
    return () => card.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-blue-900/10 bento-card ${className}`}
      style={style}
    >
      {/* Spotlight overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 hover-spotlight transition-opacity duration-300 rounded-3xl"
        style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(37,99,235,0.08), transparent 60%)" }}
      />
      {children}
    </div>
  );
};

const About = () => {
  const [time, setTime] = React.useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full flex flex-col overflow-x-hidden gap-12">
      {/* Section heading */}
      <div className="relative flex items-center justify-center">
        <h1
          className="flex gap-4 items-center text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem]
          leading-[56px] md:leading-[67px] lg:leading-[90px] tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{ background: "hsl(222.2 84% 4.9%)" }}
        >
          ABOUT <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 auto-rows-auto md:h-[480px]">

        {/* Card 1 - Tech marquee (wide) */}
        <BentoCard className="md:col-span-2 bg-slate-100 dark:bg-slate-950 p-8 flex flex-col justify-between group">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Tech Arsenal</h3>
            <p className="text-slate-500 text-sm">Tools I wield to build digital products.</p>
          </div>
          <div className="relative overflow-hidden mt-6 h-16 flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="flex gap-10 whitespace-nowrap marquee-track opacity-40 group-hover:opacity-80 transition-opacity duration-300">
              <span className="text-4xl font-extrabold text-slate-400 dark:text-slate-600 tracking-wider">{TECH_STACK}</span>
              <span className="text-4xl font-extrabold text-slate-400 dark:text-slate-600 tracking-wider">{TECH_STACK}</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 2 - Location + Time */}
        <BentoCard className="bg-slate-900 text-white p-8 flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-3xl opacity-20 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center mb-4 text-2xl" style={{ animation: "spin 15s linear infinite" }}>
              🌍
            </div>
            <h3 className="text-xl font-bold mb-0.5">Based in</h3>
            <p className="text-slate-400">Nairobi, Kenya</p>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Local Time</p>
            <p className="text-4xl font-bold font-mono tabular-nums">{time}</p>
          </div>
        </BentoCard>

        {/* Card 3 - Status + Socials */}
        <BentoCard className="bg-white dark:bg-slate-950 p-8 flex flex-col justify-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open for Projects
          </span>
          <div className="flex gap-4 text-2xl text-slate-500 dark:text-slate-400">
            {[
              { icon: "fab fa-github", href: "#" },
              { icon: "fab fa-linkedin", href: "#" },
              { icon: "fab fa-twitter", href: "#" },
              { icon: "fab fa-instagram", href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className="hover:text-blue-500 transition-colors hover:scale-125 transform duration-200">
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </BentoCard>

        {/* Card 4 - Quote (wide) */}
        <BentoCard className="md:col-span-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white p-8 flex flex-col justify-center relative">
          <i className="fas fa-quote-right absolute top-6 right-8 text-5xl text-white/10" />
          <blockquote className="text-xl md:text-2xl font-bold leading-snug max-w-lg relative z-10">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>
          <p className="mt-4 text-white/70 text-sm font-mono">— Eugene Agesa</p>
        </BentoCard>

      </div>

      {/* About text */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src="/me.jpg"
              alt="Eugene Agesa"
              className="relative z-10 w-[220px] sm:w-[280px] h-auto rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-105"
            />
            {/* Decorative backdrop */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-4 border-blue-500/30 -rotate-3" />
          </div>
        </div>
        <div className="flex flex-col gap-5 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="text-lg">
            My name is <span className="font-bold text-slate-900 dark:text-white">Eugene Agesa</span>, a passionate and disciplined Software Developer and Bachelor of Science student in Software Engineering 
            at Zetech University. I enjoy working as a web developer and freelancer, with hobbies including watching movies and series,
             playing video games, and occasionally cooking. I specialize in building modern, scalable web applications that solve real-world problems and deliver meaningful user experiences.
          </p>
          <p className="text-lg">
            My expertise lies in backend and full-stack development, with experience in Python (Flask & Django), Java, JavaScript(REACT), Svelte/SvelteKit, and databases like PostgreSQL and MongoDB. I focus on clean system architecture, secure authentication, and building high-performance, maintainable applications while consistently meeting deadlines.
          </p>
          <p className="text-lg">
            I am committed to continuous learning and long-term excellence in software engineering, following a disciplined, goal-oriented approach through algorithmic problem-solving, system design, and project development. My goal is to become a world-class software engineer capable of building impactful products, leading technical initiatives, and delivering high-quality solutions at scale, with strong dedication, perseverance, and resilience in facing challenges.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        .bento-card:hover .hover-spotlight {
          opacity: 1;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default About;