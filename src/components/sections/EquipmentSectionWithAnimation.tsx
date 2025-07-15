import React from "react";
import EquipmentSection from "@/components/EquipmentSection";
import AnimatedSection from "@/components/AnimatedSection";

interface EquipmentSectionWithAnimationProps {
  t: any;
  locale?: string;
}

const EquipmentSectionWithAnimation = ({
  t,
  locale,
}: EquipmentSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.7}>
      <EquipmentSection t={t} locale={locale} />
    </AnimatedSection>
  );
};

export default EquipmentSectionWithAnimation;
