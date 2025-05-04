import React from "react";
import Image from "next/image";
import StarburstIcon from "./StarburstIcon";

interface ProcessStepProps {
  number: number;
  color: string;
  title: string;
  description: string;
}

const ProcessStep = ({
  number,
  color,
  title,
  description,
}: ProcessStepProps) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mb-3`}
    >
      <StarburstIcon size={24} className="text-white" />
    </div>
    <div className="text-center mb-2 uppercase font-cormorant text-md text-[#909090]">
      BƯỚC {number}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-center text-md">{description}</p>
  </div>
);

const Arrow = () => (
  <div className="hidden md:flex items-center justify-center">
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z"
        fill="#718096"
      />
    </svg>
  </div>
);

const ProcessSection = () => {
  return (
    <section id="process" className="relative py-20 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full px-4">
            <div className="flex flex-col gap-20 md:flex-row mb-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-[40px] font-cormorant font-bold text-gray-900 mb-6 uppercase leading-tight">
                  QUY TRÌNH
                  <br />
                  CHĂM SÓC SỨC KHOẺ
                </h2>
                <p className="text-[20px] text-gray-700 text-justify">
                  <strong>Healthcare Therapy Center</strong> tự hào mang đến
                  giải pháp liệu pháp điều trị - phục hồi cơ xương khớp tái tạo
                  từ cấp tế bào, không phẫu thuật và được cá nhân hoá cao phẫu
                  thuật và được cá nhân hoá cao
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/process-bg.jpg"
                  alt="Healthcare consultation"
                  height={330}
                  width={560}
                  className="object-cover rounded-l-3xl"
                  style={{ objectPosition: "center left" }}
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                <div className="md:col-span-2">
                  <ProcessStep
                    number={1}
                    color="bg-[#BDD0E5]"
                    title="Thu thập thông tin"
                    description="Bác sĩ sẽ dựa trên những thông tin được cung cấp như: tiền sử bệnh, thăm khám triệu chứng & chẩn đoán ban đầu."
                  />
                </div>

                <div className="md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    number={2}
                    color="bg-[#6C98C5]"
                    title="Chẩn đoán sức khoẻ"
                    description="Khách hàng có thể cần chụp thêm X-quang hoặc cộng hưởng từ (MRI) để có kết quả chẩn đoán chính xác nhất."
                  />
                </div>

                <div className="md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    number={3}
                    color="bg-[#99D3ED]"
                    title="Trị liệu kết hợp"
                    description="Thiết kế lộ trình điều trị với các phương pháp Trị liệu Thần kinh Cột sống, kết hợp sử dụng công nghệ và vật lý trị liệu hiện đại để điều trị."
                  />
                </div>

                <div className="md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    number={4}
                    color="bg-[#235E93]"
                    title="Chăm sóc toàn diện"
                    description="Sau quá trình điều trị, bệnh nhân sẽ được tiếp tục theo dõi, kiểm tra tình trạng phục hồi và tư vấn chăm sóc sức khỏe toàn diện."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
