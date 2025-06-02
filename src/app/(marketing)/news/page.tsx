import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import prisma from "@/lib/prisma";
import { Post } from "@/types/post";

export const metadata: Metadata = {
  title: "Tin tức sức khoẻ | Healthcare Therapy Center",
  description:
    "Cập nhật những kiến thức hữu ích về sức khoẻ, phương pháp điều trị và lối sống lành mạnh từ Healthcare Therapy Center.",
};

// Default image fallback if no featured image
const DEFAULT_IMAGE = "/images/news/news-image-1.jpg";

export default async function BlogPage() {
  let blogPosts: Post[] = [];

  try {
    // Fetch posts directly from the database with Prisma
    console.log("Fetching posts from database...");

    // Build filter object (only show published posts for public page)
    const where = {
      status: "PUBLISHED",
    };

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
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
    blogPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    })) as Post[];

    console.log(`Found ${blogPosts.length} posts`);

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
              TIN TỨC
            </h1>
          </section>
        </AnimatedSection>

        {/* No posts message */}
        <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px] text-center py-20">
          <h2 className="text-2xl text-gray-600 mb-4">
            Hiện tại chưa có bài viết nào được xuất bản
          </h2>
          <p className="text-gray-500">
            Vui lòng quay lại sau để xem nội dung mới.
          </p>
        </section>
      </div>
    );
  }

  console.log("Rendering news page with posts");
  // Featured trending posts (first 5 posts)
  const trendingPosts = blogPosts.slice(0, 5);

  // Calculate total pages for pagination
  const totalPosts = await prisma.post.count({
    where: { status: "PUBLISHED" },
  });
  const postsPerPage = 20;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

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
            TIN TỨC
          </h1>
        </section>
      </AnimatedSection>

      {/* 3. Trending Topics */}
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

      {/* 4. Topic Listing */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-[#222222] hidden">
          Tất cả bài viết
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
      <section className="container mx-auto px-4 mb-0 flex justify-start max-w-[1040px]">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center hover:text-[#B1873F] cursor-pointer"
            aria-label="Previous page"
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
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-[#B1873F] text-[#B1873F] font-bold cursor-pointer"
            aria-label="Page 1"
          >
            1
          </button>

          {totalPages > 1 && (
            <>
              <button
                className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold cursor-pointer"
                aria-label="Page 2"
              >
                2
              </button>

              {totalPages > 3 && (
                <button
                  className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold cursor-pointer"
                  aria-label="More pages"
                >
                  ...
                </button>
              )}

              {totalPages > 2 && (
                <button
                  className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold cursor-pointer"
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </button>
              )}
            </>
          )}

          <button
            className="flex items-center justify-center hover:text-[#B1873F] cursor-pointer"
            aria-label="Next page"
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
          </button>
        </div>
      </section>

      {/* 4. Newsletter */}
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl px-4 md:px-16 text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <Link
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold hover:bg-[#c09857] transition-colors"
          >
            Đặt lịch trải nghiệm
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
