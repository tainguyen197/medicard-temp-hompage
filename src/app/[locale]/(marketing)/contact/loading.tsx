import React from "react";

export default function ContactLoading() {
  return (
    <div className="pt-20">
      {/* Main Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left side - Image placeholder */}
            <div className="md:w-1/2">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </div>
            </div>

            {/* Right side - Contact Information skeleton */}
            <div className="md:w-1/2">
              {/* Title skeleton */}
              <div className="h-10 md:h-12 w-3/4 bg-gray-200 animate-pulse rounded mb-8"></div>

              {/* Address skeleton */}
              <div className="mb-8">
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>

              {/* Business Hours skeleton */}
              <div className="mb-8">
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-5 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>

              {/* Contact Information skeleton */}
              <div className="mb-8">
                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-5 w-3/5 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-5 w-4/5 bg-gray-200 animate-pulse rounded"></div>
              </div>

              {/* Appointment Button skeleton */}
              <div className="mt-12">
                <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
