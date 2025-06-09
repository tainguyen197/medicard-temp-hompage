"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import StarburstIcon from "./StarburstIcon";

interface AboutSectionProps {
  t: {
    title: string;
    heading: string;
    quote: string;
    doctor: string;
    designation: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
}

const FeatureItem = ({
  title,
  description,
  iconClassName,
  icon,
  isOpen,
  onToggle,
  index,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  index?: number;
}) => {
  return (
    <div className="mb-6 md:mb-10 ml-2 md:ml-8" onClick={onToggle}>
      <div className="flex items-start mb-2">
        <div
          className={`mr-3 flex-shrink-0 mt-1 p-1 rounded-full  ${iconClassName}`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-md md:text-xl text-gray-800 flex-1">
          {title}
        </h3>
        {/* Chevron toggle for mobile */}
        <button
          type="button"
          className="md:hidden ml-2 focus:outline-none"
          aria-label="Toggle feature description"
        >
          <svg
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* Description: show on desktop, or if open on mobile */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
        } md:max-h-full md:opacity-100 md:mt-0`}
        style={{
          // Always show on desktop
          ...(typeof window !== "undefined" && window.innerWidth >= 768
            ? { maxHeight: "none", opacity: 1, marginTop: 0 }
            : {}),
        }}
      >
        <p className="text-[#909090] text-justify text-sm md:text-md">
          {description}
        </p>
      </div>
    </div>
  );
};

const AboutSection = ({ t }: AboutSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  // Helper to check if desktop (for SSR safety, fallback to true)
  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 768 : false;

  const featureIcons = [
    {
      iconClassName: "bg-[#6C98C5]",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5687 5.74767C12.7377 5.26076 12.8333 4.75874 12.8333 4.24935C12.8333 2.47744 11.3969 1.04102 9.62496 1.04102C8.53987 1.04102 7.58058 1.57969 6.99996 2.40421C6.41934 1.57969 5.46005 1.04102 4.37496 1.04102C2.60305 1.04102 1.16663 2.47744 1.16663 4.24935C1.16663 7.45768 4.95829 10.3743 6.99996 11.0528C7.50434 10.8852 8.11552 10.581 8.74996 10.1695M6.70829 6.29102H8.16663L9.33329 8.62435L10.5 5.12435L11.6666 7.45768H13.125"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      iconClassName: "bg-[#99D3E4]",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.95829 3.49935H7.04163M3.83329 9.91602H6.16663M4.99996 11.0827V8.74935M6.74996 6.5173C8.12951 7.17265 9.08329 8.57878 9.08329 10.2077V11.3743C9.08329 12.0187 8.56096 12.541 7.91663 12.541H2.08329C1.43896 12.541 0.916626 12.0187 0.916626 11.3743V10.2077C0.916626 8.57878 1.87041 7.17265 3.24996 6.5173M4.99996 6.99935C3.87238 6.99935 2.95829 6.08526 2.95829 4.95768V2.33268C2.95829 1.68835 3.48063 1.16602 4.12496 1.16602H5.87496C6.51929 1.16602 7.04163 1.68835 7.04163 2.33268V4.95768C7.04163 6.08526 6.12754 6.99935 4.99996 6.99935Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      iconClassName: "bg-[#235E93]",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.54171 1.74928H6.12504C6.76937 1.74928 7.29171 2.27161 7.29171 2.91594V5.24936C7.29171 6.86019 5.98587 8.16603 4.37504 8.16603M3.20837 1.74928H2.62504C1.98071 1.74928 1.45837 2.27161 1.45837 2.91594V5.24936C1.45837 6.86019 2.76421 8.16603 4.37504 8.16603M4.37504 8.16603V9.62436C4.37504 11.3963 5.81146 12.8327 7.58337 12.8327C9.35529 12.8327 10.7917 11.3963 10.7917 9.62436V9.04103M10.7917 9.04103C11.5971 9.04103 12.25 8.38811 12.25 7.58269C12.25 6.77728 11.5971 6.12436 10.7917 6.12436C9.98629 6.12436 9.33337 6.77728 9.33337 7.58269C9.33337 8.38811 9.98629 9.04103 10.7917 9.04103ZM5.5417 1.16602L5.54169 2.33257M3.20837 1.16603V2.33269"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="md:grid md:grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column with title */}
          <div className="col-span-3">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-3">
                  <StarburstIcon
                    size={24}
                    className="text-[#002447] size-4 md:size-6"
                  />
                </span>
                <h3 className="uppercase font-cormorant font-bold text-[#2B3D96] tracking-wider text-sm md:text-md">
                  {t.title}
                </h3>
              </div>
            </div>

            <h2 className="font-cormorant uppercase font-bold text-2xl md:text-[46px] text-navy-800 mb-10 md:mb-10 leading-[140%] text-[#002447]">
              {t.heading}
            </h2>

            <div className="relative flex rounded-lg overflow-hidden border border-gray-200 mb-8">
              <div className="relative h-[143px] aspect-120/143 md:h-[232px] md:aspect-232/270">
                <Image
                  src="/images/about-us.png"
                  alt="Healthcare Therapy Center Professional"
                  fill
                  className="relative object-cover"
                />
              </div>
              <div className="bg-white p-2 md:p-12 flex flex-col justify-between relative leading-[140%]">
                <blockquote className="mb-3 font-bold text-sm md:text-lg text-gray-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="md:font-bold text-gray-800 text-xs md:text-md md:text-[16px]">
                    {t.doctor}
                  </p>
                  <p className="text-gray-600 text-xs md:text-md">
                    {t.designation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with features */}
          <div className="col-span-2">
            <div className="md:mt-16">
              {t.features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  iconClassName={featureIcons[index]?.iconClassName}
                  icon={featureIcons[index]?.icon}
                  isOpen={isDesktop || openIndex === index}
                  onToggle={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
