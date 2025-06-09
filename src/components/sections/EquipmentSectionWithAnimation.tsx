import React from "react";
import EquipmentSection from "@/components/EquipmentSection";
import AnimatedSection from "@/components/AnimatedSection";

interface EquipmentSectionWithAnimationProps {
  t: any;
}

const EquipmentSectionWithAnimation = ({
  t,
}: EquipmentSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.7}>
      <EquipmentSection t={t} />
    </AnimatedSection>
  );
};

export default EquipmentSectionWithAnimation;
