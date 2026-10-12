import React from "react";

interface DashboardSkeletonProps {
    roleName?: string;
}

export default function DashboardSkeleton({ roleName = "Console" }: DashboardSkeletonProps) {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 animate-pulse w-full">
            {/* Header Banner Skeleton */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-200/40 dark:border-slate-800/80 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4 w-full">
                        {/* Icon Badge Placeholder */}
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-slate-800/80 shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Role Badge */}
                            <div className="h-4 w-28 sm:w-36 bg-slate-800/80 rounded-full" />
                            {/* Title */}
                            <div className="h-6 sm:h-7 w-48 sm:w-72 bg-slate-700/70 rounded-xl" />
                            {/* Subtitle */}
                            <div className="h-3 sm:h-3.5 w-full max-w-md bg-slate-800/60 rounded-lg hidden xs:block" />
                        </div>
                    </div>
                    {/* Action button placeholder */}
                    <div className="h-9 w-28 bg-slate-800/80 rounded-xl shrink-0 hidden sm:block" />
                </div>
            </div>

            {/* 4 Metric KPI Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/70 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex-1 min-w-0 space-y-2 pr-2">
                            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-6 sm:h-7 w-16 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                            <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Tab Navigation Pills Skeleton */}
            <div className="flex gap-2 pb-1 border-b border-slate-200/60 dark:border-slate-800/70 overflow-x-auto no-scrollbar">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 w-28 sm:w-36 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                ))}
            </div>

            {/* Main Content Area: Table / Content Card Skeleton */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/70 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <div className="space-y-1.5">
                        <div className="h-5 w-40 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                        <div className="h-3 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg hidden sm:block" />
                </div>

                {/* Table Header Bar */}
                <div className="h-8 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />

                {/* Table Rows */}
                <div className="space-y-3 pt-1">
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div
                            key={row}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800/40 gap-4"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                                <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="h-3.5 w-1/3 bg-slate-300 dark:bg-slate-700 rounded" />
                                    <div className="h-2.5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                            </div>
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded hidden sm:block" />
                            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
