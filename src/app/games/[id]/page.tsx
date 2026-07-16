import React from "react";
import { getBackendGame } from "@/lib/fetch/get-games";
import GameDetailsClient, { Game } from "@/components/game/GameDetailsClient";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailsPage(props: PageProps) {
  const params = await props.params;
  const gameData = await getBackendGame(params.id);

  if (!gameData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 p-6">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md text-center flex flex-col items-center gap-4 max-w-md shadow-xl">
          <span className="text-4xl">🔍</span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Game Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The game page you are looking for does not exist or may have been deleted by the owner.
          </p>
          <Link 
            href="/games" 
            className="mt-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white transition-all duration-200"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const formattedGame: Game = {
    id: gameData._id ? gameData._id.toString() : gameData.id,
    title: gameData.title,
    description: gameData.description,
    genre: gameData.genre,
    price: gameData.price,
    platforms: gameData.platforms,
    coverUrl: gameData.coverUrl,
    rating: gameData.rating,
    releaseDate: gameData.releaseDate,
    createdAt: gameData.createdAt,
    creator: gameData.creator,
  };

  return <GameDetailsClient game={formattedGame} />;
}
