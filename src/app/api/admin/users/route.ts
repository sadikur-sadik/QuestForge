import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("questforge");
const userCollection = db.collection("user");
const roleRequestsCollection = db.collection("role_requests");
const accountCollection = db.collection("account");
const sessionCollection = db.collection("session");

async function checkAdminAuth() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return { authorized: false, status: 401, message: "Unauthorized", session: null };
    }

    const adminUser = await userCollection.findOne({ _id: new ObjectId(session.user.id) });
    const adminRole = adminUser?.role || (session.user as any).role || "buyer";

    if (adminRole !== "admin") {
        return { authorized: false, status: 403, message: "Administrator security clearance required.", session };
    }

    return { authorized: true, status: 200, message: "OK", session };
}

// GET: Fetch all user accounts for Admin control center
export async function GET(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json({ message: authCheck.message }, { status: authCheck.status });
        }

        const users = await userCollection.find().sort({ createdAt: -1 }).toArray();

        // Format user list for client
        const formattedUsers = users.map(u => ({
            id: u._id.toString(),
            name: u.name || u.email?.split("@")[0] || "User",
            email: u.email || "",
            role: u.role || "buyer",
            image: u.image || "",
            createdAt: u.createdAt || new Date(),
        }));

        return NextResponse.json({ users: formattedUsers });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch user accounts" }, { status: 500 });
    }
}

// PATCH: Change any user's role directly as Administrator
export async function PATCH(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json({ message: authCheck.message }, { status: authCheck.status });
        }

        const body = await req.json();
        const { userId, newRole, role, name, email } = body;
        const targetRole = newRole || role;

        if (!userId) {
            return NextResponse.json({ message: "Missing target userId parameter." }, { status: 400 });
        }

        const targetUser = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!targetUser) {
            return NextResponse.json({ message: "User account not found." }, { status: 404 });
        }

        const updateFields: any = { updatedAt: new Date() };

        if (targetRole) {
            const validRoles = ["buyer", "seller", "admin"];
            if (!validRoles.includes(targetRole)) {
                return NextResponse.json({ message: "Invalid role specified." }, { status: 400 });
            }
            updateFields.role = targetRole;
        }

        if (name && typeof name === "string" && name.trim()) {
            updateFields.name = name.trim();
        }

        if (email && typeof email === "string" && email.trim()) {
            updateFields.email = email.trim();
        }

        // Update target user
        await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (targetRole) {
            // Auto-approve pending role request for this user if exists
            await roleRequestsCollection.updateMany(
                { userId: userId, status: "pending" },
                { $set: { status: "approved", approvedAt: new Date(), requestedRole: targetRole } }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Updated account details for ${updateFields.name || targetUser.name || targetUser.email}.`
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to update user account" }, { status: 500 });
    }
}

// DELETE: Permanently delete a user account as Administrator
export async function DELETE(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json({ message: authCheck.message }, { status: authCheck.status });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Missing target userId parameter." }, { status: 400 });
        }

        // Prevent self-deletion
        if (authCheck.session?.user.id === userId) {
            return NextResponse.json({ message: "Administrators cannot delete their own active account." }, { status: 400 });
        }

        const targetUser = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!targetUser) {
            return NextResponse.json({ message: "User account not found." }, { status: 404 });
        }

        // Delete user record and associated auth data
        await userCollection.deleteOne({ _id: new ObjectId(userId) });
        await accountCollection.deleteMany({ userId: userId });
        await sessionCollection.deleteMany({ userId: userId });
        await roleRequestsCollection.deleteMany({ userId: userId });

        return NextResponse.json({
            success: true,
            message: `User account (${targetUser.name || targetUser.email}) deleted permanently.`
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to delete user account" }, { status: 500 });
    }
}
