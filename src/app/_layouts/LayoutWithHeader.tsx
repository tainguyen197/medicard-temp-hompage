import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function LayoutWithHeader({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale?: string;
}>) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">{children}</main>
      <Footer locale={locale} />
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <a
          href="tel:0901430077"
          className="flex items-center justify-center bg-[#B1873F] text-white p-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 animate-bounce"
          aria-label="Call Us"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-amber-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
        </a>
      </div>
    </>
  );
}
