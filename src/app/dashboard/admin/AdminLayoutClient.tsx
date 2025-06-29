"use client";

import { useEffect } from "react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add admin layout styles to body
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  return <>{children}</>;
} 