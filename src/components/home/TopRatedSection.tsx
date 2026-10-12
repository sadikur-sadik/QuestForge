"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/components/game/GameCard";

interface TopRatedSectionProps {
  games: Game[];
}

export default function TopRatedSection({ games }: TopRatedSectionProps) {
  if (!games || games.length === 0) {
    return null;
  }

  return (
    <section className="qf-container py-10 sm:py-16 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            Hall of Fame · Top Rated Quests
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
          Top-Rated Community Quests
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
          Critically acclaimed interactive titles ranked directly by player ratings and reviews in our database.
        </p>
      </div>

      {/* Grid of Top Rated Games (Following Picture 1 Card Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {games.map((game, index) => {
          const formattedPrice = game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`;
          const rankNumber = `#${index + 1}`;

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 hover:border-amber-500/50 shadow-sm dark:shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Cover Art Area (16:9 Aspect Ratio) */}
              <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                {/* Rank Badge (Top Left) */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg font-black text-xs bg-slate-950/85 text-amber-400 backdrop-blur-md shadow-md border border-amber-400/25 flex items-center gap-1">
                  <span>🏆</span>
                  <span>{rankNumber}</span>
                </div>

                {/* Price Badge (Bottom Right) */}
                <div
                  className={`absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl font-black text-xs backdrop-blur-md shadow-md border ${
                    game.price === 0
                      ? "bg-emerald-500/90 text-white border-emerald-400/30"
                      : "bg-slate-950/85 text-cyan-300 dark:text-cyan-400 border-white/10"
                  }`}
                >
                  {formattedPrice}
                </div>
              </div>

              {/* Content Body Area */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 min-w-0">
                
                {/* Title & Studio */}
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-200 truncate">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                    {game.developer || (game.creator ? `By ${game.creator.name}` : game.genre)}
                  </p>
                </div>

                {/* Rating Badge Row */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>
                      {game.reviewsCount && game.reviewsCount > 0 && game.rating > 0
                        ? `${game.rating.toFixed(1)} / 5.0`
                        : "Unrated"}
                    </span>
                    {game.reviewsCount && game.reviewsCount > 0 && (
                      <span className="text-[10px] font-bold text-amber-600/80 dark:text-amber-400/80">
                        ({game.reviewsCount})
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {game.reviewsCount && game.reviewsCount > 0 ? "TOP RATED" : "NEW"}
                  </span>
                </div>

                {/* Action CTA Button Row (Padded, clean, never cut off) */}
                <div className="w-full py-2 rounded-xl text-xs font-bold bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white border border-violet-500/20 group-hover:border-violet-500 transition-all duration-200 flex items-center justify-center gap-1.5 mt-1">
                  <span>View Details</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </div>

              </div>

            </Link>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10 text-center">
        <Link
          href="/games?sort=rating"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-violet-600 dark:hover:bg-violet-600 border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
        >
          <span>View All Top Rated</span>
          <span>→</span>
        </Link>
      </div>

    </section>
  );
}
