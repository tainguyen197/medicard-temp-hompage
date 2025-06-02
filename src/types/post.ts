export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
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
