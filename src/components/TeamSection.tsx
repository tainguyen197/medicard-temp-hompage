"use client";

import React from "react";
import Image from "next/image";

interface TeamMemberProps {
  image: string;
  description: string;
  isActive: boolean;
  index: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  description,
  isActive,
  index,
}) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${"opacity-100 scale-100"} ${
        index % 2 === 0 ? "lg:mt-20" : ""
      } flex-shrink-0 w-[230px] md:w-[283px] overflow-hidden h-fit md:pt-8 bg-white`}
    >
      <div className="rounded-4xl h-[300px] md:h-[370px] aspect-283/370 bg-[#F8F3EF] overflow-hidden">
        <Image
          src={image}
          alt="doctor"
          width={283}
          height={370}
          className="w-full h-full object-contain object-center transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="text-sm mt-4 text-black">
        <p className="leading-tight text-center whitespace-normal break-words">
          {description}
        </p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      image: "/images/doctor1.jpg",
      description:
        "Bác sĩ Đoàn Hải Yến có kinh nghiệm chuyên sâu trong lĩnh vực Cơ  Xương  Khớp - Phục hồi cơ thể.",
    },
    {
      image: "/images/doctor2.jpg",
      description:
        "Thành viên chính thức của hiệp hội Trị liệu Cột sống Thần Kinh Chiropractic tại Úc. Thạc sĩ - Bác sĩ Mai Linh đảm nhiệm vai trò Bác sĩ lâm sàng tại nhiều quốc gia tiên tiến trên thế giới như: Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor3.jpg",
      description:
        "Hơn 15 năm trong lĩnh vực Phục Hồi Chức Năng và Nội Cơ Xương Khớp, Y Học Cổ Truyền, có kinh nghiệm điều trị những trường hợp khó và phức tạp",
    },
    {
      image: "/images/doctor4.jpg",
      description:
        "Nhiều năm kinh nghiệm trong lĩnh vực Vật Lý Trị Liệu - Phục Hồi Chức Năng",
    },
  ];

  // Duplicate members four times for seamless infinite loop marquee
  const slidingMembers = [...teamMembers, ...teamMembers, ...teamMembers];

  return (
    <section className="pt-10 md:pt-20 pb-0 md:pb-28 bg-white ">
      <div className="mx-auto relative">
        <div className="relative mx-auto">
          {/* Title with horizontal lines on sides */}
          <div className="hidden lg:block border-[3px] border-[#002447] rounded-[40px] py-8  max-w-[1400px] absolute inset-0 -top-8 mx-32 2xl:mx-auto bottom-[-52px]" />
          <div>
            <div className="flex items-center justify-center relative md:top-[-54px] ">
              <h2 className="font-cormorant text-xl md:text-5xl font-bold text-[#002447] uppercase whitespace-nowrap bg-white px-8">
                ĐỘI NGŨ CHUYÊN GIA
              </h2>
            </div>

            {/* Team members marquee slider */}
            <div className="overflow-hidden py-8 bg-white relative z-1">
              <div className="flex gap-8 md:gap-8 whitespace-nowrap marquee">
                {slidingMembers.map((member, index) => (
                  <TeamMember
                    key={index}
                    index={index}
                    image={member.image}
                    description={member.description}
                    isActive={true}
                  />
                ))}
              </div>
            </div>
            <style jsx>{`
              .marquee {
                display: flex;
                gap: 2rem;
                animation: marquee 30s linear infinite;
                will-change: transform;
              }
              @keyframes marquee {
                0% {
                  transform: translate3d(0, 0, 0);
                }
                100% {
                  transform: translate3d(-25%, 0, 0);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
