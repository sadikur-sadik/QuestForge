import React from "react";

export default function MyBucketLoading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header Title Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-64 rounded-xl bg-slate-300 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-96 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit shrink-0 animate-pulse">
          <div className="h-9 w-36 bg-slate-300 dark:bg-slate-800 rounded-xl" />
          <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl ml-2" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 4, 5].map((i) => (
            <div key={i} className="flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-900/60 shadow-xl animate-pulse">
              {/* Aspect Ratio Artwork Skeleton */}
              <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800" />
              {/* Info Area Skeleton */}
              <div className="p-4 flex flex-col gap-2 bg-slate-950">
                <div className="h-3 w-12 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-20 bg-slate-300 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
