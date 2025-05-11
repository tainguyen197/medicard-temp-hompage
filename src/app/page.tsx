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

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesGallerySection />
      <TreatmentMethodsSection />
      <TeamSection />
      <FacilitySection />
      <EquipmentSection />
      <ProcessSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
