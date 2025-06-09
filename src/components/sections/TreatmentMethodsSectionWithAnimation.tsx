import React from "react";
import TreatmentMethodsSection from "@/components/TreatmentMethodsSection";
import AnimatedSection from "@/components/AnimatedSection";

interface TreatmentMethodsSectionWithAnimationProps {
  t: any;
}

const TreatmentMethodsSectionWithAnimation = ({
  t,
}: TreatmentMethodsSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="slideRight" delay={0.2} duration={0.7}>
      <TreatmentMethodsSection t={t} />
    </AnimatedSection>
  );
};

export default TreatmentMethodsSectionWithAnimation;
