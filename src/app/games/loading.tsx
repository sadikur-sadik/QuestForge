import React from "react";

export default function GamesLoading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-8 sm:py-12 lg:py-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 qf-container flex flex-col gap-10">
        
        {/* Header Title Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-64 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Filter Search Bar Skeleton */}
        <div className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 animate-pulse">
          <div className="h-10 w-full md:w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-full md:w-1/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-full md:w-1/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Grid Skeletons */}
        <div className="qf-grid-cards">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse">
              {/* Aspect Ratio Cover Skeleton */}
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
              {/* Content Skeleton */}
              <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="h-5 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
