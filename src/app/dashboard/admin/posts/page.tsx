"use client";

import React from "react";
import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";

export default function AdminPostsPage() {
    return <DashboardLayoutWrapper defaultRoleView="admin" defaultTab="posts" />;
}
