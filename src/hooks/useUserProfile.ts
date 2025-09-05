"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authFetch("/api/auth/profile");
        
        if (!response.ok) {
          // If it's a 401, authFetch will handle the redirect to logout
          // For other errors, throw an error
          if (response.status !== 401) {
            throw new Error("Failed to fetch user profile");
          }
          return; // Exit early for 401 responses
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { user, loading, error };
}
