import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-section.png"
          alt="News Hero"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default HeroSection;
