import { mutate } from "../mutation/api";
import { getSessionToken } from "../mutation/session";

export interface OrderItem {
  _id: string;
  gameId: string;
  gameTitle: string;
  gameCoverUrl?: string;
  price: number;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerEmail?: string;
  status: "pending" | "delivered" | string;
  licenseKey?: string | null;
  deliveryNotes?: string;
  orderedAt: string;
  deliveredAt?: string;
  updatedAt?: string;
}

/**
 * Retrieves orders list (by buyerId or sellerId) from the backend API.
 */
export async function getOrders(params: { buyerId?: string; sellerId?: string }): Promise<OrderItem[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const query = new URLSearchParams();
  if (params.buyerId) query.append("buyerId", params.buyerId);
  if (params.sellerId) query.append("sellerId", params.sellerId);

  const queryString = query.toString();
  const url = `${apiBase}/orders${queryString ? `?${queryString}` : ""}`;
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
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getOrders:", error);
    return [];
  }
}

/**
 * Submits a new order request for a game.
 */
export async function placeOrder(orderData: {
  gameId: string;
  gameTitle: string;
  gameCoverUrl?: string;
  price: number;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  sellerId?: string;
  sellerEmail?: string;
}) {
  return mutate("/orders", orderData, "POST");
}

/**
 * Seller delivers/fulfills an order with a license key.
 */
export async function deliverOrder(orderId: string, licenseKey?: string, deliveryNotes?: string) {
  return mutate(`/orders/${orderId}/deliver`, { licenseKey, deliveryNotes }, "PATCH");
}
