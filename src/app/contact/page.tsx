import React from "react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Main Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
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
                KẾT NỐI VỚI CHÚNG TÔI
              </h1>

              {/* Address */}
              <div className="mb-8">
                <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                  Địa chỉ
                </h2>
                <p className="text-[#000]">
                  327 đường Nguyễn Trọng Tuyển, Phường 10, Quận Phú Nhuận,
                  TP.HCM
                </p>
              </div>

              {/* Business Hours */}
              <div className="mb-8">
                <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                  Giờ mở cửa
                </h2>
                <p className="text-[#000]">Thứ 2 - Thứ 7: 8h00 - 19h00</p>
                <p className="text-[#000]">Chủ nhật: 8h00 - 18h00</p>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="font-bold text-xl text-[#B1873F] mb-3">
                  Thông tin liên hệ
                </h2>
                <p className="text-[#000] mb-2">
                  <span className="font-medium">SĐT:</span> 0901 430 077
                </p>
                <p className="text-[#000]">
                  <span className="font-medium">Email:</span>{" "}
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
                  Đặt lịch trải nghiệm
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
    </div>
  );
}
