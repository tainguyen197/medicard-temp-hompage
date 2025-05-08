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
  <div className="mb-6 md:mb-10 ml-2 md:ml-8">
    <div className="flex items-start mb-2">
      <span className="text-blue-700 mr-3 flex-shrink-0 mt-1">
        <StarburstIcon size={24} className="text-[#002447] size-4 md:size-6" />
      </span>
      <h3 className="font-bold text-md md:text-xl text-gray-800">{title}</h3>
    </div>
    <p className="text-[#909090] text-justify text-sm md:text-md">
      {description}
    </p>
  </div>
);

const AboutSection = () => {
  return (
    <section id="about" className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="md:grid md:grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column with title */}
          <div className="col-span-3">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-3">
                  <StarburstIcon
                    size={24}
                    className="text-[#002447] size-4 md:size-6"
                  />
                </span>
                <h3 className="uppercase font-cormorant font-bold text-[#2B3D96] tracking-wider text-sm md:text-md">
                  VỀ HEALTHCARE THERAPY CENTER
                </h3>
              </div>
            </div>

            <h2 className="font-cormorant font-bold text-2xl md:text-[46px] xl:text-[51px] text-navy-800 mb-10 md:mb-20 leading-[140%] text-[#002447]">
              GIẢI PHÁP CHĂM SÓC SỨC KHOẺ TOÀN DIỆN
            </h2>

            <div className="relative flex rounded-lg overflow-hidden border border-gray-200 mb-8">
              <div className="relative h-[143px] aspect-120/143 md:h-[232px] md:aspect-232/270">
                <Image
                  src="/images/about-us.png"
                  alt="Healthcare Therapy Center Professional"
                  fill
                  className="relative object-cover"
                />
              </div>
              <div className="bg-white p-2 md:p-12 flex flex-col justify-between relative leading-[140%]">
                <blockquote className="mb-3 font-bold text-sm md:text-lg text-gray-800">
                  &ldquo;Mỗi khách hàng đều là &ldquo;người thân&rdquo; mà đội
                  ngũ Healthcare Therapy Center tận tâm phục vụ.&rdquo;
                </blockquote>
                <div>
                  <p className="md:font-bold text-gray-800 text-xs md:text-md">
                    BS CKI. Nguyễn Thị Hồng Hạnh.
                  </p>
                  <p className="md:block hidden text-gray-600 text-sm">
                    Healthcare Therapy Center.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with features */}
          <div className="col-span-2">
            <div className="bg-[#79C5E7C2] rounded-lg py-2 px-4 md:py-4 md:px-8 mb-4 md:mb-10">
              <h3 className="font-semibold text-md md:text-2xl text-[#222222]">
                Điểm đặc biệt của chúng tôi
              </h3>
            </div>

            <FeatureItem
              title="Không gian yên bình - thư giãn"
              description="Giữa phố thị ồn ào, Healthcare Therapy center mang đến một không gian ấm cúng, yên bình. Từng chi tiết được chăm chút kỹ lưỡng để mỗi khách hàng ghé thăm đều được tận hưởng sự tĩnh tại, cân bằng của thân - tâm - trí."
            />

            <FeatureItem
              title="Dịch vụ từ tâm"
              description="Tại Healthcare Therapy Center, chúng tôi không chỉ cung cấp liệu pháp, mà còn trao trọn sự tận tâm trong từng dịch vụ. Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi"
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
