"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/lib/router";

// Types for the navigation items and user data
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface UserData {
  name?: string;
  role?: string;
}

export function AdminNavItems({
  navItems,
  userData,
}: {
  navItems: NavItem[];
  userData: UserData;
}) {
  const pathname = usePathname();

  // Check if a route is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t mt-4">
        <div className="flex items-center mb-4">
          <div>
            <div className="font-medium">{userData.name}</div>
            <div className="text-xs text-gray-500">{userData.role}</div>
          </div>
        </div>
        <Link
          href={ROUTES.AUTH_LOGOUT}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md w-full transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Link>
      </div>
    </>
  );
}
