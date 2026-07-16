import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MyInteractions from "@/components/profile/MyInteractions";

export const dynamic = "force-dynamic";

export default async function MyInteractionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const serializedUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || null,
      }
    : null;

  return <MyInteractions user={serializedUser} />;
}
