import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ServiceDetailLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            Dịch vụ
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
          <div className="w-40 h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <div className="h-10 md:h-14 bg-gray-200 animate-pulse rounded w-3/4 mb-6"></div>
        <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded w-2/3"></div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
                <div className="h-40 bg-gray-200 animate-pulse rounded w-full my-8"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc
            <br />
            trong hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
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
