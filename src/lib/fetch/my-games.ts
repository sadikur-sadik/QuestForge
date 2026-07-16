import { mutate } from "../mutation/api";
import { getSessionToken } from "../mutation/session";

/**
 * Retrieves the user's self-created games from the backend.
 * @param userId - Developer session ID.
 */
export async function getMyGames(userId: string, sessionToken?: string): Promise<any[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/my-games?userId=${userId}`;
  const token = sessionToken || await getSessionToken();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch my games: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getMyGames:", error);
    return [];
  }
}

/**
 * Updates a listed game in the database.
 */
export async function updateGame(gameId: string, data: any) {
  return mutate(`/games/${gameId}`, data, "PUT");
}

/**
 * Deletes a listed game from the database.
 */
export async function deleteGame(gameId: string) {
  return mutate(`/games/${gameId}`, undefined, "DELETE");
}
