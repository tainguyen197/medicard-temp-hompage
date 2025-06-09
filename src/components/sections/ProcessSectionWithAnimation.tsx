import React from "react";
import ProcessSection from "@/components/ProcessSection";
import AnimatedSection from "@/components/AnimatedSection";

interface ProcessSectionWithAnimationProps {
  t: any;
}

const ProcessSectionWithAnimation = ({
  t,
}: ProcessSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="slideLeft" delay={0.2} duration={0.8}>
      <ProcessSection t={t} />
    </AnimatedSection>
  );
};

export default ProcessSectionWithAnimation;
