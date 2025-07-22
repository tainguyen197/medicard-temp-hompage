import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { getLocalizedNews } from "@/utils";

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
        const localizedContent = getLocalizedNews(news, locale);

        return (
          <Link
            key={news.id}
            href={`/news/${news.slug}`}
            className="grid grid-cols-5 md:flex md:flex-row gap-6 pb-6 border-b border-gray-200"
          >
            {/* Image */}
            <div className="rounded-lg overflow-hidden col-span-2">
              <div className="block relative rounded-xl overflow-hidden aspect-square h-32 md:h-44">
                <Image
                  src={localizedContent.image || ""}
                  alt={localizedContent.title || ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <div className="md:w-3/4 my-auto col-span-3">
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
