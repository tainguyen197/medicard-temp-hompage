import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import ServicesTable from "@/components/ServicesTable";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const { page = "1", limit = "10", search, status } = await searchParams;

  // Build filter object
  const where: any = {};

  if (search) {
    where.OR = [{ title: { contains: search } }];
  }

  if (status) {
    where.status = status;
  }

  // Get services with pagination
  const total = await prisma.service.count({ where });
  const totalPages = Math.ceil(total / Number(limit));

  const services = await prisma.service.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: {
      featureImage: true,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services</h1>

        <Link
          href="/dashboard/admin/services/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          New Service
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div>
          <h2 className="font-medium text-blue-800">Service Management</h2>
          <p className="text-sm text-blue-700 mt-1">
            Manage your healthcare services. Services are displayed on the
            services page of your website.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form
        action="/dashboard/admin/services"
        method="GET"
        className="bg-white p-4 rounded-md shadow mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search services..."
                defaultValue={search || ""}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
              <SearchIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              name="status"
              defaultValue={status || ""}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FilterIcon size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Hidden fields to preserve pagination when filtering */}
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={limit} />
      </form>

      {/* Services Table */}
      <ServicesTable services={services} />

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
                  pathname: "/dashboard/admin/services",
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
                  pathname: "/dashboard/admin/services",
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
    </div>
  );
}
