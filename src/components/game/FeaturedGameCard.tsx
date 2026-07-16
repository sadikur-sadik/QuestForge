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
    <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200/50 to-transparent dark:from-slate-800/40 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-xl">
      <div className="h-full bg-white dark:bg-slate-900 rounded-[15px] flex flex-col border border-slate-200/30 dark:border-slate-800/20 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
        
        {/* Cover Art Area */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Price overlay */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg font-extrabold text-white text-[10px] bg-slate-950/80 backdrop-blur-md shadow-sm border border-white/5">
            {formattedPrice}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300 truncate">
              {game.title}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <span>{game.genre}</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                ★ <span className="text-slate-600 dark:text-slate-400">{game.rating.toFixed(1)}</span>
              </span>
            </div>
          </div>

          <Link
            href={`/games/${game.id}`}
            className="w-full py-2 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}
