import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";

import { ROUTES } from "@/lib/router";
import TeamContent from "./team-content";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
};

export default function TeamPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Doctors</h1>

        <Link
          href={ROUTES.ADMIN_TEAM + "/new"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          New Doctor
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div>
          <h2 className="font-medium text-blue-800">Doctor Management</h2>
          <p className="text-sm text-blue-700 mt-1">
            Manage your doctors. Doctor profiles are displayed on the team
            section of your website with support for Vietnamese and English
            languages.
          </p>
        </div>
      </div>

      <Suspense fallback={<TeamSkeletonContent />}>
        <TeamContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Inline skeleton component for the table and pagination
function TeamSkeletonContent() {
  return (
    <>
      {/* Table Skeleton */}
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 bg-gray-200 rounded w-60"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-16 inline-block"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 inline-block"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-6">
        <div className="w-60 h-5 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex gap-3">
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    </>
  );
}
