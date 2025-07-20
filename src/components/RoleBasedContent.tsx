"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  
  if (!session?.user || !allowedRoles.includes(session.user.role)) {
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
  const { data: session } = useSession();
  
  if (!session?.user || !canViewDashboardSection(session.user.role, section)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 