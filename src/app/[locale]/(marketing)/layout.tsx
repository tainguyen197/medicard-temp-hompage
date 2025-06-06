import type { Metadata } from "next";
import "@/app/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayoutWithHeader from "@/app/_layouts/LayoutWithHeader";

export const metadata: Metadata = {
  title: "Healthcare Therapy Center | Giải pháp chăm sóc sức khoẻ toàn diện",
  description:
    "Healthcare Therapy Center cung cấp dịch vụ Y Học Cổ Truyền kết hợp Phục Hồi Chức Năng theo hướng hiện đại, an toàn và khoa học.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWithHeader>{children}</LayoutWithHeader>;
}
