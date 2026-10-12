import React from "react";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden pb-16">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-[20%] left-[8%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10 space-y-12 sm:space-y-16 animate-pulse">
        
        {/* 1. Hero Banner Skeleton */}
        <section className="pt-4 pb-2">
          <div className="w-full qf-container py-2">
            <div className="relative w-full rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/40 p-6 sm:p-10 lg:p-14 shadow-sm dark:shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left column */}
                <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
                  {/* System badge */}
                  <div className="h-6 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
                  
                  {/* Big title */}
                  <div className="space-y-2">
                    <div className="h-10 sm:h-14 w-4/5 max-w-md rounded-2xl bg-slate-300 dark:bg-slate-800" />
                    <div className="h-1.5 w-24 rounded-full bg-violet-500/30" />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-2 max-w-xl">
                    <div className="h-5 w-3/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
                    <div className="h-4 w-4/5 rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                    <div className="h-11 w-36 rounded-xl bg-violet-500/20 dark:bg-violet-500/30" />
                    <div className="h-11 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>

                {/* Right column: Graphic placeholder */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-60 sm:w-72 lg:w-80 aspect-square rounded-full bg-slate-200/60 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-800/60 flex items-center justify-center">
                    <div className="w-40 sm:w-48 aspect-square rounded-full bg-slate-300/40 dark:bg-slate-700/40 border border-slate-300/30" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 2. Platform Stats Section Skeleton */}
        <section className="py-2 sm:py-4">
          <div className="qf-container">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
              <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 sm:h-10 w-72 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
              <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-24 rounded-lg bg-slate-300 dark:bg-slate-800" />
                  <div className="h-3 w-28 rounded bg-slate-200/70 dark:bg-slate-800/60" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. The QuestForge Advantage Skeleton */}
        <section className="qf-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
            <div className="h-6 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 sm:h-10 w-80 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
          </div>

          {/* 6 Advantage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1 text-right">
                      <div className="h-7 w-16 rounded bg-slate-300 dark:bg-slate-700 ml-auto" />
                      <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-slate-800 ml-auto" />
                    </div>
                  </div>
                  <div className="h-5 w-48 rounded bg-slate-300 dark:bg-slate-700 mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3.5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-14 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Hot Marketplace Drops Skeleton */}
        <section className="qf-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
            <div className="h-6 w-44 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 sm:h-10 w-64 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
          </div>

          {/* 6 Featured Game Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 relative">
                  <div className="absolute bottom-2.5 right-2.5 h-6 w-14 rounded-xl bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1">
                  <div className="space-y-1.5">
                    <div className="h-4 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                    <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-8 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/60 mt-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex justify-center">
            <div className="h-9 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </section>

        {/* 4. Adventure Realms Skeleton */}
        <section className="qf-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
            <div className="h-6 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 sm:h-10 w-56 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
          </div>

          {/* Category Cards Carousel Placeholder */}
          <div className="flex gap-4 overflow-hidden py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[240px] sm:w-[280px] flex-shrink-0 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-5 w-28 rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 mt-2" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Top-Rated Community Quests Skeleton */}
        <section className="qf-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
            <div className="h-6 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 sm:h-10 w-72 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
          </div>

          {/* 4 Ranked Game Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 relative">
                  <div className="absolute top-2.5 left-2.5 h-6 w-12 rounded-lg bg-slate-950/40" />
                  <div className="absolute bottom-2.5 right-2.5 h-6 w-14 rounded-xl bg-slate-950/40" />
                </div>
                <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1">
                  <div className="space-y-1.5">
                    <div className="h-4 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-7 w-full rounded-xl bg-amber-500/10 border border-amber-500/20" />
                  <div className="h-8 w-full rounded-xl bg-slate-200/80 dark:bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex justify-center">
            <div className="h-9 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </section>

        {/* 6. Verified Community Reviews Skeleton */}
        <section className="qf-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 flex flex-col items-center gap-2.5">
            <div className="h-6 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 sm:h-10 w-80 max-w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
          </div>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="h-4 w-20 rounded bg-amber-500/20" />
                    <div className="h-5 w-24 rounded-md bg-violet-500/10" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-20 rounded bg-slate-300 dark:bg-slate-700" />
                      <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2 w-10 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
