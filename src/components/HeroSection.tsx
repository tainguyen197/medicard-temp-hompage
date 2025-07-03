import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_HERO_IMAGE } from "@/lib/banner-utils";

interface HeroSectionProps {
  imageUrl?: string | null;
  link?: string | null;
  altText?: string;
}

const HeroSection = ({
  imageUrl,
  link,
  altText = "Hero Banner",
}: HeroSectionProps) => {
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
    <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
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

export default HeroSection;
