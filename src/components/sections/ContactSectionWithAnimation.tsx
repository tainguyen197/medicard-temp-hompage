import React from "react";
import ContactSection from "@/components/ContactSection";
import AnimatedSection from "@/components/AnimatedSection";

const ContactSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="zoomIn" delay={0.2} duration={0.7}>
      <ContactSection />
    </AnimatedSection>
  );
};

export default ContactSectionWithAnimation;
