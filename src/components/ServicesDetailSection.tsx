"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

interface Service {
  title: string;
  description: string;
}

interface ServicesDetailSectionProps {
  t: {
    ourServices: {
      title: string;
      viewDetails: string;
      exploreMore: string;
      services: Service[];
    };
  };
}

export default function ServicesDetailSection({
  t,
}: ServicesDetailSectionProps) {
  return (
    <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
      <section className="">
        <div className="mb-12 text-center">
          <h2 className="font-cormorant font-bold text-2xl md:text-5xl leading-[140%] text-balance text-[#002447] mb-4">
            {t.ourServices.title}
          </h2>
        </div>
        <div className="container bg-[#FEF6EA] mx-auto px-4 max-w-6xl py-14 md:p-16 rounded-4xl">
          {t.ourServices.services.map((service: any, index: number) => {
            const serviceIds = ["ortho", "rehab", "func"];
            const serviceImages = [
              "/images/service_1.png",
              "/images/service_2.png",
              "/images/service_3.png",
            ];

            return (
              <div key={serviceIds[index]} className="relative mb-10 last:mb-0">
                <Link
                  href={`/services/${serviceIds[index]}`}
                  className="group mt-2 md:mt-0"
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2] cursor-pointer">
                      <div className="h-52 aspect-270/200  relative rounded-2xl overflow-hidden">
                        <Image
                          src={serviceImages[index]}
                          alt={service.title}
                          className="object-cover w-full"
                          fill
                        />
                      </div>
                      <div className="md:w-2/3 p-6 md:p-0 group">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                          <h3 className="text-xl md:text-4xl font-medium text-[#222222] font-cormorant group-hover:text-[#B1873F] transition-all">
                            {service.title}
                          </h3>

                          <button className="bg-[#B1873F0D] cursor-pointer border border-[#B1873F] py-1.5 px-5 rounded-full text-[#B1873F] text-sm font-medium flex items-center group-hover:bg-[rgba(177,135,63,0.1)] transition-all whitespace-nowrap mt-2 md:mt-0">
                            {t.ourServices.viewDetails}
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
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-4 md:p-8 rounded-4xl">
          <div className="text-center">
            <Link
              href="/services"
              className="inline-block relative text-black font-medium hover:text-[#9e7736] transition-colors underline leading-[140%]"
            >
              {t.ourServices.exploreMore}
            </Link>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
