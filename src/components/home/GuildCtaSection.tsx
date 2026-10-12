"use client";

import React from "react";
import Link from "next/link";

export default function GuildCtaSection() {
  return (
    <section className="qf-container py-12 sm:py-20 transition-colors duration-300">
      <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-violet-900/90 via-slate-900 to-slate-950 border border-violet-500/30 shadow-2xl text-white">
        
        {/* Ambient Glow Orbs in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-extrabold tracking-wider text-cyan-300 uppercase">
              The Next Evolution of Digital Gaming
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Forge Your Next Great Adventure?
          </h2>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Join thousands of gamers discovering authentic keys, managing multi-platform backlogs, and supporting independent studios with transparent digital game ownership.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/games"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all text-center"
            >
              Start Exploring Quests →
            </Link>
            <Link
              href="/add-games"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all text-center"
            >
              Join as a Game Creator
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> No Bloatware Required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Direct-from-Developer Keys
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Verified-Owner Reviews Only
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
