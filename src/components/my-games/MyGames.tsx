import React from "react";
import MyGameCard from "@/components/game/MyGameCard";
import Link from "next/link";
import { Game } from "@/components/game/GameCard";

interface MyGamesProps {
  games: Game[];
}

export default function MyGames({ games }: MyGamesProps) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-355 uppercase">
              Merchant Panel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            My Listed Games
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl transition-colors duration-300">
            Manage your items published in the marketplace. You can update pricing, info, platforms support, or remove items permanently.
          </p>
        </div>

        {/* Catalog List (Horizontal card flex) */}
        {games.length > 0 ? (
          <div className="flex flex-col gap-6">
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
