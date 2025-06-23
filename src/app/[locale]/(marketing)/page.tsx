import { getMessages } from "next-intl/server";
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

export const generateStaticParams = async () => {
  return [{ locale: "en" }, { locale: "vi" }];
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.home;

  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      <HeroSection />
      <AboutSectionWithAnimation t={t.about} />
      <ServicesGallerySectionWithAnimation />
      <TreatmentMethodsSectionWithAnimation t={t.treatmentMethods} />
      <TeamSectionWithAnimation />
      <FacilitySectionWithAnimation t={t.facility} />
      <EquipmentSectionWithAnimation t={t.equipment} />
      <ProcessSectionWithAnimation t={t.process} />
      <BlogSectionWithAnimation locale={locale} />
      <ContactSectionWithAnimation t={t.contact} />
    </div>
  );
}
