import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { getMessages } from "next-intl/server";
import { ServicesDataComponent } from "./ServicesContent";
import {
  getBannerDataByType,
  BANNER_TYPES,
  DEFAULT_HERO_IMAGE,
} from "@/lib/banner-utils";
import { getAppointmentLink } from "@/lib/contact";

export const generateStaticParams = async () => {
  return [{ locale: "en" }, { locale: "vi" }];
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const t = messages.services;

  // Fetch service banner data
  const serviceBanner = await getBannerDataByType(BANNER_TYPES.SERVICE);
  const heroImage = serviceBanner.imageUrl || DEFAULT_HERO_IMAGE;
  
  // Fetch appointment link
  const appointmentLink = await getAppointmentLink();

  const imageElement = (
    <Image
      src={heroImage}
      alt={t.title}
      className="object-cover object-start"
      priority
      fill
    />
  );

  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          {serviceBanner.link ? (
            <Link
              href={serviceBanner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full group"
            >
              {imageElement}
            </Link>
          ) : (
            imageElement
          )}
        </div>
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

      {/* Services Detail Section wrapped in Suspense */}
      <Suspense fallback={<ServicesLoading />}>
        <ServicesDataComponent params={params} />
      </Suspense>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl text-black mb-10 max-w-3xl mx-auto px-16">
            {t.cta.subheading}
          </p>
          <a
            href={appointmentLink}
            target="_blank"
            className="inline-block relative rounded-3xl px-6 py-3 bg-[#B1873F] text-white font-medium hover:bg-[#9e7736] transition-colors"
          >
            <span className="absolute inset-0 bg-[#a75e24] z-0 rounded-full animate-heath-beat"></span>
            <span className="relative z-10">{t.cta.button}</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function ServicesLoading() {
  return (
    <>
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
    </>
  );
}
