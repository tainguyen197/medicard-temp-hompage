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
  featured: boolean;
  status: string;
  publishedAt?: string | null;
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
