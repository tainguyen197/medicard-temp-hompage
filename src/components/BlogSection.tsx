import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { News } from "@/types/post";
import HomepageNewsSection from "./HomepageNewsSection";

interface BlogPostProps {
  image: string;
  title: string;
  description: string;
  slug: string;
  id: string;
}

const BlogPost = ({ image, title, description, slug, id }: BlogPostProps) => (
  <Link
    href={`/news/${slug}`}
    className="group relative rounded-lg overflow-hidden max-w-[330px] mx-auto"
  >
    <div className="bg-white group grid grid-cols-2 gap-4 md:block">
      <div className="relative md:aspect-square max-h-[330px] rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover h-[100px] group-hover:scale-105 transition-transform w-fit md:h-auto aspect-2/1"
        />
      </div>
      <div className="md:pt-6">
        <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-4 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-md line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

const BlogSection = async ({ locale = "vi" }: { locale?: string }) => {
  // Get translations
  const t = await getTranslations({ locale, namespace: "home.news" });
  const tEmpty = await getTranslations({
    locale,
    namespace: "news.emptyState",
  });

  let homepageNews: News[] = [];

  try {
    // Fetch news that are marked for homepage display
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/news/homepage`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (response.ok) {
      const data = await response.json();
      homepageNews = data.news || [];
    }
  } catch (error) {
    console.error("Failed to fetch homepage news:", error);
    homepageNews = [];
  }

  return (
    <section id="news" className="pb-10 md:pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-xl md:text-5xl font-cormorant font-bold text-center text-gray-900 mb-8 md:mb-16 leading-tight">
          {t("title")}
        </h2>

        {homepageNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">
            {homepageNews.map((newsItem) => {
              // Handle localization
              const title = locale === "en" && newsItem.titleEn ? newsItem.titleEn : newsItem.title;
              const description = locale === "en" && newsItem.shortDescriptionEn 
                ? newsItem.shortDescriptionEn 
                : newsItem.shortDescription || (newsItem.description ? `${newsItem.description.substring(0, 150)}...` : '');
              const image = locale === "en" && newsItem.featureImageEn
                ? newsItem.featureImageEn.url
                : newsItem.featureImage?.url || "/images/news/news-image-1.jpg";
                
              return (
                <BlogPost
                  key={newsItem.id}
                  slug={newsItem.slug}
                  id={newsItem.id}
                  image={image}
                  title={title}
                  description={description || ''}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{tEmpty("title")}</p>
          </div>
        )}

        <div className="text-center md:text-right md:mt-12">
          <Link
            href="/news"
            className="bg-transparent inline-block md:bg-[#B1873F] hover:md:bg-amber-800 text-black md:text-white font-normal underline md:no-underline md:font-semibold py-3 px-8 rounded-full mt-2 md:mt-0"
          >
            {t("viewMore")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
