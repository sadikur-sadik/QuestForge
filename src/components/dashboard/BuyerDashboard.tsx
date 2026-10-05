"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { mutate } from "@/lib/mutation/api";
import { getSessionToken } from "@/lib/mutation/session";
import { getOrders } from "@/lib/fetch/orders";
import {
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

interface BuyerDashboardProps {
    user: any;
    defaultTab?: "bucket" | "wishlist" | "analytics" | "purchases";
}

interface BuyerOrder {
    _id: string;
    gameId: string;
    gameTitle: string;
    gameCoverUrl?: string;
    price: number;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    sellerId: string;
    sellerEmail?: string;
    status: "pending" | "delivered";
    licenseKey?: string | null;
    deliveryNotes?: string;
    orderedAt: string;
    deliveredAt?: string;
}

export default function BuyerDashboard({ user, defaultTab }: BuyerDashboardProps) {
    const pathname = usePathname();
    const router = useRouter();

    const getInitialTab = (): "bucket" | "wishlist" | "analytics" | "purchases" => {
        if (defaultTab) return defaultTab;
        if (pathname?.includes("/wishlist")) return "wishlist";
        if (pathname?.includes("/analytics")) return "analytics";
        if (pathname?.includes("/purchases")) return "purchases";
        return "bucket";
    };

    const [activeTab, setActiveTab] = useState<"bucket" | "wishlist" | "analytics" | "purchases">(getInitialTab());

    const switchTab = (tab: "bucket" | "wishlist" | "analytics" | "purchases") => {
        setActiveTab(tab);
        const routePath = tab === "bucket" ? "/dashboard/buyer/bucket" : `/dashboard/buyer/${tab}`;
        window.history.pushState(null, "", routePath);
    };

    // Database States
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [ordersList, setOrdersList] = useState<BuyerOrder[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Order Request Modal State
    const [orderingGame, setOrderingGame] = useState<any | null>(null);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

    // Fetch Buyer's Library, Wishlist, and Orders from MongoDB
    useEffect(() => {
        async function fetchBuyerData() {
            if (!user?.id) return;
            setIsLoadingData(true);
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const token = await getSessionToken();
                const headers = {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                };

                // 1. Fetch Library Games
                const libRes = await fetch(`${apiBase}/library?userId=${user.id}`, { headers });
                if (libRes.ok) {
                    const libData = await libRes.json();
                    setLibraryItems(Array.isArray(libData) ? libData : []);
                }

                // 2. Fetch Wishlist Items
                const wishRes = await fetch(`${apiBase}/wishlist?userId=${user.id}`, { headers });
                if (wishRes.ok) {
                    const wishData = await wishRes.json();
                    setWishlistItems(Array.isArray(wishData) ? wishData : []);
                }

                // 3. Fetch Orders History
                const ordersRes = await fetch(`${apiBase}/orders?buyerId=${user.id}`, { headers });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrdersList(Array.isArray(ordersData) ? ordersData : []);
                }
            } catch (err) {
                console.error("Error fetching buyer dashboard data:", err);
            } finally {
                setIsLoadingData(false);
            }
        }

        fetchBuyerData();
    }, [user?.id]);

    // Action 1: Remove item from Wishlist
    const handleRemoveWishlist = async (wishId: string, gameTitle: string) => {
        try {
            await mutate(`/wishlist/${wishId}`, undefined, "DELETE");
            toast.success(`"${gameTitle}" removed from wishlist.`);
            setWishlistItems(prev => prev.filter(item => item._id !== wishId));
        } catch (err: any) {
            toast.error(err.message || "Failed to remove item from wishlist.");
        }
    };

    // Action 2: Place Order Request from Wishlist or Dashboard
    const handleConfirmOrderRequest = async () => {
        if (!orderingGame) return;
        setIsSubmittingOrder(true);

        try {
            const payload = {
                gameId: orderingGame.gameId || orderingGame.game?._id || orderingGame._id,
                gameTitle: orderingGame.game?.title || orderingGame.title || "Game Listing",
                gameCoverUrl: orderingGame.game?.coverUrl || orderingGame.coverUrl || "",
                price: orderingGame.game?.price !== undefined ? orderingGame.game.price : (orderingGame.price || 0),
                buyerId: user?.id,
                buyerName: user?.name || "Buyer",
                buyerEmail: user?.email || "",
                sellerId: orderingGame.game?.creator?.id || orderingGame.sellerId || "all_sellers",
                sellerEmail: orderingGame.game?.creator?.email || orderingGame.sellerEmail || ""
            };

            const data = await mutate("/orders", payload, "POST");
            toast.success(data.message || `Order request for "${payload.gameTitle}" placed successfully!`);

            // Refresh orders list and update active tab
            if (data.order) {
                setOrdersList(prev => [data.order, ...prev]);
            } else {
                const freshOrders = await getOrders({ buyerId: user.id });
                setOrdersList(Array.isArray(freshOrders) ? (freshOrders as any) : []);
            }

            setOrderingGame(null);
            switchTab("purchases");
        } catch (err: any) {
            toast.error(err.message || "Failed to place order request.");
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    // Metrics calculations
    const totalSpent = libraryItems.reduce((acc, item) => acc + (item.game?.price || 0), 0);
    const pendingOrders = ordersList.filter(o => o.status === "pending");
    const deliveredOrders = ordersList.filter(o => o.status === "delivered");

    // Dynamic Recharts Data Sets
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap: Record<string, { month: string; spent: number; orders: number }> = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mName = monthNames[d.getMonth()];
        const mKey = `${d.getFullYear()}-${d.getMonth()}`;
        monthMap[mKey] = { month: mName, spent: 0, orders: 0 };
    }

    ordersList.forEach(order => {
        if (order.orderedAt) {
            const orderDate = new Date(order.orderedAt);
            const mKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
            if (monthMap[mKey]) {
                monthMap[mKey].orders += 1;
                if (order.status === "delivered") {
                    monthMap[mKey].spent += (order.price || 0);
                }
            }
        }
    });

    const monthlySpendingData = Object.values(monthMap);

    const genreCounts: Record<string, number> = {};
    libraryItems.forEach(item => {
        const cat = item.game?.genre || "Action";
        genreCounts[cat] = (genreCounts[cat] || 0) + 1;
    });

    const COLOR_PALETTE = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6", "#ef4444"];
    const genrePieData = Object.keys(genreCounts).map((key, idx) => ({
        name: key,
        value: genreCounts[key],
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
    }));

    return (
        <div className="flex flex-col gap-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                            🎮
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    Gamer Command Center
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Welcome back, {user?.name || "Player"}!
                            </h1>
                            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                                Manage your gaming bucket, wishlist games, track order fulfillment, and view spending charts.
                            </p>
                        </div>
                    </div>

                    <Link href="/games">
                        <button className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition shadow-lg cursor-pointer">
                            Browse Store Catalog →
                        </button>
                    </Link>
                </div>
            </div>

            {/* Buyer Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    onClick={() => switchTab("bucket")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Gaming Bucket</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{libraryItems.length} Games</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Owned & Playable</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                        📦
                    </div>
                </div>

                <div
                    onClick={() => switchTab("wishlist")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Wishlist</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{wishlistItems.length} Saved</h3>
                        <span className="text-[10px] text-cyan-600 font-semibold mt-1 inline-block">Wishlisted Titles</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center text-xl">
                        ❤️
                    </div>
                </div>

                <div
                    onClick={() => switchTab("purchases")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-rose-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Delivery</span>
                        <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{pendingOrders.length} Orders</h3>
                        <span className="text-[10px] text-rose-500 font-semibold mt-1 inline-block">Awaiting Seller</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-xl">
                        ⏳
                    </div>
                </div>

                <div
                    onClick={() => switchTab("analytics")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-violet-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Investment</span>
                        <h3 className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">${totalSpent.toFixed(2)}</h3>
                        <span className="text-[10px] text-violet-500 font-semibold mt-1 inline-block">Total Spent</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-xl">
                        💎
                    </div>
                </div>
            </div>

            {/* ROUTE NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
                <button
                    onClick={() => switchTab("bucket")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "bucket"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📦</span>
                    <span>1. My Gaming Bucket</span>
                </button>

                <button
                    onClick={() => switchTab("wishlist")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "wishlist"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>❤️</span>
                    <span>2. My Wishlist</span>
                    {wishlistItems.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500 text-white font-black">
                            {wishlistItems.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => switchTab("analytics")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "analytics"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📊</span>
                    <span>3. Buyer Analytics</span>
                </button>

                <button
                    onClick={() => switchTab("purchases")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "purchases"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📜</span>
                    <span>4. Purchase Status & History</span>
                    {pendingOrders.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                            {pendingOrders.length}
                        </span>
                    )}
                </button>
            </div>

            {/* TAB 1: MY GAMING BUCKET */}
            {activeTab === "bucket" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                    Owned Collection Vault
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    My Gaming Bucket
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                All of your purchased and delivered games are stored here. Ready to play and download.
                            </p>
                        </div>

                        <Link href="/games">
                            <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center gap-2">
                                <span>+</span>
                                <span>Find More Games</span>
                            </button>
                        </Link>
                    </div>

                    {isLoadingData ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading owned games from database...</div>
                    ) : libraryItems.length === 0 ? (
                        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                            <span className="text-4xl">🎮</span>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your gaming bucket is empty</h3>
                            <p className="text-xs text-slate-500 max-w-xs">
                                Explore the marketplace catalog, place an order request, and your delivered games will appear here.
                            </p>
                            <Link href="/games">
                                <button className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-md">
                                    Explore Store Catalog
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {libraryItems.map((item) => (
                                <div key={item._id || item.gameId} className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 flex flex-col justify-between gap-4 hover:border-emerald-500/50 transition shadow-sm">
                                    <div className="flex gap-4">
                                        {item.game?.coverUrl ? (
                                            <img src={item.game.coverUrl} alt={item.game?.title} className="w-20 h-28 object-cover rounded-xl shadow-md group-hover:scale-105 transition" />
                                        ) : (
                                            <div className="w-20 h-28 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl">🎮</div>
                                        )}

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    {item.game?.genre || "Game"}
                                                </span>
                                                <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate mt-1">{item.game?.title || "Game Title"}</h4>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Value: ${item.game?.price || 0}</p>
                                            </div>

                                            {item.licenseKey && (
                                                <div className="mt-2">
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold block">License Key:</span>
                                                    <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 block truncate">
                                                        {item.licenseKey}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                            <span>✓</span>
                                            <span>Ready to Play</span>
                                        </span>

                                        <button
                                            onClick={() => toast.info(`Starting download for ${item.game?.title || "Game"}...`)}
                                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm cursor-pointer flex items-center gap-1"
                                        >
                                            <span>⬇️</span>
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: MY WISHLIST */}
            {activeTab === "wishlist" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                                    Saved Favorites
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    My Wishlist
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Titles saved for later. Inspect game details, place order requests, or remove items.
                            </p>
                        </div>

                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 w-fit">
                            {wishlistItems.length} Wishlisted Item{wishlistItems.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {isLoadingData ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading wishlist from database...</div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                            <span className="text-4xl">❤️</span>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your wishlist is empty</h3>
                            <p className="text-xs text-slate-500 max-w-xs">
                                Save games from the store catalog to track price drops and place instant orders.
                            </p>
                            <Link href="/games">
                                <button className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 transition shadow-md">
                                    Explore Games
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Wishlisted Game</th>
                                        <th className="pb-3 font-bold">Genre</th>
                                        <th className="pb-3 font-bold">Price</th>
                                        <th className="pb-3 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {wishlistItems.map((item) => {
                                        const gameObj = item.game || item;
                                        return (
                                            <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                    {gameObj.coverUrl ? (
                                                        <img src={gameObj.coverUrl} alt={gameObj.title} className="w-9 h-11 object-cover rounded-md shadow-sm" />
                                                    ) : (
                                                        <div className="w-9 h-11 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">🎮</div>
                                                    )}
                                                    <div>
                                                        <p className="font-extrabold text-sm">{gameObj.title || "Game Title"}</p>
                                                        <p className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{gameObj.description}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-slate-500 font-semibold">{gameObj.genre || "Action"}</td>
                                                <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">${gameObj.price || 0}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/games/${item.gameId || gameObj._id}`}>
                                                            <button className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[11px] flex items-center gap-1">
                                                                <span>👁️</span>
                                                                <span>Inspect</span>
                                                            </button>
                                                        </Link>

                                                        <button
                                                            onClick={() => setOrderingGame(item)}
                                                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-extrabold text-[11px] transition shadow-sm cursor-pointer flex items-center gap-1"
                                                        >
                                                            <span>🛒</span>
                                                            <span>Order Game</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleRemoveWishlist(item._id, gameObj.title || "Game")}
                                                            className="px-3 py-1.5 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer text-[11px]"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: BUYER ANALYTICS */}
            {activeTab === "analytics" && (
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 w-fit">
                            Buyer Insights Board
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            Gaming Investment & Order Fulfillment Analytics
                        </h2>
                        <p className="text-xs text-slate-500">
                            Real-time charts of your gaming expenditures, order fulfillment timeline, and favorite genre ratios.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart 1: Monthly Gaming Expenditure (BarChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Spending Chart
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Monthly Gaming Investment ($)
                                </h3>
                            </div>

                            <div className="w-full h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlySpendingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Bar dataKey="spent" name="Spent ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="orders" name="Orders Placed" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 2: Order Fulfillment Trend (AreaChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                    Fulfillment Timeline
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Orders Placed vs Delivered Games
                                </h3>
                            </div>

                            <div className="w-full h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBuyerOrders" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="orders" name="Total Orders" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBuyerOrders)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 3: Owned Genre Share (PieChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 lg:col-span-2">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                    Collection Distribution Chart
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Genre Ratio of Your Owned Gaming Bucket
                                </h3>
                            </div>

                            <div className="w-full h-72 flex items-center justify-center">
                                {genrePieData.length === 0 ? (
                                    <div className="text-xs text-slate-500 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                                        No owned games found in database to compute genre distribution.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={genrePieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={105}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {genrePieData.map((entry, index) => (
                                                    <Cell key={`pie-buyer-cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: PURCHASE STATUS & HISTORY */}
            {activeTab === "purchases" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                    Fulfillment Tracking
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    Purchase Status & Order History
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Track all order requests placed with sellers, verify timestamps, and access delivered license keys.
                            </p>
                        </div>

                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit">
                            {ordersList.length} Total Order{ordersList.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {isLoadingData ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading order history from database...</div>
                    ) : ordersList.length === 0 ? (
                        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                            <span className="text-4xl">📜</span>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No order history found</h3>
                            <p className="text-xs text-slate-500 max-w-xs">
                                When you place order requests for games in the catalog, your order status and license keys will appear here.
                            </p>
                            <Link href="/games">
                                <button className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-md">
                                    Browse Store
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Order ID</th>
                                        <th className="pb-3 font-bold">Game Title</th>
                                        <th className="pb-3 font-bold">Price</th>
                                        <th className="pb-3 font-bold">Order Time</th>
                                        <th className="pb-3 font-bold">Status</th>
                                        <th className="pb-3 font-bold text-right">License Key / Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {ordersList.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                            <td className="py-3 font-mono text-[11px] text-slate-500">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                    {order._id.substring(0, 8)}...
                                                </span>
                                            </td>

                                            <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {order.gameCoverUrl ? (
                                                    <img src={order.gameCoverUrl} alt={order.gameTitle} className="w-7 h-9 object-cover rounded shadow-sm" />
                                                ) : (
                                                    <div className="w-7 h-9 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">🎮</div>
                                                )}
                                                <span>{order.gameTitle}</span>
                                            </td>

                                            <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">${order.price}</td>

                                            <td className="py-3 text-slate-500 text-[11px]">
                                                {order.orderedAt ? new Date(order.orderedAt).toLocaleString() : "Recently"}
                                            </td>

                                            <td className="py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    order.status === "delivered"
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse"
                                                }`}>
                                                    {order.status === "delivered" ? "✓ Delivered" : "⏳ Pending Seller Delivery"}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                {order.status === "delivered" ? (
                                                    <div className="text-right">
                                                        <span className="font-mono text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 inline-block font-bold">
                                                            {order.licenseKey || "QF-LICENSE-DELIVERED"}
                                                        </span>
                                                        {order.deliveredAt && (
                                                            <span className="text-[9px] text-slate-400 block mt-0.5">
                                                                Delivered: {new Date(order.deliveredAt).toLocaleTimeString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        Seller is processing request...
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ORDER REQUEST CONFIRMATION MODAL */}
            {orderingGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black flex items-center justify-center text-lg">
                                    🛒
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Place Order Request</h3>
                                    <p className="text-xs text-slate-500">Request game key from seller.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOrderingGame(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4 mb-4">
                            {(orderingGame.game?.coverUrl || orderingGame.coverUrl) ? (
                                <img src={orderingGame.game?.coverUrl || orderingGame.coverUrl} alt={orderingGame.game?.title || orderingGame.title} className="w-12 h-16 object-cover rounded-xl shadow-sm" />
                            ) : (
                                <div className="w-12 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">🎮</div>
                            )}
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{orderingGame.game?.title || orderingGame.title || "Game Title"}</h4>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">Price: ${orderingGame.game?.price !== undefined ? orderingGame.game.price : (orderingGame.price || 0)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                            Submitting this order sends a request to the seller to fulfill and deliver your activation key. Once delivered, the game automatically unlocks in your <strong>Gaming Bucket</strong>!
                        </p>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                            <button
                                type="button"
                                disabled={isSubmittingOrder}
                                onClick={() => setOrderingGame(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmittingOrder}
                                onClick={handleConfirmOrderRequest}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isSubmittingOrder ? "Placing Order..." : "✓ Confirm Order Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
