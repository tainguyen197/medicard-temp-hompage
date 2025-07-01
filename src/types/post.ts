export interface Post {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  featuredImage?: string;
  featuredImageId?: string | null;
  featuredImageEnId?: string | null;
  featured: boolean;
  status: string;
  publishedAt?: string | null;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  metaKeywords?: string;
  metaKeywordsEn?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
  categories?: {
    category: {
      id: string;
      name: string;
      slug: string;
      description?: string;
    };
  }[];
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
}

export interface News {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  status: string;
  showOnHomepage: boolean;
  pin: boolean;
  categoryId?: string | null;
  featureImageId?: string | null;
  featureImageEnId?: string | null;
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  metaKeywords?: string;
  metaKeywordsEn?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  } | null;
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
  // UI/helper fields that get added during frontend processing
  featuredImage?: string;
}

export interface PostsResponse {
  posts: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NewsResponse {
  news: News[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
