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
        // First call your custom logout API to clear cookies and log the event
        await fetch('/api/auth/logout', { 
          method: 'POST',
          credentials: 'include' 
        });

        // Then use NextAuth signOut with proper callback
        await signOut({ 
          redirect: true,
          callbackUrl: ROUTES.AUTH_LOGIN 
        });
        
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
