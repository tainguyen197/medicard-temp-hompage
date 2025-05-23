"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
}

const ServicesGallerySection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: "service1",
      title: "Y HỌC CỔ TRUYỀN",
      description:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      details: "Châm cứu, Xoa bóp - Bấm huyệt, Thuốc thang",
      image: "/images/service_1.png",
    },
    {
      id: "service2",
      title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO",
      description:
        "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả cao trong việc điều trị các bệnh lý cơ xương khớp, giảm đau, đẩy nhanh tốc độ tái tạo và phục hồi.",
      details:
        "Laser công suất cao, Radio Frequency (Sóng RF), Shockwave Therapy ( Sóng xung kích)",
      image: "/images/service_2.png",
    },
    {
      id: "service3",
      title: "PHỤC HỒI CHỨC NĂNG: CHUẨN ĐOÁN VÀ ĐIỀU TRỊ CHUYÊN SÂU ",
      description:
        "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn.",
      details:
        "Thăm khám, tư vấn, chẩn đoán và điều trị các bệnh lý cơ xương khớp, Sử dụng các máy móc vật lý trị liệu, Kỹ thuật viên có tay nghề chuyên môn cao",
      image: "/images/service_3.png",
    },
    {
      id: "service4",
      title: "LIỆU TRÌNH HOÀN HẢO, HÀNH TRÌNH ÊM ÁI",
      description:
        "Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy Center mà không cần lo lắng về việc di chuyển bởi dịch vụ đưa đón tận nơi. ",
      details: "Xe đưa đón hiện đại, tiện nghi. Dịch vụ êm áí, thư thái.",
      image: "/images/service_4.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const activeService = services[currentIndex];
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup thumbnail refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, services.length);
  }, [services.length]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const scrollAmount = 220; // Adjust based on thumbnail width
      thumbnailsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll to active thumbnail when it changes
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailsRef.current) {
      const container = thumbnailsRef.current;
      const thumbnail = thumbnailRefs.current[currentIndex];

      if (thumbnail) {
        // Calculate the scroll position to center the element
        const thumbnailRect = thumbnail.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const centerPosition =
          thumbnail.offsetLeft -
          container.offsetLeft -
          containerRect.width / 2 +
          thumbnailRect.width / 2;

        container.scrollTo({
          left: centerPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  // Auto-advance service every 6 seconds if autoAdvance is true
  useEffect(() => {
    if (!autoAdvance) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvance]);

  // Trigger animation on active service change
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handleServiceClick = (index: number) => {
    setCurrentIndex(index);
    setAutoAdvance(false); // Stop auto-advance when user clicks on a thumbnail
  };

  // Create a ref setting callback that doesn't return anything
  const setThumbnailRef = (index: number) => (el: HTMLDivElement | null) => {
    thumbnailRefs.current[index] = el;
  };

  return (
    <section id="services" className="py-10 md:py-16   bg-[#182134] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-[46px] xl:text-[51px] font-cormorant font-semibold text-[#FFF7EB] uppercase relative">
            DỊCH VỤ
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 transition-all duration-500 ease-in-out">
          {/* Featured service image and content */}
          <div className="w-full lg:w-1/2">
            <div
              className={`relative rounded-4xl overflow-hidden h-[253px] md:h-[450px] transition-all duration-500 ease-in-out ${
                animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Service description */}
          <div className="w-full lg:w-1/2 flex flex-col justify-end">
            <div>
              <h3 className="font-cormorant text-md md:text-[30px] font-bold mb-2 md:mb-5 text-white line-clamp-1 md:line-clamp-none">
                {activeService.title}
              </h3>
              <p className="text-gray-300 mb-4 md:mb-10 text-sm md:text-md leading-relaxed line-clamp-5 md:line-clamp-none  min-h-[7.25rem]">
                {activeService.description}
              </p>
            </div>
            <div>
              <div className="mb-10">
                <h4 className="text-sm md:text-xl font-medium mb-1 md:mb-3 leading-relaxed">
                  Bao gồm:
                </h4>
                <p className="text-gray-300 text-sm md:text-md font-normal line-clamp-2 md:line-clamp-none min-h-[2.75rem]">
                  {activeService.details}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 bg-[#B1873F] hover:bg-amber-700 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-[16px] h-10 md:h-12"
                >
                  Xem chi tiết
                  <svg
                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
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
                </a>
                <a
                  href="https://forms.gle/GJETkvXcnZ7hZwBr8"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 md:px-7 md:py-3 border border-[#B1873F] hover:bg-amber-600/10 transition-colors rounded-xl md:rounded-full text-white font-semibold md:font-medium text-xs md:text-[16px] h-10 md:h-12"
                >
                  Đặt lịch
                  <svg
                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
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
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Service thumbnails as horizontal slider */}
        <div className="relative mt-8">
          <div
            ref={thumbnailsRef}
            className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar"
            style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
          >
            {services.map((service, index) => (
              <div
                key={service.id}
                ref={setThumbnailRef(index)}
                className={`cursor-pointer relative overflow-hidden rounded-3xl min-w-[180px] md:min-w-[220px]  md:max-w-[265px] flex-shrink-0 transition-all duration-300 ${
                  service.id === activeService.id
                    ? "border-2 border-amber-500"
                    : "opacity-75 hover:opacity-100"
                }`}
                onClick={() => handleServiceClick(index)}
              >
                <div className="relative aspect-[309/216] max-h-[216px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 md:mt-14">
          <a
            href="#"
            className="inline-block border-b border-white/50 hover:border-white transition-colors pb-1 text-white text-sm md:text-lg"
          >
            Khám phá thêm
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesGallerySection;
