"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export type DashboardRole = "buyer" | "seller" | "admin";

interface DashboardTestingTogglerProps {
    currentDbRole: DashboardRole;
    activeView: DashboardRole;
    onViewChange: (role: DashboardRole) => void;
    onRoleUpdated?: (newRole: DashboardRole) => void;
}

export default function DashboardTestingToggler({
    currentDbRole,
    activeView,
    onViewChange,
    onRoleUpdated,
}: DashboardTestingTogglerProps) {
    const [isUpdatingDb, setIsUpdatingDb] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Update actual DB role via POST /api/user/role
    async function handleSyncDbRole(targetRole: DashboardRole) {
        if (targetRole === currentDbRole) {
            toast.info(`Account database role is already "${targetRole.toUpperCase()}".`);
            return;
        }

        setIsUpdatingDb(true);
        try {
            const res = await fetch("/api/user/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: targetRole }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to update role in database.");
                return;
            }

            toast.success(`🎉 Account DB Role updated to ${targetRole.toUpperCase()} successfully!`);
            if (onRoleUpdated) {
                onRoleUpdated(targetRole);
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating role.");
        } finally {
            setIsUpdatingDb(false);
        }
    }

    if (isCollapsed) {
        return (
            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                    <span>🧪 Testing Toggler</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase">
                        {activeView}
                    </span>
                    <span>▼</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900/95 dark:bg-slate-900/90 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl text-white transition-all duration-300 mb-6">
            <div className="flex flex-col gap-4">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-lg shadow-md shadow-violet-500/20">
                            🧪
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                                    QA & Dev Testing Dashboard Switcher
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                                    Live Test Mode
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Switch views instantly without repeated login/logout.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                            <span className="text-slate-400">Account DB Role:</span>
                            <span className="font-bold uppercase text-cyan-400">
                                {currentDbRole}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                            title="Collapse testing bar"
                        >
                            ▲ Minimize
                        </button>
                    </div>
                </div>

                {/* Switcher Controls & Options */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    {/* Role View Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
                        <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider hidden sm:inline-block">
                            Preview View:
                        </span>

                        {/* Buyer Tab */}
                        <button
                            onClick={() => onViewChange("buyer")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                                activeView === "buyer"
                                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                            }`}
                        >
                            <span>🎮</span>
                            <span>Buyer Dashboard</span>
                            {activeView === "buyer" && (
                                <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                            )}
                        </button>

                        {/* Seller Tab */}
                        <button
                            onClick={() => onViewChange("seller")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                                activeView === "seller"
                                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                            }`}
                        >
                            <span>🚀</span>
                            <span>Seller Dashboard</span>
                            {activeView === "seller" && (
                                <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                            )}
                        </button>

                        {/* Admin Tab */}
                        <button
                            onClick={() => onViewChange("admin")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                                activeView === "admin"
                                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30 scale-105"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                            }`}
                        >
                            <span>⚡</span>
                            <span>Admin Dashboard</span>
                            {activeView === "admin" && (
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                        </button>
                    </div>

                    {/* Secondary Actions: Sync DB Role & Page Links */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Sync DB Role Button */}
                        <button
                            onClick={() => handleSyncDbRole(activeView)}
                            disabled={isUpdatingDb || currentDbRole === activeView}
                            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                                currentDbRole === activeView
                                    ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white shadow-md shadow-violet-500/20 active:scale-95"
                            }`}
                            title="Update database account role to match currently selected view"
                        >
                            <span>{isUpdatingDb ? "⏳ Updating..." : "⚡ Set DB Role"}</span>
                            {currentDbRole !== activeView && (
                                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                                    → {activeView.toUpperCase()}
                                </span>
                            )}
                        </button>

                        {/* Sub-route Links Shortcuts */}
                        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-[11px]">
                            <span className="text-slate-500 px-2 font-medium">Routes:</span>
                            <Link
                                href="/dashboard"
                                className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                            >
                                /dashboard
                            </Link>
                            <Link
                                href="/dashboard/buyer"
                                className="px-2 py-1 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition"
                            >
                                /buyer
                            </Link>
                            <Link
                                href="/dashboard/seller"
                                className="px-2 py-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition"
                            >
                                /seller
                            </Link>
                            <Link
                                href="/dashboard/admin"
                                className="px-2 py-1 rounded hover:bg-slate-800 text-violet-400 hover:text-violet-300 transition"
                            >
                                /admin
                            </Link>
                            <Link
                                href="/analytics"
                                className="px-2 py-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition"
                            >
                                /analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
