import React from "react";
import ServicesDetailSectionSkeleton from "@/components/ServicesDetailSectionSkeleton";
import TestimonialSectionSkeleton from "@/components/TestimonialSectionSkeleton";

export default function AboutLoading() {
  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </section>

      {/* Healthcare Center Introduction Section Skeleton */}
      <section className="pt-10 md:pt-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-6 w-64"></div>
            <div className="max-w-5xl mx-auto space-y-4 mb-8">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
            </div>
            <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-3xl mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Certificates Section Skeleton */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-4 w-72"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
              <div className="flex flex-col items-center h-full">
                <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mx-auto"></div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
              <div className="flex flex-col items-center h-full">
                <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mx-auto"></div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-1 flex flex-col h-full">
              <div className="flex flex-col items-center h-full">
                <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail Section Skeleton */}
      <ServicesDetailSectionSkeleton />

      {/* Testimonial Section Skeleton */}
      <TestimonialSectionSkeleton />

      {/* Newsletter Section Skeleton */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 md:h-12 bg-gray-200 animate-pulse rounded-lg mx-auto mb-6 w-80"></div>
          <div className="max-w-3xl mx-auto px-16 mb-10">
            <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mx-auto mt-2"></div>
          </div>
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-3xl mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
