import { mutate } from "../mutation/api";
import { getSessionToken } from "../mutation/session";

/**
 * Retrieves the user's purchased games library from the backend.
 * @param userId - Current player session ID.
 */
export async function getLibrary(userId: string): Promise<any[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/library?userId=${userId}`;
  const token = await getSessionToken();

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
      throw new Error(`Failed to fetch library: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getLibrary:", error);
    return [];
  }
}

/**
 * Saves an unlocked/bought game to the user's library database on the backend.
 */
export async function addToLibrary(
  userId: string,
  userEmail: string,
  gameId: string,
  game: any
) {
  return mutate("/library", { userId, userEmail, gameId, game }, "POST");
}

/**
 * Updates a purchased game's download state in the library database.
 */
export async function updateDownloadStatus(
  userId: string,
  gameId: string,
  downloadStatus: string
) {
  return mutate("/library/download", { userId, gameId, downloadStatus }, "PATCH");
}
