"use client";

import Link from "next/link";
import { StarIcon } from "lucide-react";
import DeletePostModal from "./DeletePostModal";

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
  return (
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
          <div className="text-sm font-medium text-gray-900">{post.title}</div>
          <div className="text-sm text-gray-500">/blog/{post.slug}</div>
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
          href={`/posts/${post.id}/toggle-featured`}
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
          href={`/posts/${post.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </Link>
        <Link
          href={`/posts/${post.id}/preview`}
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          Preview
        </Link>
        <DeletePostModal
          post={{
            id: post.id,
            title: post.title,
            status: post.status,
            author: post.author ? { name: post.author.name } : undefined,
          }}
          onPostDeleted={onPostDeleted}
        >
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </DeletePostModal>
      </td>
    </tr>
  );
}
