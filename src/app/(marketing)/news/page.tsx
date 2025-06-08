import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React, { Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import NewsLoading from "./loading";
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
