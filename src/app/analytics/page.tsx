"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
    recentBuyers: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
    recentSellers: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
    recentSales: Array<{
        id: string;
        gameTitle: string;
        userEmail: string;
        price: number;
        purchasedAt: string;
    }>;
}

const COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6"];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m" | "1y">("6m");
    const [activeTab, setActiveTab] = useState<"sales" | "buyers" | "sellers">("sales");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        async function fetchAnalytics() {
            setIsUpdating(true);
            try {
                const res = await fetch(`/api/analytics?timeRange=${timeRange}`);
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setIsLoading(false);
                setIsUpdating(false);
            }
        }
        fetchAnalytics();
    }, [timeRange]);

    if (isLoading || !data) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl animate-pulse space-y-6">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-xl" />
                    <div className="grid grid-cols-4 gap-4">
                        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    </div>
                    <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
                </div>
            </div>
        );
    }

    const { summary, monthlyStats, genreBreakdown, recentBuyers, recentSellers, recentSales } = data;

    // Pure dynamic pie chart dataset computed directly from live database user roles
    const userRolesPieData = [
        { name: "Buyer Accounts", value: summary.totalBuyers, color: "#10b981" },
        { name: "Seller Accounts", value: summary.totalSellers, color: "#f59e0b" },
        { name: "Admin Accounts", value: summary.totalAdmins, color: "#8b5cf6" },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] w-full py-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="qf-container flex flex-col gap-8">
                
                {/* Page Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 p-8 text-white shadow-2xl border border-violet-500/20">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/20">
                                📊
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                        Platform Analytics Console
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white">
                                    Sales & Account Growth Analytics
                                </h1>
                                <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                                    Real-time tracking of buyer registrations, seller onboarding, revenue trends, and catalog metrics.
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                            {(["7d", "30d", "6m", "1y"] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs uppercase transition cursor-pointer ${
                                        timeRange === range
                                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4 Key Performance Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Sales Revenue Card */}
                    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Total Sales Revenue</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 truncate">
                                ${summary.totalRevenue.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span>↑ +24.8%</span>
                                <span className="text-slate-400 font-normal hidden sm:inline">vs last period</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg sm:text-2xl border border-emerald-500/20 shrink-0">
                            💰
                        </div>
                    </div>

                    {/* Buyer Accounts Card */}
                    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Buyer Accounts</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 truncate">
                                {summary.totalBuyers}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                                <span>🎮 Active Gamers</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-lg sm:text-2xl border border-cyan-500/20 shrink-0">
                            👤
                        </div>
                    </div>

                    {/* Seller Accounts Card */}
                    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Seller Accounts</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 truncate">
                                {summary.totalSellers}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <span>🚀 Game Developers</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg sm:text-2xl border border-amber-500/20 shrink-0">
                            🏪
                        </div>
                    </div>

                    {/* Total Game Purchases Card */}
                    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Store Purchases</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 truncate">
                                {summary.totalSalesCount}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-bold text-violet-600 dark:text-violet-400">
                                <span>🛒 Total Orders</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg sm:text-2xl border border-violet-500/20 shrink-0">
                            📦
                        </div>
                    </div>
                </div>

                {/* CHARTS SECTION USING RECHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Chart 1: Buyer vs Seller Account Creations Over Time (Recharts AreaChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] 3xl:text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Account Growth Trends
                                </span>
                                <h3 className="text-lg 3xl:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Buyer & Seller Registrations Timeline
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Monthly Registrations</span>
                        </div>

                        <div className="w-full h-72 min-h-[300px] 3xl:h-96">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
                                    <AreaChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBuyers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorSellers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="buyers" name="Buyer Registrations" stroke="#10b981" fillOpacity={1} fill="url(#colorBuyers)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="sellers" name="Seller Registrations" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSellers)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-[300px] flex items-center justify-center text-slate-400 text-sm">
                                    Loading dynamic chart...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart 2: Monthly Sales Revenue & Purchases (Recharts BarChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] 3xl:text-xs font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                    Sales Performance
                                </span>
                                <h3 className="text-lg 3xl:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Revenue ($) & Transaction Count
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Gross Sales</span>
                        </div>

                        <div className="w-full h-72 min-h-[300px] 3xl:h-96">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
                                    <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="salesCount" name="Games Sold" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-[300px] flex items-center justify-center text-slate-400 text-sm">
                                    Loading dynamic chart...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart 3: Platform User Role Distribution (Recharts PieChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] 3xl:text-xs font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                    Account Demographics
                                </span>
                                <h3 className="text-lg 3xl:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Platform User Role Distribution
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">User Ratio</span>
                        </div>

                        <div className="w-full h-72 min-h-[300px] 3xl:h-96 flex items-center justify-center">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
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
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-[300px] flex items-center justify-center text-slate-400 text-sm">
                                    Loading dynamic chart...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart 4: Sales Revenue by Game Genre (Recharts Horizontal BarChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] 3xl:text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Category Insights
                                </span>
                                <h3 className="text-lg 3xl:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Sales Volume by Game Genre
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Revenue Split</span>
                        </div>

                        <div className="w-full h-72 min-h-[300px] 3xl:h-96">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
                                    <BarChart layout="vertical" data={genreBreakdown} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff" }} />
                                        <Bar dataKey="value" name="Sales ($)" fill="#ec4899" radius={[0, 6, 6, 0]}>
                                            {genreBreakdown.map((entry, index) => (
                                                <Cell key={`genre-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-[300px] flex items-center justify-center text-slate-400 text-sm">
                                    Loading dynamic chart...
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* DETAILED DATA LOGS & TABLES (TABS) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                    {/* Tabs Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                Detailed Activity Records
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Inspect transaction logs, registered buyer accounts, and verified seller profiles.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveTab("sales")}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                                    activeTab === "sales"
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                🛒 Sales Log ({recentSales.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("buyers")}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                                    activeTab === "buyers"
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                🎮 Buyers ({recentBuyers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("sellers")}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                                    activeTab === "sellers"
                                        ? "bg-amber-600 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                🚀 Sellers ({recentSellers.length})
                            </button>
                        </div>
                    </div>

                    {/* Tab 1: Sales Transactions Table */}
                    {activeTab === "sales" && (
                        <div className="flex flex-col gap-3">
                            {/* Mobile / Tablet Card View (< lg) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
                                {recentSales.map((sale) => (
                                    <div key={sale.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between gap-3 hover:border-emerald-500/30 transition shadow-sm">
                                        <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                                            <span className="font-mono text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold">
                                                ID: #{sale.id}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                Completed
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{sale.gameTitle}</h3>
                                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 shrink-0">${sale.price}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="truncate max-w-[160px]">{sale.userEmail}</span>
                                            <span className="shrink-0">{new Date(sale.purchasedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View (>= lg) */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left text-xs min-w-[650px] whitespace-nowrap">
                                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-4 pb-3 font-bold">Game Title</th>
                                            <th className="px-4 pb-3 font-bold">Buyer Account</th>
                                            <th className="px-4 pb-3 font-bold">Price Paid</th>
                                            <th className="px-4 pb-3 font-bold">Purchase Date</th>
                                            <th className="px-4 pb-3 font-bold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {recentSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </span>
                                                    <span>{sale.gameTitle}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-500">{sale.userEmail}</td>
                                                <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">${sale.price}</td>
                                                <td className="px-4 py-3.5 text-slate-500">{new Date(sale.purchasedAt).toLocaleDateString()}</td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Buyer Registrations Table */}
                    {activeTab === "buyers" && (
                        <div className="flex flex-col gap-3">
                            {/* Mobile / Tablet Card View (< lg) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
                                {recentBuyers.map((buyer) => (
                                    <div key={buyer.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between gap-3 hover:border-cyan-500/30 transition shadow-sm">
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">
                                                    {buyer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{buyer.name}</h3>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                                                Buyer
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                                            <span className="truncate">{buyer.email}</span>
                                            <span className="text-[10px] text-slate-400">Registered: {new Date(buyer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View (>= lg) */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left text-xs min-w-[650px] whitespace-nowrap">
                                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-4 pb-3 font-bold">Gamer Name</th>
                                            <th className="px-4 pb-3 font-bold">Email</th>
                                            <th className="px-4 pb-3 font-bold">Role Badge</th>
                                            <th className="px-4 pb-3 font-bold text-right">Registration Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {recentBuyers.map((buyer) => (
                                            <tr key={buyer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">
                                                        {buyer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{buyer.name}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-500">{buyer.email}</td>
                                                <td className="px-4 py-3.5">
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                                        Buyer
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right text-slate-500">{new Date(buyer.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Seller Registrations Table */}
                    {activeTab === "sellers" && (
                        <div className="flex flex-col gap-3">
                            {/* Mobile / Tablet Card View (< lg) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
                                {recentSellers.map((seller) => (
                                    <div key={seller.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between gap-3 hover:border-amber-500/30 transition shadow-sm">
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                                                    {seller.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{seller.name}</h3>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                                Seller
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                                            <span className="truncate">{seller.email}</span>
                                            <span className="text-[10px] text-slate-400">Onboarded: {new Date(seller.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View (>= lg) */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left text-xs min-w-[650px] whitespace-nowrap">
                                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-4 pb-3 font-bold">Developer / Publisher</th>
                                            <th className="px-4 pb-3 font-bold">Email</th>
                                            <th className="px-4 pb-3 font-bold">Role Badge</th>
                                            <th className="px-4 pb-3 font-bold text-right">Onboarding Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {recentSellers.map((seller) => (
                                            <tr key={seller.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                                                        {seller.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{seller.name}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-500">{seller.email}</td>
                                                <td className="px-4 py-3.5">
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                        Seller
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right text-slate-500">{new Date(seller.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
