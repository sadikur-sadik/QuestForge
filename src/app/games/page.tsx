import React from "react";
import { getBackendGames } from "@/lib/fetch/get-games";
import GameCard, { Game } from "@/components/game/GameCard";
import GameSearchFilter from "@/components/game/GameSearchFilter";
import Link from "next/link";

interface SearchParams {
  search?: string;
  genre?: string;
  sort?: string;
  platform?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function GamesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.search || "";
  const activeGenre = searchParams.genre || "";
  const activePlatform = searchParams.platform || "";
  const activeSort = searchParams.sort || "newest";

  // Fetch games during SSR from backend API
  const dbGames = await getBackendGames({
    search: searchQuery,
    genre: activeGenre,
    platform: activePlatform,
    sort: activeSort,
  });

  const filteredGames: Game[] = dbGames.map((game: any) => ({
    id: game._id ? game._id.toString() : game.id,
    title: game.title,
    description: game.description,
    genre: game.genre,
    price: game.price,
    platforms: game.platforms,
    coverUrl: game.coverUrl,
    rating: game.rating,
    releaseDate: game.releaseDate,
    developer: game.developer,
    publisher: game.publisher,
    creator: game.creator,
  }));

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-300 uppercase">
              Games Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Quest Marketplace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl transition-colors duration-300">
            Explore and acquire new quests. Filter by your preferred genre or sort listings to find the perfect adventure.
          </p>
        </div>

        {/* Client Search/Filter controls (CSR) */}
        <GameSearchFilter />

        {/* Catalog grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          /* Empty Search Result state */
          <div className="w-full flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No quests found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                We couldn't find any games matching "{searchQuery}" in {activeGenre || "this genre"}.
              </p>
            </div>
            <Link href="/games" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-sm transition-all">
              Reset Filters
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
