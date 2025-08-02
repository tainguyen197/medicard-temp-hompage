import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomeLoading() {
  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-full aspect-[21/9]">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </section>

      {/* Loading Spinner for Content */}
      <section className="py-16 md:py-24">
        <LoadingSpinner size="lg" text="Loading your experience..." showIcons={true} />
      </section>

      {/* About Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-6 w-64"></div>
            <div className="max-w-5xl mx-auto space-y-4 mb-8">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Gallery Section Skeleton */}
      <section className="bg-[#FEF6EA] py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-72"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-32 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Methods Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-80"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="h-20 w-20 bg-gray-200 animate-pulse rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className="bg-[#FEF6EA] py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-64"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="h-48 w-48 bg-gray-200 animate-pulse rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mb-6 w-3/4"></div>
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Equipment Section Skeleton */}
      <section className="bg-[#FEF6EA] py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-72"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-32 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-64"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section Skeleton */}
      <section className="bg-[#FEF6EA] py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-64"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-64"></div>
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </section>
    </div>
  );
} 