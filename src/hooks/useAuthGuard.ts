"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log("No session found, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // Optional: Add session heartbeat
    const checkSession = setInterval(async () => {
      try {
        if (!getToken()) {
          console.log("Session expired, logging out");
          router.push("/auth/logout");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSession);
  }, [router]);

  return {} as const;
} 