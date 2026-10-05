"use client";

import React from "react";
import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";

export default function AdminUsersPage() {
    return <DashboardLayoutWrapper defaultRoleView="admin" defaultTab="users" />;
}
