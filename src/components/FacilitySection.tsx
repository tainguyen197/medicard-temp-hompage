"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";

interface FacilityItemProps {
  image: string;
  title: string;
  description: string;
}

const FacilityItem: React.FC<FacilityItemProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <div className="flex-shrink-0 w-full sm:w-[340px] px-3 mx-auto">
      <div className="mb-5 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="object-cover h-[250px] md:h-[420px] aspect-200/250 w-full transition-transform duration-700 hover:scale-110"
        />
      </div>
      <h3 className="text-black text-sm md:text-xl font-bold mb-1">{title}</h3>
      <p className="text-black text-sm md:text-md">{description}</p>
    </div>
  );
};

interface ArrowProps {
  onClick?: () => void;
  className?: string;
}

const FacilitySection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  const facilities = [
    {
      image: "/images/spacing/1.png",
      title: "Tư vấn chuyên gia",
      description: "Tận tình kỹ lưỡng về tinh trạng bệnh lý",
    },
    {
      image: "/images/spacing/2.png",
      title: "Bác sĩ đồng hành",
      description: "Trực tiếp thăm khám và kiểm tra tình trạng",
    },
    {
      image: "/images/spacing/3.png",
      title: "Không gian",
      description: "Tinh tế, sang trọng, thoải mái, riêng tư",
    },
    {
      image: "/images/spacing/4.png",
      title: "Chăm sóc chuẩn  mực",
      description: "Bác sĩ tay nghề chuyên môn cao, giàu kinh nghiệm",
    },
    {
      image: "/images/spacing/5.png",
      title: "Kỹ thuật hiện đại",
      description:
        "Máy móc công nghệ cao, kỹ thuật tiên tiến được thực hiện trực tiếp bởi các bác sĩ chuyên ngành",
    },
    {
      image: "/images/spacing/6.png",
      title: "Chu đáo, từ tâm",
      description: "Đội ngũ kỹ thuật viên lành nghề, kinh nghiệm",
    },
    {
      image: "/images/spacing/7.png",
      title: "Khách hàng là trung tâm",
      description: "Thái độ tập trung, tận tâm trong suốt quá trình điều trị",
    },
  ];

  // Custom arrow components
  const PrevArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="text-black hover:bg-gray-100 transition"
        aria-label="Previous slide"
      >
        <span className="text-2xl font-semibold">&lt;</span>
      </button>
    );
  };

  const NextArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="text-black hover:bg-gray-100 transition"
        aria-label="Next slide"
      >
        <span className="text-2xl font-semibold">&gt;</span>
      </button>
    );
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
    variableWidth: true,
    centerMode: false,
  };

  return (
    <section
      className="py-10 md:py-16 md:pb-12"
      style={{ background: "#FEF6EA" }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="w-full md:w-1/3 pr-0 md:pr-12 overflow-hidden">
            <h2 className="text-xl md:text-5xl font-cormorant font-bold text-gray-900 mb-6 uppercase">
              KHÔNG GIAN
            </h2>
            <p className="text-sm md:text-[20px] text-[#797979] mb-10 md:mb-20">
              Tại Healthcare Therapy Center, từng chi tiết đều được chăm chút kỹ
              lưỡng để mang đến trải nghiệm hoàn hảo cho khách hàng.
            </p>
            <div className="h-0.5 w-32 bg-gray-400 md:mb-10"></div>
          </div>

          <div className="w-full md:w-2/3 relative overflow-hidden">
            <div className="facility-slider -mx-3 sm:-mx-0">
              <Slider ref={sliderRef} {...settings}>
                {facilities.map((facility, index) => (
                  <FacilityItem
                    key={index}
                    image={facility.image}
                    title={facility.title}
                    description={facility.description}
                  />
                ))}
              </Slider>
            </div>
            <div className="relative mt-8 flex justify-between gap-4">
              {/* Progress indicator bar */}
              <div className="h-[2px] bg-gray-400 relative w-11/12">
                <div
                  className="h-full bg-black absolute left-0 top-0 transition-all duration-300"
                  style={{
                    width: `${
                      (((currentSlide % facilities.length) + 1) /
                        facilities.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              {/* Navigation arrows */}
              <div className="transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="text-black hover:bg-gray-100 transition"
                  aria-label="Previous slide"
                >
                  <span className="text-2xl font-semibold">&lt;</span>
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="text-black hover:bg-gray-100 transition"
                  aria-label="Next slide"
                >
                  <span className="text-2xl font-semibold">&gt;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Custom styling for the facility slider */
        .facility-slider .slick-track {
          display: flex !important;
          margin-left: 0 !important;
        }

        .facility-slider .slick-slide {
          height: auto;
          opacity: 0.4;
          transform: scale(0.95);
          transition: all 0.7s ease-in-out;
        }

        .facility-slider .slick-slide.slick-active.slick-current {
          opacity: 1;
          transform: scale(1);
        }

        .facility-slider .slick-list {
          overflow: hidden !important;
        }
      `}</style>
    </section>
  );
};

export default FacilitySection;
