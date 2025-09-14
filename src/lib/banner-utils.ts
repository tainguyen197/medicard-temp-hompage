// Removed direct DB access; expose helpers to call Nest if needed

// NestJS backend URL - update this if your backend runs on a different port
const BACKEND_URL = process.env.BACKEND_API_BASE;

interface BannerImage {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  originalName: string;
  uploadedById?: string;
  createdAt: string;
}

interface Banner {
  id: string;
  type: string;
  link?: string;
  status: string;
  image?: BannerImage;
  imageEn?: BannerImage;
}

interface BannerData {
  imageUrl: string | null;
  link: string | null;
}

export async function getBannerByType(type: string, locale?: string): Promise<string | null> {
  try {
    // Use regular fetch for server-side rendering since this is a public endpoint
    const res = await fetch(`${BACKEND_URL}/banners/public`);
    if (!res.ok) return null;
    const data = await res.json();
    const banners: Banner[] = Array.isArray(data) ? data : (data.banners ?? data.data ?? []);
    const banner = banners.find((b) => b.type === type && b.status === 'ACTIVE');
    if (!banner) return null;
    if (locale === 'en' && banner.imageEn?.url) return banner.imageEn.url;
    if (banner.image?.url) return banner.image.url;
    return null;
  } catch (error) {
    console.error(`Error fetching ${type} banner:`, error);
    return null;
  }
}

export async function getBannerDataByType(type: string, locale?: string): Promise<BannerData> {
  try {
    // Use regular fetch for server-side rendering since this is a public endpoint
    const res = await fetch(`${BACKEND_URL}/banners/public`);

    if (!res.ok) return { imageUrl: null, link: null };
    const data = await res.json();
    const banners: Banner[] = Array.isArray(data) ? data : (data.banners ?? data.data ?? []);
    const banner = banners.find((b) => b.type === type && b.status === 'ACTIVE');
    if (!banner) return { imageUrl: null, link: null };

    let imageUrl: string | null = null;
    if (locale === 'en' && banner.imageEn?.url) {
      imageUrl = banner.imageEn.url;
    } else if (banner.image?.url) {
      imageUrl = banner.image.url;
    }

    return { imageUrl, link: banner.link || null };
  } catch (error) {
    console.error(`Error fetching ${type} banner data:`, error);
    return { imageUrl: null, link: null };
  }
}

export const BANNER_TYPES = {
  HOMEPAGE: "HOMEPAGE",
  SERVICE: "SERVICE",
  NEWS: "NEWS",
  ABOUT: "ABOUT",
  CONTACT: "CONTACT",
} as const;

export const DEFAULT_HERO_IMAGE = "/images/hero-section.png";
