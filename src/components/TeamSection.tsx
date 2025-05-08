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
  console.log(index);
  return (
    <div
      className={`flex-shrink-0 w-[280px] md:w-[310px] overflow-hidden bg-white flex flex-col mb-8 ${
        index % 2 === 0 ? "md:mt-20" : ""
      }`}
    >
      <div className="relative rounded-3xl md:rounded-t-4xl overflow-hidden">
        <div className="aspect-[3/4] relative">
          <Image
            src={image}
            alt={name}
            fill
            className="w-full h-full object-contain object-center transition-transform duration-500"
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
      image: "/images/doctor1.jpg",
      name: "ĐOÀN HẢI YẾN",
      title: "BS. CK",
      description:
        "Bác sĩ Đoàn Hải Yến có kinh nghiệm chuyên sâu trong lĩnh vực Cơ Xương Khớp - Phục hồi cơ thể.",
    },
    {
      image: "/images/doctor2.jpg",
      name: "NGUYỄN THỊ MAI LINH",
      title: "THS. BS",
      description:
        "Thành viên chính thức của hiệp hội Trị liệu Cột sống Thần Kinh Chiropractic tại Úc. Thạc sĩ - Bác sĩ Mai Linh đảm nhiệm vai trò Bác sĩ lâm sàng tại nhiều quốc gia tiên tiến trên thế giới như: Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor3.jpg",
      name: "NGUYỄN VĂN THỊNH",
      title: "BS. CK",
      description:
        "Hơn 15 năm trong lĩnh vực Phục Hồi Chức Năng và Nội Cơ Xương Khớp, Y Học Cổ Truyền, có kinh nghiệm điều trị những trường hợp khó và phức tạp",
    },
    {
      image: "/images/doctor4.jpg",
      name: "NGUYỄN THỊ HỒNG HẠNH",
      title: "BS. CK",
      description:
        "Nhiều năm kinh nghiệm trong lĩnh vực Vật Lý Trị Liệu - Phục Hồi Chức Năng",
    },
  ];

  const slidingContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-advance team members every 4 seconds if autoSlide is enabled
  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % teamMembers.length;
      setCurrentIndex(nextIndex);

      // Scroll to the next item
      if (slidingContainerRef.current) {
        const itemWidth = isMobile ? 290 : 350; // Adjust based on item width + gap
        slidingContainerRef.current.scrollTo({
          left: nextIndex * itemWidth,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, teamMembers.length, autoSlide, isMobile]);

  // Pause auto-slide when user interacts with the slider
  const pauseAutoSlide = () => {
    setAutoSlide(false);
    // Resume after 10 seconds of inactivity
    setTimeout(() => setAutoSlide(true), 10000);
  };

  const scrollTeam = (direction: "left" | "right") => {
    pauseAutoSlide();

    if (slidingContainerRef.current) {
      const scrollAmount = isMobile ? 290 : 350; // Adjust based on item width + gap
      const newIndex =
        direction === "left"
          ? Math.max(0, currentIndex - 1)
          : Math.min(teamMembers.length - 1, currentIndex + 1);

      setCurrentIndex(newIndex);

      slidingContainerRef.current.scrollTo({
        left: newIndex * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle touch events to pause auto-slide
  const handleTouch = () => {
    pauseAutoSlide();
  };

  return (
    <section className="md:pt-20 md:pb-28 bg-white">
      <div className="mx-auto relative">
        <div className="relative mx-auto">
          {/* Title with horizontal lines on sides */}
          <div className="hidden lg:block border-[3px] border-[#002447] rounded-[40px] py-8 max-w-[1300px] absolute inset-0 -top-8 mx-32 2xl:mx-auto bottom-[-52px]" />
          <div>
            <div className="flex items-center justify-center relative md:top-[-54px]">
              <h2 className="font-cormorant text-xl md:text-5xl font-bold text-[#002447] uppercase whitespace-nowrap bg-white px-8">
                ĐỘI NGŨ CHUYÊN GIA
              </h2>
            </div>

            {/* Team members section */}
            {isMobile ? (
              // Mobile view always uses slider
              <div className="relative py-8 pb-0 bg-white z-1 px-4">
                <div
                  ref={slidingContainerRef}
                  className="flex gap-4 overflow-x-auto no-scrollbar px-10 pb-4 snap-x snap-mandatory"
                  style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
                  onTouchStart={handleTouch}
                  onMouseDown={handleTouch}
                >
                  {teamMembers.map((member, index) => (
                    <div key={index} className="snap-center">
                      <TeamMember {...member} index={index} />
                    </div>
                  ))}
                </div>

                {/* Pagination indicators */}
              </div>
            ) : (
              // Desktop view uses grid layout if 4 or fewer items, else slider
              <div className="pt-8 bg-white relative z-1">
                {teamMembers.length <= 4 ? (
                  <div className="flex justify-center flex-wrap gap-8 md:gap-14 px-4">
                    {teamMembers.map((member, index) => (
                      <TeamMember {...member} index={index} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="relative px-4 md:px-10">
                    <button
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
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
                    <div
                      ref={slidingContainerRef}
                      className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar px-10 snap-x snap-mandatory"
                      style={{
                        scrollBehavior: "smooth",
                        scrollbarWidth: "none",
                      }}
                      onTouchStart={handleTouch}
                      onMouseDown={handleTouch}
                    >
                      {teamMembers.map((member, index) => (
                        <div key={index} className="snap-center">
                          <TeamMember {...member} index={index} />
                        </div>
                      ))}
                    </div>
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
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

                    {/* Pagination indicators */}
                    <div className="flex justify-center mt-4 gap-2">
                      {teamMembers.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                              ? "bg-[#1C4B82] w-4"
                              : "bg-gray-300"
                          }`}
                          onClick={() => {
                            pauseAutoSlide();
                            setCurrentIndex(index);
                            if (slidingContainerRef.current) {
                              slidingContainerRef.current.scrollTo({
                                left: index * 350,
                                behavior: "smooth",
                              });
                            }
                          }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
