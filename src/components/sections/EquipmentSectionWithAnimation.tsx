import React from "react";
import EquipmentSection from "@/components/EquipmentSection";
import AnimatedSection from "@/components/AnimatedSection";

const EquipmentSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.7}>
      <EquipmentSection />
    </AnimatedSection>
  );
};

export default EquipmentSectionWithAnimation;
