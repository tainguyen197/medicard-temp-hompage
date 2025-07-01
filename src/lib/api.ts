import { PostsResponse } from "@/types/post";
import { ServicesResponse } from "@/types/service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const isDev = process.env.NODE_ENV === "development";

interface FetchNewsParams {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
}

interface FetchServicesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface TeamMember {
  id: string;
  name: string;
  nameEn?: string | null;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  image?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
  imageEn?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

export async function fetchNews(
  params: FetchNewsParams = {}
): Promise<PostsResponse> {
  const {
    page = 1,
    limit = 10,
    status = "PUBLISHED",
    categoryId,
    search,
  } = params;

  console.log("fetchNews called with params:", {
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
  let apiUrl = `${API_BASE_URL}/api/news`;
  if (!apiUrl.startsWith("http")) {
    // In browser context, we need to prepend the origin
    if (typeof window !== "undefined") {
      apiUrl = `${window.location.origin}${apiUrl}`;
    } else {
      // In Node.js context (SSR), we need to handle relative URLs
      // by using the Next.js absolute URL pattern
      apiUrl = `/api/news`;
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
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `API returned ${
        data.news?.length || 0
      } news items, status filter was: "${status}"`
    );
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function fetchNewsItem(slug: string) {
  try {
    // Construct the URL with the same approach as fetchNews
    let apiUrl = `${API_BASE_URL}/api/news/by-slug/${slug}`;
    if (!apiUrl.startsWith("http")) {
      // In browser context, we need to prepend the origin
      if (typeof window !== "undefined") {
        apiUrl = `${window.location.origin}${apiUrl}`;
      } else {
        // In Node.js context (SSR), we need to handle relative URLs
        apiUrl = `/api/news/by-slug/${slug}`;
      }
    }

    // Add cache-busting parameter in development
    if (isDev) {
      apiUrl = `${apiUrl}?_=${Date.now()}`;
    }

    console.log("Fetching news item from URL:", apiUrl);

    const response = await fetch(apiUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 },
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news item: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news item:", error);
    throw error;
  }
}

// Keep for backward compatibility, but rename internally to use news
export const fetchPosts = fetchNews;
export const fetchPost = fetchNewsItem;

export async function fetchServices(
  params: FetchServicesParams = {}
): Promise<ServicesResponse> {
  const { page = 1, limit = 10, status = "PUBLISHED", search } = params;

  console.log("fetchServices called with params:", {
    page,
    limit,
    status,
    search,
  });

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    searchParams.append("status", status);
  }

  if (search) {
    searchParams.append("search", search);
  }

  // Add cache-busting parameter in development
  if (isDev) {
    searchParams.append("_", Date.now().toString());
  }

  // Construct the full URL properly - prepend with origin if relative
  let apiUrl = `${API_BASE_URL}/api/services`;
  if (!apiUrl.startsWith("http")) {
    // In browser context, we need to prepend the origin
    if (typeof window !== "undefined") {
      apiUrl = `${window.location.origin}${apiUrl}`;
    } else {
      // In Node.js context (SSR), we need to handle relative URLs
      // by using the Next.js absolute URL pattern
      apiUrl = `/api/services`;
    }
  }

  const fullUrl = `${apiUrl}?${searchParams.toString()}`;
  console.log("Fetching services from URL:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 }, // No cache in dev, 5 minutes in prod
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `API returned ${
        data.services?.length || 0
      } services, status filter was: "${status}"`
    );
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export async function fetchService(slug: string) {
  try {
    // Construct the URL with the same approach as fetchServices
    let apiUrl = `${API_BASE_URL}/api/services/${slug}`;
    if (!apiUrl.startsWith("http")) {
      // In browser context, we need to prepend the origin
      if (typeof window !== "undefined") {
        apiUrl = `${window.location.origin}${apiUrl}`;
      } else {
        // In Node.js context (SSR), we need to handle relative URLs
        apiUrl = `/api/services/${slug}`;
      }
    }

    // Add cache-busting parameter in development
    if (isDev) {
      apiUrl = `${apiUrl}?_=${Date.now()}`;
    }

    console.log("Fetching service from URL:", apiUrl);

    const response = await fetch(apiUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 },
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  console.log("fetchTeamMembers called");

  // Add cache-busting parameter in development
  const searchParams = new URLSearchParams();
  if (isDev) {
    searchParams.append("_", Date.now().toString());
  }

  // Construct the full URL properly - prepend with origin if relative
  let apiUrl = `${API_BASE_URL}/api/team`;
  if (!apiUrl.startsWith("http")) {
    // In browser context, we need to prepend the origin
    if (typeof window !== "undefined") {
      apiUrl = `${window.location.origin}${apiUrl}`;
    } else {
      // In Node.js context (SSR), we need to handle relative URLs
      apiUrl = `/api/team`;
    }
  }

  const fullUrl = searchParams.toString()
    ? `${apiUrl}?${searchParams.toString()}`
    : apiUrl;

  console.log("Fetching team members from URL:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      next: isDev ? { revalidate: 0 } : { revalidate: 300 }, // No cache in dev, 5 minutes in prod
      cache: isDev ? "no-store" : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API returned ${data?.length || 0} team members`);
    return data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
}
