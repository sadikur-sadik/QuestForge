import { authClient } from "@/lib/auth-client";

/**
 * Retrieves the session token of the active user.
 * Works on both client-side and server-side in Next.js context.
 */
export async function getSessionToken(): Promise<string | null> {
  try {
    // Server-side environment check
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        return cookieStore.get("better-auth.session_token")?.value ||
               cookieStore.get("__secure-better-auth.session_token")?.value ||
               null;
      } catch (e) {
        // cookies context might not be available
      }
    }

    // Client-side environment
    const session = await authClient.getSession();
    return session?.data?.session?.token || session?.data?.session?.id || null;
  } catch (error) {
    return null;
  }
}
