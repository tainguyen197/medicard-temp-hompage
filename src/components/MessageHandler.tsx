"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function MessageHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);

      // Remove the query parameter
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(newUrl);
    }

    if (error) {
      toast.error(error);

      // Remove the query parameter
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  return null;
}
