# Homepage Services Feature Documentation

## Overview

The Homepage Services feature allows administrators to select up to 4 services to be prominently displayed on the website's homepage. This feature provides a way to highlight the most important or popular services to visitors.

## Database Schema Changes

### Service Model Updates

Added a new boolean field to the `Service` model:

```prisma
model Service {
  // ... existing fields
  showOnHomepage       Boolean  @default(false)
  // ... rest of fields

  @@index([showOnHomepage])
  @@index([showOnHomepage, createdAt])
}
```

### Migration Details

**Migration File:** `20241229000001_add_show_on_homepage_to_service/migration.sql`

```sql
-- Add showOnHomepage field to Service table
ALTER TABLE "Service" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT false;

-- Create index for efficient querying of homepage services
CREATE INDEX "Service_showOnHomepage_idx" ON "Service"("showOnHomepage");

-- Create index for ordering by creation date and homepage status
CREATE INDEX "Service_showOnHomepage_createdAt_idx" ON "Service"("showOnHomepage", "createdAt");
```

## API Endpoints

### 1. Service Creation API (`POST /api/services`)

**Updated Schema:**

```typescript
const serviceSchema = z.object({
  // ... existing fields
  showOnHomepage: z.boolean().optional().default(false),
  // ... rest of fields
});
```

**Validation Logic:**

- Only published services can be marked for homepage display
- Maximum of 4 services can be shown on homepage
- Returns error if limit is exceeded

**Example Request:**

```json
{
  "title": "Physical Therapy",
  "titleEn": "Physical Therapy",
  "shortDescription": "Comprehensive physical therapy services",
  "status": "PUBLISHED",
  "showOnHomepage": true
}
```

**Error Response (if limit exceeded):**

```json
{
  "error": "Maximum of 4 services can be shown on homepage. Please disable another service first."
}
```

### 2. Service Update API (`PUT /api/services/[id]`)

**Updated Schema:**

```typescript
const serviceUpdateSchema = z.object({
  // ... existing fields
  showOnHomepage: z.boolean().optional(),
  // ... rest of fields
});
```

**Validation Logic:**

- Checks homepage limit only when changing from false to true
- Excludes current service from count check
- Only published services can be marked for homepage

### 3. Homepage Services API (`GET /api/services/homepage`)

**Endpoint:** `/api/services/homepage`

**Response:**

```json
{
  "services": [
    {
      "id": "service-id-1",
      "title": "Physical Therapy",
      "titleEn": "Physical Therapy",
      "slug": "physical-therapy",
      "shortDescription": "Comprehensive physical therapy services",
      "shortDescriptionEn": "Comprehensive physical therapy services",
      "featureImage": {
        "id": "image-id",
        "url": "https://example.com/image.jpg",
        "fileName": "therapy.jpg",
        "originalName": "physical-therapy.jpg"
      },
      "featureImageEn": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Query Logic:**

- Filters for `showOnHomepage: true` AND `status: "PUBLISHED"`
- Orders by `createdAt: "desc"`
- Limits to 4 results
- Returns bilingual content and images

## Admin Interface Changes

### Service Creation Form

**File:** `src/app/dashboard/admin/services/new/page.tsx`

**New Fields:**

```tsx
// State management
const [showOnHomepage, setShowOnHomepage] = useState(false);

// Form field
<div className="space-y-2">
  <Label className="text-sm font-medium">Homepage Display</Label>
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="showOnHomepage"
      checked={showOnHomepage}
      onChange={(e) => setShowOnHomepage(e.target.checked)}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <Label htmlFor="showOnHomepage" className="text-sm">
      Show on Homepage
    </Label>
  </div>
  <p className="text-xs text-gray-500">
    Display this service on the homepage (max 4 items)
  </p>
</div>;
```

### Service Edit Form

**File:** `src/app/dashboard/admin/services/[id]/page.tsx`

- Added `showOnHomepage` state variable
- Loads existing value from database
- Updates form submission to include the field
- Same UI as creation form

### Services Table Updates

**File:** `src/components/ServicesTable.tsx`

**Interface Updates:**

```typescript
interface Service {
  // ... existing fields
  showOnHomepage: boolean;
  // ... rest of fields
}
```

**Table Changes:**

- Added "Homepage" column header
- Updated empty state colspan from 6 to 7

**File:** `src/components/ServiceTableRow.tsx`

**New Column:**

```tsx
<td className="px-6 py-4 whitespace-nowrap align-middle">
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full ${
      service.showOnHomepage
        ? "bg-blue-100 text-blue-800 border border-blue-200"
        : "bg-gray-100 text-gray-800 border border-gray-200"
    }`}
  >
    {service.showOnHomepage ? "Yes" : "No"}
  </span>
</td>
```

### Data Query Updates

**File:** `src/app/dashboard/admin/services/services-content.tsx`

