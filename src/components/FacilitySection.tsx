"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import StarburstIcon from "./StarburstIcon";

interface FacilityItemProps {
  image: string;
  title: string;
  description: string;
  isActive: boolean;
}

const FacilityItem: React.FC<FacilityItemProps> = ({
  image,
  title,
  description,
  isActive,
}) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      } flex-shrink-0 w-full sm:w-[340px] px-3`}
    >
      <div className="mb-5 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="object-cover h-[420px] w-full transition-transform duration-700 hover:scale-110"
        />
      </div>
      <h3 className="text-black text-xl font-bold mb-1">{title}</h3>
      <p className="text-black text-md">{description}</p>
    </div>
  );
};

const FacilitySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const facilities = [
    {
      image: "/images/spa1.jpg",
      title: "Ánh sáng hài hoà, ấm áp",
      description: "Không gian tinh tế, thư giãn",
    },
    {
      image: "/images/spa3.jpg",
      title: "Khăn",
      description: "Chất liệu cao cấp",
    },
    {
      image: "/images/spa4.jpg",
      title: "Dép MUJI",
      description: "Nhập khẩu từ Nhật Bản",
    },
    {
      image: "/images/therapy-room.jpg",
      title: "Giường trị liệu",
      description: "Thiết kế công thái học",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % facilities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [facilities.length]);

  useEffect(() => {
    if (slideContainerRef.current) {
      const container = slideContainerRef.current;
      const itemWidth = container.querySelector("div")?.offsetWidth || 0;
      const scrollPosition = activeIndex * (itemWidth + 24); // Add gap size

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % facilities.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + facilities.length) % facilities.length
    );
  };

  return (
    <section className="py-20" style={{ background: "#FEF6EA" }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="w-full md:w-1/3 pr-0 md:pr-12">
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-gray-900 mb-6 uppercase">
              KHÔNG GIAN
            </h2>
            <p className="text-[20px] text-[#797979] mb-20">
              Tại Healthcare Therapy Center, từng chi tiết đều được chăm chút kỹ
              lưỡng để mang đến trải nghiệm hoàn hảo cho khách hàng.
            </p>
            <div className="h-0.5 w-32 bg-gray-400 mb-10"></div>
          </div>

          <div className="w-full md:w-2/3 relative overflow-hidden">
            <div
              ref={slideContainerRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {facilities.map((facility, index) => (
                <FacilityItem
                  key={index}
                  image={facility.image}
                  title={facility.title}
                  description={facility.description}
                  isActive={index === activeIndex}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <div className="flex mt-8 justify-center md:justify-start space-x-2">
                {facilities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "bg-gray-800 w-8" : "bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitySection;
