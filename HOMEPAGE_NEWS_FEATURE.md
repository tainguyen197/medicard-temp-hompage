# Homepage News Feature

This document describes the new homepage news feature that allows selecting which news articles should be displayed on the homepage.

## Overview

The feature adds a `showOnHomepage` field to the News model that allows administrators to select up to 4 news articles to be displayed on the homepage.

## Database Changes

### Schema Update

- Added `showOnHomepage` boolean field to the News model (default: false)
- Added database indexes for efficient querying
- Applied migration: `20241229000000_add_show_on_homepage_to_news`

### Migration

```sql
-- Add showOnHomepage field to News table
ALTER TABLE "News" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;

-- Create index for efficient querying of homepage news
CREATE INDEX "News_showOnHomepage_idx" ON "News"("showOnHomepage");

-- Create index for ordering by creation date and homepage status
CREATE INDEX "News_showOnHomepage_createdAt_idx" ON "News"("showOnHomepage", "createdAt");
```

## API Endpoints

### GET /api/news/homepage

Returns up to 4 published news articles marked for homepage display, ordered by creation date (newest first).

**Response:**

```json
{
  "news": [
    {
      "id": "news_id",
      "title": "News Title",
      "titleEn": "English Title",
      "slug": "news-slug",
      "shortDescription": "Brief description",
      "shortDescriptionEn": "English description",
      "createdAt": "2024-12-29T00:00:00.000Z",
      "featureImage": {
        "id": "image_id",
        "url": "https://example.com/image.jpg"
      },
      "featureImageEn": {
        "id": "image_en_id",
        "url": "https://example.com/image-en.jpg"
      }
    }
  ],
  "count": 4
}
```

### Updated News APIs

- `POST /api/news` - Now accepts `showOnHomepage` field
- `PUT /api/news/[id]` - Now accepts `showOnHomepage` field
- Both endpoints validate the 4-item limit before allowing changes

## Admin Interface

### News Form Changes

Both the new news and edit news forms now include:

1. **Homepage Display Checkbox** - Located in the "Article Settings" section
2. **Validation** - Shows error if trying to exceed 4 homepage items
3. **Clear Labeling** - "Show on Homepage" with helper text about the 4-item limit

### News Table Changes

The admin news table now includes a "Homepage" column that shows:

- "Yes" (blue badge) - if the news article is shown on homepage
- "No" (gray badge) - if the news article is not shown on homepage

## Frontend Components

### HomepageNewsSection Component

Located at `src/components/HomepageNewsSection.tsx`

**Usage:**

```tsx
import HomepageNewsSection from "@/components/HomepageNewsSection";

// Fetch homepage news
const response = await fetch("/api/news/homepage");
const { news } = await response.json();

// Render component
<HomepageNewsSection news={news} locale="vi" />;
```

**Features:**

- Bilingual support (Vietnamese/English)
- Responsive grid layout (1 column mobile, 2 tablet, 4 desktop)
- Image handling with fallbacks
- Hover effects and animations
- "View All News" call-to-action button

## Business Rules

1. **Maximum Limit**: Only 4 news articles can be shown on homepage at any time
2. **Status Requirement**: Only published news articles can be shown on homepage
3. **Validation**: API prevents exceeding the 4-item limit with clear error messages
4. **Order**: Homepage news is ordered by creation date (newest first)

## Usage Examples

### Setting Homepage News

1. Go to Admin Dashboard → News
2. Create or edit a news article
3. In "Article Settings" section, check "Show on Homepage"
4. Save the article
5. The news will appear on homepage if published and within the 4-item limit

### Fetching Homepage News in Frontend

```tsx
// Server component example
async function getHomepageNews() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/news/homepage`
  );
  const { news } = await response.json();
  return news;
}

export default async function HomePage() {
  const homepageNews = await getHomepageNews();

  return (
    <div>
      {/* Other homepage content */}
      <HomepageNewsSection news={homepageNews} locale="vi" />
    </div>
  );
}
```

### Client-side Fetching

```tsx
// Client component example
import { useEffect, useState } from "react";

function Homepage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/news/homepage")
      .then((res) => res.json())
      .then((data) => setNews(data.news));
  }, []);

  return <HomepageNewsSection news={news} locale="vi" />;
}
```

## Development Notes

### Running Migrations

```bash
# Push schema changes to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Styling

The component uses Tailwind CSS classes. Custom line-clamp utilities are available:

- `line-clamp-2` - Limits text to 2 lines
- `line-clamp-3` - Limits text to 3 lines

### Internationalization

The feature supports Vietnamese (default) and English through:

- `title` / `titleEn` fields
- `shortDescription` / `shortDescriptionEn` fields
- `featureImage` / `featureImageEn` fields
- Locale-aware date formatting
- Translated UI text

## Testing

### Manual Testing Steps

1. Create more than 4 news articles
2. Try to set more than 4 as homepage articles - should show validation error
3. Verify homepage API returns max 4 articles
4. Test bilingual content display
5. Verify admin table shows correct homepage status
6. Test responsive layout on different screen sizes

### API Testing

```bash
# Test homepage endpoint
curl http://localhost:3000/api/news/homepage

# Test creating news with homepage flag
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{"title":"Test News","showOnHomepage":true,"status":"PUBLISHED"}'
```
