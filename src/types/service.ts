export interface Service {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  shortDescription?: string | null;
  shortDescriptionEn?: string | null;
  status: string;
  featureImageId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
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
