"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const GENRES = [
  "Action",
  "RPG",
  "Indie",
  "Strategy",
  "Adventure",
  "Simulation",
  "Shooter",
  "Racing",
  "Sports",
];

const PLATFORMS = ["PC", "PS5", "Xbox Series X/S", "Nintendo Switch"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Releases" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function GameSearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current filters from search parameters
  const searchQuery = searchParams.get("search") || "";
  const activeGenre = searchParams.get("genre") || "";
  const activePlatform = searchParams.get("platform") || "";
  const activeSort = searchParams.get("sort") || "newest";

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset page if applicable
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = searchQuery || activeGenre || activePlatform || activeSort !== "newest";

  return (
    <div className="w-full flex flex-col gap-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Field */}
        <div className="md:col-span-4 relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search game titles..."
            value={searchQuery}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400"
          />
        </div>

        {/* Platform/Device Selector */}
        <div className="md:col-span-3 flex flex-col">
          <select
            value={activePlatform}
            onChange={(e) => handleFilterChange("platform", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-500">All Platforms (Devices)</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Selector */}
        <div className="md:col-span-2 flex flex-col">
          <select
            value={activeGenre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-500">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-2 flex flex-col">
          <select
            value={activeSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="md:col-span-1 flex justify-end">
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              className="w-full md:w-11 h-11 flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              title="Clear all filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          )}
        </div>

      </div>

      {/* Pending transition indicator */}
      {isPending && (
        <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-full">
          <div className="h-full bg-violet-600 animate-pulse w-1/3 rounded-full" style={{ animationDuration: "1s" }} />
        </div>
      )}
    </div>
  );
}
