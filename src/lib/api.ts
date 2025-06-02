import { PostsResponse } from "@/types/post";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const isDev = process.env.NODE_ENV === "development";

interface FetchPostsParams {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
}

export async function fetchPosts(
  params: FetchPostsParams = {}
): Promise<PostsResponse> {
  const {
    page = 1,
    limit = 10,
    status = "PUBLISHED",
    categoryId,
    search,
  } = params;

  console.log("fetchPosts called with params:", {
    page,
    limit,
    status,
    categoryId,
    search,
  });

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status,
  });

  if (categoryId) {
    searchParams.append("categoryId", categoryId);
  }

  if (search) {
    searchParams.append("search", search);
  }

  // Add cache-busting parameter in development
  if (isDev) {
    searchParams.append("_", Date.now().toString());
  }

  // Construct the full URL properly - prepend with origin if relative
  let apiUrl = `${API_BASE_URL}/api/posts`;
  if (!apiUrl.startsWith("http")) {
    // In browser context, we need to prepend the origin
    if (typeof window !== "undefined") {
      apiUrl = `${window.location.origin}${apiUrl}`;
    } else {
      // In Node.js context (SSR), we need to handle relative URLs
      // by using the Next.js absolute URL pattern
      apiUrl = `/api/posts`;
    }
  }

  const fullUrl = `${apiUrl}?${searchParams.toString()}`;
  console.log("Fetching from URL:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 }, // No cache in dev, 5 minutes in prod
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `API returned ${
        data.posts?.length || 0
      } posts, status filter was: "${status}"`
    );
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function fetchPost(slug: string) {
  try {
    // Construct the URL with the same approach as fetchPosts
    let apiUrl = `${API_BASE_URL}/api/posts/${slug}`;
    if (!apiUrl.startsWith("http")) {
      // In browser context, we need to prepend the origin
      if (typeof window !== "undefined") {
        apiUrl = `${window.location.origin}${apiUrl}`;
      } else {
        // In Node.js context (SSR), we need to handle relative URLs
        apiUrl = `/api/posts/${slug}`;
      }
    }

    // Add cache-busting parameter in development
    if (isDev) {
      apiUrl = `${apiUrl}?_=${Date.now()}`;
    }

    console.log("Fetching post from URL:", apiUrl);

    const response = await fetch(apiUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 },
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}
