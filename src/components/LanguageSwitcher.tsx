"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === locale) segments.shift();

    const newPath = `/${newLocale}${
      segments.length > 0 ? "/" + segments.join("/") : ""
    }`;
    router.push(newPath);
  };

  return (
    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 border-amber-50 cursor-pointer group relative">
      <span className="font-cormorant font-bold text-sm text-amber-50">
        {locale === "vi" ? "VIE" : "ENG"}
      </span>

      {/* Dropdown menu */}
      <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 min-w-[80px]">
        <button
          onClick={() => switchLocale("vi")}
          className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:text-[#B1873F] ${
            locale === "vi" ? "text-[#B1873F] font-semibold" : ""
          }`}
        >
          Vietnamese
        </button>
        <button
          onClick={() => switchLocale("en")}
          className={`cursor-pointer block w-full text-left px-4 py-2 text-sm hover:text-[#B1873F] ${
            locale === "en" ? "text-[#B1873F] font-semibold" : ""
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
}
