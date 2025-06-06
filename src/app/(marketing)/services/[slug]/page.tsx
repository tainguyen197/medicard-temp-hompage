import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface ServiceDetailProps {
  params: {
    slug: string;
  };
}

interface Service {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  shortDescription?: string | null;
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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  let service: Service | null = null;
  const slug = (await params).slug;
  console.log("slug", slug);

  try {
    // Fetch service by slug from database
    service = await prisma.service.findFirst({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
      include: {
        featureImage: true,
      },
    });

    if (!service) {
      notFound();
    }
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
            alt={service.title}
            className="object-cover object-center"
            priority
            fill
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            Dịch vụ
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
          <span className="text-black">{service.title}</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <h1 className="text-3xl md:text-[42px] font-semibold text-[#222222] mb-6 leading-[140%]">
          {service.title.toUpperCase()}
        </h1>
        {service.shortDescription && (
          <h2 className="text-md md:text-[20px] font-semibold text-black">
            {service.shortDescription}
          </h2>
        )}
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Description */}
          {service.description && (
            <div className="mx-auto">
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-base md:text-lg text-gray-800 leading-relaxed space-y-6 [&_p]:mb-6 [&_p]:leading-relaxed [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:text-gray-600 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_img]:mx-auto [&_img]:block [&_img]:rounded-lg [&_img]:shadow-md [&_figure]:text-center [&_figure]:mx-auto [&_figure]:mb-8 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:text-[#222222] [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:text-[#222222] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-tight [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-medium [&_h3]:text-[#222222] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:leading-tight [&_.image-style-side]:float-right [&_.image-style-side]:ml-6 [&_.image-style-side]:mb-4 [&_.image-style-side]:max-w-[50%] [&_.image-style-side]:md:max-w-[40%] [&_.image-style-side_img]:mx-0 [&_.image-style-side_img]:rounded-lg [&_.image]:mb-8 [&_.image]:clear-both [&_strong]:font-semibold [&_strong]:text-[#222222] [&_em]:italic [&_em]:text-gray-700 [&_i]:italic [&_i]:text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B1873F] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-8"
                  dangerouslySetInnerHTML={{
                    __html: service.description.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc
            <br />
            trong hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
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
    const services = await prisma.service.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
      },
    });

    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// Generate metadata for SEO (optional)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  try {
    const service = await prisma.service.findFirst({
      where: {
        slug: (await params).slug,
        status: "PUBLISHED",
      },
    });

    if (!service) {
      return {
        title: "Service Not Found",
      };
    }

    return {
      title: service.title,
      description: service.shortDescription || service.description,
    };
  } catch (error) {
    return {
      title: "Service",
    };
  }
}
