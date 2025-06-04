import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import prisma from "@/lib/prisma";

interface Service {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  shortDescription?: string | null;
  status: string;
  featureImageId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

export default async function ServicesPage() {
  let services: Service[] = [];

  try {
    // Fetch services directly from the database with Prisma (like posts page does)
    console.log("Fetching services from database...");

    // Get services (only show published services for public page)
    const servicesData = await prisma.service.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      include: {
        featureImage: true, // Include the related Media record
      },
    });

    services = servicesData;
    console.log(`Found ${services.length} published services`);

    if (services.length > 0) {
      console.log("First service title:", services[0]?.title);
      console.log("First service status:", services[0]?.status);
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
    services = [];
  }

  // Map services to the format expected by the UI
  const displayServices =
    services.length > 0
      ? services.map((service) => ({
          id: service.slug || service.id, // Use slug for URL, fallback to id
          title: service.title,
          shortDescription: service.shortDescription || "",
          image: service.featureImage?.url || "/images/service_1.png", // Fallback to existing service image
        }))
      : [
          // Fallback to hardcoded data if no services from database
          {
            id: "ortho",
            title: "Y HỌC CỔ TRUYỀN",
            shortDescription:
              "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại...",
            image: "/images/service_1.png",
          },
          {
            id: "rehab",
            title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO",
            shortDescription:
              "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả...",
            image: "/images/service_2.png",
          },
          {
            id: "func",
            title: "PHỤC HỒI CHỨC NĂNG CÔNG NGHỆ CAO",
            shortDescription:
              "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn.",
            image: "/images/service_3.png",
          },
          {
            id: "transport",
            title: "HÀNH TRÌNH ÊM ÁI",
            shortDescription:
              "Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy Center mà không cần lo lắng về việc di chuyển bởi dịch vụ đưa đón tận nơi.",
            image: "/images/service_4.png",
          },
        ];

  console.log(
    `Using ${
      services.length > 0 ? "database" : "fallback"
    } services for display`
  );

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
      <section className="bg-[#FEF6EA] py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {displayServices.map((service, index) => (
            <div key={service.id} className="mb-10 last:mb-0">
              <Link
                href={`/services/${service.id}`}
                className="group mt-2 md:mt-0"
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col md:flex-row md:gap-x-10 md:pb-10 md:border-b border-[#E2E2E2]">
                    <div className="h-52 aspect-270/200  relative rounded-2xl overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full"
                        fill
                      />
                    </div>
                    <div className="md:w-2/3 p-6 md:p-0">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                        <h3 className="text-xl md:text-4xl font-medium text-[#222222] font-cormorant group-hover:text-[#B1873F]">
                          {service.title}
                        </h3>

                        <button className="bg-[#B1873F0D] cursor-pointer border border-[#B1873F] py-1.5 px-5 rounded-full text-[#B1873F] text-sm font-medium flex items-center hover:bg-[rgba(177,135,63,0.1)] transition-all whitespace-nowrap">
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
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
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
