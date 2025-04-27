"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TeamMemberProps {
  image: string;
  name: string;
  qualification: string;
  title: string;
  description: string;
  isActive: boolean;
  index: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  name,
  qualification,
  title,
  description,
  isActive,
  index,
}) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${"opacity-100 scale-100"} ${
        index % 2 === 0 ? "mt-20" : ""
      } flex-shrink-0 w-full sm:w-[280px] overflow-hidden h-fit py-16 bg-white`}
    >
      <div className=" rounded-tl-xl rounded-tr-xl h-[380px] bg-[#F8F3EF] overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="bg-[#1C4F8E] py-3 px-4 text-white flex flex-col rounded-br-xl rounded-bl-xl">
        <div className="text-sm text-[#A8C1E0] mb-0.5 text-right pr-1">
          {qualification}
        </div>
        <h3 className="text-xl font-bold uppercase text-right pr-1">{name}</h3>
      </div>
      <div className="text-sm mt-4 text-black">
        <p className="leading-tight text-center">{title}</p>
        <p className="leading-tight mt-2 text-center">{description}</p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    {
      image: "/images/doctor1.jpg",
      name: "PHẠM XUÂN ĐA",
      qualification: "PGS. TS. BS",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor2.jpg",
      name: "NGUYỄN THỊ MAI LINH",
      qualification: "ThS. BS",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor3.jpg",
      name: "NGUYỄN VĂN THỊNH",
      qualification: "BS. CK",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor4.jpg",
      name: "NGUYỄN THỊ HỒNG HẠNH",
      qualification: "BS. CKI",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor1.jpg",
      name: "LÊ VĂN THÁI",
      qualification: "ThS. BS",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
    {
      image: "/images/doctor2.jpg",
      name: "TRẦN MINH ANH",
      qualification: "BS. CKI",
      title: "Thành viên chính thức của hiệp hội Trị liệu",
      description:
        "Bác sĩ làm sàng tại nhiều quốc gia tiên tiến trên thế giới như Úc, Singapore, Việt Nam.",
    },
  ];

  useEffect(() => {
    // Set visible count based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex =
          (current + 1) % (teamMembers.length - visibleCount + 1);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [teamMembers.length, visibleCount]);

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

  const nextSlide = () => {
    setActiveIndex((current) => {
      const max = teamMembers.length - visibleCount;
      return current < max ? current + 1 : 0;
    });
  };

  const prevSlide = () => {
    setActiveIndex((current) => {
      const max = teamMembers.length - visibleCount;
      return current > 0 ? current - 1 : max;
    });
  };

  return (
    <section className="py-20 bg-white ">
      <div className="mx-auto px-4 relative container">
        <div className="relative mx-auto">
          {/* Title with horizontal lines on sides */}
          <div className="border-[3px] border-[#002447] rounded-[40px] py-8 mx-auto max-w-[1400px]">
            <div className="flex items-center justify-center relative top-[-54px] ">
              <h2 className="font-cormorant text-3xl md:text-5xl font-bold text-[#002447] uppercase whitespace-nowrap bg-white px-8">
                ĐỘI NGŨ CHUYÊN GIA
              </h2>
            </div>

            {/* Team members slider */}
            <div className="relative">
              <div
                ref={slideContainerRef}
                className="flex gap-24 overflow-x-visible scrollbar-hide snap-x pb-8 px-4 md:px-8 justify-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {teamMembers.map((member, index) => (
                  <TeamMember
                    key={index}
                    index={index}
                    image={member.image}
                    name={member.name}
                    qualification={member.qualification}
                    title={member.title}
                    description={member.description}
                    isActive={
                      index >= activeIndex && index < activeIndex + visibleCount
                    }
                  />
                ))}
              </div>

              {/* Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({
                  length: teamMembers.length - visibleCount + 1,
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-[#1C4F8E] w-[30px]"
                        : "bg-gray-300 w-2"
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

export default TeamSection;
