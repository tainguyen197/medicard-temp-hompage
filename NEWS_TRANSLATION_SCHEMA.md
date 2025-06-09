# News Page - Multilingual Translation Schema

## Overview

This document outlines the comprehensive translation schema for the news page, supporting English and Vietnamese languages using next-intl.

## File Structure

```
messages/
├── en.json     # English translations
└── vi.json     # Vietnamese translations
```

## Translation Schema Structure

### 1. **Basic Page Information**

```typescript
t.title; // Page title
t.metadata.title; // SEO title
t.metadata.description; // SEO description
```

### 2. **Hero Section**

```typescript
t.hero.title; // "NEWS" / "TIN TỨC"
t.hero.subtitle; // "Latest Health Updates & Insights"
t.hero.imageAlt; // Alt text for hero image
```

### 3. **Content Sections**

```typescript
// Trending/Featured Section
t.sections.trending.title; // "Trending News"
t.sections.trending.featured; // "Featured"
t.sections.trending.showMoreButton; // "View All Trending"

// All Posts Section
t.sections.allPosts.title; // "All Articles"
t.sections.allPosts.showTitle; // Boolean: false (currently hidden)
t.sections.allPosts.loadMore; // "Load More Articles"

// Categories
t.sections.categories.title; // "Categories"
t.sections.categories.all; // "All Categories"
t.sections.categories.health; // "Health Tips"
t.sections.categories.treatment; // "Treatment Methods"
t.sections.categories.lifestyle; // "Healthy Lifestyle"
t.sections.categories.technology; // "Medical Technology"
```

### 4. **Article Information**

```typescript
t.article.readMore; // "Read More"
t.article.readTime; // "min read"
t.article.publishedOn; // "Published on"
t.article.byAuthor; // "By"
t.article.category; // "Category"
t.article.tags; // "Tags"
t.article.shareArticle; // "Share Article"
```

### 5. **Empty State**

```typescript
t.emptyState.title; // "No articles published yet"
t.emptyState.description; // "Please check back later for new content."
t.emptyState.button; // "Subscribe for Updates"
t.emptyState.image; // "No articles found"
```

### 6. **Search & Filters**

```typescript
// Search
t.search.placeholder; // "Search articles..."
t.search.button; // "Search"
t.search.results; // "Search Results"
t.search.noResults; // "No articles found matching your search."
t.search.clear; // "Clear Search"

// Filters
t.filters.title; // "Filter Articles"
t.filters.byDate; // "By Date"
t.filters.byCategory; // "By Category"
t.filters.sortBy; // "Sort By"
t.filters.newest; // "Newest First"
t.filters.oldest; // "Oldest First"
t.filters.popular; // "Most Popular"
t.filters.reset; // "Reset Filters"
```

### 7. **Pagination (Enhanced)**

```typescript
t.pagination.previous; // "Previous"
t.pagination.next; // "Next"
t.pagination.page; // "Page"
t.pagination.previousPage; // "Previous Page" (for accessibility)
t.pagination.nextPage; // "Next Page" (for accessibility)
t.pagination.firstPage; // "First Page"
t.pagination.lastPage; // "Last Page"
t.pagination.of; // "of"
t.pagination.pages; // "pages"
t.pagination.showing; // "Showing"
t.pagination.to; // "to"
t.pagination.results; // "results"
t.pagination.goToPage; // "Go to page"
```

### 8. **Loading States**

```typescript
t.loading.articles; // "Loading articles..."
t.loading.more; // "Loading more..."
t.loading.search; // "Searching..."
```

### 9. **Error Messages**

```typescript
t.errors.loadFailed; // "Failed to load articles. Please try again."
t.errors.searchFailed; // "Search failed. Please try again."
t.errors.networkError; // "Network error. Please check your connection."
```

### 10. **Call-to-Action Section**

```typescript
t.cta.heading; // "Ready to experience the difference"
t.cta.subheading; // Main CTA description
t.cta.button; // "Book an experience"

// Newsletter (New)
t.cta.newsletter.title; // "Stay Updated"
t.cta.newsletter.description; // Newsletter description
t.cta.newsletter.placeholder; // "Enter your email"
t.cta.newsletter.subscribe; // "Subscribe"
t.cta.newsletter.success; // "Successfully subscribed!"
t.cta.newsletter.error; // "Subscription failed. Please try again."
```

### 11. **Article Detail Page**

```typescript
t.detail.breadcrumb; // "News"
t.detail.backToNews; // "Back to News"
t.detail.relatedPosts; // "You might also be interested"
t.detail.shareOn; // "Share on"
t.detail.copyLink; // "Copy Link"
t.detail.linkCopied; // "Link copied to clipboard!"

// Navigation
t.detail.navigation.previous; // "Previous Article"
t.detail.navigation.next; // "Next Article"

// Not Found
t.detail.notFound.title; // "Article not found | Healthcare Therapy Center"
t.detail.notFound.description; // Error description
t.detail.notFound.button; // "Back to News"
```

### 12. **SEO & Meta**

```typescript
t.seo.defaultTitle; // "Health News & Updates"
t.seo.defaultDescription; // Default meta description
t.seo.keywords; // Meta keywords
```

## Usage Examples

### Current Implementation

```tsx
// Page setup
const messages = await getMessages();
const t = messages.news;

// Basic usage
<h1>{t.title}</h1>
<h2>{t.sections.allPosts.title}</h2>

// Pagination with accessibility
<Link
  href={`/news?page=${currentPage + 1}`}
  aria-label={t.pagination.nextPage}
>
  {/* Next button */}
</Link>

// Empty state
{blogPosts.length === 0 && (
  <div>
    <h2>{t.emptyState.title}</h2>
    <p>{t.emptyState.description}</p>
  </div>
)}
```

### Enhanced Features (Available for Future Implementation)

```tsx
// Search functionality
<input placeholder={t.search.placeholder} />
<button>{t.search.button}</button>

// Loading states
{isLoading && <p>{t.loading.articles}</p>}

// Error handling
{error && <p>{t.errors.loadFailed}</p>}

// Newsletter signup
<div>
  <h3>{t.cta.newsletter.title}</h3>
  <p>{t.cta.newsletter.description}</p>
  <input placeholder={t.cta.newsletter.placeholder} />
  <button>{t.cta.newsletter.subscribe}</button>
</div>
```

## Key Improvements

### ✅ **Fixed Issues**

- Added missing `previousPage` and `nextPage` keys for accessibility
- Fixed object rendering error (`t.allPosts` → `t.sections.allPosts.title`)
- Enhanced pagination with comprehensive labels

### ✅ **New Features**

- Comprehensive search functionality translations
- Filter and sorting options
- Loading states and error messages
- Newsletter signup section
- Enhanced article metadata
- SEO improvements
- Detailed navigation options

### ✅ **Better Organization**

- Grouped related translations under logical sections
- Consistent naming conventions
- Complete English ↔ Vietnamese mapping
- Future-proof structure for additional features

## Supported Languages

| Language   | Code | File               | Status      |
| ---------- | ---- | ------------------ | ----------- |
| English    | `en` | `messages/en.json` | ✅ Complete |
| Vietnamese | `vi` | `messages/vi.json` | ✅ Complete |

## Migration Notes

The new schema is backward compatible with the current implementation. Existing translation keys still work, but new keys provide enhanced functionality and better user experience.

To use the new schema:

1. Update translation calls from `t.allPosts` to `t.sections.allPosts.title`
2. Use `t.pagination.previousPage` and `t.pagination.nextPage` for accessibility
3. Implement new features using the available translation keys

This schema provides a solid foundation for a fully internationalized news section with room for future enhancements.
