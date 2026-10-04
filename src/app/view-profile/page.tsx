import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import ViewProfile from "@/components/profile/ViewProfile";

export const dynamic = "force-dynamic";

const client = new MongoClient(process.env.MONGODB_URI!);

export default async function ViewProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let dbRole = "buyer";
  if (session?.user?.id) {
    try {
      const db = client.db("questforge");
      const userDoc = await db.collection("user").findOne({ _id: new ObjectId(session.user.id) });
      dbRole = userDoc?.role || (session.user as any).role || "buyer";
    } catch (e) {
      console.error("Error fetching db role for view-profile:", e);
    }
  }

  const serializedUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || null,
        role: dbRole,
      }
    : null;

  return <ViewProfile user={serializedUser} />;
}
