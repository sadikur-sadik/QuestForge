import { getSessionToken } from "./session";

/**
 * Common mutation utility to perform API requests (POST, PUT, PATCH, DELETE) to the backend.
 * 
 * @param endpoint - The API endpoint path (e.g., "/games" or "games")
 * @param data - The request payload body
 * @param method - The HTTP method to use (defaults to "POST")
 * @param headers - Optional custom headers
 */
export async function mutate<T = any>(
  endpoint: string,
  data?: any,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  headers: Record<string, string> = {}
): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = await getSessionToken();
  const requestHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `API request failed with status ${response.status}`);
  }

  return response.json();
}
