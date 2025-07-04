import React from "react";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { getMessages } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getContactData, fallbackContactData } from "@/lib/contact";

export const generateStaticParams = async () => {
  return [{ locale: "en" }, { locale: "vi" }];
};

export const revalidate = 300; // Revalidate every 5 minutes

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;
  const messages = await getMessages();
  const t = messages.contact;

  // Fetch contact data from database
  const contactData = await getContactData();

  // Use database data if available, otherwise fall back to hardcoded values
  const contact = {
    phone: contactData?.phone || fallbackContactData.phone || "0901 430 077",
    address:
      locale === "en"
        ? contactData?.addressEn ||
          contactData?.address ||
          fallbackContactData.addressEn ||
          fallbackContactData.address
        : contactData?.address || fallbackContactData.address,
    businessHours:
      locale === "en"
        ? contactData?.businessHoursEn ||
          contactData?.businessHours ||
          fallbackContactData.businessHoursEn ||
          fallbackContactData.businessHours
        : contactData?.businessHours || fallbackContactData.businessHours,
  };

  // Format business hours for display (handle both \n and <br/> tags)
  const formatBusinessHours = (hours: string) => {
    if (!hours) return null;

    const lines = hours
      .replace(/<br\s*\/?>/gi, "\n") // Convert <br/> tags to \n
      .split("\n")
      .filter((line) => line.trim() !== ""); // Remove empty lines

    return lines.map((line, index) => (
      <p key={index} className="text-[#000]">
        {line.trim()}
      </p>
    ));
  };

  return (
    <div className="pt-20">
      {/* Main Contact Section */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left side - Image with overlay text */}
              <div className="md:w-1/2">
                <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/contact-us.jpg"
                    alt="Healthcare Therapy Center"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right side - Contact Information */}
              <div className="md:w-1/2">
                <h1 className="font-cormorant font-bold text-3xl md:text-5xl text-[#B1873F] mb-8 leading-tight">
                  {t.title}
                </h1>

                {/* Address */}
                <div className="mb-8">
                  <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                    {t.address.title}
                  </h2>
                  <p className="text-[#000]">{contact.address}</p>
                </div>

                {/* Business Hours */}
                <div className="mb-8">
                  <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                    {t.businessHours.title}
                  </h2>
                  {contact.businessHours &&
                    formatBusinessHours(contact.businessHours)}
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                    {t.contactInfo.title}
                  </h2>
                  <p className="text-[#000] mb-2">
                    <span className="font-medium">{t.contactInfo.phone}</span>{" "}
                    <a href={`tel:${contact.phone}`} className="underline">
                      {contact.phone}
                    </a>
                  </p>
                  <p className="text-[#000]">
                    <span className="font-medium">{t.contactInfo.email}</span>{" "}
                    healthcaretherapycenter.89@gmail.com
                  </p>
                </div>

                {/* Appointment Button */}
                <div className="mt-12">
                  <a
                    href="https://forms.gle/GJETkvXcnZ7hZwBr8"
                    target="_blank"
                    className="inline-flex items-center justify-center bg-[#B1873F] text-white py-3 px-8 rounded-md hover:bg-[#9e7738] transition-colors duration-300"
                  >
                    {t.appointmentButton}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
