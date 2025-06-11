const NewsLoading = () => {
  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </section>

      {/* Introduction Section Skeleton */}
      <section className="py-16 text-center">
        <div className="h-16 md:h-20 w-80 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
      </section>

      {/* Trending Topics Section Skeleton */}
      <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Featured post (larger) - left side */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden h-80 md:h-96">
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              <div className="absolute bottom-0 w-full p-4 md:p-8">
                <div className="h-8 w-3/4 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Grid of smaller posts - right side */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-80 md:h-96">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="relative rounded-lg overflow-hidden">
                  <div className="aspect-square relative">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    <div className="absolute bottom-0 p-4">
                      <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Topic Listing Section Skeleton */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item}>
            <article className="relative flex flex-col md:flex-row items-center mb-4 md:mb-12 justify-between">
              <div className="pr-8 flex flex-col flex-1">
                {/* Title Skeleton */}
                <div className="h-8 w-full max-w-md bg-gray-200 animate-pulse rounded mb-4"></div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>

              {/* Image Skeleton */}
              <div className="mt-4 md:mt-0">
                <div className="relative rounded-xl overflow-hidden aspect-square md:h-44 md:w-44 w-full bg-gray-200 animate-pulse"></div>
              </div>
            </article>

            {/* Divider */}
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination Section Skeleton */}
      <section className="container mx-auto px-4 mb-12 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          {/* Previous button skeleton */}
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>

          {/* Page numbers skeleton */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="w-10 h-10 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}

          {/* Next button skeleton */}
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </section>

      {/* Newsletter/CTA Section Skeleton */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
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

export default NewsLoading;
