import React from "react";

export default function InteractionsSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors animate-pulse">
            <div className="relative z-10 qf-container max-w-5xl 3xl:max-w-6xl mx-auto flex flex-col gap-8">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-8 w-60 bg-slate-300 dark:bg-slate-700 rounded-xl" />
                        <div className="h-3.5 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                    <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                </div>

                {/* Reviews List / Grid Skeleton */}
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="p-5 sm:p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 shadow-sm space-y-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                                    <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                                <div className="h-4 w-14 bg-amber-400/20 rounded-md shrink-0" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
