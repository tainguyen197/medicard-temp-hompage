import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMessages } from "next-intl/server";
import prisma from "@/lib/prisma";

interface DisplayService {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
}

interface ServicesContentProps {
  services: DisplayService[];
  viewDetailsText: string;
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

export default function ServicesContent({
  services,
  viewDetailsText,
}: ServicesContentProps) {
  return (
    <section className="bg-[#FEF6EA] py-14 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {services.map((service) => (
          <div key={service.id} className="mb-10 last:mb-0">
            <Link
              href={`/services/${service.id}`}
              className="group mt-2 md:mt-0"
            >
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                  <div className="h-52 aspect-270/200 relative rounded-2xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full"
                      fill
                    />
                  </div>
                  <div className="md:w-2/3 p-6 md:p-0">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      <h3 className="text-xl md:text-4xl font-medium text-[#222222] font-cormorant group-hover:text-[#B1873F]">
                        {service.title}
                      </h3>

                      <button className="bg-[#B1873F0D] cursor-pointer border border-[#B1873F] py-1.5 px-5 rounded-full text-[#B1873F] text-sm font-medium flex items-center hover:bg-[rgba(177,135,63,0.1)] transition-all whitespace-nowrap">
                        {viewDetailsText}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-md md:text-lg text-[#909090] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// Extract data fetching into a separate component
export async function ServicesDataComponent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.services;

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
    <ServicesContent
      services={displayServices}
      viewDetailsText={t.viewDetails}
    />
  );
}
