"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Rocket } from "@gravity-ui/icons";
import { mutate } from "@/lib/mutation/api";
import { getSessionToken } from "@/lib/mutation/session";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { addGames } from "@/lib/fetch/add-games";
import { getMyGames } from "@/lib/fetch/my-games";
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

interface SellerDashboardProps {
    user: any;
    defaultTab?: "my-games" | "add-game" | "orders" | "analytics";
}

interface SellerOrder {
    _id: string;
    gameId: string;
    gameTitle: string;
    gameCoverUrl?: string;
    price: number;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    sellerId: string;
    sellerEmail: string;
    status: "pending" | "delivered";
    licenseKey?: string | null;
    orderedAt: string;
    deliveredAt?: string;
}

const GENRES_LIST = [
    "Action",
    "RPG",
    "Indie",
    "Strategy",
    "Adventure",
    "Simulation",
    "Shooter",
    "Racing",
    "Sports",
];

const PLATFORMS_LIST = ["PC", "PS5", "Xbox Series X/S", "Nintendo Switch"];

export default function SellerDashboard({ user, defaultTab }: SellerDashboardProps) {
    const pathname = usePathname();
    const router = useRouter();

    const getInitialTab = (): "my-games" | "add-game" | "orders" | "analytics" => {
        if (defaultTab) return defaultTab;
        if (pathname?.includes("/add-game")) return "add-game";
        if (pathname?.includes("/orders")) return "orders";
        if (pathname?.includes("/analytics")) return "analytics";
        return "my-games";
    };

    const [activeTab, setActiveTab] = useState<"my-games" | "add-game" | "orders" | "analytics">(getInitialTab());

    const switchTab = (tab: "my-games" | "add-game" | "orders" | "analytics") => {
        setActiveTab(tab);
        const routePath = tab === "my-games" ? "/dashboard/seller/my-games" : `/dashboard/seller/${tab}`;
        window.history.pushState(null, "", routePath);
    };

    // Database States
    const [publishedGames, setPublishedGames] = useState<any[]>([]);
    const [isLoadingGames, setIsLoadingGames] = useState(true);

    // Orders State
    const [ordersList, setOrdersList] = useState<SellerOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    // ── MODAL STATES ──────────────────────────────────────────────
    // 1. Edit Game Modal State
    const [editingGame, setEditingGame] = useState<any | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editGenre, setEditGenre] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDeveloper, setEditDeveloper] = useState("");
    const [editPublisher, setEditPublisher] = useState("");
    const [editPlatforms, setEditPlatforms] = useState<string[]>([]);
    const [editCoverUrl, setEditCoverUrl] = useState("");
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
    const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
    const [isSavingGame, setIsSavingGame] = useState(false);

    // 2. Delete Game Confirmation Modal State
    const [deleteGameModal, setDeleteGameModal] = useState<any | null>(null);
    const [isDeletingGame, setIsDeletingGame] = useState(false);

    // 3. Deliver Order Modal State
    const [deliverOrderModal, setDeliverOrderModal] = useState<SellerOrder | null>(null);
    const [customLicenseKey, setCustomLicenseKey] = useState("");
    const [deliveryNotes, setDeliveryNotes] = useState("");
    const [isDeliveringOrder, setIsDeliveringOrder] = useState(false);

    // ── ADD GAME FORM STATES ──────────────────────────────────────
    const [addTitle, setAddTitle] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [addGenre, setAddGenre] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addDeveloper, setAddDeveloper] = useState("");
    const [addPublisher, setAddPublisher] = useState("");
    const [addSelectedPlatforms, setAddSelectedPlatforms] = useState<string[]>([]);
    const [addCoverFile, setAddCoverFile] = useState<File | null>(null);
    const [addCoverPreview, setAddCoverPreview] = useState<string | null>(null);
    const [addCoverUrlInput, setAddCoverUrlInput] = useState("");
    const [isSubmittingAddGame, setIsSubmittingAddGame] = useState(false);

    // Fetch Seller's Games and Orders from database
    useEffect(() => {
        async function fetchSellerGames() {
            if (!user?.id) return;
            try {
                const games = await getMyGames(user.id);
                setPublishedGames(Array.isArray(games) ? games : []);
            } catch (err) {
                console.error("Error fetching seller games:", err);
            } finally {
                setIsLoadingGames(false);
            }
        }

        async function fetchSellerOrders() {
            if (!user?.id) return;
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const token = await getSessionToken();
                const res = await fetch(`${apiBase}/orders?sellerId=${user.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrdersList(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching seller orders:", err);
            } finally {
                setIsLoadingOrders(false);
            }
        }

        fetchSellerGames();
        fetchSellerOrders();
    }, [user?.id]);

    // Clean up previews
    useEffect(() => {
        return () => {
            if (editCoverPreview) URL.revokeObjectURL(editCoverPreview);
            if (addCoverPreview) URL.revokeObjectURL(addCoverPreview);
        };
    }, [editCoverPreview, addCoverPreview]);

    // Action 1: Open Edit Game Modal
    const handleOpenEditGame = (game: any) => {
        setEditingGame(game);
        setEditTitle(game.title || "");
        setEditDescription(game.description || "");
        setEditGenre(game.genre || "");
        setEditPrice(game.price !== undefined ? String(game.price) : "");
        setEditDeveloper(game.developer || "");
        setEditPublisher(game.publisher || "");
        setEditPlatforms(Array.isArray(game.platforms) ? game.platforms : []);
        setEditCoverUrl(game.coverUrl || "");
        setEditCoverFile(null);
        if (editCoverPreview) URL.revokeObjectURL(editCoverPreview);
        setEditCoverPreview(null);
    };

    // Action 2: Save Edited Game to Database
    const handleSaveEditedGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGame) return;
        setIsSavingGame(true);

        try {
            let finalCoverUrl = editCoverUrl;
            if (editCoverFile) {
                finalCoverUrl = await uploadImageToImgBB(editCoverFile);
            }

            const payload = {
                title: editTitle.trim(),
                description: editDescription.trim(),
                genre: editGenre,
                price: parseFloat(editPrice) || 0,
                developer: editDeveloper.trim() || undefined,
                publisher: editPublisher.trim() || undefined,
                platforms: editPlatforms,
                coverUrl: finalCoverUrl,
            };

            await mutate(`/games/${editingGame._id}`, payload, "PUT");

            toast.success(`Game listing "${editTitle}" updated successfully!`);

            setPublishedGames(prev =>
                prev.map(g => (g._id === editingGame._id ? { ...g, ...payload } : g))
            );

            setEditingGame(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to update game listing.");
        } finally {
            setIsSavingGame(false);
        }
    };

    // Action 3: Confirm Delete Game
    const handleConfirmDeleteGame = async () => {
        if (!deleteGameModal) return;
        setIsDeletingGame(true);
        try {
            await mutate(`/games/${deleteGameModal._id}`, undefined, "DELETE");
            toast.success(`Game listing "${deleteGameModal.title}" deleted successfully.`);
            setPublishedGames(prev => prev.filter(g => g._id !== deleteGameModal._id));
            setDeleteGameModal(null);
        } catch (err: any) {
            toast.error(err.message || "Error deleting game post.");
        } finally {
            setIsDeletingGame(false);
        }
    };

    // Action 4: Submit New Game Form (Add Games tab)
    const handleAddGameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!addTitle.trim()) return toast.error("Please enter a game title.");
        if (!addDescription.trim()) return toast.error("Please enter a description.");
        if (!addGenre) return toast.error("Please select a genre.");
        if (!addPrice || parseFloat(addPrice) < 0) return toast.error("Please enter a valid price.");
        if (addSelectedPlatforms.length === 0) {
            return toast.error("Please select at least one platform.");
        }

        setIsSubmittingAddGame(true);

        try {
            let coverUrl = addCoverUrlInput;
            if (addCoverFile) {
                coverUrl = await uploadImageToImgBB(addCoverFile);
            }

            if (!coverUrl) {
                toast.error("Please upload or provide a cover artwork image.");
                setIsSubmittingAddGame(false);
                return;
            }

            const newGamePayload = {
                title: addTitle.trim(),
                description: addDescription.trim(),
                genre: addGenre,
                price: parseFloat(addPrice),
                platforms: addSelectedPlatforms,
                coverUrl,
                developer: addDeveloper.trim() || undefined,
                publisher: addPublisher.trim() || undefined,
                creator: {
                    id: user?.id || "seller_id",
                    name: user?.name || "Seller",
                    email: user?.email || "seller@questforge.com",
                    image: user?.image || null,
                },
            };

            const data = await addGames(newGamePayload);
            toast.success(`Game "${addTitle}" published successfully to marketplace!`);

            // Reset Form
            setAddTitle("");
            setAddDescription("");
            setAddGenre("");
            setAddPrice("");
            setAddDeveloper("");
            setAddPublisher("");
            setAddSelectedPlatforms([]);
            setAddCoverFile(null);
            setAddCoverUrlInput("");
            if (addCoverPreview) URL.revokeObjectURL(addCoverPreview);
            setAddCoverPreview(null);

            // Add to state and switch to Listed Games tab
            setPublishedGames(prev => [{ _id: data.insertedId || Date.now().toString(), ...newGamePayload }, ...prev]);
            switchTab("my-games");
        } catch (err: any) {
            toast.error(err.message || "Failed to publish game listing.");
        } finally {
            setIsSubmittingAddGame(false);
        }
    };

    // Action 5: Deliver Order Request
    const handleDeliverOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliverOrderModal) return;
        setIsDeliveringOrder(true);

        try {
            const keyToDeliver = customLicenseKey.trim()
                ? customLicenseKey.trim()
                : `QF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            const res = await mutate(
                `/orders/${deliverOrderModal._id}/deliver`,
                { licenseKey: keyToDeliver, deliveryNotes: deliveryNotes.trim() },
                "PATCH"
            );

            toast.success(res.message || `Order delivered successfully! License key: ${keyToDeliver}`);

            setOrdersList(prev =>
                prev.map(o =>
                    o._id === deliverOrderModal._id
                        ? { ...o, status: "delivered", licenseKey: keyToDeliver, deliveredAt: new Date().toISOString() }
                        : o
                )
            );

            setDeliverOrderModal(null);
            setCustomLicenseKey("");
            setDeliveryNotes("");
        } catch (err: any) {
            toast.error(err.message || "Failed to deliver order request.");
        } finally {
            setIsDeliveringOrder(false);
        }
    };

    // Computed Analytics Metrics
    const totalGamesCount = publishedGames.length;
    const pendingOrders = ordersList.filter(o => o.status === "pending");
    const deliveredOrders = ordersList.filter(o => o.status === "delivered");
    const totalSalesRevenue = deliveredOrders.reduce((acc, o) => acc + (o.price || 0), 0);

    // Dynamic Recharts Data Sets (computed from MongoDB database state)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap: Record<string, { month: string; revenue: number; orders: number }> = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mName = monthNames[d.getMonth()];
        const mKey = `${d.getFullYear()}-${d.getMonth()}`;
        monthMap[mKey] = { month: mName, revenue: 0, orders: 0 };
    }

    ordersList.forEach(order => {
        if (order.orderedAt) {
            const orderDate = new Date(order.orderedAt);
            const mKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
            if (monthMap[mKey]) {
                monthMap[mKey].orders += 1;
                if (order.status === "delivered") {
                    monthMap[mKey].revenue += (order.price || 0);
                }
            }
        }
    });

    const monthlySalesData = Object.values(monthMap);

    const genreCounts: Record<string, number> = {};
    publishedGames.forEach(g => {
        const cat = g.genre || "Other";
        genreCounts[cat] = (genreCounts[cat] || 0) + 1;
    });

    const COLOR_PALETTE = ["#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6", "#ef4444"];
    const genrePieData = Object.keys(genreCounts).map((key, idx) => ({
        name: key,
        value: genreCounts[key],
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
    }));

    return (
        <div className="flex flex-col gap-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                            🚀
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    Seller & Developer Command Center
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Developer Console - {user?.name || "Publisher"}
                            </h1>
                            <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
                                Manage listed titles, publish new games, deliver order requests, and track sales charts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seller Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    onClick={() => switchTab("my-games")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Listed Titles</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalGamesCount}</h3>
                        <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">Active Games</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl">
                        🎮
                    </div>
                </div>

                <div
                    onClick={() => switchTab("orders")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-rose-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</span>
                        <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{pendingOrders.length} Orders</h3>
                        <span className="text-[10px] text-rose-500 font-semibold mt-1 inline-block">Awaiting Delivery</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-xl">
                        📦
                    </div>
                </div>

                <div
                    onClick={() => switchTab("orders")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered Orders</span>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{deliveredOrders.length} Orders</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Completed Sales</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                        ✓
                    </div>
                </div>

                <div
                    onClick={() => switchTab("analytics")}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-violet-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales Revenue</span>
                        <h3 className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">${totalSalesRevenue.toLocaleString()}</h3>
                        <span className="text-[10px] text-violet-500 font-semibold mt-1 inline-block">Direct Payout</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-xl">
                        💰
                    </div>
                </div>
            </div>

            {/* SELLER DASHBOARD ROUTE NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
                <button
                    onClick={() => switchTab("my-games")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "my-games"
                            ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>🎮</span>
                    <span>1. My Listed Games</span>
                </button>

                <button
                    onClick={() => switchTab("add-game")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "add-game"
                            ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>➕</span>
                    <span>2. Add New Game</span>
                </button>

                <button
                    onClick={() => switchTab("orders")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "orders"
                            ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📦</span>
                    <span>3. Order Requests & Delivery</span>
                    {pendingOrders.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                            {pendingOrders.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => switchTab("analytics")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "analytics"
                            ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📊</span>
                    <span>4. Recharts Analytics</span>
                </button>
            </div>

            {/* TAB 1: MY LISTED GAMES */}
            {activeTab === "my-games" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    Catalog Management
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    My Published Game Listings
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Inspect details, edit game parameters in modal, or delete listings from the database.
                            </p>
                        </div>

                        <button
                            onClick={() => switchTab("add-game")}
                            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>Add New Game</span>
                        </button>
                    </div>

                    {isLoadingGames ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading listed games from database...</div>
                    ) : publishedGames.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            No games listed yet. Click "Add New Game" to publish your first title.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Game Listing</th>
                                        <th className="pb-3 font-bold">Genre</th>
                                        <th className="pb-3 font-bold">Price</th>
                                        <th className="pb-3 font-bold">Platforms</th>
                                        <th className="pb-3 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {publishedGames.map((game) => (
                                        <tr key={game._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                            <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                {game.coverUrl ? (
                                                    <img src={game.coverUrl} alt={game.title} className="w-9 h-11 object-cover rounded-md shadow-sm" />
                                                ) : (
                                                    <div className="w-9 h-11 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">🎮</div>
                                                )}
                                                <div>
                                                    <p className="font-extrabold text-sm">{game.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{game.description}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-500 font-semibold">{game.genre}</td>
                                            <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">${game.price}</td>
                                            <td className="py-3 text-slate-500">
                                                {Array.isArray(game.platforms) ? game.platforms.join(", ") : "PC"}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/games/${game._id}`}>
                                                        <button className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[11px] flex items-center gap-1">
                                                            <span>👁️</span>
                                                            <span>Inspect</span>
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleOpenEditGame(game)}
                                                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] transition shadow-sm cursor-pointer flex items-center gap-1"
                                                    >
                                                        <span>✏️</span>
                                                        <span>Edit</span>
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleteGameModal(game)}
                                                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold hover:bg-rose-700 transition cursor-pointer text-[11px] shadow-sm flex items-center gap-1"
                                                    >
                                                        <span>🗑️</span>
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: ADD NEW GAME LISTING */}
            {activeTab === "add-game" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 w-fit">
                            Publisher Form
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Forge New Game Listing
                        </h2>
                        <p className="text-xs text-slate-500">
                            Fill in listing metadata to publish your title directly to the QuestForge marketplace catalog.
                        </p>
                    </div>

                    <form onSubmit={handleAddGameSubmit} className="flex flex-col gap-6">
                        {/* Game Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                Game Title
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Elden Ring"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition"
                                disabled={isSubmittingAddGame}
                            />
                        </div>

                        {/* Developer & Publisher Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                    Developer
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. FromSoftware"
                                    value={addDeveloper}
                                    onChange={(e) => setAddDeveloper(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition"
                                    disabled={isSubmittingAddGame}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                    Publisher
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bandai Namco"
                                    value={addPublisher}
                                    onChange={(e) => setAddPublisher(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition"
                                    disabled={isSubmittingAddGame}
                                />
                            </div>
                        </div>

                        {/* Genre & Price Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                    Genre
                                </label>
                                <select
                                    required
                                    value={addGenre}
                                    onChange={(e) => setAddGenre(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition cursor-pointer font-medium"
                                    disabled={isSubmittingAddGame}
                                >
                                    <option value="" disabled>Select genre...</option>
                                    {GENRES_LIST.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                    Price (USD)
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400 text-sm">$</span>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        placeholder="59.99"
                                        value={addPrice}
                                        onChange={(e) => setAddPrice(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition"
                                        disabled={isSubmittingAddGame}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                Description
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Enter detailed game information, features, and system specs..."
                                value={addDescription}
                                onChange={(e) => setAddDescription(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500 transition resize-y"
                                disabled={isSubmittingAddGame}
                            />
                        </div>

                        {/* Supported Platforms */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                Supported Platforms
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {PLATFORMS_LIST.map((platform) => {
                                    const isSelected = addSelectedPlatforms.includes(platform);
                                    return (
                                        <button
                                            key={platform}
                                            type="button"
                                            onClick={() => {
                                                setAddSelectedPlatforms(prev =>
                                                    prev.includes(platform)
                                                        ? prev.filter(p => p !== platform)
                                                        : [...prev, platform]
                                                );
                                            }}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                                isSelected
                                                    ? "bg-amber-600/15 border-amber-500 text-amber-600 dark:text-amber-400"
                                                    : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                                            }`}
                                            disabled={isSubmittingAddGame}
                                        >
                                            {platform}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cover Image Upload & Direct URL */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                                    Cover Artwork Image
                                </label>
                                <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                                    Card Frame (16:9 Ratio)
                                </span>
                            </div>

                            <div className="w-full max-w-sm mx-auto">
                                {(addCoverPreview || addCoverUrlInput) ? (
                                    <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700/60 dark:to-slate-900/40 hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md">
                                        <div className="relative w-full aspect-video rounded-[15px] overflow-hidden bg-slate-950">
                                            <img src={addCoverPreview || addCoverUrlInput} alt="Cover Preview" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103" />
                                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white shadow-md border border-violet-400/30 backdrop-blur-md">
                                                {addGenre || "CARD PREVIEW"}
                                            </div>
                                            {addPrice !== "" && !isNaN(Number(addPrice)) && (
                                                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl font-extrabold text-white text-xs bg-slate-950/80 backdrop-blur-md shadow-md border border-white/10">
                                                    {Number(addPrice) === 0 ? "Free" : `$${Number(addPrice).toFixed(2)}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center">
                                        <svg className="w-8 h-8 mb-2 text-violet-500 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Image File or Paste URL</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Compact Card Frame (16:9)</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <label htmlFor="seller-add-cover" className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-center shrink-0">
                                    📁 Choose File to Upload
                                </label>
                                <input
                                    type="file"
                                    id="seller-add-cover"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setAddCoverFile(file);
                                            if (addCoverPreview) URL.revokeObjectURL(addCoverPreview);
                                            setAddCoverPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <span className="text-xs text-slate-400 font-bold hidden sm:inline">or</span>
                                <input
                                    type="url"
                                    placeholder="Or paste Cover Image URL..."
                                    value={addCoverUrlInput}
                                    onChange={(e) => setAddCoverUrlInput(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                                    disabled={isSubmittingAddGame}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmittingAddGame}
                            className="mt-4 w-full py-4 rounded-xl font-extrabold text-white text-sm bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-95 shadow-lg transition cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingAddGame ? "Publishing Game Listing..." : "✓ Publish Game to Marketplace"}
                        </button>
                    </form>
                </div>
            )}

            {/* TAB 3: ORDER REQUESTS & DELIVERY */}
            {activeTab === "orders" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                    Order Fulfillment System
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    Buyer Order Requests & Delivery
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Receive incoming buyer order requests, verify payment, and deliver license keys directly.
                            </p>
                        </div>

                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 w-fit">
                            {pendingOrders.length} Pending Order{pendingOrders.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {isLoadingOrders ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading order requests from database...</div>
                    ) : ordersList.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            ✨ No order requests received yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Order ID</th>
                                        <th className="pb-3 font-bold">Game Title</th>
                                        <th className="pb-3 font-bold">Buyer Account</th>
                                        <th className="pb-3 font-bold">Price</th>
                                        <th className="pb-3 font-bold">Status</th>
                                        <th className="pb-3 font-bold text-right">Delivery Action</th>
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

                                            <td className="py-3">
                                                <p className="font-bold text-slate-900 dark:text-white">{order.buyerName || "Buyer"}</p>
                                                <p className="text-[10px] text-slate-500">{order.buyerEmail}</p>
                                            </td>

                                            <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">${order.price}</td>

                                            <td className="py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    order.status === "delivered"
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                                }`}>
                                                    {order.status === "delivered" ? "✓ Delivered" : "⏳ Pending"}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                {order.status === "pending" ? (
                                                    <button
                                                        onClick={() => {
                                                            setDeliverOrderModal(order);
                                                            setCustomLicenseKey("");
                                                            setDeliveryNotes("");
                                                        }}
                                                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-90 text-white font-extrabold text-[11px] transition shadow-md cursor-pointer flex items-center gap-1 ml-auto"
                                                    >
                                                        <span>🚀</span>
                                                        <span>Deliver Order</span>
                                                    </button>
                                                ) : (
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-emerald-600 font-bold block">Key Delivered:</span>
                                                        <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                                            {order.licenseKey || "QF-LICENSE-KEY"}
                                                        </span>
                                                    </div>
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

            {/* TAB 4: RECHARTS ANALYTICS */}
            {activeTab === "analytics" && (
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 w-fit">
                            Seller Analytics Board
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            Publisher Revenue & Fulfillment Performance
                        </h2>
                        <p className="text-xs text-slate-500">
                            Real-time graphs of monthly sales volume, order deliveries, and catalog genre ratios.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Chart 1: Revenue & Order Count (BarChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Revenue Chart
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Monthly Gross Sales Revenue ($)
                                </h3>
                            </div>

                            <div className="w-full h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Sales Revenue ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="orders" name="Units Sold" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 2: Order Delivery Trend (AreaChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    Delivery Growth Chart
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Order Requests & License Fulfillment
                                </h3>
                            </div>

                            <div className="w-full h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSellerOrders" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="orders" name="Order Deliveries" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSellerOrders)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 3: Genre Distribution (PieChart) */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 lg:col-span-2">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                    Catalog Distribution Chart
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Genre Share of Your Published Listings
                                </h3>
                            </div>

                            <div className="w-full h-72 flex items-center justify-center">
                                {genrePieData.length === 0 ? (
                                    <div className="text-xs text-slate-500 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                                        No published game listings found in database to calculate genre distribution.
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
                                                    <Cell key={`pie-seller-cell-${index}`} fill={entry.color} />
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

            {/* ── MODAL 1: EDIT GAME MODAL ── */}
            {editingGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 font-black flex items-center justify-center text-lg">
                                    ✏️
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Edit Game Listing</h3>
                                    <p className="text-xs text-slate-500">Update listing details in MongoDB database catalog.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingGame(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditedGame} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Game Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Genre</label>
                                    <select
                                        required
                                        value={editGenre}
                                        onChange={(e) => setEditGenre(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-amber-500 cursor-pointer"
                                    >
                                        <option value="" disabled>Select genre...</option>
                                        {GENRES_LIST.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Price (USD)</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-slate-400 text-xs">$</span>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Developer</label>
                                    <input
                                        type="text"
                                        value={editDeveloper}
                                        onChange={(e) => setEditDeveloper(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Publisher</label>
                                    <input
                                        type="text"
                                        value={editPublisher}
                                        onChange={(e) => setEditPublisher(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-amber-500 resize-y"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Supported Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS_LIST.map((platform) => {
                                        const isSel = editPlatforms.includes(platform);
                                        return (
                                            <button
                                                key={platform}
                                                type="button"
                                                onClick={() => {
                                                    setEditPlatforms(prev =>
                                                        prev.includes(platform)
                                                            ? prev.filter(p => p !== platform)
                                                            : [...prev, platform]
                                                    );
                                                }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                                                    isSel
                                                        ? "bg-amber-600/20 border-amber-500 text-amber-600 dark:text-amber-400"
                                                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                                }`}
                                            >
                                                {platform}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Cover Image Artwork</label>
                                    <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Card Frame (16:9 Ratio)</span>
                                </div>
                                <div className="w-full max-w-xs mx-auto">
                                    {(editCoverPreview || editCoverUrl) ? (
                                        <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700/60 dark:to-slate-900/40 hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md">
                                            <div className="relative w-full aspect-video rounded-[15px] overflow-hidden bg-slate-950">
                                                <img src={editCoverPreview || editCoverUrl} alt="Preview" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103" />
                                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white shadow-md border border-violet-400/30 backdrop-blur-md">
                                                    {editGenre || "CARD PREVIEW"}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center">
                                            <span className="text-xs font-bold text-slate-500">No artwork selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <label htmlFor="seller-edit-cover" className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition text-center shrink-0">
                                        📁 Upload New Image
                                    </label>
                                    <input
                                        type="file"
                                        id="seller-edit-cover"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setEditCoverFile(file);
                                                if (editCoverPreview) URL.revokeObjectURL(editCoverPreview);
                                                setEditCoverPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <input
                                        type="url"
                                        placeholder="Or paste Cover Image URL..."
                                        value={editCoverUrl}
                                        onChange={(e) => setEditCoverUrl(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingGame(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingGame}
                                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingGame ? "Saving Changes..." : "✓ Save Game Listing"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 2: DELETE GAME CONFIRMATION MODAL ── */}
            {deleteGameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 font-black flex items-center justify-center text-lg">
                                    🗑️
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Post Deletion</h3>
                                    <p className="text-xs text-rose-500 font-semibold">Remove Listed Game</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDeleteGameModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="my-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                            <p>
                                Are you sure you want to permanently delete this game post from your seller catalog?
                            </p>
                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                {deleteGameModal.coverUrl && (
                                    <img src={deleteGameModal.coverUrl} alt={deleteGameModal.title} className="w-10 h-12 object-cover rounded-md" />
                                )}
                                <div>
                                    <div>{deleteGameModal.title}</div>
                                    <div className="text-[10px] text-amber-600 font-extrabold">${deleteGameModal.price} • {deleteGameModal.genre}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <button
                                type="button"
                                disabled={isDeletingGame}
                                onClick={() => setDeleteGameModal(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeletingGame}
                                onClick={handleConfirmDeleteGame}
                                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isDeletingGame ? "Deleting..." : "Confirm Delete Listing"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 3: DELIVER ORDER MODAL ── */}
            {deliverOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black flex items-center justify-center text-lg">
                                    🚀
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deliver Order License</h3>
                                    <p className="text-xs text-slate-500">Provide license key for buyer fulfillment.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDeliverOrderModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleDeliverOrderSubmit} className="flex flex-col gap-4">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 space-y-1 text-xs">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                    Game: {deliverOrderModal.gameTitle}
                                </div>
                                <div className="text-slate-500">
                                    Buyer: <strong className="text-slate-800 dark:text-slate-200">{deliverOrderModal.buyerName}</strong> ({deliverOrderModal.buyerEmail})
                                </div>
                                <div className="text-emerald-600 font-extrabold">Order Price: ${deliverOrderModal.price}</div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">License Key / Activation Code</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const genKey = `QF-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                                            setCustomLicenseKey(genKey);
                                        }}
                                        className="text-[10px] text-amber-600 font-bold hover:underline"
                                    >
                                        + Generate Key
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. QF-X79A-B82C-V49K"
                                    value={customLicenseKey}
                                    onChange={(e) => setCustomLicenseKey(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono font-bold outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Delivery Notes (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Redeem on Steam / Epic Games Store"
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeliverOrderModal(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isDeliveringOrder}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {isDeliveringOrder ? "Delivering Key..." : "✓ Confirm Order Delivery"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
