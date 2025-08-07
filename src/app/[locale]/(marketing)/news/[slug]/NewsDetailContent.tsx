import Image from "next/image";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import RelatedPostsList from "./RelatedPostsList";
import { getLocalizedNews } from "@/utils";

export default async function NewsDetailContent({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "newsDetail" });

  try {
    const response = await fetch(`/api/news/by-slug/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`News not found: ${slug}`);
      notFound();
    }

    const news = await response.json();
    const localizedContent = getLocalizedNews(news, locale);

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="inline md:flex items-center space-x-2">
            <Link
              href="/news"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
            >
              {t("breadcrumb.news")}
            </Link>
            <svg
              className="inline md:block"
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
            <span className="text-gray-900 text-sm md:text-base">
              {localizedContent.title}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {localizedContent.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm md:text-base mb-8">
            <span>{formatDate(localizedContent.createdAt)}</span>
            {localizedContent.category && (
              <>
                <span className="mx-2">•</span>
                <span>{localizedContent.category.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 mb-16 max-w-7xl">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              {localizedContent.description && (
                <div
                  className="text-base md:text-lg leading-relaxed space-y-6 [&_p]:mb-6 [&_p]:leading-relaxed [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_img]:mx-auto [&_img]:block [&_img]:rounded-lg [&_img]:shadow-md [&_figure]:text-center [&_figure]:mx-auto [&_figure]:mb-8 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-tight [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:leading-tight"
                  dangerouslySetInnerHTML={{
                    __html: localizedContent.description,
                  }}
                />
              )}
            </div>
            <hr className="my-12 border-gray-300" />
          </div>
        </div>

        {/* Related Posts */}
        <div className="container mx-auto md:px-20 md:py-14 bg-[#FEF6EA] rounded-4xl max-w-7xl">
          <div className="mx-auto px-4">
            <h2 className="text-2xl font-semibold text-[#222222] mb-10">
              {t("relatedPosts.title")}
            </h2>
            {localizedContent.categoryId ? (
              <RelatedPostsList
                categoryId={localizedContent.categoryId}
                currentNewsId={news.id}
                locale={locale}
              />
            ) : (
              <div className="text-gray-500">
                {t("relatedPosts.comingSoon") || "No related posts found."}
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Failed to fetch news:", error);
    notFound();
  }
}
