export const experimental_ppr = true;

import { Cormorant_SC, Manrope } from "next/font/google";
import "@/app/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LayoutWithHeader from "@/app/_layouts/LayoutWithHeader";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_SC({
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Healthcare Therapy Center | Giải pháp chăm sóc sức khoẻ toàn diện",
  description:
    "Healthcare Therapy Center cung cấp dịch vụ Y Học Cổ Truyền kết hợp Phục Hồi Chức Năng theo hướng hiện đại, an toàn và khoa học.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <LayoutWithHeader>{children}</LayoutWithHeader>
      </body>
    </html>
  );
}
