"use client";

import React from "react";
import Link from "next/link";

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  price: number;
  platforms: string[];
  coverUrl: string;
  rating: number;
  reviewsCount?: number;
  releaseDate: string;
  developer?: string;
  publisher?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const formattedPrice = game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`;
  const hasReviews = Boolean(game.reviewsCount && game.reviewsCount > 0 && game.rating > 0);
  const safeRating = hasReviews ? game.rating : 0;

  // Release year or short date
  const releaseYear = game.releaseDate ? game.releaseDate.slice(0, 4) : "";

  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative p-[1px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/60 to-transparent dark:from-slate-800/60 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      <div className="h-full bg-white dark:bg-slate-900 rounded-[23px] flex flex-col border border-slate-200/40 dark:border-slate-800/40 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
        
        {/* Cover Art Area (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Bottom subtle gradient scrim for badge legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

          {/* Genre Badge (Top Left) */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-md shadow-sm border border-violet-400/20">
            {game.genre}
          </div>

          {/* Price Badge (Bottom Right) */}
          <div
            className={`absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl font-extrabold text-xs backdrop-blur-md shadow-md border ${
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
          
          {/* Title & Developer / Subhead */}
          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200 truncate">
              {game.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {game.developer || (game.creator ? `By ${game.creator.name}` : game.genre)}
            </p>
          </div>

          {/* Middle Row: Authentic Rating & Platforms */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Rating + Release Year */}
            <div className="flex items-center gap-1.5 shrink-0">
              {hasReviews ? (
                <>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{safeRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    ({game.reviewsCount})
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <svg className="w-3.5 h-3.5 fill-slate-300 dark:fill-slate-700" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs">Unrated</span>
                </div>
              )}
              {releaseYear && (
                <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                  · {releaseYear}
                </span>
              )}
            </div>

            {/* Platform Pills */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="flex items-center gap-1 shrink-0 overflow-hidden">
                {game.platforms.slice(0, 2).map((plat) => (
                  <span
                    key={plat}
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {plat.replace("Xbox Series X/S", "Xbox").replace("Nintendo Switch", "Switch")}
                  </span>
                ))}
                {game.platforms.length > 2 && (
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                    +{game.platforms.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Row: Creator Attribution & CTA Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
            {game.creator ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-violet-500/20">
                  {game.creator.image ? (
                    <img src={game.creator.image} alt={game.creator.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] font-bold text-violet-500 dark:text-violet-400">
                      {game.creator.name[0]}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[90px] sm:max-w-[110px]">
                  {game.creator.name}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {game.genre}
              </span>
            )}

            {/* Interactive CTA Pill */}
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 group-hover:bg-violet-600 text-slate-700 dark:text-slate-300 group-hover:text-white border border-slate-200/60 dark:border-slate-700/60 group-hover:border-violet-500 transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-sm">
              <span>View Details</span>
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </Link>
  );
}
