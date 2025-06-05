"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/router";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // call signOut, then redirect to login
    signOut({ redirect: false }).then(() => router.push(ROUTES.AUTH_LOGIN));
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-700">Signing you out…</p>
    </div>
  );
}
