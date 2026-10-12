import React from "react";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    hasThumbnail?: boolean;
}

export default function TableSkeleton({ rows = 5, columns = 4, hasThumbnail = true }: TableSkeletonProps) {
    return (
        <div className="w-full space-y-3 py-2 animate-pulse">
            {/* Mobile / Tablet Cards Skeleton (< lg) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
                {Array.from({ length: rows }).map((_, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            {hasThumbnail && (
                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                            )}
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <div className="h-4 w-3/5 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                                <div className="h-2.5 w-2/5 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table Skeleton (hidden lg:block) */}
            <div className="hidden lg:block overflow-x-auto">
                <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60 gap-4">
                    <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>

                {Array.from({ length: rows }).map((_, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50 gap-4"
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {hasThumbnail && (
                                <div className="w-9 h-11 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                            )}
                            <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="h-3.5 w-2/5 min-w-[120px] bg-slate-300 dark:bg-slate-700 rounded" />
                                <div className="h-2.5 w-1/4 min-w-[80px] bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
