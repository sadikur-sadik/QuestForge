import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("questforge");
const userCollection = db.collection("user");

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userDoc = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
        return NextResponse.json({
            role: userDoc?.role || session.user.role || "buyer"
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch user role" }, { status: 500 });
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
        const { role } = body;

        const currentUser = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
        const currentRole = currentUser?.role || "buyer";

        const validRoles = ["buyer", "seller", "admin"];
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json({ message: "Invalid role specified. Must be buyer or seller." }, { status: 400 });
        }

        // Only existing admins can assign admin role
        if (role === "admin" && currentRole !== "admin") {
            return NextResponse.json({ message: "Admin role cannot be self-assigned in authentication." }, { status: 403 });
        }

        await userCollection.updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { role, updatedAt: new Date() } }
        );

        return NextResponse.json({
            success: true,
            role,
            message: `Role updated to ${role} successfully`
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to update user role" }, { status: 500 });
    }
}
