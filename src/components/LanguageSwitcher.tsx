"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

export default function LanguageSwitcher({
  isMobile = false,
}: LanguageSwitcherProps) {
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

  if (isMobile) {
    return (
      <div className="flex space-x-4 mt-1">
        <button
          onClick={() => switchLocale("vi")}
          className={`px-4 py-2 rounded-full border-2 ${
            locale === "vi"
              ? "border-amber-200 text-amber-200"
              : "border-white text-white hover:border-amber-200 hover:text-amber-200"
          } transition-colors`}
        >
          VIE
        </button>
        <button
          onClick={() => switchLocale("en")}
          className={`px-4 py-2 rounded-full border-2 ${
            locale === "en"
              ? "border-amber-200 text-amber-200"
              : "border-white text-white hover:border-amber-200 hover:text-amber-200"
          } transition-colors`}
        >
          ENG
        </button>
      </div>
    );
  }

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
