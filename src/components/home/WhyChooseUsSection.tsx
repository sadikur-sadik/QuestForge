"use client";

import React from "react";

interface Advantage {
  title: string;
  tagline: string;
  description: string;
  iconBg: string;
  iconColor: string;
  metric: string;
  metricLabel: string;
  metricGradient: string;
  icon: React.ReactNode;
}

export default function WhyChooseUsSection() {
  const advantages: Advantage[] = [
    {
      title: "Direct-from-Creator Keys",
      tagline: "Authentic Licenses",
      description:
        "Every game key is generated directly through verified studios and licensed publishers. No gray market brokers, no revoked keys.",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      metric: "100%",
      metricLabel: "GENUINE KEYS",
      metricGradient: "from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Zero Bloated Launchers",
      tagline: "Pure Web Access",
      description:
        "Say goodbye to 500MB background launchers eating CPU and RAM. Manage your collection and download game files straight from your browser.",
      iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      metric: "0 MB",
      metricLabel: "SYSTEM OVERHEAD",
      metricGradient: "from-cyan-600 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Cross-Platform Ecosystem",
      tagline: "Unified Vault",
      description:
        "Aggregate titles across PC, PlayStation 5, Xbox Series X/S, and Nintendo Switch in a single, high-fidelity personal backlog registry.",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      metric: "4+",
      metricLabel: "PLATFORMS TRACKED",
      metricGradient: "from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      title: "Verified-Owner Reviews",
      tagline: "Zero Review Bombing",
      description:
        "Only players who own the game in their personal library can publish reviews, completely eliminating bot attacks and review-bombing brigades.",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      metric: "100%",
      metricLabel: "VERIFIED REVIEWS",
      metricGradient: "from-amber-600 to-rose-500 dark:from-amber-400 dark:to-rose-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      title: "Empowering Indie Studios",
      tagline: "Creator-First Split",
      description:
        "Legacy storefronts take up to 30% from developers. QuestForge empowers creators with 95% revenue retention and live seller analytics.",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      metric: "95%",
      metricLabel: "CREATOR SHARE",
      metricGradient: "from-rose-600 to-violet-500 dark:from-rose-400 dark:to-violet-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Bank-Grade Encryption",
      tagline: "Protected Vault",
      description:
        "Your account tokens, order records, and key vault are secured with modern 256-bit TLS encryption and redundant cloud backups.",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      metric: "256-bit",
      metricLabel: "TLS SECURITY",
      metricGradient: "from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="qf-container py-10 sm:py-16 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            The QuestForge Advantage
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
          Why Gamers & Creators Choose QuestForge
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
          We built the marketplace we always wanted: lightweight, transparent, fair to developers, and respectful of your digital ownership.
        </p>
      </div>

      {/* Grid of 6 Advantage Cards matching Picture 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {advantages.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300"
          >
            <div>
              {/* Header row with Square Icon Box & Bold Metric */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r ${item.metricGradient} bg-clip-text text-transparent font-sans`}>
                    {item.metric}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {item.metricLabel}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              <span className="text-violet-600 dark:text-violet-400 font-bold uppercase text-[9px] tracking-wider">
                {item.tagline}
              </span>
              <span className="text-cyan-500 text-xs">✓ Active</span>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
