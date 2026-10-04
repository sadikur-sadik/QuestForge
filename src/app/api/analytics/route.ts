import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("questforge");
const userCollection = db.collection("user");
const libraryCollection = db.collection("library");
const gamesCollection = db.collection("games");

export async function GET(req: Request) {
    try {
        // Fetch real data from MongoDB collections
        const users = await userCollection.find().toArray();
        const sales = await libraryCollection.find().toArray();
        const games = await gamesCollection.find().toArray();

        // Categorize user accounts dynamically
        const buyerUsers = users.filter(u => !u.role || u.role === "buyer");
        const sellerUsers = users.filter(u => u.role === "seller");
        const adminUsers = users.filter(u => u.role === "admin");

        // Compute total revenue and genre revenue mapping directly from library purchases
        let totalRevenue = 0;
        const genreRevenueMap: Record<string, number> = {};

        sales.forEach(sale => {
            const price = Number(sale.game?.price) || 0;
            totalRevenue += price;

            const genre = sale.game?.genre || "Uncategorized";
            genreRevenueMap[genre] = (genreRevenueMap[genre] || 0) + price;
        });

        // Compute 6-month historical timeline dynamically from DB timestamps
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentDate = new Date();
        const monthlyStats: Array<{
            month: string;
            buyers: number;
            sellers: number;
            salesCount: number;
            revenue: number;
        }> = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const mName = `${months[d.getMonth()]} ${d.getFullYear()}`;
            
            const monthBuyers = buyerUsers.filter(u => {
                if (!u.createdAt) return false;
                const uDate = new Date(u.createdAt);
                return uDate.getMonth() === d.getMonth() && uDate.getFullYear() === d.getFullYear();
            }).length;

            const monthSellers = sellerUsers.filter(u => {
                if (!u.createdAt) return false;
                const uDate = new Date(u.createdAt);
                return uDate.getMonth() === d.getMonth() && uDate.getFullYear() === d.getFullYear();
            }).length;

            const monthSalesItems = sales.filter(s => {
                if (!s.purchasedAt) return false;
                const sDate = new Date(s.purchasedAt);
                return sDate.getMonth() === d.getMonth() && sDate.getFullYear() === d.getFullYear();
            });

            const monthSalesCount = monthSalesItems.length;
            const monthRev = monthSalesItems.reduce((acc, curr) => acc + (Number(curr.game?.price) || 0), 0);

            monthlyStats.push({
                month: mName,
                buyers: monthBuyers,
                sellers: monthSellers,
                salesCount: monthSalesCount,
                revenue: monthRev
            });
        }

        const genreBreakdown = Object.entries(genreRevenueMap).map(([name, value]) => ({ name, value }));

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
            purchasedAt: s.purchasedAt ? new Date(s.purchasedAt).toISOString() : new Date().toISOString()
        }));

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalSalesCount: sales.length,
                totalBuyers: buyerUsers.length,
                totalSellers: sellerUsers.length,
                totalAdmins: adminUsers.length,
                totalGames: games.length
            },
            monthlyStats,
            genreBreakdown,
            recentBuyers,
            recentSellers,
            recentSales
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Failed to fetch analytics data" }, { status: 500 });
    }
}
