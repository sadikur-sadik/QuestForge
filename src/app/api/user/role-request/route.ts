import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("questforge");
const userCollection = db.collection("user");
const roleRequestsCollection = db.collection("role_requests");

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const pendingRequest = await roleRequestsCollection.findOne({
            userId: session.user.id,
            status: "pending"
        });

        return NextResponse.json({
            request: pendingRequest || null
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch role request" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { requestedRole } = body;

        const currentUser = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
        const currentRole = currentUser?.role || (session.user as any).role || "buyer";

        if (currentRole === "admin") {
            return NextResponse.json({ message: "Administrators do not need to request role changes." }, { status: 400 });
        }

        // Strictly disallow requesting Admin role
        if (requestedRole === "admin") {
            return NextResponse.json({ message: "You cannot request to become an Administrator." }, { status: 403 });
        }

        const validTargetRoles = ["buyer", "seller"];
        if (!requestedRole || !validTargetRoles.includes(requestedRole)) {
            return NextResponse.json({ message: "Invalid role requested. Must be buyer or seller." }, { status: 400 });
        }

        if (requestedRole === currentRole) {
            return NextResponse.json({ message: `Your current account role is already ${currentRole.toUpperCase()}.` }, { status: 400 });
        }

        // Upsert pending role request for user
        const result = await roleRequestsCollection.updateOne(
            { userId: session.user.id, status: "pending" },
            {
                $set: {
                    userId: session.user.id,
                    userName: session.user.name,
                    userEmail: session.user.email,
                    currentRole,
                    requestedRole,
                    status: "pending",
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: `Role change request to ${requestedRole.toUpperCase()} submitted for Admin approval.`,
            requestedRole
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to submit role change request" }, { status: 500 });
    }
}
