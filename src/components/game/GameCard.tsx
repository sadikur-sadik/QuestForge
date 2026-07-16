"use client";

import React from "react";
import { toast } from "react-toastify";
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

  // Renders the rating stars
  const renderStars = (rating: number) => {
    const safeRating = rating ?? 5.0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    const totalStars = 5;

    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-grad">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path fill="url(#half-grad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: totalStars - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-3.5 h-3.5 fill-current text-slate-300 dark:text-slate-700" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold ml-1.5">{safeRating.toFixed(1)}</span>
      </div>
    );
  };


  return (
    <div className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/50 to-transparent dark:from-slate-800/40 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-2xl">
      <div className="h-full bg-white dark:bg-slate-900 rounded-[23px] flex flex-col border border-slate-200/30 dark:border-slate-800/20 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
        
        {/* Cover Art Area */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
          {/* Price overlay */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl font-extrabold text-white text-xs bg-slate-950/80 backdrop-blur-md shadow-md border border-white/10">
            {formattedPrice}
          </div>
          {/* Genre Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white shadow-sm border border-violet-400/20">
            {game.genre}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          
          {/* Title & Rating */}
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-extrabold text-slate-950 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300 truncate">
              {game.title}
            </h3>
            <div className="flex items-center justify-between">
              {renderStars(game.rating)}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                {game.releaseDate}
              </span>
            </div>
          </div>

          {/* Description (Truncated) */}
          <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300 line-clamp-2 leading-relaxed flex-1">
            {game.description}
          </p>

          {/* Platforms supported */}
          <div className="flex flex-wrap gap-1.5">
            {game.platforms.map((plat) => (
              <span
                key={plat}
                className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30"
              >
                {plat}
              </span>
            ))}
          </div>

          {/* Developer & Publisher info */}
          {(game.developer || game.publisher) && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500 flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-800/40 pt-2">
              {game.developer && (
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Developer:</span> {game.developer}
                </div>
              )}
              {game.publisher && (
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Publisher:</span> {game.publisher}
                </div>
              )}
            </div>
          )}

          {/* Creator Attribution */}
          {game.creator && (
            <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/40 pt-3">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-violet-500/20">
                {game.creator.image ? (
                  <img src={game.creator.image} alt={game.creator.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400">
                    {game.creator.name[0]}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 font-semibold leading-none">Listed by</span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold truncate leading-snug">
                  {game.creator.name}
                </span>
              </div>
            </div>
          )}

          {/* Action button */}
          <Link
            href={`/games/${game.id}`}
            className="w-full mt-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center"
          >
            View Details
          </Link>

        </div>

      </div>
    </div>
  );
}
