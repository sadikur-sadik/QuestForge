import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Helper function to generate timeline buckets dynamically for 7d, 30d, 6m, 1y
function generateTimelineBuckets(timeRange: string = "6m") {
    const buckets: Array<{ label: string; month: string; start: Date; end: Date }> = [];
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (timeRange === "7d") {
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
            const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
            buckets.push({ label, month: label, start, end });
        }
    } else if (timeRange === "30d") {
        for (let i = 29; i >= 0; i -= 5) {
            const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const dEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - Math.max(0, i - 4), 23, 59, 59, 999);
            const label = `${monthNames[dStart.getMonth()]} ${dStart.getDate()}`;
            buckets.push({ label, month: label, start: dStart, end: dEnd });
        }
    } else if (timeRange === "1y") {
        for (let i = 11; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const label = `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
            buckets.push({ label, month: label, start, end });
        }
    } else {
        // default 6m
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const label = `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
            buckets.push({ label, month: label, start, end });
        }
    }
    return buckets;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "6m";
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // 1. First attempt: call backend analytics endpoint for single-source-of-truth
    try {
        const res = await fetch(`${apiBase}/analytics?timeRange=${timeRange}`, {
            cache: "no-store"
        });
        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }
    } catch (err) {
        console.warn("Backend /analytics unavailable, falling back to direct DB connection:", err);
    }

    // 2. Direct MongoDB connection fallback
    try {
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db("questforge");
        const userCollection = db.collection("user");
        const libraryCollection = db.collection("library");
        const gamesCollection = db.collection("games");
        const ordersCollection = db.collection("orders");

        const users = await userCollection.find().toArray();
        const sales = await libraryCollection.find().toArray();
        const games = await gamesCollection.find().toArray();
        const orders = await ordersCollection.find().toArray();

        const buyerUsers = users.filter(u => !u.role || u.role === "buyer");
        const sellerUsers = users.filter(u => u.role === "seller");
        const adminUsers = users.filter(u => u.role === "admin");

        let totalRevenue = 0;
        const genreRevenueMap: Record<string, number> = {};
        const genreCountMap: Record<string, number> = {};

        const countedKeys = new Set<string>();

        sales.forEach(sale => {
            const price = Number(sale.game?.price) || 0;
            totalRevenue += price;
            const genre = sale.game?.genre || "Uncategorized";
            genreRevenueMap[genre] = (genreRevenueMap[genre] || 0) + price;
            genreCountMap[genre] = (genreCountMap[genre] || 0) + 1;
            if (sale.gameId) countedKeys.add(`${sale.userId}_${sale.gameId}`);
        });

        orders.filter(o => o.status === "delivered").forEach(ord => {
            const key = `${ord.buyerId}_${ord.gameId}`;
            if (!countedKeys.has(key)) {
                const price = Number(ord.price) || 0;
                totalRevenue += price;
                const genre = "Uncategorized";
                genreRevenueMap[genre] = (genreRevenueMap[genre] || 0) + price;
                genreCountMap[genre] = (genreCountMap[genre] || 0) + 1;
                countedKeys.add(key);
            }
        });

        const buckets = generateTimelineBuckets(timeRange);

        const monthlyStats = buckets.map(b => {
            const bBuyers = buyerUsers.filter(u => {
                if (!u.createdAt) return false;
                const d = new Date(u.createdAt);
                return d >= b.start && d <= b.end;
            }).length;

            const bSellers = sellerUsers.filter(u => {
                if (!u.createdAt) return false;
                const d = new Date(u.createdAt);
                return d >= b.start && d <= b.end;
            }).length;

            const bSales = sales.filter(s => {
                const d = s.purchasedAt ? new Date(s.purchasedAt) : (s.createdAt ? new Date(s.createdAt) : null);
                return d ? (d >= b.start && d <= b.end) : false;
            });

            const bOrders = orders.filter(o => {
                const d = o.orderedAt ? new Date(o.orderedAt) : (o.createdAt ? new Date(o.createdAt) : null);
                return d ? (d >= b.start && d <= b.end) : false;
            });

            const salesCount = bSales.length + bOrders.length;
            const revenue = bSales.reduce((acc, curr) => acc + (Number(curr.game?.price) || 0), 0) +
                            bOrders.filter(o => o.status === "delivered").reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

            return {
                month: b.label,
                label: b.label,
                buyers: bBuyers,
                sellers: bSellers,
                salesCount,
                revenue: Number(revenue.toFixed(2))
            };
        });

        const genreBreakdown = Object.entries(genreRevenueMap).map(([name, value]) => ({
            name,
            value: Number(value.toFixed(2)),
            count: genreCountMap[name] || 0
        }));

        const userRolesPieData = [
            { name: "Buyer Accounts", value: buyerUsers.length, color: "#10b981" },
            { name: "Seller Accounts", value: sellerUsers.length, color: "#f59e0b" },
            { name: "Admin Accounts", value: adminUsers.length, color: "#8b5cf6" },
        ];

        const recentBuyers = buyerUsers.map(u => ({
            id: u._id.toString(),
            name: u.name || u.email?.split("@")[0] || "Buyer Account",
            email: u.email || "",
            role: "buyer",
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
        }));

        const recentSellers = sellerUsers.map(u => ({
            id: u._id.toString(),
            name: u.name || u.email?.split("@")[0] || "Seller Account",
            email: u.email || "",
            role: "seller",
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()
        }));

        const recentSales = sales.map(s => ({
            id: s._id.toString(),
            gameTitle: s.game?.title || "Game Purchase",
            userEmail: s.userEmail || "Buyer",
            price: Number(s.game?.price) || 0,
            purchasedAt: s.purchasedAt ? new Date(s.purchasedAt).toISOString() : (s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString())
        }));

        await client.close();

        return NextResponse.json({
            summary: {
                totalRevenue: Number(totalRevenue.toFixed(2)),
                totalSalesCount: sales.length + orders.length,
                totalBuyers: buyerUsers.length,
                totalSellers: sellerUsers.length,
                totalAdmins: adminUsers.length,
                totalGames: games.length
            },
            monthlyStats,
            genreBreakdown,
            userRolesPieData,
            recentBuyers,
            recentSellers,
            recentSales
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch analytics data" }, { status: 500 });
    }
}
