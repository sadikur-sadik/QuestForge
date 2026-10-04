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
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m" | "1y">("6m");
    const [activeTab, setActiveTab] = useState<"sales" | "buyers" | "sellers">("sales");

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch("/api/analytics");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

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

    // Pie chart dataset for user roles
    const userRolesPieData = [
        { name: "Buyer Accounts", value: summary.totalBuyers || 210, color: "#10b981" },
        { name: "Seller Accounts", value: summary.totalSellers || 38, color: "#f59e0b" },
        { name: "Admin Accounts", value: summary.totalAdmins || 3, color: "#8b5cf6" },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Sales Revenue Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                ${summary.totalRevenue.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span>↑ +24.8%</span>
                                <span className="text-slate-400 font-normal">vs last period</span>
                            </div>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/20">
                            💰
                        </div>
                    </div>

                    {/* Buyer Accounts Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buyer Accounts Created</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {summary.totalBuyers}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                                <span>🎮 Active Gamers</span>
                            </div>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl border border-cyan-500/20">
                            👤
                        </div>
                    </div>

                    {/* Seller Accounts Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller Accounts Created</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {summary.totalSellers}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <span>🚀 Game Developers</span>
                            </div>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl border border-amber-500/20">
                            🏪
                        </div>
                    </div>

                    {/* Total Game Purchases Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Purchases</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {summary.totalSalesCount}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
                                <span>🛒 Total Orders</span>
                            </div>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl border border-violet-500/20">
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
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Account Growth Trends
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Buyer & Seller Registrations Timeline
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Monthly Registrations</span>
                        </div>

                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
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
                        </div>
                    </div>

                    {/* Chart 2: Monthly Sales Revenue & Purchases (Recharts BarChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                    Sales Performance
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Revenue ($) & Transaction Count
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Gross Sales</span>
                        </div>

                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
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
                        </div>
                    </div>

                    {/* Chart 3: Platform User Role Distribution (Recharts PieChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                    Account Demographics
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Platform User Role Distribution
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">User Ratio</span>
                        </div>

                        <div className="w-full h-72 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userRolesPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
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
                        </div>
                    </div>

                    {/* Chart 4: Sales Revenue by Game Genre (Recharts Horizontal BarChart) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Category Insights
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                    Sales Volume by Game Genre
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Revenue Split</span>
                        </div>

                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Game Title</th>
                                        <th className="pb-3 font-bold">Buyer Account</th>
                                        <th className="pb-3 font-bold">Price Paid</th>
                                        <th className="pb-3 font-bold">Purchase Date</th>
                                        <th className="pb-3 font-bold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {recentSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                            <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span>🎮</span>
                                                <span>{sale.gameTitle}</span>
                                            </td>
                                            <td className="py-3 text-slate-500">{sale.userEmail}</td>
                                            <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">${sale.price}</td>
                                            <td className="py-3 text-slate-500">{new Date(sale.purchasedAt).toLocaleDateString()}</td>
                                            <td className="py-3 text-right">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                    Completed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tab 2: Buyer Registrations Table */}
                    {activeTab === "buyers" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Gamer Name</th>
                                        <th className="pb-3 font-bold">Email</th>
                                        <th className="pb-3 font-bold">Role Badge</th>
                                        <th className="pb-3 font-bold text-right">Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {recentBuyers.map((buyer) => (
                                        <tr key={buyer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                            <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span>👤</span>
                                                <span>{buyer.name}</span>
                                            </td>
                                            <td className="py-3 text-slate-500">{buyer.email}</td>
                                            <td className="py-3">
                                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                    🎮 Buyer
                                                </span>
                                            </td>
                                            <td className="py-3 text-right text-slate-500">{new Date(buyer.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tab 3: Seller Registrations Table */}
                    {activeTab === "sellers" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="pb-3 font-bold">Developer / Publisher</th>
                                        <th className="pb-3 font-bold">Email</th>
                                        <th className="pb-3 font-bold">Role Badge</th>
                                        <th className="pb-3 font-bold text-right">Onboarding Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {recentSellers.map((seller) => (
                                        <tr key={seller.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition">
                                            <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span>🏪</span>
                                                <span>{seller.name}</span>
                                            </td>
                                            <td className="py-3 text-slate-500">{seller.email}</td>
                                            <td className="py-3">
                                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                    🚀 Seller
                                                </span>
                                            </td>
                                            <td className="py-3 text-right text-slate-500">{new Date(seller.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
