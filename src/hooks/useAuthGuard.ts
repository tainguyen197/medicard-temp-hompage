"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      console.log("No session found, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // Optional: Add session heartbeat
    const checkSession = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          console.log("Session expired, logging out");
          router.push("/auth/logout");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSession);
  }, [session, status, router]);

  return { session, status };
} 