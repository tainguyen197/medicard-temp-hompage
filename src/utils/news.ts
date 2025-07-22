import { News } from "@/types/post";

export const getLocalizedNews = (news: News, locale: string) => {
  return {
    title: locale === "en"? news.titleEn || news.title : news.title || news.titleEn,
    description: locale === "en" ? news.descriptionEn || news.description : news.description || news.descriptionEn,
    image: (locale === "en" ? news.featureImageEn?.url || news.featureImage?.url : news.featureImage?.url || news.featureImageEn?.url) || "/images/default_news_ai.jpeg",
    slug: news.slug,
    id: news.id,
    shortDescription: locale === "en" ? news.shortDescriptionEn || news.shortDescription : news.shortDescription || news.shortDescriptionEn,
  };
};