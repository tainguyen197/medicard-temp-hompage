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
import { Post } from "@/types/post";
import { Prisma } from "@prisma/client";

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
  categoryId?: string;
  search?: string;
  featured?: string;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const {
    page = "1",
    limit = "10",
    status,
    categoryId,
    search,
    featured,
  } = await searchParams;

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
      { title: { contains: search } },
      { content: { contains: search } },
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>

        <Link
          href="/dashboard/admin/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          New Post
        </Link>
      </div>

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

        <Link
          href={{
            pathname: "/dashboard/admin/posts",
            query: { featured: "true" },
          }}
          className={`px-3 py-1.5 rounded text-sm ${
            featured === "true"
              ? "bg-amber-500 text-white"
              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
          }`}
        >
          View Featured
        </Link>
      </div>

      {/* Filters */}
      <form
        action="/dashboard/admin/posts"
        method="GET"
        className="bg-white p-4 rounded-md shadow mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search posts..."
                defaultValue={search || ""}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
              <SearchIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              name="status"
              defaultValue={status || ""}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>

            <select
              name="categoryId"
              defaultValue={categoryId || ""}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FilterIcon size={16} />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Hidden fields to preserve pagination when filtering */}
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={limit} />
        {featured && <input type="hidden" name="featured" value={featured} />}
      </form>

      {/* Posts Table */}
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No posts found
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="flex items-center justify-center">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-14 w-14 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        /blog/{post.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
                    {post.author?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
                    {post.categories?.map((pc) => pc.category.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : post.status === "DRAFT"
                          ? "bg-gray-100 text-gray-800"
                          : post.status === "PENDING_REVIEW"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {post.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <Link
                      href={`/dashboard/admin/posts/${post.id}/toggle-featured`}
                      className={`inline-flex items-center px-2 py-1 rounded ${
                        post?.featured
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      <StarIcon
                        size={16}
                        className={
                          post?.featured
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-400"
                        }
                      />
                      <span className="ml-1 text-xs">
                        {post?.featured ? "Featured" : "Not Featured"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
                    {post.publishedAt
                      ? formatDate(post.publishedAt)
                      : formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                    <Link
                      href={`/dashboard/admin/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/admin/posts/${post.id}/preview`}
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/dashboard/admin/posts/${post.id}/delete`}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
                  pathname: "/dashboard/admin/posts",
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
                  pathname: "/dashboard/admin/posts",
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
    </div>
  );
}
