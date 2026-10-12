import React from "react";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function AdminDashboardLoading() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full py-6 bg-slate-50 dark:bg-slate-950">
            <div className="qf-container">
                <DashboardSkeleton roleName="Admin Console" />
            </div>
        </div>
    );
}
