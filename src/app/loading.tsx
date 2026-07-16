import React from "react";

export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Glowing Spinning Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 border-r-cyan-500 animate-spin" />
        </div>
        
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <h3 className="text-sm font-extrabold tracking-widest text-slate-800 dark:text-slate-200 uppercase animate-pulse">
            Loading QuestForge
          </h3>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Fetching realm configurations...
          </span>
        </div>
      </div>
    </div>
  );
}
