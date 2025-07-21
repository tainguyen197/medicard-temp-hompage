import { Service } from "@/types/service";
import { z } from "zod";

export const getLocalizedServiceContent = (service: Service, locale: string) => {
  return {
    id: service.slug || service.id,
    title: locale === "en" ? service.titleEn || service.title : service.title || service.titleEn,
    description: locale === "en" ? service.descriptionEn || service.description : service.description || service.descriptionEn,
    shortDescription: locale === "en" ? service.shortDescriptionEn || service.shortDescription : service.shortDescription || service.shortDescriptionEn,
    image: locale === "en" ? service.featureImageEn?.url || service.featureImage?.url : service.featureImage?.url || service.featureImageEn?.url || "/images/default_image_ai.png",
    details: locale === "en" ? service.enKeywords || service.keywords : service.keywords || service.enKeywords,
    link: `/services/${service.slug || service.id}`,
  };
};


export const serviceFormSchema = z.object({
    title: z.string().min(1, "Service title is required"),
    titleEn: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    showOnHomepage: z.boolean(),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    descriptionEn: z.string().optional(),
    shortDescription: z.string().min(1, "Short description is required"),
    shortDescriptionEn: z.string().optional(),
    keywords: z.string().min(1, "Keywords are required"),
    enKeywords: z.string().optional(),
    metaTitle: z.string().min(1, "Meta title is required"),
    metaTitleEn: z.string().optional(),
    metaDescription: z.string().min(1, "Meta description is required"),
    metaDescriptionEn: z.string().optional(),
    metaKeywords: z.string().min(1, "Meta keywords are required"),
    metaKeywordsEn: z.string().optional(),
    featuredImage: z.string().min(1, "Featured image is required"),
    featureImageId: z.string().min(1, "Feature image ID is required"),
    featuredImageEn: z.string().optional(),
    featureImageEnId: z.string().optional(),
  });