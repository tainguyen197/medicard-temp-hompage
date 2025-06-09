"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface TestimonialSwiperProps {
  testimonials: Testimonial[];
}

export default function TestimonialSwiper({
  testimonials,
}: TestimonialSwiperProps) {
  // Static images for testimonials (could be made dynamic later)
  const testimonialImages = [
    "/images/testimonial_1.png",
    "/images/testimonial_2.webp",
    "/images/testimonial_3.png",
    "/images/testimonial_4.png",
  ];

  return (
    <div className="absolute h-[480px] -bottom-[40px] w-full mx-auto px-6 pb-16 md:pb-20 left-[400px]">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="h-auto">
            <div className="relative bg-[#182134] p-8 border-8 border-white rounded-2xl aspect-square h-[400px] max-w-sm mx-auto flex flex-col justify-between">
              <div>
                <div className="text-4xl text-white mb-4">
                  <svg
                    width="50"
                    height="38"
                    viewBox="0 0 50 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.563921 38V27.7727C0.563921 24.7543 1.1321 21.576 2.26847 18.2379C3.40483 14.8999 4.98509 11.7038 7.00923 8.64986C9.03338 5.59588 11.4126 2.98579 14.147 0.819603L22.0305 6.4659C19.8643 9.62642 18.0178 12.929 16.4908 16.3736C14.9638 19.8182 14.2003 23.5646 14.2003 27.6129V38H0.563921ZM27.7301 38V27.7727C27.7301 24.7543 28.2983 21.576 29.4347 18.2379C30.571 14.8999 32.1513 11.7038 34.1754 8.64986C36.1996 5.59588 38.5788 2.98579 41.3132 0.819603L49.1967 6.4659C47.0305 9.62642 45.184 12.929 43.657 16.3736C42.13 19.8182 41.3665 23.5646 41.3665 27.6129V38H27.7301Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <p className="text-white text-justify text-sm md:text-[17px] mb-4 leading-[160%]">
                  {testimonial.quote}
                </p>
              </div>
              <div className="flex items-center mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={
                      testimonialImages[index] || "/images/testimonial_1.png"
                    }
                    alt={testimonial.name}
                    fill
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg md:text-xl">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
