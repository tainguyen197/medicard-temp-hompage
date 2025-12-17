import React from "react";
import ProcessSection from "@/components/ProcessSection";
import AnimatedSection from "@/components/AnimatedSection";

const ProcessSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="slideLeft" delay={0.2} duration={0.8}>
      <ProcessSection />
    </AnimatedSection>
  );
};

export default ProcessSectionWithAnimation;
