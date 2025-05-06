import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TreatmentMethodsSection from "@/components/TreatmentMethodsSection";
import EquipmentSection from "../components/EquipmentSection";
import ProcessSection from "@/components/ProcessSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FacilitySection from "../components/FacilitySection";
import TeamSection from "../components/TeamSection";
import ServicesGallerySection from "@/components/ServicesGallerySection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
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
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <a
          href="tel:0901430077"
          className="flex items-center justify-center bg-[#182134] text-white p-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 animate-bounce"
          aria-label="Call Us"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </>
  );
}
