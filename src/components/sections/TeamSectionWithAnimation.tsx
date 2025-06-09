import React from "react";
import TeamSection from "@/components/TeamSection";
import AnimatedSection from "@/components/AnimatedSection";

const TeamSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
      <TeamSection />
    </AnimatedSection>
  );
};

export default TeamSectionWithAnimation;
