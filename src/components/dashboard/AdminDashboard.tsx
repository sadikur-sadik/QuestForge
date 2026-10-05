"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { mutate } from "@/lib/mutation/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from "recharts";

interface AdminDashboardProps {
    user: any;
    defaultTab?: "users" | "posts" | "analytics";
}

interface RoleChangeRequest {
    _id: string;
    userId: string;
    userName: string;
    userEmail: string;
    currentRole: string;
    requestedRole: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

interface UserAccount {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt?: string;
}

interface AnalyticsData {
    summary: {
        totalRevenue: number;
        totalSalesCount: number;
        totalBuyers: number;
        totalSellers: number;
        totalAdmins: number;
        totalGames: number;
    };
    monthlyStats: Array<{
        month: string;
        buyers: number;
        sellers: number;
        salesCount: number;
        revenue: number;
    }>;
    genreBreakdown: Array<{
        name: string;
        value: number;
    }>;
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

export default function AdminDashboard({ user, defaultTab }: AdminDashboardProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Determine initial active tab based on route or prop
    const getInitialTab = (): "users" | "posts" | "analytics" => {
        if (defaultTab) return defaultTab;
        if (pathname?.includes("/analytics")) return "analytics";
        if (pathname?.includes("/posts")) return "posts";
        return "users";
    };

    const [activeTab, setActiveTab] = useState<"users" | "posts" | "analytics">(getInitialTab());

    const switchTab = (tab: "users" | "posts" | "analytics") => {
        setActiveTab(tab);
        const routePath = tab === "users" ? "/dashboard/admin/users" : `/dashboard/admin/${tab}`;
        window.history.pushState(null, "", routePath);
    };

    // Database States
    const [usersList, setUsersList] = useState<UserAccount[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    // ── MODAL STATES ──────────────────────────────────────────────
    // 1. Role Request Modal
    const [inspectRequestModal, setInspectRequestModal] = useState<RoleChangeRequest | null>(null);
    const [isProcessingRequest, setIsProcessingRequest] = useState(false);

    // 2. Delete User Confirmation Modal
    const [deleteUserModal, setDeleteUserModal] = useState<UserAccount | null>(null);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

    // 3. Edit User Modal
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [editUserName, setEditUserName] = useState("");
    const [editUserEmail, setEditUserEmail] = useState("");
    const [editUserRole, setEditUserRole] = useState("");
    const [isSavingUser, setIsSavingUser] = useState(false);

    // 4. Game Catalog state
    const [allGames, setAllGames] = useState<any[]>([]);
    const [isLoadingGames, setIsLoadingGames] = useState(true);

    // 5. Delete Game Confirmation Modal
    const [deleteGameModal, setDeleteGameModal] = useState<any | null>(null);
    const [isDeletingGame, setIsDeletingGame] = useState(false);

    // 6. Edit Game Modal State
    const [editingGame, setEditingGame] = useState<any | null>(null);
    const [editGameTitle, setEditGameTitle] = useState("");
    const [editGameDescription, setEditGameDescription] = useState("");
    const [editGameGenre, setEditGameGenre] = useState("");
    const [editGamePrice, setEditGamePrice] = useState("");
    const [editGameDeveloper, setEditGameDeveloper] = useState("");
    const [editGamePublisher, setEditGamePublisher] = useState("");
    const [editGamePlatforms, setEditGamePlatforms] = useState<string[]>([]);
    const [editGameCoverUrl, setEditGameCoverUrl] = useState("");
    const [editGameCoverFile, setEditGameCoverFile] = useState<File | null>(null);
    const [editGameCoverPreview, setEditGameCoverPreview] = useState<string | null>(null);
    const [isSavingGame, setIsSavingGame] = useState(false);

    // Role Requests state
    const [roleRequests, setRoleRequests] = useState<RoleChangeRequest[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    // Analytics state
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

    // Fetch initial database data
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/admin/users");
                if (res.ok) {
                    const data = await res.json();
                    setUsersList(data.users || []);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setIsLoadingUsers(false);
            }
        }

        async function fetchRoleRequests() {
            try {
                const res = await fetch("/api/admin/role-requests");
                if (res.ok) {
                    const data = await res.json();
                    setRoleRequests(data.requests || []);
                }
            } catch (err) {
                console.error("Error fetching role requests:", err);
            } finally {
                setIsLoadingRequests(false);
            }
        }

        async function fetchGames() {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${apiBase}/games`);
                if (res.ok) {
                    const data = await res.json();
                    setAllGames(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching games:", err);
            } finally {
                setIsLoadingGames(false);
            }
        }

        async function fetchAnalyticsData() {
            try {
                const res = await fetch("/api/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setAnalytics(data);
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setIsLoadingAnalytics(false);
            }
        }

        fetchUsers();
        fetchRoleRequests();
        fetchGames();
        fetchAnalyticsData();
    }, []);

    // Clean up cover preview URL
    useEffect(() => {
        return () => {
            if (editGameCoverPreview) {
                URL.revokeObjectURL(editGameCoverPreview);
            }
        };
    }, [editGameCoverPreview]);

    // Role Request Action (Approve / Reject) via Modal or Direct
    const handleProcessRoleRequest = async (requestId: string, action: "approve" | "reject") => {
        setIsProcessingRequest(true);
        try {
            const res = await fetch("/api/admin/role-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `Role request ${action}d successfully.`);
                setRoleRequests(prev =>
                    prev.map(r => r._id === requestId ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r)
                );
                if (action === "approve") {
                    const updatedUsersRes = await fetch("/api/admin/users");
                    if (updatedUsersRes.ok) {
                        const usersData = await updatedUsersRes.json();
                        setUsersList(usersData.users || []);
                    }
                }
                setInspectRequestModal(null);
            } else {
                toast.error(data.message || `Failed to ${action} request.`);
            }
        } catch (err) {
            toast.error(`Error processing role request.`);
        } finally {
            setIsProcessingRequest(false);
        }
    };

    // Role Switch directly from dropdown
    const handleChangeUserRole = async (targetUserId: string, newRole: string) => {
        setUpdatingUserId(targetUserId);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: targetUserId, newRole })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || `User role updated to ${newRole.toUpperCase()}.`);
                setUsersList(prev =>
                    prev.map(u => u.id === targetUserId ? { ...u, role: newRole } : u)
                );
                setRoleRequests(prev =>
                    prev.map(r => r.userId === targetUserId && r.status === "pending" ? { ...r, status: "approved" } : r)
                );
            } else {
                toast.error(data.message || "Failed to update user role.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating role.");
        } finally {
            setUpdatingUserId(null);
        }
    };

    // User Edit Handlers
    const handleOpenEditUser = (u: UserAccount) => {
        setEditingUser(u);
        setEditUserName(u.name || "");
        setEditUserEmail(u.email || "");
        setEditUserRole(u.role || "buyer");
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsSavingUser(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: editingUser.id,
                    name: editUserName,
                    email: editUserEmail,
                    newRole: editUserRole,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "User account updated successfully.");
                setUsersList(prev =>
                    prev.map(u =>
                        u.id === editingUser.id
                            ? { ...u, name: editUserName, email: editUserEmail, role: editUserRole }
                            : u
                    )
                );
                setEditingUser(null);
            } else {
                toast.error(data.message || "Failed to update user account.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating user account.");
        } finally {
            setIsSavingUser(false);
        }
    };

    // Delete User Confirmation Modal Handler
    const handleConfirmDeleteUser = async () => {
        if (!deleteUserModal) return;
        setIsDeletingUser(true);
        try {
            const res = await fetch(`/api/admin/users?userId=${deleteUserModal.id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "User account deleted permanently.");
                setUsersList(prev => prev.filter(u => u.id !== deleteUserModal.id));
                setRoleRequests(prev => prev.filter(r => r.userId !== deleteUserModal.id));
                setDeleteUserModal(null);
            } else {
                toast.error(data.message || "Failed to delete user account.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error deleting user account.");
        } finally {
            setIsDeletingUser(false);
        }
    };

    // Game Edit Handlers
    const handleOpenEditGame = (game: any) => {
        setEditingGame(game);
        setEditGameTitle(game.title || "");
        setEditGameDescription(game.description || "");
        setEditGameGenre(game.genre || "");
        setEditGamePrice(game.price !== undefined ? String(game.price) : "");
        setEditGameDeveloper(game.developer || "");
        setEditGamePublisher(game.publisher || "");
        setEditGamePlatforms(Array.isArray(game.platforms) ? game.platforms : []);
        setEditGameCoverUrl(game.coverUrl || "");
        setEditGameCoverFile(null);
        if (editGameCoverPreview) {
            URL.revokeObjectURL(editGameCoverPreview);
        }
        setEditGameCoverPreview(null);
    };

    const handleSaveGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGame) return;
        setIsSavingGame(true);

