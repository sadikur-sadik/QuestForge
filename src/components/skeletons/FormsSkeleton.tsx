import React from "react";

export default function FormsSkeleton() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-8 sm:py-12 lg:py-16 bg-slate-50 dark:bg-slate-950 transition-colors animate-pulse">
            <div className="relative z-10 qf-container flex flex-col items-center">
                {/* Back Link */}
                <div className="w-full max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl mb-6">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>

                {/* Form Card */}
                <div className="w-full max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl p-6 sm:p-8 3xl:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xl space-y-6">
                    {/* Header */}
                    <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded-xl" />
                        <div className="h-3.5 w-96 max-w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    </div>

                    {/* Inputs Grid */}
                    <div className="space-y-5">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-28 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                        </div>

                        {/* Dual Column: Genre & Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                        </div>

                        {/* Dual Column: Developer & Publisher */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-11 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
                            </div>
                        </div>

                        {/* Platform Checkboxes */}
                        <div className="space-y-2">
                            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4].map((p) => (
                                    <div key={p} className="h-8 w-24 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                                ))}
                            </div>
                        </div>

                        {/* Cover Image Upload Area */}
                        <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-32 sm:h-40 w-full rounded-2xl bg-slate-100 dark:bg-slate-850 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="h-12 w-full bg-violet-600/20 rounded-xl mt-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
