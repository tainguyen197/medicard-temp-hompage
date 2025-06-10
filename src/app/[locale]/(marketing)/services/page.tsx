import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import prisma from "@/lib/prisma";
import { getMessages } from "next-intl/server";
import ServicesContent from "./ServicesContent";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.services.metadata;

  return {
    title: t.title,
    description: t.description,
  };
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

// Helper function to get localized content
const getLocalizedServiceContent = (service: any, locale: string) => {
  const isEnglish = locale === "en";
  return {
    title: isEnglish ? service.titleEn || service.title : service.title,
    description: isEnglish
      ? service.descriptionEn || service.description
      : service.description,
    shortDescription: isEnglish
      ? service.shortDescriptionEn || service.shortDescription
      : service.shortDescription,
  };
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const t = messages.services;
  const { locale } = await params;

  let services: Service[] = [];

  try {
    // Fetch services directly from the database with Prisma (like posts page does)
    console.log("Fetching services from database...");

    // Get services (only show published services for public page) - now including translation fields
    const servicesData = await prisma.service.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        titleEn: true,
        shortDescription: true,
        shortDescriptionEn: true,
        description: true,
        descriptionEn: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        featureImage: {
          select: {
            id: true,
            url: true,
            fileName: true,
            originalName: true,
          },
        },
      },
    });

    // Convert Prisma results to Service type with localized content
    services = servicesData.map((service: any) => {
      const localizedContent = getLocalizedServiceContent(service, locale);
      return {
        ...service,
        title: localizedContent.title,
        description: localizedContent.description,
        shortDescription: localizedContent.shortDescription,
      };
    }) as Service[];

    console.log(`Found ${services.length} published services`);

    if (services.length > 0) {
      console.log("First service title:", services[0]?.title);
      console.log("First service status:", services[0]?.status);
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
    services = [];
  }

  // Map services to the format expected by the UI
  const displayServices =
    services.length > 0
      ? services.map((service) => ({
          id: service.slug || service.id, // Use slug for URL, fallback to id
          title: service.title,
          shortDescription: service.shortDescription || "",
          image: service.featureImage?.url || "/images/service_1.png", // Fallback to existing service image
        }))
      : [
          // Fallback to hardcoded data if no services from database
          {
            id: "ortho",
            title: t.individual.traditionalMedicine.title,
            shortDescription:
              t.individual.traditionalMedicine.subtitle +
              ": " +
              t.individual.traditionalMedicine.intro2.substring(0, 200) +
              "...",
            image: "/images/service_1.png",
          },
          {
            id: "rehab",
            title: t.individual.physicalTherapy.title,
            shortDescription:
              t.individual.physicalTherapy.subtitle +
              ". " +
              t.individual.physicalTherapy.intro2.substring(0, 150) +
              "...",
            image: "/images/service_2.png",
          },
          {
            id: "func",
            title: t.individual.functionalRehabilitation.title,
            shortDescription:
              t.individual.functionalRehabilitation.treatment.spineDisorders +
              "; " +
              t.individual.functionalRehabilitation.treatment.jointDisorders.substring(
                0,
                100
              ) +
              "...",
            image: "/images/service_3.png",
          },
          {
            id: "transport",
            title: t.individual.transport.title,
            shortDescription: t.individual.transport.subtitle,
            image: "/images/service_4.png",
          },
        ];

  console.log(
    `Using ${
      services.length > 0 ? "database" : "fallback"
    } services for display`
  );

  return (
    <div className="pt-[72px] md:pt-[96px]">
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src="/images/hero-section.png"
          alt={t.title}
          className="object-cover object-start"
          priority
          fill
        />
      </section>
      {/* Introduction Section */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="container mx-auto px-4 pt-10 md:pt-16 pb-12 md:pb-20">
          <h1 className="text-3xl md:text-5xl font-bold text-[#B1873F] font-cormorant text-center mb-8">
            {t.title}
          </h1>
          <p className="text-gray-700 max-w-5xl mx-auto text-lg md:text-xl font-semibold text-justify mb-8">
            {t.intro.description}
          </p>
        </section>
      </AnimatedSection>
      {/* Services Detail Section */}
      <Suspense fallback={<ServicesLoading />}>
        <ServicesContent
          services={displayServices}
          viewDetailsText={t.viewDetails}
        />
      </Suspense>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            {t.cta.subheading}
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            {t.cta.button}
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
          </a>
        </div>
      </section>
    </div>
  );
}

function ServicesLoading() {
  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* Services Detail Section Skeleton */}
      <section className="bg-[#FEF6EA] py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="mb-10 last:mb-0">
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                  <div className="h-52 aspect-270/200 bg-gray-200 animate-pulse rounded-2xl"></div>
                  <div className="md:w-2/3 p-6 md:p-0">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      <div className="h-8 w-60 bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-28 bg-gray-200 animate-pulse mt-2 md:mt-0"></div>
                    </div>
                    <div className="h-24 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 bg-gray-200 animate-pulse max-w-2xl mx-auto mb-6"></div>
          <div className="h-16 bg-gray-200 animate-pulse max-w-3xl mx-auto mb-8"></div>
          <div className="h-12 w-48 bg-gray-200 animate-pulse mx-auto"></div>
        </div>
      </section>
    </div>
  );
}
