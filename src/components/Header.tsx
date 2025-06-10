"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ROUTES } from "@/lib/router";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  texts: Record<string, string>;
};

const Header = ({ texts }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper function to check if a route is active considering locale
  const isRouteActive = (routeHref: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale =
      pathname.replace(new RegExp(`^/${locale}`), "") || "/";

    // For exact home route match
    if (routeHref === "/" && pathWithoutLocale === "/") {
      return true;
    }

    // For other routes, check if the path starts with the route
    if (routeHref !== "/") {
      return pathWithoutLocale.startsWith(routeHref);
    }

    return false;
  };

  // Helper function to create locale-aware href
  const createLocaleHref = (href: string) => {
    return `/${locale}${href}`;
  };

  const navItems = [
    { name: texts.services, href: ROUTES.SERVICES },
    { name: texts.about, href: ROUTES.ABOUT },
    { name: texts.news, href: ROUTES.NEWS },
    { name: texts.contact, href: ROUTES.CONTACT },
  ];

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    // Create locale-aware route and navigate
    const localeAwareHref = createLocaleHref(href);
    router.push(localeAwareHref);
  };

  return (
    <header className="bg-[#182134] py-4 fixed top-0 left-0 right-0 z-50 min-h-[72px] md:min-h-[96px]">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href={createLocaleHref(ROUTES.HOME)}
          onClick={(e) => handleNavigation(e, ROUTES.HOME)}
          className="relative w-32 h-10 md:w-36 md:h-16"
        >
          <Image
            src="/images/logo.png"
            alt="Healthcare Therapy Center"
            fill
            className="object-contain"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={createLocaleHref(item.href)}
                onClick={(e) => handleNavigation(e, item.href)}
                className="font-cormorant font-bold uppercase text-amber-50 hover:text-white transition-colors relative group"
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-[#B1873F] transition-all duration-300 
                    ${
                      isRouteActive(item.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <a href="tel:0901430077">
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 border-amber-50">
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
              </div>
            </a>

            <LanguageSwitcher />
          </div>
          {/* Hamburger Button for Mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#182134] z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 pt-20 pb-8">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={createLocaleHref(item.href)}
                onClick={(e) => handleNavigation(e, item.href)}
                className="font-cormorant font-bold text-xl uppercase text-white hover:text-amber-200 transition-colors relative group"
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-amber-200 transition-all duration-300 
                    ${
                      isRouteActive(item.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
