import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ContactSectionProps {
  t: {
    title: string;
    subtitle: string;
    button: string;
  };
  appointmentLink?: string;
}

const ContactSection = ({ t, appointmentLink }: ContactSectionProps) => {
  return (
    <section id="contact" className="relative">
      <div className="relative h-40 md:h-[500px]">
        <Image
          src="/images/contact-bg.jpg"
          alt="Contact Healthcare Therapy Center"
          fill
          className="object-left object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative md:static z-10 h-full container mx-auto px-4 flex flex-col justify-center md:justify-end md:pb-10">
          <div className="max-w-2xl relative w-full h-full md:w-auto md:h-auto">
            <h2 className="text-sm md:text-[40px] font-cormorant font-bold text-[#C99A4D] mb-4 absolute md:relative bottom-0 left-0">
              {t.title}
              <br />
              {t.subtitle}
            </h2>

            <Link
              href={appointmentLink || "https://forms.gle/GJETkvXcnZ7hZwBr8"}
              target="_blank"
              className="inline-block text-sm md:text-base bg-[#C99A4D] hover:bg-amber-800 text-white font-manrope md:font-cormorant md:uppercase font-medium py-1 px-4 md:py-3 md:px-8 rounded-full absolute md:relative top-0 right-0 mt-4 md:mt-0"
            >
              {t.button}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
