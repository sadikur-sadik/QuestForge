import React from "react";

export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 overflow-x-hidden animate-pulse">
      
      {/* ── Background Subtle Glow Blobs ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2560px] h-[500px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-80px] right-1/4 w-[500px] 3xl:w-[700px] h-[500px] 3xl:h-[700px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[130px] 3xl:blur-[180px]" />
        <div className="absolute top-[40px] left-1/4 w-[450px] 3xl:w-[650px] h-[450px] 3xl:h-[650px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[130px] 3xl:blur-[180px]" />
      </div>

      <div className="relative z-10 qf-container pt-8 sm:pt-12 lg:pt-16 3xl:pt-24 flex flex-col gap-10 sm:gap-14 lg:gap-16 3xl:gap-24">
        
        {/* ── SECTION 1: HERO & LIVE SEARCH SKELETON ── */}
        <section className="flex flex-col items-center text-center max-w-3xl 3xl:max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full">
          {/* Badge pill skeleton */}
          <div className="w-56 3xl:w-64 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />

          {/* Heading lines skeleton */}
          <div className="w-3/4 max-w-lg 3xl:max-w-2xl h-10 sm:h-14 3xl:h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-1/2 max-w-sm 3xl:max-w-lg h-10 sm:h-14 3xl:h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          {/* Subtitle skeleton */}
          <div className="w-5/6 max-w-md 3xl:max-w-xl h-4 sm:h-5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />

          {/* Search bar skeleton */}
          <div className="w-full max-w-xl 3xl:max-w-2xl pt-2">
            <div className="w-full h-14 3xl:h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-sm" />
          </div>
        </section>

        {/* ── SECTION 2: CATEGORY FILTER PILLS SKELETON ── */}
        <section className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[100, 120, 150, 130, 140].map((width, idx) => (
            <div
              key={idx}
              style={{ width: `${width}px` }}
              className="h-10 3xl:h-12 rounded-xl bg-slate-200 dark:bg-slate-800/90"
            />
          ))}
        </section>

        {/* ── SECTION 3: ACCORDION LIST SKELETON ── */}
        <section className="max-w-4xl 3xl:max-w-6xl mx-auto w-full space-y-3.5">
          {/* First expanded accordion skeleton */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 3xl:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/50" />
                <div className="w-64 sm:w-80 3xl:w-96 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
              <div className="w-full h-4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              <div className="w-4/5 h-4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              <div className="w-40 h-6 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 mt-2" />
            </div>
          </div>

          {/* Collapsed accordion item skeletons */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 3xl:p-7 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div
                  className="h-4 sm:h-5 rounded-lg bg-slate-200 dark:bg-slate-800"
                  style={{ width: `${180 + (item * 45) % 220}px` }}
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </section>

        {/* ── SECTION 4: QUICK HELP CARDS SKELETON ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 3xl:gap-8 max-w-5xl 3xl:max-w-7xl mx-auto w-full">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="p-6 3xl:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 h-52 3xl:h-64"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 3xl:w-12 3xl:h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="w-32 3xl:w-44 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="w-full h-3.5 rounded bg-slate-200/70 dark:bg-slate-800/70" />
                <div className="w-4/5 h-3.5 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              </div>
              <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </section>

        {/* ── SECTION 5: CONTACT SUPPORT BANNER SKELETON ── */}
        <section className="p-8 sm:p-10 3xl:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl 3xl:max-w-6xl mx-auto w-full">
          <div className="space-y-3 w-full sm:w-2/3">
            <div className="w-3/4 h-6 sm:h-7 3xl:h-8 rounded-xl bg-slate-800" />
            <div className="w-full h-4 rounded-lg bg-slate-800/70" />
          </div>
          <div className="w-44 h-12 rounded-2xl bg-cyan-500/20 shrink-0" />
        </section>

      </div>
    </div>
  );
}
