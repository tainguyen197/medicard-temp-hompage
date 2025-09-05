"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import { ROUTES } from "@/lib/router";

export function UserProfile() {
  const { user, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-slate-900 font-semibold text-sm">...</span>
          </div>
          <div className="ml-3">
            <div className="font-medium text-white animate-pulse">Loading...</div>
            <div className="text-sm text-slate-300 animate-pulse">...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">!</span>
          </div>
          <div className="ml-3">
            <div className="font-medium text-white">Error</div>
            <div className="text-sm text-slate-300">Failed to load</div>
          </div>
        </div>
      </div>
    );
  }

  // Get user's first initial for avatar
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  
  // Format role for display
  const displayRole = user.role === "SUPER_ADMIN" ? "Super Admin" : user.role;
  const displayName = user.name || user.email.split("@")[0];

  return (
    <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
          <span className="text-slate-900 font-semibold text-sm">
            {userInitial}
          </span>
        </div>
        <div className="ml-3">
          <div className="font-medium text-white">{displayName}</div>
          <div className="text-sm text-slate-300">{displayRole}</div>
        </div>
      </div>
      <Link
        href={ROUTES.AUTH_LOGOUT}
        className="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-colors duration-200"
      >
        <svg
          className="h-4 w-4 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </Link>
    </div>
  );
}
