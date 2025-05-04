import React from "react";
import Image from "next/image";
import Link from "next/link";

const ContactSection = () => {
  return (
    <section id="contact" className="relative">
      <div className="relative h-96 md:h-[500px]">
        <Image
          src="/images/contact-bg.jpg"
          alt="Contact Healthcare Therapy Center"
          fill
          className="object-left object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center md:justify-end md:pb-10">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-[40px] font-cormorant font-bold text-[#C99A4D] mb-4">
              SẴN SÀNG TRẢI NGHIỆM
              <br />
              SỰ KHÁC BIỆT?
            </h2>

            <Link
              href="#appointment"
              className="inline-block bg-[#C99A4D] hover:bg-amber-800 text-white font-cormorant uppercase font-medium py-3 px-8 rounded-full"
            >
              ĐẶT LỊCH
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
