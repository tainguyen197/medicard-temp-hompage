"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
      } flex-shrink-0 w-full sm:w-[340px]`}
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
      const gap = 24; // same as space-x-6
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const desired = activeIndex * (itemWidth + gap);
      const scrollPosition = Math.min(desired, maxScrollLeft);
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
    <section className="py-16" style={{ background: "#FEF6EA" }}>
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

          <div className="w-full md:w-2/3 relative overflow-x-visible overflow-y-hidden">
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
            <div className="relative mt-8 flex justify-between gap-4">
              {/* Progress indicator bar */}
              <div className="h-[2px] bg-gray-400 relative w-11/12">
                <div
                  className="h-full bg-black absolute left-0 top-0"
                  style={{
                    width: `${((activeIndex + 1) / facilities.length) * 100}%`,
                  }}
                />
              </div>
              {/* Navigation arrows */}
              <div className="transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={prevSlide}
                  className=" text-black hover:bg-gray-100 transition"
                  aria-label="Previous slide"
                >
                  <span className="text-2xl font-semibold">&lt;</span>
                </button>
                <button
                  onClick={nextSlide}
                  className=" text-black hover:bg-gray-100 transition"
                  aria-label="Next slide"
                >
                  <span className="text-2xl font-semibold">&gt;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitySection;
