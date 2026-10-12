import React from "react";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 overflow-x-hidden animate-pulse">
      {/* Background Cyber Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2560px] h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-1/4 w-[500px] 3xl:w-[750px] h-[500px] 3xl:h-[750px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[130px] 3xl:blur-[180px]" />
        <div className="absolute top-[50px] right-1/4 w-[450px] 3xl:w-[650px] h-[450px] 3xl:h-[650px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[130px] 3xl:blur-[180px]" />
      </div>

      <div className="relative z-10 qf-container pt-8 sm:pt-12 lg:pt-16 3xl:pt-24 flex flex-col gap-12 sm:gap-16 lg:gap-20 3xl:gap-28">

        {/* ── SECTION 1: HERO HEADER SKELETON ── */}
        <div className="flex flex-col items-center text-center max-w-4xl 3xl:max-w-6xl mx-auto space-y-5 sm:space-y-6 w-full">
          <div className="h-8 w-64 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 sm:h-16 w-3/4 max-w-2xl rounded-2xl bg-slate-300 dark:bg-slate-700" />
          <div className="h-5 sm:h-6 w-1/2 max-w-xl rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-4 pt-2">
            <div className="h-12 w-44 rounded-2xl bg-slate-300 dark:bg-slate-700" />
            <div className="h-12 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* ── SECTION 2: LIVE METRICS & KPI SKELETON ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 3xl:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 sm:p-6 3xl:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-3"
            >
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 sm:h-10 w-20 bg-slate-300 dark:bg-slate-700 rounded-xl" />
              <div className="h-3 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>

        {/* ── SECTION 3: THE FOUR PILLARS SKELETON ── */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-64 rounded-xl bg-slate-300 dark:bg-slate-700" />
            <div className="h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 3xl:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 sm:p-7 3xl:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="h-6 w-3/4 rounded-xl bg-slate-300 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: ROADMAP SKELETON ── */}
        <div className="p-6 sm:p-10 3xl:p-14 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="space-y-3">
            <div className="h-5 w-36 rounded-full bg-slate-800" />
            <div className="h-8 w-64 rounded-xl bg-slate-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-slate-800 rounded" />
                  <div className="h-4 w-20 bg-slate-800 rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-slate-700 rounded-lg" />
                <div className="h-3 w-full bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: SECURITY PLEDGE SKELETON ── */}
        <div className="p-8 sm:p-12 3xl:p-16 rounded-3xl bg-slate-200 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 w-full md:w-2/3">
            <div className="h-4 w-40 rounded-full bg-slate-300 dark:bg-slate-800" />
            <div className="h-8 w-3/4 rounded-xl bg-slate-300 dark:bg-slate-700" />
            <div className="h-4 w-full rounded bg-slate-300 dark:bg-slate-800" />
          </div>
          <div className="h-12 w-48 rounded-xl bg-slate-300 dark:bg-slate-700 shrink-0" />
        </div>

      </div>
    </div>
  );
}
