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
      className={`transition-all duration-700 ease-in-out flex-shrink-0 w-full md:w-1/2 flex items-center justify-center`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-[300px] lg:h-[400px] xl:h-[604px] aspect-537/604 overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={subtitle}
          fill
          className={`rounded-2xl overflow-hidden object-over transition-opacity duration-300 ${
            isHovered ? "opacity-20" : "opacity-100"
          }`}
        />

        {isHovered && (
          <div className="absolute inset-0 bg-black opacity-70 flex flex-col justify-center p-8 md:p-16 text-white transition-all duration-300">
            <div className="text-[#A8C1E0] text-sm uppercase mb-1">{title}</div>
            <h3 className="text-2xl font-bold uppercase mb-6">{subtitle}</h3>
            <p className="text-xs md:text-md leading-relaxed text-justify">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const EquipmentSection: React.FC = () => {
  const equipments: EquipmentItem[] = [
    {
      id: "equip1",
      image: "/images/equipment_1.png",
      title: "THIẾT BỊ",
      subtitle: "SHOCKWAVE THERAPY",
      description:
        "Sử dụng sóng xung kích tạo áp lực cơ học và sức căng lên mô tổn thương, làm tăng tính thấm của màng tế bào, giúp tăng tuần hoàn tại chỗ và chuyển hóa tại phần mô được điều trị.",
    },
    {
      id: "equip2",
      image: "/images/equipment_2.png",
      title: "THIẾT BỊ",
      subtitle: "Laser công suất cao thông minh",
      description:
        "Dùng tia Laser tần số cao đi vào mô cơ, mô xương giúp giảm đau, tăng tốc chuyển hóa, giúp phục hồi tế bào nhanh hơn từ đó nâng cao khả năng điều trị và làm lành lại vết thương",
    },
    {
      id: "equip3",
      image: "/images/equipment_3.png",
      title: "THIẾT BỊ",
      subtitle: "Winback Thecar Therapy",
      description:
        "Sử dụng các dòng điện đặc trị tác động lên vùng cơ bị tắt nghẽn. Từ đó kích thích thần kinh cơ, chống teo cơ, kháng viêm, giảm đau",
    },
    {
      id: "equip4",
      image: "/images/equipment_4.png",
      title: "THIẾT BỊ",
      subtitle: "Điện xung kết hợp siêu âm",
      description:
        "Sử dụng sóng siêu âm tác động đến mô cơ giúp giảm sưng nề mô mềm, giảm đau, giảm co cứng, tăng cường tuần hoàn máu, làm đẩy nhanh quá trình làm lành và hồi phục chức năng.",
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
        setVisibleCount(2);
      } else {
        setVisibleCount(2);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveIndex((current) => {
      const max = equipments.length - visibleCount;
      return current < max ? current + 1 : 0;
    });
    startAutoScroll();
  };

  const handlePrev = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveIndex((current) => {
      const max = equipments.length - visibleCount;
      return current > 0 ? current - 1 : max;
    });
    startAutoScroll();
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

  // Initialize auto-scroll and clear on unmount
  useEffect(() => {
    startAutoScroll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipments.length, visibleCount]);

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
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 xl:px-16 2xl:px-32">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-xl md:text-5xl font-cormorant font-bold text-gray-900 uppercase mb-4">
            CÔNG NGHỆ
          </h2>
          <p className="text-xs md:text-xl text-gray-700">
            Áp dụng công nghệ tiên tiến trong chẩn đoán và điều trị
          </p>
        </div>

        <div className="relative px-4">
          {/* Slider with arrow controls */}
          <div
            ref={slideContainerRef}
            className="flex gap-0 overflow-x-hidden scrollbar-hide snap-x justify-start"
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
          <div className="grid grid-cols-2 gap-2 items-center">
            <button
              onClick={handlePrev}
              className="h-9 w-9 flex items-center justify-center border-[1.5px] text-[#002447] border-[#99D3ED] p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Previous equipment"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="h-9 w-9 flex items-center justify-center border-[1.5px] text-[#002447] border-[#99D3ED] p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Next equipment"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
