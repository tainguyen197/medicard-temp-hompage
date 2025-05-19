import React from "react";
import Image from "next/image";
import StarburstIcon from "./StarburstIcon";

interface ProcessStepProps {
  number: number;
  color: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessStep = ({
  number,
  color,
  title,
  description,
  icon,
}: ProcessStepProps) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 md:w-16 md:h-16 ${color} rounded-full flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <div className="text-center mb-2 uppercase font-cormorant text-sm md:text-md text-[#909090]">
      BƯỚC {number}
    </div>
    <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-3 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-sm md:text-md text-justify">
      {description}
    </p>
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
    <section
      id="process"
      className="relative pb-10 md:pb-16 bg-white overflow-hidden"
    >
      <div className="container mx-auto">
        <div className="flex ">
          <div className="w-full px-4">
            <div className="flex flex-col gap-4 md:gap-20 md:flex-row mb-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-[40px] font-cormorant font-bold text-gray-900 mb-6 uppercase leading-tight">
                  QUY TRÌNH
                  <br />
                  CHĂM SÓC SỨC KHOẺ
                </h2>
                <p className="text-sm md:text-[20px] text-gray-700 text-justify">
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
            <div className="bg-white md:p-8 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-11 gap-y-6 gap-x-4 md:gap-4 items-start">
                <div className="md:col-span-2">
                  <ProcessStep
                    number={1}
                    icon={
                      <svg
                        className="w-5 h-5 md:w-[35px] md:h-[35px]"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.49925 10.999H12.6655L15.9985 17.665L19.3315 7.666L22.6645 14.332H26.8308M1 24.331H34.33M7.666 29.3305H7.83265M14.332 29.3305H14.4987M7.666 34.33H27.664C31.3455 34.33 34.33 31.3455 34.33 27.664V7.666C34.33 3.98447 31.3455 1 27.664 1H7.666C3.98447 1 1 3.98447 1 7.666V27.664C1 31.3455 3.98447 34.33 7.666 34.33Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    color="bg-[#BDD0E5]"
                    title="Thu thập thông tin"
                    description="Bác sĩ sẽ dựa trên những thông tin được cung cấp như: tiền sử bệnh, thăm khám triệu chứng & chẩn đoán ban đầu."
                  />
                </div>

                <div className="hidden md:block md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    number={2}
                    icon={
                      <svg
                        className="w-5 h-5 md:w-[32px] md:h-[32px]"
                        viewBox="0 0 35 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.4395 1L11.792 7.25475C11.6864 8.27413 10.8224 9.03696 9.81158 9.20603C7.20807 9.64153 4.63923 10.8949 2.95309 11.862C1.71234 12.5736 1.08999 13.9703 1.23601 15.3932L2.66667 29.3333M8.5 21.8333C8.5 23.5 8.5 25.1667 9.33333 29.3333M22.4395 1L23.0871 7.25475C23.1927 8.27413 24.0562 9.03845 25.0677 9.20317C27.7343 9.63742 30.4609 10.901 32.2595 11.8714C33.5643 12.5754 34.2386 14.0162 34.0873 15.491L32.6667 29.3333M26.8333 21.8333C26.8333 23.5 26.8333 25.1667 26 29.3333"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    color="bg-[#6C98C5]"
                    title="Chẩn đoán sức khoẻ"
                    description="Khách hàng có thể cần chụp thêm X-quang hoặc cộng hưởng từ (MRI) để có kết quả chẩn đoán chính xác nhất."
                  />
                </div>

                <div className="hidden md:block md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    icon={
                      <svg
                        className="w-5 h-5 md:w-[35px] md:h-[35px]"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5774 10.6528L23.4023 6.8279M11.2902 11.2902L24.0398 24.0398M3.64051 31.6895C0.119828 28.1688 0.119828 22.4606 3.64051 18.94L18.94 3.64051C22.4606 0.119829 28.1688 0.119828 31.6895 3.64051C35.2102 7.1612 35.2102 12.8694 31.6895 16.39L16.39 31.6895C12.8694 35.2102 7.1612 35.2102 3.64051 31.6895Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    number={3}
                    color="bg-[#99D3ED]"
                    title="Trị liệu kết hợp"
                    description="Thiết kế lộ trình điều trị với các phương pháp Trị liệu Thần kinh Cột sống, kết hợp sử dụng công nghệ và vật lý trị liệu hiện đại để điều trị."
                  />
                </div>

                <div className="hidden md:block md:col-span-1 self-center">
                  <Arrow />
                </div>

                <div className="md:col-span-2">
                  <ProcessStep
                    icon={
                      <svg
                        className="w-5 h-5 md:w-[35px] md:h-[35px]"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.09502 21.7378L12.2444 21.6863C13.9597 21.6784 15.6869 24.2434 17.4022 24.2355C18.8847 24.2287 21.6428 22.9345 22.9305 25.3498C23.3374 26.1131 22.8027 26.9899 22.0051 27.3249C20.1577 28.1009 18.1009 29.1529 17.4259 29.3814L12.2721 27.6898M23.4136 25.9231L31.2483 22.7472C31.7239 22.5544 32.2418 22.4899 32.7502 22.5601C34.5469 22.8083 35.065 25.1579 33.5393 26.1387L20.4663 34.5429C19.6412 35.0734 18.6284 35.2252 17.6839 34.9601L1.13461 30.3142M17.3744 18.232C14.0671 17.0848 7.91191 12.1161 7.88654 6.61936C7.87252 3.58361 10.1842 1.1119 13.0499 1.09867C14.8048 1.09057 16.3605 2.00631 17.306 3.41459C18.2385 1.99764 19.7857 1.06758 21.5406 1.05947C24.4063 1.04625 26.7407 3.49651 26.7547 6.53226C26.7801 12.029 20.671 17.0543 17.3744 18.232Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
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
