"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Fetch via Nest API instead of DB/session
import EquipmentTable from "@/components/EquipmentTable";
import { ROUTES } from "@/lib/router";
import { authFetch } from "@/lib/auth-fetch";
import { useUserProfile } from "@/hooks/useUserProfile";
import { hasRequiredRole } from "@/lib/utils";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default function EquipmentContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const router = useRouter();
  const [equipment, setEquipment] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<SearchParams>({});
  const { user } = useUserProfile();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const params = await searchParams;
        setCurrentParams(params);
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;
        const search = params.search || "";
        const status = params.status || "";

        const paramsApi = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) paramsApi.set('search', search);
        if (status) paramsApi.set('status', status);
        
        const res = await authFetch(`/api/equipment?${paramsApi.toString()}`);
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }
        const data = await res.json();
        setEquipment(data.equipment ?? []);
        setTotalCount(data.meta?.total ?? 0);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError("Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [searchParams, router]);

  const totalPages = Math.ceil(totalCount / (Number(currentParams.limit) || 10));
  const currentPage = Number(currentParams.page) || 1;

  const buildUrl = (newParams: Partial<SearchParams>) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentParams, ...newParams }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return `/dashboard/admin/equipment?${params.toString()}`;
  };

  // Permission checks - Equipment management requires ADMIN+ role
  const canCreate = user && hasRequiredRole(user.role, "ADMIN");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading equipment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600">
            Manage medical equipment and devices
          </p>
        </div>
        {canCreate && (
          <Link
            href={`${ROUTES.ADMIN_EQUIPMENT}/new`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Equipment
          </Link>
        )}
      </div>

      {/* Equipment Table */}
      <EquipmentTable equipment={equipment} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * (Number(currentParams.limit) || 10)) + 1} to{" "}
            {Math.min(currentPage * (Number(currentParams.limit) || 10), totalCount)} of{" "}
            {totalCount} results
          </div>
          <div className="flex items-center space-x-2">
            {currentPage > 1 && (
              <Link
                href={buildUrl({ page: String(currentPage - 1) })}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={buildUrl({ page: String(currentPage + 1) })}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}