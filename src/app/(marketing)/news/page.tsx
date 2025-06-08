import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React, { Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import NewsContent from "./NewsContent";

export const metadata: Metadata = {
  title: "Tin tức sức khoẻ | Healthcare Therapy Center",
  description:
    "Cập nhật những kiến thức hữu ích về sức khoẻ, phương pháp điều trị và lối sống lành mạnh từ Healthcare Therapy Center.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
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
            TIN TỨC
          </h1>
        </section>
      </AnimatedSection>

      {/* Content Section with Suspense */}
      <Suspense fallback={<NewsLoading />}>
        <NewsContent searchParams={searchParams} />
      </Suspense>

      {/* 4. Newsletter */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <Link
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold hover:bg-[#c09857] transition-colors"
          >
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function NewsLoading() {
  return (
    <div className="">
      {/* Trending Topics Skeleton */}
      <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Featured post skeleton */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden block h-full">
              <div className="aspect-auto h-full relative bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Grid of smaller posts skeleton */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Post Listing Skeleton */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <article key={i}>
            <div className="relative flex flex-col md:flex-row items-center mb-4 md:mb-12 group justify-between">
              <div className="pr-8 flex flex-col w-full">
                <div className="h-8 bg-gray-200 animate-pulse mb-4 w-3/4"></div>
                <div className="h-20 bg-gray-200 animate-pulse mb-4"></div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination Skeleton */}
      <section className="container mx-auto px-4 mb-12 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <div className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold">
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
