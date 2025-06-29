"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

export function AdminNavigation({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
            isActive(item.href)
              ? "bg-cyan-400/10 text-cyan-400 border-l-4 border-cyan-400 shadow-lg"
              : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
          }`}
        >
          <span className={`mr-3 transition-colors ${
            isActive(item.href) 
              ? "text-cyan-400" 
              : "text-slate-400 group-hover:text-cyan-400"
          }`}>
            {item.icon}
          </span>
          <span className="font-medium">{item.label}</span>
          {isActive(item.href) && (
            <div className="absolute right-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Link>
      ))}
    </nav>
  );
} 