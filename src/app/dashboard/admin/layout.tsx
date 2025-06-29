import "./styles.css";
import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  LayoutDashboard,
  FileText,
  Flag,
  Users,
  Image,
  Settings,
  Menu,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { ROUTES } from "@/lib/router";
import { MessageHandler } from "@/components/MessageHandler";
import { AdminNavigation } from "./components/AdminNavigation";
import { canPublishContent, canManageUsers, canAccessSystemSettings, canViewAuditLogs } from "@/lib/utils";
import NextImage from "next/image";
import { AdminLayoutClient } from "./AdminLayoutClient";

// Server component
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user has at least editor role
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    // Redirect to unauthorized page or home
    redirect("/");
  }

  const isAdmin = session.user.role === "ADMIN";

  // Define navigation items with roles
  const navItems = [  
    {
      label: "Dashboard",
      href: ROUTES.ADMIN_DASHBOARD,
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      label: "Services",
      href: ROUTES.ADMIN_SERVICES,
      icon: <Flag className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    },
    {
      label: "News",
      href: ROUTES.ADMIN_NEWS,
      icon: <FileText className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    },
    {
      label: "Doctors",
      href: ROUTES.ADMIN_TEAM,
      icon: <Users className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    },
    {
      label: "Banners",
      href: ROUTES.ADMIN_BANNERS,
      icon: <Image className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      label: "Contact",
      href: ROUTES.ADMIN_CONTACT,
      icon: <Settings className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      label: "Media Library",
      href: ROUTES.ADMIN_MEDIA,
      icon: <Image className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    },
   
    {
      label: "User Management",
      href: ROUTES.ADMIN_USERS,
      icon: <Users className="h-5 w-5" />,
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Logs",
      href: ROUTES.ADMIN_LOGS,
      icon: <FileText className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(session.user.role));

  return (
    <AdminLayoutClient>
      <div className="admin-layout h-screen bg-slate-50 overflow-hidden flex flex-col">
        {/* Message Handler for all admin routes */}
        <MessageHandler />

        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between p-4">
            <Link
              href={ROUTES.ADMIN_DASHBOARD}
              className="text-xl font-bold text-slate-900"
            >
              HTC Wellness
            </Link>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-72 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl overflow-y-auto">
            {/* Logo Header */}
            <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
              <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center group">
                  <NextImage src="/images/logo.png" alt="HTC Wellness Logo" width={120} height={60} className="h-12 w-auto" />
              </Link>
            </div>

            {/* Navigation with active state */}
            <div className="flex-1 overflow-y-auto">
              <AdminNavigation navItems={filteredNavItems} />
            </div>

            {/* User Profile Section */}
            <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-slate-900 font-semibold text-sm">
                    {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-white">{session.user.name || "User"}</div>
                  <div className="text-sm text-slate-300">{session.user.role}</div>
                </div>
              </div>
              <Link
                href={ROUTES.AUTH_LOGOUT}
                className="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </Link>
            </div>
          </aside>

          {/* Main content - only this should scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminLayoutClient>
  );
}
