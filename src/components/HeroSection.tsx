import React from "react";
import Image from "next/image";
import { DEFAULT_HERO_IMAGE } from "@/lib/banner-utils";

interface HeroSectionProps {
  imageUrl?: string | null;
  altText?: string;
}

const HeroSection = ({
  imageUrl,
  altText = "Hero Banner",
}: HeroSectionProps) => {
  const heroImage = imageUrl || DEFAULT_HERO_IMAGE;

  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={altText}
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default HeroSection;
