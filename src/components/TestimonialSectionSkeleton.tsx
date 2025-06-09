import React from "react";

export default function TestimonialSectionSkeleton() {
  return (
    <section className="relative container py-16 md:py-24 bg-white max-w-7xl mx-auto">
      <div className="relative mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
        <div className="mb-12 text-center">
          <div className="h-8 md:h-12 bg-gray-200 rounded-md w-80 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Testimonial Cards Skeleton */}
      <div className="absolute h-[480px] -bottom-[40px] w-full mx-auto px-6 pb-16 md:pb-20 left-[400px]">
        <div className="flex gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex-1 max-w-sm">
              <div className="relative bg-gray-100 p-8 border-8 border-white rounded-2xl aspect-square h-[400px] flex flex-col justify-between animate-pulse">
                <div>
                  <div className="w-12 h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/6"></div>
                  </div>
                </div>
                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
