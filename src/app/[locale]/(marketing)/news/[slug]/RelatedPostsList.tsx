import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Default image fallback if no featured image
const DEFAULT_IMAGE = "/images/news/news-image-1.jpg";

// Helper function to get localized content
const getLocalizedContent = (news: any, locale: string) => {
  const isEnglish = locale === "en";
  return {
    title: isEnglish ? news.titleEn || news.title : news.title,
    shortDescription: isEnglish
      ? news.shortDescriptionEn || news.shortDescription
      : news.shortDescription,
  };
};

// Helper function to get localized image
const getLocalizedImage = (news: any, locale: string) => {
  const isEnglish = locale === "en";
  return isEnglish && news.featureImageEn
    ? news.featureImageEn
    : news.featureImage;
};

interface RelatedPostsListProps {
  categoryId: string;
  currentNewsId: string;
  locale: string;
}

export default async function RelatedPostsList({
  categoryId,
  currentNewsId,
  locale,
}: RelatedPostsListProps) {
  const t = await getTranslations({ locale, namespace: "newsDetail" });

  let relatedNews: any[] = [];
  let error: string | null = null;

  if (categoryId) {
    try {
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/news/related?categoryId=${categoryId}&currentNewsId=${currentNewsId}&limit=3&locale=${locale}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          next: { revalidate: 0 },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch related news");
      }

      const data = await response.json();
      relatedNews = data.news;
    } catch (err) {
      console.error("Error fetching related news:", err);
      error = "Failed to load related posts";
    }
  }

  if (error) {
    return (
      <div className="text-center text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  if (relatedNews.length === 0) {
    return (
      <div className="text-gray-500">
        <p>{t("relatedPosts.comingSoon") || "No related posts found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {relatedNews.slice(0, 3).map((news) => {
        const localizedContent = getLocalizedContent(news, locale);
        const localizedImage = getLocalizedImage(news, locale);

        return (
          <Link
            key={news.id}
            href={`/news/${news.slug}`}
            className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200"
          >
            {/* Image */}
            <div className="rounded-lg overflow-hidden">
              <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44">
                <Image
                  src={localizedImage?.url || DEFAULT_IMAGE}
                  alt={localizedContent.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <div className="md:w-3/4 my-auto">
              <h3 className="text-md md:text-[20px] font-medium text-[#222222] hover:text-[#B1873F] transition-colors">
                {localizedContent.title}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