        try {
            let finalCoverUrl = editGameCoverUrl;
            if (editGameCoverFile) {
                finalCoverUrl = await uploadImageToImgBB(editGameCoverFile);
            }

            const payload = {
                title: editGameTitle.trim(),
                description: editGameDescription.trim(),
                genre: editGameGenre,
                price: parseFloat(editGamePrice) || 0,
                developer: editGameDeveloper.trim() || undefined,
                publisher: editGamePublisher.trim() || undefined,
                platforms: editGamePlatforms,
                coverUrl: finalCoverUrl,
            };

            await mutate(`/games/${editingGame._id}`, payload, "PUT");

            toast.success(`Game "${editGameTitle}" updated successfully!`);

            setAllGames(prev =>
                prev.map(g =>
                    g._id === editingGame._id
                        ? { ...g, ...payload }
                        : g
                )
            );

            setEditingGame(null);
        } catch (err: any) {
            console.error("Error updating game:", err);
            toast.error(err.message || "Failed to update game post.");
        } finally {
            setIsSavingGame(false);
        }
    };

    // Delete Game Confirmation Modal Handler
    const handleConfirmDeleteGame = async () => {
        if (!deleteGameModal) return;
        setIsDeletingGame(true);
        try {
            await mutate(`/games/${deleteGameModal._id}`, undefined, "DELETE");
            toast.success(`Game post "${deleteGameModal.title}" deleted successfully.`);
            setAllGames(prev => prev.filter(g => g._id !== deleteGameModal._id));
            setDeleteGameModal(null);
        } catch (err: any) {
            toast.error(err.message || "Error deleting game post.");
        } finally {
            setIsDeletingGame(false);
        }
    };

