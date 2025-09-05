"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

export default function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const resolvedParams = await searchParams;
        const { page = "1" } = resolvedParams;
        const pageNumber = parseInt(page, 10);
        setCurrentPage(pageNumber);
        
        const pageSize = 20;
        const skip = (pageNumber - 1) * pageSize;

        const res = await authFetch(`/api/logs?skip=${skip}&take=${pageSize}`);
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }
        
        const data = await res.json();
        setLogs(data.logs ?? []);
        setTotal(data.meta?.total ?? data.logs?.length ?? 0);
      } catch (err) {
        setError("Failed to load logs");
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [searchParams, router]);

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
        <div className="text-center py-12">
          <div className="text-slate-600">Loading logs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 mb-2">Error</div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Entity</th>
              <th className="px-4 py-2">Entity ID</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    timeZone: "Asia/Bangkok",
                  })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {log.userId}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{log.action}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.entity}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.entityId}</td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <a
            href={`?page=${currentPage - 1}`}
            className={`px-3 py-1 rounded ${
              currentPage <= 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={currentPage <= 1}
          >
            Previous
          </a>
          <a
            href={`?page=${currentPage + 1}`}
            className={`px-3 py-1 rounded ${
              currentPage >= totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
}
