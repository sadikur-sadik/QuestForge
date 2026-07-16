import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/50 via-slate-200/10 to-transparent dark:from-slate-700/50 dark:via-slate-800/10 dark:to-transparent shadow-2xl">
          <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-8 py-10 rounded-[23px] flex flex-col gap-6 w-full border border-white/20 dark:border-slate-800/40 text-center items-center">
            
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-2 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Quest Lost
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                The adventure page you are looking for has vanished, or has been moved to another quadrant.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              <Link href="/" className="w-full">
                <button className="w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)] active:scale-[0.99] transition-all duration-200 cursor-pointer">
                  Return to Homepage
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
