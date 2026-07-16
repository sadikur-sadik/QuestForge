import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Game } from "@/components/game/GameCard";
import MyGames from "@/components/my-games/MyGames";
import { getMyGames } from "@/lib/fetch/my-games";

export const dynamic = "force-dynamic";

export default async function MyGamesPage() {
  // Resolve active developer session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    return <MyGames games={[]} />;
  }

  const dbUserGames = await getMyGames(session.user.id, session.session.token || session.session.id);
  const formattedGames: Game[] = dbUserGames.map((game: any) => ({
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

  return <MyGames games={formattedGames} />;
}
