import Image from "next/image";
import Link from "next/link";

export default function NewsDetailLoading() {
  return (
    <div>
      <div className="pt-16 md:pt-24">
        {/* Hero Section with Cover Image */}
        <section className="relative w-full h-[40vh] md:h-[70vh]">
          <Image
            src="/images/news/news-cover.jpg"
            alt="News Cover"
            fill
            priority
            className="object-cover"
          />
        </section>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Link
              href="/news"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
            >
              Tin tức
            </Link>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          <div className="h-8 md:h-12 bg-gray-200 animate-pulse rounded mb-6 w-3/4"></div>
          <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded mb-10 w-1/2"></div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 mb-16 max-w-7xl">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
                <div className="h-40 bg-gray-200 animate-pulse rounded w-full my-8"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              </div>
            </div>
            <hr className="my-12 border-gray-300" />
          </div>
        </div>

        {/* Related Posts */}
        <div className="container mx-auto md:px-20 md:py-14 bg-[#FEF6EA] rounded-4xl max-w-7xl">
          <div className="mx-auto px-4">
            <h2 className="text-2xl font-semibold text-[#222222] mb-10">
              Có thể bạn quan tâm
            </h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="rounded-lg overflow-hidden">
                    <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44 bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="md:w-3/4 my-auto">
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-md md:text-lg px-16 text-black mb-10 max-w-3xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
