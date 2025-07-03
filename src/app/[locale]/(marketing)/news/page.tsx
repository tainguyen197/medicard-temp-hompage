import Image from "next/image";
import React, { Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { getMessages } from "next-intl/server";
import { NewsDataComponent } from "./NewsContent";
import NewsLoading from "./NewsLoading";
import {
  getBannerByType,
  BANNER_TYPES,
  DEFAULT_HERO_IMAGE,
} from "@/lib/banner-utils";

export const generateStaticParams = async () => {
  return [{ locale: "en" }, { locale: "vi" }];
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const t = messages.news;

  // Fetch news banner
  const newsBannerUrl = await getBannerByType(BANNER_TYPES.NEWS);
  const heroImage = newsBannerUrl || DEFAULT_HERO_IMAGE;

  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="News Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 2. Introduction */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="py-16 text-center">
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-[#B1873F] mb-4">
            {t.title}
          </h1>
        </section>
      </AnimatedSection>

      {/* 3. Data-dependent content wrapped in Suspense */}
      <Suspense fallback={<NewsLoading />}>
        <NewsDataComponent searchParams={searchParams} params={params} />
      </Suspense>
    </div>
  );
}
