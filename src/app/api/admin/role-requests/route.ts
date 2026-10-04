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

        const adminUser = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
        const adminRole = adminUser?.role || (session.user as any).role || "buyer";

        if (adminRole !== "admin") {
            return NextResponse.json({ message: "Administrator access required." }, { status: 403 });
        }

        const requests = await roleRequestsCollection.find().sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            requests: requests || []
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch role requests" }, { status: 500 });
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

        const adminUser = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
        const adminRole = adminUser?.role || (session.user as any).role || "buyer";

        if (adminRole !== "admin") {
            return NextResponse.json({ message: "Administrator access required." }, { status: 403 });
        }

        const body = await req.json();
        const { requestId, action } = body;

        if (!requestId || !["approve", "reject"].includes(action)) {
            return NextResponse.json({ message: "Invalid request action specified." }, { status: 400 });
        }

        const roleReqDoc = await roleRequestsCollection.findOne({ _id: new ObjectId(requestId) });
        if (!roleReqDoc) {
            return NextResponse.json({ message: "Role request not found." }, { status: 404 });
        }

        if (action === "approve") {
            // Update target user's role in database
            await userCollection.updateOne(
                { _id: new ObjectId(roleReqDoc.userId) },
                { $set: { role: roleReqDoc.requestedRole, updatedAt: new Date() } }
            );

            await roleRequestsCollection.updateOne(
                { _id: new ObjectId(requestId) },
                { $set: { status: "approved", approvedAt: new Date() } }
            );

            return NextResponse.json({
                success: true,
                message: `Request approved. User role updated to ${roleReqDoc.requestedRole.toUpperCase()}.`
            });
        } else {
            await roleRequestsCollection.updateOne(
                { _id: new ObjectId(requestId) },
                { $set: { status: "rejected", rejectedAt: new Date() } }
            );

            return NextResponse.json({
                success: true,
                message: `Request rejected.`
            });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to process role request" }, { status: 500 });
    }
}
