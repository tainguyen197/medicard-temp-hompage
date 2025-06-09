import React from "react";
import ContactSection from "@/components/ContactSection";
import AnimatedSection from "@/components/AnimatedSection";

interface ContactSectionWithAnimationProps {
  t: any;
}

const ContactSectionWithAnimation = ({
  t,
}: ContactSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="zoomIn" delay={0.2} duration={0.7}>
      <ContactSection t={t} />
    </AnimatedSection>
  );
};

export default ContactSectionWithAnimation;
