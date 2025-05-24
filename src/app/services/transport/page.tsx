import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TransportPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src="/images/hero-bg.png"
            alt="Dịch vụ đưa đón"
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
          <span className="text-black">Dịch vụ đưa đón</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <h1 className="text-3xl md:text-[42px] font-semibold text-[#222222] mb-6 leading-[140%]">
          HEALTHCARE THERAPY CENTER: LIỆU TRÌNH HOÀN HẢO, HÀNH TRÌNH ÊM ÁI
        </h1>
        <h2 className="text-md md:text-[20px] font-semibold text-black">
          Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy
          Center mà không cần lo lắng về việc di chuyển.
        </h2>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Introduction */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Chúng tôi hiểu rằng sau những giây phút chăm sóc sức khỏe và thư
                giãn tuyệt vời, điều bạn cần là một hành trình về nhà thật thoải
                mái và an tâm. Vì thế, Healthcare Therapy Center hân hạnh mang
                đến dịch vụ đưa khách về tận nhà với dòng xe hiện đại, tiện
                nghi.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                <Image
                  src="/images/XDD 1.jpg"
                  alt="Dịch vụ đưa đón"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Hình dung nhé, bạn vừa kết thúc một buổi trị liệu tuyệt vời, cơ
                thể và tâm trí đang trong trạng thái cân bằng hoàn hảo. Thay vì
                phải chờ đợi xe công cộng hay lo lắng về việc lái xe, giờ đây đã
                có HTC cùng đội ngũ năng động của chúng tôi sẵn sàng đồng hành
                cùng bạn trên mọi nẻo đường về nhà.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                <Image
                  src="/images/XDD 2.jpg"
                  alt="Dịch vụ đưa đón"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Với không gian nội thất rộng rãi, thiết kế hiện đại, trang bị
                tiện nghi đầy đủ. Dịch vụ xe của chúng tôi sẽ mang đến cho bạn
                một chuyến đi êm ái, thư thái và đầy phong cách. Hãy để chúng
                tôi chăm sóc suốt hành trình, để bạn có thể hoàn toàn thả lỏng
                và tận hưởng những lợi ích tuyệt vời mà liệu trình đã mang lại.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                <Image
                  src="/images/XDD 3.jpg"
                  alt="Dịch vụ đưa đón"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <strong>
              <p className="text-center md:text-[16px] text-black leading-relaxed">
                EALTHCARE THERAPY CENTER - Nâng niu sức khỏe, trọn vẹn an tâm
                trên từng hành trình.
              </p>
            </strong>
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
