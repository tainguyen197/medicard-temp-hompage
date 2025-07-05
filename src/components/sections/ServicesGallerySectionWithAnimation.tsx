import React from "react";
import ServicesGallerySection from "@/components/ServicesGallerySection";
import AnimatedSection from "@/components/AnimatedSection";

interface ServicesGallerySectionWithAnimationProps {
  appointmentLink?: string;
}

const ServicesGallerySectionWithAnimation = ({ appointmentLink }: ServicesGallerySectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.6}>
      <ServicesGallerySection appointmentLink={appointmentLink} />
    </AnimatedSection>
  );
};

export default ServicesGallerySectionWithAnimation;
