# Internationalization (i18n) Implementation

This document describes the complete i18n setup for the Healthcare Therapy Center website, supporting Vietnamese (default) and English.

## Overview

The implementation uses `next-intl` for internationalization with Next.js App Router, providing:

- URL-based locale routing (`/vi/services` and `/en/services`)
- Translation management via JSON files
- Database content localization
- Automatic locale switching
- SEO-friendly URLs

## Project Structure

```
src/
├── app/
│   ├── [locale]/                     # Locale-specific routes
│   │   ├── layout.tsx               # Locale layout with i18n provider
│   │   └── (marketing)/             # Marketing pages
│   │       ├── layout.tsx           # Marketing layout
│   │       ├── page.tsx             # Home page
│   │       └── services/            # Services pages
│   │           ├── page.tsx         # Services listing
│   │           └── [slug]/
│   │               └── page.tsx     # Service detail
│   ├── dashboard/                   # Dashboard (no i18n)
│   └── api/                         # API routes (no i18n)
├── components/
│   └── LanguageSwitcher.tsx         # Language switching component
├── i18n.ts                          # i18n configuration
└── middleware.ts                    # Route handling middleware

messages/                            # Translation files
├── en.json                          # English translations
└── vi.json                          # Vietnamese translations
```

## Configuration Files

### 1. Next.js Configuration (`next.config.ts`)

```typescript
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
export default withNextIntl(nextConfig);
```

### 2. i18n Configuration (`src/i18n.ts`)

```typescript
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "vi"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 3. Middleware (`src/middleware.ts`)

Handles both i18n routing and existing dashboard subdomain logic:

```typescript
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "vi",
});

export function middleware(request: NextRequest) {
  // Handle API and dashboard routes first
  // Then apply i18n middleware for marketing pages
  return intlMiddleware(request);
}
```

## Translation Files

### Vietnamese (`messages/vi.json`)

```json
{
  "services": {
    "breadcrumb": {
      "services": "Dịch vụ"
    },
    "cta": {
      "heading": "Sẵn sàng trải nghiệm sự khác biệt",
      "subheading": "Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong hành trình chăm sóc sức khỏe của bạn.",
      "button": "Đặt lịch trải nghiệm"
    }
  }
}
```

### English (`messages/en.json`)

```json
{
  "services": {
    "breadcrumb": {
      "services": "Services"
    },
    "cta": {
      "heading": "Ready to experience the difference",
      "subheading": "Let Healthcare Therapy Center become your reliable support in your healthcare journey.",
      "button": "Book an experience"
    }
  }
}
```

## Database Schema Changes

Added English translation fields to the Service model:

```prisma
model Service {
  id                   String   @id @default(cuid())
  slug                 String   @unique
  title                String
  description          String?
  shortDescription     String?
  content              String?
  // English translation fields
  titleEn              String?
  descriptionEn        String?
  shortDescriptionEn   String?
  contentEn            String?
  // ... other fields
}
```

## Usage in Components

### Server Components

```typescript
import { getTranslations } from "next-intl/server";

export default async function ServicePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("services");

  return <h1>{t("breadcrumb.services")}</h1>;
}
```

### Client Components

```typescript
"use client";
import { useTranslations } from "next-intl";

export default function ClientComponent() {
  const t = useTranslations("services");
  return <button>{t("cta.button")}</button>;
}
```

### Content Localization

```typescript
const getLocalizedContent = (service: Service, field: keyof Service) => {
  if (locale === "en") {
    const englishField = `${field}En` as keyof Service;
    return service[englishField] || service[field]; // Fallback to Vietnamese
  }
  return service[field]; // Default Vietnamese
};
```

## Language Switcher Component

```typescript
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
    <div className="flex items-center space-x-2">
      <button onClick={() => switchLocale("vi")}>VI</button>
      <button onClick={() => switchLocale("en")}>EN</button>
    </div>
  );
}
```

## URL Structure

- **Home**: `/vi/` (Vietnamese), `/en/` (English)
- **Services**: `/vi/services/`, `/en/services/`
- **Service Detail**: `/vi/services/home-care`, `/en/services/home-care`
- **Dashboard**: `dashboard.domain.com` (subdomain, no i18n)
- **API**: `/api/*` (no i18n)

## SEO and Metadata

```typescript
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations("metadata");

  return {
    title: locale === "en" ? service.titleEn || service.title : service.title,
    description:
      locale === "en"
        ? service.descriptionEn || service.description
        : service.description,
  };
}
```

## Database Migration

To apply the database changes:

```bash
npx prisma migrate dev --name add-service-translations
```

## Next Steps

1. **Database Migration**: Apply the Prisma migration to add English translation fields
2. **Content Translation**: Add English translations to existing services via the dashboard
3. **Component Integration**: Add the LanguageSwitcher component to the header
4. **Extend to Other Pages**: Apply similar i18n patterns to about, contact, and news pages
5. **CMS Integration**: Update the dashboard to allow editing both Vietnamese and English content

## Benefits

- ✅ SEO-friendly URLs with locale prefixes
- ✅ Automatic locale detection and fallbacks
- ✅ Type-safe translation keys
- ✅ Server-side rendering support
- ✅ Static generation for better performance
- ✅ Preserves existing dashboard and API functionality
- ✅ Database-driven content localization
- ✅ Easy content management workflow

## Technical Notes

- Uses Next.js 15 App Router
- Compatible with existing middleware logic
- Maintains dashboard subdomain routing
- Supports both static and dynamic content translation
- Fallback mechanism: English → Vietnamese → Default text
