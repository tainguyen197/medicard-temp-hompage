import React from "react";
import Image from "next/image";
import StarburstIcon from "./StarburstIcon";
const FeatureItem = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => (
  <div className="mb-10 ml-8">
    <div className="flex items-start mb-2">
      <span className="text-blue-700 mr-3 flex-shrink-0 mt-1">
        <StarburstIcon size={24} className="text-[#002447]" />
      </span>
      <h3 className="font-bold text-xl text-gray-800">{title}</h3>
    </div>
    <p className="text-[#909090] text-justify">{description}</p>
  </div>
);

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column with title */}
          <div className="col-span-3">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-3">
                  <StarburstIcon size={24} className="text-[#002447]" />
                </span>
                <h3 className="uppercase font-cormorant font-bold text-[#2B3D96] tracking-wider text-md">
                  VỀ HEALTHCARE THERAPY CENTER
                </h3>
              </div>
            </div>

            <h2 className="font-cormorant font-bold text-4xl md:text-[46px] text-navy-800 mb-20 leading-[140%] text-[#002447]">
              GIẢI PHÁP CHĂM SÓC SỨC KHOẺ TOÀN DIỆN
            </h2>

            <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-8">
              <Image
                src="/images/about-us.png"
                alt="Healthcare Therapy Center Professional"
                width={232}
                height={270}
                className="object-cover"
              />
              <div className="bg-white p-12 flex flex-col justify-between">
                <blockquote className="mb-3 font-bold text-lg text-gray-800">
                  &ldquo;Mỗi khách hàng đều là &ldquo;người thân&rdquo; mà đội
                  ngũ Healthcare Therapy Center tận tâm phục vụ.&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-gray-800">
                    BS CKI. Nguyễn Thị Hồng Hạnh.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Chủ tịch Hội đồng chuyên môn, Healthcare Therapy Center.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with features */}
          <div className="col-span-2">
            <div className="bg-[#79C5E7C2] rounded-lg py-4 px-8 mb-10">
              <h3 className="font-semibold text-2xl text-[#222222]">
                Điểm đặc biệt của chúng tôi
              </h3>
            </div>

            <FeatureItem
              title="Không gian yên bình - thư giãn"
              description="Giữa phố thị ồn ào, Healthcare Therapy center mang đến một không gian ấm cúng, yên bình. Từng chi tiết được chăm chút kỹ lưỡng để mỗi khách hàng ghé thăm đều được tận hưởng sự tĩnh tại, cân bằng của thân - tâm - trí."
            />

            <FeatureItem
              title="Dịch vụ từ tâm"
              description="Vulputate bibendum erat morbi interdum diam sit. Eu sit dolor vel sodales sed nibh ut. Ac fringilla fames eget a aliquet. Gravida placerat viverra purus sed ac ultricies sem nulla."
            />

            <FeatureItem
              title="Chăm sóc sức khoẻ chủ động"
              description="Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi đề cao áp dụng các phương pháp tiên tiến kết hợp máy móc hiện đại trong điều trị. Đặc biệt, chúng tôi chú trọng Y học Dự phòng giúp khách hàng phòng ngừa các vấn đề sức khỏe trong tương lai."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
