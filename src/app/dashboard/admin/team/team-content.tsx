import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const status = params.status || "";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameEn: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { titleEn: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { descriptionEn: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  // Get team members
  const [teamMembers, totalCount] = await Promise.all([
    prisma.teamMember.findMany({
      where,
      include: {
        image: true,
        imageEn: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.teamMember.count({ where }),
  ]);

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
