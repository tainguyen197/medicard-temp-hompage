import prisma from "@/lib/prisma";

interface BannerImage {
  id: string;
  url: string;
  filename: string;
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
    const banner = await prisma.banner.findUnique({
      where: {
        type: type,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    if (banner && banner.status === "ACTIVE") {
      // Return English image if locale is 'en' and English image exists
      if (locale === "en" && banner.imageEn?.url) {
        return banner.imageEn.url;
      }
      
      // Fall back to Vietnamese image (main image)
      if (banner.image?.url) {
        return banner.image.url;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${type} banner:`, error);
    return null;
  }
}

export async function getBannerDataByType(type: string, locale?: string): Promise<BannerData> {
  try {
    const banner = await prisma.banner.findUnique({
      where: {
        type: type,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    if (banner && banner.status === "ACTIVE") {
      // Determine which image to use based on locale
      let imageUrl: string | null = null;
      
      if (locale === "en" && banner.imageEn?.url) {
        imageUrl = banner.imageEn.url;
      } else if (banner.image?.url) {
        imageUrl = banner.image.url;
      }

      return {
        imageUrl,
        link: banner.link || null,
      };
    }

    return {
      imageUrl: null,
      link: null,
    };
  } catch (error) {
    console.error(`Error fetching ${type} banner data:`, error);
    return {
      imageUrl: null,
      link: null,
    };
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
