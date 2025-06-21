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

export interface PostsResponse {
  posts: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
