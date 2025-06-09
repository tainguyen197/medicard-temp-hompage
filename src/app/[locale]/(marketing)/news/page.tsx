import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React, { Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import prisma from "@/lib/prisma";
import { Post } from "@/types/post";
import { getMessages } from "next-intl/server";
import NewsContent from "./NewsContent";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.news.metadata;

  return {
    title: t.title,
    description: t.description,
  };
}

const DEFAULT_IMAGE = "/images/hero-section.png";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const messages = await getMessages();
  const t = messages.news;

  // Get the current page from search params or default to 1
  const { page = "1" } = await searchParams;
  const currentPage = Number(page);
  const postsPerPage = 10;

  let blogPosts: Post[] = [];
  let totalPosts = 0;

  try {
    // Fetch posts directly from the database with Prisma
    console.log("Fetching posts from database...");

    // Build filter object (only show published posts for public page)
    const where = {
      status: "PUBLISHED",
    };

    // Get total count for pagination
    totalPosts = await prisma.post.count({
      where,
    });

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: postsPerPage,
      skip: (currentPage - 1) * postsPerPage,
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
    blogPosts = posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    })) as Post[];

    console.log(`Found ${blogPosts.length} posts on page ${currentPage}`);

    if (blogPosts.length > 0) {
      console.log("First post title:", blogPosts[0]?.title);
      console.log("First post status:", blogPosts[0]?.status);
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    blogPosts = [];
  }

  // If no posts from database, show a message or fallback
  if (blogPosts.length === 0) {
    console.log("No posts found, showing empty state");
    return (
      <div className="min-h-screen pt-[72px] md:pt-[96px]">
        {/* Hero Section */}
        <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-section.png"
              alt="News Hero"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Introduction */}
        <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
          <section className="py-16 text-center">
            <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-[#B1873F] mb-4">
              {t.title}
            </h1>
          </section>
        </AnimatedSection>

        {/* No posts message */}
        <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px] text-center py-20">
          <h2 className="text-2xl text-gray-600 mb-4">{t.emptyState.title}</h2>
          <p className="text-gray-500">{t.emptyState.description}</p>
        </section>
      </div>
    );
  }

  console.log("Rendering news page with posts");

  // Fetch trending posts (featured posts)
  let trendingPosts: Post[] = [];
  try {
    const featuredPostsData = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
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

    trendingPosts = featuredPostsData.map((post: any) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    })) as Post[];

    console.log(`Found ${trendingPosts.length} featured posts`);
  } catch (error) {
    console.error("Failed to fetch featured posts:", error);
  }

  // If we don't have enough featured posts, supplement with most recent posts
  if (trendingPosts.length < 5) {
    const recentPostsForTrending = blogPosts.filter(
      (post) => !trendingPosts.some((tp) => tp.id === post.id)
    );
    trendingPosts = [
      ...trendingPosts,
      ...recentPostsForTrending.slice(0, 5 - trendingPosts.length),
    ];
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always include page 1
    pageNumbers.push(1);

    // Calculate start and end page numbers to show
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add page numbers between start and end
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
            alt="News Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 2. Introduction */}
      <AnimatedSection animation="zoomIn" delay={0.1} duration={0.8}>
        <section className="py-16 text-center">
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-[#B1873F] mb-4">
            {t.title}
          </h1>
        </section>
      </AnimatedSection>

      {/* 3. Trending Topics - Only show if we have enough posts */}
      {trendingPosts.length >= 5 && (
        <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Featured post (larger) - left side */}
            <div className="md:w-1/2">
              <Link
                href={`/news/${trendingPosts[0].slug}`}
                className="group relative rounded-lg overflow-hidden block h-full"
              >
                <div className="aspect-auto h-full relative">
                  <Image
                    src={trendingPosts[0].featuredImage || DEFAULT_IMAGE}
                    alt={trendingPosts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0">
                    <div className="absolute bottom-0 w-full p-4 md:p-8 bg-[#00000080]">
                      <h3 className="text-white font-medium text-xl md:text-2xl">
                        {trendingPosts[0].title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Grid of smaller posts - right side */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4 h-full">
                {trendingPosts.slice(1, 5).map((post) => (
                  <Link
                    href={`/news/${post.slug}`}
                    key={post.id}
                    className="group relative rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={post.featuredImage || DEFAULT_IMAGE}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0">
                        <div className="absolute bottom-0 p-4 bg-[#00000080]">
                          <h3 className="text-white font-medium text-sm md:text-base">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Topic Listing */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-[#222222] hidden">
          {t.sections.allPosts.title}
        </h2>
        {blogPosts.map((post, index) => (
          <article key={post.id}>
            <div className="relative flex flex-col md:flex-row items-center mb-4 md:mb-12 group justify-between">
              <Link
                href={`/news/${post.slug}`}
                className="absolute inset-0 z-1"
              />
              <div className="pr-8 flex flex-col">
                <h2 className="text-2xl font-medium text-[#222222] mb-4 group-hover:text-[#B1873F] transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt || `${post.content.substring(0, 200)}...`}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href={`/news/${post.slug}`}
                  className="block relative rounded-xl overflow-hidden aspect-square md:h-44"
                >
                  <Image
                    src={post.featuredImage || DEFAULT_IMAGE}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="container mx-auto px-4 mb-12 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          {/* Previous page button */}
          <Link
            href={currentPage > 1 ? `/news?page=${currentPage - 1}` : "#"}
            className={`flex items-center justify-center ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-[#B1873F] cursor-pointer"
            }`}
            aria-label={t.pagination.previousPage}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Page numbers */}
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === "..." ? (
                <span className="w-10 h-10 flex items-center justify-center text-gray-600">
                  ...
                </span>
              ) : (
                <Link
                  href={`/news?page=${pageNumber}`}
                  className={`w-10 h-10 rounded flex items-center justify-center border ${
                    currentPage === pageNumber
                      ? "border-[#B1873F] text-[#B1873F]"
                      : "border-gray-300 bg-white text-gray-600"
                  } font-bold cursor-pointer`}
                  aria-label={`${t.pagination.page} ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              )}
            </React.Fragment>
          ))}

          {/* Next page button */}
          <Link
            href={
              currentPage < totalPages ? `/news?page=${currentPage + 1}` : "#"
            }
            className={`flex items-center justify-center ${
              currentPage >= totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-[#B1873F] cursor-pointer"
            }`}
            aria-label={t.pagination.nextPage}
          >
            <svg
              width="24"
              height="24"
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
          </Link>
        </div>
      </section>

      {/* 4. Newsletter */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            {t.cta.subheading}
          </p>
          <Link
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold hover:bg-[#c09857] transition-colors"
          >
            {t.cta.button}
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

async function NewsLoading() {
  const messages = await getMessages();
  const t = messages.news;

  return (
    <div className="">
      {/* Trending Topics Skeleton */}
      <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Featured post skeleton */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden block h-full">
              <div className="aspect-auto h-full relative bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Grid of smaller posts skeleton */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Post Listing Skeleton */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <article key={i}>
            <div className="relative flex flex-col md:flex-row items-center mb-4 md:mb-12 group justify-between">
              <div className="pr-8 flex flex-col w-full">
                <div className="h-8 bg-gray-200 animate-pulse mb-4 w-3/4"></div>
                <div className="h-20 bg-gray-200 animate-pulse mb-4"></div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination Skeleton */}
      <section className="container mx-auto px-4 mb-12 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            {t.cta.heading}
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            {t.cta.subheading}
          </p>
          <Link
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold hover:bg-[#c09857] transition-colors"
          >
            {t.cta.button}
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
