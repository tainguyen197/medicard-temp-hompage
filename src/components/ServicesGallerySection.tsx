"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { fetchServices } from "@/lib/api";
import { Service } from "@/types/service";
import {
  defaultServices,
  getLocalizedService,
  ServiceData,
} from "@/data/services";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  link: string;
}

// Function to get localized content from Service type
const getLocalizedServiceContent = (service: Service, locale: string) => {
  return {
    title: locale === "en" && service.titleEn ? service.titleEn : service.title,
    description:
      locale === "en" && service.descriptionEn
        ? service.descriptionEn
        : service.description,
    shortDescription:
      locale === "en" && service.shortDescriptionEn
        ? service.shortDescriptionEn
        : service.shortDescription,
  };
};

// Convert Service type to ServiceItem for backward compatibility
const convertServiceToServiceItem = (
  service: Service,
  locale: string
): ServiceItem => {
  const localizedContent = getLocalizedServiceContent(service, locale);

  return {
    id: service.slug || service.id,
    title: localizedContent.title || "Service Title",
    description:
      localizedContent.description ||
      localizedContent.shortDescription ||
      "Service description",
    details: localizedContent.shortDescription || "Service details",
    image:
      service.featureImage?.url ||
      service.featureImageEn?.url ||
      "/images/service_1.png",
    link: `/services/${service.slug || service.id}`,
  };
};

interface ServicesGallerySectionProps {
  appointmentLink?: string;
}

const ServicesGallerySection: React.FC<ServicesGallerySectionProps> = ({ appointmentLink }) => {
  const locale = useLocale();
  const t = useTranslations("services.gallery");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert ServiceData to ServiceItem format for backward compatibility
  const convertServiceDataToServiceItem = (
    serviceData: ServiceData
  ): ServiceItem => {
    const localizedService = getLocalizedService(serviceData, locale);
    return {
      id: serviceData.id,
      title: localizedService.title,
      description: localizedService.description,
      details: localizedService.details,
      image: serviceData.image,
      link: serviceData.link,
    };
  };

  // Get fallback services from our data file
  const fallbackServices: ServiceItem[] = []

  // Fetch services from API
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchServices({
          status: "PUBLISHED",
          limit: 10, // Get more services to have options
        });

        if (response.services && response.services.length > 0) {
          // Convert API services to ServiceItem format
          const convertedServices = response.services
            .filter((service) => service.showOnHomepage)
            .map((service) => convertServiceToServiceItem(service, locale));
          setServices(convertedServices);
        } else {
          // Use fallback data if no services found
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );
        // Use fallback data on error
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [locale]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Use fallback services while loading or if no services available
  const displayServices = services.length > 0 ? services : fallbackServices;
  const activeService = displayServices[currentIndex] || fallbackServices[0];

  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup thumbnail refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(
      0,
      displayServices.length
    );
  }, [displayServices.length]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const scrollAmount = 220; // Adjust based on thumbnail width
      thumbnailsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll to active thumbnail when it changes
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const thumbnail = thumbnailRefs.current[currentIndex];

      if (thumbnail) {
        // Calculate the scroll position to center the element
        const thumbnailRect = thumbnail.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const centerPosition =
          thumbnail.offsetLeft -
          container.offsetLeft -
          containerRect.width / 2 +
          thumbnailRect.width / 2;

        container.scrollTo({
          left: centerPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  // Auto-advance service every 6 seconds if autoAdvance is true
  useEffect(() => {
    if (!autoAdvance) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayServices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoAdvance, displayServices.length]);

  // Trigger animation on active service change
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handleServiceClick = (index: number) => {
    setCurrentIndex(index);
    setAutoAdvance(false); // Stop auto-advance when user clicks on a thumbnail
  };

  // Create a ref setting callback that doesn't return anything
  const setThumbnailRef = (index: number) => (el: HTMLDivElement | null) => {
    thumbnailRefs.current[index] = el;
  };

  // Show loading state
  if (loading) {
    return (
      <section id="services" className="py-10 md:py-16 bg-[#182134] text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-[46px] xl:text-[51px] font-cormorant font-semibold text-[#FFF7EB] uppercase relative">
              DỊCH VỤ
            </h2>
          </div>
          <div className="flex justify-center items-center h-[450px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
     <></>
    );
  }

  return (
    <section id="services" className="py-10 md:py-16   bg-[#182134] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-[46px] xl:text-[51px] font-cormorant font-semibold text-[#FFF7EB] uppercase relative">
            {t("title")}
          </h2>
        </div>

        {/* Show error message if there was an error (but still show fallback data) */}
        {error && (
          <div className="mb-4 p-4 bg-amber-600/20 border border-amber-600/50 rounded-lg">
            <p className="text-amber-200 text-sm">
              {error} - Showing default services.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 mb-8 transition-all duration-500 ease-in-out">
          {/* Featured service image and content */}
          <div className="w-full lg:w-1/2">
            <div
              className={`relative rounded-4xl overflow-hidden h-[253px] md:h-[450px] transition-all duration-500 ease-in-out ${
                animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Service description */}
          <div className="w-full lg:w-1/2 flex flex-col justify-end">
            <div>
              <h3 className="font-cormorant text-md md:text-[30px] font-bold mb-2 md:mb-5 text-white line-clamp-1 md:line-clamp-none">
                {activeService.title}
              </h3>
              <p
                className="text-gray-300 mb-4 md:mb-10 text-sm md:text-md leading-relaxed line-clamp-5 md:line-clamp-none  min-h-[7.25rem]"
                dangerouslySetInnerHTML={{
                  __html: activeService.description,
                }}
              />
            </div>
            <div>
              <div className="mb-10">
                <h4 className="text-sm md:text-xl font-medium mb-1 md:mb-3 leading-relaxed">
                  {t("includes")}
                </h4>
                <p className="text-gray-300 text-sm md:text-md font-normal line-clamp-2 md:line-clamp-none min-h-[2.75rem]">
                  {activeService.details}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={activeService.link}
                  className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 bg-[#B1873F] hover:bg-amber-700 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-[16px] h-10 md:h-12"
                >
                  {t("viewDetails")}
                  <svg
                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
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
                </a>
                <a
                  href={appointmentLink || "https://forms.gle/GJETkvXcnZ7hZwBr8"}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 border border-[#B1873F] hover:bg-amber-600/10 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-[16px] h-10 md:h-12"
                >
                  {t("bookAppointment")}
                  <svg
                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
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
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Service thumbnails as horizontal slider */}
        <div className="relative mt-8">
          <div
            ref={thumbnailsRef}
            className="flex overflow-x-auto gap-4 md:gap-12 no-scrollbar"
            style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
          >
            {displayServices.map((service, index) => (
              <div
                key={service.id}
                ref={setThumbnailRef(index)}
                className={`cursor-pointer relative overflow-hidden rounded-3xl min-w-[180px] md:min-w-[265px] flex-shrink-0 transition-all duration-300 ${
                  service.id === activeService.id
                    ? "border-2 border-amber-500"
                    : "opacity-75 hover:opacity-100"
                }`}
                onClick={() => handleServiceClick(index)}
              >
                <div className="relative aspect-[265/185] max-h-[216px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 md:mt-14">
          <a
            href="#"
            className="inline-block border-b border-white/50 hover:border-white transition-colors pb-1 text-white text-sm md:text-lg"
          >
            {t("exploreMore")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesGallerySection;
