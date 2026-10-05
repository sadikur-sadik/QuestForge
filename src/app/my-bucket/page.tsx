"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";

export default function MyBucketPage() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
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

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <BuyerDashboard user={session.user} defaultTab="bucket" />
            </div>
        </div>
    );
}
