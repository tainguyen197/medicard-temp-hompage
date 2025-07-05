import { getMessages } from "next-intl/server";
import HeroSection from "@/components/HeroSection";
import { getBannerDataByType, BANNER_TYPES } from "@/lib/banner-utils";
import { getAppointmentLink } from "@/lib/contact";
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

  // Fetch homepage banner data
  const homepageBanner = await getBannerDataByType(BANNER_TYPES.HOMEPAGE);
  
  // Fetch appointment link
  const appointmentLink = await getAppointmentLink();

  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      <HeroSection
        imageUrl={homepageBanner.imageUrl}
        link={homepageBanner.link}
        altText="Homepage Hero"
      />
      <AboutSectionWithAnimation t={t.about} />
      <ServicesGallerySectionWithAnimation appointmentLink={appointmentLink} />
      <TreatmentMethodsSectionWithAnimation t={t.treatmentMethods} />
      <TeamSectionWithAnimation />
      <FacilitySectionWithAnimation t={t.facility} />
      <EquipmentSectionWithAnimation t={t.equipment} />
      <ProcessSectionWithAnimation t={t.process} />
      <BlogSectionWithAnimation locale={locale} />
      <ContactSectionWithAnimation t={t.contact} appointmentLink={appointmentLink} />
    </div>
  );
}
