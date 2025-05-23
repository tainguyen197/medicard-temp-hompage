import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function RehabilitationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src="/images/hero-bg.png"
            alt="Phục hồi chức năng"
            className="object-cover object-center"
            priority
            fill
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6">
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
          <span className="text-black">
            Phục hồi chức năng: chẩn đoán và điều trị chuyên sâu
          </span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#222222] mb-6 leading-[140%]">
          PHỤC HỒI CHỨC NĂNG: CHẨN ĐOÁN VÀ ĐIỀU TRỊ CHUYÊN SÂU
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-black">
          Tại Healthcare Therapy Center, khách hàng sẽ được thăm - khám, tư vấn
          trực tiếp bởi đội ngũ bác sĩ được đào tạo đầy đủ, có đủ bằng cấp
          chuyên môn, kinh nghiệm.
        </h2>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="space-y-12 md:space-y-16">
          {/* Thăm khám section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Thăm khám, tư vấn và chẩn đoán các bệnh lý cơ xương khớp
              </h3>
              <p className="text-base md:text-lg text-black leading-relaxed">
                Khách hàng sẽ được thăm - khám, tư vấn trực tiếp bởi đội ngũ bác
                sĩ được đào tạo đầy đủ, có đủ bằng cấp chuyên môn, kinh nghiệm
                trong lĩnh vực Cơ xương khớp – Phục hồi chức năng. Chẩn đoán dựa
                trên triệu chứng bệnh và các kết quả cận lâm sàng cần thiết, sau
                đó đưa ra phác đồ điều trị cá nhân hóa phù hợp với tình trạng
                bệnh lý của khách hàng.
              </p>
            </div>
          </div>

          {/* Máy móc thiết bị section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Sử dụng các máy móc thiết bị vật lý trị liệu
              </h3>
              <p className="text-base md:text-lg text-black leading-relaxed">
                HTC sử dụng các máy móc, thiết bị vật lý trị liệu hiện đại, phối
                hợp tinh chỉnh phù hợp với từng phác đồ điều trị, tác động sâu
                đến các lớp cơ, gân, khớp, hướng tới kết quả điều trị tối ưu.
                Các phương pháp như:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-base md:text-lg text-black">
                <li>Điện xung trị liệu</li>
                <li>Siêu âm trị liệu</li>
                <li>Laser công suất cao</li>
                <li>Sóng cao tần</li>
                <li>Sóng xung kích</li>
              </ul>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto mb-4">
                  <Image
                    src="/images/PHCN 1.jpg"
                    alt="Radio Frequency"
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
              <div className="order-1 md:order-2 mb-4">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/PHCN 2.jpg"
                    alt="Radio Frequency"
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
              <div className="order-1 md:order-2 mb-4">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/PHCN 3.jpg"
                    alt="Radio Frequency"
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
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Kĩ thuật viên có tay nghề, chuyên môn cao
              </h3>
              <p className="text-base md:text-lg text-black leading-relaxed">
                Đội ngũ kĩ thuật viên có kinh nghiệm, được đào tạo bài bản về
                các kĩ thuật bằng tay: Tác động mô mềm, kéo giãn cơ, tập vận
                động thụ động – chủ động các khớp, các kĩ thuật tập mạnh cơ,...
                giúp điều trị hiệu quả các bệnh lý cơ xương khớp.
              </p>
            </div>
          </div>

          {/* Điều trị các bệnh lý section */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Điều trị các bệnh lý
              </h3>
              <ul className="list-disc pl-5 mt-2 space-y-4 text-base md:text-lg text-black">
                <li>
                  <strong>Các bệnh về cột sống</strong> như: Đau cổ-lưng, đau
                  thần kinh tọa, thoát vị đĩa đệm,...
                </li>
                <li>
                  <strong>Các bệnh lý về gân - khớp</strong> như: viêm chop
                  xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống
                  cổ tay, viêm gân duỗi ngón cái, tenis elbow…
                </li>
                <li>
                  <strong>Các tình trạng căng mỏi cơ cấp - mạn</strong>
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
