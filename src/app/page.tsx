import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TreatmentMethodsSection from "@/components/TreatmentMethodsSection";
import EquipmentSection from "../components/EquipmentSection";
import ProcessSection from "@/components/ProcessSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import FacilitySection from "../components/FacilitySection";
import TeamSection from "../components/TeamSection";
import ServicesGallerySection from "@/components/ServicesGallerySection";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      <HeroSection />
      <AnimatedSection animation="slideUp" delay={0.2} duration={0.7}>
        <AboutSection />
      </AnimatedSection>
      <AnimatedSection animation="fadeIn" delay={0.1} duration={0.6}>
        <ServicesGallerySection />
      </AnimatedSection>
      <AnimatedSection animation="slideRight" delay={0.2} duration={0.7}>
        <TreatmentMethodsSection />
      </AnimatedSection>
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <TeamSection />
      </AnimatedSection>
      <AnimatedSection animation="slideUp" delay={0.2} duration={0.6}>
        <FacilitySection />
      </AnimatedSection>
      <AnimatedSection animation="fadeIn" delay={0.1} duration={0.7}>
        <EquipmentSection />
      </AnimatedSection>
      <AnimatedSection animation="slideLeft" delay={0.2} duration={0.8}>
        <ProcessSection />
      </AnimatedSection>
      z
      <AnimatedSection animation="slideUp" delay={0.1} duration={0.6}>
        <BlogSection />
      </AnimatedSection>
      <AnimatedSection animation="zoomIn" delay={0.2} duration={0.7}>
        <ContactSection />
      </AnimatedSection>
    </div>
  );
}
