"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
