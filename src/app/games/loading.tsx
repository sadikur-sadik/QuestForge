import React from "react";

export default function GamesLoading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Title Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-64 rounded-xl bg-slate-300 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-96 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Filter Search Bar Skeleton */}
        <div className="w-full h-24 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center justify-between gap-4 animate-pulse">
          <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse">
              {/* Aspect Ratio Cover Skeleton */}
              <div className="aspect-[16/10] w-full bg-slate-200 dark:bg-slate-800" />
              {/* Content Skeleton */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800/80 w-full" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 bg-slate-300 dark:bg-slate-800 rounded-md" />
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
