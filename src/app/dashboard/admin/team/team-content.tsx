"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Fetch via Nest API instead of DB/session
import TeamTable from "@/components/TeamTable";
import { ROUTES } from "@/lib/router";
import { authFetch } from "@/lib/auth-fetch";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default function TeamContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<SearchParams>({});

  useEffect(() => {
    const fetchTeam = async () => {
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
        
        const res = await authFetch(`/api/team?${paramsApi.toString()}`);
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }
        const data = await res.json();
        setTeamMembers(data.data ?? []);
        setTotalCount(data.pagination?.total ?? 0);
      } catch (err) {
        setError("Failed to load team members");
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [searchParams, router]);

  if (loading) {
    return <div>Loading team members...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const page = Number(currentParams.page) || 1;
  const limit = Number(currentParams.limit) || 10;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      {/* Team Members Table */}
      <TeamTable teamMembers={teamMembers} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-700">
            Showing {skip + 1} to {Math.min(skip + limit, totalCount)} of{" "}
            {totalCount} doctors
          </p>

          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`${ROUTES.ADMIN_TEAM}?page=${page - 1}&limit=${limit}${
                  currentParams.search ? `&search=${encodeURIComponent(currentParams.search)}` : ""
                }${currentParams.status ? `&status=${currentParams.status}` : ""}`}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={`${ROUTES.ADMIN_TEAM}?page=${page + 1}&limit=${limit}${
                  currentParams.search ? `&search=${encodeURIComponent(currentParams.search)}` : ""
                }${currentParams.status ? `&status=${currentParams.status}` : ""}`}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
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
