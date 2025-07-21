import { Service } from "@/types/service";

export const getLocalizedServiceContent = (service: Service, locale: string) => {
  return {
    title: locale === "en" ? service.titleEn || service.title : service.title || service.titleEn,
    description: locale === "en" ? service.descriptionEn || service.description : service.description || service.descriptionEn,
    shortDescription: locale === "en" ? service.shortDescriptionEn || service.shortDescription : service.shortDescription || service.shortDescriptionEn,
    image: locale === "en" ? service.featureImageEn?.url : service.featureImage?.url || service.featureImageEn?.url,
  };
};