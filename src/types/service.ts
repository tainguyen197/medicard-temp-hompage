export interface Service {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  shortDescription?: string | null;
  shortDescriptionEn?: string | null;
  keywords?: string | null;
  enKeywords?: string | null;
  status: string;
  featureImageId?: string | null;
  featureImageEnId?: string | null;
  metaTitle?: string | null;
  metaTitleEn?: string | null;
  metaDescription?: string | null;
  metaDescriptionEn?: string | null;
  metaKeywords?: string | null;
  metaKeywordsEn?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
  featureImageEn?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
  showOnHomepage?: boolean;
}

export interface ServicesResponse {
  services: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
