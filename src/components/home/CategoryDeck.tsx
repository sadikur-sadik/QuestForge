"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

interface CategoryItem {
  name: string;
  gradient: string;
  description: string;
  glowColor: string;
  icon: React.ReactNode;
}

export default function CategoryDeck() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: CategoryItem[] = [
    {
      name: "Action",
      gradient: "from-rose-500 to-orange-500",
      glowColor: "bg-rose-500/20",
      description: "Fast-paced battle and combat reflexes",
      icon: (
        <svg className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l-4 16M4 8l16 8" />
        </svg>
      ),
    },
    {
      name: "RPG",
      gradient: "from-violet-500 to-indigo-500",
      glowColor: "bg-violet-500/20",
      description: "Epic stories and character creations",
      icon: (
        <svg className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      name: "Indie",
      gradient: "from-emerald-500 to-teal-500",
      glowColor: "bg-emerald-500/20",
      description: "Unique concepts and hand-crafted designs",
      icon: (
        <svg className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      name: "Strategy",
      gradient: "from-blue-500 to-indigo-500",
      glowColor: "bg-blue-500/20",
      description: "Tactical planning and foresight planning",
      icon: (
        <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: "Adventure",
      gradient: "from-amber-500 to-orange-500",
      glowColor: "bg-amber-500/20",
      description: "Explore deep worlds and solve puzzles",
      icon: (
        <svg className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      name: "Simulation",
      gradient: "from-teal-500 to-emerald-500",
      glowColor: "bg-teal-500/20",
      description: "Realistic operations and life creation",
      icon: (
        <svg className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Shooter",
      gradient: "from-pink-500 to-rose-500",
      glowColor: "bg-pink-500/20",
      description: "Precision aiming, combat, and weaponry",
      icon: (
        <svg className="w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
    {
      name: "Racing",
      gradient: "from-yellow-500 to-amber-500",
      glowColor: "bg-yellow-500/20",
      description: "Adrenaline-fueled speed championships",
      icon: (
        <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
    },
    {
      name: "Sports",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "bg-green-500/20",
      description: "Real-world athletic tournaments",
      icon: (
        <svg className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/games?genre=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="relative w-full select-none group/deck">
      {/* Left Control Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full hidden sm:flex items-center justify-center bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md opacity-0 group-hover/deck:opacity-100"
      >
        ←
      </button>

      {/* Right Control Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full hidden sm:flex items-center justify-center bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md opacity-0 group-hover/deck:opacity-100"
      >
        →
      </button>

      {/* Categories Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="snap-start min-w-[260px] sm:min-w-[280px] flex-shrink-0 relative group p-6 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 hover:border-violet-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg"
          >
            {/* Blurred glow circle corresponding to themed color */}
            <div className={`absolute top-[-20%] right-[-20%] w-32 h-32 rounded-full ${cat.glowColor} blur-2xl group-hover:scale-125 transition-transform duration-500`} />

            {/* Glowing vertical pill style category decorator */}
            <div className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-gradient-to-b ${cat.gradient} opacity-80`} />

            {/* The icon container box */}
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-violet-500/20 transition-all duration-300">
              {cat.icon}
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-2 relative z-10 pl-1">
              <h3 className="text-lg font-black text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {cat.description}
              </p>

              {/* Browse Realm CTA Link */}
              <div className="flex items-center gap-1.5 mt-4 text-[10px] uppercase font-extrabold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity text-violet-600 dark:text-violet-400">
                <span>Browse Realm</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
