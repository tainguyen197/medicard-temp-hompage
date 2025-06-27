"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewsTableRow from "@/components/NewsTableRow";

interface News {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: Date | string;
  shortDescription: string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

interface NewsTableProps {
  news: News[];
}

export default function NewsTable({ news }: NewsTableProps) {
  const router = useRouter();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localNews, setLocalNews] = useState<News[]>(news);

  // Update local news when props change
  useEffect(() => {
    setLocalNews(news);
  }, [news]);

  const handleNewsDeleted = () => {
    router.refresh();
  };

  const handleStatusChange = async (newsId: string, newStatus: string) => {
    setUpdatingStatus(newsId);

    try {
      console.log(`Updating news ${newsId} to status ${newStatus}`);

      const response = await fetch(`/api/news/${newsId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ status: newStatus }),
        cache: "no-store",
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update the local state immediately
      setLocalNews((prev) =>
        prev.map((article) =>
          article.id === newsId ? { ...article, status: newStatus } : article
        )
      );

      toast.success("Status updated successfully");

      // Force a server refresh with cache invalidation
      router.refresh();

      // Force a hard navigation to the same page to clear cache completely
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 300);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        `Failed to update status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Client-side date formatting function
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <div className="shadow border-b border-gray-200 sm:rounded-lg">
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
                Short Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localNews.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No news articles found
                </td>
              </tr>
            ) : (
              localNews.map((article) => (
                <NewsTableRow
                  key={`${article.id}-${article.status}`}
                  news={article}
                  formatDate={formatDate}
                  onNewsDeleted={handleNewsDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
