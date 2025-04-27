"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface EquipmentItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface EquipmentItemProps extends EquipmentItem {
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({
  id,
  image,
  title,
  subtitle,
  description,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave();
  };

  return (
    <div
      id={id}
      className={`transition-all duration-700 ease-in-out ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      } flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        <div className="relative">
          <Image
            src={image}
            alt={subtitle}
            width={500}
            height={600}
            className={`object-contain transition-opacity duration-300 ${
              isHovered ? "opacity-20" : "opacity-100"
            }`}
          />

          {isHovered && (
            <div className="absolute inset-0 bg-black opacity-70 flex flex-col justify-center p-8 text-white transition-all duration-300">
              <div className="text-[#A8C1E0] text-sm uppercase mb-1">
                {title}
              </div>
              <h3 className="text-2xl font-bold uppercase mb-6">{subtitle}</h3>
              <p className="text-md leading-relaxed">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EquipmentSection: React.FC = () => {
  const equipments: EquipmentItem[] = [
    {
      id: "equip1",
      image: "/images/equipment.jpg",
      title: "THIẾT BỊ",
      subtitle: "SHOCKWAVE THERAPY",
      description:
        "Sử dụng sóng xung kích tạo áp lực cơ học và sức căng lên mô tổn thương, làm tăng tính thấm của màng tế bào, giúp tăng tuần hoàn tại chỗ và chuyển hoá tại phần mô được điều trị.",
    },
    {
      id: "equip2",
      image: "/images/shockwave.jpg",
      title: "THIẾT BỊ",
      subtitle: "SPINAL DECOMPRESSION",
      description:
        "Giảm áp lực cho đĩa đệm cột sống, giải phóng chèn ép dây thần kinh, giúp đưa nước và chất dinh dưỡng trở lại đĩa đệm, tạo điều kiện cho quá trình tự phục hồi.",
    },
    {
      id: "equip3",
      image: "/images/machine.jpg",
      title: "THIẾT BỊ",
      subtitle: "LASER THERAPY",
      description:
        "Tăng cường tuần hoàn máu, giảm đau, giảm viêm, thúc đẩy tái tạo tế bào và mô. Laser trị liệu có thể thâm nhập sâu vào mô mà không gây tổn thương.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update visible count based on screen width
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleNext = () => {
    setActiveIndex((current) => {
      const max = equipments.length - visibleCount;
      return current < max ? current + 1 : 0;
    });
  };

  const handlePrev = () => {
    setActiveIndex((current) => {
      const max = equipments.length - visibleCount;
      return current > 0 ? current - 1 : max;
    });
  };

  // Handle mouse enter to pause the animation
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle mouse leave to resume the animation
  const handleMouseLeave = () => {
    setIsPaused(false);
    startAutoScroll();
  };

  // Start auto scrolling
  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 3000);
  };

  useEffect(() => {
    // Initialize auto-scroll
    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (slideContainerRef.current) {
      const container = slideContainerRef.current;
      const itemWidth = container.querySelector("div")?.offsetWidth || 0;
      const scrollPosition = activeIndex * itemWidth;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 uppercase mb-4">
            CÔNG NGHỆ
          </h2>
          <p className="text-xl text-gray-700">
            Áp dụng công nghệ tiên tiến trong chẩn đoán và điều trị
          </p>
        </div>

        <div className="relative px-4">
          <div
            ref={slideContainerRef}
            className="flex gap-6 overflow-x-hidden scrollbar-hide snap-x -mx-3 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {equipments.map((equip, index) => (
              <EquipmentItem
                key={equip.id}
                id={equip.id}
                image={equip.image}
                title={equip.title}
                subtitle={equip.subtitle}
                description={equip.description}
                isActive={
                  index >= activeIndex && index < activeIndex + visibleCount
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10 space-x-4">
          <div className="flex space-x-2 items-center">
            {Array.from({
              // Calculate how many indicator dots we need based on items and visible count
              length: Math.max(1, equipments.length - visibleCount + 1),
            }).map((_, index) => (
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
    </section>
  );
};

export default EquipmentSection;
