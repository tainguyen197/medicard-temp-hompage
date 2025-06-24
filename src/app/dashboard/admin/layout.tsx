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
import { AdminNavItems } from "./components/AdminNavItems";

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

  // Check if user has admin or editor role
  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    // Redirect to unauthorized page or home
    redirect("/");
  }

  const isAdmin = session.user.role === "ADMIN";

  // Define navigation items
  const navItems = [
    // {
    //   label: "Dashboard",
    //   href: ROUTES.ADMIN_DASHBOARD,
    //   icon: <LayoutDashboard className="h-5 w-5" />,
    // },
    {
      label: "Home",
      href: ROUTES.ADMIN_DASHBOARD,
      icon: <LayoutDashboard className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      label: "Dashboard",
      href: ROUTES.ADMIN_DASHBOARD,
      icon: <LayoutDashboard className="h-5 w-5" />,
      adminOnly: true,
    },

    {
      label: "Services",
      href: ROUTES.ADMIN_SERVICES,
      icon: <Flag className="h-5 w-5" />,
    },
    {
      label: "Team Members",
      href: ROUTES.ADMIN_TEAM,
      icon: <Users className="h-5 w-5" />,
      // adminOnly: true,
    },
    {
      label: "Banners",
      href: ROUTES.ADMIN_BANNERS,
      icon: <Image className="h-5 w-5" />,
    },
    {
      label: "Contact",
      href: ROUTES.ADMIN_CONTACT,
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: "Media Library",
      href: "/dashboard/admin/media",
      icon: <Image className="h-5 w-5" />,
    },
    // {
    //   label: "Settings",
    //   href: ROUTES.ADMIN_SETTINGS,
    //   icon: <Settings className="h-5 w-5" />,
    //   adminOnly: true,
    // },
  ];

  // Filter out admin-only items for editors
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="admin-layout">
      {/* Message Handler for all admin routes */}
      <MessageHandler />

      {/* Mobile header */}
      <div className="md:hidden bg-white border-b shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className="text-xl font-bold text-blue-600"
          >
            Dashboard
          </Link>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div>
        <Link href={ROUTES.ADMIN_DASHBOARD}>Home</Link>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <aside className="admin-sidebar hidden md:flex flex-col w-64">
          <div className="admin-sidebar-logo">
            <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" />
              </svg>
              Dashboard
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 flex flex-col justify-between">
            <AdminNavItems
              navItems={filteredNavItems}
              userData={session.user as any}
            />
          </nav>
        </aside>

        {/* Main content */}
        <main className="admin-content flex-1 md:ml-[20%]">{children}</main>
      </div>
    </div>
  );
}
