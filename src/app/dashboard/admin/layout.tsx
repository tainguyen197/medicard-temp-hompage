"use client";

import "./styles.css";
import { ReactNode } from "react";
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Flag,
  Users,
  Image,
  Settings,
  Menu,
  Stethoscope,
} from "lucide-react";

import { ROUTES } from "@/lib/router";
import { MessageHandler } from "@/components/MessageHandler";
import { AdminNavigation } from "./components/AdminNavigation";
import NextImage from "next/image";
import { AdminLayoutClient } from "./AdminLayoutClient";
import { UserProfile } from "@/components/UserProfile";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Define navigation items
  const navItems = [
    {
      label: "Dashboard",
      href: ROUTES.ADMIN_DASHBOARD,
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
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
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      label: "Equipment",
      href: ROUTES.ADMIN_EQUIPMENT,
      icon: <Stethoscope className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      label: "Banners",
      href: ROUTES.ADMIN_BANNERS,
      icon: <Image className="h-5 w-5" />,
      roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
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

  return (
    <AdminGuard>
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
            <aside className="hidden lg:block flex-col w-72 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl overflow-y-auto">
              {/* Logo Header */}
              <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
                <Link
                  href={ROUTES.ADMIN_DASHBOARD}
                  className="flex items-center group"
                >
                  <NextImage
                    src="/images/logo.png"
                    alt="HTC Wellness Logo"
                    width={120}
                    height={60}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>

              {/* Navigation with active state */}
              <div className="flex-1 overflow-y-auto">
                <AdminNavigation navItems={navItems} />
              </div>

              {/* User Profile Section */}
              <UserProfile />
            </aside>

            {/* Main content - only this should scroll */}
            <main className="flex-1 overflow-y-auto">
              <div className="px-6 py-8">{children}</div>
            </main>
          </div>
        </div>
      </AdminLayoutClient>
    </AdminGuard>
  );
}