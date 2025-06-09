import React from "react";
import AboutSection from "@/components/AboutSection";
import AnimatedSection from "@/components/AnimatedSection";

interface AboutSectionWithAnimationProps {
  t: any;
}

const AboutSectionWithAnimation = ({ t }: AboutSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="slideUp" delay={0.2} duration={0.7}>
      <AboutSection t={t} />
    </AnimatedSection>
  );
};

export default AboutSectionWithAnimation;
