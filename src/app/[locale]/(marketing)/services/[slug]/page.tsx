import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import ServiceDetailContent from "./ServiceDetailContent";
import { getAppointmentLink } from "@/lib/contact";

// Force dynamic rendering to avoid DYNAMIC_SERVER_USAGE error
export const dynamic = "force-dynamic";

interface ServiceDetailProps {
  params: Promise<{ slug: string; locale: string }>;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  shortDescription?: string | null;
  shortDescriptionEn?: string | null;
  content?: string | null;
  status: string;
  featureImageId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

interface ContentSection {
  type: "text" | "list";
  title?: string;
  content?: string;
  items?: string[];
  image?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const messages = await getMessages();
  const t = messages.services.notFound;

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services/by-slug/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const service = await response.json();
      const title =
        locale === "en" ? service.titleEn || service.title : service.title;
      const description =
        locale === "en"
          ? service.shortDescriptionEn ||
            service.shortDescription ||
            service.descriptionEn ||
            service.description
          : service.shortDescription || service.description;

      return {
        title: `${title} | Healthcare Therapy Center`,
        description: description ? description.substring(0, 155) : "",
      };
    }
  } catch (error) {
    console.error("Error fetching service for metadata:", error);
  }

  return {
    title: t.title,
    description: t.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug?: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const messages = await getMessages();
  const t = messages.services;
  
  // Fetch appointment link
  const appointmentLink = await getAppointmentLink();

  console.log("slug", slug);

  let service: Service;

  try {
    // Fetch service by slug from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services/by-slug/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      notFound();
    }

    service = await response.json();
  } catch (error) {
    console.error("Failed to fetch service:", error);
    notFound();
  }

  // Parse content sections if available (assuming content is stored as JSON or structured text)
  const parseContentSections = (content: string | null): ContentSection[] => {
    if (!content) return [];

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, split by double line breaks and create simple sections
      return content.split("\n\n").map((section, index) => ({
        type: "text" as const,
        title: index === 0 ? "" : `Section ${index}`,
        content: section.trim(),
      }));
    }
  };

  const contentSections = parseContentSections(service.content || null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src={"/images/hero-section.png"}
            alt="Service"
            className="object-cover object-center"
            priority
            fill
          />
        </div>
      </section>

      {/* Dynamic Content with Suspense */}
      <Suspense fallback={<ServiceDetailLoading appointmentLink={appointmentLink} />}>
        <ServiceDetailContent slug={slug || ""} locale={locale} />
      </Suspense>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            {t.cta.subheading}
          </p>
          <a
            href={appointmentLink}
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            {t.cta.button}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}

async function ServiceDetailLoading({ appointmentLink }: { appointmentLink: string }) {
  const messages = await getMessages();
  const t = messages.services;

  return (
    <>
      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            {t.breadcrumb.services}
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <div className="h-10 md:h-14 bg-gray-200 animate-pulse rounded w-3/4 mb-6"></div>
        <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded w-2/3"></div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
                <div className="h-40 bg-gray-200 animate-pulse rounded w-full my-8"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            {t.cta.subheading}
          </p>
          <a
            href={appointmentLink}
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            {t.cta.button}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services?limit=100&status=PUBLISHED`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      return data.services?.map((service: any) => ({ slug: service.slug })) || [];
    }
  } catch (error) {
    console.error("Failed to generate static params:", error);
  }
  
  return [];
}
