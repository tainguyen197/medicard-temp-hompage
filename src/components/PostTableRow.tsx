"use client";

import Link from "next/link";
import { StarIcon } from "lucide-react";
import { ROUTES } from "@/lib/router";
import { useState } from "react";
import { toast } from "sonner";

interface News {
  id: string;
  title: string;
  slug: string;
  status: string;
  pin: boolean;
  featureImageId?: string | null;
  featureImage?: {
    id: string;
    url: string;
  } | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
}

interface NewsTableRowProps {
  news: News;
  formatDate: (date: Date | string) => string;
  onNewsDeleted?: () => void;
}

export default function PostTableRow({
  news,
  formatDate,
  onNewsDeleted,
}: NewsTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the news article "${news.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/news/${news.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete news article");
      }

      toast.success("News article deleted successfully");

      if (onNewsDeleted) {
        onNewsDeleted();
      }
    } catch (error) {
      console.error("Error deleting news article:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete news article"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr key={news.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center justify-center">
          {news.featureImage ? (
            <div className="h-14 w-14 rounded-md overflow-hidden">
              <img
                src={news.featureImage.url}
                alt={news.title}
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
          <div className="text-sm font-medium text-gray-900">{news.title}</div>
          <div className="text-sm text-gray-500">/news/{news.slug}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        Admin
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {news.category?.name || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            news.status === "PUBLISHED"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {news.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <Link
          href={`${ROUTES.ADMIN_NEWS}/${news.id}/status`}
          className={`inline-flex items-center px-2 py-1 rounded ${
            news?.pin
              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <StarIcon
            size={16}
            className={
              news?.pin ? "text-amber-500 fill-amber-500" : "text-gray-400"
            }
          />
          <span className="ml-1 text-xs">
            {news?.pin ? "Pinned" : "Not Pinned"}
          </span>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {formatDate(news.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
        <Link
          href={ROUTES.ADMIN_NEWS + `/${news.id}`}
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
