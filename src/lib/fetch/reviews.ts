import { mutate } from "../mutation/api";
import { getSessionToken } from "../mutation/session";

/**
 * Retrieves the reviews list of a game from the backend.
 * @param gameId - Game ID.
 */
export async function getReviews(gameId: string): Promise<any[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/reviews?gameId=${gameId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getReviews:", error);
    return [];
  }
}

/**
 * Submits a new review to the database on the backend.
 */
export async function addReview(
  gameId: string,
  userId: string,
  author: string,
  rating: number,
  comment: string
) {
  return mutate("/reviews", { gameId, userId, author, rating, comment }, "POST");
}

/**
 * Retrieves the reviews list created by a specific user from the backend.
 * @param userId - User ID.
 */
export async function getUserReviews(userId: string): Promise<any[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/reviews?userId=${userId}`;
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
      throw new Error(`Failed to fetch user reviews: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUserReviews:", error);
    return [];
  }
}

/**
 * Updates an existing review on the backend.
 */
export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
) {
  return mutate(`/reviews/${reviewId}`, { rating, comment }, "PUT");
}

/**
 * Deletes a review from the backend.
 */
export async function deleteReview(reviewId: string) {
  return mutate(`/reviews/${reviewId}`, undefined, "DELETE");
}
