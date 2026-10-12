import React from "react";

export default function AnalyticsSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-6 sm:py-10 bg-slate-50 dark:bg-slate-950 transition-colors animate-pulse">
            <div className="relative z-10 qf-container flex flex-col gap-6 sm:gap-8">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded-xl" />
                        <div className="h-3.5 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                    <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                </div>

                {/* KPI Metrics Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/70 flex items-center justify-between shadow-sm"
                        >
                            <div className="space-y-2 flex-1 pr-2">
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-7 w-24 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                                <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                        </div>
                    ))}
                </div>

                {/* 4 Chart Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((c) => (
                        <div
                            key={c}
                            className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/70 shadow-sm space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                                <div className="space-y-1">
                                    <div className="h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                                    <div className="h-2.5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                            </div>
                            {/* Chart Area */}
                            <div className="w-full h-72 3xl:h-96 bg-slate-50 dark:bg-slate-850/40 rounded-2xl flex items-end p-6 gap-3">
                                {[35, 60, 45, 80, 55, 90, 70, 85].map((h, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-1 bg-violet-500/20 rounded-t-lg"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
