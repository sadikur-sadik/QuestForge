import React from "react";

export default function GameDetailsSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-6 sm:py-10 bg-slate-50 dark:bg-slate-950 transition-colors animate-pulse">
            <div className="relative z-10 qf-container flex flex-col gap-6 sm:gap-10">
                {/* Navigation Breadcrumb Skeleton */}
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />

                {/* Hero Section Container (12-column layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Left Block: Image & Metadata */}
                    <div className="lg:col-span-5 3xl:col-span-4 flex flex-col gap-4 sm:gap-6">
                        {/* Game Poster Cover Skeleton */}
                        <div className="relative aspect-video lg:aspect-[4/5] rounded-3xl bg-slate-200 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 shadow-xl overflow-hidden" />

                        {/* Listing Attribution Card */}
                        <div className="p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 space-y-4">
                            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-850 shrink-0" />
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-3.5 w-28 bg-slate-300 dark:bg-slate-700 rounded" />
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3.5 w-24 bg-slate-300 dark:bg-slate-700 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Right Block: Content, Chart, Actions */}
                    <div className="lg:col-span-7 3xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
                        {/* Game Info Details Card */}
                        <div className="p-5 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 space-y-5">
                            <div className="space-y-2.5">
                                <div className="h-8 sm:h-10 3xl:h-12 w-3/4 max-w-lg bg-slate-300 dark:bg-slate-700 rounded-2xl" />
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="h-4 w-12 bg-amber-500/20 rounded-md" />
                                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="flex gap-1.5">
                                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Description lines */}
                            <div className="space-y-2 py-2">
                                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3.5 w-11/12 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>

                            {/* Price Card */}
                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850/60 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="h-2.5 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-7 w-24 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                                </div>
                                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                                <div className="h-12 rounded-2xl bg-violet-600/20" />
                            </div>
                        </div>

                        {/* Rating Distribution Chart Skeleton */}
                        <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 space-y-4">
                            <div className="space-y-1.5">
                                <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
                                <div className="h-3 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="w-full h-44 bg-slate-100/60 dark:bg-slate-850/40 rounded-2xl p-4 flex flex-col justify-between">
                                {[1, 2, 3, 4, 5].map((b) => (
                                    <div key={b} className="flex items-center gap-3">
                                        <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                                        <div
                                            className="h-2.5 bg-violet-500/20 rounded-r-md"
                                            style={{ width: `${80 - b * 12}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Submission & Comments Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
                    <div className="lg:col-span-5 3xl:col-span-4 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 space-y-4">
                        <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded" />
                        <div className="h-10 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                        <div className="h-24 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                        <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>

                    <div className="lg:col-span-7 3xl:col-span-8 space-y-4">
                        <div className="h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded" />
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((r) => (
                                <div
                                    key={r}
                                    className="p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
                                            <div className="h-3 w-20 bg-slate-300 dark:bg-slate-700 rounded" />
                                        </div>
                                        <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                                    </div>
                                    <div className="h-2 w-16 bg-amber-400/20 rounded" />
                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
