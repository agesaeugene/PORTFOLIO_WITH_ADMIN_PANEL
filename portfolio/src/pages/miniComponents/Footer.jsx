import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="p-5 mt-6 w-full max-w-[1050px] mx-auto">
      <hr className="border-slate-200 dark:border-white/10" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <h1 className="text-tubeLight-effect text-2xl sm:text-3xl tracking-[8px]">
          Thanks For Scrolling
        </h1>
        <p className="text-sm text-slate-400">
          © {year} Eugene Agesa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;