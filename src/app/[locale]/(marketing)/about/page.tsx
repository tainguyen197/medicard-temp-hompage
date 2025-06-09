import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import AnimatedSection from "@/components/AnimatedSection";
import ServicesDetailSection from "@/components/ServicesDetailSection";
import TestimonialSection from "@/components/TestimonialSection";
import ServicesDetailSectionSkeleton from "@/components/ServicesDetailSectionSkeleton";
import TestimonialSectionSkeleton from "@/components/TestimonialSectionSkeleton";

// Mission/Value Item component
const ValueItem = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start mb-8">
    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#79C5E7] flex items-center justify-center mr-4 font-bold text-white">
      {number}
    </div>
    <div>
      <h3 className="font-bold text-md md:text-xl text-[#002447] mb-2">
        {title}
      </h3>
      <p className="text-[#909090] text-justify text-sm md:text-base">
        {description}
      </p>
    </div>
  </div>
);

// Certificate Item component
const CertificateItem = ({
  image,
  title,
}: {
  image: string;
  title: string;
}) => (
  <div className="flex flex-col items-center h-full">
    <div className="relative w-full h-[300px] md:h-[300px] overflow-hidden mb-4">
      <Image
        src={image}
        alt={title}
        fill
        className="object-contain object-top"
      />
    </div>
    <p className="text-center text-sm md:text-xl text-gray-700">{title}</p>
  </div>
);

export default async function AboutPage() {
  const messages = await getMessages();
  const t = messages.about;

  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
            alt={t.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Healthcare Center Introduction Section */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="pt-10 md:pt-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center">
              <h2 className="font-cormorant font-bold text-4xl max-text-[40px] text-[#B1873F] mb-6">
                {t.title}
              </h2>
              <p className="text-gray-700 max-w-5xl mx-auto text-lg md:text-xl font-semibold text-justify mb-8">
                {t.intro.description}
              </p>
              <a
                href="https://forms.gle/GJETkvXcnZ7hZwBr8"
                target="_blank"
                className="inline-block relative rounded-3xl px-6 py-3 bg-[#B1873F] text-white font-medium hover:bg-[#9e7736] transition-colors"
              >
                <span className="absolute inset-0 bg-[#a75e24] z-0 rounded-full animate-heath-beat"></span>
                <span className="relative z-10">{t.appointmentButton}</span>
              </a>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Certificates Section */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="font-cormorant font-bold text-2xl md:text-5xl leading-[140%] text-balance text-[#002447] mb-4">
                {t.certificates.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                <CertificateItem
                  image="/images/certificate_1.jpg"
                  title={t.certificates.items[0]}
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                <CertificateItem
                  image="/images/certificate_2.jpg"
                  title={t.certificates.items[1]}
                />
              </div>
              <div className="col-span-1 md:col-span-1 flex flex-col h-full">
                <CertificateItem
                  image="/images/certificate_3.jpg"
                  title={t.certificates.items[2]}
                />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Detail Section */}
      <Suspense fallback={<ServicesDetailSectionSkeleton />}>
        <ServicesDetailSection t={t} />
      </Suspense>

      {/* Testimonial Section */}
      <Suspense fallback={<TestimonialSectionSkeleton />}>
        <TestimonialSection t={t} />
      </Suspense>

      {/* Newsletter */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl text-black mb-10 max-w-3xl mx-auto px-16">
            {t.cta.subheading}
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
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
