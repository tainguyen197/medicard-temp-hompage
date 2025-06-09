import React from "react";
import FacilitySection from "@/components/FacilitySection";
import AnimatedSection from "@/components/AnimatedSection";

interface FacilitySectionWithAnimationProps {
  t: any;
}

const FacilitySectionWithAnimation = ({
  t,
}: FacilitySectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="slideUp" delay={0.2} duration={0.6}>
      <FacilitySection t={t} />
    </AnimatedSection>
  );
};

export default FacilitySectionWithAnimation;
