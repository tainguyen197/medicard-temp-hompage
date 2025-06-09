import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Post } from "@/types/post";
import { getMessages } from "next-intl/server";
import { getLocalized } from "@/lib/i18n-utils";

type Params = Promise<{ slug: string; locale: string }>;

// Category item type definition
interface CategoryItem {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
}

// Default image fallback if no featured image
const DEFAULT_IMAGE = "/images/news/news-image-1.jpg";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const messages = await getMessages();
  const t = messages.news.detail.notFound;

  try {
    // Fetch post directly using Prisma
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return {
        title: t.title,
        description: t.description,
      };
    }

    const title = getLocalized(post, "title", locale);
    const excerpt = getLocalized(post, "excerpt", locale);
    const content = getLocalized(post, "content", locale);

    return {
      title: `${title} | Healthcare Therapy Center`,
      description: excerpt || `${content.substring(0, 200)}...`,
    };
  } catch (error) {
    return {
      title: t.title,
      description: t.description,
    };
  }
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const messages = await getMessages();
  const t = messages.news;

  let post: Post;
  let relatedPosts: Post[] = [];

  try {
    // Fetch the main post directly with Prisma
    const postData = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!postData) {
      notFound();
    }

    // Convert Prisma result to Post type
    post = {
      ...postData,
      createdAt: postData.createdAt.toISOString(),
      updatedAt: postData.updatedAt.toISOString(),
      publishedAt: postData.publishedAt
        ? postData.publishedAt.toISOString()
        : null,
    } as Post;

    // If post is not published, show 404
    if (post.status !== "PUBLISHED") {
      notFound();
    }

    // Fetch related posts (excluding current post)
    try {
      const relatedPostsData = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          id: {
            not: post.id,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      // Convert Prisma results to Post type
      relatedPosts = relatedPostsData.map((relatedPost: any) => ({
        ...relatedPost,
        createdAt: relatedPost.createdAt.toISOString(),
        updatedAt: relatedPost.updatedAt.toISOString(),
        publishedAt: relatedPost.publishedAt
          ? relatedPost.publishedAt.toISOString()
          : null,
      })) as Post[];
    } catch (error) {
      console.error("Failed to fetch related posts:", error);
    }
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }

  // Get localized content
  const localizedTitle = getLocalized(post, "title", locale);
  const localizedExcerpt = getLocalized(post, "excerpt", locale);
  const localizedContent = getLocalized(post, "content", locale);

  return (
    <div>
      <div className="pt-16 md:pt-24">
        {/* Hero Section with Cover Image */}
        <section className="relative w-full h-[40vh] md:h-[70vh]">
          <Image
            src="/images/hero-section.png"
            alt="News Cover"
            fill
            priority
            className="object-cover"
          />
        </section>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Link
              href="/news"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
            >
              {t.detail.breadcrumb}
            </Link>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm md:text-base text-gray-900">
              {localizedTitle}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          <h1 className="text-2xl md:text-[42px] text-[#222222] font-semibold leading-tight mb-6">
            {localizedTitle}
          </h1>

          {/* Post metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm md:text-base mb-8">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="12,6 12,12 16,14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                {new Date(post.createdAt).toLocaleDateString(
                  locale === "en" ? "en-US" : "vi-VN",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>{post.author.name || post.author.email}</span>
              </div>
            )}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((categoryItem: CategoryItem) => (
                  <span
                    key={categoryItem.category.id}
                    className="px-3 py-1 bg-[#B1873F] text-white text-xs rounded-full"
                  >
                    {categoryItem.category.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <Image
                src={post.featuredImage}
                alt={localizedTitle}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {localizedExcerpt && (
            <div className="mb-8">
              <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
                {localizedExcerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="mb-12">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-base md:text-lg text-gray-800 leading-relaxed space-y-6 [&_p]:mb-6 [&_p]:leading-relaxed [&_figcaption]:text-center [&_figcaption]:italic [&_figcaption]:text-gray-600 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_img]:mx-auto [&_img]:block [&_img]:rounded-lg [&_img]:shadow-md [&_figure]:text-center [&_figure]:mx-auto [&_figure]:mb-8 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:text-[#222222] [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:text-[#222222] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:leading-tight [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-medium [&_h3]:text-[#222222] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:leading-tight [&_.image-style-side]:float-right [&_.image-style-side]:ml-6 [&_.image-style-side]:mb-4 [&_.image-style-side]:max-w-[50%] [&_.image-style-side]:md:max-w-[40%] [&_.image-style-side_img]:mx-0 [&_.image-style-side_img]:rounded-lg [&_.image]:mb-8 [&_.image]:clear-both [&_strong]:font-semibold [&_strong]:text-[#222222] [&_em]:italic [&_em]:text-gray-700 [&_i]:italic [&_i]:text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B1873F] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-8"
                dangerouslySetInnerHTML={{ __html: localizedContent }}
              />
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t pt-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#222222] mb-8">
                {t.detail.relatedPosts}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => {
                  const relatedTitle = getLocalized(
                    relatedPost,
                    "title",
                    locale
                  );
                  const relatedExcerpt = getLocalized(
                    relatedPost,
                    "excerpt",
                    locale
                  );

                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/news/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:transform group-hover:scale-105">
                        <div className="relative h-48">
                          <Image
                            src={relatedPost.featuredImage || DEFAULT_IMAGE}
                            alt={relatedTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-[#222222] mb-2 group-hover:text-[#B1873F] transition-colors duration-300">
                            {relatedTitle}
                          </h4>
                          {relatedExcerpt && (
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {relatedExcerpt}
                            </p>
                          )}
                          <div className="mt-4 text-sm text-gray-500">
                            {new Date(relatedPost.createdAt).toLocaleDateString(
                              locale === "en" ? "en-US" : "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-md md:text-lg px-16 text-black mb-10 max-w-3xl mx-auto">
            {t.cta.subheading}
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            {t.cta.button}
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

// Inline skeleton component
function NewsDetailSkeletonContent() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <Link
            href="/news"
            className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
          >
            Tin tức
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="h-8 md:h-12 bg-gray-200 animate-pulse rounded mb-6 w-3/4"></div>
        <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded mb-10 w-1/2"></div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 mb-16 max-w-7xl">
        <div className="mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
              <div className="h-40 bg-gray-200 animate-pulse rounded w-full my-8"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            </div>
          </div>
          <hr className="my-12 border-gray-300" />
        </div>
      </div>

      {/* Related Posts */}
      <div className="container mx-auto md:px-20 md:py-14 bg-[#FEF6EA] rounded-4xl max-w-7xl">
        <div className="mx-auto px-4">
          <h2 className="text-2xl font-semibold text-[#222222] mb-10">
            Có thể bạn quan tâm
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="rounded-lg overflow-hidden">
                  <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="md:w-3/4 my-auto">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
