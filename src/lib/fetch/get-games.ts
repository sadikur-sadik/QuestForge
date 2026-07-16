/**
 * Client/Server-side fetch function to retrieve games list from the backend API.
 * Supports query filter parameters.
 */
export async function getBackendGames(params: {
  search?: string;
  genre?: string;
  platform?: string;
  sort?: string;
  limit?: number;
} = {}): Promise<any[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.genre) query.append("genre", params.genre);
  if (params.platform) query.append("platform", params.platform);
  if (params.sort) query.append("sort", params.sort);
  if (params.limit) query.append("limit", String(params.limit));

  const queryString = query.toString();
  const url = `${apiBase}/games${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Ensure fresh data on every request (ssr)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch backend games: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getBackendGames:", error);
    return [];
  }
}

export async function getBackendGame(id: string): Promise<any | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/games/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch backend game: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getBackendGame:", error);
    return null;
  }
}
