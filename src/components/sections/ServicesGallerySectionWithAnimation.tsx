import ServicesGallerySection from "@/components/ServicesGallerySection";
import AnimatedSection from "@/components/AnimatedSection";
import { getAppointmentLink } from "@/lib/contact";

const ServicesGallerySectionWithAnimation = async () => {
  const appointmentLink = await getAppointmentLink();
  return (
    <AnimatedSection animation="fadeIn" delay={0.1} duration={0.6}>
      <ServicesGallerySection appointmentLink={appointmentLink} />
    </AnimatedSection>
  );
};

export default ServicesGallerySectionWithAnimation;
