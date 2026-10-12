"use client";

import React from "react";
import Link from "next/link";

export interface DynamicReview {
  id?: string;
  _id?: string;
  author: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
  userImage?: string;
  userRole?: string;
  game?: {
    id?: string;
    title?: string;
    coverUrl?: string;
    genre?: string;
  } | null;
}

interface TestimonialsSectionProps {
  reviews?: DynamicReview[];
}

export default function TestimonialsSection({ reviews = [] }: TestimonialsSectionProps) {
  // If database has no reviews, do not render section
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Display top 3 reviews from the database
  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="qf-container py-10 sm:py-16 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            Community Voices
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
          Trusted by Players & Creators Worldwide
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
          See how gamers, developers, and reviewers are reshaping their digital gaming experience on QuestForge.
        </p>
      </div>

      {/* Dynamic Reviews from Database in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayReviews.map((r, idx) => {
          const authorName = r.user?.name || r.author || "Community Player";
          const authorInitial = authorName ? authorName.trim()[0].toUpperCase() : "G";
          const avatarUrl = r.user?.image || r.userImage;
          const userRole = (r.user?.role || r.userRole || "").toLowerCase();

          const roleLabel =
            userRole === "seller"
              ? "VERIFIED CREATOR"
              : userRole === "admin"
              ? "ADMINISTRATOR"
              : userRole === "buyer"
              ? "VERIFIED EXPLORER"
              : userRole
              ? `VERIFIED ${userRole.toUpperCase()}`
              : idx === 0
              ? "VERIFIED CREATOR"
              : idx === 1
              ? "VERIFIED EXPLORER"
              : "TOP REVIEWER";

          const iconColors = [
            "bg-violet-500/15 text-violet-400",
            "bg-cyan-500/15 text-cyan-400",
            "bg-rose-500/15 text-rose-400",
          ];
          const iconColor = iconColors[idx % iconColors.length];
          const reviewDate = r.date || (r.createdAt ? String(r.createdAt).slice(0, 10) : "Recent");
          const safeRating = typeof r.rating === "number" ? r.rating : Number(r.rating) || 5;

          return (
            <div
              key={r.id || r._id || `rev-${idx}`}
              className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 shadow-sm dark:shadow-md hover:scale-[1.02] hover:border-violet-500/50 transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Dynamic Role Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: Math.min(5, Math.max(1, Math.round(safeRating))) }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                      {safeRating.toFixed(1)}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
                    {roleLabel}
                  </span>
                </div>

                {/* Comment from Database */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-5 line-clamp-4">
                  "{r.comment}"
                </p>
              </div>

              {/* User Info & Game Details Footer */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {authorInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {authorName}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Reviewed on {reviewDate}
                    </p>
                  </div>
                </div>

                {r.game?.title && (
                  <div className="text-right shrink-0 max-w-[120px] sm:max-w-[140px]">
                    {r.game.id ? (
                      <Link
                        href={`/games/${r.game.id}`}
                        className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline truncate block"
                      >
                        {r.game.title}
                      </Link>
                    ) : (
                      <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 truncate block">
                        {r.game.title}
                      </span>
                    )}
                    {r.game.genre && (
                      <span className="text-[9px] uppercase font-bold text-slate-400">
                        {r.game.genre}
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
