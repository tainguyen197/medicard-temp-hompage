import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMessages } from "next-intl/server";

export default async function RehabilitationPage() {
  const messages = await getMessages();
  const t = messages.services.individual.functionalRehabilitation;
  const serviceT = messages.services;

  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src="/images/hero-bg.png"
            alt={t.title}
            className="object-cover object-center"
            priority
            fill
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            {serviceT.breadcrumb.services}
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-2 text-gray-500"
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
          <span className="text-black">{t.title}</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <h1 className="text-3xl md:text-[42px] font-semibold text-[#222222] mb-6 leading-[140%]">
          {t.title}
        </h1>
        <h2 className="text-md md:text-[20px] font-semibold text-black">
          {t.subtitle}
        </h2>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Thăm khám section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                {t.examination.title}
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                {t.examination.description}
              </p>
            </div>
          </div>

          {/* Máy móc thiết bị section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                {t.equipment.title}
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                {t.equipment.description}
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-base md:text-lg text-black">
                {t.equipment.methods.map((method: string, index: number) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto mb-4">
                  <Image
                    src="/images/PHCN 1.jpg"
                    alt={t.equipment.title}
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
              <div className="order-1 md:order-2 mb-4">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/PHCN 2.jpg"
                    alt={t.equipment.title}
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
              <div className="order-1 md:order-2 mb-4">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/PHCN 3.jpg"
                    alt={t.equipment.title}
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kĩ thuật viên section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                {t.technicians.title}
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                {t.technicians.description}
              </p>
            </div>
          </div>

          {/* Điều trị các bệnh lý section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                {t.treatment.title}
              </h3>
              <ul className="list-disc pl-5 mt-2 space-y-4 text-md md:text-[16px] text-black">
                <li>
                  <strong>{t.treatment.spineDisorders.split("như:")[0]}</strong>
                  {t.treatment.spineDisorders.split("như:")[1]}
                </li>
                <li>
                  <strong>{t.treatment.jointDisorders.split("như:")[0]}</strong>
                  {t.treatment.jointDisorders.split("như:")[1]}
                </li>
                <li>
                  <strong>{t.treatment.muscleStrain}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            {serviceT.cta.heading}
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            {serviceT.cta.subheading}
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            {serviceT.cta.button}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
