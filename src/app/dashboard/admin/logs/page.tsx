import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function AdminLogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard/admin");
  }

  const { page = "1" } = await searchParams;
  const pageNumber = parseInt(page, 10);
  const pageSize = 20;
  const skip = (pageNumber - 1) * pageSize;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ]);

  // Fetch user info for logs
  const userIds = Array.from(new Set(logs.map((log) => log.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const totalPages = Math.ceil(total / pageSize);

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
                <td className="px-4 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {userMap[log.userId]?.name || userMap[log.userId]?.email || log.userId}
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
          Page {pageNumber} of {totalPages}
        </span>
        <div className="space-x-2">
          <a
            href={`?page=${pageNumber - 1}`}
            className={`px-3 py-1 rounded ${pageNumber <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            aria-disabled={pageNumber <= 1}
          >
            Previous
          </a>
          <a
            href={`?page=${pageNumber + 1}`}
            className={`px-3 py-1 rounded ${pageNumber >= totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            aria-disabled={pageNumber >= totalPages}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
} 