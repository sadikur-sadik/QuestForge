"use client";

import React, { useEffect, useState } from "react";

// CountUp Component utilizing requestAnimationFrame for highly-smooth counting
function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for deceleration at the end
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setCount(Math.floor(easedProgress * (end - startValue) + startValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="w-full py-8 sm:py-12 transition-colors duration-300">
      <div className="qf-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
              Platform Metrics
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            QuestForge by the Numbers
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Real-time activity and catalog stats across the gaming universe.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 3xl:gap-8">
          
          {/* Stat 1: Active Gamers */}
          <div className="flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-2 sm:mb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-lg sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400 font-sans">
              <CountUp end={18500} suffix="+" />
            </div>
            <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Explorers
            </span>
          </div>

          {/* Stat 2: Games Cataloged */}
          <div className="flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 sm:mb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-lg sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400 font-sans">
              <CountUp end={94200} suffix="+" />
            </div>
            <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Games Cataloged
            </span>
          </div>

          {/* Stat 3: Quests Completed */}
          <div className="flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 sm:mb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-lg sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-violet-500 bg-clip-text text-transparent dark:from-rose-400 dark:to-violet-400 font-sans">
              <CountUp end={340900} suffix="+" />
            </div>
            <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quests Completed
            </span>
          </div>

          {/* Stat 4: Platforms Tracked */}
          <div className="flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-300 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 sm:mb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-lg sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-rose-400 font-sans">
              <CountUp end={28} suffix="+" />
            </div>
            <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Platforms Tracked
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
