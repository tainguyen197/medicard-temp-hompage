import React from "react";
import Image from "next/image";
import StarburstIcon from "@/components/StarburstIcon";
import Link from "next/link";

// Feature Item component for "Why Choose Us" section
const FeatureItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-start mb-8">
    <span className="text-blue-700 mr-3 flex-shrink-0 mt-1">
      <StarburstIcon size={24} className="text-[#002447] size-4 md:size-6" />
    </span>
    <div>
      <h3 className="font-bold text-md md:text-xl text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-[#909090] text-justify text-sm md:text-base">
        {description}
      </p>
    </div>
  </div>
);

// Team Member component
const TeamMember = ({
  image,
  name,
  role,
}: {
  image: string;
  name: string;
  role: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
      <Image src={image} alt={name} fill className="object-cover" />
    </div>
    <h3 className="font-bold text-lg text-[#002447] mb-1">{name}</h3>
    <p className="text-[#909090] text-sm">{role}</p>
  </div>
);

// Mission/Value Item component
const ValueItem = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start mb-8">
    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#79C5E7] flex items-center justify-center mr-4 font-bold text-white">
      {number}
    </div>
    <div>
      <h3 className="font-bold text-md md:text-xl text-[#002447] mb-2">
        {title}
      </h3>
      <p className="text-[#909090] text-justify text-sm md:text-base">
        {description}
      </p>
    </div>
  </div>
);

// Certificate Item component
const CertificateItem = ({
  image,
  title,
}: {
  image: string;
  title: string;
}) => (
  <div className="flex flex-col items-center h-full">
    <div className="relative w-full h-[300px] md:h-[300px] overflow-hidden mb-4">
      <Image
        src={image}
        alt={title}
        fill
        className="object-contain object-top"
      />
    </div>
    <p className="text-center text-sm md:text-xl text-gray-700">{title}</p>
  </div>
);

