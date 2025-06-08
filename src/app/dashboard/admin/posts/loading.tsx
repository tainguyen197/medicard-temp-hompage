import { PlusIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";

export default function PostsLoading() {
  return (
    <div className="container mx-auto">
      {/* Featured Posts Count */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-amber-800 flex items-center">
            <StarIcon className="mr-2" size={18} />
            Featured Posts:{" "}
            <div className="w-6 h-6 bg-amber-100 animate-pulse rounded ml-1"></div>
            /5
          </h2>
          <p className="text-sm text-amber-700 mt-1">
            Maximum of 5 posts can be featured at a time. Featured posts appear
            in the highlighted section on the news page.
          </p>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
                  <div className="h-12 w-12 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
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
    </div>
  );
}
