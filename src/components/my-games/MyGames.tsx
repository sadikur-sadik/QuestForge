import React from "react";
import MyGameCard from "@/components/game/MyGameCard";
import Link from "next/link";
import { Game } from "@/components/game/GameCard";

interface MyGamesProps {
  games: Game[];
}

export default function MyGames({ games }: MyGamesProps) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-10 sm:py-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] 3xl:w-[550px] h-[350px] 3xl:h-[550px] rounded-full bg-violet-600/10 blur-[120px] 3xl:blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] 3xl:w-[650px] h-[450px] 3xl:h-[650px] rounded-full bg-cyan-500/10 blur-[150px] 3xl:blur-[200px] animate-pulse" />
      </div>

      <div className="relative z-10 qf-container flex flex-col gap-8 sm:gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] 3xl:text-[11px] font-extrabold tracking-wider text-violet-700 dark:text-slate-355 uppercase">
              Merchant Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl 3xl:text-5xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            My Listed Games
          </h1>
          <p className="text-xs sm:text-sm 3xl:text-base text-slate-500 dark:text-slate-400 max-w-xl 3xl:max-w-2xl transition-colors duration-300">
            Manage your items published in the marketplace. You can update pricing, info, platforms support, or remove items permanently.
          </p>
        </div>

        {/* Catalog List (Responsive multi-column on ultra-wide) */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
            {games.map((game) => (
              <MyGameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          /* Empty Dashboard State (User has listed zero games) */
          <div className="w-full flex flex-col items-center justify-center text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm gap-5">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No games published yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                You haven't listed any games in the marketplace yet. Sell your first game to start trading!
              </p>
            </div>
            <Link href="/add-games" className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md transition-all active:scale-[0.98]">
              Publish Your First Game
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
