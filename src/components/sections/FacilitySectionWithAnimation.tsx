import FacilitySection from "@/components/FacilitySection";
import AnimatedSection from "@/components/AnimatedSection";

const FacilitySectionWithAnimation = () => {
  return (
    <AnimatedSection animation="slideUp" delay={0.2} duration={0.6}>
      <FacilitySection />
    </AnimatedSection>
  );
};

export default FacilitySectionWithAnimation;
