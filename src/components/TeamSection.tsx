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
}

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  name,
  qualification,
  title,
  description,
  isActive,
}) => {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      } flex-shrink-0 w-full sm:w-[280px] overflow-hidden`}
    >
      <div className="overflow-hidden rounded-tl-2xl rounded-tr-2xl h-[400px] bg-[#F8F3EF]">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="bg-[#1C4F8E] p-5 py-4 pl-0 text-white  flex flex-col rounded-br-2xl rounded-bl-2xl">
        <div className="text-sm text-[#A8C1E0] mb-1 text-right">
          {qualification}
        </div>
        <h3 className="text-xl font-bold uppercase text-right">{name}</h3>
      </div>
      <p className="text-sm mt-4 text-center text-black">{title}</p>
      <p className="text-sm leading-relaxed text-center text-black">
        {description}
      </p>
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
    }, 4000);
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
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20 max-w-5xl mx-auto relative">
          <div className="relative inline-block">
            <div className="absolute -top-8 -left-32 w-[180px] h-[2px] bg-gray-300"></div>
            <div className="absolute -top-8 -right-32 w-[180px] h-[2px] bg-gray-300"></div>
            <div className="absolute -bottom-8 -left-32 w-[180px] h-[2px] bg-gray-300"></div>
            <div className="absolute -bottom-8 -right-32 w-[180px] h-[2px] bg-gray-300"></div>

            <div className="absolute -top-8 -left-32 w-[2px] h-[20px] bg-gray-300"></div>
            <div className="absolute -top-8 -right-32 w-[2px] h-[20px] bg-gray-300"></div>
            <div className="absolute -bottom-8 -left-32 w-[2px] h-[20px] bg-gray-300 translate-y-[2px]"></div>
            <div className="absolute -bottom-8 -right-32 w-[2px] h-[20px] bg-gray-300 translate-y-[2px]"></div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 uppercase px-8 py-2">
              ĐỘI NGŨ CHUYÊN GIA
            </h2>
          </div>
        </div>

        <div className="relative px-4">
          <div
            ref={slideContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
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

          <div className="flex justify-center mt-10 space-x-4">
            <div className="flex space-x-2 items-center">
              {Array.from({
                length: teamMembers.length - visibleCount + 1,
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
      </div>
    </section>
  );
};

export default TeamSection;
