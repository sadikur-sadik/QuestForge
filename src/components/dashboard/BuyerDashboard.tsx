"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket, Person } from "@gravity-ui/icons";

interface BuyerDashboardProps {
    user: any;
}

interface TaskItem {
    id: string;
    title: string;
    description: string;
    xp: number;
    category: "Profile" | "Store" | "Community" | "Pass";
    status: "completed" | "in_progress" | "pending";
    actionLabel?: string;
    actionHref?: string;
}

export default function BuyerDashboard({ user }: BuyerDashboardProps) {
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTaskTab, setActiveTaskTab] = useState<"all" | "in_progress" | "completed">("all");

    // Buyer Tasks design state
    const [tasks, setTasks] = useState<TaskItem[]>([
        {
            id: "task-1",
            title: "Complete Gamer Profile",
            description: "Set up your gaming avatar, custom bio, and preferred genres.",
            xp: 100,
            category: "Profile",
            status: "completed",
            actionLabel: "Edit Profile",
            actionHref: "/view-profile"
        },
        {
            id: "task-2",
            title: "Wishlist 3 Games",
            description: "Browse the store catalog and add 3 upcoming titles to your wishlist.",
            xp: 150,
            category: "Store",
            status: "completed",
            actionLabel: "Explore Store",
            actionHref: "/games"
        },
        {
            id: "task-3",
            title: "Write a Game Review",
            description: "Share your gaming experience and rating on any owned game.",
            xp: 100,
            category: "Community",
            status: "in_progress",
            actionLabel: "Write Review",
            actionHref: "/my-bucket"
        },
        {
            id: "task-4",
            title: "Join QuestPass Premium",
            description: "Unlock unlimited access to 50+ indie titles and exclusive discounts.",
            xp: 250,
            category: "Pass",
            status: "pending",
            actionLabel: "Upgrade Pass",
            actionHref: "/games"
        },
        {
            id: "task-5",
            title: "Sync Desktop Launcher",
            description: "Install the QuestForge client to manage offline downloads & cloud saves.",
            xp: 100,
            category: "Store",
            status: "pending",
            actionLabel: "Download Client",
            actionHref: "#"
        }
    ]);

    useEffect(() => {
        async function fetchData() {
            if (!user?.id) return;
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                // Fetch library items
                const libRes = await fetch(`${apiBase}/library?userId=${user.id}`);
                if (libRes.ok) {
                    const libData = await libRes.json();
                    setLibraryItems(Array.isArray(libData) ? libData : []);
                }

                // Fetch wishlist items
                const wishRes = await fetch(`${apiBase}/wishlist?userId=${user.id}`);
                if (wishRes.ok) {
                    const wishData = await wishRes.json();
                    setWishlistItems(Array.isArray(wishData) ? wishData : []);
                }

                // Fetch reviews
                const revRes = await fetch(`${apiBase}/reviews?userId=${user.id}`);
                if (revRes.ok) {
                    const revData = await revRes.json();
                    setReviews(Array.isArray(revData) ? revData : []);
                }
            } catch (err) {
                console.error("Error fetching buyer dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user]);

    const toggleTaskStatus = (taskId: string) => {
        setTasks(prev =>
            prev.map(t => {
                if (t.id === taskId) {
                    const nextStatus = t.status === "completed" ? "in_progress" : "completed";
                    return { ...t, status: nextStatus };
                }
                return t;
            })
        );
    };

    const completedTasksCount = tasks.filter(t => t.status === "completed").length;
    const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);
    const totalEarnedXp = tasks.filter(t => t.status === "completed").reduce((acc, t) => acc + t.xp, 0);

    const filteredTasks = tasks.filter(t => {
        if (activeTaskTab === "in_progress") return t.status !== "completed";
        if (activeTaskTab === "completed") return t.status === "completed";
        return true;
    });

    const totalSpent = libraryItems.reduce((acc, item) => acc + (item.game?.price || 0), 0);

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
                                    Buyer Dashboard
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Welcome back, {user?.name || "Gamer"}!
                            </h1>
                            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                                Manage your game library, track wishlist games, and view your personal gamer quests.
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

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owned Games</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{libraryItems.length}</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">In Library</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                        📦
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wishlist Items</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{wishlistItems.length}</h3>
                        <span className="text-[10px] text-cyan-600 font-semibold mt-1 inline-block">Saved for later</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center text-xl">
                        ❤️
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gamer XP</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalEarnedXp} XP</h3>
                        <span className="text-[10px] text-amber-500 font-semibold mt-1 inline-block">Level 3 Adventurer</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                        ⚡
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${totalSpent.toFixed(2)}</h3>
                        <span className="text-[10px] text-violet-600 font-semibold mt-1 inline-block">Library Investment</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-xl">
                        💎
                    </div>
                </div>
            </div>

            {/* Buyer Tasks & Quests Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Buyer Action Center
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• {completedTasksCount}/{tasks.length} Done</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            🎮 Gamer Quests & Personal Tasks
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Complete buyer quests to customize your profile, earn Gamer XP, and unlock perks.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTaskTab("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "all"
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            All Tasks ({tasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("in_progress")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "in_progress"
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            Active ({tasks.length - completedTasksCount})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("completed")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "completed"
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            Completed ({completedTasksCount})
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300">Quest Progress Bar</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}% Completed</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Tasks List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                task.status === "completed"
                                    ? "bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-950/10"
                                    : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id)}
                                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                                            task.status === "completed"
                                                ? "bg-emerald-600 text-white"
                                                : "border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500"
                                        }`}
                                    >
                                        {task.status === "completed" ? "✓" : ""}
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-bold ${
                                                task.status === "completed"
                                                    ? "line-through text-slate-400 dark:text-slate-500"
                                                    : "text-slate-900 dark:text-white"
                                            }`}>
                                                {task.title}
                                            </h4>
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                +{task.xp} XP
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Category: {task.category}
                                </span>
                                {task.actionHref && (
                                    <Link href={task.actionHref}>
                                        <button className="px-3 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold text-[11px] transition cursor-pointer">
                                            {task.actionLabel || "Action"} →
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: My Game Library */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Gaming Collection</h2>
                                <p className="text-xs text-slate-500">Games you currently own and can download</p>
                            </div>
                            <Link href="/my-bucket" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                                View Full Bucket →
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading library...</div>
                        ) : libraryItems.length === 0 ? (
                            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                                <span className="text-3xl">🎮</span>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your library is currently empty.</p>
                                <p className="text-xs text-slate-500 max-w-xs">Explore the games catalog and add titles to your collection.</p>
                                <Link href="/games">
                                    <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition">
                                        Explore Games Catalog
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {libraryItems.map((item) => (
                                    <div key={item._id || item.gameId} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-3 hover:border-emerald-500/50 transition">
                                        {item.game?.coverUrl ? (
                                            <img src={item.game.coverUrl} alt={item.game?.title} className="w-16 h-20 object-cover rounded-xl shadow-sm" />
                                        ) : (
                                            <div className="w-16 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl">🎮</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.game?.title || "Game Title"}</h4>
                                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{item.game?.genre || "Game"}</span>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition cursor-pointer">
                                                    Download
                                                </button>
                                                <span className="text-[10px] text-slate-400">Ready to play</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Wishlist Quick View */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Wishlist Quick Peek</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                {wishlistItems.length} items
                            </span>
                        </div>

                        {wishlistItems.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-6">No saved wishlist items.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {wishlistItems.slice(0, 4).map((item) => (
                                    <div key={item._id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                                                🎮
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.game?.title || "Saved Game"}</p>
                                                <p className="text-[10px] text-slate-500">${item.game?.price || "0.00"}</p>
                                            </div>
                                        </div>
                                        <Link href={`/games/${item.gameId}`}>
                                            <button className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer">
                                                View
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
