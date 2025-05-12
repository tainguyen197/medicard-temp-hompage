import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TraditionalMedicinePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src="/images/hero-bg.png"
            alt="Y học cổ truyền"
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
          <span className="text-black">Y học cổ truyền</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#222222] mb-6">
          Y HỌC CỔ TRUYỀN
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-black">
          Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc
        </h2>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="space-y-12 md:space-y-16">
          {/* Introduction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="text-base md:text-lg text-black leading-relaxed">
                Kể từ thời Văn Lang và Đại Việt, nền y học Việt Nam đã kết hợp
                lý luận y học từ phương Đông cùng với những kiến thức chữa bệnh
                tích góp từ 54 dân tộc khác nhau. Họ đã sử dụng đặc quyền am
                hiểu về các nguyên liệu thảo dược, dược liệu từ thiên nhiên của
                vùng nhiệt đới gió mùa và cuối cùng tích góp tạo ra nền y học cổ
                truyền của Việt Nam.
              </p>
              <br />
              <p className="text-base md:text-lg text-black leading-relaxed">
                Điểm tạo nên sự đặc biệt của phương pháp này chính là những vị
                thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt
                theo từng ca bệnh khác nhau. Các phương pháp điều trị khác của y
                học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu
                chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm
                - Dương bên trong cơ thể cũng đã được ghi nhận về tính hiệu quả
                và an toàn
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px]">
                <Image
                  src="/images/service-img3.png"
                  alt="Y học cổ truyền"
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
            </div>
          </div>

          {/* Acupuncture */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Châm cứu:
            </h3>
            <p className="text-base md:text-lg text-black leading-relaxed">
              Các bác sĩ sẽ sử dụng các chiếc kim bằng kim loại nhỏ để châm
              xuyên qua lớp da, sau đó chuyển động bằng tay hoặc sử dụng biện
              pháp kích điện để tác động đến hệ thần kinh trung ương. Cơ chế này
              giúp giải phóng các chất hóa học vào trong cơ, tủy sống hay não và
              thúc đẩy khả năng tự chữa bệnh một cách tự nhiên của cơ thể.
            </p>
          </div>

          {/* Herbal Medicine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="relative w-full h-64 md:h-full min-h-[300px]">
              <Image
                src="/images/service-img1.png"
                alt="Thuốc thang"
                className="object-cover rounded-lg"
                fill
              />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Thuốc thang:
              </h3>
              <p className="text-base md:text-lg text-black leading-relaxed">
                Thuốc ngành y học cổ truyền đều có thành phần từ nguyên liệu của
                thiên nhiên bao gồm cả thực vật và động vật. Mỗi vị thuốc sẽ
                được kết hợp với các dược liệu khác nhau tùy theo chứng bệnh.
                Đặc trưng của thuốc y học cổ truyền đó là có thể sử dụng được
                trong thời gian dài, phù hợp trong việc chữa trị các căn bệnh
                mãn tính.
              </p>
            </div>
          </div>

          {/* Massage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Xoa bóp, bấm huyệt:
              </h3>
              <p className="text-base md:text-lg text-black leading-relaxed">
                Đây không những là một phương pháp chữa trị các căn bệnh mãn
                tính mà còn giúp cho việc phòng bệnh rất hiệu quả. Cách thức
                hoạt động chính là sử dụng bàn tay và ngón tay để tác động lực
                lên các huyệt trên cơ thể bệnh nhân.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px]">
                <Image
                  src="/images/service-img2.png"
                  alt="Xoa bóp, bấm huyệt"
                  className="object-cover rounded-lg"
                  fill
                />
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
            href="tel:0901430077"
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
