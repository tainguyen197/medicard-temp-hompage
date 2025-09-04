"use client";

import { ReactNode } from "react";
import { getToken } from "@/lib/auth";
import { canViewDashboardSection } from "@/lib/utils";

interface RoleBasedContentProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleBasedContent({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleBasedContentProps) {
  const token = getToken();
  // Client-only simple check: if no token, hide
  if (!token) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBasedStatsProps {
  children: ReactNode;
  section: string;
  fallback?: ReactNode;
}

export function RoleBasedStats({ 
  children, 
  section, 
  fallback = null 
}: RoleBasedStatsProps) {
  const token = getToken();
  if (!token) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 