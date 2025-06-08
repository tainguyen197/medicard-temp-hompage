import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ServiceDetailContent from "./ServiceDetailContent";
import ServiceDetailLoading from "./loading";

interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
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
}: ServiceDetailProps) {
  const { slug } = await params;

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
      <Suspense fallback={<ServiceDetailLoading />}>
        <ServiceDetailContent slug={slug} />
      </Suspense>

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
  params: Promise<{ slug: string }>;
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
