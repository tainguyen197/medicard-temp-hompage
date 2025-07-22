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
  description: z.string().min(1, "Content is required"),
  descriptionEn: z.string().optional().nullable(),
  shortDescription: z.string().min(1, "Short description is required"),
  shortDescriptionEn: z.string().optional(),
  status: z.string().optional().default("DRAFT"),
  showOnHomepage: z.boolean().optional().default(false),
  pin: z.boolean().optional().default(false),
  categoryId: z.string().min(1, "Category is required"),
  categoryEnId: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required"),
  featuredImage: z.string().min(1, "Image is required"), // Accept the image URL
  featureImageId: z.string(),
  featuredImageEn: z.string().optional().nullable(), // Accept the English image URL
  featureImageEnId: z.string().optional().nullable(),
  metaTitle: z
    .string()
    .max(65, "Meta title must be 65 characters or less")
    .min(1, "Meta title is required"),
  metaTitleEn: z
    .string()
    .max(65, "Meta title (English) must be 65 characters or less")
    .optional().nullable(),
  metaDescription: z
    .string()
    .max(155, "Meta description must be 155 characters or less")
    .min(1, "Meta description is required"),
  metaDescriptionEn: z
    .string()
    .max(155, "Meta description (English) must be 155 characters or less")
    .optional().nullable(),
  metaKeywords: z.string().min(1, "Meta keywords is required"),
  metaKeywordsEn: z.string().optional().nullable(),
});

 export const DEFAULT_NEWS_IMAGE = "/images/default_news_ai.jpeg";
