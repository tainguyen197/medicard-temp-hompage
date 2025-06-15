import Image from "next/image";

const ServicesLoading = () => {
  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
            alt="Hero Section"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Introduction Section Skeleton */}
      <section className="container mx-auto px-4 pt-10 md:pt-16 pb-12 md:pb-20">
        {/* Title Skeleton */}
        <div className="h-12 md:h-16 w-80 bg-gray-200 animate-pulse rounded-lg mx-auto mb-8"></div>

        {/* Description Skeleton */}
        <div className="max-w-5xl mx-auto space-y-4 mb-8">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
        </div>
      </section>

      {/* Services Detail Section Skeleton */}
      <section className="bg-[#FEF6EA] py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="mb-10 last:mb-0">
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                  {/* Image Skeleton */}
                  <div className="w-full md:w-1/3 h-52 aspect-270/200 bg-gray-200 animate-pulse rounded-2xl"></div>

                  {/* Content Skeleton */}
                  <div className="md:w-2/3 p-6 md:p-0 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      {/* Title Skeleton */}
                      <div className="h-8 w-60 bg-gray-200 animate-pulse rounded"></div>
                      {/* Button Skeleton */}
                      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-full mt-2 md:mt-0"></div>
                    </div>
                    {/* Description Skeleton */}
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/5"></div>
                    </div>
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
          {/* Heading Skeleton */}
          <div className="h-12 md:h-16 w-96 bg-gray-200 animate-pulse rounded mx-auto mb-6"></div>

          {/* Subheading Skeleton */}
          <div className="max-w-3xl mx-auto mb-8 space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
          </div>

          {/* Button Skeleton */}
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
        </div>
      </section>
    </div>
  );
};

export default ServicesLoading;
