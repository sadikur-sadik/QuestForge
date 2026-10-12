"use client";

import React from "react";
import Link from "next/link";
import { Game } from "./GameCard";

interface FeaturedGameCardProps {
  game: Game;
}

export default function FeaturedGameCard({ game }: FeaturedGameCardProps) {
  const formattedPrice = game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`;

  return (
    <Link
      href={`/games/${game.id}`}
      className="group rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 hover:border-violet-500/50 shadow-sm dark:shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
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

        {/* Price overlay */}
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

      {/* Info Area */}
      <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200 truncate">
            {game.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium min-w-0">
            <span className="truncate mr-2">{game.genre}</span>
            {game.reviewsCount && game.reviewsCount > 0 && game.rating > 0 ? (
              <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{game.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-normal">({game.reviewsCount})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-normal shrink-0">
                <svg className="w-3.5 h-3.5 fill-slate-300 dark:fill-slate-700" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Unrated</span>
              </span>
            )}
          </div>
        </div>

        {/* CTA Button matching Picture 1 clean style */}
        <div className="w-full py-2 rounded-xl text-xs font-bold bg-violet-600/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white border border-violet-500/20 group-hover:border-violet-500 transition-all duration-200 flex items-center justify-center gap-1.5 mt-1">
          <span>View Details</span>
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </div>
      </div>

    </Link>
  );
}
