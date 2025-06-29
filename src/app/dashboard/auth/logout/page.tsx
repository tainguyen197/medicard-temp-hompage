"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/router";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Force clear all client-side session data
        await signOut({ 
          redirect: false,
          callbackUrl: ROUTES.AUTH_LOGIN 
        });
        
        // Clear any additional storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
        
        // Wait a moment for cleanup
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force hard redirect to login
        window.location.href = ROUTES.AUTH_LOGIN;
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: force redirect anyway
        window.location.href = ROUTES.AUTH_LOGIN;
      }
    };

    performLogout();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-gray-700 mb-4">Signing you out…</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
