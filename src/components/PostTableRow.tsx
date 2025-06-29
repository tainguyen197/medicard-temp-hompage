"use client";

import Link from "next/link";
import { StarIcon } from "lucide-react";
import { ROUTES } from "@/lib/router";
import { useState } from "react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  author?: {
    id: string;
    name?: string | null;
    email: string;
  };
  categories?: {
    category: {
      id: string;
      name: string;
      slug: string;
      description?: string | null;
    };
  }[];
}

interface PostTableRowProps {
  post: Post;
  formatDate: (date: Date | string) => string;
  onPostDeleted?: () => void;
}

export default function PostTableRow({
  post,
  formatDate,
  onPostDeleted,
}: PostTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete post");
      }

      toast.success("Post deleted successfully");

      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr key={post.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center justify-center">
          {post.featuredImage ? (
            <div className="h-14 w-14 rounded-md overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div>
          <div className="text-sm font-medium text-gray-900">{post.title}</div>
          <div className="text-sm text-gray-500">/news/{post.slug}</div>
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
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {post.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <Link
          href={`${ROUTES.ADMIN_NEWS}/${post.id}/toggle-featured`}
          className={`inline-flex items-center px-2 py-1 rounded ${
            post?.featured
              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <StarIcon
            size={16}
            className={
              post?.featured ? "text-amber-500 fill-amber-500" : "text-gray-400"
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
          href={ROUTES.ADMIN_NEWS + `/${post.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-900 cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </td>
    </tr>
  );
}
