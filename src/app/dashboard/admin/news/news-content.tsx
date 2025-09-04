import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Fetch via Nest API instead of DB/session
import NewsTable from "@/components/NewsTable";
import { ROUTES } from "@/lib/router";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default async function NewsContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page = "1", limit = "10", search, status } = await searchParams;
  const params = new URLSearchParams({ page, limit });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const res = await fetch(`/api/news?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    redirect('/dashboard');
  }
  const data = await res.json();
  const news = data.news ?? [];
  const total = data.meta?.total ?? 0;
  const totalPages = data.meta?.totalPages ?? 1;

  return (
    <>
      {/* News Table */}
      <NewsTable news={news as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(Number(page) - 1) * Number(limit) + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(Number(page) * Number(limit), total)}
            </span>{" "}
            of <span className="font-medium">{total}</span> results
          </div>

          <div className="flex gap-3">
            {Number(page) > 1 && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_NEWS,
                  query: {
                    page: Number(page) - 1,
                    limit,
                    ...(search && { search }),
                    ...(status && { status }),
                  },
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </Link>
            )}

            {Number(page) < totalPages && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_NEWS,
                  query: {
                    page: Number(page) + 1,
                    limit,
                    ...(search && { search }),
                    ...(status && { status }),
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
