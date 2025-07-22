import { News } from "@/types/post";
import { z } from "zod";

export const getLocalizedNews = (news: News, locale: string) => {
  return {
    title: locale === "en"? news.titleEn || news.title : news.title || news.titleEn,
    description: locale === "en" ? news.descriptionEn || news.description : news.description || news.descriptionEn,
    image: (locale === "en" ? news.featureImageEn?.url || news.featureImage?.url : news.featureImage?.url || news.featureImageEn?.url) || DEFAULT_NEWS_IMAGE,
    slug: news.slug,
    id: news.id,
    shortDescription: locale === "en" ? news.shortDescriptionEn || news.shortDescription : news.shortDescription || news.shortDescriptionEn,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
    category: locale === "en" && news?.categoryEn ? news.categoryEn : news.category,
    categoryId:
      locale === "en" && news?.categoryEnId ? news.categoryEnId : news.categoryId,
  };
};


// Schema for news creation/update
export const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  status: z.string().optional().default("DRAFT"),
  showOnHomepage: z.boolean().optional().default(false),
  pin: z.boolean().optional().default(false),
  categoryId: z.string().optional(),
  categoryEnId: z.string().optional(),
  slug: z.string().optional(),
  featuredImage: z.string().optional(), // Accept the image URL
  featureImageId: z.string().optional(),
  featuredImageEn: z.string().optional(), // Accept the English image URL
  featureImageEnId: z.string().optional(),
  metaTitle: z
    .string()
    .max(65, "Meta title must be 65 characters or less")
    .optional(),
  metaTitleEn: z
    .string()
    .max(65, "Meta title (English) must be 65 characters or less")
    .optional(),
  metaDescription: z
    .string()
    .max(155, "Meta description must be 155 characters or less")
    .optional(),
  metaDescriptionEn: z
    .string()
    .max(155, "Meta description (English) must be 155 characters or less")
    .optional(),
  metaKeywords: z.string().optional(),
  metaKeywordsEn: z.string().optional(),
});

 export const DEFAULT_NEWS_IMAGE = "/images/default_news_ai.jpeg";
