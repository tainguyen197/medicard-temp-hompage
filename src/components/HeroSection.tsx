import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative mt-16 md:mt-20">
      <div className="bg-white ">
        <Image
          src="/images/hero-section.png"
          alt="Healthcare Therapy Center"
          className="w-full h-auto min-h-72 md:min-h-96 object-cover"
          width={1000}
          height={1000}
        />
      </div>
    </section>
  );
};

export default HeroSection;
