import React from "react";
import ServicesGallerySection from "@/components/ServicesGallerySection";
import AnimatedSection from "@/components/AnimatedSection";

const ServicesGallerySectionWithAnimation = () => {
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.6}>
      <ServicesGallerySection />
    </AnimatedSection>
  );
};

export default ServicesGallerySectionWithAnimation;
