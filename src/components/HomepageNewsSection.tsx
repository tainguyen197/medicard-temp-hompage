import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HomepageNews {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  createdAt: string;
  featureImage?: {
    id: string;
    url: string;
  };
  featureImageEn?: {
    id: string;
    url: string;
  };
}

interface HomepageNewsSectionProps {
  news: HomepageNews[];
  locale?: string;
}

export default function HomepageNewsSection({
  news,
  locale = "vi",
}: HomepageNewsSectionProps) {
  if (!news || news.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === "en" ? "Latest News" : "Tin Tức Mới Nhất"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === "en"
              ? "Stay updated with our latest healthcare news and announcements"
              : "Cập nhật những tin tức và thông báo mới nhất về y tế"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((article) => {
            const title =
              locale === "en" && article.titleEn
                ? article.titleEn
                : article.title;
            const description =
              locale === "en" && article.shortDescriptionEn
                ? article.shortDescriptionEn
                : article.shortDescription;
            const image =
              locale === "en" && article.featureImageEn
                ? article.featureImageEn
                : article.featureImage;

            return (
              <Link
                key={article.id}
                href={`/${locale}/news/${article.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        {locale === "en" ? "No image" : "Không có hình ảnh"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    {formatDate(article.createdAt)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {locale === "en" ? "View All News" : "Xem Tất Cả Tin Tức"}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
