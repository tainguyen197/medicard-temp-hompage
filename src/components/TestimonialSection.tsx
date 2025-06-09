"use client";

import React from "react";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import TestimonialSwiper from "@/components/TestimonialSwiper";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface TestimonialSectionProps {
  t: {
    testimonials: {
      title: string;
      items: Testimonial[];
    };
  };
}

export default function TestimonialSection({ t }: TestimonialSectionProps) {
  return (
    <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
      <section className="relative container py-16 md:py-24 bg-white max-w-7xl mx-auto">
        <div className="relative mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/feedback_bg.jpg"
              alt="Healthcare Center Interior"
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mb-12 text-center">
            <h2 className="font-cormorant font-bold text-2xl md:text-5xl md:max-text-[48px] leading-[140%] text-balance text-[#002447] mb-4">
              {t.testimonials.title}
            </h2>
          </div>
        </div>
        <TestimonialSwiper testimonials={t.testimonials.items} />
      </section>
    </AnimatedSection>
  );
}
