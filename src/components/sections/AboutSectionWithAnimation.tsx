import AboutSection from "@/components/AboutSection";
import AnimatedSection from "@/components/AnimatedSection";

const AboutSectionWithAnimation = () => {
  return (
    <AnimatedSection animation="slideUp" delay={0.2} duration={0.7}>
      <AboutSection />
    </AnimatedSection>
  );
};

export default AboutSectionWithAnimation;
