import React from "react";
import Image from "next/image";

type TreatmentMethodProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
};

const TreatmentMethod = ({
  icon,
  title,
  description,
  iconColor,
}: TreatmentMethodProps) => {
  return (
    <div className="flex last:mb-0">
      <div
        className={`flex items-center justify-center shrink-0 mr-5 w-10 h-10 md:w-18 md:h-18 rounded-full`}
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>
      <div className="mt-0 md:mt-4">
        <h3 className="font-bold text-sm md:text-xl mb-2 text-gray-900">
          {title}
        </h3>
        <p className="text-[#909090] text-sm md:text-md lg:mr-16">
          {description}
        </p>
      </div>
    </div>
  );
};

const TreatmentMethodsSection = () => {
  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          {/* Left column with methods */}
          <div className="col-span-4">
            <h2 className="font-cormorant font-bold text-xl md:text-[40px] text-[#222222] leading-[140%] mb-12">
              PHƯƠNG THỨC ĐIỀU TRỊ TẠI HEALTHCARE THERAPY CENTER
            </h2>

            <div className="space-y-4 md:space-y-6">
              <TreatmentMethod
                iconColor="#c7d6e7"
                icon={
                  <svg
                    width="35"
                    height="31"
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
                title="Trị liệu thần kinh cột sống của Y học phương Tây"
                description="Liệu trình điều trị tối ưu và an toàn, không yêu cầu sử dụng thuốc hay phẫu thuật."
              />

              <div className="w-[1px] h-8 bg-gray-200 ml-5 -mt-8 md:mt-0 md:ml-8"></div>

              <TreatmentMethod
                iconColor="#6C98C5"
                icon={
                  <svg
                    width="36"
                    height="36"
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
                title="Áp dụng công nghệ cao"
                description="Cập nhật liên tục những công nghệ hiện đại, tiên tiến để mang lại hiệu quả điều trị tốt nhất"
              />

              <div className="w-[1px] h-8 bg-gray-200 ml-5 -mt-8 md:mt-0 md:ml-8"></div>

              <TreatmentMethod
                iconColor="#99D3E4"
                icon={
                  <svg
                    width="36"
                    height="36"
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
                title="Dược trị liệu"
                description="Phù hợp với từng cá nhân để giảm đau, giảm viêm, dùng các vị chất tái tạo, giúp sức khoẻ nhanh chóng phục hồi"
              />

              <div className="w-[1px] h-8 bg-gray-200 ml-5 -mt-8 md:mt-0 md:ml-8"></div>

              <TreatmentMethod
                iconColor="#235E93"
                icon={
                  <svg
                    width="36"
                    height="36"
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
                title="Phục hồi chức năng theo Y học cổ truyền phương Đông"
                description="Xây dựng phác đồ điều trị riêng biệt, giúp khách hàng sớm trở lại tận hưởng cuộc sống hàng ngày"
              />
            </div>
          </div>

          {/* Right column with image */}
          <div className="hidden md:block col-span-3">
            <Image
              src="/images/medicare-methods.png"
              alt="Healthcare Therapy Center Treatment Methods"
              width={500}
              height={600}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentMethodsSection;
