import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "vi"];
const defaultLocale = "vi";

export default getRequestConfig(async (params) => {
  let locale = await params.requestLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as string,
    messages: (await import(`@/../messages/${locale}.json`)).default,
  };
});
