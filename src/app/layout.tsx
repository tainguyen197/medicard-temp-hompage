import type { Metadata } from "next";
import { Cormorant_SC, Manrope } from "next/font/google";
import "./globals.css";

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
    "Healthcare Therapy Center mang đến phương pháp điều trị kết hợp hiện đại, không dùng thuốc, không phẫu thuật với hiệu quả cao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