    // Metrics & Search Filtering
    const pendingRoleReqCount = roleRequests.filter(r => r.status === "pending").length;
    const buyerCount = usersList.filter(u => !u.role || u.role === "buyer").length;
    const sellerCount = usersList.filter(u => u.role === "seller").length;
    const adminCount = usersList.filter(u => u.role === "admin").length;

    const filteredUsers = usersList.filter(u => {
        const matchesQuery = (u.id && u.id.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                             (u.name && u.name.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                             (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase()));
        const matchesRole = userRoleFilter === "all" ? true : u.role.toLowerCase() === userRoleFilter.toLowerCase();
        return matchesQuery && matchesRole;
    });

    const userRolesPieData = [
        { name: "Buyers", value: buyerCount, color: "#10b981" },
        { name: "Sellers", value: sellerCount, color: "#f59e0b" },
        { name: "Admins", value: adminCount, color: "#8b5cf6" },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                            ⚡
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    Live Database Command Center
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1">
                                Admin Platform Console
                            </h1>
                            <p className="text-violet-200 text-xs sm:text-sm mt-0.5">
                                Manage users & role switch requests, edit/delete posts, and analyze live platform metrics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Real DB Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    onClick={() => switchTab("users")}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-violet-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total User Accounts</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{usersList.length} Accounts</h3>
                        <span className="text-[10px] text-violet-600 font-semibold mt-1 inline-block">
                            {buyerCount} Buyers • {sellerCount} Sellers
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-2xl">
                        👥
                    </div>
                </div>

                <div
                    onClick={() => switchTab("posts")}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posted Games Catalog</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{allGames.length} Game Posts</h3>
                        <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block">Active Database Listings</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl">
                        🎮
                    </div>
                </div>

                <div
                    onClick={() => switchTab("analytics")}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
                >
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform Revenue</span>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            ${analytics?.summary.totalRevenue.toLocaleString() || 0}
                        </h3>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
                            {analytics?.summary.totalSalesCount || 0} Sales Purchases
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl">
                        📊
                    </div>
                </div>
            </div>

            {/* DASHBOARD ROUTE NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
                <button
                    onClick={() => switchTab("users")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "users"
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>👥</span>
                    <span>1. All Users & Role Requests</span>
                    {pendingRoleReqCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                            {pendingRoleReqCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => switchTab("analytics")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "analytics"
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>📊</span>
                    <span>2. Analytics Board</span>
                </button>

                <button
                    onClick={() => switchTab("posts")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${
                        activeTab === "posts"
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    <span>🎮</span>
                    <span>3. All Game Posts Catalog</span>
                </button>
            </div>

            {/* SECTION 1: ALL USERS & ROLE REQUESTS */}
            {activeTab === "users" && (
                <div className="flex flex-col gap-6">

                    {/* Pending Role Change Requests Queue */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-lg flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                        Role Approvals Queue
                                    </span>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        User Role Switch Requests
                                    </h2>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Review user applications to switch account role between Buyer and Seller.
                                </p>
                            </div>

                            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 w-fit">
                                {pendingRoleReqCount} Pending Request{pendingRoleReqCount === 1 ? "" : "s"}
                            </span>
                        </div>

                        {isLoadingRequests ? (
                            <div className="py-8 text-center text-xs text-slate-400 animate-pulse">Loading role requests from database...</div>
                        ) : roleRequests.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                ✨ No pending role change requests in database.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="pb-3 font-bold">User Account</th>
                                            <th className="pb-3 font-bold">Current Role</th>
                                            <th className="pb-3 font-bold">Requested Role</th>
                                            <th className="pb-3 font-bold">Status</th>
                                            <th className="pb-3 font-bold text-right">Role Request Modal Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {roleRequests.map((req) => (
                                            <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                <td className="py-3">
                                                    <p className="font-bold text-slate-900 dark:text-white">{req.userName || "User"}</p>
                                                    <p className="text-[10px] text-slate-500">{req.userEmail}</p>
                                                </td>
                                                <td className="py-3">
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                        {req.currentRole}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                                        req.requestedRole === "seller"
                                                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                    }`}>
                                                        {req.requestedRole}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                        req.status === "pending"
                                                            ? "bg-amber-500/10 text-amber-600"
                                                            : req.status === "approved"
                                                            ? "bg-emerald-500/10 text-emerald-600"
                                                            : "bg-rose-500/10 text-rose-600"
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    {req.status === "pending" ? (
                                                        <button
                                                            onClick={() => setInspectRequestModal(req)}
                                                            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] transition shadow-sm cursor-pointer"
                                                        >
                                                            🔍 Review Request
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400 font-semibold">Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* All Registered Users Table (with User IDs from database) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 border border-violet-500/20">
                                        Database Accounts
                                    </span>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        All Users & Role Switcher
                                    </h2>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Inspect database User IDs, update roles directly, edit profile info, or trigger delete confirmation modal.
                                </p>
                            </div>

                            {/* Search and Role Filter */}
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search by User ID, Name, or Email..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 w-64"
                                />

                                <select
                                    value={userRoleFilter}
                                    onChange={(e) => setUserRoleFilter(e.target.value)}
                                    className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-violet-500 cursor-pointer"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {isLoadingUsers ? (
                            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading accounts from database...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                No user accounts matching search filter.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="pb-3 font-bold">Database User ID</th>
                                            <th className="pb-3 font-bold">User Account</th>
                                            <th className="pb-3 font-bold">Current Role</th>
                                            <th className="pb-3 font-bold">Update Role Function</th>
                                            <th className="pb-3 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {filteredUsers.map((u) => {
                                            const isSelf = u.id === user?.id;
                                            return (
                                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                    <td className="py-3 font-mono text-[11px] text-slate-500">
                                                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700">
                                                            {u.id}
                                                        </span>
                                                    </td>

                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            {u.image ? (
                                                                <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/20" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-600 font-bold flex items-center justify-center text-xs border border-violet-500/20">
                                                                    {u.name?.[0]?.toUpperCase() || "U"}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                    <span>{u.name}</span>
                                                                    {isSelf && (
                                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-violet-500 text-white">
                                                                            YOU
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-3">
                                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                            u.role === "admin"
                                                                ? "bg-violet-500/10 text-violet-600 border border-violet-500/20"
                                                                : u.role === "seller"
                                                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                        }`}>
                                                            {u.role === "admin" ? "⚡ Admin" : u.role === "seller" ? "🚀 Seller" : "🎮 Buyer"}
                                                        </span>
                                                    </td>

                                                    {/* Update Role Selector */}
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={u.role}
                                                                disabled={updatingUserId === u.id}
                                                                onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                                                                className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer hover:border-violet-500 focus:outline-none disabled:opacity-50"
                                                            >
                                                                <option value="buyer">🎮 Buyer</option>
                                                                <option value="seller">🚀 Seller</option>
                                                                <option value="admin">⚡ Admin</option>
                                                            </select>
                                                            {updatingUserId === u.id && (
                                                                <span className="text-[10px] text-violet-500 font-bold animate-pulse">
                                                                    Updating...
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Account Actions: Edit & Modal Delete */}
                                                    <td className="py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleOpenEditUser(u)}
                                                                className="px-3 py-1.5 rounded-xl border border-violet-500/30 text-violet-600 dark:text-violet-400 font-bold text-[11px] hover:bg-violet-500/10 transition cursor-pointer flex items-center gap-1 shadow-sm"
                                                            >
                                                                <span>✏️</span>
                                                                <span>Edit</span>
                                                            </button>

                                                            <button
                                                                onClick={() => setDeleteUserModal(u)}
                                                                disabled={isSelf}
                                                                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition cursor-pointer flex items-center gap-1 ${
                                                                    isSelf
                                                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                                                        : "bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/20 shadow-sm"
                                                                }`}
                                                                title={isSelf ? "Cannot delete active admin account" : "Delete user account"}
                                                            >
                                                                <span>🗑️</span>
                                                                <span>Delete User</span>
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

                </div>
            )}

            {/* SECTION 2: ANALYTICS BOARD (NOT IN NAVBAR) */}
            {activeTab === "analytics" && (
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                            Admin Analytics Board
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            Platform Financials & Growth Dynamics
                        </h2>
                        <p className="text-xs text-slate-500">
                            Exclusive platform metrics dashboard (restricted to Admin Console).
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                ${analytics?.summary.totalRevenue.toLocaleString() || 0}
                            </h3>
                            <p className="text-xs text-emerald-600 font-bold mt-1">
                                From {analytics?.summary.totalSalesCount || 0} store transactions
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buyer Account Creations</span>
                            <h3 className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                                {buyerCount} Accounts
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">
                                Active player accounts
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Account Creations</span>
                            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                                {sellerCount} Accounts
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold mt-1">
                                Verified game developer profiles
                            </p>
                        </div>
                    </div>

                    {/* RECHARTS VISUALIZATIONS */}
                    {isLoadingAnalytics ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading Recharts data...</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Chart 1: Account Creation Timeline */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                                <div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Account Growth Chart
                                    </span>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                        Buyer vs. Seller Account Creations
                                    </h3>
                                </div>

                                <div className="w-full h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analytics?.monthlyStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorBuyersAdmin" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSellersAdmin" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                            <Legend />
                                            <Area type="monotone" dataKey="buyers" name="Buyer Creations" stroke="#10b981" fillOpacity={1} fill="url(#colorBuyersAdmin)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="sellers" name="Seller Creations" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSellersAdmin)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Chart 2: Revenue ($) & Purchases */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                                <div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                        Revenue Chart
                                    </span>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                        Monthly Gross Sales Revenue ($)
                                    </h3>
                                </div>

                                <div className="w-full h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics?.monthlyStats || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                            <Legend />
                                            <Bar dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="salesCount" name="Sales Volume" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Chart 3: Platform User Role Distribution */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 lg:col-span-2">
                                <div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                        Demographics Chart
                                    </span>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                        Live User Account Role Ratios
                                    </h3>
                                </div>

                                <div className="w-full h-72 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={userRolesPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={105}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {userRolesPieData.map((entry, index) => (
                                                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}

            {/* SECTION 3: ALL GAME POSTS CATALOG */}
            {activeTab === "posts" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    Catalog Management
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    All Game Posts Catalog
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Edit game listing details in database via edit modal, inspect, or trigger post delete modal.
                            </p>
                        </div>

                        {/* Post Action */}
                        <Link href="/add-games">
                            <button className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center gap-2">
                                <span>+</span>
                                <span>Post New Game</span>
                            </button>
                        </Link>
                    </div>

                    {isLoadingGames ? (
                        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading games catalog from database...</div>
                    ) : allGames.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            No game posts found in database catalog.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Game Listing</th>
                                        <th className="pb-3 font-bold">Genre</th>
                                        <th className="pb-3 font-bold">Price</th>
                                        <th className="pb-3 font-bold">Developer / Publisher</th>
                                        <th className="pb-3 font-bold text-right">Post Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {allGames.map((game) => (
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
                                            <td className="py-3 text-slate-500">{game.creator?.email || game.developer || "Publisher"}</td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/games/${game._id}`}>
                                                        <button className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[11px] flex items-center gap-1">
                                                            <span>👁️</span>
                                                            <span>Inspect</span>
                                                        </button>
                                                    </Link>

                                                    {/* Edit Modal Opener */}
                                                    <button
                                                        onClick={() => handleOpenEditGame(game)}
                                                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] transition shadow-sm cursor-pointer flex items-center gap-1"
                                                    >
                                                        <span>✏️</span>
                                                        <span>Edit Post</span>
                                                    </button>

                                                    {/* Delete Modal Opener */}
                                                    <button
                                                        onClick={() => setDeleteGameModal(game)}
                                                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold hover:bg-rose-700 transition cursor-pointer text-[11px] shadow-sm flex items-center gap-1"
                                                    >
                                                        <span>🗑️</span>
                                                        <span>Delete Post</span>
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

            {/* ── MODAL 1: ROLE CHANGE REQUEST INSPECT MODAL ── */}
            {inspectRequestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 font-black flex items-center justify-center text-lg">
                                    🔄
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role Change Request</h3>
                                    <p className="text-xs text-slate-500">Review requested role switch details.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setInspectRequestModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 my-2">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
                                <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                    User <strong className="text-slate-900 dark:text-white font-extrabold">{inspectRequestModal.userName}</strong> ({inspectRequestModal.userEmail}) is currently a <span className="uppercase font-bold text-violet-600">{inspectRequestModal.currentRole}</span> and wants to switch to:
                                </p>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-black text-center text-sm uppercase">
                                    Target Role: {inspectRequestModal.requestedRole}
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 text-center">
                                Approving will immediately grant the user {inspectRequestModal.requestedRole.toUpperCase()} permissions in the database.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <button
                                type="button"
                                disabled={isProcessingRequest}
                                onClick={() => handleProcessRoleRequest(inspectRequestModal._id, "reject")}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-rose-600 font-bold text-xs hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
                            >
                                ✕ Reject Request
                            </button>
                            <button
                                type="button"
                                disabled={isProcessingRequest}
                                onClick={() => handleProcessRoleRequest(inspectRequestModal._id, "approve")}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isProcessingRequest ? "Updating..." : "✓ Approve Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 2: DELETE USER CONFIRMATION MODAL ── */}
            {deleteUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 font-black flex items-center justify-center text-lg">
                                    ⚠️
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Account Deletion</h3>
                                    <p className="text-xs text-rose-500 font-semibold">Irreversible Database Action</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDeleteUserModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="my-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                            <p>
                                Are you sure you want to permanently delete the user account for:
                            </p>
                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                                {deleteUserModal.name} ({deleteUserModal.email})
                                <div className="text-[10px] font-normal text-slate-400 mt-1">ID: {deleteUserModal.id}</div>
                            </div>
                            <p className="text-rose-500 font-semibold text-[11px]">
                                This will erase the user's account, sessions, and active role requests from the database.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <button
                                type="button"
                                disabled={isDeletingUser}
                                onClick={() => setDeleteUserModal(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeletingUser}
                                onClick={handleConfirmDeleteUser}
                                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {isDeletingUser ? "Deleting..." : "Confirm Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 3: EDIT USER MODAL ── */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-black flex items-center justify-center text-lg">
                                    👤
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Edit User Account</h3>
                                    <p className="text-xs text-slate-500">Update profile details & role permissions.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editUserName}
                                    onChange={(e) => setEditUserName(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={editUserEmail}
                                    onChange={(e) => setEditUserEmail(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Role</label>
                                <select
                                    value={editUserRole}
                                    onChange={(e) => setEditUserRole(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500 cursor-pointer"
                                >
                                    <option value="buyer">🎮 Buyer</option>
                                    <option value="seller">🚀 Seller</option>
                                    <option value="admin">⚡ Admin</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingUser}
                                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingUser ? "Saving..." : "✓ Save User Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 4: DELETE GAME CONFIRMATION MODAL ── */}
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
                                    <p className="text-xs text-rose-500 font-semibold">Delete Game Post Listing</p>
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
                                Are you sure you want to delete this game post permanently from the database catalog?
                            </p>
                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                {deleteGameModal.coverUrl && (
                                    <img src={deleteGameModal.coverUrl} alt={deleteGameModal.title} className="w-10 h-12 object-cover rounded-md" />
                                )}
                                <div>
                                    <div>{deleteGameModal.title}</div>
                                    <div className="text-[10px] text-emerald-600 font-extrabold">${deleteGameModal.price} • {deleteGameModal.genre}</div>
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
                                {isDeletingGame ? "Deleting..." : "Confirm Delete Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 5: EDIT GAME MODAL ── */}
            {editingGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-black flex items-center justify-center text-lg">
                                    ✏️
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Edit Game Listing</h3>
                                    <p className="text-xs text-slate-500">Update post details in MongoDB database.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingGame(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveGame} className="flex flex-col gap-5">
                            {/* Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Game Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editGameTitle}
                                    onChange={(e) => setEditGameTitle(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500"
                                />
                            </div>

                            {/* Genre & Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Genre</label>
                                    <select
                                        required
                                        value={editGameGenre}
                                        onChange={(e) => setEditGameGenre(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500 cursor-pointer"
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
                                            value={editGamePrice}
                                            onChange={(e) => setEditGamePrice(e.target.value)}
                                            className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Developer & Publisher */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Developer</label>
                                    <input
                                        type="text"
                                        value={editGameDeveloper}
                                        onChange={(e) => setEditGameDeveloper(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-violet-500"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Publisher</label>
                                    <input
                                        type="text"
                                        value={editGamePublisher}
                                        onChange={(e) => setEditGamePublisher(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editGameDescription}
                                    onChange={(e) => setEditGameDescription(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-violet-500 resize-y"
                                />
                            </div>

                            {/* Platforms */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Supported Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS_LIST.map((platform) => {
                                        const isSel = editGamePlatforms.includes(platform);
                                        return (
                                            <button
                                                key={platform}
                                                type="button"
                                                onClick={() => {
                                                    setEditGamePlatforms((prev) =>
                                                        prev.includes(platform)
                                                            ? prev.filter((p) => p !== platform)
                                                            : [...prev, platform]
                                                    );
                                                }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                                                    isSel
                                                        ? "bg-violet-600/20 border-violet-500 text-violet-600 dark:text-violet-400"
                                                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                                }`}
                                            >
                                                {platform}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cover Image Upload & URL */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Cover Image Artwork</label>
                                    <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Card Frame (16:9 Ratio)</span>
                                </div>
                                {(editGameCoverPreview || editGameCoverUrl) ? (
                                    <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700/60 dark:to-slate-900/40 hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md">
                                        <div className="relative w-full aspect-video rounded-[15px] overflow-hidden bg-slate-950">
                                            <img src={editGameCoverPreview || editGameCoverUrl} alt="Preview" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103" />
                                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white shadow-md border border-violet-400/30 backdrop-blur-md">
                                                {editGameGenre || "CARD PREVIEW"}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center">
                                        <span className="text-xs font-bold text-slate-500">No artwork selected</span>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <label htmlFor="modal-cover-upload" className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition text-center shrink-0">
                                        📁 Upload New Image
                                    </label>
                                    <input
                                        type="file"
                                        id="modal-cover-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setEditGameCoverFile(file);
                                                if (editGameCoverPreview) URL.revokeObjectURL(editGameCoverPreview);
                                                setEditGameCoverPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    <input
                                        type="url"
                                        placeholder="Or paste Cover Image URL..."
                                        value={editGameCoverUrl}
                                        onChange={(e) => setEditGameCoverUrl(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            {/* Modal Buttons */}
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
                                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingGame ? "Saving..." : "✓ Save Post Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
