import { Service } from "@/types/service";

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