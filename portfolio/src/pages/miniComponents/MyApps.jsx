import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const AppCard = ({ element, index }) => {
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

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.95)",
        transition: `opacity 0.5s ease ${(index % 5) * 60}ms, transform 0.5s ease ${(index % 5) * 60}ms`,
      }}
    >
      <Card className="h-fit p-6 sm:p-7 flex flex-col justify-center items-center gap-3 group hover:border-blue-500/50 hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-200 cursor-default relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
        <img
          src={element.svg?.url}
          alt={element.name}
          className="h-12 sm:h-20 w-auto transition-transform duration-300 group-hover:scale-115 relative z-10"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
        />
        <p className="text-sm text-center font-medium text-muted-foreground relative z-10 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {element.name}
        </p>
      </Card>
    </div>
  );
};

const MyApps = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/softwareapplication/getall`, { withCredentials: true })
      .then(({ data }) => setApps(data.softwareApplications || []))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit">
        MY APPS
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {apps.map((element, i) => (
          <AppCard key={element._id} element={element} index={i} />
        ))}
      </div>
    </div>
  );
};

export default MyApps;