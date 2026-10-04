"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface AdminDashboardProps {
    user: any;
}

interface AdminTask {
    id: string;
    title: string;
    description: string;
    urgency: "CRITICAL" | "MODERATION" | "SYSTEM" | "FINANCE";
    status: "pending" | "in_progress" | "completed";
    target: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
    const [allGames, setAllGames] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [activeTaskTab, setActiveTaskTab] = useState<"all" | "critical" | "in_progress" | "completed">("all");

    // Admin Operations Tasks state
    const [tasks, setTasks] = useState<AdminTask[]>([
        {
            id: "atask-1",
            title: "Audit New Game Submissions",
            description: "Review 2 newly submitted indie game listings for content safety, copyright compliance, and ESRB rating alignment.",
            urgency: "CRITICAL",
            target: "Catalog Queue",
            status: "pending",
            actionLabel: "Review Submissions",
            actionHref: "/games"
        },
        {
            id: "atask-2",
            title: "Review Flagged Content Report #104",
            description: "Investigate a user report regarding inappropriate language in community game review #402.",
            urgency: "MODERATION",
            target: "Review System",
            status: "in_progress",
            actionLabel: "Audit Report",
            actionHref: "/my-interactions"
        },
        {
            id: "atask-3",
            title: "Execute Platform Database Indexing",
            description: "Run automated MongoDB index optimization and cache flush for high-traffic weekend sales.",
            urgency: "SYSTEM",
            target: "Platform DB",
            status: "completed",
            actionLabel: "System Status",
            actionHref: "#"
        },
        {
            id: "atask-4",
            title: "Validate Developer Payout Split (88/12)",
            description: "Audit monthly revenue settlements and release verified payouts to verified seller merchant accounts.",
            urgency: "FINANCE",
            target: "Payout Engine",
            status: "in_progress",
            actionLabel: "Audit Payouts",
            actionHref: "#"
        },
        {
            id: "atask-5",
            title: "Review Seller Verification Escalations",
            description: "Approve or decline 2 publisher access requests from indie developer applicants.",
            urgency: "CRITICAL",
            target: "User Access",
            status: "completed",
            actionLabel: "User Roles",
            actionHref: "/view-profile"
        }
    ]);

    useEffect(() => {
        async function fetchAllData() {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const gamesRes = await fetch(`${apiBase}/games`);
                if (gamesRes.ok) {
                    const gamesData = await gamesRes.json();
                    setAllGames(Array.isArray(gamesData) ? gamesData : []);
                }
            } catch (err) {
                console.error("Error fetching admin dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllData();
    }, []);

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

    const handleDeleteGame = async (gameId: string) => {
        if (!confirm("Are you sure you want to delete this game as Administrator?")) return;
        setIsDeleting(gameId);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiBase}/games/${gameId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Game deleted successfully from catalog.");
                setAllGames(prev => prev.filter(g => g._id !== gameId));
            } else {
                toast.error("Failed to delete game.");
            }
        } catch (err) {
            toast.error("Error deleting game.");
        } finally {
            setIsDeleting(null);
        }
    };

    const totalGames = allGames.length;
    const completedTasksCount = tasks.filter(t => t.status === "completed").length;
    const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);

    const filteredTasks = tasks.filter(t => {
        if (activeTaskTab === "critical") return t.urgency === "CRITICAL";
        if (activeTaskTab === "in_progress") return t.status === "in_progress";
        if (activeTaskTab === "completed") return t.status === "completed";
        return true;
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                            ⚡
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    Platform Command Center
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Administrator Control Panel
                            </h1>
                            <p className="text-violet-200 text-xs sm:text-sm mt-0.5">
                                Full system oversight, platform moderation tasks, and security controls.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/add-games">
                            <button className="px-4 py-2.5 rounded-xl bg-white text-violet-800 font-bold text-xs hover:bg-violet-50 transition shadow-lg cursor-pointer">
                                + Add Game (Admin)
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Games Listed</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalGames}</h3>
                        <span className="text-[10px] text-violet-600 font-semibold mt-1 inline-block">Store Catalog</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-xl">
                        🎮
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Status</span>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Operational</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">All systems active</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl">
                        🟢
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moderation Queue</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tasks.filter(t => t.status === "pending").length} Pending</h3>
                        <span className="text-[10px] text-cyan-600 font-semibold mt-1 inline-block">Active Moderation</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center text-xl">
                        🛡️
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Roles</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Buyer / Seller / Admin</h3>
                        <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">3 Active Roles</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xl">
                        👥
                    </div>
                </div>
            </div>

            {/* Admin Tasks & Moderation Center */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 border border-violet-500/20">
                                Admin Task Center
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• {completedTasksCount}/{tasks.length} Completed</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                            ⚡ System Operations & Moderation Quests
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage store approvals, audit user permissions, handle flagged reviews, and run maintenance.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-wrap sm:flex-nowrap">
                        <button
                            onClick={() => setActiveTaskTab("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "all"
                                    ? "bg-violet-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            All Tasks ({tasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("critical")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "critical"
                                    ? "bg-violet-600 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            Critical ({tasks.filter(t => t.urgency === "CRITICAL").length})
                        </button>
                        <button
                            onClick={() => setActiveTaskTab("completed")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeTaskTab === "completed"
                                    ? "bg-violet-600 text-white shadow-sm"
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
                        <span className="text-slate-700 dark:text-slate-300">Admin Operational Health</span>
                        <span className="text-violet-600 dark:text-violet-400">{progressPercent}% Audited</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
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
                                    ? "bg-violet-500/5 border-violet-500/20 dark:bg-violet-950/10"
                                    : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-violet-500/40"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id)}
                                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                                            task.status === "completed"
                                                ? "bg-violet-600 text-white"
                                                : "border-2 border-slate-300 dark:border-slate-700 hover:border-violet-500"
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
                                                task.urgency === "CRITICAL"
                                                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                                    : task.urgency === "MODERATION"
                                                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                    : "bg-violet-500/10 text-violet-600 border border-violet-500/20"
                                            }`}>
                                                {task.urgency}
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
                                    Target: {task.target}
                                </span>
                                {task.actionHref && (
                                    <Link href={task.actionHref}>
                                        <button className="px-3 py-1 rounded-lg bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white font-bold text-[11px] transition cursor-pointer">
                                            {task.actionLabel || "Action"} →
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Admin Games Catalog Moderation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Store Moderation & Catalog Management</h2>
                        <p className="text-xs text-slate-500">View and moderate all active game listings across the platform</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/10 text-violet-600 border border-violet-500/20">
                        Admin Access
                    </span>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading platform catalog...</div>
                ) : allGames.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">No games found in database.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="pb-3 font-bold">Game</th>
                                    <th className="pb-3 font-bold">Genre</th>
                                    <th className="pb-3 font-bold">Price</th>
                                    <th className="pb-3 font-bold">Creator</th>
                                    <th className="pb-3 font-bold text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {allGames.map((game) => (
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
                                        <td className="py-3 text-slate-500">{game.creator?.email || game.developer || "Developer"}</td>
                                        <td className="py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/games/${game._id}`}>
                                                    <button className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                                        Inspect
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteGame(game._id)}
                                                    disabled={isDeleting === game._id}
                                                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
                                                >
                                                    {isDeleting === game._id ? "Deleting..." : "Delete Listing"}
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
        </div>
    );
}
