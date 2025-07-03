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
}

export async function getBannerByType(type: string): Promise<string | null> {
  try {
    const banner = await prisma.banner.findUnique({
      where: {
        type: type,
      },
      include: {
        image: true,
      },
    });

    if (banner && banner.status === "ACTIVE" && banner.image?.url) {
      return banner.image.url;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${type} banner:`, error);
    return null;
  }
}

export const BANNER_TYPES = {
  HOMEPAGE: "HOMEPAGE",
  SERVICE: "SERVICE",
  NEWS: "NEWS",
  ABOUT: "ABOUT",
} as const;

export const DEFAULT_HERO_IMAGE = "/images/hero-section.png";
