import Image from "next/image";
import Link from "next/link";
import {
  BANNER_TYPES,
  DEFAULT_HERO_IMAGE,
  getBannerDataByType,
} from "@/lib/banner-utils";
import { getLocale } from "next-intl/server";

interface HeroSectionProps {
  altText?: string;
}

const HeroSection = async ({ altText = "Hero Banner" }: HeroSectionProps) => {
  const locale = await getLocale();
  const homepageBanner = await getBannerDataByType(
    BANNER_TYPES.HOMEPAGE,
    locale
  );
  const { imageUrl, link } = homepageBanner;
  const heroImage = imageUrl || DEFAULT_HERO_IMAGE;

  const imageElement = (
    <Image
      src={heroImage}
      alt={altText}
      fill
      className="object-cover"
      priority
    />
  );

  return (
    <section className="relative w-full h-full aspect-[21/9]">
      <div className="absolute inset-0">
        {link ? (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full group"
          >
            {imageElement}
          </Link>
        ) : (
          imageElement
        )}
      </div>
    </section>
  );
};

export const HeroSectionSkeleton = () => {
  return (
    <section className="relative w-full h-full aspect-[21/9]">
      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