Updated query to select `showOnHomepage` field:

```typescript
const services = await prisma.service.findMany({
  // ... other options
  select: {
    id: true,
    title: true,
    slug: true,
    status: true,
    showOnHomepage: true, // Added field
    createdAt: true,
    shortDescription: true,
    featureImage: {
      /* ... */
    },
  },
});
```

## Frontend Component

### HomepageServicesSection Component

**File:** `src/components/HomepageServicesSection.tsx`

**Features:**

- Bilingual support (Vietnamese/English)
- Responsive grid layout (1 column mobile → 2 tablet → 4 desktop)
- Image handling with fallbacks
- Hover effects and animations
- "View All Services" call-to-action

**Usage Example:**

```tsx
import HomepageServicesSection from "@/components/HomepageServicesSection";

// Fetch homepage services
const response = await fetch("/api/services/homepage");
const { services } = await response.json();

// Render component
<HomepageServicesSection services={services} locale="vi" />;
```

**Props:**

- `services`: Array of service objects
- `locale`: "vi" (default) or "en" for language

## Business Rules

### Homepage Display Rules

1. **Maximum Limit:** Only 4 services can be displayed on homepage
2. **Status Requirement:** Only published services can be marked for homepage
3. **Validation Timing:** Limit is checked when:
   - Creating a new service with `showOnHomepage: true`
   - Updating a service from `showOnHomepage: false` to `true`
4. **Priority Order:** Services are ordered by creation date (newest first)

### Error Handling

- Clear error messages when homepage limit is exceeded
- Form validation prevents submission if limits would be violated
- Visual indicators in admin interface show current homepage status

## Development Setup

### Database Migration

```bash
npx prisma db push
```

### Running the Application

```bash
npm run dev
```

### API Testing

**Test Homepage Services Endpoint:**

```bash
curl http://localhost:3000/api/services/homepage
```

**Test Service Creation with Homepage Flag:**

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Service",
    "status": "PUBLISHED",
    "showOnHomepage": true
  }'
```

## Frontend Integration

### Server Component Example

```tsx
// Server component example
async function getHomepageServices() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/services/homepage`
  );
  const { services } = await response.json();
  return services;
}

export default async function HomePage() {
  const services = await getHomepageServices();

  return (
    <div>
      {/* Other homepage content */}
      <HomepageServicesSection services={services} locale="vi" />
      {/* More content */}
    </div>
  );
}
```

### Client Component Example

```tsx
// Client component example
import { useEffect, useState } from "react";

function Homepage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/services/homepage")
      .then((res) => res.json())
      .then((data) => setServices(data.services));
  }, []);

  return <HomepageServicesSection services={services} locale="vi" />;
}
```

## Testing Guidelines

### Manual Testing Checklist

**Admin Interface:**

- [ ] Create service with homepage checkbox enabled
- [ ] Edit existing service to enable/disable homepage display
- [ ] Verify homepage status appears in services table
- [ ] Test maximum limit validation (try to enable 5th service)
- [ ] Verify only published services can be marked for homepage

**API Testing:**

- [ ] Test `/api/services/homepage` endpoint returns correct data
- [ ] Verify homepage limit validation in creation API
- [ ] Test homepage limit validation in update API
- [ ] Confirm proper error messages for limit violations

**Frontend Display:**

- [ ] Services appear correctly on homepage
- [ ] Bilingual content displays properly
- [ ] Images load with proper fallbacks
- [ ] Responsive layout works across devices
- [ ] "View All Services" link functions correctly

### Database Verification

```sql
-- Check homepage services
SELECT id, title, "showOnHomepage", status, "createdAt"
FROM "Service"
WHERE "showOnHomepage" = true
AND status = 'PUBLISHED'
ORDER BY "createdAt" DESC;

-- Verify index creation
\d "Service"
```

## Implementation Notes

### Key Differences from News Implementation

1. **Limit:** Services allow 4 items (vs 3 for news)
2. **Aspect Ratio:** Service images use 270:200 ratio (vs 16:9 for news)
3. **Grid Layout:** Services use 4-column desktop layout (vs news layout)
4. **Content Focus:** Services emphasize short descriptions and call-to-action

### Performance Considerations

1. **Database Indexes:** Added indexes on `showOnHomepage` and combined with `createdAt`
2. **Query Optimization:** Homepage API only selects necessary fields
3. **Caching:** Consider implementing Redis cache for homepage services
4. **Image Optimization:** Next.js Image component with proper sizing

### Security Considerations

1. **Authentication:** All admin endpoints require valid session
2. **Authorization:** Only ADMIN and EDITOR roles can modify services
3. **Input Validation:** Zod schemas validate all input data
4. **SQL Injection:** Prisma ORM prevents SQL injection attacks

This implementation provides a complete, production-ready solution for displaying services on the homepage with proper validation, error handling, and user experience.
