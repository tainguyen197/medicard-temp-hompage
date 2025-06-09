import React from "react";

export default function ServicesDetailSectionSkeleton() {
  return (
    <section className="">
      <div className="mb-12 text-center">
        <div className="h-8 md:h-12 bg-gray-200 rounded-md w-80 mx-auto animate-pulse mb-4"></div>
      </div>
      <div className="container bg-[#FEF6EA] mx-auto px-4 max-w-6xl py-14 md:p-16 rounded-4xl">
        {/* Service Items Skeleton */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="relative mb-10 last:mb-0">
            <div className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                <div className="h-52 aspect-270/200 relative rounded-2xl overflow-hidden bg-gray-200 animate-pulse"></div>
                <div className="md:w-2/3 p-6 md:p-0">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                    <div className="h-8 md:h-10 bg-gray-200 rounded-md w-64 animate-pulse mb-2 md:mb-0"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="container mx-auto px-4 max-w-6xl py-4 md:p-8 rounded-4xl">
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
