"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SellerDashboardProps {
    user: any;
}

interface SellerTask {
    id: string;
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "ROUTINE";
    category: "Listing" | "Pricing" | "Patch" | "Community" | "Finance";
    status: "pending" | "in_progress" | "completed";
    actionLabel?: string;
    actionHref?: string;
}

export default function SellerDashboard({ user }: SellerDashboardProps) {
    const [publishedGames, setPublishedGames] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTaskTab, setActiveTaskTab] = useState<"all" | "high_priority" | "in_progress" | "completed">("all");

    // Seller Operations Tasks state
    const [tasks, setTasks] = useState<SellerTask[]>([
        {
            id: "stask-1",
            title: "Upload Game Specs & Screenshots",
            description: "Provide HD store screenshots, system requirements, and age rating tags for your draft game listing.",
            priority: "HIGH",
            category: "Listing",
            status: "in_progress",
            actionLabel: "Edit Listing",
            actionHref: "/add-games"
        },
        {
            id: "stask-2",
            title: "Configure Summer Sale Discount",
            description: "Apply a 15% discount campaign across your active catalog titles to boost store visibility.",
            priority: "MEDIUM",
            category: "Pricing",
            status: "pending",
            actionLabel: "Manage Pricing",
            actionHref: "/my-games"
        },
        {
            id: "stask-3",
            title: "Upload Build v1.4.2 Release Notes",
            description: "Publish latest bug fixes and patch documentation for active players.",
            priority: "HIGH",
            category: "Patch",
            status: "completed",
            actionLabel: "Publish Patch",
            actionHref: "/my-games"
        },
        {
            id: "stask-4",
            title: "Respond to Player Reviews",
            description: "Reply to 3 new player feedback comments in the developer moderation panel.",
            priority: "MEDIUM",
            category: "Community",
            status: "in_progress",
            actionLabel: "View Feedback",
            actionHref: "/my-interactions"
        },
        {
            id: "stask-5",
            title: "Verify Banking & Tax Information",
            description: "Ensure payout details are updated for monthly 88% revenue distribution.",
            priority: "HIGH",
            category: "Finance",
            status: "completed",
            actionLabel: "Account Settings",
            actionHref: "/view-profile"
        }
    ]);

    useEffect(() => {
        async function fetchSellerGames() {
            if (!user?.id) return;
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${apiBase}/my-games?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPublishedGames(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching seller games:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSellerGames();
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

    // Calculate metrics
    const totalGamesCount = publishedGames.length;
    const avgRating = totalGamesCount > 0
        ? (publishedGames.reduce((acc, g) => acc + (g.rating || 5.0), 0) / totalGamesCount).toFixed(1)
        : "5.0";
    
    // Sample sales chart data based on published games or defaults
    const salesChartData = [
        { month: "Jan", sales: 1200 },
        { month: "Feb", sales: 1900 },
        { month: "Mar", sales: 2400 },
        { month: "Apr", sales: 1800 },
        { month: "May", sales: 3200 },
        { month: "Jun", sales: 4100 },
    ];

    const estimatedRevenue = publishedGames.reduce((acc, g) => acc + ((g.price || 0) * 15), 0);

    const completedTasksCount = tasks.filter(t => t.status === "completed").length;
    const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);

    const filteredTasks = tasks.filter(t => {
        if (activeTaskTab === "high_priority") return t.priority === "HIGH";
        if (activeTaskTab === "in_progress") return t.status === "in_progress";
        if (activeTaskTab === "completed") return t.status === "completed";
        return true;
    });

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
                                    Seller & Developer Console
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Developer Portal - {user?.name || "Publisher"}
                            </h1>
                            <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
                                Publish new titles, track sales performance, and handle publisher release tasks.
                            </p>
                        </div>
                    </div>

                    <Link href="/add-games">
                        <button className="px-5 py-3 rounded-xl bg-white text-amber-700 font-extrabold text-xs hover:bg-amber-50 transition shadow-lg cursor-pointer flex items-center gap-2">
                            <Rocket width={16} height={16} />
                            + Publish New Game
                        </button>
                    </Link>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Titles</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalGamesCount}</h3>
                        <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">Active in Store</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl">
                        🎮
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Revenue</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${estimatedRevenue.toLocaleString()}</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+18.5% this month</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                        💰
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Rating</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgRating} / 5.0</h3>
                        <span className="text-[10px] text-amber-500 font-semibold mt-1 inline-block">Customer Satisfaction</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                        ⭐
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Downloads</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalGamesCount * 142}</h3>
                        <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">Player Installs</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xl">
                        📥
                    </div>
                </div>
            </div>

            {/* Seller Tasks & Publisher Operations Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                Publisher Action Checklist
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• {completedTasksCount}/{tasks.length} Completed</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            🚀 Developer Tasks & Release Operations
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Track store submission requirements, patch updates, pricing adjustments, and compliance.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-wrap sm:flex-nowrap">
                        <button
                            onClick={() => setActiveTaskTab("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "all"
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            All Tasks ({tasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("high_priority")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "high_priority"
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            High Priority ({tasks.filter(t => t.priority === "HIGH").length})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("completed")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "completed"
                                    ? "bg-amber-600 text-white shadow-sm"
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
                        <span className="text-slate-700 dark:text-slate-300">Developer Operations Readiness</span>
                        <span className="text-amber-600 dark:text-amber-400">{progressPercent}% Ready</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
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
                                    ? "bg-amber-500/5 border-amber-500/20 dark:bg-amber-950/10"
                                    : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-amber-500/40"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id)}
                                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                                            task.status === "completed"
                                                ? "bg-amber-600 text-white"
                                                : "border-2 border-slate-300 dark:border-slate-700 hover:border-amber-500"
                                        }`}
                                    >
                                        {task.status === "completed" ? "✓" : ""}
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className={`text-sm font-bold ${
                                                task.status === "completed"
                                                    ? "line-through text-slate-400 dark:text-slate-500"
                                                    : "text-slate-900 dark:text-white"
                                            }`}>
                                                {task.title}
                                            </h4>
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                                                task.priority === "HIGH"
                                                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                            }`}>
                                                {task.priority} PRIORITY
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
                                        <button className="px-3 py-1 rounded-lg bg-amber-600/10 hover:bg-amber-600 text-amber-600 hover:text-white font-bold text-[11px] transition cursor-pointer">
                                            {task.actionLabel || "Action"} →
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sales Chart & Games Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Analytics Chart */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue & Sales Performance</h2>
                            <p className="text-xs text-slate-500">Monthly gross sales generated across your game portfolio</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            Live Analytics
                        </span>
                    </div>

                    <div className="h-64 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesChartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                                <Tooltip formatter={(value: any) => [`$${value}`, "Sales Revenue"]} />
                                <Bar dataKey="sales" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Action Panel */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/5 to-transparent border border-amber-500/20 shadow-sm flex flex-col gap-4">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Developer Shortcuts</h3>

                        <Link href="/add-games">
                            <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                                <Rocket width={14} height={14} />
                                Add New Game Listing
                            </button>
                        </Link>

                        <Link href="/my-games">
                            <button className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                                Manage My Games List
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Published Games List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Game Portfolio</h2>
                        <p className="text-xs text-slate-500">Manage pricing, details, and active store status</p>
                    </div>
                    <Link href="/my-games" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                        View Full List →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading games...</div>
                ) : publishedGames.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                        <span className="text-3xl">🚀</span>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">You haven't published any games yet.</p>
                        <Link href="/add-games">
                            <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition">
                                Publish First Game
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="pb-3 font-bold">Game Title</th>
                                    <th className="pb-3 font-bold">Genre</th>
                                    <th className="pb-3 font-bold">Price</th>
                                    <th className="pb-3 font-bold">Rating</th>
                                    <th className="pb-3 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {publishedGames.map((game) => (
                                    <tr key={game._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                        <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            {game.coverUrl ? (
                                                <img src={game.coverUrl} alt={game.title} className="w-8 h-10 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-8 h-10 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">🎮</div>
                                            )}
                                            <span>{game.title}</span>
                                        </td>
                                        <td className="py-3 text-slate-500">{game.genre}</td>
                                        <td className="py-3 font-semibold text-slate-900 dark:text-white">${game.price}</td>
                                        <td className="py-3 text-amber-500 font-bold">★ {game.rating || 5.0}</td>
                                        <td className="py-3 text-right">
                                            <Link href={`/games/${game._id}`}>
                                                <button className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
