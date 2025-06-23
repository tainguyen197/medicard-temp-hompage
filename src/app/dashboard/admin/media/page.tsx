import { Suspense } from "react";
import MediaContent from "./media-content";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default function MediaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your uploaded media files and images
          </p>
        </div>
      </div>

      <Suspense fallback={<MediaSkeletonContent />}>
        <MediaContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Loading skeleton component
function MediaSkeletonContent() {
  return (
    <>
      {/* Stats Banner Skeleton */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 bg-blue-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-blue-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-8 bg-blue-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6">
        <div className="h-10 bg-gray-200 rounded w-full md:w-80 animate-pulse"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-4 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded-md mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-8">
        <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
