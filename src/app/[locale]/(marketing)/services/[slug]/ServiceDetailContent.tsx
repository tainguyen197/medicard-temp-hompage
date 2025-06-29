import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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

export default async function ServiceDetailContent({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  console.log("slug", slug);

  const t = await getTranslations({
    locale,
    namespace: "services.breadcrumb",
  });

  let service: Service;

  try {
    // Fetch service by slug from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services/by-slug/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.log(`Service not found: ${slug}`);
      notFound();
    }

    service = await response.json();
  } catch (error) {
    console.error("Failed to fetch service:", error);
    notFound();
  }

  // Get localized content
  const title =
    locale === "en" ? service.titleEn || service.title : service.title;
  const description =
    locale === "en"
      ? service.descriptionEn || service.description
      : service.description;
  const shortDescription =
    locale === "en"
      ? service.shortDescriptionEn || service.shortDescription
      : service.shortDescription;

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
      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            {t("services") || "Dịch vụ"}
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
          <span className="text-black">{title}</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <h1 className="text-3xl md:text-[42px] font-semibold text-[#222222] mb-6 leading-[140%]">
          {title.toUpperCase()}
        </h1>
        {shortDescription && (
          <h2 className="text-md md:text-[20px] font-semibold text-black">
            {shortDescription}
          </h2>
        )}
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Description */}
          {description && (
            <div className="mx-auto">
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-base md:text-lg text-gray-800 leading-relaxed space-y-6 [&_p]:mb-6 [&_p]:leading-relaxed [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:text-gray-600 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_img]:mx-auto [&_img]:block [&_img]:rounded-lg [&_img]:shadow-md [&_figure]:text-center [&_figure]:mx-auto [&_figure]:mb-8 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:text-[#222222] [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:text-[#222222] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-tight [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-medium [&_h3]:text-[#222222] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:leading-tight [&_.image-style-side]:float-right [&_.image-style-side]:ml-6 [&_.image-style-side]:mb-4 [&_.image-style-side]:max-w-[50%] [&_.image-style-side]:md:max-w-[40%] [&_.image-style-side_img]:mx-0 [&_.image-style-side_img]:rounded-lg [&_.image]:mb-8 [&_.image]:clear-both [&_strong]:font-semibold [&_strong]:text-[#222222] [&_em]:italic [&_em]:text-gray-700 [&_i]:italic [&_i]:text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B1873F] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-8"
                  dangerouslySetInnerHTML={{
                    __html: description.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
