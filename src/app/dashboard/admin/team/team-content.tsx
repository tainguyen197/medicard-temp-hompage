import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Fetch via Nest API instead of DB/session
import TeamTable from "@/components/TeamTable";
import { ROUTES } from "@/lib/router";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default async function TeamContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const status = params.status || "";

  const skip = (page - 1) * limit;

  const paramsApi = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) paramsApi.set('search', search);
  if (status) paramsApi.set('status', status);
  const res = await fetch(`/api/team?${paramsApi.toString()}`, { cache: 'no-store' });
  if (!res.ok) redirect('/dashboard');
  const data = await res.json();
  const teamMembers = data.team ?? data.items ?? [];
  const totalCount = data.meta?.total ?? 0;

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
                  search ? `&search=${encodeURIComponent(search)}` : ""
                }${status ? `&status=${status}` : ""}`}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={`${ROUTES.ADMIN_TEAM}?page=${page + 1}&limit=${limit}${
                  search ? `&search=${encodeURIComponent(search)}` : ""
                }${status ? `&status=${status}` : ""}`}
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
