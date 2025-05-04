"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
}

const ServicesGallerySection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: "service1",
      title: "KHÁM CƠ XƯƠNG KHỚP",
      description:
        "Vulputate bibendum erat morbi interdum diam sit. Eu sit dolor vel sodales sed nibh ut. Ac fringilla fames eget a aliquet.",
      details:
        "Massage, Pink Himalayan hot stone, foot spa, and essential oil.",
      image: "/images/service_1.jpg",
    },
    {
      id: "service2",
      title: "ĐIỀU TRỊ DA LIỄU",
      description:
        "Diam phasellus vestibulum lorem sed risus ultricies tristique nulla. At varius vel pharetra vel turpis nunc eget.",
      details:
        "Facial treatment, LED therapy, dermabrasion, and skin rejuvenation.",
      image: "/images/service_2.jpg",
    },
    {
      id: "service3",
      title: "VẬT LÝ TRỊ LIỆU",
      description:
        "Lacus luctus accumsan tortor posuere ac ut consequat. Id porta nibh venenatis cras sed felis eget velit aliquet.",
      details:
        "Ultrasound therapy, electrical stimulation, heat therapy, and exercise programs.",
      image: "/images/service_3.jpg",
    },
    {
      id: "service4",
      title: "TƯ VẤN DINH DƯỠNG",
      description:
        "Eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. At quis risus sed vulputate odio ut enim blandit.",
      details:
        "Personalized meal plans, nutritional assessment, and dietary guidance.",
      image: "/images/service_4.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const activeService = services[currentIndex];

  // Auto-advance service every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Trigger animation on active service change
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <section className="py-10 md:py-20 bg-[#182134] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8 md:mb-16">
          <h2 className="text-xl md:text-4xl font-cormorant font-semibold text-[#FFF7EB] uppercase relative">
            DỊCH VỤ
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Featured service image and content */}
          <div className="w-full lg:w-1/2">
            <div
              className={`relative rounded-lg overflow-hidden h-[253px] md:h-[500px] transition-all duration-500 ease-in-out ${
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
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="font-cormorant text-md md:text-3xl font-bold mb-2 md:mb-5 text-white">
              {activeService.title}
            </h3>
            <p className="text-gray-300 mb-4 md:mb-16 text-sm md:text-lg leading-relaxed">
              {activeService.description}
            </p>

            <div className="mb-10">
              <h4 className="text-sm md:text-xl font-medium mb-1 md:mb-3 ">
                Bao gồm:
              </h4>
              <p className="text-gray-300 text-sm md:text-md font-normal">
                {activeService.details}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 bg-[#B1873F] hover:bg-amber-700 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-md h-10 md:h-12"
              >
                Xem chi tiết
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
                href="#"
                className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 border border-[#B1873F] hover:bg-amber-600/10 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-md h-10 md:h-12"
              >
                Đặt lịch
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

        {/* Service thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`cursor-pointer relative overflow-hidden rounded-md transition-all duration-300 ${
                service.id === activeService.id
                  ? "ring-2 ring-amber-500 scale-[1.02]"
                  : "opacity-75 hover:opacity-100"
              }`}
              onClick={() =>
                setCurrentIndex(services.findIndex((s) => s.id === service.id))
              }
            >
              <div className="relative aspect-[4/3]">
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

        <div className="text-center mt-10 md:mt-14">
          <a
            href="#"
            className="inline-block border-b border-white/50 hover:border-white transition-colors pb-1 text-white text-sm md:text-lg"
          >
            Khám phá thêm
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesGallerySection;
