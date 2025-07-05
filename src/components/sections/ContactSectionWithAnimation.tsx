import React from "react";
import ContactSection from "@/components/ContactSection";
import AnimatedSection from "@/components/AnimatedSection";

interface ContactSectionWithAnimationProps {
  t: any;
  appointmentLink?: string;
}

const ContactSectionWithAnimation = ({
  t,
  appointmentLink,
}: ContactSectionWithAnimationProps) => {
  return (
    <AnimatedSection animation="zoomIn" delay={0.2} duration={0.7}>
      <ContactSection t={t} appointmentLink={appointmentLink} />
    </AnimatedSection>
  );
};

export default ContactSectionWithAnimation;
