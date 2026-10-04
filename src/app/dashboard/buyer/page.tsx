"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";

export default function BuyerDashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [fetchedRole, setFetchedRole] = useState<string>("buyer");
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
                    setFetchedRole(data.role || (session.user as any).role || "buyer");
                } else {
                    setFetchedRole((session.user as any).role || "buyer");
                }
            } catch (err) {
                setFetchedRole((session.user as any).role || "buyer");
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
                </div>
            </div>
        );
    }

    if (!session?.user) return null;

    // Check Role Access Restriction
    if (fetchedRole !== "buyer") {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-rose-500/20 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl">
                        🛡️
                    </div>
                    <div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Restricted Role Access
                        </span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                            Buyer Dashboard Restricted
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Your active account role is <span className="font-bold text-slate-900 dark:text-white uppercase">{fetchedRole}</span>. This page is dedicated exclusively to Buyer accounts.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full pt-2">
                        <Link href="/dashboard" className="w-full">
                            <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md cursor-pointer">
                                Return to My Dashboard →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                <BuyerDashboard user={session.user} />
            </div>
        </div>
    );
}
