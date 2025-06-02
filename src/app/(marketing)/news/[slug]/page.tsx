import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Post } from "@/types/post";

type Params = Promise<{ slug: string }>;

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
  const { slug } = await params;

  try {
    // Fetch post directly using Prisma
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return {
        title: "Bài viết không tìm thấy | Healthcare Therapy Center",
        description: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      };
    }

    return {
      title: `${post.title} | Healthcare Therapy Center`,
      description: post.excerpt || `${post.content.substring(0, 200)}...`,
    };
  } catch (error) {
    return {
      title: "Bài viết không tìm thấy | Healthcare Therapy Center",
      description: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

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
      relatedPosts = relatedPostsData.map((relatedPost) => ({
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

  return (
    <div>
      <div className="pt-16 md:pt-24">
        {/* Hero Section with Cover Image */}
        <section className="relative w-full h-[40vh] md:h-[70vh]">
          <Image
            src="/images/news/news-cover.jpg"
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
            <span className="text-sm md:text-base text-gray-900">
              {post.title}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
          <h1 className="text-2xl md:text-[42px] text-[#222222] font-semibold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Post metadata */}

          {post.excerpt && (
            <h2 className="text-md md:text-[20px] text-black font-semibold mb-10">
              {post.excerpt}
            </h2>
          )}
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 mb-16 max-w-7xl">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-md md:text-[16px] text-black"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            <hr className="my-12 border-gray-300" />
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto md:px-20 md:py-14 bg-[#FEF6EA] rounded-4xl max-w-7xl">
            <div className="mx-auto px-4">
              <h2 className="text-2xl font-semibold text-[#222222] mb-10">
                Có thể bạn quan tâm
              </h2>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="rounded-lg overflow-hidden">
                      <div className="block relative rounded-xl overflow-hidden aspect-square md:h-44">
                        <Image
                          src={relatedPost.featuredImage || DEFAULT_IMAGE}
                          alt={relatedPost.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/4 my-auto">
                      <h3 className="text-md md:text-[20px] font-medium text-[#222222] hover:text-[#B1873F] transition-colors">
                        <Link href={`/news/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-md md:text-lg px-16 text-black mb-10 max-w-3xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
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
