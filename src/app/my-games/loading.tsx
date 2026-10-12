import React from "react";

export default function MyGamesLoading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-8 sm:py-12 lg:py-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 qf-container flex flex-col gap-8 sm:gap-10">
        
        {/* Header Title Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-64 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* List Skeletons */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm animate-pulse">
              {/* Aspect Ratio Artwork Skeleton */}
              <div className="w-full md:w-36 aspect-[16/10] md:aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="h-6 w-1/3 bg-slate-300 dark:bg-slate-800 rounded-lg" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              {/* Action Buttons Skeleton */}
              <div className="flex md:flex-col items-center gap-3 shrink-0 self-stretch md:self-auto pl-0 md:pl-6 md:border-l border-slate-200 dark:border-slate-850">
                <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
