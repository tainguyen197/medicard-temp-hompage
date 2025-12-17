import HeroSection from "@/components/HeroSection";
import {
  AboutSectionWithAnimation,
  ServicesGallerySectionWithAnimation,
  TreatmentMethodsSectionWithAnimation,
  TeamSectionWithAnimation,
  FacilitySectionWithAnimation,
  EquipmentSectionWithAnimation,
  ProcessSectionWithAnimation,
  BlogSectionWithAnimation,
  ContactSectionWithAnimation,
} from "@/components/sections";
import { Suspense } from "react";
import { HeroSectionSkeleton } from "@/components/HeroSection";
import { ServicesGallerySectionSkeleton } from "@/components/ServicesGallerySection";
import HomeLoadingWrapper from "@/components/HomeLoadingWrapper";

export const generateStaticParams = async () => {
  return [{ locale: "en" }, { locale: "vi" }];
};

export default async function Home() {
  return (
    <HomeLoadingWrapper>
      <div className="min-h-screen pt-[72px] md:pt-[96px]">
        <Suspense fallback={<HeroSectionSkeleton />}>
          <HeroSection />
        </Suspense>
        <AboutSectionWithAnimation />

        <Suspense fallback={<ServicesGallerySectionSkeleton />}>
          <ServicesGallerySectionWithAnimation />
        </Suspense>
        <TreatmentMethodsSectionWithAnimation />
        <TeamSectionWithAnimation />
        <FacilitySectionWithAnimation />
        <EquipmentSectionWithAnimation />
        <ProcessSectionWithAnimation />
        <BlogSectionWithAnimation />
        <ContactSectionWithAnimation />
      </div>
    </HomeLoadingWrapper>
  );
}
