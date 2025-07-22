import Image from "next/image";
import Link from "next/link";
import "@/app/globals.css";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

async function MarketingNotFound() {
  // Get translations for the default locale (vi)
  const t = await getTranslations("notFound");
  
  // Fetch contact data
  const contact = await prisma.contact.findFirst({
    orderBy: { createdAt: "desc" },
  });
  
  // Use contact phone or fallback
  const phone = contact?.phone || "_";
  
  // Replace placeholder in translation
  const description = t("description", { phone });

  return (
    <html>
      <body>
        <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-16">
          <div className="relative flex items-center justify-center w-full max-w-lg mx-auto mb-8 mt-10">
            <div className="text-center">
              <h1 className="text-[180px] font-bold tracking-wider bg-gradient-to-b from-[#E7C68F] to-[#8B5A00] bg-clip-text text-transparent">
                {t("title")}
              </h1>
            </div>
          </div>
          <div className="relative w-full flex justify-start h-[64px] items-center mr-[15%]">
            <Image
              src="/images/break_line.png"
              alt="Not Found"
              fill
              className="object-contain object-left h-full w-2/3"
            />
          </div>
          <div className="text-center mb-8 mt-10 max-w-lg mx-auto">
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              {t("heading")}
            </h2>
            <p className="text-gray-600">
              {description}
            </p>
          </div>

          <Link href="/" className="max-w-lg w-full text-center mx-auto">
            <div className="bg-[#B1873F] text-white py-3 px-8 rounded-full hover:bg-[#9A7535] transition-colors duration-300 font-medium">
              {t("button")}
            </div>
          </Link>
        </div>
      </body>
    </html>
  );
}

export default function NotFound() {
  return <MarketingNotFound />;
}
