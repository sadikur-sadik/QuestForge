"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Step {
  number: string;
  title: string;
  role: "Gamers" | "Creators" | "All";
  badge: string;
  description: string;
  iconBg: string;
  iconColor: string;
  numberGradient: string;
  icon: React.ReactNode;
  highlights: string[];
}

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"all" | "gamers" | "creators">("all");

  const steps: Step[] = [
    {
      number: "01",
      title: "Explore the Digital Realm",
      role: "Gamers",
      badge: "Discovery",
      description:
        "Browse an ever-expanding registry of indie triumphs, AAA hits, and hidden gems across PC, PlayStation, Xbox, and Nintendo Switch.",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      numberGradient: "from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400",
      highlights: ["Multi-genre filtering", "Verified community ratings", "Direct platform badges"],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Instant Key Allocation",
      role: "Gamers",
      badge: "Delivery",
      description:
        "Acquire free or paid quests with zero friction. Digital licensing keys are cryptographically generated and instantly stored in your Vault.",
      iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      numberGradient: "from-cyan-600 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
      highlights: ["Zero waiting periods", "Automated fulfillment", "Permanent receipts"],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Master Your Personal Library",
      role: "Gamers",
      badge: "Organization",
      description:
        "Track completion statuses, monitor backlog progress, download install archives, and maintain wishlists all from your customized dashboard.",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      numberGradient: "from-rose-600 to-violet-500 dark:from-rose-400 dark:to-violet-400",
      highlights: ["Cross-platform tracking", "Download package archives", "Personal play logs"],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Publish & Monetize Seamlessly",
      role: "Creators",
      badge: "Creators",
      description:
        "Game studios and indie developers forge listings, deploy game keys, set fair pricing, and analyze global sales revenue without restrictive lock-ins.",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      numberGradient: "from-amber-600 to-rose-500 dark:from-amber-400 dark:to-rose-400",
      highlights: ["Instant publishing portal", "Live seller analytics", "Direct-to-player delivery"],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const filteredSteps =
    activeTab === "all"
      ? steps
      : steps.filter((s) => s.role.toLowerCase() === activeTab || s.role === "All");

  return (
    <section className="qf-container py-10 sm:py-16 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            Platform Blueprint
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
          How QuestForge Operates
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          From discovering hidden masterworks to forging and publishing your own titles, QuestForge unites the entire gaming experience.
        </p>

        {/* Audience Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {(["all", "gamers", "creators"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              {tab === "all" ? "Complete Journey" : `For ${tab}`}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Step Grid Following Picture 1 Card Aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredSteps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] hover:border-violet-500/50 transition-all duration-300"
          >
            <div>
              {/* Card Top: Square Icon Box & Step number */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${step.iconBg} ${step.iconColor} flex items-center justify-center`}>
                  {step.icon}
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r ${step.numberGradient} bg-clip-text text-transparent font-sans`}>
                  {step.number}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {step.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {step.description}
              </p>
            </div>

            {/* Highlights checklist */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
              {step.highlights.map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
