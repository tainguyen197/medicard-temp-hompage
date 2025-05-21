"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
// Import Slick components
import Slider from "react-slick";
// CSS is already imported in the layout.tsx file

interface TeamMember {
  image: string;
  description: string;
  name: string;
  title: string;
}

interface TeamMemberProps {
  image: string;
  description: string;
  name: string;
  title: string;
  index: number;
}

// Define types for arrow props
interface ArrowProps {
  onClick?: () => void;
  className?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  description,
  name,
  title,
  index,
}) => {
  return (
    <div
      className={`flex-shrink-0 w-full sm:w-[230px] md:w-[230px] lg:w-[250px] xl:w-[280px] overflow-hidden bg-white flex flex-col mb-8 ${
        index % 2 !== 0 ? "md:mt-20" : ""
      }`}
    >
      <div className="relative rounded-3xl md:rounded-t-4xl overflow-hidden">
        <div className="aspect-[3/4] relative">
          <Image
            src={image}
            alt={name}
            fill
            className="w-full h-full object-cover object-top transition-transform duration-500"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-[#1C4B82] text-white py-2 px-4 flex flex-col items-center">
          <p className="text-sm uppercase">{title}</p>
          <h3 className="text-lg font-cormorant uppercase font-bold">{name}</h3>
        </div>
      </div>
      <div className="p-4 text-black text-center">
        <p className="text-sm text-justify leading-tight">{description}</p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      image: "/images/doctor4.jpg",
      name: "NGUYỄN THỊ HỒNG HẠNH",
      title: "BS. CK",
      description:
        "Nhiều năm kinh nghiệm trong lĩnh vực Vật Lý Trị Liệu - Phục Hồi Chức Năng",
    },
    {
      image: "/images/doctor3.jpg",
      name: "NGUYỄN VĂN THỊNH",
      title: "BS. CK",
      description:
        "Hơn 15 năm trong lĩnh vực Phục Hồi Chức Năng và Nội Cơ Xương Khớp, Y Học Cổ Truyền, có kinh nghiệm điều trị những trường hợp khó và phức tạp",
    },
    {
      image: "/images/doctor2.jpg",
      name: "NGUYỄN THỊ MAI LINH",
      title: "THS. BS",
      description:
        "Thành viên chính thức của hiệp hội Trị liệu Cột sống Thần Kinh Chiropractic tại Úc. Thạc sĩ - Bác sĩ Mai Linh đảm nhiệm vai trò Bác sĩ lâm sàng tại nhiều quốc gia tiên tiến trên thế giới như: Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor1.jpg",
      name: "ĐOÀN HẢI YẾN",
      title: "BS. CK",
      description:
        "Bác sĩ Đoàn Hải Yến có kinh nghiệm chuyên sâu trong lĩnh vực Cơ Xương Khớp - Phục hồi cơ thể.",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkDisplay = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };

    checkDisplay();
    window.addEventListener("resize", checkDisplay);
    return () => window.removeEventListener("resize", checkDisplay);
  }, []);

  // Custom arrow components
  const PrevArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        className="absolute left-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
        onClick={onClick}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path
            d="M15 19l-7-7 7-7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const NextArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        className="absolute right-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
        onClick={onClick}
        aria-label="Next slide"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path
            d="M9 5l7 7-7 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0",
        },
      },
    ],
  };

  return (
    <section className="pt-10 md:pt-16 md:pb-20 bg-white">
      <div className="mx-auto relative">
        <div className="relative mx-auto">
          {/* Title with horizontal lines on sides */}
          <div className="hidden lg:block border-[3px] border-[#002447] rounded-[40px] py-8 max-w-[1300px] absolute inset-0 -top-8 mx-32 2xl:mx-auto bottom-[-52px]" />
          <div>
            <div className="flex items-center justify-center relative md:top-[-54px]">
              <h2 className="font-cormorant text-xl md:text-5xl max-text-[51px] font-bold text-[#002447] uppercase whitespace-nowrap bg-white px-8">
                ĐỘI NGŨ CHUYÊN GIA
              </h2>
            </div>

            {/* Team members section with React Slick */}
            <div className="pt-8 bg-white relative z-1">
              <div className="relative py-4 pb-0 bg-white z-1 px-4 md:px-10 max-w-[1300px] mx-auto">
                <Slider ref={sliderRef} {...settings} className="team-slider">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="px-2">
                      <TeamMember {...member} index={index} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Custom styling for the slider */
        .team-slider .slick-track {
          display: flex !important;
          align-items: flex-start;
        }

        .team-slider .slick-slide {
          height: auto;
          padding: 0 8px;
        }

        /* Fix height issues */
        .team-slider .slick-list {
          overflow: visible;
          padding: 0 !important;
        }

        /* Make sure alternating cards have the correct offset */
        .team-slider .slick-slide:nth-child(even) .md\\:mt-20 {
          margin-top: 5rem;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
