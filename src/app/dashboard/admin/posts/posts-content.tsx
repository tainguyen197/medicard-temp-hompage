import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import PostsTable from "@/components/PostsTable";
import { ROUTES } from "@/lib/router";

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
  categoryId?: string;
  search?: string;
  featured?: string;
};

// Server component
export default async function PostsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(ROUTES.AUTH_LOGIN);
  }

  const {
    page = "1",
    limit = "10",
    status,
    categoryId,
    search,
    featured,
  } = searchParams;

  // Build filter object
  const where: Prisma.PostWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (featured === "true") {
    where.featured = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categories = {
      some: {
        categoryId,
      },
    };
  }

  // Get total featured posts for validation
  const totalFeaturedPosts = await prisma.post.count({
    where: { featured: true },
  });

  // Get posts with pagination
  const total = await prisma.post.count({ where });
  const totalPages = Math.ceil(total / Number(limit));

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
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

  // Get categories for filter dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* Featured Posts Count */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-amber-800 flex items-center">
            <StarIcon className="mr-2" size={18} />
            Featured Posts: {totalFeaturedPosts}/5
          </h2>
          <p className="text-sm text-amber-700 mt-1">
            Maximum of 5 posts can be featured at a time. Featured posts appear
            in the highlighted section on the news page.
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(Number(page) - 1) * Number(limit) + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(Number(page) * Number(limit), total)}
            </span>{" "}
            of <span className="font-medium">{total}</span> results
          </div>

          <div className="flex gap-3">
            {Number(page) > 1 && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_POSTS,
                  query: {
                    page: Number(page) - 1,
                    limit,
                    ...(status && { status }),
                    ...(categoryId && { categoryId }),
                    ...(search && { search }),
                    ...(featured && { featured }),
                  },
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </Link>
            )}

            {Number(page) < totalPages && (
              <Link
                href={{
                  pathname: ROUTES.ADMIN_POSTS,
                  query: {
                    page: Number(page) + 1,
                    limit,
                    ...(status && { status }),
                    ...(categoryId && { categoryId }),
                    ...(search && { search }),
                    ...(featured && { featured }),
                  },
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                Next
                <ChevronRightIcon size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
