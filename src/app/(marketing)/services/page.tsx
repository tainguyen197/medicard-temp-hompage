import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import ServicesLoading from "./loading";
import ServicesContent from "./ServicesContent";

export default function ServicesPage() {
  return (
    <div className="pt-[72px] md:pt-[96px]">
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src="/images/hero-section.png"
          alt="Y học cổ truyền"
          className="object-cover object-start"
          priority
          fill
        />
      </section>
      {/* Introduction Section */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="container mx-auto px-4 pt-10 md:pt-16 pb-12 md:pb-20">
          <h1 className="text-3xl md:text-5xl font-bold text-[#B1873F] font-cormorant text-center mb-8">
            DỊCH VỤ
          </h1>
          <p className="text-gray-700 max-w-5xl mx-auto text-lg md:text-xl font-semibold text-justify mb-8">
            Không chỉ nhằm mục đích điều trị sau khi các triệu chứng xuất hiện,
            mà là phòng ngừa ngay từ ban đầu để duy trì và nâng cao chất lượng
            cuộc sống của bạn. Thông qua các chương trình tư vấn, kiểm tra và
            chăm sóc được cá nhân hóa, chúng tôi đồng hành cùng bạn trên hành
            trình chăm sóc sức khỏe.
          </p>
        </section>
      </AnimatedSection>
      {/* Services Detail Section */}
      <Suspense fallback={<ServicesLoading />}>
        <ServicesContent />
      </Suspense>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
