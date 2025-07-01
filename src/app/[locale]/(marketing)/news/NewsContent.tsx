import React from "react";
import Image from "next/image";
import Link from "next/link";
import { News, NewsResponse } from "@/types/post";
import { getMessages } from "next-intl/server";

// Default image fallback if no featured image
const DEFAULT_IMAGE = "/images/news/news-image-1.jpg";

const getLocalizedContent = (news: any, locale: string) => {
  const isEnglish = locale === "en";
  return {
    title: isEnglish ? news.titleEn || news.title : news.title,
    description: isEnglish ? news.descriptionEn || news.description : news.description,
    shortDescription: isEnglish ? news.shortDescriptionEn || news.shortDescription : news.shortDescription,
  };
};

// Extract data fetching into a separate component
export async function NewsDataComponent({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.news;

  // Get the current page from search params or default to 1
  const { page = "1" } = await searchParams;
  const currentPage = Number(page);
  const postsPerPage = 10;

  let newsItems: News[] = [];
  let totalNews = 0;

  try {
    // Fetch posts from API
    console.log("Fetching news from API...");

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/news?page=${currentPage}&limit=${postsPerPage}&status=PUBLISHED`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (response.ok) {
      const data: NewsResponse = await response.json();
      totalNews = data.meta?.total || 0;
      
      // Convert API results with localized content
      newsItems = (data.news || []).map((newsItem: News) => {
        const localizedContent = getLocalizedContent(newsItem, locale);
        return {
          ...newsItem,
          title: localizedContent.title,
          description: localizedContent.description,
          shortDescription: localizedContent.shortDescription,
          featuredImage: newsItem.featureImage?.url,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
        };
      });

      console.log(`Found ${newsItems.length} news items on page ${currentPage}`);

      if (newsItems.length > 0) {
        console.log("First news title:", newsItems[0]?.title);
        console.log("First news status:", newsItems[0]?.status);
      }
    }
  } catch (error) {
    console.error("Failed to fetch news:", error);
    newsItems = [];
  }

  // If no news from database, show a message or fallback
  if (newsItems.length === 0) {
    console.log("No news found, showing empty state");
    return (
      <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px] text-center py-20">
        <h2 className="text-2xl text-gray-600 mb-4">{t.emptyState.title}</h2>
        <p className="text-gray-500">{t.emptyState.description}</p>
      </section>
    );
  }

  console.log("Rendering news page with content");

  // Fetch trending posts (featured posts)
  let trendingNews: News[] = [];
  try {
    const featuredResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/news/featured`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json();
      trendingNews = (featuredData.posts || []).map((newsItem: any) => {
        const localizedContent = getLocalizedContent(newsItem, locale);
        return {
          ...newsItem,
          title: localizedContent.title,
          description: localizedContent.description,
          shortDescription: localizedContent.shortDescription,
          featuredImage: newsItem.featureImage?.url,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
        } as News;
      });

      console.log(`Found ${trendingNews.length} featured news items`);
    }
  } catch (error) {
    console.error("Failed to fetch featured news:", error);
  }

  // If we don't have enough featured news, supplement with most recent news
  if (trendingNews.length < 5) {
    const recentNewsForTrending = newsItems.filter(
      (item: News) => !trendingNews.some((tn) => tn.id === item.id)
    );
    trendingNews = [
      ...trendingNews,
      ...recentNewsForTrending.slice(0, 5 - trendingNews.length),
    ];
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalNews / postsPerPage);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always include page 1
    pageNumbers.push(1);

    // Calculate start and end page numbers to show
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add page numbers between start and end
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
 
  console.log(newsItems);

  return (
    <>
      {/* 3. Trending Topics - Only show if we have enough posts */}
      {trendingNews.length >= 5 && (
        <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Featured post (larger) - left side */}
            <div className="md:w-1/2">
              <Link
                href={`/news/${trendingNews[0].slug}`}
                className="group relative rounded-lg overflow-hidden block h-full"
              >
                <div className="aspect-auto h-full relative">
                  <Image
                    src={trendingNews[0].featuredImage || DEFAULT_IMAGE}
                    alt={trendingNews[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0">
                    <div className="absolute bottom-0 w-full p-4 md:p-8 bg-[#00000080]">
                      <h3 className="text-white font-medium text-xl md:text-2xl">
                        {trendingNews[0].title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Grid of smaller posts - right side */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4 h-full">
                {trendingNews.slice(1, 5).map((newsItem) => (
                  <Link
                    href={`/news/${newsItem.slug}`}
                    key={newsItem.id}
                    className="group relative rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={newsItem.featuredImage || DEFAULT_IMAGE}
                        alt={newsItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0">
                        <div className="absolute bottom-0 p-4 bg-[#00000080]">
                          <h3 className="text-white font-medium text-sm md:text-base">
                            {newsItem.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Topic Listing */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        {newsItems.map((newsItem) => (
          <article key={newsItem.id}>
            <div className="relative flex flex-col md:flex-row items-center mb-4 md:mb-12 group justify-between">
              <Link
                href={`/news/${newsItem.slug}`}
                className="absolute inset-0 z-1"
              />
              <div className="pr-8 flex flex-col">
                <h2 className="text-2xl font-medium text-[#222222] mb-4 group-hover:text-[#B1873F] transition-colors">
                  {newsItem.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {newsItem.shortDescription || `${newsItem.description?.substring(0, 200)}...`}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href={`/news/${newsItem.slug}`}
                  className="block relative rounded-xl overflow-hidden aspect-square md:h-44"
                >
                  <Image
                    src={newsItem.featuredImage || DEFAULT_IMAGE}
                    alt={newsItem.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="container mx-auto px-4 mb-12 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          {/* Previous page button */}
          <Link
            href={currentPage > 1 ? `/news?page=${currentPage - 1}` : "#"}
            className={`flex items-center justify-center ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-[#B1873F] cursor-pointer"
            }`}
            aria-label={t.pagination.previousPage}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Page numbers */}
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === "..." ? (
                <span className="w-10 h-10 flex items-center justify-center text-gray-600">
                  ...
                </span>
              ) : (
                <Link
                  href={`/news?page=${pageNumber}`}
                  className={`w-10 h-10 rounded flex items-center justify-center border ${
                    currentPage === pageNumber
                      ? "border-[#B1873F] text-[#B1873F]"
                      : "border-gray-300 bg-white text-gray-600"
                  } font-bold cursor-pointer`}
                  aria-label={`${t.pagination.page} ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              )}
            </React.Fragment>
          ))}

          {/* Next page button */}
          <Link
            href={
              currentPage < totalPages ? `/news?page=${currentPage + 1}` : "#"
            }
            className={`flex items-center justify-center ${
              currentPage >= totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-[#B1873F] cursor-pointer"
            }`}
            aria-label={t.pagination.nextPage}
          >
            <svg
              width="24"
              height="24"
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
          </Link>
        </div>
      </section>

      {/* 4. Newsletter */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl text-black mb-10 max-w-3xl mx-auto px-16">
            {t.cta.subheading}
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-block relative rounded-3xl px-6 py-3 bg-[#B1873F] text-white font-medium hover:bg-[#9e7736] transition-colors"
          >
            <span className="absolute inset-0 bg-[#a75e24] z-0 rounded-full animate-heath-beat"></span>
            <span className="relative z-10">{t.cta.button}</span>
          </a>
        </div>
      </section>
    </>
  );
}
