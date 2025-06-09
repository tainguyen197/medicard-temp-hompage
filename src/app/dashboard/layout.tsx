// import "./reset.css";
import "@/app/dashboard/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/app/dashboard/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicare Dashboard",
  description: "Administrative dashboard for Medicare services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
