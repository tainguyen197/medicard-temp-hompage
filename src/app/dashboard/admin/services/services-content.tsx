"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Fetch via Nest API instead of DB/session
import ServicesTable from "@/components/ServicesTable";
import { ROUTES } from "@/lib/router";
import { authFetch } from "@/lib/auth-fetch";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default function ServicesContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<SearchParams>({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const resolvedParams = await searchParams;
        setCurrentParams(resolvedParams);
        const { page = "1", limit = "10", search, status } = resolvedParams;
        const params = new URLSearchParams({ page, limit });
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        
        const res = await authFetch(`/api/services?${params.toString()}`);
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }
        const data = await res.json();
        setServices(data.services ?? []);
        setTotal(data.meta?.total ?? 0);
        setTotalPages(data.meta?.totalPages ?? 1);
      } catch (err) {
        setError("Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [searchParams, router]);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      {/* Services Table */}
      <ServicesTable services={services as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(Number(currentParams.page || "1") - 1) * Number(currentParams.limit || "10") + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(Number(currentParams.page || "1") * Number(currentParams.limit || "10"), total)}
            </span>{" "}
            of <span className="font-medium">{total}</span> results
          </div>

          <div className="flex gap-3">
            {Number(currentParams.page || "1") > 1 && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_SERVICES,
                  query: {
                    page: Number(currentParams.page || "1") - 1,
                    limit: currentParams.limit || "10",
                    ...(currentParams.search && { search: currentParams.search }),
                    ...(currentParams.status && { status: currentParams.status }),
                  },
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </Link>
            )}

            {Number(currentParams.page || "1") < totalPages && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_SERVICES,
                  query: {
                    page: Number(currentParams.page || "1") + 1,
                    limit: currentParams.limit || "10",
                    ...(currentParams.search && { search: currentParams.search }),
                    ...(currentParams.status && { status: currentParams.status }),
                  },
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                Next
                <ChevronRightIcon size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
