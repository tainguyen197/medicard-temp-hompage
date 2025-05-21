"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

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

  const slidingContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [useSlider, setUseSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  // Check for mobile viewport and if slider should be used
  useEffect(() => {
    const checkDisplay = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Check if we need slider on larger screens (when items don't fit)
      if (!isMobileView && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const itemWidth = 250; // Approximate width of each item including gap
        const totalWidth = itemWidth * teamMembers.length;
        setUseSlider(totalWidth > containerWidth);
      }
    };

    checkDisplay();
    window.addEventListener("resize", checkDisplay);
    return () => window.removeEventListener("resize", checkDisplay);
  }, [teamMembers.length]);

  // Auto-advance if slider is active
  useEffect(() => {
    if (!autoSlide || (!isMobile && !useSlider)) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % teamMembers.length;
      setCurrentIndex(nextIndex);

      // Scroll to the next item
      if (slidingContainerRef.current) {
        const itemWidth = isMobile
          ? slidingContainerRef.current.clientWidth
          : 250; // Approximate width of each item + gap

        // For looping effect
        const totalWidth = itemWidth * teamMembers.length;
        const currentPosition = slidingContainerRef.current.scrollLeft;

        if (nextIndex === 0 && currentPosition > 0) {
          // If we're at the end and looping back to start
          slidingContainerRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          slidingContainerRef.current.scrollTo({
            left: nextIndex * itemWidth,
            behavior: "smooth",
          });
        }
      }
    }, 3000); // Changed to 3 seconds per slide

    return () => clearInterval(interval);
  }, [currentIndex, teamMembers.length, autoSlide, isMobile, useSlider]);

  // Pause auto-slide when user interacts with the slider
  const pauseAutoSlide = () => {
    setAutoSlide(false);
    // Resume after 10 seconds of inactivity
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const scrollTeam = (direction: "left" | "right") => {
    pauseAutoSlide();

    if (slidingContainerRef.current) {
      const scrollAmount = isMobile
        ? slidingContainerRef.current.clientWidth
        : 250;

      let newIndex;
      if (direction === "left") {
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = teamMembers.length - 1; // Loop to the end
        }
      } else {
        newIndex = currentIndex + 1;
        if (newIndex >= teamMembers.length) {
          newIndex = 0; // Loop to the beginning
        }
      }

      setCurrentIndex(newIndex);

      slidingContainerRef.current.scrollTo({
        left: newIndex * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle touch events for swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoSlide();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollTeam("right");
    } else if (isRightSwipe) {
      scrollTeam("left");
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle mouse events
  const handleMouseDown = () => {
    pauseAutoSlide();
  };

  return (
    <section className="md:pt-16 md:pb-20 bg-white">
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

            {/* Team members section */}
            <div className="pt-8 bg-white relative z-1" ref={containerRef}>
              {isMobile || useSlider ? (
                // Slider view (for mobile or when desktop space is insufficient)
                <div className="relative py-4 pb-0 bg-white z-1 px-4">
                  {/* Navigation buttons - positioned at the middle of image height */}
                  <button
                    className="absolute left-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
                    onClick={() => scrollTeam("left")}
                    aria-label="Scroll left"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M15 19l-7-7 7-7"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    className="absolute right-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
                    onClick={() => scrollTeam("right")}
                    aria-label="Scroll right"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    ref={slidingContainerRef}
                    className={`flex ${
                      isMobile ? "gap-0" : "gap-4"
                    } overflow-x-hidden no-scrollbar ${
                      isMobile ? "px-0" : "px-10"
                    } pb-4 snap-x snap-mandatory`}
                    style={{
                      scrollBehavior: "smooth",
                      scrollbarWidth: "none",
                      scrollSnapType: "x mandatory",
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                  >
                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className={`snap-center ${
                          isMobile ? "min-w-full" : "min-w-[230px]"
                        } flex justify-center`}
                      >
                        <TeamMember {...member} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Desktop view with all 4 members in a row (when they fit)
                <div className="flex justify-center items-start flex-wrap md:flex-nowrap gap-4 md:gap-6 px-4 md:px-8 max-w-[1200px] mx-auto">
                  {teamMembers.map((member, index) => (
                    <TeamMember {...member} index={index} key={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
