"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { ROUTES } from "@/lib/router";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear the JWT token from localStorage
        await logout();
        
        // Redirect to login page
        router.push(ROUTES.AUTH_LOGIN);
        router.refresh();
        
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: force redirect anyway
        window.location.href = ROUTES.AUTH_LOGIN;
      } finally {
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-gray-700 mb-4">Signing you out…</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
