"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [fetchedRole, setFetchedRole] = useState<"buyer" | "seller" | "admin">("buyer");
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push("/login");
            return;
        }

        async function loadRole() {
            if (!session?.user) return;
            try {
                const res = await fetch("/api/user/role");
                if (res.ok) {
                    const data = await res.json();
                    const role = (data.role || (session.user as any).role || "buyer") as "buyer" | "seller" | "admin";
                    setFetchedRole(role);
                } else {
                    const fallbackRole = ((session.user as any).role || "buyer") as "buyer" | "seller" | "admin";
                    setFetchedRole(fallbackRole);
                }
            } catch (err) {
                const fallbackRole = ((session.user as any).role || "buyer") as "buyer" | "seller" | "admin";
                setFetchedRole(fallbackRole);
            } finally {
                setIsLoadingRole(false);
            }
        }
        loadRole();
    }, [session, isPending, router]);

    if (isPending || isLoadingRole) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl animate-pulse space-y-6">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/4 rounded-xl" />
                    <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="grid grid-cols-4 gap-4">
                        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Render strictly matching role dashboard without switcher */}
                {fetchedRole === "buyer" && <BuyerDashboard user={session.user} />}
                {fetchedRole === "seller" && <SellerDashboard user={session.user} />}
                {fetchedRole === "admin" && <AdminDashboard user={session.user} />}
            </div>
        </div>
    );
}
