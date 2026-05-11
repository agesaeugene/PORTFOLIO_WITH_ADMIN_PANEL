import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message/send`,
        { senderName, subject, message },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(res.data.message);
      setSenderName("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Heading */}
      <div className="relative mb-12">
        <h1
          className="flex gap-4 items-center text-[1.85rem] sm:text-[2.75rem] md:text-[3rem]
          lg:text-[3rem] leading-[56px] md:leading-[67px] lg:leading-[90px]
          tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{ background: "hsl(222.2 84% 4.9%)" }}
        >
          CONTACT
          <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200 dark:bg-white/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: CTA copy */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Let's build something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              amazing.
            </span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Whether you have a project in mind or just want to say hello, my inbox is always open.
          </p>
          <div className="flex flex-col gap-3 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">✉</span>
              <span>eugeneagesa734@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">📍</span>
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
          <form onSubmit={handleMessage} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="John Doe"
                required
                className="rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Project Inquiry"
                required
                className="rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all resize-none dark:text-white placeholder:text-slate-400"
              />
            </div>
            <div className="flex justify-end pt-1">
              {!loading ? (
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform shadow-lg font-semibold"
                >
                  Send Message ✉
                </Button>
              ) : (
                <button
                  disabled
                  type="button"
                  className="w-full sm:w-auto px-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500 font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;