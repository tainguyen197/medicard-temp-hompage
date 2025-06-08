import React from "react";

export default function ServicesLoading() {
  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* Services Detail Section Skeleton */}
      <section className="bg-[#FEF6EA] py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="mb-10 last:mb-0">
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                  <div className="h-52 aspect-270/200 bg-gray-200 animate-pulse rounded-2xl"></div>
                  <div className="md:w-2/3 p-6 md:p-0">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      <div className="h-8 w-60 bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-28 bg-gray-200 animate-pulse mt-2 md:mt-0"></div>
                    </div>
                    <div className="h-24 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 bg-gray-200 animate-pulse max-w-2xl mx-auto mb-6"></div>
          <div className="h-16 bg-gray-200 animate-pulse max-w-3xl mx-auto mb-8"></div>
          <div className="h-12 w-48 bg-gray-200 animate-pulse mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
