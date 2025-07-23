"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { DisplayService, Service } from "@/types/service";
import { htmlToTextAndTruncate } from "@/lib/utils";
import { getLocalizedServiceContent } from "@/utils/services";

const DEFAULT_SERVICE_IMAGE = "/images/default_image_ai.png";
const SERVICES_PER_PAGE = 8;

function LoadingSkeleton() {
  return (
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
  );
}

export default function ServicesContentClient({ locale, t }: { locale: string; t: any }) {
  const [services, setServices] = useState<DisplayService[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // Reset on locale change
  useEffect(() => {
    setServices([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [locale]);

  // Initial fetch and fetch on page/locale change
  useEffect(() => {
    let ignore = false;
    const fetchServices = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await fetch(`/api/services?page=${page}&limit=${SERVICES_PER_PAGE}&status=PUBLISHED`);
      const data = res.ok ? await res.json() : { services: [], meta: { total: 0 } };
      if (ignore) return;
      setTotalServices(data.meta?.total || 0);
      const newServices = (data.services || []).map((service: Service) => getLocalizedServiceContent(service, locale));
      setServices(prev => page === 1 ? newServices : [...prev, ...newServices]);
      setHasMore((data.services?.length || 0) === SERVICES_PER_PAGE);
      setLoading(false);
      setLoadingMore(false);
    };
    fetchServices();
    return () => { ignore = true; };
  }, [page, locale]);

  // IntersectionObserver for lazy loading
  const lastServiceRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
    lastItemRef.current = node;
  }, [loadingMore, loading, hasMore]);

  if (loading && page === 1) return <LoadingSkeleton />;

  if (services.length === 0) {
    return (
      <section className="bg-[#FEF6EA] py-14 md:py-16 text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl text-gray-600 mb-4">{t.emptyState?.title || "No services found."}</h2>
          <p className="text-gray-500">{t.emptyState?.description || "Please check back later."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FEF6EA] py-14 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {services.map((service, idx) => {
          const isLast = idx === services.length - 1;
          return (
            <div
              key={service.id}
              className="mb-10 last:mb-0"
              ref={isLast ? lastServiceRef : undefined}
            >
              <Link
                href={`/services/${service.id}`}
                className="group mt-2 md:mt-0"
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                    <div className="h-52 aspect-270/200 relative rounded-2xl overflow-hidden">
                      <Image
                        src={service.image || DEFAULT_SERVICE_IMAGE}
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
                          {t.viewDetails}
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
                        {htmlToTextAndTruncate(service?.description|| "", 200)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        {loadingMore && <LoadingSkeleton />}
      </div>
    </section>
  );
}
