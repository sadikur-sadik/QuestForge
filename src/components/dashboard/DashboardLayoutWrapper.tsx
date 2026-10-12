"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export type DashboardRole = "buyer" | "seller" | "admin";

interface DashboardLayoutWrapperProps {
    defaultRoleView?: DashboardRole;
    defaultTab?: string;
}

export default function DashboardLayoutWrapper({ defaultRoleView, defaultTab }: DashboardLayoutWrapperProps) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [fetchedRole, setFetchedRole] = useState<DashboardRole>(defaultRoleView || "buyer");
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
                let dbRole: DashboardRole = "buyer";
                if (res.ok) {
                    const data = await res.json();
                    dbRole = (data.role || (session.user as any).role || "buyer") as DashboardRole;
                } else {
                    dbRole = ((session.user as any).role || "buyer") as DashboardRole;
                }
                setFetchedRole(dbRole);
            } catch (err) {
                const fallbackRole = ((session.user as any).role || "buyer") as DashboardRole;
                setFetchedRole(fallbackRole);
            } finally {
                setIsLoadingRole(false);
            }
        }
        loadRole();
    }, [session, isPending, router]);

    if (isPending || isLoadingRole) {
        return (
            <div className="relative min-h-[calc(100vh-64px)] w-full py-6 bg-slate-50 dark:bg-slate-950">
                <div className="qf-container">
                    <DashboardSkeleton roleName={defaultRoleView || "Command Center"} />
                </div>
            </div>
        );
    }

    if (!session?.user) return null;

    const activeView = defaultRoleView || fetchedRole || "buyer";

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-6 bg-slate-50 dark:bg-slate-950">
            <div className="qf-container flex flex-col gap-6">
                {activeView === "buyer" && <BuyerDashboard user={session.user} defaultTab={defaultTab as any} />}
                {activeView === "seller" && <SellerDashboard user={session.user} defaultTab={defaultTab as any} />}
                {activeView === "admin" && <AdminDashboard user={session.user} defaultTab={defaultTab as any} />}
            </div>
        </div>
    );
}
