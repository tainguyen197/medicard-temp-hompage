import React from "react";
import TreatmentMethodsSection from "@/components/TreatmentMethodsSection";
import AnimatedSection from "@/components/AnimatedSection";

const TreatmentMethodsSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="slideRight" delay={0.2} duration={0.7}>
      <TreatmentMethodsSection />
    </AnimatedSection>
  );
};

export default TreatmentMethodsSectionWithAnimation;
