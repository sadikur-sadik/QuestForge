import React from "react";

export default function ProfileSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors animate-pulse">
            <div className="relative z-10 qf-container max-w-6xl 3xl:max-w-7xl mx-auto flex flex-col gap-8">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <div className="h-8 w-60 bg-slate-300 dark:bg-slate-700 rounded-xl" />
                    <div className="h-3.5 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>

                {/* Grid Layout: Left Avatar Card (4 cols), Right Settings Form (8 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Left Card: Avatar & Summary */}
                    <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xl flex flex-col items-center text-center space-y-4">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1.5 w-full flex flex-col items-center">
                            <div className="h-5 w-36 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="h-5 w-24 bg-violet-500/20 rounded-full" />

                        {/* Fast stats row */}
                        <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 space-y-1">
                                <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                                <div className="h-4 w-8 bg-slate-300 dark:bg-slate-700 rounded mx-auto" />
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 space-y-1">
                                <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                                <div className="h-4 w-8 bg-slate-300 dark:bg-slate-700 rounded mx-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Account Settings Form */}
                    <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xl space-y-6">
                        <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="h-5 w-44 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                            <div className="h-3 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                            <div className="h-11 w-36 bg-violet-600/20 rounded-xl mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