export default function AboutPage() {
  const services = [
    {
      id: "ortho",
      title: "Y HỌC CỔ TRUYỀN",
      description:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại...",
      image: "/images/service_1.png",
    },
    {
      id: "rehab",
      title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU...",
      description:
        "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả...",
      image: "/images/service_2.png",
    },
    {
      id: "func",
      title: "PHỤC HỒI CHỨC NĂNG...",
      description:
        "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn.",
      image: "/images/service_3.png",
    },
  ];
  return (
    <div className="pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
      {/* Healthcare Center Introduction Section (New) */}
      <section className="pt-10 md:pt-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="font-cormorant font-bold text-4xl max-text-[40px] text-[#B1873F] mb-6">
              VỀ HEALTHCARE THERAPY CENTER
            </h2>
            <p className="text-gray-700 max-w-4xl mx-auto text-lg md:text-xl font-semibold text-center mb-8">
              Healthcare Therapy Center cung cấp dịch vụ Y Học Cổ Truyền kết hợp
              Phục Hồi Chức Năng theo hướng hiện đại, an toàn và khoa học. Với
              đội ngũ bác sĩ tận tâm, giàu kinh nghiệm cùng không gian trị liệu
              thân thiện, chúng tôi mang đến giải pháp chăm sóc sức khỏe cá nhân
              hóa - giúp khách hàng phục hồi vận động, giảm đau hiệu quả và nâng
              cao chất lượng cuộc sống mỗi ngày.
            </p>
            <a
              href="https://forms.gle/GJETkvXcnZ7hZwBr8"
              target="_blank"
              className="inline-block relative rounded-3xl px-6 py-3 bg-[#B1873F] text-white font-medium hover:bg-[#9e7736] transition-colors"
            >
              <span className="absolute inset-0 bg-[#a75e24] z-0 rounded-full animate-heath-beat"></span>
              <span className="relative z-10">Đặt lịch trải nghiệm</span>
            </a>
          </div>
        </div>
      </section>

      {/* Certificates Section (New) */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="font-cormorant font-bold text-2xl md:text-5xl leading-[140%] text-balance text-[#002447] mb-4">
              SỨC KHOẺ CỦA BẠN LÀ NIỀM VUI CỦA HEALTHCARE THERAPY CENTER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
              <CertificateItem
                image="/images/certificate_1.jpg"
                title="Giấy phép Hoạt động Khám bệnh, Chữa bệnh số 10651/HCM-GPHĐ"
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
              <CertificateItem
                image="/images/certificate_2.jpg"
                title="Giấy phép Hoạt động Khám bệnh, Chữa bệnh số 10674/HCM-GPHĐ"
              />
            </div>
            <div className="col-span-1 md:col-span-1 flex flex-col h-full">
              <CertificateItem
                image="/images/certificate_3.jpg"
                title="Giấy Chứng nhận ĐKDN 0318485902"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="">
        <div className="mb-12 text-center">
          <h2 className="font-cormorant font-bold text-2xl md:text-5xl leading-[140%] text-balance text-[#002447] mb-4">
            DỊCH VỤ CỦA CHÚNG TÔI
          </h2>
        </div>
        <div className="container bg-[#FEF6EA] mx-auto px-4 max-w-6xl py-14 md:p-16 rounded-4xl">
          {services.map((service, index) => (
            <div key={service.id} className="mb-10 last:mb-0">
              <div className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2] cursor-pointer">
                  <Link
                    href={`/services/${service.id}`}
                    className="absolute inset-0"
                  />
                  <div className="h-52 aspect-270/200  relative rounded-2xl overflow-hidden">
                    <Image
                      src={service.image}
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
                        Xem chi tiết
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
            </div>
          ))}
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-4 md:p-8 rounded-4xl">
          <div className="text-center">
            <Link
              href="/services"
              className="inline-block relative text-black font-medium hover:text-[#9e7736] transition-colors underline leading-[140%]"
            >
              Khám phá thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative container py-16 md:py-24 bg-white">
        <div className="relative mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/feedback_bg.jpg"
              alt="Healthcare Center Interior"
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-12 text-center">
            <h2 className="font-cormorant font-bold text-2xl md:text-5xl md:max-text-[48px] leading-[140%] text-balance text-[#002447] mb-4">
              9.9/10 KHÁCH HÀNG GỬI TRỌN TIN YÊU
            </h2>
          </div>
        </div>
        <div className=" mx-auto px-6 md:flex md:flex-row gap-8 justify-end absolute bottom-0 right-0">
          <div className="relative bg-[#182134] p-8 border-8 border-white rounded-2xl aspect-square h-[400px]">
            <div className="text-4xl text-white mb-4">
              <svg
                width="50"
                height="38"
                viewBox="0 0 50 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.563921 38V27.7727C0.563921 24.7543 1.1321 21.576 2.26847 18.2379C3.40483 14.8999 4.98509 11.7038 7.00923 8.64986C9.03338 5.59588 11.4126 2.98579 14.147 0.819603L22.0305 6.4659C19.8643 9.62642 18.0178 12.929 16.4908 16.3736C14.9638 19.8182 14.2003 23.5646 14.2003 27.6129V38H0.563921ZM27.7301 38V27.7727C27.7301 24.7543 28.2983 21.576 29.4347 18.2379C30.571 14.8999 32.1513 11.7038 34.1754 8.64986C36.1996 5.59588 38.5788 2.98579 41.3132 0.819603L49.1967 6.4659C47.0305 9.62642 45.184 12.929 43.657 16.3736C42.13 19.8182 41.3665 23.5646 41.3665 27.6129V38H27.7301Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-white text-justify text-md md:text-[18px] mb-2 leading-[165%]">
              Mọi thứ ở Healthcare Therapy Center, từ ánh sáng, âm nhạc đến mùi
              hương đều rất nhẹ nhàng, giúp tôi quên đi những căng thẳng bên
              ngoài. Đây không chỉ là nơi điều trị mà còn là chốn để tôi nghỉ
              ngơi, tái tạo năng lượng sau khi làm việc mệt mỏi.
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="/images/testimonial_1.jpg"
                  alt="Thảo Uyên"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white text-lg md:text-xl">
                  Thảo Uyên
                </p>
                <p className="text-gray-500 text-sm md:text-lg">
                  Nhân viên văn phòng
                </p>
              </div>
            </div>
          </div>
          <div className="relative bg-[#182134] p-8 rounded-2xl aspect-square h-[400px] border-white border-8">
            <div className="text-4xl text-white mb-4">
              <svg
                width="50"
                height="38"
                viewBox="0 0 50 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.563921 38V27.7727C0.563921 24.7543 1.1321 21.576 2.26847 18.2379C3.40483 14.8999 4.98509 11.7038 7.00923 8.64986C9.03338 5.59588 11.4126 2.98579 14.147 0.819603L22.0305 6.4659C19.8643 9.62642 18.0178 12.929 16.4908 16.3736C14.9638 19.8182 14.2003 23.5646 14.2003 27.6129V38H0.563921ZM27.7301 38V27.7727C27.7301 24.7543 28.2983 21.576 29.4347 18.2379C30.571 14.8999 32.1513 11.7038 34.1754 8.64986C36.1996 5.59588 38.5788 2.98579 41.3132 0.819603L49.1967 6.4659C47.0305 9.62642 45.184 12.929 43.657 16.3736C42.13 19.8182 41.3665 23.5646 41.3665 27.6129V38H27.7301Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-white text-justify text-md md:text-[18px] mb-2 leading-[165%]">
              Các bác sĩ và chuyên viên Healthcare Therapy Center đều có chuyên
              môn cao, nhiều năm kinh nghiệm, luôn tận tâm lắng nghe và giải
              thích cặn kẽ mọi vấn đề cho tôi. Nhờ vậy, tôi cảm thấy rất yên tâm
              khi thăm khám và điều trị tại đây.
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="/images/testimonial_2.jpg"
                  alt="Huỳnh Lâm"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white text-lg md:text-xl">
                  Huỳnh Lâm
                </p>
                <p className="text-gray-500 text-sm md:text-lg">
                  Nhân viên văn phòng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl text-black mb-10 max-w-3xl mx-auto px-16">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-block relative rounded-3xl px-6 py-3 bg-[#B1873F] text-white font-medium hover:bg-[#9e7736] transition-colors"
          >
            <span className="absolute inset-0 bg-[#a75e24] z-0 rounded-full animate-heath-beat"></span>
            <span className="relative z-10">Đặt lịch trải nghiệm</span>
          </a>
        </div>
      </section>
    </div>
  );
}
